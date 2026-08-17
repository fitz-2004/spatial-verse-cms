/**
 * solution-mock-data.js
 * 临时视觉验证用 mock 数据，字段形状与 solution-page Page Type 一致，
 * 方便之后无缝切换到 CMS 数据。媒体使用本地文件（frontend/public/media/solutions/）。
 */

const media = {
  aiagent: { _url: '/media/solutions/sv-67dd966bd4fd.mp4', extension: 'mp4' },
  aigc: { _url: '/media/solutions/sv-77cb71efb29a.mp4', extension: 'mp4' },
  roboticsimulation: { _url: '/media/solutions/sv-9ab887ebe4c8.mp4', extension: 'mp4' },
  visualizedproductpromotion: { _url: '/media/solutions/sv-fdd162096d1b.mp4', extension: 'mp4' },
  xr: { _url: '/media/solutions/sv-54b3d57b0eeb.mov', extension: 'mov' }
};

export const solutionMockPages = [
  {
    slug: 'coohomcloud/solutions/aiagent',
    title: '智能体感知',
    englishTitle: 'AI AGENT UNDERSTANDING',
    heroTitle: '让 AI 智能体真正看懂空间。',
    heroLead: '基于虚拟场景生成合成数据，提升智能设备在真实室内环境中的感知、建图、导航与识别能力。',
    accent: '#29f5d1',
    sequence: 1,
    media: media.aiagent,
    challengeTitle: '智能体数据落地的四个阻力',
    challenges: [
      { title: '数据获取困难', text: '模型训练高度依赖合格数据，真实环境采集成本高、周期长，数据质量也难以稳定控制。' },
      { title: '处理流程繁琐', text: '原始数据往往不能直接使用，还需要清洗、筛选和标注，消耗大量人力与时间。' },
      { title: '数据成本高', text: 'AI 应用需要海量数据，模型效果与数据投入并非线性增长，规模化采集成为现实压力。' },
      { title: '隐私风险', text: '真实采集容易接触个人信息与公共环境数据，数据使用合规需要从源头被考虑。' }
    ],
    advantageTitle: '从场景到可用数据',
    advantages: [
      { title: '质量与准确性', text: '自动化工具结合人工复核，对不合格数据进行筛选和清洗，确保交付数据可以直接进入训练流程。' },
      { title: '成本效率', text: '借助大规模场景库和云端渲染能力，合成数据的整体生产成本显著低于传统真实数据采集。' },
      { title: '数据安全保障', text: '从数据源头采取合规措施，生成过程不接触真实敏感信息，满足企业数据使用要求。' }
    ],
    serviceTitle: '数据服务流程',
    services: [
      { title: '场景设计', text: '利用完整的场景设计工具，为住宅、商业、医疗等环境构建定制化室内空间。' },
      { title: '数据采集', text: '基于 KOOLAI 合成数据采集平台，灵活配置相机参数、运动轨迹和光照效果，模拟真实设备采集。' },
      { title: '数据标注', text: '通过结构化环境数据生成像素级标签，并结合人工输入提供语义、材质、位置与状态等信息。' }
    ],
    ctaTitle: '让下一组数据进入真实应用。'
  },
  {
    slug: 'coohomcloud/solutions/aigc',
    title: 'AIGC',
    englishTitle: 'GENERATIVE DATA',
    heroTitle: '为大模型提供多模态训练燃料。',
    heroLead: '以图像、视频、模型与完整标签体系覆盖生成式大模型的预训练需求，让 AIGC 数据获取更快、更稳、更成体系。',
    accent: '#9d7cff',
    sequence: 2,
    media: media.aigc,
    challengeTitle: 'AIGC 数据获取的三重挑战',
    challenges: [
      { title: '数据需求巨大', text: '模型规模增长带来指数级训练资源需求，数据获取、更新和维护都需要大量成本与时间。' },
      { title: '标注要求复杂', text: 'AIGC 训练覆盖图像、视频、3D 模型等多种格式，同时需要语义、材质、位置和状态等多维标签。' },
      { title: '隐私与合规', text: '全球数据法规持续收紧，数据来源合规和产品全球化交付成为研究与商业化的基础。' }
    ],
    advantageTitle: '一套数据基础设施，多种生成格式',
    advantages: [
      { title: '完整数据格式', text: '依托大规模场景数据库和扩展工具，支持图像、视频与 3D 数据的多样化生成和标准化交付。' },
      { title: '完整标注能力', text: '自动化工具与人工标注结合，为训练数据提供覆盖语义、材质、位置与状态的主客观信息。' },
      { title: '数据安全保障', text: '数据生成过程不访问真实敏感数据，从源头保护数据使用合规与客户交付安全。' }
    ],
    serviceTitle: '服务能力',
    services: [
      { title: '数据专家技术支持', text: '由数据专家梳理技术需求，并结合平台能力设计完整的数据生成与交付方案。' },
      { title: '定制化数据', text: '根据客户模型阶段和研究方向，提供灵活的数据规格、标签体系与分阶段交付计划。' },
      { title: '规模化交付', text: '通过自研图形渲染引擎与云计算平台，快速交付数十万乃至百万级数据点。' }
    ],
    ctaTitle: '让下一组数据进入真实应用。'
  },
  {
    slug: 'coohomcloud/solutions/roboticsimulation',
    title: '机器人仿真',
    englishTitle: 'ROBOTIC SIMULATION',
    heroTitle: '在数字空间里验证下一代机器人。',
    heroLead: '连接主流仿真平台，构建兼具高渲染质量与物理真实性的机器人仿真环境，降低真实设备试错成本。',
    accent: '#b8ff6b',
    sequence: 3,
    media: media.roboticsimulation,
    challengeTitle: '机器人仿真的三个瓶颈',
    challenges: [
      { title: '感知与交互不足', text: '机器人不仅要识别环境，还要理解空间并完成交互，真实世界中的感知能力仍然是关键缺口。' },
      { title: '实体迭代成本高', text: '实体机器人开发和迭代周期长、成本高，研发团队需要更快验证多种性能方案。' },
      { title: '仿真资源不足', text: '现有工具在完整性和数据资源建设上仍有缺口，难以直接支撑规模化仿真训练。' }
    ],
    advantageTitle: '从渲染真实性到平台兼容',
    advantages: [
      { title: '高渲染真实感', text: '增强 3D 数据的渲染效果，在 UE、Isaac Sim 等环境中尽可能接近真实世界，提升训练泛化能力。' },
      { title: '物理真实性', text: '提供密度、摩擦力、弹性、阻尼等物理参数，并支持抽屉、门等活动部件的物理约束。' },
      { title: '多平台兼容', text: '建立面向 Gazebo、UE、Isaac Sim 等平台的数据转换通道，保证数据转换的完整性与准确性。' }
    ],
    serviceTitle: '仿真服务能力',
    services: [
      { title: '交互模型', text: '围绕机器人与场景、物体和活动部件的交互关系，组织可验证的行为与物理反馈数据。' },
      { title: '多平台支持', text: '通过统一的数据工作流输出适配不同仿真平台的环境、模型和材质资源。' },
      { title: '快速验证', text: '在真实设备投入前完成环境、动作和交互策略验证，缩短研发周期并降低试错风险。' }
    ],
    ctaTitle: '让下一组数据进入真实应用。'
  },
  {
    slug: 'coohomcloud/solutions/visualizedproductpromotion',
    title: '产品可视化推广',
    englishTitle: 'VISUALIZED PRODUCT PROMOTION',
    heroTitle: '让客户在数字空间里直接感受产品。',
    heroLead: '利用 3D 数据资源库与高逼真环境展示能力，把产品放入可理解、可体验、可传播的虚拟场景。',
    accent: '#ff7ab6',
    sequence: 4,
    media: media.visualizedproductpromotion,
    challengeTitle: '数字化展示的三个难题',
    challenges: [
      { title: '产品体验不直观', text: '面向消费者的产品需要被放入用户熟悉的生活环境，才能让价值和变化被直接感知。' },
      { title: '数据资源不足', text: '数字营销需要户型数据、空间布局与模型资源，快速生成用户家庭场景是基础能力。' },
      { title: '技术链路复杂', text: '户型处理、模型构建和最终展示之间存在较高技术门槛，影响营销工具的落地速度。' }
    ],
    advantageTitle: '让场景成为产品的第二个展厅',
    advantages: [
      { title: '海量室内户型资源', text: '积累大量户型数据，用户可以快速搜索与匹配自己的空间，形成点对点的直观体验。' },
      { title: '多类型室内模型', text: '覆盖家具、家电、生活用品、厨卫设备等多种模型，满足不同产品的组合展示需求。' },
      { title: '完整技术支持', text: '提供 AI 场景生成、一键生成户型与风格，以及局部模型定制等能力，支持企业营销工具构建。' }
    ],
    serviceTitle: '产品展示能力',
    services: [
      { title: '空间匹配', text: '从真实户型和生活场景出发，让产品快速进入用户自己的空间语境。' },
      { title: '模型组合', text: '通过统一资源库组织产品、材质和环境资产，形成适合传播的可视化组合。' },
      { title: '虚拟体验', text: '以高逼真场景承载产品展示，让用户在数字空间中体验产品魅力。' }
    ],
    ctaTitle: '让下一组数据进入真实应用。'
  },
  {
    slug: 'coohomcloud/solutions/xr',
    title: 'XR',
    englishTitle: 'EXTENDED REALITY',
    heroTitle: '用数据推动 XR 体验向真实世界靠近。',
    heroLead: '通过高质量空间、模型、点云和交互数据，提升 AR、VR、MR 系统的环境适应能力与用户体验。',
    accent: '#6cc8ff',
    sequence: 5,
    media: media.xr,
    challengeTitle: 'XR 数据落地的四个难点',
    challenges: [
      { title: '数据采集困难', text: '高质量 XR 内容需要空间数据、环境交互数据和人体动作数据，采集技术复杂且硬件成本高。' },
      { title: '标注复杂度高', text: '空间、场景、物体和行为都需要精确标注，点云、模型与人体关键点标注需要专业能力。' },
      { title: '数据规模与多样性不足', text: '公开可用且丰富多样的 XR 数据集较少，难以满足大数据驱动技术的训练需求。' },
      { title: '用户隐私保护', text: '需要在保证体验的同时保护 XR 环境中产生的用户数据，避免数据泄露和滥用。' }
    ],
    advantageTitle: '从数据交付到内容创新',
    advantages: [
      { title: '定制化数据交付', text: '整合数据采集、清洗和标注服务，直接交付可使用的数据产品，降低复杂处理成本。' },
      { title: '多样数据资源', text: '覆盖 3D 模型、3D 点云与环境交互数据，为 XR 内容生成和设备训练提供数据支撑。' },
      { title: '数据安全保障', text: '通过数据源合规审查，生成过程不接触真实敏感数据，保障数据使用者的合规要求。' }
    ],
    serviceTitle: 'XR 数据能力',
    services: [
      { title: '空间资产', text: '提供可复用的 3D 模型、材质、点云与环境资产，支撑内容快速搭建。' },
      { title: '交互数据', text: '围绕环境、物体与人体动作组织交互信息，让虚实融合更自然、更可验证。' },
      { title: '内容创新', text: '让内容创作者获得稳定的数据资源，推动 XR 内容生产与应用规模化。' }
    ],
    ctaTitle: '让下一组数据进入真实应用。'
  }
];

export const solutionMockBySlug = new Map(
  solutionMockPages.map((page) => [page.slug, page])
);
