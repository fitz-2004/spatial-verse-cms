// 核心能力页中文数据导入任务
// 运行：node app core-competency-page:import
// 重复运行会更新而不是重复创建（稳定 slug /coohomcloud/corecompetency）

// SQLite 辅助：直接读取 aposDocs 表定位 zh:draft 文档的 aposDocId。
// 避免依赖 task 环境下 pages.find 返回对象缺失 _id / aposDocId 的问题（会导致 Cannot read split）。
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

function buildData(self) {
  const textArea = (text) => self.apos.area.fromPlaintext(text);

  return {
    title: '核心能力',
    slug: '/coohomcloud/corecompetency',
    type: 'core-competency-page',
    published: true,
    intro: {
      eyebrow: textArea('02 / CORE COMPETENCY'),
      title: textArea('核心能力'),
      lead: textArea('基于群核丰富的数据库资源，我们通过技术能力驱动的数据产品，满足 AIGC、计算机视觉与机器人等行业的数据需求。'),
      subcopy: textArea('通过专用数据引擎，将海量数据库转换为适配不同应用平台的 3D 模型、3D 环境与衍生图像数据。'),
      signals: [
        { label: textArea('3D MODEL DATA') },
        { label: textArea('ENVIRONMENT DATA') },
        { label: textArea('DERIVED IMAGE DATA') }
      ]
    },
    capabilities: [
      {
        number: textArea('01'),
        header: textArea('CORE CAPABILITY / 01'),
        label: textArea('01 / PHYSICAL ENHANCEMENT'),
        title: textArea('物理增强能力'),
        text: textArea('赋予模型密度，摩擦力，弹性，阻尼等真实的物理性质信息，同时还可以对活动部件进行可活动的物理约束')
        // media 由 CMS 后台数组编辑器添加
      },
      {
        number: textArea('02'),
        header: textArea('CORE CAPABILITY / 02'),
        label: textArea('02 / SEGMENTATION & ANNOTATION'),
        title: textArea('分割标注能力'),
        text: textArea('自动化结合人工标注技术，可实现包含语义，材质，状态等多种形态信息标注')
      },
      {
        number: textArea('03'),
        header: textArea('CORE CAPABILITY / 03'),
        label: textArea('03 / SCENE ENHANCEMENT'),
        title: textArea('场景增强能力'),
        text: textArea('通过场景设计工具、场景繁化、模型变形、场景光线模拟等能力，使场景数据更多样')
      },
      {
        number: textArea('04'),
        header: textArea('CORE CAPABILITY / 04'),
        label: textArea('04 / MULTI-CHANNEL SUPPORT'),
        title: textArea('支持多平台、高效率、更完整的3D模型数据导出，以及3D环境和衍生图片生成能力')
      }
    ],
    outro: {
      eyebrow: textArea('CORE COMPETENCY / COMPLETE'),
      heading: textArea('继续探索群核的数据基础设施'),
      // 以下链接在 task() 中通过 SQLite 动态查找目标页面 docId，写入 pageIds（relationship 的 idsStorage 字段），
      // 使前台 resolveHref 能正确解析内部链接 URL；目标页面不存在时保持无链接。
      outroLinks: [
        { numberText: '02', labelText: '学术研究', targetSlug: '/coohomcloud/corecompetency/paper', targetType: 'research-archive-page' },
        { numberText: '03', labelText: '样例数据集', targetSlug: '/coohomcloud/corecompetency/data', targetType: 'dataset-library-page' }
      ]
    },
    seoDescription: '群核空间智能平台面向 AIGC、计算机视觉与机器人行业的数据核心能力。',
    seoKeywords: '3D 数据, 核心能力, 群核, 空间智能'
  };
}

export default (self) => {
  return {
    usage: '导入核心能力页中文数据并发布。\n运行：node app core-competency-page:import',
    async task() {
      const apos = self.apos;
      const pages = apos.modules['@apostrophecms/page'];
      const req = apos.task.getReq();
      const data = buildData(self);
      const textArea = (text) => self.apos.area.fromPlaintext(text);

      // 先删除旧页面所有版本，再走 insert 分支全新建（publi sh 嵌套 relationship 后才一致）
      deletePageRows(data.type, data.slug);

      // 解析 outro 链接：用 SQLite 直接定位目标页面 docId 并写入 pageIds
      if (Array.isArray(data.outro?.outroLinks)) {
        data.outro.links = [];
        for (const link of data.outro.outroLinks) {
          const targetDocId = findDocIdBySlug(link.targetType, link.targetSlug, 'zh:draft');
          if (targetDocId) {
            data.outro.links.push({
              number: textArea(link.numberText),
              label: textArea(link.labelText),
              pageIds: [ targetDocId ]
            });
          } else {
            console.log(`⚠️ 核心能力页 outro 链接目标页面不存在，跳过: ${link.labelText} (${link.targetSlug})`);
          }
        }
        delete data.outro.outroLinks;
      }

      // 用 SQLite 定位当前页面是否已存在，避免 pages.find 在 task 环境下的不确定性
      const existingDocId = findDocIdBySlug(data.type, data.slug, 'zh:draft');
      if (existingDocId) {
        const draft = await pages.update(req, { ...data, _id: `${existingDocId}:zh:draft`, aposLocale: 'zh:draft' });
        await pages.publish(req, draft);
        console.log(`✅ 核心能力页已更新并发布: ${data.slug}`);
      } else {
        const home = await pages.find(req, { level: 0 }).toObject();
        if (!home) {
          throw new Error('Home 页面不存在，无法插入子页面');
        }
        const draft = await pages.insert(req, home._id, 'lastChild', { ...data, aposLocale: 'zh:draft', aposMode: 'draft' });
        await pages.publish(req, draft);
        console.log(`✅ 核心能力页已创建并发布: ${data.slug}（父页面: ${home.slug}）`);
      }
    }
  };
};