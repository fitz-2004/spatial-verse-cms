import path from 'node:path';

const productContent = [
  {
    title: 'AI Agent Understanding',
    displayTitleZh: '智能体感知',
    displayTitleEn: 'AI Agent Understanding',
    descriptionZh: '室内智能设备诸如扫地机器人，家庭看护机器人，室内无人机等，需要面对复杂的室内环境，并具备环境建图，导航规划，物体识别能力，群核空间智能平台旨在通过大规模的室内环境数据，比如带标注的2D图片数据集以及3D环境数据，帮助智能设备厂商以高性价比的方式实现数据采集和使用。',
    descriptionEn: 'Indoor smart devices such as robotic vacuum cleaners, home care robots, and indoor drones must cope with complex environments while mapping spaces, planning navigation, and recognizing objects. SpatialVerse helps manufacturers collect and use data cost-effectively through large-scale indoor environmental data, including annotated 2D image datasets and 3D environments.',
    pageKey: 'aiAgent'
  },
  {
    title: 'AIGC',
    displayTitleZh: 'AIGC',
    displayTitleEn: 'AIGC',
    descriptionZh: 'AIGC技术爆发的时代，诞生了多种生成式大模型，通常这些模型是基于大量数据进行预训练，群核空间智能平台可以提供包括图像，视频，模型等多种要素的训练数据资源，并具备完整的标签体系，帮助AIGC研究者实现大模型技术突破。',
    descriptionEn: 'In the era of generative AI, large models are pre-trained on vast amounts of data. SpatialVerse provides training resources across images, videos, models, and other modalities, together with a comprehensive labeling system, helping AIGC researchers achieve breakthroughs in large-model technology.',
    pageKey: 'aigc'
  },
  {
    title: 'Robotic Simulation',
    displayTitleZh: '机器人仿真',
    displayTitleEn: 'Robotic Simulation',
    descriptionZh: '机器人仿真可以快速，低成本，安全的对产品进行验证，群核空间智能平台通过提供高渲染和物理真实性的仿真环境，并结合具体仿真平台打造仿真环境数据库，为企业机器人仿真提供助力。',
    descriptionEn: 'Robot simulation enables fast, cost-effective, and safe product validation. SpatialVerse combines high rendering quality and physical realism with leading simulation platforms to build simulation environment databases for enterprise robotics.',
    pageKey: 'roboticSimulation'
  },
  {
    title: 'Visualized Product Promotion',
    displayTitleZh: '产品可视化推广',
    displayTitleEn: 'Visualized Product Promotion',
    descriptionZh: '数字化展示是一种可以让客户直观感受产品魅力的手段，群核空间智能平台通过3D数据资源库以及高逼真的环境展示能力，通过数据赋能，让用户在虚拟环境中感受产品魅力。',
    descriptionEn: 'Digital visualization lets customers experience the value of a product directly. With a 3D data resource library and high-fidelity environmental presentation, SpatialVerse enables users to experience products inside virtual environments.',
    pageKey: 'visualizedProductPromotion'
  },
  {
    title: 'XR',
    displayTitleZh: 'XR',
    displayTitleEn: 'XR',
    descriptionZh: '高质量数据集能显著提升AR/VR/MR系统的环境适应能力和用户体验，如精确的虚实结合效果、顺畅的交互操作等。同时，数据集也赋能内容创作者获取必要的3D模型、材质和动画资源，推动内容创新，从而有力推进XR技术的整体进步与广泛应用。',
    descriptionEn: 'High-quality datasets improve the environmental adaptability and user experience of AR, VR, and MR systems through precise virtual-physical integration and smooth interaction. They also give creators access to essential 3D models, materials, and animation resources, accelerating XR innovation and adoption.',
    pageKey: 'xr'
  }
];

const capabilityContent = [
  {
    title: 'Physical Enhancement',
    displayTitleZh: '物理增强能力',
    displayTitleEn: 'Physical Enhancement',
    descriptionZh: '赋予模型密度、摩擦力、弹性、阻尼等真实的物理性质信息，同时还可以对活动部件进行可活动的物理约束。',
    descriptionEn: 'Models receive realistic physical properties such as density, friction, elasticity, and damping, together with motion constraints for interactive components.',
    videoUrl: 'https://qhstaticva-cos.kujiale.com/media/yun/help/video/UID_a1968381_3971_4554_1716348562431.mp4'
  },
  {
    title: 'Segmentation and Annotation',
    displayTitleZh: '分割标注能力',
    displayTitleEn: 'Segmentation & Annotation',
    descriptionZh: '自动化结合人工标注技术，可实现包含语义、材质、状态等多种形态信息标注。',
    descriptionEn: 'Automated and human-assisted annotation supports semantic, material, state, and other forms of structured information.',
    videoUrl: 'https://qhstaticva-cos.kujiale.com/media/yun/help/video/UID_e6022c6d_e752_45d8_1716349035496.mp4'
  },
  {
    title: 'Environment Augmentation',
    displayTitleZh: '场景增强能力',
    displayTitleEn: 'Environment Augmentation',
    descriptionZh: '通过场景设计工具、场景繁化、模型变形、场景光线模拟等能力，使场景数据更多样。',
    descriptionEn: 'Scene design, enrichment, model deformation, and lighting simulation tools create more diverse scene data.',
    videoUrl: 'https://qhstaticva-cos.kujiale.com/media/yun/help/video/UID_66daa03e_833f_4f44_1716349172425.mp4'
  },
  {
    title: 'Eco-Linker',
    displayTitleZh: '多通道支持能力',
    displayTitleEn: 'Eco-Linker',
    descriptionZh: '支持多平台、高效率、更完整的3D模型数据导出，以及3D环境和衍生图片生成能力。',
    descriptionEn: 'Multi-platform support enables efficient, complete 3D model export plus 3D environment and derived image generation.',
    videoUrl: 'https://qhstaticva-cos.kujiale.com/media/yun/help/video/UID_9f2fe7ef_7cbb_426a_1739954029179.mov'
  }
];

export default {
  tasks(self) {
    return {
      import: {
        usage: 'Import the approved SpatialVerse homepage content into ApostropheCMS.',
        async task() {
          const apos = self.apos;
          const draftReq = apos.task.getReq({ mode: 'draft' });
          const pages = await ensurePlaceholderPages(apos, draftReq);
          const images = await ensureImages(apos, draftReq);
          const products = [];
          for (const content of productContent) {
            products.push(await upsertPiece(apos.modules.product, draftReq, {
              ...content,
              _detailPage: [ pages[content.pageKey] ]
            }));
          }
          const capabilities = [];
          for (const content of capabilityContent) {
            capabilities.push(await upsertPiece(apos.modules.capability, draftReq, {
              ...content,
              _detailPage: [ pages.coreCompetency ]
            }));
          }

          await updateGlobal(apos, draftReq, pages);
          await updateHome(apos, draftReq, pages, images, products, capabilities);
          apos.util.log('SpatialVerse homepage content imported and published. Placeholder pages remain draft-only.');
        }
      }
    };
  }
};

async function ensurePlaceholderPages(apos, req) {
  const home = await apos.page.find(req, { slug: '/' }).toObject();
  if (!home) throw new Error('The Apostrophe home page was not found.');

  const coohomcloud = await ensurePage(apos, req, home, '/coohomcloud', 'SpatialVerse Route Container');
  const solutions = await ensurePage(apos, req, coohomcloud, '/coohomcloud/Solutions', 'Solutions');
  const coreCompetency = await ensurePage(apos, req, coohomcloud, '/coohomcloud/CoreCompetency', 'Core Competency');

  return {
    home,
    coohomcloud,
    solutions,
    coreCompetency,
    aiAgent: await ensurePage(apos, req, solutions, '/coohomcloud/Solutions/AIAgent', 'AI Agent Understanding'),
    aigc: await ensurePage(apos, req, solutions, '/coohomcloud/Solutions/AIGC', 'AIGC'),
    roboticSimulation: await ensurePage(apos, req, solutions, '/coohomcloud/Solutions/RoboticSimulation', 'Robotic Simulation'),
    visualizedProductPromotion: await ensurePage(apos, req, solutions, '/coohomcloud/Solutions/VisualizedProductPromotion', 'Visualized Product Promotion'),
    xr: await ensurePage(apos, req, solutions, '/coohomcloud/Solutions/XR', 'XR'),
    paper: await ensurePage(apos, req, coreCompetency, '/coohomcloud/CoreCompetency/Paper', 'Academic Research'),
    data: await ensurePage(apos, req, coreCompetency, '/coohomcloud/CoreCompetency/Data', 'Example Datasets'),
    about: await ensurePage(apos, req, coohomcloud, '/coohomcloud/About', 'About Us'),
    minervas: await ensurePage(apos, req, coohomcloud, '/coohomcloud/minervas', 'MINERVAS')
  };
}

async function ensurePage(apos, req, parent, slug, title) {
  const existing = await apos.page.find(req, { slug }).toObject();
  if (existing) return existing;
  return apos.page.insert(req, parent._id, 'lastChild', {
    title,
    slug,
    type: 'default-page',
    main: emptyArea(apos)
  });
}

async function ensureImages(apos, req) {
  const imageDir = path.resolve(apos.rootDir, '../frontend/public/captured-site/assets/support');
  return {
    dataSolutions: await upsertImage(apos, req, 'Support Mode - Data Solutions', path.join(imageDir, 'data-solutions.png')),
    customProcessing: await upsertImage(apos, req, 'Support Mode - Custom Processing', path.join(imageDir, 'custom-processing.png')),
    research: await upsertImage(apos, req, 'Support Mode - Research Collaboration', path.join(imageDir, 'research-collaboration.jpg'))
  };
}

async function upsertImage(apos, req, title, sourcePath) {
  const existing = await apos.image.find(req, { title }).toObject();
  if (existing) return existing;
  const attachment = await apos.attachment.insert(req, {
    name: path.basename(sourcePath),
    path: sourcePath
  });
  const image = apos.image.newInstance();
  Object.assign(image, { title, alt: title, attachment });
  const inserted = await apos.image.insert(req, image);
  await apos.image.publish(req, inserted);
  return inserted;
}

async function upsertPiece(manager, req, content) {
  let piece = await manager.find(req, { title: content.title }).toObject();
  if (piece) {
    Object.assign(piece, content);
    piece = await manager.update(req, piece);
  } else {
    piece = manager.newInstance();
    Object.assign(piece, content);
    piece = await manager.insert(req, piece);
  }
  await manager.publish(req, piece);
  return piece;
}

async function updateGlobal(apos, req, pages) {
  let global = await apos.global.find(req).toObject();
  Object.assign(global, {
    brandLabel: 'SPATIAL VERSE',
    brandAriaLabelZh: '群核空间智能平台首页',
    brandAriaLabelEn: 'SpatialVerse home page',
    _homePage: [ pages.home ],
    homeLabelZh: '首页',
    homeLabelEn: 'Home',
    solutionsLabelZh: '解决方案',
    solutionsLabelEn: 'Solutions',
    capabilitiesLabelZh: '核心能力',
    capabilitiesLabelEn: 'Core Competency',
    _capabilitiesPage: [ pages.coreCompetency ],
    researchLabelZh: '学术研究',
    researchLabelEn: 'Academic Research',
    _researchPage: [ pages.paper ],
    datasetsLabelZh: '样例数据集',
    datasetsLabelEn: 'Example Datasets',
    _datasetsPage: [ pages.data ],
    aboutLabelZh: '关于我们',
    aboutLabelEn: 'About Us',
    _aboutPage: [ pages.about ],
    contactLabelZh: '联系我们',
    contactLabelEn: 'Contact Us',
    footerDescriptionZh: '群核空间智能平台，面向 AI、机器人与 XR 的室内合成数据与仿真生态。',
    footerDescriptionEn: 'SpatialVerse is an indoor synthetic-data and simulation ecosystem for AI, robotics, and XR.',
    email: 'cloud@coohom.com',
    phoneLabel: '+1 (213) 465-0013',
    phoneNumber: '+12134650013',
    datasetProductLabel1: '2D Synthetic Datasets/Videos',
    datasetProductLabel2: '3D Models',
    datasetProductLabel3: '3D Scenes',
    socialLinks: [
      arrayItem(apos, { label: 'LinkedIn', url: 'https://www.linkedin.com/company/coohomcloud' }),
      arrayItem(apos, { label: 'Twitter / X', url: 'https://www.twitter.com/Coohom_Cloud' })
    ],
    registrationLabelZh: '备案号：',
    registrationLabelEn: 'Registration number:',
    registrationNumber: '浙ICP备12022366号',
    registrationUrl: 'https://beian.miit.gov.cn/',
    businessLicenseLabelZh: '营业执照',
    businessLicenseLabelEn: 'Business License'
  });
  global = await apos.global.update(req, global);
  await apos.global.publish(req, global);
}

async function updateHome(apos, req, pages, images, products, capabilities) {
  let home = await apos.page.find(req, { slug: '/' }).toObject();
  Object.assign(home, {
    title: '首页 - 群核空间智能平台',
    seoTitle: '首页 - 群核空间智能平台',
    seoTitleEn: 'Home - SpatialVerse',
    seoDescription: '群核空间智能平台为机器人、AIGC、XR 等行业提供高质量 2D、3D 合成数据与定制数据服务。',
    seoDescriptionEn: 'SpatialVerse provides high-quality 2D and 3D synthetic data and customized data services for robotics, AIGC, XR, and more.',
    hero: area(apos, home.hero, 'hero', {
      eyebrow: 'Synthetic spatial intelligence',
      titleLeadZh: '群核空间',
      titleAccentZh: '智能平台',
      titleLeadEn: 'SpatialVerse',
      titleAccentEn: 'Intelligence Platform',
      descriptionLeadZh: 'AI数据解决方案先行者。',
      descriptionLeadEn: 'Pioneer in AI Data Solutions.',
      descriptionZh: '致力于为机器人、AIGC、XR等行业提供优质的数据服务。我们基于全球领先的室内设计平台，为您提供多样化的室内合成数据，包括图片、3D模型、3D场景等标准数据服务以及个性化定制服务。',
      descriptionEn: 'Drawing upon the richness of Manycore\'s superb interior design solution globally, SpatialVerse offers an array of dataset services, including Interior Synthetic Data Generation and 3D Virtual Assets Creation to accelerate the advancement of diverse industries such as AIGC, Robotics, AI Agents, XR and more.',
      videoUrl: 'https://qhstaticva-cos.kujiale.com/media/yun/help/college/1713781379101_2f04dd216eacf7f69eec489896058e50.mp4',
      primaryButtonLabelZh: '探索解决方案',
      primaryButtonLabelEn: 'Explore Solutions',
      primaryButtonUrl: '#solutions',
      secondaryButtonLabelZh: '下载免费数据集',
      secondaryButtonLabelEn: 'Download Free Dataset',
      _secondaryButtonPage: [ pages.data ]
    }),
    why: area(apos, home.why, 'why', {
      eyebrow: 'Why Spatial Verse',
      titleLine1Zh: '为什么',
      titleLine2Zh: '选择我们？',
      titleLine1En: 'Why Choose',
      titleLine2En: 'SpatialVerse?',
      descriptionZh: '群核科技旗下的Koolab创新实验室借助酷家乐全球最大规模的3D室内设计平台，自2018年起专注于研发3D场景虚拟合成技术。我们与国内外多家高校和科研机构展开深入合作，为群核空间智能平台提供可靠的技术支持，使其能为AIGC、机器人、室内智能体、XR等领域提供创新的虚拟合成数据产品和服务。',
      descriptionEn: 'The Koolab Innovation Lab under Manycore utilizes Coohom, the world\'s largest 3D interior design platform. Since 2018, our focus has been on developing 3D scene virtual synthesis technology. We collaborate with universities and research institutions worldwide to deliver dependable technical support and innovative synthetic data solutions for AIGC, robotics, AI agents, XR, and beyond.',
      buttonLabelZh: '探索更多学术成果',
      buttonLabelEn: 'Explore More Academic Research',
      _buttonPage: [ pages.paper ],
      metrics: [
        arrayItem(apos, { value: '45.5K', suffix: '+', labelZh: '品牌企业客户', labelEn: 'Clients' }),
        arrayItem(apos, { value: '362M', suffix: '+', labelZh: '3D商品素材模型', labelEn: '3D Assets' }),
        arrayItem(apos, { value: '640M', suffix: '+', labelZh: 'AI生成图片', labelEn: 'AI-gen Images' }),
        arrayItem(apos, { value: '200', suffix: '+', labelZh: '合作覆盖国家和地区', labelEn: 'Countries and Regions' })
      ]
    }),
    solutions: area(apos, home.solutions, 'solutions', {
      eyebrow: 'Solution matrix',
      titleLine1Zh: '从现实空间',
      titleLine2Zh: '到智能世界',
      titleLine1En: 'From Real Spaces',
      titleLine2En: 'to Intelligent Worlds',
      descriptionZh: '从感知、生成到仿真与沉浸式体验，群核空间智能平台将可规模化的室内数据转化为可用的 AI 生产力。',
      descriptionEn: 'From perception and generation to simulation and immersive experiences, SpatialVerse turns scalable indoor data into practical AI productivity.',
      previewVideoUrl: 'https://qhstaticva-cos.kujiale.com/media/yun/help/video/UID_c1de897e_97c3_4bca_1715597401034.mp4',
      cardButtonLabelZh: '了解更多',
      cardButtonLabelEn: 'View More',
      _products: products
    }),
    capabilities: area(apos, home.capabilities, 'capabilities', {
      eyebrow: 'Core capabilities',
      titleZh: '核心能力',
      titleEn: 'Our Capabilities',
      descriptionZh: '以空间数据引擎连接酷家乐海量数据库与具体应用平台，通过专业工具生成3D模型、3D环境及衍生图片数据。',
      descriptionEn: 'Our spatial data engine connects Coohom\'s large-scale database to application platforms, generating 3D models, 3D environments, and derived image data through specialized tools.',
      buttonLabelZh: '查看更多',
      buttonLabelEn: 'View More',
      _buttonPage: [ pages.coreCompetency ],
      _capabilities: capabilities
    }),
    supportModes: area(apos, home.supportModes, 'support-modes', {
      eyebrow: 'Support modes',
      titleZh: '支持模式',
      titleEn: 'How Can We Help You?',
      descriptionZh: '从标准数据服务到定制化处理，再到长期学术研究合作，围绕不同阶段的空间智能需求输出可落地的支持。',
      descriptionEn: 'From standard data services and customized processing to long-term academic collaboration, we support spatial-intelligence needs at every stage.',
      dataSolutionsTitleZh: '数据解决方案服务',
      dataSolutionsTitleEn: 'Data Solutions Services',
      _dataSolutionsImage: [ images.dataSolutions ],
      dataSolutionsImageAltZh: '空间数据解决方案与室内仿真平台',
      dataSolutionsImageAltEn: 'Spatial data solutions and indoor simulation platform',
      dataSolutionsButtonLabelZh: '了解更多',
      dataSolutionsButtonLabelEn: 'View More',
      customProcessingTitleZh: '定制化数据处理服务',
      customProcessingTitleEn: 'Customized Data Processing Services',
      _customProcessingImage: [ images.customProcessing ],
      customProcessingImageAltZh: '机器人室内仿真与定制数据处理',
      customProcessingImageAltEn: 'Indoor robot simulation and customized data processing',
      researchTitleZh: '学术研究合作',
      researchTitleEn: 'Academic Research Collaboration',
      _researchImage: [ images.research ],
      researchImageAltZh: '空间智能学术研究数据示例',
      researchImageAltEn: 'Spatial intelligence academic research data example',
      researchButtonLabelZh: '了解更多',
      researchButtonLabelEn: 'View More',
      _researchPage: [ pages.paper ]
    }),
    contact: area(apos, home.contact, 'contact', {
      eyebrow: 'Open a channel',
      titleLine1Zh: '联系',
      titleLine2Zh: '我们',
      titleLine1En: 'Contact',
      titleLine2En: 'Us',
      descriptionZh: '借助群核空间智能平台专业的数据集服务释放定制数据解决方案的力量。我们的团队专注于生成和定制2D和3D数据集，为您提供经济高效、高质量的数据获取服务。',
      descriptionEn: 'Unlock the power of tailored data solutions with SpatialVerse. Our team specializes in generating and customizing 2D and 3D datasets for unique tasks, offering seamless and cost-effective data acquisition without compromising on quality.',
      emailLabelZh: '电子邮件*',
      emailLabelEn: 'Work email*',
      submitLabelZh: '提交',
      submitLabelEn: 'Submit',
      consentZh: '我们会将您的信息添加到我们的客户关系管理，以便与您联系请求。欲了解更多信息，请联系我们 cloud@coohom.com。',
      consentEn: 'We will add your information to our CRM to contact you about your request. For more information, please contact us at cloud@coohom.com.',
      successMessageZh: '提交通道正在配置中，请先通过 cloud@coohom.com 联系我们。',
      successMessageEn: 'The submission channel is being configured. Please contact us at cloud@coohom.com.'
    })
  });
  home = await apos.page.update(req, home);
  await apos.page.publish(req, home);
}

function emptyArea(apos) {
  return {
    _id: apos.util.generateId(),
    metaType: 'area',
    items: []
  };
}

function area(apos, existing, type, fields) {
  const existingItem = existing?.items?.find((item) => item?.type === type);
  return {
    _id: existing?._id || apos.util.generateId(),
    metaType: 'area',
    items: [
      {
        _id: existingItem?._id || apos.util.generateId(),
        metaType: 'widget',
        type,
        ...fields
      }
    ]
  };
}

function arrayItem(apos, fields) {
  return {
    _id: apos.util.generateId(),
    metaType: 'arrayItem',
    ...fields
  };
}
