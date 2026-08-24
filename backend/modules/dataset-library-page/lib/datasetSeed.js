const download = (label, url) => ({ label, url });

const source = (sourceKey, category, title, summary, description, formats, tags, downloads, media = {}) => ({
  sourceKey,
  category,
  title,
  summary,
  description,
  formats: formats.map((label) => ({ label })),
  tags: tags.map((label) => ({ label })),
  downloads,
  ...media
});

export const datasetPageSeed = {
  title: '样例数据集',
  introEyebrow: 'CORE DATA / 03',
  introTitle: '样例数据集',
  introLead: '基于群核丰富的数据库资源，我们通过技术能力驱动的数据产品，满足 AIGC、计算机视觉与机器人等行业的数据需求。',
  libraryEyebrow: 'DATASET LIBRARY / SEARCH NODE',
  libraryTitle: '数据集资源库',
  libraryLead: '按数据类型和关键词筛选，打开卡片查看详情并预览下载信息。',
  searchPlaceholder: '搜索数据集名称、标签或格式',
  emptyTitle: 'NO DATA SIGNAL',
  emptyMessage: '没有找到匹配的数据集，请更换关键词或分类。',
  seoTitle: '样例数据集 - 群核空间智能平台',
  seoDescription: '基于群核丰富的数据库资源，我们通过技术能力驱动的数据产品，满足 AIGC、计算机视觉与机器人等行业的数据需求。',
  seoKeywords: '样例数据集, 模型数据, 场景数据, 图像数据, 群核空间智能平台',
  seoRobots: 'index-follow',
  seoTwitterCard: 'summary_large_image'
};

export const datasetSeed = [
  source('electrical-appliances', 'model', '家电模型', '适用于物体识别与室内场景理解的基础模型。', '包含常见家电模型与材质信息，适合用于物体识别、场景理解与模型检索任务。', ['OBJ', 'BLENDER'], ['基础信息', '材质'], [
    download('OBJ', 'https://kloudsim-oss.kujiale.com/website_dataset/models/electric_kettle/base/electirc_kettle_community.zip'),
    download('BLENDER', 'https://kloudsim-oss.kujiale.com/website_dataset/models/electric_kettle/base/electric_kettle_community.blend')
  ], { coverFile: 'electrical-appliances.png' }),
  source('professional-electrical-appliances', 'model', '专业家电模型', '提供组件结构与标准命名的高规格家电模型。', '在基础信息与材质之外，补充组件结构和标准命名约束，方便进入更复杂的数据处理和仿真流程。', ['FBX + PBR', 'BLENDER', 'USD'], ['组件结构', '标准命名'], [
    download('FBX + PBR', 'https://qhstaticssl.kujiale.com/application/xzipcompressed/1727248740813/21D8DC68270D7C94AC0B33564EEDD089.zip'),
    download('BLENDER', 'https://kloudsim-oss.kujiale.com/website_dataset/models/electric_kettle/professional/electric_kettle_professional.blend'),
    download('USD', 'https://kloudsim-oss.kujiale.com/website_dataset/models/electric_kettle/professional/electric_kettle_professional_usd.zip')
  ], { coverFile: 'professional-electrical-appliances.png' }),
  source('furniture', 'model', '家具模型', '覆盖室内常见家具的可复用三维模型资源。', '提供可复用的室内家具模型与材质资源，适用于训练、渲染和场景搭建。', ['OBJ', 'BLENDER'], ['基础信息', '材质'], [
    download('OBJ', 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/base/shoe_cabinet_community.zip'),
    download('BLENDER', 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/base/shoe_cabinet_community.blend')
  ], { coverFile: 'furniture.jpg' }),
  source('professional-furniture', 'model', '专业家具模型', '带有完整结构信息的专业级家具数据。', '包含模型组件结构、标准命名与材质信息，为交互式模型和物理增强应用提供基础。', ['FBX + PBR', 'BLENDER', 'USD'], ['组件结构', '标准命名'], [
    download('FBX + PBR', 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/professional/shoe_cabinet_professional.zip'),
    download('BLENDER', 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/professional/shoe_cabinet_professional.blend'),
    download('USD', 'https://kloudsim-oss.kujiale.com/website_dataset/models/shoe_cabinet/professional/shoe_cabinet_professional_usd.zip')
  ], { coverFile: 'professional-furniture.jpg' }),
  source('teapot', 'model', '茶壶模型', '小型物体识别与材质研究的示例模型。', '适合用于单物体识别、材质分析和基础渲染任务的轻量级模型样例。', ['BLENDER'], ['识别', '材质'], [
    download('BLENDER', 'https://qhstaticssl.kujiale.com/application/octetstream/1717730158718/CBDA6ABEFAF44EF0950FEEDFB587708D.rar')
  ], { coverFile: 'teapot.gif' }),
  source('wardrobe', 'model', '衣柜模型', '室内物体理解与空间布局任务的模型样例。', '适合用于室内空间理解、物体检测和家具布局相关的研究任务。', ['USD', 'BLENDER'], ['室内', '布局'], [
    download('USD', 'https://qhstaticssl.kujiale.com/application/octetstream/1717730346762/4C4430979334FE7F239F4B7346887804.rar'),
    download('BLENDER', 'https://qhstaticssl.kujiale.com/application/octetstream/1718251093378/456935AF5DE3F15036566658541F6A22.rar')
  ], { coverFile: 'wardrobe.gif' }),
  source('oven', 'model', '物理增强烤箱', '带真实尺寸、结构和物理仿真信息的模型。', '包含碰撞体、仿真参数、父子绑定关系、真实世界尺寸与结构信息，可用于物理交互研究。', ['USD', 'BLENDER'], ['物理仿真', '真实尺寸'], [
    download('USD', 'https://qhstaticssl.kujiale.com/application/octetstream/1725350440709/56856A1B66C571C5D183499D64208E3D.rar'),
    download('BLENDER', 'https://qhstaticssl.kujiale.com/application/octetstream/1718251053263/CFB502B85477AA88453F0D62C37FDA08.rar')
  ], { coverFile: 'oven.gif' }),
  source('flexible-deformation', 'model', '柔性变形模型', '通过物理模拟生成更自然的柔性物体姿态。', '通过物理模拟为窗帘、枕头、纸巾等柔性模型生成丰富姿态，适用于接触与变形研究。', ['FBX', 'OBJ', 'USD'], ['柔性变形', '物理模拟'], [
    download('FBX', 'https://qhstaticssl.kujiale.com/application/octetstream/1724220975544/58E00E6A3A3E42BEB2CFF9C443047D99.rar'),
    download('OBJ', 'https://qhstaticssl.kujiale.com/application/octetstream/1724221059053/69EBF132D08DADA1D750B8A914851E8B.rar'),
    download('USD', 'https://qhstaticssl.kujiale.com/application/octetstream/1724221082271/83320E45E4458A0BE79F6FFE969296A3.rar')
  ], { coverFile: 'flexible-deformation.gif' }),
  source('splashing-deformation', 'model', '飞溅变形模型', '模拟细小物体自然散落与堆叠的姿态。', '为薯片、花生等细小模型生成不规则堆叠和飞溅状态，增强训练数据的姿态多样性。', ['BLENDER', 'FBX', 'OBJ', 'USD'], ['姿态生成', '物理模拟'], [
    download('BLENDER', 'https://qhstaticssl.kujiale.com/application/octetstream/1724208646865/6CAE9576D6E2660C7CA56568BD4BD577.rar'),
    download('FBX', 'https://qhstaticssl.kujiale.com/application/octetstream/1724208725309/893D0BE0FFAF62585B74FEC70C07D946.rar'),
    download('OBJ', 'https://qhstaticssl.kujiale.com/application/octetstream/1724208745386/551D3E350CEA3582EB1849658C1C9D70.rar'),
    download('USD', 'https://qhstaticssl.kujiale.com/application/octetstream/1724208756606/33C4B10B609CBF035B75D737D77C5266.rar')
  ], { coverFile: 'splashing-deformation.gif' }),
  source('fractured-deformation', 'model', '破碎变形模型', '模拟完整物体受力后的自然破碎效果。', '通过断裂模拟让完整模型生成自然、真实的碎裂状态，为物理交互与异常状态识别提供样例。', ['BLENDER', 'FBX', 'OBJ', 'USD'], ['破碎模拟', '异常状态'], [
    download('BLENDER', 'https://qhstaticssl.kujiale.com/application/octetstream/1724219881169/DFD0BA94295C8788B68E11C45A36C7EA.rar'),
    download('FBX', 'https://qhstaticssl.kujiale.com/application/octetstream/1724219961249/616D2DA3FCCDD07A430D646AEC493CC0.rar'),
    download('OBJ', 'https://qhstaticssl.kujiale.com/application/octetstream/1724219974855/BE7E2D9FD9B6B4244E26DC80FDD1D6DB.rar'),
    download('USD', 'https://qhstaticssl.kujiale.com/application/octetstream/1724219990126/972951930FAC3CC90B859968502B1DA4.rar')
  ], { coverFile: 'fractured-deformation.jpg' }),
  source('indoor-scene', 'scene', '室内家居场景', '覆盖客厅、卧室、卫生间和厨房的室内场景。', '包含实例分割清理、精确语义标注和部分组件关系信息，并使用矩形灯模拟真实照明环境。', ['USD'], ['语义标注', '实例分割'], [
    download('USD', 'https://kloudsim-oss.kujiale.com/website_dataset/usd/home.zip')
  ], { coverFile: 'indoor-scene.jpg' }),
  source('commercial-space-scene', 'scene', '商业空间场景', '面向餐厅、厨房、用餐区和吧台的商业空间数据。', '提供商业空间中的模型、布局、语义与实例信息，可用于视觉理解和机器人仿真任务。', ['USD'], ['商业空间', '仿真'], [
    download('USD', 'https://kloudsim-oss.kujiale.com/website_dataset/usd/restaurant.zip')
  ], { coverFile: 'commercial-space-scene.png' }),
  source('object-recognition', 'image', '物体识别数据集', '将不同产品放入不同场景中进行识别。', '样例数据集选择两个产品并放置在四个室内场景中，适合验证物体识别与跨场景泛化能力。', ['RGB', 'MASK', 'DEPTH'], ['物体识别', '多场景'], [
    download('DATASET ZIP', 'https://kloudsim-oss.kujiale.com/website_dataset/object_recognition/object_recognition.zip')
  ], { coverFile: 'object-recognition-rgb.jpg', galleryFiles: ['object-recognition-rgb.jpg', 'object-recognition-mask.png', 'object-recognition-depth.png'] }),
  source('bow-shaped-trajectory', 'image', '室内弓形轨迹合成数据集', '模拟扫地机器人清扫时的室内轨迹数据。', '以室内家居场景模拟扫地机器人运动轨迹，输出相机位姿、深度图、COCO 标注、法线图和语义图。', ['RGB', 'DEPTH', 'NORMAL', 'SEMANTIC'], ['轨迹', '机器人'], [
    download('DATASET ZIP', 'https://kloudsim-oss.kujiale.com/website_dataset/world_cognition/low_I-shaped_traj.zip')
  ], { coverFile: 'bow-shaped-trajectory-rgb.jpg', galleryFiles: ['bow-shaped-trajectory-rgb.jpg', 'bow-shaped-trajectory-semantic.png', 'bow-shaped-trajectory-depth.png', 'bow-shaped-trajectory-normal.png', 'bow-shaped-trajectory-texture.png'] }),
  source('random-roaming', 'image', '室内随机漫游合成数据集', '模拟人在室内行走视角下的多通道图像数据。', '以室内场景模拟随机漫游视角，提供相机位姿、深度图、COCO 标注、法线图、渲染图和反照率图。', ['RGB', 'DEPTH', 'NORMAL', 'ALBEDO'], ['随机轨迹', '室内视觉'], [
    download('DATASET ZIP', 'https://kloudsim-oss.kujiale.com/website_dataset/world_cognition/roam_traj.zip')
  ], { coverFile: 'random-roaming-rgb.jpg', galleryFiles: ['random-roaming-rgb.jpg', 'random-roaming-semantic.png', 'random-roaming-depth.png', 'random-roaming-normal.png', 'random-roaming-texture.png'] })
];
