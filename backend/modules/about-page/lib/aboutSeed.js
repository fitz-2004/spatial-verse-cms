const escapeHtml = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const inline = (self, previous, tag, value) => {
  const current = previous?.items?.find((item) => item.type === '@apostrophecms/rich-text');
  if (current?.content?.trim()) return previous;
  return { _id: previous?._id || self.apos.util.generateId(), metaType: 'area', items: [{ _id: current?._id || self.apos.util.generateId(), metaType: 'widget', type: '@apostrophecms/rich-text', content: `<${tag}>${escapeHtml(value)}</${tag}>` }] };
};
const widget = (self, previous, type, fields) => ({ _id: previous?._id || self.apos.util.generateId(), metaType: 'area', items: [{ _id: previous?.items?.[0]?._id || self.apos.util.generateId(), metaType: 'widget', type, ...fields(previous?.items?.[0] || {}) }] });

export const aboutSeed = {
  title: '关于我们', seoTitle: '关于我们 - 群核空间智能平台',
  seoDescription: '群核空间智能平台致力于把真实空间、数字资产与人工智能连接起来，为机器人、AIGC、室内智能体与 XR 等领域提供可规模化使用的数据能力。',
  seoKeywords: '关于我们, 空间智能, AIGC, 机器人, XR, 群核空间智能平台', seoRobots: 'index-follow', seoTwitterCard: 'summary_large_image'
};

export function buildAboutAreas(self, page) {
  return {
    aboutHeroArea: widget(self, page.aboutHeroArea, 'about-hero', (current) => ({
      eyebrow: inline(self, current.eyebrow, 'p', '06 / ABOUT / SPATIAL INTELLIGENCE'), heading: inline(self, current.heading, 'h1', '关于我们'),
      lead: inline(self, current.lead, 'p', '群核空间智能平台致力于把真实空间、数字资产与人工智能连接起来，为机器人、AIGC、室内智能体与 XR 等领域提供可规模化使用的数据能力。'),
      cta: inline(self, current.cta, 'span', '与我们连接'), ctaHref: current.ctaHref || '#contact-drawer'
    })),
    aboutStoryArea: widget(self, page.aboutStoryArea, 'about-story', (current) => ({
      eyebrow: inline(self, current.eyebrow, 'p', '01 / PLATFORM ORIGIN'), heading: inline(self, current.heading, 'h2', '让空间数据成为智能应用的基础设施'),
      body: inline(self, current.body, 'p', '群核科技旗下的 Koolab 创新实验室借助酷家乐全球规模化的 3D 室内设计平台，自 2018 年起专注于 3D 场景虚拟合成技术研发。我们与国内外高校和科研机构展开合作，为群核空间智能平台提供可靠的技术支持。'),
      focus: current.focus?.length ? current.focus : [{ label: 'AIGC' }, { label: '机器人' }, { label: '室内智能体' }, { label: 'XR' }]
    })),
    aboutNetworkArea: widget(self, page.aboutNetworkArea, 'about-network', (current) => ({
      eyebrow: inline(self, current.eyebrow, 'p', '02 / DATA NETWORK'), heading: inline(self, current.heading, 'h2', '从场景资产到智能应用'),
      body: inline(self, current.body, 'p', '我们把室内场景、3D 模型、材质、渲染与标注能力组织成可复用的数据基础设施，让研究者和企业能够更快地获得适合训练、仿真、验证与展示的数据产品。'),
      portals: current.portals?.length ? current.portals : [{ number: '01', label: '核心能力', href: '/coohomcloud/corecompetency' }, { number: '02', label: '学术研究', href: '/coohomcloud/corecompetency/paper' }, { number: '03', label: '样例数据集', href: '/coohomcloud/corecompetency/data' }]
    })),
    aboutMetricsArea: widget(self, page.aboutMetricsArea, 'about-metrics', (current) => ({
      eyebrow: inline(self, current.eyebrow, 'p', '03 / PLATFORM SCALE'), heading: inline(self, current.heading, 'h2', '持续运行的数据规模'),
      metrics: current.metrics?.length ? current.metrics : [{ value: '8M +', label: '总注册用户' }, { value: '300K +', label: '3D 场景' }, { value: '18M +', label: '3D 材质' }, { value: '400K +', label: '日渲染图总量' }, { value: '200+', label: '合作覆盖国家和地区' }]
    })),
    aboutQuoteArea: widget(self, page.aboutQuoteArea, 'about-quote', (current) => ({
      eyebrow: inline(self, current.eyebrow, 'p', '04 / FIELD FEEDBACK'), quote: inline(self, current.quote, 'blockquote', '“杰出的数据质量和专业精神！我们的虚拟研究建筑现在拥有大量且多模态的逼真的物体模型，推进了服务机器人领域的发展。”'),
      name: inline(self, current.name, 'strong', 'Giang Hoang Nguyen'), organization: inline(self, current.organization, 'span', '不莱梅大学')
    })),
    aboutCtaArea: widget(self, page.aboutCtaArea, 'about-cta', (current) => ({
      eyebrow: inline(self, current.eyebrow, 'p', '05 / NEXT CONNECTION'), heading: inline(self, current.heading, 'h2', '让下一组数据进入真实应用。'),
      cta: inline(self, current.cta, 'span', '联系我们'), ctaHref: current.ctaHref || '#contact-drawer'
    }))
  };
}
