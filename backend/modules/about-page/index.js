import { aboutSeed, buildAboutAreas } from './lib/aboutSeed.js';

const text = (label, options = {}) => ({ type: 'string', label, ...options });
const textarea = (label, options = {}) => text(label, { textarea: true, ...options });
const singletonArea = (label, widgetType) => ({
  type: 'area', label, max: 1,
  options: { max: 1, widgets: { [widgetType]: {} } }, def: [widgetType],
  help: '固定位置、固定类型、最多一个实例。编辑时可原位修改，不用于自由搭建或重排页面。'
});
const seoFields = {
  seoTitle: text('SEO 标题（留空使用页面标题）', { max: 60 }), seoDescription: textarea('SEO 描述', { max: 160 }), seoCanonicalUrl: text('Canonical URL'),
  seoRobots: { type: 'select', label: '搜索引擎索引策略', def: 'index-follow', choices: [{ label: '允许索引和跟踪链接', value: 'index-follow' }, { label: '禁止索引，允许跟踪链接', value: 'noindex-follow' }, { label: '允许索引，禁止跟踪链接', value: 'index-nofollow' }, { label: '禁止索引和跟踪链接', value: 'noindex-nofollow' }] },
  seoOgTitle: text('社交分享标题', { max: 60 }), seoOgDescription: textarea('社交分享描述', { max: 200 }), seoOgImage: { type: 'attachment', label: '社交分享图片', fileGroup: 'images' },
  seoTwitterCard: { type: 'select', label: 'Twitter Card', def: 'summary_large_image', choices: [{ label: '大图卡片', value: 'summary_large_image' }, { label: '摘要卡片', value: 'summary' }] }
};

export default {
  extend: '@apostrophecms/page-type', options: { label: '关于我们页面', pluralLabel: '关于我们页面' },
  fields: {
    add: {
      aboutHeroArea: singletonArea('Hero（原位编辑）', 'about-hero'), aboutStoryArea: singletonArea('平台起源（原位编辑）', 'about-story'),
      aboutNetworkArea: singletonArea('数据网络（原位编辑）', 'about-network'), aboutMetricsArea: singletonArea('平台规模（原位编辑）', 'about-metrics'),
      aboutQuoteArea: singletonArea('用户反馈（原位编辑）', 'about-quote'), aboutCtaArea: singletonArea('底部行动区（原位编辑）', 'about-cta'), ...seoFields
    },
    group: {
      content: { label: '固定原位编辑区块', fields: ['aboutHeroArea', 'aboutStoryArea', 'aboutNetworkArea', 'aboutMetricsArea', 'aboutQuoteArea', 'aboutCtaArea'] },
      seo: { label: 'SEO', fields: ['title', ...Object.keys(seoFields)] }
    }
  },
  methods(self) {
    return {
      async importDraft() {
        const req = self.apos.task.getReq({ locale: 'zh', mode: 'draft' });
        const pageManager = self.apos.modules['@apostrophecms/page'];
        const home = await pageManager.find(req, { level: 0 }).toObject();
        if (!home) throw new Error('目标数据库缺少 zh:draft Home，无法建立关于我们页面。');
        let page = await pageManager.find(req, { type: 'about-page', slug: '/coohomcloud/about' }).toObject();
        if (!page) page = await pageManager.insert(req, home._id, 'lastChild', { type: 'about-page', title: aboutSeed.title, slug: '/coohomcloud/about', visibility: 'public' });
        const updated = await pageManager.update(req, { ...page, ...aboutSeed, type: 'about-page', slug: '/coohomcloud/about', visibility: page.visibility || 'public', ...buildAboutAreas(self, page) });
        console.log(`已导入 About 中文草稿：${updated.slug}`);
        console.log('- 固定原位编辑 Widget：6；媒体：0（原站该页面未使用图片）');
        console.log('- Published：0（本任务不会发布）');
      }
    };
  },
  tasks(self) {
    return { 'import-draft': { usage: 'node app about-page:import-draft\\n\\n导入 /coohomcloud/about 中文草稿、6 个固定 about-* 原位编辑区块及 SEO；不导入 Global、archive 或其他页面，也不会发布。', task: self.importDraft } };
  }
};
