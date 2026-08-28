import { describe, it, expect } from 'vitest';
import { homeSeed } from '../modules/@apostrophecms/home-page/lib/homeSeed.js';

describe('homeSeed — data integrity', () => {
  it('has page-level SEO fields', () => {
    expect(homeSeed.page.title).toBeTruthy();
    expect(homeSeed.page.seoTitle).toBeTruthy();
    expect(homeSeed.page.seoDescription).toBeTruthy();
    expect(homeSeed.page.seoRobots).toBe('index-follow');
    expect(homeSeed.page.seoTwitterCard).toBe('summary_large_image');
  });

  it('defines exactly 5 solution entries', () => {
    expect(homeSeed.homeSolutions).toHaveLength(5);
  });

  it('each solution has required fields', () => {
    for (const sol of homeSeed.homeSolutions) {
      expect(sol.key).toBeTruthy();
      expect(sol.slug).toBeTruthy();
      expect(sol.title).toBeTruthy();
      expect(sol.description).toBeTruthy();
      expect(sol.stageLabel).toBeTruthy();
      expect(sol.stageSignal).toBeTruthy();
      expect(sol.stageStatus).toBeTruthy();
      expect(sol.stageInsight).toBeTruthy();
      expect(sol.sourceFilename).toBeTruthy();
    }
  });

  it('solution slugs match the expected set', () => {
    const expectedSlugs = new Set([
      'aiagent', 'aigc', 'roboticsimulation', 'visualizedproductpromotion', 'xr'
    ]);
    const actualSlugs = new Set(homeSeed.homeSolutions.map(s => s.slug));
    expect(actualSlugs).toEqual(expectedSlugs);
  });

  it('solution slugs are all lowercase', () => {
    for (const sol of homeSeed.homeSolutions) {
      expect(sol.slug).toBe(sol.slug.toLowerCase());
    }
  });

  it('defines exactly 4 capability entries', () => {
    expect(homeSeed.homeCapabilities).toHaveLength(4);
  });

  it('each capability has required fields', () => {
    for (const cap of homeSeed.homeCapabilities) {
      expect(cap.key).toBeTruthy();
      expect(cap.number).toBeTruthy();
      expect(cap.label).toBeTruthy();
      expect(cap.title).toBeTruthy();
      expect(cap.text).toBeTruthy();
      expect(cap.sourceFilename).toBeTruthy();
    }
  });

  it('has brand, hero, solutions-intro, mission, capabilities-intro sections', () => {
    expect(homeSeed.page.homeBrand).toBeDefined();
    expect(homeSeed.page.homeHero).toBeDefined();
    expect(homeSeed.page.homeSolutionsIntro).toBeDefined();
    expect(homeSeed.page.homeMission).toBeDefined();
    expect(homeSeed.page.homeCapabilitiesIntro).toBeDefined();
    expect(homeSeed.page.homeWhy).toBeDefined();
    expect(homeSeed.page.homeSupport).toBeDefined();
  });

  it('has 4 metrics entries in homeMetrics', () => {
    expect(homeSeed.page.homeMetrics).toHaveLength(4);
    for (const m of homeSeed.page.homeMetrics) {
      expect(m.value).toBeTruthy();
      expect(m.label).toBeTruthy();
    }
  });

  it('has 3 support modes', () => {
    expect(homeSeed.page.homeSupport.modes).toHaveLength(3);
    for (const mode of homeSeed.page.homeSupport.modes) {
      expect(mode.title).toBeTruthy();
    }
  });
});
