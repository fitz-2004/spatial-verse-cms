import { homeMockContent, type HomeContent } from './mock';

type UnknownRecord = Record<string, any>;

function text(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function exactArray(value: unknown, length: number) {
  return Array.isArray(value) && value.length === length ? value : null;
}

function attachmentUrl(attachment: UnknownRecord | null | undefined) {
  if (!attachment || typeof attachment !== 'object') return undefined;
  return attachment._url
    || attachment._urls?.original
    || attachment.attachment?._url
    || attachment.attachment?._urls?.original;
}

function mediaFromCms(
  attachment: UnknownRecord | null | undefined,
  fallback: HomeContent['mission']['stages'][number]['media'],
  cmsField: string
) {
  return {
    ...fallback,
    cmsField,
    src: attachmentUrl(attachment) || fallback.src
  };
}

/**
 * Converts the Apostrophe Home Page document to the already approved React
 * content contract. Missing draft fields fall back one-by-one so a new or
 * partially edited database never breaks the visual page.
 */
export function homeContentFromApostrophe(page: UnknownRecord = {}): HomeContent {
  const fallback = homeMockContent;
  const cmsSolutions = exactArray(page.homeSolutions, fallback.solutions.length);
  const cmsCapabilities = exactArray(page.homeCapabilities, fallback.capabilities.length);
  const cmsMetrics = exactArray(page.homeMetrics, fallback.metrics.length);
  const cmsSupportModes = exactArray(page.homeSupport?.modes, fallback.support.modes.length);

  const solutions = fallback.solutions.map((defaultSolution, index) => {
    const value = cmsSolutions?.[index] || {};
    return {
      ...defaultSolution,
      id: text(value.key, defaultSolution.id),
      slug: text(value.slug, defaultSolution.slug).toLowerCase(),
      title: text(value.title, defaultSolution.title),
      description: text(value.description, defaultSolution.description)
    };
  });

  const missionStages = fallback.mission.stages.map((defaultStage, index) => {
    const value = cmsSolutions?.[index] || {};
    return {
      ...defaultStage,
      label: text(value.stageLabel, defaultStage.label),
      signal: text(value.stageSignal, defaultStage.signal),
      status: text(value.stageStatus, defaultStage.status),
      insight: text(value.stageInsight, defaultStage.insight),
      media: mediaFromCms(value.media, defaultStage.media, `homeSolutions.${index}.media`),
      targetSolution: index
    };
  });

  const capabilities = fallback.capabilities.map((defaultCapability, index) => {
    const value = cmsCapabilities?.[index] || {};
    return {
      ...defaultCapability,
      key: text(value.key, defaultCapability.key),
      number: text(value.number, defaultCapability.number),
      label: text(value.label, defaultCapability.label),
      title: text(value.title, defaultCapability.title),
      text: text(value.text, defaultCapability.text),
      media: mediaFromCms(value.media, defaultCapability.media, `homeCapabilities.${index}.media`)
    };
  });

  return {
    ...fallback,
    brand: {
      ...fallback.brand,
      kicker: text(page.homeBrand?.kicker, fallback.brand.kicker),
      name: text(page.homeBrand?.title, fallback.brand.name),
      descriptor: text(page.homeBrand?.descriptor, fallback.brand.descriptor)
    },
    hero: {
      ...fallback.hero,
      eyebrow: text(page.homeHero?.eyebrow, fallback.hero.eyebrow),
      title: text(page.homeHero?.title, fallback.hero.title),
      description: text(page.homeHero?.description, fallback.hero.description),
      primaryCta: text(page.homeHero?.primaryCtaLabel, fallback.hero.primaryCta),
      primaryTarget: text(page.homeHero?.primaryCtaTarget, fallback.hero.primaryTarget),
      secondaryCta: text(page.homeHero?.secondaryCtaLabel, fallback.hero.secondaryCta),
      secondaryHref: text(page.homeHero?.secondaryCtaHref, fallback.hero.secondaryHref)
    },
    solutionsIntro: {
      eyebrow: text(page.homeSolutionsIntro?.eyebrow, fallback.solutionsIntro.eyebrow),
      title: text(page.homeSolutionsIntro?.title, fallback.solutionsIntro.title),
      description: text(page.homeSolutionsIntro?.description, fallback.solutionsIntro.description)
    },
    mission: {
      ...fallback.mission,
      title: text(page.homeMission?.title, fallback.mission.title),
      coreTop: text(page.homeMission?.coreTop, fallback.mission.coreTop),
      coreBottom: text(page.homeMission?.coreBottom, fallback.mission.coreBottom),
      stages: missionStages
    },
    solutions,
    capabilitiesIntro: {
      eyebrow: text(page.homeCapabilitiesIntro?.eyebrow, fallback.capabilitiesIntro.eyebrow),
      title: text(page.homeCapabilitiesIntro?.title, fallback.capabilitiesIntro.title),
      description: text(page.homeCapabilitiesIntro?.description, fallback.capabilitiesIntro.description)
    },
    capabilities,
    why: {
      ...fallback.why,
      eyebrow: text(page.homeWhy?.eyebrow, fallback.why.eyebrow),
      title: text(page.homeWhy?.title, fallback.why.title),
      text: text(page.homeWhy?.text, fallback.why.text),
      link: text(page.homeWhy?.linkLabel, fallback.why.link),
      href: text(page.homeWhy?.linkHref, fallback.why.href)
    },
    metrics: fallback.metrics.map((defaultMetric, index) => {
      const value = cmsMetrics?.[index] || {};
      return {
        value: text(value.value, defaultMetric.value),
        label: text(value.label, defaultMetric.label)
      };
    }),
    support: {
      ...fallback.support,
      eyebrow: text(page.homeSupport?.eyebrow, fallback.support.eyebrow),
      title: text(page.homeSupport?.title, fallback.support.title),
      description: text(page.homeSupport?.description, fallback.support.description),
      platformLabel: text(page.homeSupport?.platformLabel, fallback.support.platformLabel),
      linkLabel: text(page.homeSupport?.linkLabel, fallback.support.linkLabel),
      linkHref: text(page.homeSupport?.linkHref, fallback.support.linkHref),
      modes: fallback.support.modes.map((defaultMode, index) => (
        text(cmsSupportModes?.[index]?.title, defaultMode)
      ))
    }
  };
}
