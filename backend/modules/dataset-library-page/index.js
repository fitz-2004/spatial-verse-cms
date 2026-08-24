import fs from 'node:fs';
import path from 'node:path';

import { datasetPageSeed, datasetSeed } from './lib/datasetSeed.js';

const CATEGORY_CHOICES = [
  { label: '模型数据', value: 'model' },
  { label: '场景数据', value: 'scene' },
  { label: '图像数据', value: 'image' }
];

const SEO_FIELDS = {
  seoTitle: { type: 'string', label: 'SEO 标题（留空使用页面标题）' },
  seoDescription: { type: 'string', label: 'SEO 描述', textarea: true },
  seoKeywords: { type: 'string', label: 'SEO 关键词', help: '逗号分隔，例如：样例数据集, 模型数据, 群核。' },
  seoCanonicalUrl: { type: 'string', label: 'Canonical URL', help: '通常留空，由前端根据正式域名和页面路径自动生成。' },
  seoRobots: {
    type: 'select', label: '搜索引擎索引策略', def: 'index-follow', choices: [
      { label: '允许索引和跟踪链接', value: 'index-follow' },
      { label: '禁止索引，允许跟踪链接', value: 'noindex-follow' },
      { label: '允许索引，禁止跟踪链接', value: 'index-nofollow' },
      { label: '禁止索引和跟踪链接', value: 'noindex-nofollow' }
    ]
  },
  seoOgTitle: { type: 'string', label: '社交分享标题', max: 60 },
  seoOgDescription: { type: 'string', label: '社交分享描述', textarea: true, max: 200 },
  seoOgImage: { type: 'attachment', label: '社交分享图片', fileGroup: 'images', help: '建议 1200×630。' },
  seoTwitterCard: {
    type: 'select', label: 'Twitter Card', def: 'summary_large_image', choices: [
      { label: '大图卡片', value: 'summary_large_image' },
      { label: '摘要卡片', value: 'summary' }
    ]
  }
};

function documentId(document) {
  return document.aposDocId || document._id?.split(':')[0];
}

export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: '样例数据集页面',
    pluralLabel: '样例数据集页面'
  },
  fields: {
    add: {
      introEyebrow: { type: 'string', label: '页首索引标签' },
      introTitle: { type: 'string', label: '页首标题', required: true },
      introLead: { type: 'string', label: '页首引导文案', textarea: true },
      libraryEyebrow: { type: 'string', label: '资源库索引标签' },
      libraryTitle: { type: 'string', label: '资源库标题', required: true },
      libraryLead: { type: 'string', label: '资源库说明', textarea: true },
      searchPlaceholder: { type: 'string', label: '搜索框提示文字' },
      emptyTitle: { type: 'string', label: '空结果标题' },
      emptyMessage: { type: 'string', label: '空结果说明', textarea: true },
      _datasets: {
        type: 'relationship', label: '展示的数据集', withType: 'dataset-item', max: 100,
        help: '关联需要展示的资源；此处的顺序即资源库展示顺序。新建数据集后请在这里勾选。'
      },
      categoryFilters: {
        type: 'array', label: '分类筛选项', titleField: 'label',
        help: '保留“全部数据”及三种预置分类。数据分类值必须与 Dataset Item 的分类一致。',
        fields: {
          add: {
            id: { type: 'select', label: '分类值', choices: [ { label: '全部数据', value: 'all' }, ...CATEGORY_CHOICES ], required: true },
            label: { type: 'string', label: '显示名称', required: true }
          }
        }
      },
      ...SEO_FIELDS
    },
    group: {
      content: {
        label: '页面内容', fields: [
          'title', 'introEyebrow', 'introTitle', 'introLead',
          'libraryEyebrow', 'libraryTitle', 'libraryLead',
          'searchPlaceholder', 'emptyTitle', 'emptyMessage', 'categoryFilters', '_datasets'
        ]
      },
      seo: { label: 'SEO', fields: Object.keys(SEO_FIELDS) }
    }
  },
  methods(self) {
    return {
      async insertAttachment(req, filename) {
        const sourcePath = path.resolve(self.apos.rootDir, '../frontend/public/media/datasets', filename);
        if (!fs.existsSync(sourcePath)) throw new Error(`数据集媒体文件不存在: ${sourcePath}`);
        return self.apos.attachment.insert(req, { name: filename, path: sourcePath });
      },
      async mediaForSeed(req, current, seed) {
        const cover = seed.coverFile
          ? current?.cover?.name === seed.coverFile ? current.cover : await self.insertAttachment(req, seed.coverFile)
          : null;
        const gallery = await Promise.all((seed.galleryFiles || []).map(async (filename, index) => {
          const currentImage = current?.gallery?.[index]?.image;
          const image = currentImage?.name === filename ? currentImage : await self.insertAttachment(req, filename);
          return { image, alt: `${seed.title}预览图 ${index + 1}` };
        }));
        return { cover, gallery };
      },
      async importDrafts() {
        const req = self.apos.task.getReq({ locale: 'zh', mode: 'draft' });
        const pageManager = self.apos.modules['@apostrophecms/page'];
        const datasetManager = self.apos.modules['dataset-item'];
        const home = await pageManager.find(req, { level: 0 }).toObject();
        if (!home) throw new Error('目标数据库缺少 zh:draft Home，无法建立样例数据集页面。');

        let page = await pageManager.find(req, { type: 'dataset-library-page', slug: '/coohomcloud/corecompetency/data' }).toObject();
        if (!page) {
          page = await pageManager.insert(req, home._id, 'lastChild', {
            type: 'dataset-library-page', title: datasetPageSeed.title,
            slug: '/coohomcloud/corecompetency/data', visibility: 'public'
          });
        }

        const datasetIds = [];
        for (const [index, seed] of datasetSeed.entries()) {
          const current = await datasetManager.find(req, { sourceKey: seed.sourceKey }).toObject();
          const media = await self.mediaForSeed(req, current, seed);
          const fields = {
            ...seed,
            type: 'dataset-item', slug: seed.sourceKey, rank: index + 1, visibility: 'public',
            ...(media.cover ? { cover: media.cover } : {}), gallery: media.gallery
          };
          delete fields.coverFile;
          delete fields.galleryFiles;
          const saved = current
            ? await datasetManager.update(req, { ...current, ...fields })
            : await datasetManager.insert(req, fields);
          const id = documentId(saved);
          if (!id) throw new Error(`导入数据集后无法取得 aposDocId: ${seed.sourceKey}`);
          datasetIds.push(id);
        }

        page = await pageManager.update(req, {
          ...page, ...datasetPageSeed,
          type: 'dataset-library-page', slug: '/coohomcloud/corecompetency/data',
          visibility: page.visibility || 'public',
          categoryFilters: [
            { id: 'all', label: '全部数据' },
            { id: 'model', label: '模型数据' },
            { id: 'scene', label: '场景数据' },
            { id: 'image', label: '图像数据' }
          ],
          _datasets: datasetIds
        });

        console.log('已导入 Dataset 中文草稿：');
        console.log(`- 页面：${page.slug}`);
        console.log(`- Dataset Item：${datasetIds.length}`);
        console.log('- Published：0（本任务不会发布）');
      }
    };
  },
  tasks(self) {
    return {
      'import-drafts': {
        usage: 'node app dataset-library-page:import-drafts\n\n导入样例数据集页面与 15 个 dataset-item 中文草稿，复用稳定 sourceKey 更新已有数据；不导入 Global、archive 或其他页面，也不会发布。',
        task: self.importDrafts
      }
    };
  }
};
