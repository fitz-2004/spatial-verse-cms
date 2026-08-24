import { aboutPage } from './lib/aboutData.js';

export default {
  options: {
    alias: 'aboutImport'
  },
  methods(self) {
    return {
      async importDrafts() {
        const req = self.apos.task.getReq({
          locale: 'zh',
          mode: 'draft'
        });
        const pageManager = self.apos.modules['@apostrophecms/page'];
        const home = await pageManager.find(req, { level: 0 }).toObject();
        if (!home) {
          throw new Error('目标数据库缺少 zh:draft Home，无法建立 About 页面。');
        }

        let page = await pageManager.find(req, {
          type: aboutPage.type,
          slug: aboutPage.slug
        }).toObject();
        if (!page) {
          page = await pageManager.insert(req, home._id, 'lastChild', {
            type: aboutPage.type,
            title: aboutPage.title,
            slug: aboutPage.slug,
            visibility: aboutPage.visibility
          });
        }

        const next = {
          ...page,
          ...structuredClone(aboutPage)
        };
        delete next._gallery;
        next.seoOgImage = null;

        await pageManager.update(req, next);

        console.log('About 中文草稿导入完成：');
        console.log('- 页面：1');
        console.log('- 媒体：0（最新原站 About 未实际引用独立图片）');
        console.log('- Piece：0');
        console.log('- Published：0（本任务不会发布）');
      },
      async verifyDrafts() {
        const req = self.apos.task.getReq({
          locale: 'zh',
          mode: 'draft'
        });
        const page = await self.apos.page.find(req, {
          type: aboutPage.type,
          slug: aboutPage.slug
        }).toObject();
        if (!page) {
          throw new Error(`未找到 About 草稿页面: ${aboutPage.slug}`);
        }
        console.log(`- 页面类型：${page.type}`);
        console.log(`- 草稿 locale：${page.aposLocale || 'zh:draft'}`);
        console.log(`- Hero 标题：${page.hero?.title || '缺少'}`);
        console.log(`- 指标数量：${page.metrics?.items?.length || 0}`);
        console.log(`- 图库字段：${page._gallery ? page._gallery.length : 0}`);
      }
    };
  },
  tasks(self) {
    return {
      'verify-drafts': {
        usage: 'node app about-import:verify-drafts\n\n只读检查：About 页面在 zh:draft 下是否存在，以及核心文案字段是否写入。',
        task: self.verifyDrafts
      },
      'import-drafts': {
        usage: 'node app about-import:import-drafts\n\n幂等导入 About 页面文案到 zh:draft；不发布、不清库、不修改其他业务域、不导入未实际引用的图片。',
        task: self.importDrafts
      }
    };
  }
};
