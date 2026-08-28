import { describe, it, expect } from 'vitest';
import { buildHomeAreas } from '../modules/@apostrophecms/home-page/lib/homeAreaMigration.js';

const mockApos = () => ({
  apos: { util: { generateId: () => 'test-id' } }
});

const minimalSeedPage = () => ({
  homeBrand: { kicker: 'k', title: 't', descriptor: 'd' },
  homeHero: { eyebrow: 'e', title: 't', description: 'd', primaryCtaLabel: 'C', primaryCtaTarget: 'T' },
  homeSolutionsIntro: { eyebrow: 'e', title: 't', description: 'd' },
  homeMission: { title: 'm', coreTop: 'S', coreBottom: 'C' },
  homeCapabilitiesIntro: { eyebrow: 'e', title: 't', description: 'd' },
  homeWhy: { eyebrow: 'e', title: 't', text: 'd', linkLabel: 'l', linkHref: 'h' },
  homeMetrics: [{ value: '1', label: 'a' }, { value: '2', label: 'b' }, { value: '3', label: 'c' }, { value: '4', label: 'd' }],
  homeSupport: { eyebrow: 'e', title: 't', description: 'd', platformLabel: 'p', linkLabel: 'l', linkHref: 'h', modes: [{ title: 'm1' }, { title: 'm2' }, { title: 'm3' }] }
});

describe('homeAreaMigration', () => {
  it('creates all 6 singleton areas with correct widget types', () => {
    const self = mockApos();
    const result = buildHomeAreas({
      self,
      home: {},
      seed: { page: minimalSeedPage() },
      solutions: [],
      capabilities: []
    });
    expect(result.homeBrandArea.items[0].type).toBe('home-brand');
    expect(result.homeHeroArea.items[0].type).toBe('home-hero');
    expect(result.homeSolutionsArea.items[0].type).toBe('home-solutions');
    expect(result.homeCapabilitiesArea.items[0].type).toBe('home-capabilities');
    expect(result.homeWhyArea.items[0].type).toBe('home-why');
    expect(result.homeSupportArea.items[0].type).toBe('home-support');
  });

  it('preserves existing HTML content when already present', () => {
    const self = mockApos();
    const existingHero = {
      items: [
        {
          _id: 'existing-widget',
          type: 'home-hero',
          heading: { items: [{ type: '@apostrophecms/rich-text', content: '<h2>Custom Heading</h2>' }] }
        }
      ]
    };
    const seed = { page: minimalSeedPage() };
    seed.page.homeHero.title = 'New Title';
    const result = buildHomeAreas({
      self,
      home: { homeHeroArea: existingHero },
      seed,
      solutions: [],
      capabilities: []
    });
    const heroWidget = result.homeHeroArea.items[0];
    expect(heroWidget._id).toBe('existing-widget');
    expect(heroWidget.heading.items[0].content).toBe('<h2>Custom Heading</h2>');
  });

  it('preserves plain-text content by wrapping it in the correct HTML tag', () => {
    const self = mockApos();
    const existingHero = {
      items: [
        {
          _id: 'widget-1',
          type: 'home-hero',
          heading: { items: [{ type: '@apostrophecms/rich-text', content: 'Old plain text' }] }
        }
      ]
    };
    const seed = { page: minimalSeedPage() };
    seed.page.homeHero.title = 'Updated Title';
    const result = buildHomeAreas({
      self,
      home: { homeHeroArea: existingHero },
      seed,
      solutions: [],
      capabilities: []
    });
    const heroWidget = result.homeHeroArea.items[0];
    expect(heroWidget.heading.items[0].content).toBe('<h2>Old plain text</h2>');
  });

  it('maps solutions array items with correct keys and slugs', () => {
    const self = mockApos();
    const seedSolutions = [
      { key: 'agent-perception', slug: 'aiagent', title: '智能体感知', description: 'desc', stageLabel: 'PERCEIVE', stageSignal: '感知', stageStatus: '01', stageInsight: 'insight' },
      { key: 'aigc', slug: 'aigc', title: 'AIGC', description: 'desc2', stageLabel: 'GENERATE', stageSignal: '生成', stageStatus: '02', stageInsight: 'insight2' }
    ];
    const result = buildHomeAreas({
      self,
      home: {},
      seed: { page: minimalSeedPage() },
      solutions: seedSolutions,
      capabilities: []
    });
    const solutionsWidget = result.homeSolutionsArea.items[0];
    expect(solutionsWidget.solutions).toHaveLength(2);
    expect(solutionsWidget.solutions[0].key).toBe('agent-perception');
    expect(solutionsWidget.solutions[0].slug).toBe('aiagent');
    expect(solutionsWidget.solutions[0].slug).toBe(solutionsWidget.solutions[0].slug.toLowerCase());
  });

  it('maps capabilities array items with correct keys', () => {
    const self = mockApos();
    const seedCaps = [
      { key: 'physical-enhancement', number: '01', label: 'PHYSICAL', title: '物理增强', text: '赋予模型密度' }
    ];
    const result = buildHomeAreas({
      self,
      home: {},
      seed: { page: minimalSeedPage() },
      solutions: [],
      capabilities: seedCaps
    });
    const capsWidget = result.homeCapabilitiesArea.items[0];
    expect(capsWidget.capabilities).toHaveLength(1);
    expect(capsWidget.capabilities[0].key).toBe('physical-enhancement');
    expect(capsWidget.capabilities[0].number).toBe('01');
  });
});
