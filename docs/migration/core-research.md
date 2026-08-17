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
- 列表页不硬编码论文，通过 relationship 关联查询

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
# 推荐先导入论文，再导入页面，确保学术研究页能关联到论文
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app research-paper:import
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app core-competency-page:import
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app research-archive-page:import
```

- 5 篇论文 + 2 个页面
- 稳定 slug，重复导入会更新
- 导入后调用 `publish` 发布，访客可直接访问

## 已完成修复记录

- **数据缺少 `type` 字段**：`research-paper:import` 数据曾缺 `type: 'research-paper'`，导致框架 `getManager` 返回 undefined 报 `Cannot read properties of undefined (reading 'emit')`。已补上 `type` 字段。
- **草稿未发布 404**：曾以 `zh:draft` 草稿状态存在，未登录访客访问页面返回 404。三个 import 任务已改为导入后调用 `publish`，页面与论文均已发布。
- **论文关联为空**：历史脏数据（slug 带数字后缀的重复文档）导致学术研究页关联 0 篇论文。已清空 `research-paper` 与两个页面类型文档后重新导入，数据库验证 published 页面关联 5 篇论文。
- **侧边导航重复**：核心能力页曾同时存在静态 `.core-capability-index` 与 React 齿轮导航两套跳转按钮造成重叠。已删除前者，保留带齿轮动画的 React 导航。

## 已迁移媒体

暂无（媒体由 CMS 编辑人员上传）

## 验证结果

- 前后端构建通过
- 本地 dev 环境验证页面可访问（未登录）
- 数据库验证：
  - 5 篇论文 `zh:published`（另有 `zh:draft` 供编辑）
  - 学术研究页 `zh:published` 关联 5 篇论文
  - 核心能力页 `zh:published` 正常
- 侧边导航去重后仅保留一套 React 齿轮导航

## 已知差异

1. 核心能力媒体未迁移（`media` 字段为预留插槽）
2. 论文排序按年份降序（`sort: { year: -1 }`）
3. 封面暂无数据
4. React island 使用 `client:visible`
5. 英文 locale 尚未创建