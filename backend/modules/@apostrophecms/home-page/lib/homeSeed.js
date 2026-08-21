export const homeSeed = {
  page: {
    title: '首页',
    seoTitle: '群核空间智能平台｜AI数据解决方案先行者',
    seoDescription: '群核空间智能平台致力于为机器人、AIGC、XR等行业提供优质的数据服务。',
    seoCanonicalUrl: '',
    seoRobots: 'index-follow',
    seoOgTitle: '群核空间智能平台｜AI数据解决方案先行者',
    seoOgDescription: '面向机器人、AIGC 与 XR 提供图片、视频、3D模型、3D场景和定制化数据服务。',
    seoTwitterCard: 'summary_large_image',
    homeBrand: {
      kicker: '群核空间智能平台 / SPATIALVERSE',
      title: '群核空间智能平台',
      descriptor: 'AI数据解决方案先行者'
    },
    homeHero: {
      eyebrow: '群核空间智能平台 / AI DATA SOLUTIONS',
      title: 'AI数据解决方案先行者',
      description: '致力于为机器人、AIGC、XR等行业提供优质的数据服务。我们基于全球领先的室内设计平台，为您提供多样化的室内合成数据，包括图片、3D模型、3D场景等标准数据服务以及个性化定制服务。',
      primaryCtaLabel: '了解更多',
      primaryCtaTarget: 'solutions',
      secondaryCtaLabel: '免费下载数据集',
      secondaryCtaHref: '/coohomcloud/corecompetency/data'
    },
    homeSolutionsIntro: {
      eyebrow: '01 / 解决方案',
      title: '解决方案',
      description: '围绕机器人、AIGC、产品可视化推广与XR等应用场景，提供从数据采集到使用的完整支持。'
    },
    homeMission: {
      title: '空间智能数据中枢',
      coreTop: 'SPATIAL',
      coreBottom: 'CORE'
    },
    homeCapabilitiesIntro: {
      eyebrow: '02 / 核心能力',
      title: '核心能力',
      description: '基于全球领先的室内设计平台，构建面向不同模型、平台和应用场景的数据能力。'
    },
    homeWhy: {
      eyebrow: '03 / 学术与技术支持',
      title: '为什么选择我们？',
      text: '群核科技旗下的Koolab创新实验室借助酷家乐全球最大规模的3D室内设计平台，自2018年起专注于研发3D场景虚拟合成技术。我们与国内外多家高校和科研机构展开深入合作，为群核空间智能平台提供可靠的技术支持，使其能为AIGC、机器人、室内智能体、XR等领域提供创新的虚拟合成数据产品和服务。',
      linkLabel: '探索更多学术成果',
      linkHref: '/coohomcloud/corecompetency/paper'
    },
    homeMetrics: [
      { value: '45.5K +', label: '品牌企业客户' },
      { value: '362M +', label: '3D商品素材模型' },
      { value: '640M +', label: 'AI生成图片' },
      { value: '200+', label: '合作覆盖国家和地区' }
    ],
    homeSupport: {
      eyebrow: '04 / 服务方式',
      title: '支持模式',
      description: '借助群核空间智能平台专业的数据集服务释放定制数据解决方案的力量。我们的团队专注于生成和定制2D和3D数据集，为您提供经济高效、高质量的数据获取服务。',
      platformLabel: '群核空间智能平台',
      linkLabel: '了解更多',
      linkHref: '#contact-drawer',
      modes: [
        { title: '数据解决方案服务' },
        { title: '定制化数据处理服务' },
        { title: '学术研究合作' }
      ]
    }
  },
  homeSolutions: [
    {
      key: 'agent-perception',
      slug: 'aiagent',
      title: '智能体感知',
      description: '室内智能设备诸如扫地机器人，家庭看护机器人，室内无人机等，需要面对复杂的室内环境，并具备环境建图，导航规划，物体识别能力，群核空间智能平台旨在通过大规模的室内环境数据，比如带标注的2D图片数据集以及3D环境数据，帮助智能设备厂商以高性价比的方式实现数据采集和使用。',
      stageLabel: 'PERCEIVE',
      stageSignal: '感知 / 标注',
      stageStatus: '01 / PERCEPTION ONLINE',
      stageInsight: '让智能设备看见空间、识别物体并理解环境。',
      sourceFilename: 'sv-67dd966bd4fd.mp4'
    },
    {
      key: 'aigc',
      slug: 'aigc',
      title: 'AIGC',
      description: 'AIGC技术爆发的时代，诞生了多种生成式大模型，通常这些模型是基于大量数据进行预训练，群核空间智能平台可以提供包括图像，视频，模型等多种要素的训练数据资源，并具备完整的标签体系，帮助AIGC研究者实现大模型技术突破。',
      stageLabel: 'GENERATE',
      stageSignal: '生成 / 训练',
      stageStatus: '02 / GENERATION ONLINE',
      stageInsight: '为生成式模型提供图像、视频、模型与完整标签体系。',
      sourceFilename: 'sv-77cb71efb29a.mp4'
    },
    {
      key: 'robotics',
      slug: 'roboticsimulation',
      title: '机器人仿真',
      description: '机器人仿真可以快速，低成本，安全的对产品进行验证，群核空间智能平台通过提供高渲染和物理真实性的仿真环境，并结合具体仿真平台打造仿真环境数据库，为企业机器人仿真提供助力。',
      stageLabel: 'SIMULATE',
      stageSignal: '仿真 / 验证',
      stageStatus: '03 / SIMULATION ONLINE',
      stageInsight: '在高渲染、强物理真实性的环境中完成低成本验证。',
      sourceFilename: 'sv-9ab887ebe4c8.mp4'
    },
    {
      key: 'product-visualization',
      slug: 'visualizedproductpromotion',
      title: '产品可视化推广',
      description: '数字化展示是一种可以让客户直观感受产品魅力的手段，群核空间智能平台通过3D数据资源库以及高逼真的环境展示能力，通过数据赋能，让用户在虚拟环境中感受产品魅力。',
      stageLabel: 'VISUALIZE',
      stageSignal: '展示 / 转化',
      stageStatus: '04 / VISUALIZATION ONLINE',
      stageInsight: '把3D数据转化为可被客户理解和体验的产品价值。',
      sourceFilename: 'sv-fdd162096d1b.mp4'
    },
    {
      key: 'xr',
      slug: 'xr',
      title: 'XR',
      description: '高质量数据集能显著提升AR/VR/MR系统的环境适应能力和用户体验，如精确的虚实结合效果、顺畅的交互操作等。同时，数据集也赋能内容创作者获取必要的3D模型、材质和动画资源，推动内容创新，从而有力推进XR技术的整体进步与广泛应用。',
      stageLabel: 'EXTEND',
      stageSignal: 'XR / 交互',
      stageStatus: '05 / MIXED REALITY ONLINE',
      stageInsight: '连接AR、VR、MR中的模型、材质与动画，延展数字世界。',
      sourceFilename: 'sv-54b3d57b0eeb.mov'
    }
  ],
  homeCapabilities: [
    {
      key: 'physical-enhancement',
      number: '01',
      label: 'PHYSICAL ENHANCEMENT',
      title: '物理增强能力',
      text: '赋予模型密度，摩擦力，弹性，阻尼等真实的物理性质信息，同时还可以对活动部件进行可活动的物理约束',
      sourceFilename: 'sv-c81b92093be3.mp4'
    },
    {
      key: 'segmentation-annotation',
      number: '02',
      label: 'SEGMENTATION & ANNOTATION',
      title: '分割标注能力',
      text: '自动化结合人工标注技术，可实现包含语义，材质，状态等多种形态信息标注',
      sourceFilename: 'sv-408e1d887d91.mp4'
    },
    {
      key: 'scene-enhancement',
      number: '03',
      label: 'SCENE ENHANCEMENT',
      title: '场景增强能力',
      text: '通过场景设计工具、场景繁化、模型变形、场景光线模拟等能力，使场景数据更多样',
      sourceFilename: 'sv-ca457b587268.mp4'
    },
    {
      key: 'multi-channel-support',
      number: '04',
      label: 'MULTI-CHANNEL SUPPORT',
      title: '多通道支持能力',
      text: '支持多平台、高效率、更完整的3D模型数据导出，以及3D环境和衍生图片生成能力',
      sourceFilename: 'sv-86d2e1bb66d2.mov'
    }
  ]
};
