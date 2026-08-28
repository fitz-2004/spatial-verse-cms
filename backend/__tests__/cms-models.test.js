import { describe, it, expect } from 'vitest';
import solutionPage from '../modules/solution-page/index.js';
import researchPaper from '../modules/research-paper/index.js';
import datasetItem from '../modules/dataset-item/index.js';

const SOLUTION_SLUGS = [
  '/coohomcloud/solutions/aiagent',
  '/coohomcloud/solutions/aigc',
  '/coohomcloud/solutions/roboticsimulation',
  '/coohomcloud/solutions/visualizedproductpromotion',
  '/coohomcloud/solutions/xr'
];

describe('solution-page model', () => {
  const fields = solutionPage.fields.add;

  it('is a page-type extending from @apostrophecms/page-type', () => {
    expect(solutionPage.extend).toBe('@apostrophecms/page-type');
  });

  it('has englishTitle as required string field', () => {
    expect(fields.englishTitle.type).toBe('string');
    expect(fields.englishTitle.required).toBe(true);
  });

  it('has sequence as integer field with range 1-5', () => {
    expect(fields.sequence.type).toBe('integer');
    expect(fields.sequence.def).toBe(1);
    expect(fields.sequence.min).toBe(1);
    expect(fields.sequence.max).toBe(5);
  });

  it('has accent as string field with default', () => {
    expect(fields.accent.type).toBe('string');
    expect(fields.accent.def).toBe('#29f5d1');
  });

  it('hero fields use area type with rich-text widget', () => {
    for (const field of ['heroTitle', 'heroLead', 'challengeTitle', 'advantageTitle', 'serviceTitle', 'ctaTitle']) {
      expect(fields[field].type).toBe('area');
      expect(fields[field].options.widgets['@apostrophecms/rich-text']).toBeDefined();
      expect(fields[field].options.max).toBe(1);
    }
  });

  it('has challenges, advantages, services arrays', () => {
    for (const field of ['challenges', 'advantages', 'services']) {
      expect(fields[field].type).toBe('array');
      expect(fields[field].titleField).toBe('title');
      expect(fields[field].fields.add.title.type).toBe('string');
      expect(fields[field].fields.add.text.type).toBe('string');
      expect(fields[field].fields.add.text.textarea).toBe(true);
    }
  });

  it('array items have required title and text', () => {
    for (const field of ['challenges', 'advantages', 'services']) {
      expect(fields[field].fields.add.title.required).toBe(true);
      expect(fields[field].fields.add.text.required).toBe(true);
    }
  });

  it('has SEO fields with correct structure', () => {
    expect(fields.seoTitle.max).toBe(60);
    expect(fields.seoDescription.max).toBe(160);
    expect(fields.seoRobots.type).toBe('select');
    expect(fields.seoRobots.def).toBe('index-follow');
  });

  it('media field uses videos fileGroup', () => {
    expect(fields.media.type).toBe('attachment');
    expect(fields.media.fileGroup).toBe('videos');
  });

  it('defines 5 solution slugs', () => {
    expect(SOLUTION_SLUGS).toHaveLength(5);
    for (const slug of SOLUTION_SLUGS) {
      expect(slug.startsWith('/coohomcloud/solutions/')).toBe(true);
      expect(slug).toBe(slug.toLowerCase());
    }
  });

  it('importedFields list matches defined field names', () => {
    const importedFields = [
      'englishTitle', 'sequence', 'accent',
      'heroTitle', 'heroLead', 'videoDescription',
      'challengeTitle', 'challenges',
      'advantageTitle', 'advantages',
      'serviceTitle', 'services',
      'ctaTitle', 'seoTitle', 'seoDescription'
    ];
    for (const field of importedFields) {
      expect(fields[field]).toBeDefined();
    }
  });

  it('groups map to correct field sets', () => {
    const groups = solutionPage.fields.group;
    expect(groups.hero.fields).toContain('englishTitle');
    expect(groups.hero.fields).toContain('sequence');
    expect(groups.media.fields).toContain('media');
    expect(groups.challenges.fields).toContain('challenges');
    expect(groups.advantages.fields).toContain('advantages');
    expect(groups.services.fields).toContain('services');
    expect(groups.cta.fields).toContain('ctaTitle');
    expect(groups.seo.fields).toContain('seoTitle');
  });
});

describe('solution-page methods — readSolutionDrafts', () => {
  it('defines readSolutionDrafts method', () => {
    const self = { apos: { rootDir: '/tmp' } };
    const method = solutionPage.methods(self).readSolutionDrafts;
    expect(typeof method).toBe('function');
  });

  it('throws when source DB does not contain exactly 5 zh:draft solution pages', () => {
    const self = { apos: { rootDir: '/tmp' } };
    const method = solutionPage.methods(self).readSolutionDrafts;
    const fs = require('node:fs');
    const path = require('node:path');
    const os = require('node:os');
    const Database = require('better-sqlite3');

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-db-'));
    const dbPath = path.join(tmpDir, 'test.sqlite');
    const db = new Database(dbPath);
    db.exec(`CREATE TABLE aposDocs (data TEXT)`);
    db.prepare(`INSERT INTO aposDocs (data) VALUES (?)`)
      .run(JSON.stringify({ type: 'solution-page', aposLocale: 'zh:draft', slug: '/coohomcloud/solutions/aiagent' }));
    db.close();

    expect(() => method(dbPath)).toThrow(/必须恰好包含 5 个/);

    fs.rmSync(tmpDir, { recursive: true });
  });

  it('returns pages in correct slug order', () => {
    const self = { apos: { rootDir: '/tmp' } };
    const method = solutionPage.methods(self).readSolutionDrafts;
    const fs = require('node:fs');
    const path = require('node:path');
    const os = require('node:os');
    const Database = require('better-sqlite3');

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-db-'));
    const dbPath = path.join(tmpDir, 'test.sqlite');
    const db = new Database(dbPath);
    db.exec(`CREATE TABLE aposDocs (data TEXT)`);
    for (const slug of SOLUTION_SLUGS) {
      db.prepare(`INSERT INTO aposDocs (data) VALUES (?)`)
        .run(JSON.stringify({ type: 'solution-page', aposLocale: 'zh:draft', slug, title: slug }));
    }
    db.close();

    const result = method(dbPath);
    expect(result).toHaveLength(5);
    expect(result.map(p => p.slug)).toEqual(SOLUTION_SLUGS);

    fs.rmSync(tmpDir, { recursive: true });
  });
});

describe('research-paper model', () => {
  const fields = researchPaper.fields.add;

  it('is a piece-type', () => {
    expect(researchPaper.extend).toBe('@apostrophecms/piece-type');
  });

  it('has required year, venue, externalUrl', () => {
    expect(fields.year.required).toBe(true);
    expect(fields.venue.required).toBe(true);
    expect(fields.externalUrl.required).toBe(true);
    expect(fields.externalUrl.type).toBe('url');
  });

  it('year is a string type', () => {
    expect(fields.year.type).toBe('string');
  });

  it('cover uses image area', () => {
    expect(fields.cover.type).toBe('area');
    expect(fields.cover.options.widgets['@apostrophecms/image']).toBeDefined();
  });

  it('has sort by year descending', () => {
    expect(researchPaper.options.sort).toEqual({ year: -1 });
  });

  it('is searchable', () => {
    expect(researchPaper.options.searchable).toBe(true);
  });
});

describe('dataset-item model', () => {
  const fields = datasetItem.fields.add;

  it('is a piece-type', () => {
    expect(datasetItem.extend).toBe('@apostrophecms/piece-type');
  });

  it('has required sourceKey', () => {
    expect(fields.sourceKey.required).toBe(true);
    expect(fields.sourceKey.type).toBe('string');
  });

  it('has rank with default 100', () => {
    expect(fields.rank.type).toBe('integer');
    expect(fields.rank.def).toBe(100);
  });

  it('category has 3 valid choices', () => {
    expect(fields.category.required).toBe(true);
    expect(fields.category.type).toBe('select');
    const values = fields.category.choices.map(c => c.value);
    expect(values).toEqual(expect.arrayContaining(['model', 'scene', 'image']));
  });

  it('has required summary and description', () => {
    expect(fields.summary.required).toBe(true);
    expect(fields.summary.type).toBe('string');
    expect(fields.summary.textarea).toBe(true);
    expect(fields.description.required).toBe(true);
    expect(fields.description.textarea).toBe(true);
  });

  it('downloads array has required label and url', () => {
    expect(fields.downloads.type).toBe('array');
    expect(fields.downloads.fields.add.label.required).toBe(true);
    expect(fields.downloads.fields.add.url.required).toBe(true);
    expect(fields.downloads.fields.add.url.type).toBe('url');
  });

  it('gallery array has required image attachment', () => {
    expect(fields.gallery.type).toBe('array');
    expect(fields.gallery.fields.add.image.type).toBe('attachment');
    expect(fields.gallery.fields.add.image.fileGroup).toBe('images');
    expect(fields.gallery.fields.add.image.required).toBe(true);
  });

  it('cover uses images fileGroup', () => {
    expect(fields.cover.type).toBe('attachment');
    expect(fields.cover.fileGroup).toBe('images');
  });

  it('has correct sort order', () => {
    expect(datasetItem.options.sort).toEqual({ rank: 1, title: 1 });
  });

  it('is searchable', () => {
    expect(datasetItem.options.searchable).toBe(true);
  });
});
