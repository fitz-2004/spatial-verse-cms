# 核心能力与学术研究迁移记录

> 集成日期：2026-08-21
>
> 来源分支：`origin/migration/core-research`
>
> 集成分支：`dev`

本文只描述池一锴负责的“核心能力”和“学术研究”页面域。来源分支中对 Home、Solution、Dataset、About、Footer、公共路由等其他页面域的修改均未合入。

## 1. 页面、模型与文件

| 内容 | URL / 用途 | 后端模型 | Astro 渲染 |
|---|---|---|---|
| 核心能力 | `/coohomcloud/corecompetency` | `backend/modules/core-competency-page/index.js` | `frontend/src/templates/CoreCompetencyPage.astro` |
| 学术研究 | `/coohomcloud/corecompetency/paper` | `backend/modules/research-archive-page/index.js` | `frontend/src/templates/ResearchArchivePage.astro` |
| 论文 | 学术研究页可关联的独立 Piece | `backend/modules/research-paper/index.js` | `ResearchArchivePage.astro` 中的论文列表 |

配套前端文件：

- `frontend/src/components/core/CoreCapabilityNavigation.tsx`：核心能力页 React 交互导航，只负责交互，不保存 CMS 内容。
- `frontend/src/styles/core.css`、`frontend/src/styles/research.css`：两页域内样式。
- `frontend/src/lib/editableText.js`：从 Rich Text Area 提取交互所需的纯文本。
- `frontend/public/media/core-panels/`：四项能力的静态回退媒体；CMS `media` Area 有内容时优先显示 CMS 媒体。

## 2. `core-competency-page`

- `intro`：`eyebrow`、`title`、`lead`、`subcopy` 和 `signals[]`。
- `capabilities[]`：固定顺序的四项能力；包含 `number`、`header`、`label`、`title`、`text`、`media`。
- `outro`：收尾标题及内部页面 relationship 链接。
- 可见标题和说明主要使用只允许 Rich Text Widget 的 Area，以支持 Apostrophe 原位编辑。
- `media` 为空时使用 `frontend/public/media/core-panels/` 中的四张默认媒体。

## 3. `research-archive-page` 与 `research-paper`

研究归档页字段：

- `intro`：页面眉题、标题、说明及信号标签。
- `sectionHead`：论文列表区标题。
- `_papers`：关联 `research-paper` Pieces，前端不硬编码论文。
- `outro`：收尾标题和内部页面链接。

论文 Piece 字段：

- `title`、`slug`
- `year`、`venue`
- `abstract`
- `externalUrl`
- `cover` Area

论文作为 Piece 管理，便于独立维护、排序和在其他页面复用。当前归档页按关联顺序输出 5 篇论文。

## 4. SEO

两个 Page Type 均支持公共 `SeoHead.astro` 所需的完整字段：

- `seoTitle`、`seoDescription`、`seoKeywords`
- `seoCanonicalUrl`、`seoRobots`
- `seoOgTitle`、`seoOgDescription`、`seoOgImage`
- `seoTwitterCard`

Astro 把这些字段渲染为服务端 HTML 中的标题、description、canonical、robots、Open Graph 和 Twitter Card 标签。CMS 字段用于管理标签内容，不改变 Astro 负责生成 SEO HTML 的事实。

## 5. 安全数据导入

集成仓库使用统一的范围化任务，不使用来源分支中会清库或自动发布的旧任务：

```bash
cd backend
CORE_RESEARCH_SOURCE_DB=/absolute/path/to/spatial-verse-cms_chiyikai.sqlite \
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite \
node app core-research-import:import-drafts
```

实现文件：`backend/modules/core-research-import/index.js`。

任务约束：

- 只读取来源数据库的 `zh:draft`。
- 只处理 1 个核心能力页、1 个学术研究页和 5 个论文 Piece。
- 按 type + slug 幂等更新目标草稿，并保留目标页面 ID 与页面树关系。
- 将页面 relationship 和 5 篇论文关系映射为目标数据库 ID。
- 不删除目标数据，不写 Home、Solution、Dataset、About 或 Global。
- 不创建 `zh:published`，不自动发布。

## 6. 本次集成结果

- 已导入：`core-competency-page` 中文草稿 1 个。
- 已导入：`research-archive-page` 中文草稿 1 个。
- 已导入：`research-paper` 中文草稿 5 个。
- 学术研究草稿已关联目标数据库内的 5 个论文 Piece。
- 核心能力页的内部页面链接已重映射为目标数据库页面 ID。
- 与合并前数据库逐文档比较，所有非本页面域文档保持不变。
- 没有导入上述内容的公开版本；匿名访客在审核发布前访问对应 URL 返回 404 是预期行为。

## 7. 验证结果与已知差异

- Frontend production build：通过。
- Backend production build：通过。
- Edit/草稿页面浏览器验收：核心能力 4 个面板，学术研究 5 篇论文。
- 两页各只有一套公共 Header 和 SiteFooter。
- 核心能力 React island 只负责导航交互，页面内容仍由 Astro + CMS 数据生成。
- 英文 locale 尚未迁移。
- `research-paper` 的普通字符串字段在 Piece 管理界面编辑，不是页面文字直编；Page 中的 Rich Text Area 支持原位编辑。
- 四项能力的 CMS 媒体目前为空时显示静态回退图，编辑人员上传后由 CMS 媒体替代。
