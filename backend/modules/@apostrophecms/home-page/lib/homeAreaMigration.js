const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const populated = (value) => typeof value === 'string' && value.trim();

const pick = (...values) => values.find(populated) || '';

const currentWidget = (area, type) => area?.items?.find(
  (item) => item?.type === type || item?.type === `${type}-widget`
);

function normalizeInlineContent(content, tag) {
  const value = String(content || '').trim();
  if (!value || /^<[a-z][a-z0-9-]*(?:\s|>)/i.test(value)) {
    return value;
  }
  return `<${tag}>${escapeHtml(value)}</${tag}>`;
}

function inlineArea(self, existing, tag, value) {
  const current = existing?.items?.find((item) => item?.type === '@apostrophecms/rich-text');
  if (populated(current?.content)) {
    const normalizedContent = normalizeInlineContent(current.content, tag);
    if (normalizedContent === current.content) {
      return existing;
    }
    return {
      ...existing,
      items: existing.items.map((item) => (
        item?._id === current._id
          ? {
              ...item,
              content: normalizedContent
            }
          : item
      ))
    };
  }
  return {
    _id: existing?._id || self.apos.util.generateId(),
    metaType: 'area',
    items: [
      {
        _id: current?._id || self.apos.util.generateId(),
        metaType: 'widget',
        type: '@apostrophecms/rich-text',
        content: `<${tag}>${escapeHtml(value)}</${tag}>`
      }
    ]
  };
}

function singletonArea(self, existing, type, fields) {
  const widget = currentWidget(existing, type);
  return {
    _id: existing?._id || self.apos.util.generateId(),
    metaType: 'area',
    items: [
      {
        _id: widget?._id || self.apos.util.generateId(),
        metaType: 'widget',
        type,
        ...fields(widget || {})
      }
    ]
  };
}

export function buildHomeAreas({
  self,
  home,
  seed,
  solutions,
  capabilities
}) {
  return {
    homeBrandArea: singletonArea(self, home.homeBrandArea, 'home-brand', (current) => ({
      kicker: inlineArea(
        self,
        current.kicker,
        'p',
        pick(home.homeBrand?.kicker, seed.page.homeBrand.kicker)
      ),
      heading: inlineArea(
        self,
        current.heading,
        'h1',
        pick(home.homeBrand?.title, seed.page.homeBrand.title)
      ),
      descriptor: inlineArea(
        self,
        current.descriptor,
        'p',
        pick(home.homeBrand?.descriptor, seed.page.homeBrand.descriptor)
      )
    })),
    homeHeroArea: singletonArea(self, home.homeHeroArea, 'home-hero', (current) => ({
      eyebrow: inlineArea(
        self,
        current.eyebrow,
        'p',
        pick(home.homeHero?.eyebrow, seed.page.homeHero.eyebrow)
      ),
      heading: inlineArea(
        self,
        current.heading,
        'h2',
        pick(home.homeHero?.title, seed.page.homeHero.title)
      ),
      description: inlineArea(
        self,
        current.description,
        'p',
        pick(home.homeHero?.description, seed.page.homeHero.description)
      ),
      primaryCtaLabel: pick(current.primaryCtaLabel, home.homeHero?.primaryCtaLabel, seed.page.homeHero.primaryCtaLabel),
      primaryCtaTarget: pick(current.primaryCtaTarget, home.homeHero?.primaryCtaTarget, seed.page.homeHero.primaryCtaTarget),
      secondaryCtaLabel: pick(current.secondaryCtaLabel, home.homeHero?.secondaryCtaLabel, seed.page.homeHero.secondaryCtaLabel),
      secondaryCtaHref: pick(current.secondaryCtaHref, home.homeHero?.secondaryCtaHref, seed.page.homeHero.secondaryCtaHref)
    })),
    homeSolutionsArea: singletonArea(self, home.homeSolutionsArea, 'home-solutions', (current) => {
      const currentItems = new Map((current.solutions || []).map((item) => [ item.key, item ]));
      const legacyItems = new Map((home.homeSolutions || []).map((item) => [ item.key, item ]));
      return {
        introEyebrow: inlineArea(
          self,
          current.introEyebrow,
          'p',
          pick(home.homeSolutionsIntro?.eyebrow, seed.page.homeSolutionsIntro.eyebrow)
        ),
        introHeading: inlineArea(
          self,
          current.introHeading,
          'h2',
          pick(home.homeSolutionsIntro?.title, seed.page.homeSolutionsIntro.title)
        ),
        introDescription: inlineArea(
          self,
          current.introDescription,
          'p',
          pick(home.homeSolutionsIntro?.description, seed.page.homeSolutionsIntro.description)
        ),
        missionTitle: pick(current.missionTitle, home.homeMission?.title, seed.page.homeMission.title),
        coreTop: pick(current.coreTop, home.homeMission?.coreTop, seed.page.homeMission.coreTop),
        coreBottom: pick(current.coreBottom, home.homeMission?.coreBottom, seed.page.homeMission.coreBottom),
        solutions: solutions.map((item) => {
          const prior = currentItems.get(item.key) || {};
          const legacy = legacyItems.get(item.key) || {};
          return {
            ...prior,
            key: item.key,
            slug: pick(prior.slug, legacy.slug, item.slug).toLowerCase(),
            heading: inlineArea(self, prior.heading, 'h2', pick(legacy.title, item.title)),
            description: inlineArea(self, prior.description, 'p', pick(legacy.description, item.description)),
            stageLabel: pick(prior.stageLabel, legacy.stageLabel, item.stageLabel),
            stageSignal: pick(prior.stageSignal, legacy.stageSignal, item.stageSignal),
            stageStatus: pick(prior.stageStatus, legacy.stageStatus, item.stageStatus),
            stageInsight: inlineArea(self, prior.stageInsight, 'p', pick(legacy.stageInsight, item.stageInsight)),
            media: prior.media?._id ? prior.media : item.media
          };
        })
      };
    }),
    homeCapabilitiesArea: singletonArea(self, home.homeCapabilitiesArea, 'home-capabilities', (current) => {
      const currentItems = new Map((current.capabilities || []).map((item) => [ item.key, item ]));
      const legacyItems = new Map((home.homeCapabilities || []).map((item) => [ item.key, item ]));
      return {
        introEyebrow: inlineArea(
          self,
          current.introEyebrow,
          'p',
          pick(home.homeCapabilitiesIntro?.eyebrow, seed.page.homeCapabilitiesIntro.eyebrow)
        ),
        introHeading: inlineArea(
          self,
          current.introHeading,
          'h2',
          pick(home.homeCapabilitiesIntro?.title, seed.page.homeCapabilitiesIntro.title)
        ),
        introDescription: inlineArea(
          self,
          current.introDescription,
          'p',
          pick(home.homeCapabilitiesIntro?.description, seed.page.homeCapabilitiesIntro.description)
        ),
        capabilities: capabilities.map((item) => {
          const prior = currentItems.get(item.key) || {};
          const legacy = legacyItems.get(item.key) || {};
          return {
            ...prior,
            key: item.key,
            number: pick(prior.number, legacy.number, item.number),
            label: pick(prior.label, legacy.label, item.label),
            heading: inlineArea(self, prior.heading, 'h3', pick(legacy.title, item.title)),
            description: inlineArea(self, prior.description, 'p', pick(legacy.text, item.text)),
            media: prior.media?._id ? prior.media : item.media
          };
        })
      };
    }),
    homeWhyArea: singletonArea(self, home.homeWhyArea, 'home-why', (current) => {
      const currentMetrics = Array.isArray(current.metrics) && current.metrics.length === 4
        ? current.metrics
        : [];
      const legacyMetrics = Array.isArray(home.homeMetrics) && home.homeMetrics.length === 4
        ? home.homeMetrics
        : [];
      return {
        eyebrow: inlineArea(self, current.eyebrow, 'p', pick(home.homeWhy?.eyebrow, seed.page.homeWhy.eyebrow)),
        heading: inlineArea(self, current.heading, 'h2', pick(home.homeWhy?.title, seed.page.homeWhy.title)),
        description: inlineArea(self, current.description, 'p', pick(home.homeWhy?.text, seed.page.homeWhy.text)),
        linkLabel: pick(current.linkLabel, home.homeWhy?.linkLabel, seed.page.homeWhy.linkLabel),
        linkHref: pick(current.linkHref, home.homeWhy?.linkHref, seed.page.homeWhy.linkHref),
        metrics: seed.page.homeMetrics.map((fallback, index) => {
          const prior = currentMetrics[index] || legacyMetrics[index] || {};
          const legacy = legacyMetrics[index] || {};
          const priorValue = typeof prior.value === 'string' ? prior.value : '';
          const existingArea = prior.value?.metaType === 'area' ? prior.value : null;
          return {
            ...prior,
            value: inlineArea(self, existingArea, 'h3', pick(priorValue, legacy.value, fallback.value)),
            label: pick(prior.label, legacy.label, fallback.label)
          };
        })
      };
    }),
    homeSupportArea: singletonArea(self, home.homeSupportArea, 'home-support', (current) => {
      const currentModes = Array.isArray(current.modes) && current.modes.length === 3
        ? current.modes
        : [];
      const legacyModes = Array.isArray(home.homeSupport?.modes) && home.homeSupport.modes.length === 3
        ? home.homeSupport.modes
        : [];
      const modes = seed.page.homeSupport.modes.map((fallback, index) => {
        const prior = currentModes[index] || {};
        const legacy = legacyModes[index] || {};
        return {
          ...prior,
          heading: inlineArea(self, prior.heading, 'h3', pick(legacy.title, fallback.title))
        };
      });
      return {
        eyebrow: inlineArea(self, current.eyebrow, 'p', pick(home.homeSupport?.eyebrow, seed.page.homeSupport.eyebrow)),
        heading: inlineArea(self, current.heading, 'h2', pick(home.homeSupport?.title, seed.page.homeSupport.title)),
        description: inlineArea(self, current.description, 'p', pick(home.homeSupport?.description, seed.page.homeSupport.description)),
        platformLabel: pick(current.platformLabel, home.homeSupport?.platformLabel, seed.page.homeSupport.platformLabel),
        linkLabel: pick(current.linkLabel, home.homeSupport?.linkLabel, seed.page.homeSupport.linkLabel),
        linkHref: pick(current.linkHref, home.homeSupport?.linkHref, seed.page.homeSupport.linkHref),
        modes
      };
    })
  };
}
