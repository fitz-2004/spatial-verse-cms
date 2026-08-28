import { describe, it, expect } from 'vitest';

const UNTRANSLATED_KEYS = new Set([
  '_id', 'aposDocId', 'aposLocale', 'aposMode', 'type', 'metaType',
  'slug', 'path', 'url', 'href', 'attachment', 'createdAt', 'updatedAt'
]);

function translateString(value, pairs) {
  return pairs.reduce((translated, [source, target]) =>
    translated.split(source).join(target), value);
}

function translateMatchingValues(source, target, key = '', translateResiduals = false, pairs = []) {
  if (UNTRANSLATED_KEYS.has(key) || key.startsWith('_')) return target;
  if (typeof source === 'string' && typeof target === 'string') {
    return (target === source || (translateResiduals && /[\u3400-\u9fff]/u.test(target)))
      ? translateString(source, pairs)
      : target;
  }
  if (Array.isArray(source) && Array.isArray(target)) {
    return target.map((value, index) =>
      index < source.length ? translateMatchingValues(source[index], value, key, translateResiduals, pairs) : value
    );
  }
  if (source && target && typeof source === 'object' && typeof target === 'object') {
    if (Object.getPrototypeOf(source) !== Object.prototype || Object.getPrototypeOf(target) !== Object.prototype) {
      return target;
    }
    return Object.fromEntries(Object.entries(target).map(([childKey, value]) => [
      childKey,
      Object.hasOwn(source, childKey)
        ? translateMatchingValues(source[childKey], value, childKey, translateResiduals, pairs)
        : value
    ]));
  }
  return target;
}

function hasAreaContent(page) {
  return Object.entries(page).some(([key, value]) =>
    key.endsWith('Area') && Array.isArray(value?.items) && value.items.length > 0
  );
}

function isStarterEnglishHome(page) {
  return page?.type === '@apostrophecms/home-page'
    && !hasAreaContent(page)
    && (!page.title || page.title === 'Home');
}

const TRANSLATION_PAIRS = [
  ['群核空间智能平台', 'SpatialVerse'],
  ['首页', 'Home'],
  ['了解更多', 'Learn More'],
  ['免费下载数据集', 'Download Dataset']
];

describe('site-localization — translateString', () => {
  it('replaces source strings with target strings', () => {
    expect(translateString('群核空间智能平台', TRANSLATION_PAIRS)).toBe('SpatialVerse');
  });
  it('handles partial matches', () => {
    expect(translateString('群核空间智能平台首页', TRANSLATION_PAIRS)).toBe('SpatialVerseHome');
  });
  it('returns original if no match', () => {
    expect(translateString('unknown text', TRANSLATION_PAIRS)).toBe('unknown text');
  });
});

describe('site-localization — translateMatchingValues', () => {
  it('skips untranslated keys', () => {
    const source = { _id: 'abc', title: '群核空间智能平台', type: 'home-page' };
    const target = { _id: 'abc', title: '群核空间智能平台', type: 'home-page' };
    const result = translateMatchingValues(source, target, '', false, TRANSLATION_PAIRS);
    expect(result._id).toBe('abc');
    expect(result.type).toBe('home-page');
  });

  it('translates matching string values', () => {
    const source = { title: '群核空间智能平台' };
    const target = { title: '群核空间智能平台' };
    const result = translateMatchingValues(source, target, '', false, TRANSLATION_PAIRS);
    expect(result.title).toBe('SpatialVerse');
  });

  it('preserves manually edited target values (different from source)', () => {
    const source = { title: '群核空间智能平台' };
    const target = { title: 'My Custom Title' };
    const result = translateMatchingValues(source, target, '', false, TRANSLATION_PAIRS);
    expect(result.title).toBe('My Custom Title');
  });

  it('translates when translateResiduals is on and target contains CJK', () => {
    const source = { title: '群核空间智能平台' };
    const target = { title: '还是中文' };
    const result = translateMatchingValues(source, target, '', true, TRANSLATION_PAIRS);
    expect(result.title).toBe('SpatialVerse');
  });

  it('handles nested objects recursively', () => {
    const source = { meta: { seoTitle: '群核空间智能平台', description: 'desc' } };
    const target = { meta: { seoTitle: '群核空间智能平台', description: 'desc' } };
    const result = translateMatchingValues(source, target, '', false, TRANSLATION_PAIRS);
    expect(result.meta.seoTitle).toBe('SpatialVerse');
    expect(result.meta.description).toBe('desc');
  });

  it('handles arrays recursively', () => {
    const source = { items: [{ title: '群核空间智能平台' }, { title: 'other' }] };
    const target = { items: [{ title: '群核空间智能平台' }, { title: 'other' }] };
    const result = translateMatchingValues(source, target, '', false, TRANSLATION_PAIRS);
    expect(result.items[0].title).toBe('SpatialVerse');
    expect(result.items[1].title).toBe('other');
  });
});

describe('site-localization — hasAreaContent', () => {
  it('returns true when area has items', () => {
    const page = { homeHeroArea: { items: [{ type: 'home-hero' }] } };
    expect(hasAreaContent(page)).toBe(true);
  });

  it('returns false when area has empty items', () => {
    const page = { homeHeroArea: { items: [] } };
    expect(hasAreaContent(page)).toBe(false);
  });

  it('returns false when no areas exist', () => {
    const page = { title: 'Home' };
    expect(hasAreaContent(page)).toBe(false);
  });
});

describe('site-localization — isStarterEnglishHome', () => {
  it('returns true for empty starter home', () => {
    const page = { type: '@apostrophecms/home-page', title: 'Home', homeHeroArea: { items: [] } };
    expect(isStarterEnglishHome(page)).toBe(true);
  });

  it('returns false when page has area content', () => {
    const page = { type: '@apostrophecms/home-page', title: 'Home', homeHeroArea: { items: [{ type: 'home-hero' }] } };
    expect(isStarterEnglishHome(page)).toBe(false);
  });

  it('returns false for non-home-page types', () => {
    const page = { type: 'solution-page', title: 'Home' };
    expect(isStarterEnglishHome(page)).toBe(false);
  });

  it('returns false for custom title', () => {
    const page = { type: '@apostrophecms/home-page', title: 'Custom Title', homeHeroArea: { items: [] } };
    expect(isStarterEnglishHome(page)).toBe(false);
  });
});
