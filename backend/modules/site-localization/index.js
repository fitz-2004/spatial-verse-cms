import originalEnglishCopy from './lib/originalEnglishCopy.js';

const PAGE_TYPES = [
  '@apostrophecms/home-page',
  'solution-page',
  'core-competency-page',
  'research-archive-page',
  'dataset-library-page',
  'about-page'
];

const PIECE_TYPES = [
  'research-paper',
  'dataset-item'
];

const TRANSLATION_PAIRS = [ ...originalEnglishCopy ]
  .filter(([ source, target ]) => source && target && source !== target)
  .sort(([ left ], [ right ]) => right.length - left.length);

const UNTRANSLATED_KEYS = new Set([
  '_id',
  'aposDocId',
  'aposLocale',
  'aposMode',
  'type',
  'metaType',
  'slug',
  'path',
  'url',
  'href',
  'attachment',
  'createdAt',
  'updatedAt'
]);

function translateString(value) {
  return TRANSLATION_PAIRS.reduce(
    (translated, [ source, target ]) => translated.split(source).join(target),
    value
  );
}

function translateMatchingValues(source, target, key = '', translateResiduals = false) {
  if (UNTRANSLATED_KEYS.has(key) || key.startsWith('_')) {
    return target;
  }
  if (typeof source === 'string' && typeof target === 'string') {
    return (
      target === source
      || (translateResiduals && /[\u3400-\u9fff]/u.test(target))
    )
      ? translateString(source)
      : target;
  }
  if (Array.isArray(source) && Array.isArray(target)) {
    return target.map((value, index) => (
      index < source.length
        ? translateMatchingValues(source[index], value, key, translateResiduals)
        : value
    ));
  }
  if (
    source
    && target
    && typeof source === 'object'
    && typeof target === 'object'
  ) {
    if (
      Object.getPrototypeOf(source) !== Object.prototype
      || Object.getPrototypeOf(target) !== Object.prototype
    ) {
      return target;
    }
    return Object.fromEntries(Object.entries(target).map(([ childKey, value ]) => [
      childKey,
      Object.hasOwn(source, childKey)
        ? translateMatchingValues(source[childKey], value, childKey, translateResiduals)
        : value
    ]));
  }
  return target;
}

function hasAreaContent(page) {
  return Object.entries(page).some(([ key, value ]) => (
    key.endsWith('Area')
    && Array.isArray(value?.items)
    && value.items.length > 0
  ));
}

function isStarterEnglishHome(page) {
  return page?.type === '@apostrophecms/home-page'
    && !hasAreaContent(page)
    && (!page.title || page.title === 'Home');
}

export default {
  methods(self) {
    return {
      async localizeDocument({ sourceReq, source, publish }) {
        const manager = self.apos.doc.getManager(source.type);
        const targetReq = sourceReq.clone({
          locale: 'en',
          mode: 'draft'
        });
        const targetId = `${source.aposDocId}:en:draft`;
        const existing = await manager
          .findForEditing(targetReq, { _id: targetId })
          .permission('view')
          .archived(null)
          .toObject();

        let localized = existing;
        let action = 'kept';

        if (!existing) {
          localized = await manager.localize(sourceReq, source, 'en');
          action = 'created';
        } else if (isStarterEnglishHome(existing)) {
          localized = await manager.localize(sourceReq, source, 'en', {
            update: true
          });
          action = 'initialized';
        }

        // A copied Chinese document is only a structural/editorial starting
        // point. Keep it out of search results until an editor has completed
        // and reviewed the English content.
        if (
          localized
          && Object.hasOwn(localized, 'seoRobots')
          && action !== 'kept'
        ) {
          localized = await manager.update(targetReq, {
            ...localized,
            seoRobots: 'noindex-follow'
          });
        }

        // Never publish an existing English draft on a repeat run. It may
        // contain an editor's unfinished work. Publishing is only part of the
        // one-time placeholder creation/initialization path.
        if (publish && localized && action !== 'kept') {
          await manager.publish(targetReq, localized);
        }

        return {
          action,
          published: Boolean(publish && action !== 'kept'),
          slug: localized?.slug || localized?.title || source.aposDocId,
          type: source.type
        };
      },

      async ensureEnglishLocalizations() {
        const publish = process.env.PUBLISH_EN_PLACEHOLDERS === '1';
        const sourceReq = self.apos.task.getReq({
          locale: 'zh',
          mode: 'draft'
        });
        const results = [];

        // Localize independently managed records first so localized page
        // relationships can resolve against their English counterparts.
        for (const type of PIECE_TYPES) {
          const manager = self.apos.doc.getManager(type);
          if (!manager) continue;
          const pieces = await manager.find(sourceReq, {}).archived(null).toArray();
          for (const source of pieces) {
            results.push(await self.localizeDocument({
              sourceReq,
              source,
              publish
            }));
          }
        }

        const pages = await self.apos.page
          .find(sourceReq, {
            type: { $in: PAGE_TYPES }
          })
          .archived(null)
          .toArray();
        pages.sort((left, right) => (
          (left.level - right.level) || (left.rank - right.rank)
        ));

        for (const source of pages) {
          results.push(await self.localizeDocument({
            sourceReq,
            source,
            publish
          }));
        }

        const counts = results.reduce((summary, result) => {
          summary[result.action] = (summary[result.action] || 0) + 1;
          return summary;
        }, {});

        console.log('English Localization baseline complete.');
        console.log(`Published placeholders: ${publish ? 'yes' : 'no'}`);
        console.log(`Created: ${counts.created || 0}`);
        console.log(`Initialized parked Home: ${counts.initialized || 0}`);
        console.log(`Existing English content kept unchanged: ${counts.kept || 0}`);
        results.forEach((result) => {
          console.log(`[${result.action}] ${result.type}: ${result.slug}`);
        });
      },

      async translateEnglishLocalizations() {
        const publish = process.env.PUBLISH_EN_TRANSLATIONS === '1';
        const translateResiduals = process.env.TRANSLATE_EN_RESIDUALS === '1';
        const sourceReq = self.apos.task.getReq({ locale: 'zh', mode: 'draft' });
        const targetReq = sourceReq.clone({ locale: 'en', mode: 'draft' });
        const types = [ ...PIECE_TYPES, ...PAGE_TYPES ];
        const results = [];

        for (const type of types) {
          const manager = self.apos.doc.getManager(type);
          if (!manager) continue;
          const sources = await manager.find(sourceReq, {}).archived(null).toArray();

          for (const source of sources) {
            const target = await manager
              .findForEditing(targetReq, {
                _id: `${source.aposDocId}:en:draft`
              })
              .permission('view')
              .archived(null)
              .toObject();
            if (!target) continue;

            const translated = translateMatchingValues(
              source,
              target,
              '',
              translateResiduals
            );
            const changed = JSON.stringify(translated) !== JSON.stringify(target);
            if (!changed) {
              results.push({ action: 'kept', type, slug: target.slug || target.title });
              continue;
            }

            const updated = await manager.update(targetReq, translated);
            if (publish) {
              await manager.publish(targetReq, updated);
            }
            results.push({ action: 'translated', type, slug: updated.slug || updated.title });
          }
        }

        const translatedCount = results.filter(({ action }) => action === 'translated').length;
        console.log('Original-site English copy migration complete.');
        console.log(`Updated English documents: ${translatedCount}`);
        console.log(`Unchanged English documents: ${results.length - translatedCount}`);
        console.log(`Published translated documents: ${publish ? 'yes' : 'no'}`);
      }
    };
  },

  tasks(self) {
    return {
      'ensure-en': {
        usage: 'Usage: node app site-localization:ensure-en\n\nCreates missing en:draft localizations for the approved business pages, research-paper and dataset-item records by copying the matching zh:draft document. Existing English content is never overwritten, except the empty parked English Home created by Apostrophe. Set PUBLISH_EN_PLACEHOLDERS=1 to publish the copied placeholders; copied pages remain noindex until reviewed.',
        task: self.ensureEnglishLocalizations
      },
      'translate-en': {
        usage: 'Usage: node app site-localization:translate-en\n\nApplies the original dby_vibe English copy map to en:draft documents. A value is translated only while it still exactly matches the zh:draft value, so manually edited English content is not overwritten. Set PUBLISH_EN_TRANSLATIONS=1 to publish documents changed by this run.',
        task: self.translateEnglishLocalizations
      }
    };
  }
};
