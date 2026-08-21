// 学术研究页中文数据导入任务
// 运行：APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app research-archive-page:import
// 重复运行会更新而不是重复创建（使用稳定 slug /coohomcloud/corecompetency/paper）

// SQLite 辅助：直接读取 aposDocs 表定位 zh:draft 文档的 aposDocId。
// 避免依赖 task 环境下 pages.find / papers.find 返回对象缺失 _id / aposDocId 的问题（会导致 Cannot read split）。
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

function getSqliteDb() {
  const dbUri = process.env.APOS_DB_URI || '';
  const match = dbUri.match(/^sqlite:\/\/(.+)$/);
  if (!match) {
    return null;
  }
  try {
    const Database = require('better-sqlite3');
    return new Database(match[1]);
  } catch (e) {
    return null;
  }
}

function findDocIdsByType(type, locale) {
  const db = getSqliteDb();
  if (!db) {
    return [];
  }
  try {
    const rows = db.prepare(`SELECT data FROM aposDocs`).all();
    const result = [];
    for (const row of rows) {
      const d = JSON.parse(row.data);
      if (d.type === type && d.aposLocale === locale && d.aposDocId) {
        result.push(d.aposDocId);
      }
    }
    return result;
  } catch (e) {
    return [];
  } finally {
    db.close();
  }
}

function findDocIdBySlug(type, slug, locale) {
  const db = getSqliteDb();
  if (!db) {
    return null;
  }
  try {
    const rows = db.prepare(`SELECT data FROM aposDocs`).all();
    for (const row of rows) {
      const d = JSON.parse(row.data);
      if (d.type === type && d.aposLocale === locale && d.slug === slug && d.aposDocId) {
        return d.aposDocId;
      }
    }
    return null;
  } catch (e) {
    return null;
  } finally {
    db.close();
  }
}

// 删除某页面的所有版本行（draft / published / previous），保证重建走干净的 insert 分支。
// 采用 SQLite 直删，绕开 pages.update 对嵌套 relationship（outro.links._page -> pageIds）在 task 环境下
// 不兼容导致的 "Cannot read properties of undefined (reading 'split')"。
function deletePageRows(type, slug) {
  const db = getSqliteDb();
  if (!db) {
    return;
  }
  try {
    const rows = db.prepare(`SELECT _id, data FROM aposDocs`).all();
    const del = rows.filter((row) => {
      const d = JSON.parse(row.data);
      return d.type === type && d.slug === slug;
    }).map((row) => row._id);
    if (del.length) {
      const placeholders = del.map(() => '?').join(',');
      db.prepare(`DELETE FROM aposDocs WHERE _id IN (${placeholders})`).run(...del);
      console.log(`🗑️ 已删除旧页面记录 ${del.length} 条（${slug}）`);
    }
  } catch (e) {
    console.log(`⚠️ 删除旧页面失败（忽略）: ${e.message}`);
  } finally {
    db.close();
  }
}

// publish 后把 draft 的 papersIds 同步到 zh:published 行，修复 published 版论文关联丢失问题。
function syncPapersIdsToPublished(docId, papersIds) {
  const db = getSqliteDb();
  if (!db || !Array.isArray(papersIds) || !papersIds.length) {
    return;
  }
  try {
    const pubRow = db.prepare(`SELECT data FROM aposDocs WHERE _id = ?`).get(`${docId}:zh:published`);
    if (pubRow) {
      const pub = JSON.parse(pubRow.data);
      pub.papersIds = papersIds;
      db.prepare(`UPDATE aposDocs SET data = ? WHERE _id = ?`).run(JSON.stringify(pub), `${docId}:zh:published`);
      console.log(`🔗 已同步 papersIds 到 published（${papersIds.length} 篇）`);
    }
  } catch (e) {
    console.log(`⚠️ 同步 papersIds 到 published 失败（忽略）: ${e.message}`);
  } finally {
    db.close();
  }
}

function buildData(self) {
  // 用 Apostrophe 官方 fromPlaintext 把字符串转为可原位编辑的 rich-text area
  const area = (text) => self.apos.area.fromPlaintext(text);
  return {
    title: '学术研究',
    slug: '/coohomcloud/corecompetency/paper',
    type: 'research-archive-page',
    published: true,
    intro: {
      eyebrow: area('03 / RESEARCH ARCHIVE'),
      title: area('学术研究'),
      lead: area('这里汇聚群核空间智能团队在合成数据、AIGC、智能体与室内场景理解方向的研究成果。'),
      signals: [
        { label: area('SYNTHETIC DATA') },
        { label: area('AGENT RESEARCH') },
        { label: area('SPATIAL COMPUTING') }
      ]
    },
    sectionHead: {
      index: area('RESEARCH ARCHIVE / 2018—NOW'),
      heading: area('从空间数据到智能系统')
    },
    outro: {
      eyebrow: area('RESEARCH ARCHIVE / COMPLETE'),
      heading: area('返回核心能力，继续探索群核的数据基础设施'),
      // 以下链接在 task() 中通过 SQLite 动态查找目标页面 docId，写入 pageIds（relationship 的 idsStorage 字段）
      outroLinks: [
        { numberText: '01', labelText: '核心能力', targetSlug: '/coohomcloud/corecompetency', targetType: 'core-competency-page' },
        { numberText: '03', labelText: '样例数据集', targetSlug: '/coohomcloud/corecompetency/data', targetType: 'dataset-library-page' }
      ]
    }
  };
}

export default (self) => {
  return {
    usage: '导入学术研究页中文数据并发布。\n运行：node app research-archive-page:import',
    async task() {
      const apos = self.apos;
      const pages = apos.modules['@apostrophecms/page'];
      const req = apos.task.getReq();
      const data = buildData(self);
      const area = (text) => self.apos.area.fromPlaintext(text);

      // 先删除旧页面所有版本，再走 insert 分支全新建（publish 嵌套 relationship 后才一致）
      deletePageRows(data.type, data.slug);

      // 论文关联：直接用 SQLite 按 slug 匹配 5 篇论文的 docId，避免 papers.find 缺 _id 崩溃
      const paperSlugs = [
        'learning-based-inverse-rendering-of-complex-indoor-scenes',
        'minervas-massive-interior-environments-virtual-synthesis',
        'learning-to-recommend-frame-for-interactive-video-object-segmentation',
        'structured3d-a-large-photo-realistic-dataset-for-structured-3d-modeling',
        'data-driven-interior-plan-generation-for-residential-buildings'
      ];
      const paperDocIds = findDocIdsByType('research-paper', 'zh:draft');
      const matched = paperDocIds.filter((id) => {
        const db = getSqliteDb();
        if (!db) return false;
        try {
          const rows = db.prepare(`SELECT data FROM aposDocs`).all();
          for (const row of rows) {
            const d = JSON.parse(row.data);
            if (d.aposDocId === id && d.aposLocale === 'zh:draft' && paperSlugs.includes(d.slug)) {
              return true;
            }
          }
          return false;
        } catch (e) {
          return false;
        } finally {
          db.close();
        }
      });
      if (matched.length) {
        data.papersIds = matched;
        console.log(`📄 已匹配 ${matched.length} 篇论文`);
      }

      // 解析 outro 链接：用 SQLite 直接定位目标页面 docId 并写入 pageIds
      if (Array.isArray(data.outro?.outroLinks)) {
        data.outro.links = [];
        for (const link of data.outro.outroLinks) {
          const targetDocId = findDocIdBySlug(link.targetType, link.targetSlug, 'zh:draft');
          if (targetDocId) {
            data.outro.links.push({
              number: area(link.numberText),
              label: area(link.labelText),
              pageIds: [ targetDocId ]
            });
          } else {
            console.log(`⚠️ 学术研究页 outro 链接目标页面不存在，跳过: ${link.labelText} (${link.targetSlug})`);
          }
        }
        delete data.outro.outroLinks;
      }

      // 用 SQLite 定位当前页面是否已存在，避免 pages.find 在 task 环境下的不确定性
      const existingDocId = findDocIdBySlug(data.type, data.slug, 'zh:draft');
      if (existingDocId) {
        const draft = await pages.update(req, { ...data, _id: `${existingDocId}:zh:draft`, aposLocale: 'zh:draft' });
        await pages.publish(req, draft);
        syncPapersIdsToPublished(existingDocId, data.papersIds);
        console.log(`✅ 学术研究页已更新并发布: ${data.slug}（关联 ${(data.papersIds || []).length} 篇论文）`);
      } else {
        const home = await pages.find(req, { level: 0 }).toObject();
        if (!home) {
          throw new Error('Home 页面不存在，无法插入子页面');
        }
        const draft = await pages.insert(req, home._id, 'lastChild', { ...data, aposLocale: 'zh:draft', aposMode: 'draft' });
        await pages.publish(req, draft);
        const insertedDocId = findDocIdBySlug(data.type, data.slug, 'zh:draft');
        syncPapersIdsToPublished(insertedDocId, data.papersIds);
        console.log(`✅ 学术研究页已创建并发布: ${data.slug}（关联 ${(data.papersIds || []).length} 篇论文）`);
      }
    }
  };
};