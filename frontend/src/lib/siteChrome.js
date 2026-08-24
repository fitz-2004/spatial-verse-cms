const paths = {
  home: '/',
  about: '/coohomcloud/about',
  solutions: [
    '/coohomcloud/solutions/aiagent',
    '/coohomcloud/solutions/aigc',
    '/coohomcloud/solutions/roboticsimulation',
    '/coohomcloud/solutions/visualizedproductpromotion',
    '/coohomcloud/solutions/xr'
  ],
  core: [
    '/coohomcloud/corecompetency',
    '/coohomcloud/corecompetency/paper',
    '/coohomcloud/corecompetency/data'
  ]
};

const defaults = {
  zh: {
    brandName: '群核空间智能平台',
    brandEnglish: 'SPATIALVERSE',
    brandDescriptor: 'AI数据解决方案先行者',
    homeLabel: '首页',
    solutionsLabel: '解决方案',
    coreLabel: '核心能力',
    aboutLabel: '关于我们',
    contactLabel: '联系我们',
    solutionLinks: [
      { label: '智能体感知', href: paths.solutions[0] },
      { label: 'AIGC', href: paths.solutions[1] },
      { label: '机器人仿真', href: paths.solutions[2] },
      { label: '产品可视化推广', href: paths.solutions[3] },
      { label: '拓展现实', href: paths.solutions[4] }
    ],
    coreLinks: [
      { label: '核心能力', href: paths.core[0] },
      { label: '学术研究', href: paths.core[1] },
      { label: '样例数据集', href: paths.core[2] }
    ],
    contactTitle: '联系我们',
    contactDescription: '借助群核空间智能平台专业的数据集服务释放定制数据解决方案的力量。我们的团队专注于生成和定制2D和3D数据集，为您提供经济高效、高质量的数据获取服务。',
    contactEmail: 'cloud@coohom.com',
    contactPhone: '+1(213)465-0013',
    contactPrivacy: '我们会将您的信息添加到我们的客户关系管理，以便与您联系。欲了解更多信息，请联系我们。',
    emailPlaceholder: '电子邮件*',
    messagePlaceholder: '请描述您的需求',
    submitLabel: '提交',
    submittedMessage: '感谢提交，我们会尽快联系您。',
    backToTopLabel: '返回顶部 ↑',
    datasetHeading: 'Our Dataset Products',
    registrationText: 'Registration number: 浙ICP备12022366号',
    businessLicenseText: 'Business License'
  },
  en: {
    brandName: 'SpatialVerse',
    brandEnglish: 'SPATIALVERSE',
    brandDescriptor: 'Pioneering AI Data Solutions',
    homeLabel: 'Home',
    solutionsLabel: 'Solutions',
    coreLabel: 'Core Competency',
    aboutLabel: 'About Us',
    contactLabel: 'Contact Us',
    solutionLinks: [
      { label: 'Agent Perception', href: paths.solutions[0] },
      { label: 'AIGC', href: paths.solutions[1] },
      { label: 'Robotic Simulation', href: paths.solutions[2] },
      { label: 'Product Visualization', href: paths.solutions[3] },
      { label: 'XR', href: paths.solutions[4] }
    ],
    coreLinks: [
      { label: 'Core Competency', href: paths.core[0] },
      { label: 'Research', href: paths.core[1] },
      { label: 'Sample Datasets', href: paths.core[2] }
    ],
    contactTitle: 'Contact Us',
    contactDescription: 'Unlock custom data solutions with SpatialVerse dataset services. Our team creates and customizes high-quality 2D and 3D datasets for efficient acquisition and delivery.',
    contactEmail: 'cloud@coohom.com',
    contactPhone: '+1(213)465-0013',
    contactPrivacy: 'We will add your information to our customer relationship system so our team can contact you.',
    emailPlaceholder: 'Email*',
    messagePlaceholder: 'Tell us about your needs',
    submitLabel: 'Submit',
    submittedMessage: 'Thank you. We will contact you soon.',
    backToTopLabel: 'Back to top ↑',
    datasetHeading: 'Our Dataset Products',
    registrationText: 'Registration number: Zhejiang ICP 12022366',
    businessLicenseText: 'Business License'
  }
};

const datasetDefaults = {
  zh: [
    {
      code: 'IMAGE',
      title: '2D Synthetic Datasets/Videos',
      description: '图片、视频与多模态训练资源',
      href: '#contact-drawer'
    },
    {
      code: 'MODEL',
      title: '3D Models',
      description: '可复用的3D模型与材质资源',
      href: '#contact-drawer'
    },
    {
      code: 'SCENE',
      title: '3D Scenes',
      description: '高渲染与物理真实性的3D场景',
      href: '#contact-drawer'
    }
  ],
  en: [
    {
      code: 'IMAGE',
      title: '2D Synthetic Datasets/Videos',
      description: 'Images, videos and multimodal training assets',
      href: '#contact-drawer'
    },
    {
      code: 'MODEL',
      title: '3D Models',
      description: 'Reusable 3D models and material assets',
      href: '#contact-drawer'
    },
    {
      code: 'SCENE',
      title: '3D Scenes',
      description: 'High-fidelity scenes with physical realism',
      href: '#contact-drawer'
    }
  ]
};

const socialDefaults = [
  {
    label: 'in',
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/coohomcloud'
  },
  {
    label: '𝕏',
    name: 'X',
    href: 'https://x.com/coohomcloud'
  }
];

function value(value, fallback) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function list(value, fallback) {
  return Array.isArray(value) && value.length ? value : fallback;
}

export function getSiteChrome(global = {}, locale = 'zh') {
  const language = locale === 'en' ? 'en' : 'zh';
  const fallback = defaults[language];
  const solutionLinks = list(global.solutionLinks, fallback.solutionLinks);
  const coreLinks = list(global.coreLinks, fallback.coreLinks);
  const fallbackGroups = [
    {
      title: fallback.solutionsLabel,
      links: solutionLinks
    },
    {
      title: fallback.coreLabel,
      links: coreLinks
    },
    {
      title: fallback.aboutLabel,
      links: [ { label: fallback.aboutLabel, href: paths.about } ]
    }
  ];

  return {
    brandName: value(global.brandName, fallback.brandName),
    brandEnglish: value(global.brandEnglish, fallback.brandEnglish),
    brandDescriptor: value(global.brandDescriptor, fallback.brandDescriptor),
    homeLabel: value(global.homeLabel, fallback.homeLabel),
    solutionsLabel: value(global.solutionsLabel, fallback.solutionsLabel),
    coreLabel: value(global.coreLabel, fallback.coreLabel),
    aboutLabel: value(global.aboutLabel, fallback.aboutLabel),
    contactLabel: value(global.contactLabel, fallback.contactLabel),
    solutionLinks,
    coreLinks,
    contactTitle: value(global.contactTitle, fallback.contactTitle),
    contactDescription: value(global.contactDescription, fallback.contactDescription),
    contactEmail: value(global.contactEmail, fallback.contactEmail),
    contactPhone: value(global.contactPhone, fallback.contactPhone),
    contactPrivacy: value(global.contactPrivacy, fallback.contactPrivacy),
    emailPlaceholder: fallback.emailPlaceholder,
    messagePlaceholder: fallback.messagePlaceholder,
    submitLabel: fallback.submitLabel,
    submittedMessage: fallback.submittedMessage,
    backToTopLabel: fallback.backToTopLabel,
    datasetHeading: fallback.datasetHeading,
    datasetLinks: list(global.datasetLinks, datasetDefaults[language]),
    footerGroups: list(global.footerGroups, fallbackGroups),
    socialLinks: list(global.socialLinks, socialDefaults),
    registrationText: value(global.registrationText, fallback.registrationText),
    businessLicenseText: value(global.businessLicenseText, fallback.businessLicenseText)
  };
}

export function localeName(locale) {
  return String(locale || 'zh').split(':')[0] === 'en' ? 'en' : 'zh';
}

export function resolveHref(link, locale = 'zh') {
  const related = Array.isArray(link?._page) ? link._page[0] : link?._page;
  const href = related?._url || link?.href || '#';
  return localizeHref(href, locale);
}

export function localizeHref(href, locale = 'zh') {
  if (!href || /^(?:[a-z]+:|#|\/\/)/i.test(href)) {
    return href || '#';
  }
  if (locale !== 'en' || !href.startsWith('/') || href === '/login') {
    return href;
  }
  if (href === '/en' || href.startsWith('/en/')) {
    return href;
  }
  return href === '/' ? '/en' : `/en${href}`;
}

export function localeSwitchHref(pathname, locale = 'zh') {
  const cleanPath = pathname || '/';
  if (locale === 'en') {
    const withoutPrefix = cleanPath.replace(/^\/en(?=\/|$)/, '');
    return withoutPrefix || '/';
  }
  return cleanPath === '/' ? '/en' : `/en${cleanPath}`;
}

export { paths };
