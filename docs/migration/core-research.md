# 核心能力与学术研究迁移记录

## 原站基准

- 原站仓库：`spatial-verse-site`
- 原站分支：`dby_vibe`
- 基准 commit：`eb1246e63ee01b5f03a6ea93dc122e65ef337e7c`

## 页面与 URL

| 页面 | URL | Page Type | Astro Template |
|---|---|---|---|
| 核心能力 | `/coohomcloud/corecompetency` | `core-competency-page` | `CoreCompetencyPage.astro` |
| 学术研究 | `/coohomcloud/corecompetency/paper` | `research-archive-page` | `ResearchArchivePage.astro` |

Piece 类型：`research-paper`（论文）

## 字段清单与建模理由

### core-competency-page

- `title` — 页面标题
- `intro` object — 简介区块：`eyebrow`、`title`、`lead`、`subcopy`、`signals`(array)
- `capabilities` array — 四项能力：`number`、`label`、`title`、`text`、`media`(area)
- 使用 `array` 而非 Widget，因面板顺序固定但内容可编辑

### research-archive-page

- `title` — 页面标题
- `intro` object — 简介：`eyebrow`、`title`、`lead`、`signals`
- `sectionHead` object — `index`、`heading`
- `_papers` relationship — 关联 research-paper Pieces
- 列表页不硬编码论文，通过 relationship 查询

### research-paper (Piece)

- `title`、`year`、`venue`、`abstract`、`externalUrl`、`cover`(area)
- Piece 用于独立生命周期与跨页查询，slug 作为稳定标识

## 新增模块与注册项

- `backend/modules/research-paper/` — 新建 Piece
- `backend/app.js` — 注册 research-paper
- `frontend/src/templates/CoreCompetencyPage.astro`
- `frontend/src/templates/ResearchArchivePage.astro`
- `frontend/src/components/core/CoreCapabilityNavigation.tsx`
- `frontend/src/styles/core.css`、`frontend/src/styles/research.css`

## 数据导入方法

```bash
# 执行目录 backend/
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app research-paper:import
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app core-competency-page:import
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app research-archive-page:import
```

- 5 篇论文 + 2 个页面，全部草稿未发布
- 稳定 slug，重复导入会更新

## 已迁移媒体

暂无（媒体由 CMS 编辑人员上传）

## 验证结果

待启动本地 dev 环境验证。

## 已知差异

1. 核心能力媒体未迁移
2. 论文排序按年份降序
3. 封面暂无数据
4. React island 使用 client:visible