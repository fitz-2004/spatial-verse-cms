import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

const solutionSlugs = [
  '/coohomcloud/solutions/aiagent',
  '/coohomcloud/solutions/aigc',
  '/coohomcloud/solutions/roboticsimulation',
  '/coohomcloud/solutions/visualizedproductpromotion',
  '/coohomcloud/solutions/xr'
];

const importedFields = [
  'title',
  'englishTitle',
  'sequence',
  'accent',
  'heroTitle',
  'heroLead',
  'videoDescription',
  'challengeTitle',
  'challenges',
  'advantageTitle',
  'advantages',
  'serviceTitle',
  'services',
  'ctaTitle',
  'seoTitle',
  'seoDescription'
];

const stringField = (label, options = {}) => ({
  type: 'string',
  label,
  ...options
});

const textField = (label, options = {}) => stringField(label, {
  textarea: true,
  ...options
});

export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Solution Page'
  },
  fields: {
    add: {
      englishTitle: {
        type: 'string',
        label: 'English Title',
        help: 'Uppercase English label shown in the hero (e.g. "AI AGENT UNDERSTANDING")',
        required: true
      },
      sequence: {
        type: 'integer',
        label: 'Visual Sequence',
        help: 'Position number (1-5) displayed in the visual engine core',
        def: 1,
        min: 1,
        max: 5
      },
      accent: {
        type: 'string',
        label: 'Accent Color (hex)',
        help: 'Primary accent color, e.g. #29f5d1 for AI Agent, #9d7cff for AIGC',
        def: '#29f5d1'
      },
      heroTitle: {
        type: 'area',
        label: 'Hero Subtitle',
        help: 'Accent-colored subtitle beneath the page title (click to edit in context)',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      heroLead: {
        type: 'area',
        label: 'Hero Description',
        help: 'Hero lead paragraph (click to edit in context)',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      media: {
        type: 'attachment',
        label: 'Hero Media (video or image)',
        help: 'Auto-playing video or image displayed in the media section. MP4/MOV renders as video, others as image.',
        fileGroup: 'videos'
      },
      videoDescription: {
        type: 'area',
        label: 'Media Section Description',
        help: 'Text description beside the media frame (click to edit in context)',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      challengeTitle: {
        type: 'area',
        label: 'Challenges Section Title',
        help: 'Click to edit in context',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      challenges: {
        type: 'array',
        label: 'Challenges',
        titleField: 'title',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Title',
              required: true
            },
            text: {
              type: 'string',
              label: 'Description',
              textarea: true,
              required: true
            }
          }
        }
      },
      advantageTitle: {
        type: 'area',
        label: 'Advantages Section Title',
        help: 'Click to edit in context',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      advantages: {
        type: 'array',
        label: 'Advantages',
        titleField: 'title',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Title',
              required: true
            },
            text: {
              type: 'string',
              label: 'Description',
              textarea: true,
              required: true
            }
          }
        }
      },
      serviceTitle: {
        type: 'area',
        label: 'Services Section Title',
        help: 'Click to edit in context',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      services: {
        type: 'array',
        label: 'Services',
        titleField: 'title',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Title',
              required: true
            },
            text: {
              type: 'string',
              label: 'Description',
              textarea: true,
              required: true
            }
          }
        }
      },
      ctaTitle: {
        type: 'area',
        label: 'CTA Title',
        help: 'Large heading above the contact button (click to edit in context)',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      seoTitle: stringField('SEO 标题', {
        max: 60,
        help: '建议不超过 60 个字符；留空时使用页面 Title。'
      }),
      seoDescription: textField('SEO 描述', {
        max: 160,
        help: '建议不超过 160 个字符。'
      }),
      seoCanonicalUrl: stringField('Canonical URL', {
        help: '通常留空，由前端依据正式域名和页面 URL 自动生成。'
      }),
      seoRobots: {
        type: 'select',
        label: '搜索引擎索引策略',
        def: 'index-follow',
        choices: [
          { label: '允许索引和跟踪链接', value: 'index-follow' },
          { label: '禁止索引，允许跟踪链接', value: 'noindex-follow' },
          { label: '允许索引，禁止跟踪链接', value: 'index-nofollow' },
          { label: '禁止索引和跟踪链接', value: 'noindex-nofollow' }
        ]
      },
      seoOgTitle: stringField('社交分享标题', {
        max: 60,
        help: '留空时使用 SEO 标题。'
      }),
      seoOgDescription: textField('社交分享描述', {
        max: 200,
        help: '留空时使用 SEO 描述。'
      }),
      seoOgImage: {
        type: 'attachment',
        label: '社交分享图片',
        fileGroup: 'images',
        help: '建议 1200×630。留空时不输出 og:image。'
      },
      seoTwitterCard: {
        type: 'select',
        label: 'Twitter Card',
        def: 'summary_large_image',
        choices: [
          { label: '大图卡片', value: 'summary_large_image' },
          { label: '摘要卡片', value: 'summary' }
        ]
      }
    },
    group: {
      hero: {
        label: 'Hero',
        fields: [ 'englishTitle', 'sequence', 'accent', 'heroTitle', 'heroLead' ]
      },
      media: {
        label: 'Media',
        fields: [ 'media', 'videoDescription' ]
      },
      challenges: {
        label: 'Challenges',
        fields: [ 'challengeTitle', 'challenges' ]
      },
      advantages: {
        label: 'Advantages',
        fields: [ 'advantageTitle', 'advantages' ]
      },
      services: {
        label: 'Services',
        fields: [ 'serviceTitle', 'services' ]
      },
      cta: {
        label: 'CTA',
        fields: [ 'ctaTitle' ]
      },
      seo: {
        label: 'SEO',
        fields: [
          'seoTitle',
          'seoDescription',
          'seoCanonicalUrl',
          'seoRobots',
          'seoOgTitle',
          'seoOgDescription',
          'seoOgImage',
          'seoTwitterCard'
        ]
      }
    }
  },
  methods(self) {
    return {
      readSolutionDrafts(sourcePath) {
        const database = new Database(sourcePath, {
          readonly: true,
          fileMustExist: true
        });
        try {
          const rows = database.prepare(`
            SELECT data
            FROM aposDocs
            WHERE json_extract(data, '$.type') = 'solution-page'
              AND json_extract(data, '$.aposLocale') = 'zh:draft'
          `).all();
          const sourcePages = rows.map(({ data }) => JSON.parse(data));
          const bySlug = new Map(sourcePages.map((page) => [ page.slug, page ]));
          const missing = solutionSlugs.filter((slug) => !bySlug.has(slug));
          if (sourcePages.length !== solutionSlugs.length || missing.length) {
            throw new Error(
              `Solution 源数据库必须恰好包含 5 个 zh:draft 页面。`
              + (missing.length ? ` 缺少: ${missing.join(', ')}` : '')
            );
          }
          return solutionSlugs.map((slug) => bySlug.get(slug));
        } finally {
          database.close();
        }
      },
      async importSolutionMedia(req, currentPage, sourcePage) {
        const name = sourcePage.media?.name;
        const extension = sourcePage.media?.extension;
        if (!name || !extension) return null;
        if (
          currentPage.media?._id
          && currentPage.media.name === name
          && currentPage.media.extension === extension
        ) {
          return currentPage.media;
        }
        const filename = `${name}.${extension}`;
        const mediaPath = path.resolve(
          self.apos.rootDir,
          '../frontend/public/media/solutions',
          filename
        );
        if (!fs.existsSync(mediaPath)) {
          throw new Error(`Solution 媒体文件不存在: ${mediaPath}`);
        }
        return self.apos.attachment.insert(req, {
          name: filename,
          path: mediaPath
        });
      },
      async importDrafts() {
        const configuredPath = process.env.SOLUTION_SOURCE_DB || 'data/lbh-solutions.sqlite';
        const sourcePath = path.resolve(self.apos.rootDir, configuredPath);
        if (!fs.existsSync(sourcePath)) {
          throw new Error(
            `找不到 Solution 源数据库: ${sourcePath}\n`
            + '请设置 SOLUTION_SOURCE_DB 为楼博涵 SQLite 数据库路径。'
          );
        }
        const sourcePages = self.readSolutionDrafts(sourcePath);
        const req = self.apos.task.getReq({
          locale: 'zh',
          mode: 'draft'
        });
        const imported = [];

        for (const sourcePage of sourcePages) {
          const currentPage = await self.apos.page.find(req, {
            slug: sourcePage.slug,
            type: 'solution-page'
          }).toObject();
          if (!currentPage) {
            throw new Error(`找不到我方 zh:draft Solution 占位页: ${sourcePage.slug}`);
          }
          const sourceFields = Object.fromEntries(
            importedFields
              .filter((field) => sourcePage[field] !== undefined)
              .map((field) => [ field, structuredClone(sourcePage[field]) ])
          );
          const media = await self.importSolutionMedia(req, currentPage, sourcePage);
          const updated = await self.apos.page.update(req, {
            ...currentPage,
            ...sourceFields,
            ...(media ? { media } : {}),
            seoCanonicalUrl: currentPage.seoCanonicalUrl || '',
            seoRobots: currentPage.seoRobots || 'index-follow',
            seoOgTitle: currentPage.seoOgTitle || '',
            seoOgDescription: currentPage.seoOgDescription || '',
            seoOgImage: currentPage.seoOgImage || null,
            seoTwitterCard: currentPage.seoTwitterCard || 'summary_large_image'
          });
          imported.push(updated.slug);
          console.log(`已导入 Solution 草稿: ${updated.slug}`);
        }

        console.log(`Solution 草稿导入完成: ${imported.length} 页。未发布，未修改其他 Page Type。`);
      }
    };
  },
  tasks(self) {
    return {
      'import-drafts': {
        usage: 'Usage: SOLUTION_SOURCE_DB=data/lbh-solutions.sqlite node app solution-page:import-drafts\n\n仅从楼博涵数据库读取 5 个 solution-page zh:draft，按固定 slug 更新我方现有占位页并导入对应媒体。不导入 published/global/archive/用户，不新建页面，不改变页面树。',
        task: self.importDrafts
      }
    };
  }
};
