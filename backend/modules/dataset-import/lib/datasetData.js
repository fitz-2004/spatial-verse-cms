export const datasetPage = {
  type: 'dataset-library-page',
  slug: '/coohomcloud/corecompetency/data',
  title: '样例数据集',
  visibility: 'public',
  intro: {
    eyebrow: '04 / EXAMPLE DATASETS',
    title: '样例数据集',
    lead: '用于研究项目中 AI 的训练与评估，覆盖 3D 模型、3D 场景与 2D 图像，支持评估阶段免费使用。'
  },
  library: {
    eyebrow: 'DATASET LIBRARY / SEARCH NODE',
    title: '数据集资源库',
    description: '按数据类型和关键词筛选，打开卡片查看详情并预览下载信息。',
    searchLabel: 'SEARCH',
    searchPlaceholder: '搜索数据集名称、标签或格式',
    filterAllLabel: '全部数据',
    filterModelLabel: '模型数据',
    filterSceneLabel: '场景数据',
    filterImageLabel: '图像数据',
    emptyTitle: 'NO DATA SIGNAL',
    emptyText: '没有找到匹配的数据集，请更换关键词或分类。',
    downloadHeading: '数据格式',
    downloadButtonLabel: '免费下载',
    unavailableLabel: '暂无可下载资源'
  },
  seoTitle: '样例数据集 - 群核空间智能平台',
  seoDescription: '用于研究项目中 AI 的训练与评估，覆盖 3D 模型、3D 场景与 2D 图像，支持评估阶段免费使用。',
  seoKeywords: '样例数据集, 模型数据, 场景数据, 图像数据, 空间智能',
  seoCanonicalUrl: '',
  seoRobots: 'index-follow',
  seoOgTitle: '样例数据集 - 群核空间智能平台',
  seoOgDescription: '用于研究项目中 AI 的训练与评估，覆盖 3D 模型、3D 场景与 2D 图像，支持评估阶段免费使用。',
  seoTwitterCard: 'summary_large_image'
};

const item = ({
  id,
  category,
  categoryLabel,
  title,
  summary,
  description,
  formats,
  tags,
  downloads,
  previewUrl,
  galleryUrls = []
}) => ({
  id,
  category,
  categoryLabel,
  title,
  summary,
  description,
  formats: formats.map((label) => ({ label })),
  tags: tags.map((label) => ({ label })),
  downloads,
  previewUrl,
  galleryUrls
});

export const datasetItems = [
  item({
    id: 'electrical-appliances',
    category: 'model',
    categoryLabel: 'MODEL DATASET',
    title: '家电模型',
    summary: '适用于物体识别与室内场景理解的基础模型。',
    description: '包含常见家电模型与材质信息，适合用于物体识别、场景理解与模型检索任务。',
    formats: [ 'OBJ', 'BLENDER' ],
    tags: [ '基础信息', '材质' ],
    downloads: [
      { label: 'OBJ', url: 'https://kloudsim-oss.kujiale.com/website_dataset/models/electric_kettle/base/electirc_kettle_community.zip' },
      { label: 'BLENDER', url: 'https://kloudsim-oss.kujiale.com/website_dataset/models/electric_kettle/base/electric_kettle_community.blend' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/png/1719389239668/9927B9913EC74DD80ABCAD25B2C9361C.png'
  }),
  item({
    id: 'professional-electrical-appliances',
    category: 'model',
    categoryLabel: 'MODEL DATASET',
    title: '专业家电模型',
    summary: '提供组件结构与标准命名的高规格家电模型。',
    description: '在基础信息与材质之外，补充组件结构和标准命名约束，方便进入更复杂的数据处理和仿真流程。',
    formats: [ 'FBX + PBR', 'BLENDER', 'USD' ],
    tags: [ '组件结构', '标准命名' ],
    downloads: [
      { label: 'FBX + PBR', url: 'https://qhstaticssl.kujiale.com/application/xzipcompressed/1727248740813/21D8DC68270D7C94AC0B33564EEDD089.zip' },
      { label: 'BLENDER', url: 'https://kloudsim-oss.kujiale.com/website_dataset/models/electric_kettle/professional/electric_kettle_professional.blend' },
      { label: 'USD', url: 'https://kloudsim-oss.kujiale.com/website_dataset/models/electric_kettle/professional/electric_kettle_professional_usd.zip' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/png/1718612694766/74B3A7E7DCC28AAFAA454FA9236C161C.png?x-oss-process=image/resize,w_500'
  }),
  item({
    id: 'furniture',
    category: 'model',
    categoryLabel: 'MODEL DATASET',
    title: '家具模型',
    summary: '覆盖室内常见家具的可复用三维模型资源。',
    description: '提供可复用的室内家具模型与材质资源，适用于训练、渲染和场景搭建。',
    formats: [ 'OBJ', 'BLENDER' ],
    tags: [ '基础信息', '材质' ],
    downloads: [
      { label: 'OBJ', url: 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/base/shoe_cabinet_community.zip' },
      { label: 'BLENDER', url: 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/base/shoe_cabinet_community.blend' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/jpeg/1717660668565/8CC51EFDC2543912944F025CD1877461.jpg'
  }),
  item({
    id: 'professional-furniture',
    category: 'model',
    categoryLabel: 'MODEL DATASET',
    title: '专业家具模型',
    summary: '带有完整结构信息的专业级家具数据。',
    description: '包含模型组件结构、标准命名与材质信息，为交互式模型和物理增强应用提供基础。',
    formats: [ 'FBX + PBR', 'BLENDER', 'USD' ],
    tags: [ '组件结构', '标准命名' ],
    downloads: [
      { label: 'FBX + PBR', url: 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/professional/shoe_cabinet_professional.zip' },
      { label: 'BLENDER', url: 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/professional/shoe_cabinet_professional.blend' },
      { label: 'USD', url: 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/professional/shoe_cabinet_professional_usd.zip' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/jpeg/1717660735951/8DDE88BE3586A79F3B9C7E6E27155A5E.jpg'
  }),
  item({
    id: 'teapot',
    category: 'model',
    categoryLabel: 'MODEL DATASET',
    title: '茶壶模型',
    summary: '小型物体识别与材质研究的示例模型。',
    description: '适合用于单物体识别、材质分析和基础渲染任务的轻量级模型样例。',
    formats: [ 'BLENDER' ],
    tags: [ '识别', '材质' ],
    downloads: [
      { label: 'BLENDER', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1717730158718/CBDA6ABEFAF44EF0950FEEDFB587708D.rar' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/gif/1718615509155/72D7D01F5B4708B8CFD7F3DF0D897FC8.gif'
  }),
  item({
    id: 'wardrobe',
    category: 'model',
    categoryLabel: 'MODEL DATASET',
    title: '衣柜模型',
    summary: '室内物体理解与空间布局任务的模型样例。',
    description: '适合用于室内空间理解、物体检测和家具布局相关的研究任务。',
    formats: [ 'USD', 'BLENDER' ],
    tags: [ '室内', '布局' ],
    downloads: [
      { label: 'USD', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1717730346762/4C4430979334FE7F239F4B7346887804.rar' },
      { label: 'BLENDER', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1718251093378/456935AF5DE3F15036566658541F6A22.rar' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/gif/1718678697128/D5A51B2D7C159D0697DBAC015CFD9DCC.gif'
  }),
  item({
    id: 'oven',
    category: 'model',
    categoryLabel: 'PHYSICAL MODEL',
    title: '物理增强烤箱',
    summary: '带真实尺寸、结构和物理仿真信息的模型。',
    description: '包含碰撞体、仿真参数、父子绑定关系、真实世界尺寸与结构信息，可用于物理交互研究。',
    formats: [ 'USD', 'BLENDER' ],
    tags: [ '物理仿真', '真实尺寸' ],
    downloads: [
      { label: 'USD', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1725350440709/56856A1B66C571C5D183499D64208E3D.rar' },
      { label: 'BLENDER', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1718251053263/CFB502B85477AA88453F0D62C37FDA08.rar' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/gif/1717660980466/52F9D50064050E5CDC4D009B420978AA.gif'
  }),
  item({
    id: 'flexible-deformation',
    category: 'model',
    categoryLabel: 'PHYSICAL MODEL',
    title: '柔性变形模型',
    summary: '通过物理模拟生成更自然的柔性物体姿态。',
    description: '通过物理模拟为窗帘、枕头、纸巾等柔性模型生成丰富姿态，适用于接触与变形研究。',
    formats: [ 'FBX', 'OBJ', 'USD' ],
    tags: [ '柔性变形', '物理模拟' ],
    downloads: [
      { label: 'FBX', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724220975544/58E00E6A3A3E42BEB2CFF9C443047D99.rar' },
      { label: 'OBJ', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724221059053/69EBF132D08DADA1D750B8A914851E8B.rar' },
      { label: 'USD', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724221082271/83320E45E4458A0BE79F6FFE969296A3.rar' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/gif/1717661067631/9A2735FEB71C5860A29C35759A26F940.gif'
  }),
  item({
    id: 'splashing-deformation',
    category: 'model',
    categoryLabel: 'PHYSICAL MODEL',
    title: '飞溅变形模型',
    summary: '模拟细小物体自然散落与堆叠的姿态。',
    description: '为薯片、花生等细小模型生成不规则堆叠和飞溅状态，增强训练数据的姿态多样性。',
    formats: [ 'BLENDER', 'FBX', 'OBJ', 'USD' ],
    tags: [ '姿态生成', '物理模拟' ],
    downloads: [
      { label: 'BLENDER', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724208646865/6CAE9576D6E2660C7CA56568BD4BD577.rar' },
      { label: 'FBX', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724208725309/893D0BE0FFAF62585B74FEC70C07D946.rar' },
      { label: 'OBJ', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724208745386/551D3E350CEA3582EB1849658C1C9D70.rar' },
      { label: 'USD', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724208756606/33C4B10B609CBF035B75D737D77C5266.rar' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/gif/1717661142788/858419DD2D4184AFF8EE498077EC4517.gif'
  }),
  item({
    id: 'fractured-deformation',
    category: 'model',
    categoryLabel: 'PHYSICAL MODEL',
    title: '破碎变形模型',
    summary: '模拟完整物体受力后的自然破碎效果。',
    description: '通过断裂模拟让完整模型生成自然、真实的碎裂状态，为物理交互与异常状态识别提供样例。',
    formats: [ 'BLENDER', 'FBX', 'OBJ', 'USD' ],
    tags: [ '破碎模拟', '异常状态' ],
    downloads: [
      { label: 'BLENDER', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724219881169/DFD0BA94295C8788B68E11C45A36C7EA.rar' },
      { label: 'FBX', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724219961249/616D2DA3FCCDD07A430D646AEC493CC0.rar' },
      { label: 'OBJ', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724219974855/BE7E2D9FD9B6B4244E26DC80FDD1D6DB.rar' },
      { label: 'USD', url: 'https://qhstaticssl.kujiale.com/application/octetstream/1724219990126/972951930FAC3CC90B859968502B1DA4.rar' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/jpeg/1717660225673/6DA7107535651F1C18408F8DB63E4A82.jpg'
  }),
  item({
    id: 'indoor-scene',
    category: 'scene',
    categoryLabel: 'SCENE DATASET',
    title: '室内家居场景',
    summary: '覆盖客厅、卧室、卫生间和厨房的室内场景。',
    description: '包含实例分割清理、精确语义标注和部分组件关系信息，并使用矩形灯模拟真实照明环境。',
    formats: [ 'USD' ],
    tags: [ '语义标注', '实例分割' ],
    downloads: [
      { label: 'USD', url: 'https://kloudsim-oss.kujiale.com/website_dataset/usd/home.zip' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/jpeg/1717660330081/FE2E475A00559BB6D3DD346AC25D177B.jpg'
  }),
  item({
    id: 'commercial-space-scene',
    category: 'scene',
    categoryLabel: 'SCENE DATASET',
    title: '商业空间场景',
    summary: '面向餐厅、厨房、用餐区和吧台的商业空间数据。',
    description: '提供商业空间中的模型、布局、语义与实例信息，可用于视觉理解和机器人仿真任务。',
    formats: [ 'USD' ],
    tags: [ '商业空间', '仿真' ],
    downloads: [
      { label: 'USD', url: 'https://kloudsim-oss.kujiale.com/website_dataset/usd/restaurant.zip' }
    ],
    previewUrl: 'https://qhstaticssl.kujiale.com/image/png/1719389239668/9927B9913EC74DD80ABCAD25B2C9361C.png'
  }),
  item({
    id: 'object-recognition',
    category: 'image',
    categoryLabel: 'IMAGE DATASET',
    title: '物体识别数据集',
    summary: '将不同产品放入不同场景中进行识别。',
    description: '样例数据集选择两个产品并放置在四个室内场景中，适合验证物体识别与跨场景泛化能力。',
    formats: [ 'RGB', 'MASK', 'DEPTH' ],
    tags: [ '物体识别', '多场景' ],
    downloads: [
      { label: 'DATASET ZIP', url: 'https://kloudsim-oss.kujiale.com/website_dataset/object_recognition/object_recognition.zip' }
    ],
    previewUrl: 'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/object_recognition/rgb.jpg',
    galleryUrls: [
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/object_recognition/rgb.jpg',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/object_recognition/mask.png',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/object_recognition/depth.png'
    ]
  }),
  item({
    id: 'bow-shaped-trajectory',
    category: 'image',
    categoryLabel: 'IMAGE DATASET',
    title: '室内弓形轨迹合成数据集',
    summary: '模拟扫地机器人清扫时的室内轨迹数据。',
    description: '以室内家居场景模拟扫地机器人运动轨迹，输出相机位姿、深度图、COCO 标注、法线图和语义图。',
    formats: [ 'RGB', 'DEPTH', 'NORMAL', 'SEMANTIC' ],
    tags: [ '轨迹', '机器人' ],
    downloads: [
      { label: 'DATASET ZIP', url: 'https://kloudsim-oss.kujiale.com/website_dataset/world_cognition/low_I-shaped_traj.zip' }
    ],
    previewUrl: 'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/low_I-shaped_traj/rgb.jpg',
    galleryUrls: [
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/low_I-shaped_traj/rgb.jpg',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/low_I-shaped_traj/semantic.png',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/low_I-shaped_traj/depth.png',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/low_I-shaped_traj/normal.png',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/low_I-shaped_traj/texture.png'
    ]
  }),
  item({
    id: 'random-roaming',
    category: 'image',
    categoryLabel: 'IMAGE DATASET',
    title: '室内随机漫游合成数据集',
    summary: '模拟人在室内行走视角下的多通道图像数据。',
    description: '以室内场景模拟随机漫游视角，提供相机位姿、深度图、COCO 标注、法线图、渲染图和反照率图。',
    formats: [ 'RGB', 'DEPTH', 'NORMAL', 'ALBEDO' ],
    tags: [ '随机轨迹', '室内视觉' ],
    downloads: [
      { label: 'DATASET ZIP', url: 'https://kloudsim-oss.kujiale.com/website_dataset/world_cognition/roam_traj.zip' }
    ],
    previewUrl: 'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/roam_traj/rgb.jpg',
    galleryUrls: [
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/roam_traj/rgb.jpg',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/roam_traj/semantic.png',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/roam_traj/depth.png',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/roam_traj/normal.png',
      'https://kloudsim-oss.kujiale.com/website_dataset/show_pics/roam_traj/texture.png'
    ]
  })
];
