import fs from 'node:fs';
import path from 'node:path';

import { buildHomeAreas } from './lib/homeAreaMigration.js';
import { homeSeed } from './lib/homeSeed.js';

const stringField = (label, options = {}) => ({
  type: 'string',
  label,
  ...options
});

const textField = (label, options = {}) => stringField(label, {
  textarea: true,
  ...options
});

const singletonArea = (label, widgetType) => ({
  type: 'area',
  label,
  max: 1,
  options: {
    max: 1,
    widgets: {
      [widgetType]: {}
    }
  },
  def: [ widgetType ],
  help: '固定位置、固定类型、最多一个实例。用于 Apostrophe 页面原位编辑，不用于自由搭建或重排首页。'
});

export default {
  options: {
    label: '首页'
  },
  fields: {
    add: {
      seoTitle: stringField('SEO 标题', {
        max: 60,
        help: '建议不超过 60 个字符；留空时使用页面 Title。'
      }),
      seoDescription: textField('SEO 描述', {
        max: 160,
        help: '建议不超过 160 个字符。'
      }),
      seoCanonicalUrl: stringField('Canonical URL', {
        help: '通常留空，由前端依据正式域名和页面 URL 自动生成；仅在需要覆盖时填写完整 URL。'
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
      },
      homeBrandArea: singletonArea('品牌开屏', 'home-brand'),
      homeHeroArea: singletonArea('Hero', 'home-hero'),
      homeSolutionsArea: singletonArea('解决方案任务链', 'home-solutions'),
      homeCapabilitiesArea: singletonArea('核心能力', 'home-capabilities'),
      homeWhyArea: singletonArea('学术与技术支持', 'home-why'),
      homeSupportArea: singletonArea('支持模式', 'home-support')
    },
    group: {
      basics: {
        label: '基础与 SEO',
        fields: [
          'title',
          'seoTitle',
          'seoDescription',
          'seoCanonicalUrl',
          'seoRobots',
          'seoOgTitle',
          'seoOgDescription',
          'seoOgImage',
          'seoTwitterCard'
        ]
      },
      content: {
        label: '固定原位编辑区块',
        fields: [
          'homeBrandArea',
          'homeHeroArea',
          'homeSolutionsArea',
          'homeCapabilitiesArea',
          'homeWhyArea',
          'homeSupportArea'
        ]
      }
    }
  },
  methods(self) {
    return {
      async cleanupEmptyStarterAreas() {
        const homes = await self.apos.doc.db.find({
          type: '@apostrophecms/home-page'
        }).toArray();
        let cleaned = 0;
        for (const home of homes) {
          const mainItems = home.main?.items || [];
          const objectItems = home.objectField?.content?.items || [];
          if (mainItems.length || objectItems.length) {
            console.warn(`跳过非空 Starter Area: ${home._id}`);
            continue;
          }
          if (!home.main && !home.objectField) continue;
          await self.apos.doc.db.updateOne({
            _id: home._id
          }, {
            $unset: {
              main: 1,
              objectField: 1
            }
          });
          cleaned += 1;
        }
        return cleaned;
      },
      async importSeedVideo(req, filename) {
        const sourcePath = path.resolve(
          self.apos.rootDir,
          '../frontend/public/media/home',
          filename
        );
        if (!fs.existsSync(sourcePath)) {
          throw new Error(`首页媒体不存在: ${sourcePath}`);
        }
        return self.apos.attachment.insert(req, {
          name: filename,
          path: sourcePath
        });
      },
      async seedDraft() {
        const req = self.apos.task.getReq({
          locale: 'zh',
          mode: 'draft'
        });
        const home = await self.apos.page.find(req, {
          level: 0
        }).toObject();
        if (!home) {
          throw new Error('找不到 zh:draft Home 页面。');
        }
        if (home.type !== '@apostrophecms/home-page') {
          throw new Error(`Home Page Type 不正确: ${home.type}`);
        }

        const solutionsWidget = home.homeSolutionsArea?.items?.find(
          (item) => [ 'home-solutions', 'home-solutions-widget' ].includes(item.type)
        );
        const capabilitiesWidget = home.homeCapabilitiesArea?.items?.find(
          (item) => [ 'home-capabilities', 'home-capabilities-widget' ].includes(item.type)
        );
        const currentSolutions = new Map(
          (solutionsWidget?.solutions || home.homeSolutions || []).map((item) => [ item.key, item ])
        );
        const currentCapabilities = new Map(
          (capabilitiesWidget?.capabilities || home.homeCapabilities || []).map((item) => [ item.key, item ])
        );

        const homeSolutions = [];
        for (const item of homeSeed.homeSolutions) {
          const current = currentSolutions.get(item.key);
          const media = current?.media?._id
            ? current.media
            : await self.importSeedVideo(req, item.sourceFilename);
          const { sourceFilename, ...content } = item;
          homeSolutions.push({
            ...content,
            media
          });
        }

        const homeCapabilities = [];
        for (const item of homeSeed.homeCapabilities) {
          const current = currentCapabilities.get(item.key);
          const media = current?.media?._id
            ? current.media
            : await self.importSeedVideo(req, item.sourceFilename);
          const { sourceFilename, ...content } = item;
          homeCapabilities.push({
            ...content,
            media
          });
        }

        const areas = buildHomeAreas({
          self,
          home,
          seed: homeSeed,
          solutions: homeSolutions,
          capabilities: homeCapabilities
        });

        const updated = await self.apos.page.update(req, {
          ...home,
          title: home.title || homeSeed.page.title,
          seoTitle: home.seoTitle || homeSeed.page.seoTitle,
          seoDescription: home.seoDescription || homeSeed.page.seoDescription,
          seoCanonicalUrl: home.seoCanonicalUrl || homeSeed.page.seoCanonicalUrl,
          seoRobots: home.seoRobots || homeSeed.page.seoRobots,
          seoOgTitle: home.seoOgTitle || homeSeed.page.seoOgTitle,
          seoOgDescription: home.seoOgDescription || homeSeed.page.seoOgDescription,
          seoTwitterCard: home.seoTwitterCard || homeSeed.page.seoTwitterCard,
          ...areas
        });
        const cleanedStarterDocs = await self.cleanupEmptyStarterAreas();

        console.log(`已更新首页草稿: ${updated._id}`);
        console.log(`Locale: ${updated.aposLocale}`);
        console.log(`固定首页 Widget: 6，解决方案: ${homeSolutions.length}，核心能力: ${homeCapabilities.length}，媒体: 9`);
        console.log(`已清理空 Starter Home 字段: ${cleanedStarterDocs} 份文档`);
      }
    };
  },
  tasks(self) {
    return {
      'seed-draft': {
        usage: 'Usage: node app @apostrophecms/home-page:seed-draft\n\n幂等迁移并更新 zh:draft 首页的 6 个固定单例 home-* Widget、受限 Rich Text、完整页面级 SEO 和 9 个引用视频。已有新模型内容优先保留；首次迁移读取旧 Page fields。安全清理空 Starter Area，不发布页面。',
        task: self.seedDraft
      }
    };
  }
};
