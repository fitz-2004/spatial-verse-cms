import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  datasetItems,
  datasetPage
} from './lib/datasetData.js';

const IMAGE_EXTENSIONS = new Set([
  'gif',
  'jpg',
  'png',
  'webp'
]);

function mediaSlug(url) {
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 16);
  return `dataset-media-${hash}`;
}

function extensionFor(url, contentType) {
  const pathnameExtension = path.extname(new URL(url).pathname)
    .slice(1)
    .toLowerCase()
    .replace('jpeg', 'jpg');
  if (IMAGE_EXTENSIONS.has(pathnameExtension)) {
    return pathnameExtension;
  }
  const contentTypeExtension = contentType
    ?.split(';')[0]
    .split('/')[1]
    ?.toLowerCase()
    .replace('jpeg', 'jpg');
  if (IMAGE_EXTENSIONS.has(contentTypeExtension)) {
    return contentTypeExtension;
  }
  throw new Error(`无法确定 Dataset 图片格式: ${url}`);
}

function docId(doc) {
  return doc?.aposDocId || doc?._id?.split(':')[0];
}

export default {
  options: {
    alias: 'datasetImport'
  },
  methods(self) {
    return {
      async importImage(req, url, title) {
        const imageManager = self.apos.modules['@apostrophecms/image'];
        const slug = mediaSlug(url);
        const existing = await imageManager.find(req, {
          slug: `image-${slug}`
        }).toObject();
        if (existing) {
          return existing;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`下载 Dataset 图片失败 (${response.status}): ${url}`);
        }

        const extension = extensionFor(url, response.headers.get('content-type'));
        const filename = `${slug}.${extension}`;
        const temporaryPath = path.join(os.tmpdir(), filename);
        await fs.writeFile(temporaryPath, Buffer.from(await response.arrayBuffer()));

        try {
          const attachment = await self.apos.attachment.insert(req, {
            name: filename,
            path: temporaryPath
          });
          return imageManager.insert(req, {
            ...imageManager.newInstance(),
            type: '@apostrophecms/image',
            title,
            slug,
            alt: title,
            attachment,
            visibility: 'public'
          });
        } finally {
          try {
            await fs.rm(temporaryPath, { force: true });
          } catch (error) {
            if (error?.code !== 'EBUSY') {
              throw error;
            }
            console.warn(`临时图片仍被占用，将由系统清理: ${temporaryPath}`);
          }
        }
      },
      async previewArea(req, image) {
        if (!image?._id) {
          return {
            metaType: 'area',
            _id: self.apos.util.generateId(),
            items: []
          };
        }
        const widgetManager = self.apos.modules['@apostrophecms/image-widget'];
        // The relationship converter only resolves ids from `{ _id }` objects;
        // bare strings are treated as titles and silently dropped, which leaves
        // the widget without an image.
        const widget = await widgetManager.sanitize(req, {
          _image: [ { _id: image._id } ]
        }, {});
        if (!widget._image?.length) {
          throw new Error(`预览图关系写入失败: ${image._id}`);
        }
        return {
          metaType: 'area',
          _id: self.apos.util.generateId(),
          items: [ widget ]
        };
      },
      async importDrafts() {
        if (datasetItems.length !== 15) {
          throw new Error(`Dataset 源数据数量异常: ${datasetItems.length}/15`);
        }

        const req = self.apos.task.getReq({
          locale: 'zh',
          mode: 'draft'
        });
        const pageManager = self.apos.modules['@apostrophecms/page'];
        const itemManager = self.apos.modules['dataset-item'];
        const home = await pageManager.find(req, { level: 0 }).toObject();
        if (!home) {
          throw new Error('目标数据库缺少 zh:draft Home，无法建立 Dataset Library 页面。');
        }

        const importedItemIds = [];
        for (const source of datasetItems) {
          const previewImage = await self.importImage(
            req,
            source.previewUrl,
            `${source.title}预览图`
          );
          const galleryImages = [];
          for (let index = 0; index < source.galleryUrls.length; index += 1) {
            galleryImages.push(await self.importImage(
              req,
              source.galleryUrls[index],
              `${source.title}图库 ${index + 1}`
            ));
          }

          const fields = {
            type: 'dataset-item',
            title: source.title,
            slug: source.id,
            category: source.category,
            categoryLabel: source.categoryLabel,
            summary: source.summary,
            description: source.description,
            formats: structuredClone(source.formats),
            tags: structuredClone(source.tags),
            preview: await self.previewArea(req, previewImage),
            _gallery: galleryImages.map(docId).filter(Boolean),
            downloads: structuredClone(source.downloads),
            visibility: 'public'
          };
          const existing = await itemManager.find(req, {
            slug: source.id
          }).toObject();
          const imported = existing
            ? await itemManager.update(req, {
              ...existing,
              ...fields
            })
            : await itemManager.insert(req, {
              ...itemManager.newInstance(),
              ...fields
            });
          const importedId = docId(imported);
          if (!importedId) {
            throw new Error(`导入 Dataset Item 后无法取得 aposDocId: ${source.id}`);
          }
          importedItemIds.push(importedId);
          console.log(`已导入 Dataset Item 草稿: ${source.id}`);
        }

        let page = await pageManager.find(req, {
          type: datasetPage.type,
          slug: datasetPage.slug
        }).toObject();
        if (!page) {
          page = await pageManager.insert(req, home._id, 'lastChild', {
            type: datasetPage.type,
            title: datasetPage.title,
            slug: datasetPage.slug,
            visibility: datasetPage.visibility
          });
        }
        await pageManager.update(req, {
          ...page,
          ...structuredClone(datasetPage),
          _items: importedItemIds
        });

        console.log('Dataset 中文草稿导入完成：');
        console.log('- 页面：1');
        console.log(`- Dataset Item：${importedItemIds.length}`);
        console.log('- Published：0（本任务不会发布）');
        console.log('- 下载资源：仅保存外部 URL，未复制到 uploads');
      },
      async verifyDrafts() {
        const req = self.apos.task.getReq({
          locale: 'zh',
          mode: 'draft'
        });
        const page = await self.apos.page.find(req, {
          slug: datasetPage.slug
        }).toObject();
        if (!page) {
          throw new Error(`未找到 Dataset Library 草稿页面: ${datasetPage.slug}`);
        }
        const items = page._items || [];
        const previewUrl = (item) => item.preview?.items?.[0]?._image?.[0]
          ?.attachment?._urls?.original;
        const withPreview = items.filter(previewUrl);
        const withGallery = items.filter((item) => item._gallery?.length);
        console.log(`- 页面关联 dataset-item：${items.length}`);
        console.log(`- 可解析预览图：${withPreview.length}`);
        console.log(`- 含图库的数据集：${withGallery.length}`);
        for (const item of items) {
          console.log([
            item.slug,
            previewUrl(item) || '缺少预览图',
            `图库 ${item._gallery?.length || 0} 张`,
            `下载 ${item.downloads?.length || 0} 项`
          ].join(' | '));
        }
      }
    };
  },
  tasks(self) {
    return {
      'verify-drafts': {
        usage: 'node app dataset-import:verify-drafts\n\n只读检查：Dataset Library 页面在 zh:draft 下能否加载 15 个 dataset-item，以及每条数据的预览图/图库媒体是否可解析出 uploads URL。',
        task: self.verifyDrafts
      },
      'import-drafts': {
        usage: 'node app dataset-import:import-drafts\n\n幂等导入 Dataset Library 页面、15 个 dataset-item 及其预览/图库图片到 zh:draft；不发布、不清库、不修改其他业务域。外部数据下载 URL 仅作为字段保存。',
        task: self.importDrafts
      }
    };
  }
};
