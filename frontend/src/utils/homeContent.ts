export type SpatialVerseLocale = 'zh' | 'en';
export type SpatialVerseCopy = Record<SpatialVerseLocale, Record<string, string>>;

function text(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function escapeHtml(value: unknown) {
  return text(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function firstWidget(area: any) {
  return Array.isArray(area?.items) ? area.items[0] || {} : {};
}

export function relationshipUrl(relationship: unknown) {
  if (!Array.isArray(relationship)) return undefined;
  const url = relationship[0]?._url;
  return typeof url === 'string' && url.trim() ? url : undefined;
}

export function createSpatialVerseCopy(page: any = {}, global: any = {}): SpatialVerseCopy {
  page = page || {};
  global = global || {};
  const hero = firstWidget(page.hero);
  const why = firstWidget(page.why);
  const solutions = firstWidget(page.solutions);
  const capabilities = firstWidget(page.capabilities);
  const modes = firstWidget(page.supportModes);
  const contact = firstWidget(page.contact);
  const products = Array.isArray(solutions._products) ? solutions._products : [];
  const capabilityItems = Array.isArray(capabilities._capabilities) ? capabilities._capabilities : [];
  const metrics = Array.isArray(why.metrics) ? why.metrics : [];

  const copy: SpatialVerseCopy = {
    zh: {
      'page.title': text(page.seoTitle || page.title),
      'nav.home': text(global.homeLabelZh),
      'nav.solutions': text(global.solutionsLabelZh),
      'nav.capabilities': text(global.capabilitiesLabelZh),
      'nav.research': text(global.researchLabelZh),
      'nav.datasets': text(global.datasetsLabelZh),
      'nav.about': text(global.aboutLabelZh),
      'nav.contact': text(global.contactLabelZh),
      'hero.title': `${escapeHtml(hero.titleLeadZh)}<span>${escapeHtml(hero.titleAccentZh)}</span>`,
      'hero.lead': `<strong>${escapeHtml(hero.descriptionLeadZh)}</strong><br>${escapeHtml(hero.descriptionZh)}`,
      'hero.solutions': text(hero.primaryButtonLabelZh),
      'hero.download': text(hero.secondaryButtonLabelZh),
      'why.title': `${escapeHtml(why.titleLine1Zh)}<br>${escapeHtml(why.titleLine2Zh)}`,
      'why.body': text(why.descriptionZh),
      'why.research': text(why.buttonLabelZh),
      'solutions.title': `${escapeHtml(solutions.titleLine1Zh)}<br>${escapeHtml(solutions.titleLine2Zh)}`,
      'solutions.intro': text(solutions.descriptionZh),
      'solutions.more': text(solutions.cardButtonLabelZh),
      'capabilities.title': text(capabilities.titleZh),
      'capabilities.intro': text(capabilities.descriptionZh),
      'capabilities.more': text(capabilities.buttonLabelZh),
      'modes.title': text(modes.titleZh),
      'modes.intro': text(modes.descriptionZh),
      'modes.solutions': text(modes.dataSolutionsTitleZh),
      'modes.solutionsAlt': text(modes.dataSolutionsImageAltZh),
      'modes.solutionsMore': text(modes.dataSolutionsButtonLabelZh),
      'modes.custom': text(modes.customProcessingTitleZh),
      'modes.customAlt': text(modes.customProcessingImageAltZh),
      'modes.research': text(modes.researchTitleZh),
      'modes.researchAlt': text(modes.researchImageAltZh),
      'modes.researchMore': text(modes.researchButtonLabelZh),
      'contact.title': `${escapeHtml(contact.titleLine1Zh)}<br>${escapeHtml(contact.titleLine2Zh)}`,
      'contact.body': text(contact.descriptionZh),
      'contact.email': text(contact.emailLabelZh),
      'contact.submit': text(contact.submitLabelZh),
      'contact.consent': text(contact.consentZh),
      'contact.success': text(contact.successMessageZh),
      'footer.body': text(global.footerDescriptionZh),
      'footer.registration': text(global.registrationLabelZh),
      'footer.license': text(global.businessLicenseLabelZh)
    },
    en: {
      'page.title': text(page.seoTitleEn || page.seoTitle || page.title),
      'nav.home': text(global.homeLabelEn),
      'nav.solutions': text(global.solutionsLabelEn),
      'nav.capabilities': text(global.capabilitiesLabelEn),
      'nav.research': text(global.researchLabelEn),
      'nav.datasets': text(global.datasetsLabelEn),
      'nav.about': text(global.aboutLabelEn),
      'nav.contact': text(global.contactLabelEn),
      'hero.title': `${escapeHtml(hero.titleLeadEn)}<span>${escapeHtml(hero.titleAccentEn)}</span>`,
      'hero.lead': `<strong>${escapeHtml(hero.descriptionLeadEn)}</strong><br>${escapeHtml(hero.descriptionEn)}`,
      'hero.solutions': text(hero.primaryButtonLabelEn),
      'hero.download': text(hero.secondaryButtonLabelEn),
      'why.title': `${escapeHtml(why.titleLine1En)}<br>${escapeHtml(why.titleLine2En)}`,
      'why.body': text(why.descriptionEn),
      'why.research': text(why.buttonLabelEn),
      'solutions.title': `${escapeHtml(solutions.titleLine1En)}<br>${escapeHtml(solutions.titleLine2En)}`,
      'solutions.intro': text(solutions.descriptionEn),
      'solutions.more': text(solutions.cardButtonLabelEn),
      'capabilities.title': text(capabilities.titleEn),
      'capabilities.intro': text(capabilities.descriptionEn),
      'capabilities.more': text(capabilities.buttonLabelEn),
      'modes.title': text(modes.titleEn),
      'modes.intro': text(modes.descriptionEn),
      'modes.solutions': text(modes.dataSolutionsTitleEn),
      'modes.solutionsAlt': text(modes.dataSolutionsImageAltEn),
      'modes.solutionsMore': text(modes.dataSolutionsButtonLabelEn),
      'modes.custom': text(modes.customProcessingTitleEn),
      'modes.customAlt': text(modes.customProcessingImageAltEn),
      'modes.research': text(modes.researchTitleEn),
      'modes.researchAlt': text(modes.researchImageAltEn),
      'modes.researchMore': text(modes.researchButtonLabelEn),
      'contact.title': `${escapeHtml(contact.titleLine1En)}<br>${escapeHtml(contact.titleLine2En)}`,
      'contact.body': text(contact.descriptionEn),
      'contact.email': text(contact.emailLabelEn),
      'contact.submit': text(contact.submitLabelEn),
      'contact.consent': text(contact.consentEn),
      'contact.success': text(contact.successMessageEn),
      'footer.body': text(global.footerDescriptionEn),
      'footer.registration': text(global.registrationLabelEn),
      'footer.license': text(global.businessLicenseLabelEn)
    }
  };

  metrics.forEach((metric: any, index: number) => {
    copy.zh[`metric.${index}`] = text(metric?.labelZh);
    copy.en[`metric.${index}`] = text(metric?.labelEn);
  });
  products.forEach((product: any, index: number) => {
    copy.zh[`solution.${index}.title`] = text(product?.displayTitleZh);
    copy.en[`solution.${index}.title`] = text(product?.displayTitleEn);
    copy.zh[`solution.${index}.body`] = text(product?.descriptionZh);
    copy.en[`solution.${index}.body`] = text(product?.descriptionEn);
  });
  capabilityItems.forEach((capability: any, index: number) => {
    copy.zh[`capability.${index}.title`] = text(capability?.displayTitleZh);
    copy.en[`capability.${index}.title`] = text(capability?.displayTitleEn);
    copy.zh[`capability.${index}.body`] = text(capability?.descriptionZh);
    copy.en[`capability.${index}.body`] = text(capability?.descriptionEn);
  });

  return copy;
}
