import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import Database from 'better-sqlite3';

const PAGE_TYPES = ['core-competency-page', 'research-archive-page'];

const PAGE_FIELDS = {
  'core-competency-page': [
    'title', 'intro', 'capabilities', 'outro',
    'seoTitle', 'seoDescription', 'seoKeywords',
    'seoCanonicalUrl', 'seoRobots', 'seoOgTitle',
    'seoOgDescription', 'seoOgImage', 'seoTwitterCard'
  ],
  'research-archive-page': [
    'title', 'intro', 'sectionHead', 'outro',
    'seoTitle', 'seoDescription', 'seoKeywords',
    'seoCanonicalUrl', 'seoRobots', 'seoOgTitle',
    'seoOgDescription', 'seoOgImage', 'seoTwitterCard'
  ]
};

const PAPER_FIELDS = ['title', 'slug', 'year', 'venue', 'abstract', 'externalUrl', 'cover'];

function pick(source, fields) {
  return Object.fromEntries(
    fields
      .filter((field) => source[field] !== undefined)
      .map((field) => [field, structuredClone(source[field])])
  );
}

function remapPageLinks(value, sourceSlugByDocId, targetDocIdBySlug) {
  const cloned = structuredClone(value || {});
  if (!Array.isArray(cloned.links)) return cloned;
  cloned.links = cloned.links.map((link) => {
    const targetSlug = (link.pageIds || [])
      .map((id) => sourceSlugByDocId.get(id))
      .find(Boolean);
    const targetDocId = targetSlug && targetDocIdBySlug.get(targetSlug);
    const content = { ...link };
    delete content.pageIds;
    delete content._page;
    return { ...content, _page: targetDocId ? [targetDocId] : [] };
  });
  return cloned;
}

describe('core-research-import — pick()', () => {
  it('extracts only specified fields that exist in source', () => {
    const source = { title: 'Test', slug: 'test', year: '2024', extra: 'ignored' };
    const result = pick(source, ['title', 'year', 'missing']);
    expect(result).toEqual({ title: 'Test', year: '2024' });
  });

  it('performs deep clone on values', () => {
    const source = { title: 'Test', config: { key: 'value' } };
    const result = pick(source, ['title', 'config']);
    expect(result.config).toEqual({ key: 'value' });
    expect(result.config).not.toBe(source.config);
  });

  it('returns empty object when no fields match', () => {
    const source = { a: 1, b: 2 };
    const result = pick(source, ['c', 'd']);
    expect(result).toEqual({});
  });
});

describe('core-research-import — remapPageLinks()', () => {
  it('returns cloned value when links array is absent', () => {
    const result = remapPageLinks({ text: 'hello' }, new Map(), new Map());
    expect(result).toEqual({ text: 'hello' });
  });

  it('remaps page links from source doc IDs to target doc IDs via slug', () => {
    const sourceSlugByDocId = new Map([['doc-1', '/corecompetency']]);
    const targetDocIdBySlug = new Map([['/corecompetency', 'target-doc-999']]);
    const value = {
      links: [
        { pageIds: ['doc-1'], text: 'link text' }
      ]
    };
    const result = remapPageLinks(value, sourceSlugByDocId, targetDocIdBySlug);
    expect(result.links[0]._page).toEqual(['target-doc-999']);
    expect(result.links[0].pageIds).toBeUndefined();
    expect(result.links[0].text).toBe('link text');
  });

  it('sets empty _page when slug not found in target', () => {
    const sourceSlugByDocId = new Map([['doc-1', '/unknown']]);
    const targetDocIdBySlug = new Map();
    const value = {
      links: [{ pageIds: ['doc-1'], text: 'broken' }]
    };
    const result = remapPageLinks(value, sourceSlugByDocId, targetDocIdBySlug);
    expect(result.links[0]._page).toEqual([]);
  });

  it('handles mixed links with some resolvable and some not', () => {
    const sourceSlugByDocId = new Map([
      ['doc-1', '/corecompetency'],
      ['doc-2', '/orphan']
    ]);
    const targetDocIdBySlug = new Map([['/corecompetency', 'target-1']]);
    const value = {
      links: [
        { pageIds: ['doc-1'], text: 'good' },
        { pageIds: ['doc-2'], text: 'orphan' }
      ]
    };
    const result = remapPageLinks(value, sourceSlugByDocId, targetDocIdBySlug);
    expect(result.links[0]._page).toEqual(['target-1']);
    expect(result.links[1]._page).toEqual([]);
  });

  it('preserves non-link properties', () => {
    const sourceSlugByDocId = new Map();
    const targetDocIdBySlug = new Map();
    const value = { intro: 'intro text', outro: { text: 'outro' }, links: [] };
    const result = remapPageLinks(value, sourceSlugByDocId, targetDocIdBySlug);
    expect(result.intro).toBe('intro text');
    expect(result.outro).toEqual({ text: 'outro' });
  });
});

describe('core-research-import — PAGE_TYPES and PAGE_FIELDS constants', () => {
  it('PAGE_TYPES contains exactly 2 page types', () => {
    expect(PAGE_TYPES).toHaveLength(2);
    expect(PAGE_TYPES).toContain('core-competency-page');
    expect(PAGE_TYPES).toContain('research-archive-page');
  });

  it('PAGE_FIELDS core-competency-page includes key content fields', () => {
    const fields = PAGE_FIELDS['core-competency-page'];
    expect(fields).toContain('title');
    expect(fields).toContain('intro');
    expect(fields).toContain('capabilities');
    expect(fields).toContain('outro');
  });

  it('PAGE_FIELDS research-archive-page includes sectionHead', () => {
    const fields = PAGE_FIELDS['research-archive-page'];
    expect(fields).toContain('sectionHead');
    expect(fields).toContain('outro');
  });

  it('PAGE_FIELDS both page types share common SEO fields', () => {
    const seoFields = ['seoTitle', 'seoDescription', 'seoRobots', 'seoOgTitle'];
    for (const type of PAGE_TYPES) {
      for (const seo of seoFields) {
        expect(PAGE_FIELDS[type]).toContain(seo);
      }
    }
  });

  it('PAPER_FIELDS contains core paper fields', () => {
    expect(PAPER_FIELDS).toContain('title');
    expect(PAPER_FIELDS).toContain('year');
    expect(PAPER_FIELDS).toContain('venue');
    expect(PAPER_FIELDS).toContain('externalUrl');
  });
});

describe('core-research-import — SQLite loadSource', () => {
  function loadSource(rootDir, sourcePath) {
    const resolved = path.isAbsolute(sourcePath) ? sourcePath : path.resolve(rootDir, sourcePath);
    const database = new Database(resolved, { readonly: true, fileMustExist: true });
    try {
      return database.prepare('SELECT data FROM aposDocs').all()
        .map(({ data }) => JSON.parse(data))
        .filter((doc) => doc.aposLocale === 'zh:draft');
    } finally {
      database.close();
    }
  }

  it('loads zh:draft documents from SQLite', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-import-'));
    const dbPath = path.join(tmpDir, 'source.sqlite');
    const db = new Database(dbPath);
    db.exec(`CREATE TABLE aposDocs (data TEXT)`);

    db.prepare(`INSERT INTO aposDocs (data) VALUES (?)`)
      .run(JSON.stringify({ type: 'core-competency-page', aposLocale: 'zh:draft', slug: '/corecompetency', title: 'Core' }));
    db.prepare(`INSERT INTO aposDocs (data) VALUES (?)`)
      .run(JSON.stringify({ type: 'research-archive-page', aposLocale: 'zh:draft', slug: '/research', title: 'Research' }));
    db.prepare(`INSERT INTO aposDocs (data) VALUES (?)`)
      .run(JSON.stringify({ type: 'research-paper', aposLocale: 'zh:draft', slug: 'paper-1', title: 'Paper 1', year: '2024' }));
    db.prepare(`INSERT INTO aposDocs (data) VALUES (?)`)
      .run(JSON.stringify({ type: 'solution-page', aposLocale: 'en:draft', slug: '/en/solution', title: 'English' }));
    db.close();

    const docs = loadSource(tmpDir, 'source.sqlite');
    expect(docs).toHaveLength(3);
    expect(docs.map(d => d.type)).toEqual(
      expect.arrayContaining(['core-competency-page', 'research-archive-page', 'research-paper'])
    );

    fs.rmSync(tmpDir, { recursive: true });
  });

  it('returns empty array when no zh:draft docs exist', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-import-empty-'));
    const dbPath = path.join(tmpDir, 'source.sqlite');
    const db = new Database(dbPath);
    db.exec(`CREATE TABLE aposDocs (data TEXT)`);
    db.prepare(`INSERT INTO aposDocs (data) VALUES (?)`)
      .run(JSON.stringify({ type: 'solution-page', aposLocale: 'en:draft', slug: '/en/test' }));
    db.close();

    const docs = loadSource(tmpDir, 'source.sqlite');
    expect(docs).toHaveLength(0);

    fs.rmSync(tmpDir, { recursive: true });
  });

  it('throws when source database does not exist', () => {
    expect(() => loadSource('/tmp', 'nonexistent.sqlite')).toThrow();
  });
});
