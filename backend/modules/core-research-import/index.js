import path from 'node:path';

import Database from 'better-sqlite3';

const PAGE_TYPES = [
  'core-competency-page',
  'research-archive-page'
];

const PAGE_FIELDS = {
  'core-competency-page': [
    'title',
    'intro',
    'capabilities',
    'outro',
    'seoTitle',
    'seoDescription',
    'seoKeywords',
    'seoCanonicalUrl',
    'seoRobots',
    'seoOgTitle',
    'seoOgDescription',
    'seoOgImage',
    'seoTwitterCard'
  ],
  'research-archive-page': [
    'title',
    'intro',
    'sectionHead',
    'outro',
    'seoTitle',
    'seoDescription',
    'seoKeywords',
    'seoCanonicalUrl',
    'seoRobots',
    'seoOgTitle',
    'seoOgDescription',
    'seoOgImage',
    'seoTwitterCard'
  ]
};

const PAPER_FIELDS = [
  'title',
  'slug',
  'year',
  'venue',
  'abstract',
  'externalUrl',
  'cover'
];

function pick(source, fields) {
  return Object.fromEntries(fields
    .filter((field) => source[field] !== undefined)
    .map((field) => [ field, structuredClone(source[field]) ]));
}

function loadSource(rootDir) {
  const configured = process.env.CORE_RESEARCH_SOURCE_DB;
  if (!configured) {
    throw new Error('缺少 CORE_RESEARCH_SOURCE_DB，请指定池一锴 SQLite 文件路径。');
  }
  const sourcePath = path.isAbsolute(configured)
    ? configured
    : path.resolve(rootDir, configured);
  const database = new Database(sourcePath, {
    readonly: true,
    fileMustExist: true
  });
  try {
    return database.prepare('SELECT data FROM aposDocs').all()
      .map(({ data }) => JSON.parse(data))
      .filter((doc) => doc.aposLocale === 'zh:draft');
  } finally {
    database.close();
  }
}

function remapPageLinks(value, sourceSlugByDocId, targetDocIdBySlug) {
  const cloned = structuredClone(value || {});
  if (!Array.isArray(cloned.links)) {
    return cloned;
  }
  cloned.links = cloned.links.map((link) => {
    const targetSlug = (link.pageIds || [])
      .map((id) => sourceSlugByDocId.get(id))
      .find(Boolean);
    const targetDocId = targetSlug && targetDocIdBySlug.get(targetSlug);
    const content = { ...link };
    delete content.pageIds;
    delete content._page;
    return {
      ...content,
      _page: targetDocId ? [ targetDocId ] : []
    };
  });
  return cloned;
}

export default {
  options: {
    alias: 'coreResearchImport'
  },
  tasks(self) {
    return {
      'import-drafts': {
        usage: 'CORE_RESEARCH_SOURCE_DB=/path/to/source.sqlite node app core-research-import:import-drafts\n\n只导入 zh:draft 的核心能力页、学术研究页和 research-paper；不导入其他文档，不发布。',
        async task() {
          const sourceDocs = loadSource(self.apos.rootDir);
          const sourcePages = sourceDocs.filter((doc) => PAGE_TYPES.includes(doc.type));
          const sourcePapers = sourceDocs.filter((doc) => doc.type === 'research-paper');

          if (sourcePages.length !== 2 || sourcePapers.length !== 5) {
            throw new Error(`源数据库范围不符合预期：页面 ${sourcePages.length}/2，论文 ${sourcePapers.length}/5。`);
          }

          const req = self.apos.task.getReq({
            locale: 'zh',
            mode: 'draft'
          });
          const pageManager = self.apos.modules['@apostrophecms/page'];
          const paperManager = self.apos.modules['research-paper'];
          const home = await pageManager.find(req, { level: 0 }).toObject();
          if (!home) {
            throw new Error('目标数据库缺少 zh:draft Home，无法建立业务页面。');
          }

          const targetPages = new Map();
          for (const sourcePage of sourcePages) {
            let target = await pageManager.find(req, {
              type: sourcePage.type,
              slug: sourcePage.slug
            }).toObject();
            if (!target) {
              target = await pageManager.insert(req, home._id, 'lastChild', {
                type: sourcePage.type,
                title: sourcePage.title,
                slug: sourcePage.slug,
                visibility: sourcePage.visibility || 'public'
              });
            }
            targetPages.set(sourcePage.slug, target);
          }

          const targetPaperDocIdBySlug = new Map();
          for (const sourcePaper of sourcePapers) {
            const fields = {
              type: 'research-paper',
              ...pick(sourcePaper, PAPER_FIELDS),
              visibility: sourcePaper.visibility || 'public'
            };
            const existing = await paperManager.find(req, {
              slug: sourcePaper.slug
            }).toObject();
            const updated = existing
              ? await paperManager.update(req, { ...existing, ...fields })
              : await paperManager.insert(req, fields);
            const targetDocId = updated.aposDocId || updated._id?.split(':')[0];
            if (!targetDocId) {
              throw new Error(`导入论文后无法取得 aposDocId: ${sourcePaper.slug}`);
            }
            targetPaperDocIdBySlug.set(sourcePaper.slug, targetDocId);
          }

          const sourceSlugByDocId = new Map(sourceDocs
            .filter((doc) => doc.aposDocId && doc.slug)
            .map((doc) => [ doc.aposDocId, doc.slug ]));
          const targetPageDocs = await pageManager.find(req, {}).toArray();
          const targetPageDocIdBySlug = new Map(targetPageDocs
            .filter((page) => page.slug && page.aposDocId)
            .map((page) => [ page.slug, page.aposDocId ]));
          const sourcePaperSlugByDocId = new Map(sourcePapers
            .map((paper) => [ paper.aposDocId, paper.slug ]));

          for (const sourcePage of sourcePages) {
            const current = targetPages.get(sourcePage.slug);
            const fields = pick(sourcePage, PAGE_FIELDS[sourcePage.type]);
            fields.outro = remapPageLinks(
              sourcePage.outro,
              sourceSlugByDocId,
              targetPageDocIdBySlug
            );
            if (sourcePage.type === 'research-archive-page') {
              fields._papers = (sourcePage.papersIds || [])
                .map((sourceId) => sourcePaperSlugByDocId.get(sourceId))
                .map((slug) => targetPaperDocIdBySlug.get(slug))
                .filter(Boolean);
            }
            const updated = await pageManager.update(req, {
              ...current,
              ...fields,
              type: sourcePage.type,
              slug: sourcePage.slug,
              visibility: sourcePage.visibility || current.visibility || 'public'
            });
            targetPages.set(sourcePage.slug, updated);
          }

          console.log('已导入 Core + Research 中文草稿：');
          console.log(`- 页面：${sourcePages.length}`);
          console.log(`- Research Paper：${sourcePapers.length}`);
          console.log('- Published：0（本任务不会发布）');
        }
      }
    };
  }
};
