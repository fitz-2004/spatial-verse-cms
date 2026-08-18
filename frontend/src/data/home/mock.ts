export type Solution = {
  id: string;
  slug: string;
  title: string;
  description: string;
  useCases: string[];
  accent: string;
  pattern: string;
};

export type MissionStage = {
  label: string;
  signal: string;
  status: string;
  insight: string;
  media: CmsMediaSlot;
  targetSolution: number;
};

export type CmsMediaSlot = {
  id: string;
  kind: "image" | "video" | "image-or-video";
  cmsField: string;
  src?: string;
};

export const homeMockContent = {
  brand: {
    name: "群核空间智能平台",
    english: "SPATIALVERSE",
    descriptor: "AI数据解决方案先行者",
    kicker: "群核空间智能平台 / SPATIALVERSE",
  },
  seo: {
    title: "首页 - 群核空间智能平台",
    description:
      "群核空间智能平台致力于为机器人、AIGC、XR等行业提供优质的数据服务。",
  },
  nav: [
    { label: "首页", target: "top" },
    { label: "解决方案", target: "solutions" },
    { label: "核心能力", target: "core" },
    { label: "关于我们", target: "about", href: "/coohomcloud/about" },
  ],
  hero: {
    eyebrow: "群核空间智能平台 / AI DATA SOLUTIONS",
    title: "AI数据解决方案先行者",
    description:
      "致力于为机器人、AIGC、XR等行业提供优质的数据服务。我们基于全球领先的室内设计平台，为您提供多样化的室内合成数据，包括图片、3D模型、3D场景等标准数据服务以及个性化定制服务。",
    primaryCta: "了解更多",
    primaryTarget: "solutions",
    secondaryCta: "免费下载数据集",
    secondaryHref: "/coohomcloud/corecompetency/data",
  },
  solutionsIntro: {
    eyebrow: "01 / 解决方案",
    title: "解决方案",
    description: "围绕机器人、AIGC、产品可视化推广与XR等应用场景，提供从数据采集到使用的完整支持。",
  },
  mission: {
    eyebrow: "SPATIAL INTELLIGENCE / CORE 01",
    title: "空间智能数据中枢",
    description: "从真实空间采集、合成到模型训练与应用落地，形成可追踪的AI数据闭环。",
    coreTop: "SPATIAL",
    coreBottom: "CORE",
    stages: [
      { label: "PERCEIVE", signal: "感知 / 标注", status: "01 / PERCEPTION ONLINE", insight: "让智能设备看见空间、识别物体并理解环境。", media: { id: "home/mission/perceive", kind: "video", cmsField: "homeSolutions.0.media", src: "/media/home/sv-67dd966bd4fd.mp4" }, targetSolution: 0 },
      { label: "GENERATE", signal: "生成 / 训练", status: "02 / GENERATION ONLINE", insight: "为生成式模型提供图像、视频、模型与完整标签体系。", media: { id: "home/mission/generate", kind: "video", cmsField: "homeSolutions.1.media", src: "/media/home/sv-77cb71efb29a.mp4" }, targetSolution: 1 },
      { label: "SIMULATE", signal: "仿真 / 验证", status: "03 / SIMULATION ONLINE", insight: "在高渲染、强物理真实性的环境中完成低成本验证。", media: { id: "home/mission/simulate", kind: "video", cmsField: "homeSolutions.2.media", src: "/media/home/sv-9ab887ebe4c8.mp4" }, targetSolution: 2 },
      { label: "VISUALIZE", signal: "展示 / 转化", status: "04 / VISUALIZATION ONLINE", insight: "把3D数据转化为可被客户理解和体验的产品价值。", media: { id: "home/mission/visualize", kind: "video", cmsField: "homeSolutions.3.media", src: "/media/home/sv-fdd162096d1b.mp4" }, targetSolution: 3 },
      { label: "EXTEND", signal: "XR / 交互", status: "05 / MIXED REALITY ONLINE", insight: "连接AR、VR、MR中的模型、材质与动画，延展数字世界。", media: { id: "home/mission/extend", kind: "video", cmsField: "homeSolutions.4.media", src: "/media/home/sv-54b3d57b0eeb.mov" }, targetSolution: 4 },
    ] satisfies MissionStage[],
  },
  solutions: [
    {
      id: "agent-perception",
      slug: "aiagent",
      title: "智能体感知",
      description:
        "室内智能设备诸如扫地机器人，家庭看护机器人，室内无人机等，需要面对复杂的室内环境，并具备环境建图，导航规划，物体识别能力，群核空间智能平台旨在通过大规模的室内环境数据，比如带标注的2D图片数据集以及3D环境数据，帮助智能设备厂商以高性价比的方式实现数据采集和使用。",
      useCases: ["2D图片数据集", "3D环境数据", "环境建图"],
      accent: "#29f5d1",
      pattern: "pattern-mesh",
    },
    {
      id: "aigc",
      slug: "aigc",
      title: "AIGC",
      description:
        "AIGC技术爆发的时代，诞生了多种生成式大模型，通常这些模型是基于大量数据进行预训练，群核空间智能平台可以提供包括图像，视频，模型等多种要素的训练数据资源，并具备完整的标签体系，帮助AIGC研究者实现大模型技术突破。",
      useCases: ["图像数据", "视频数据", "模型数据"],
      accent: "#9d7cff",
      pattern: "pattern-rings",
    },
    {
      id: "robotics",
      slug: "roboticsimulation",
      title: "机器人仿真",
      description:
        "机器人仿真可以快速，低成本，安全的对产品进行验证，群核空间智能平台通过提供高渲染和物理真实性的仿真环境，并结合具体仿真平台打造仿真环境数据库，为企业机器人仿真提供助力。",
      useCases: ["仿真环境", "物理真实性", "环境数据库"],
      accent: "#b8ff6b",
      pattern: "pattern-scan",
    },
    {
      id: "product-visualization",
      slug: "visualizedproductpromotion",
      title: "产品可视化推广",
      description:
        "数字化展示是一种可以让客户直观感受产品魅力的手段，群核空间智能平台通过3D数据资源库以及高逼真的环境展示能力，通过数据赋能，让用户在虚拟环境中感受产品魅力。",
      useCases: ["3D数据资源库", "环境展示", "虚拟体验"],
      accent: "#ff7ab6",
      pattern: "pattern-grid",
    },
    {
      id: "xr",
      slug: "xr",
      title: "XR",
      description:
        "高质量数据集能显著提升AR/VR/MR系统的环境适应能力和用户体验，如精确的虚实结合效果、顺畅的交互操作等。同时，数据集也赋能内容创作者获取必要的3D模型、材质和动画资源，推动内容创新，从而有力推进XR技术的整体进步与广泛应用。",
      useCases: ["AR / VR / MR", "3D模型", "材质与动画"],
      accent: "#6cc8ff",
      pattern: "pattern-grid",
    },
  ] satisfies Solution[],
  capabilitiesIntro: {
    eyebrow: "02 / 核心能力",
    title: "核心能力",
    description: "基于全球领先的室内设计平台，构建面向不同模型、平台和应用场景的数据能力。",
  },
  capabilities: [
    {
      key: "physical-enhancement",
      number: "01",
      label: "PHYSICAL ENHANCEMENT",
      title: "物理增强能力",
      text: "赋予模型密度，摩擦力，弹性，阻尼等真实的物理性质信息，同时还可以对活动部件进行可活动的物理约束",
      media: { id: "home/capabilities/physical-enhancement", kind: "video", cmsField: "homeCapabilities.0.media", src: "/media/home/sv-c81b92093be3.mp4" },
    },
    {
      key: "segmentation-annotation",
      number: "02",
      label: "SEGMENTATION & ANNOTATION",
      title: "分割标注能力",
      text: "自动化结合人工标注技术，可实现包含语义，材质，状态等多种形态信息标注",
      media: { id: "home/capabilities/segmentation-annotation", kind: "video", cmsField: "homeCapabilities.1.media", src: "/media/home/sv-408e1d887d91.mp4" },
    },
    {
      key: "scene-enhancement",
      number: "03",
      label: "SCENE ENHANCEMENT",
      title: "场景增强能力",
      text: "通过场景设计工具、场景繁化、模型变形、场景光线模拟等能力，使场景数据更多样",
      media: { id: "home/capabilities/scene-enhancement", kind: "video", cmsField: "homeCapabilities.2.media", src: "/media/home/sv-ca457b587268.mp4" },
    },
    {
      key: "multi-channel-support",
      number: "04",
      label: "MULTI-CHANNEL SUPPORT",
      title: "多通道支持能力",
      text: "支持多平台、高效率、更完整的3D模型数据导出，以及3D环境和衍生图片生成能力",
      media: { id: "home/capabilities/multi-channel-support", kind: "video", cmsField: "homeCapabilities.3.media", src: "/media/home/sv-86d2e1bb66d2.mov" },
    },
  ],
  why: {
    eyebrow: "03 / 学术与技术支持",
    title: "为什么选择我们？",
    text: "群核科技旗下的Koolab创新实验室借助酷家乐全球最大规模的3D室内设计平台，自2018年起专注于研发3D场景虚拟合成技术。我们与国内外多家高校和科研机构展开深入合作，为群核空间智能平台提供可靠的技术支持，使其能为AIGC、机器人、室内智能体、XR等领域提供创新的虚拟合成数据产品和服务。",
    link: "探索更多学术成果",
    href: "/coohomcloud/corecompetency/paper",
  },
  about: {
    eyebrow: "ABOUT / SPATIAL INTELLIGENCE",
    title: "关于我们",
    lead: "群核空间智能平台致力于把真实空间、数字资产与人工智能连接起来，为机器人、AIGC、室内智能体与 XR 等领域提供可规模化使用的数据能力。",
    storyTitle: "让空间数据成为智能应用的基础设施",
    story: "群核科技旗下的 Koolab 创新实验室借助酷家乐全球规模化的 3D 室内设计平台，自 2018 年起专注于 3D 场景虚拟合成技术研发。我们与国内外高校和科研机构展开合作，为群核空间智能平台提供可靠的技术支持。",
    focus: ["AIGC", "机器人", "室内智能体", "XR"],
    metrics: [
      { value: "8M +", label: "总注册用户" },
      { value: "300K +", label: "3D 场景" },
      { value: "18M +", label: "3D 材质" },
      { value: "400K +", label: "日渲染图总量" },
      { value: "200+", label: "合作覆盖国家和地区" },
    ],
    quote: {
      text: "杰出的数据质量和专业精神！我们的虚拟研究建筑现在拥有大量且多模态的逼真的物体模型，推进了服务机器人领域的发展。",
      name: "Giang Hoang Nguyen",
      organization: "不莱梅大学",
    },
  },
  metrics: [
    { value: "45.5K +", label: "品牌企业客户" },
    { value: "362M +", label: "3D商品素材模型" },
    { value: "640M +", label: "AI生成图片" },
    { value: "200+", label: "合作覆盖国家和地区" },
  ],
  support: {
    eyebrow: "04 / 服务方式",
    title: "支持模式",
    description:
      "借助群核空间智能平台专业的数据集服务释放定制数据解决方案的力量。我们的团队专注于生成和定制2D和3D数据集，为您提供经济高效、高质量的数据获取服务。",
    modes: ["数据解决方案服务", "定制化数据处理服务", "学术研究合作"],
    platformLabel: "群核空间智能平台",
    linkLabel: "了解更多",
    linkHref: "#contact-drawer",
  },
  datasets: [
    { label: "IMAGE", title: "2D Synthetic Datasets/Videos", text: "图片、视频与多模态训练资源" },
    { label: "MODEL", title: "3D Models", text: "可复用的3D模型与材质资源" },
    { label: "SCENE", title: "3D Scenes", text: "高渲染与物理真实性的3D场景" },
  ],
  footer: {
    groups: [
      {
        title: "解决方案",
        links: [
          { label: "智能体感知", href: "/coohomcloud/solutions/AIAgent" },
          { label: "AIGC", href: "/coohomcloud/solutions/AIGC" },
          { label: "机器人仿真", href: "/coohomcloud/solutions/RoboticSimulation" },
          { label: "产品可视化推广", href: "/coohomcloud/solutions/VisualizedProductPromotion" },
          { label: "拓展现实", href: "/coohomcloud/solutions/XR" },
        ],
      },
      {
        title: "核心能力",
        links: [
          { label: "核心能力", href: "/coohomcloud/corecompetency" },
          { label: "学术研究", href: "/coohomcloud/corecompetency/paper" },
          { label: "样例数据集", href: "/coohomcloud/corecompetency/data" },
        ],
      },
      {
        title: "关于我们",
        links: [
          { label: "关于我们", href: "/coohomcloud/about" },
        ],
      },
    ],
    social: [
      { label: "in", name: "LinkedIn", href: "https://www.linkedin.com/company/coohomcloud" },
      { label: "𝕏", name: "X", href: "https://x.com/coohomcloud" },
    ],
  },
  contact: {
    title: "联系我们",
    email: "cloud@coohom.com",
    phone: "+1(213)465-0013",
    description: "借助群核空间智能平台专业的数据集服务释放定制数据解决方案的力量。我们的团队专注于生成和定制2D和3D数据集，为您提供经济高效、高质量的数据获取服务。",
    interests: ["智能体感知", "AIGC", "机器人仿真", "XR", "产品可视化推广", "学术合作"],
    privacy:
      "我们会将您的信息添加到我们的客户关系管理，以便与您联系。欲了解更多信息，请联系我们。",
  },
};

export type HomeContent = typeof homeMockContent;

export const solutionNavItems = homeMockContent.solutions.map((solution) => ({
  label: solution.id === "xr" ? "XR" : solution.title,
  href: `/coohomcloud/solutions/${solution.slug}`,
}));

export const coreNavItems = [
  { label: "核心能力", href: "/coohomcloud/corecompetency" },
  { label: "学术研究", href: "/coohomcloud/corecompetency/paper" },
  { label: "样例数据集", href: "/coohomcloud/corecompetency/data" },
] as const;

export const solutionPageContent = {
  eyebrow: "01 / SOLUTION SYSTEM",
  title: "解决方案",
  lead: "围绕机器人、AIGC、产品可视化推广与XR等应用场景，提供从数据采集到使用的完整支持。",
  status: "SOLUTION MATRIX / ONLINE",
  scrollHint: "SCROLL TO ROTATE / 01—05",
  systemLabel: "COOHOM CLOUD / APPLICATION LAYER",
  endLabel: "SOLUTION SYSTEM / COMPLETE",
} as const;
