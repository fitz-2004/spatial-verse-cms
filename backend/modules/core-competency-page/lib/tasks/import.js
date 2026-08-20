// 核心能力页中文数据导入任务
// 运行：node app core-competency-page:import
// 重复运行会更新而不是重复创建（稳定 slug /coohomcloud/corecompetency）

function buildData(self) {
  const textArea = (text) => self.apos.area.fromPlaintext(text);

  return {
    title: '核心能力',
    slug: '/coohomcloud/corecompetency',
    type: 'core-competency-page',
    published: true,
    intro: {
      eyebrow: textArea('02 / CORE COMPETENCY'),
      title: textArea('核心能力'),
      lead: textArea('基于群核丰富的数据库资源，我们通过技术能力驱动的数据产品，满足 AIGC、计算机视觉与机器人等行业的数据需求。'),
      subcopy: textArea('通过专用数据引擎，将海量数据库转换为适配不同应用平台的 3D 模型、3D 环境与衍生图像数据。'),
      signals: [
        { label: textArea('3D MODEL DATA') },
        { label: textArea('ENVIRONMENT DATA') },
        { label: textArea('DERIVED IMAGE DATA') }
      ]
    },
    capabilities: [
      {
        number: textArea('01'),
        header: textArea('CORE CAPABILITY / 01'),
        label: textArea('01 / PHYSICAL ENHANCEMENT'),
        title: textArea('物理增强能力'),
        text: textArea('赋予模型密度，摩擦力，弹性，阻尼等真实的物理性质信息，同时还可以对活动部件进行可活动的物理约束')
        // media 由 CMS 后台数组编辑器添加
      },
      {
        number: textArea('02'),
        header: textArea('CORE CAPABILITY / 02'),
        label: textArea('02 / SEGMENTATION & ANNOTATION'),
        title: textArea('分割标注能力'),
        text: textArea('自动化结合人工标注技术，可实现包含语义，材质，状态等多种形态信息标注')
      },
      {
        number: textArea('03'),
        header: textArea('CORE CAPABILITY / 03'),
        label: textArea('03 / SCENE ENHANCEMENT'),
        title: textArea('场景增强能力'),
        text: textArea('通过场景设计工具、场景繁化、模型变形、场景光线模拟等能力，使场景数据更多样')
      },
      {
        number: textArea('04'),
        header: textArea('CORE CAPABILITY / 04'),
        label: textArea('04 / MULTI-CHANNEL SUPPORT'),
        title: textArea('多通道支持能力'),
        text: textArea('支持多平台、高效率、更完整的3D模型数据导出，以及3D环境和衍生图片生成能力')
      }
    ],
    outro: {
      eyebrow: textArea('CORE COMPETENCY / COMPLETE'),
      heading: textArea('继续探索群核的数据基础设施'),
      links: [
        { number: textArea('02'), label: textArea('学术研究') },
        { number: textArea('03'), label: textArea('样例数据集') }
      ]
    },
    seoDescription: '群核空间智能平台面向 AIGC、计算机视觉与机器人行业的数据核心能力。',
    seoKeywords: '3D 数据, 核心能力, 群核, 空间智能'
  };
}

export default (self) => {
  return {
    usage: '导入核心能力页中文数据并发布。\n运行：node app core-competency-page:import',
    async task() {
      const apos = self.apos;
      const pages = apos.modules['@apostrophecms/page'];
      const req = apos.task.getReq();
      const data = buildData(self);

      const existing = await pages.find(req, { slug: data.slug }).toArray();
      if (existing.length > 0) {
        const draft = await pages.update(req, { ...data, _id: existing[0]._id, aposLocale: 'zh:draft' });
        await pages.publish(req, draft);
        console.log(`✅ 核心能力页已更新并发布: ${data.slug}`);
      } else {
        const home = await pages.find(req, { level: 0 }).toObject();
        if (!home) {
          throw new Error('Home 页面不存在，无法插入子页面');
        }
        const draft = await pages.insert(req, home._id, 'lastChild', { ...data, aposLocale: 'zh:draft', aposMode: 'draft' });
        await pages.publish(req, draft);
        console.log(`✅ 核心能力页已创建并发布: ${data.slug}（父页面: ${home.slug}）`);
      }
    }
  };
};