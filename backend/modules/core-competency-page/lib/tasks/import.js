// 核心能力页中文草稿数据导入任务
// 运行：APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app core-competency-page:import
// 重复运行会更新而不是重复创建（使用稳定 slug /coohomcloud/corecompetency）

function buildData() {
  return {
    title: '核心能力',
    slug: '/coohomcloud/corecompetency',
    type: 'core-competency-page',
    published: false,
    intro: {
      eyebrow: '02 / CORE COMPETENCY',
      title: '核心能力',
      lead: '基于群核丰富的数据库资源，我们通过技术能力驱动的数据产品，满足 AIGC、计算机视觉与机器人等行业的数据需求。',
      subcopy: '通过专用数据引擎，将海量数据库转换为适配不同应用平台的 3D 模型、3D 环境与衍生图像数据。',
      signals: [
        { label: '3D MODEL DATA' },
        { label: 'ENVIRONMENT DATA' },
        { label: 'DERIVED IMAGE DATA' }
      ]
    },
    capabilities: buildCapabilities()
  };
}

function buildCapabilities() {
  return [
    {
      number: '01',
      label: 'PHYSICAL ENHANCEMENT',
      title: '物理增强能力',
      text: '赋予模型密度，摩擦力，弹性，阻尼等真实的物理性质信息，同时还可以对活动部件进行可活动的物理约束'
    },
    {
      number: '02',
      label: 'SEGMENTATION & ANNOTATION',
      title: '分割标注能力',
      text: '自动化结合人工标注技术，可实现包含语义，材质，状态等多种形态信息标注'
    },
    {
      number: '03',
      label: 'SCENE ENHANCEMENT',
      title: '场景增强能力',
      text: '通过场景设计工具、场景繁化、模型变形、场景光线模拟等能力，使场景数据更多样'
    },
    {
      number: '04',
      label: 'MULTI-CHANNEL SUPPORT',
      title: '多通道支持能力',
      text: '支持多平台、高效率、更完整的3D模型数据导出，以及3D环境和衍生图片生成能力'
    }
  ];
}

export default (self) => {
  return {
    usage: '导入核心能力页中文草稿数据。\n运行：node app core-competency-page:import',
    async task() {
      const apos = self.apos;
      const pages = apos.modules['@apostrophecms/page'];
      const req = apos.task.getReq();
      const data = buildData();

      const existing = await pages.find(req, { slug: data.slug }).toArray();
      if (existing.length > 0) {
        await pages.update(req, { ...data, _id: existing[0]._id });
        console.log(`✅ 核心能力页草稿已更新: ${data.slug}`);
      } else {
        await pages.insert(req, { ...data, aposMode: 'draft' });
        console.log(`✅ 核心能力页草稿已创建: ${data.slug}`);
      }
    }
  };
};
