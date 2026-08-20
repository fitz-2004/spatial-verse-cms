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

> **原位编辑基线**：所有前台可见文本一律使用 `area`（rich-text）字段，编辑人员在 `aposEdit` 模式下可直接点击标题、副标题、eyebrow、标签、卡片文字等进行原位编辑，不在 Astro 模板中硬编码业务文案。需要纯文本的场景（React island props、aria 属性、key）由前端 `lib/editableText.js` 的 `areaText()` 从 area 提取。
>
> **SEO 基线**：每个 Page Type 提供独立的 `seo` 分组（`seoTitle` / `seoDescription` / `seoKeywords`），公共路由 `frontend/src/pages/[...slug].astro` 自动输出 meta description。

### core-competency-page

- `title` — 页面标题（系统标题，不用于前台展示）
- `intro` object — 简介区块，文本全部 area 化：
  - `eyebrow` — 索引标签（area）
  - `title` — 大标题（area）
  - `lead` — 引导语（area）
  - `subcopy` — 副文案（area）
  - `signals` array — 数据类型标签（label 为 area）
- `capabilities` array — 四项能力，文本全部 area 化：
  - `number`（area，编号，如 `02`，面板核心圈/元信息/Core 齿轮导航复用）
  - `header`（area，面板页眉整行，如 `CORE CAPABILITY / 02`）
  - `label`（area，面板整行标签，如 `02 / PHYSICAL ENHANCEMENT`）
  - `title`（area）、`text`（area）
  - `media`（area，图片/视频）— **有内容时优先渲染 CMS 媒体；为空时回退到前端静态默认图**（见「已迁移媒体」）
- `outro` object — 收尾（Next）区块：
  - `eyebrow`（area）、`heading`（area）
  - `links` array — 下一层级链接：`number`（area）、`label`（area）、`_page`（relationship，前台用 `resolveHref` 解析内部链接；不再在模板硬编码链接数组）
- `seo` 分组：`seoTitle` / `seoDescription` / `seoKeywords`
- 使用 `array` 而非 Widget，因面板顺序固定但内容可编辑

### research-archive-page

- `title` — 页面标题（系统标题，不用于前台展示）
- `intro` object — 简介，文本 area 化：`eyebrow`、`title`、`lead`、`signals`（label 为 area）
- `sectionHead` object — Archive 区块标题：`index`（area）、`heading`（area）
- `outro` object — 收尾区块：`eyebrow`、`heading`、`links`（结构同核心能力页，`_page` 通过 `resolveHref` 解析）
- `_papers` relationship — 关联 research-paper Pieces
- `seo` 分组：`seoTitle` / `seoDescription` / `seoKeywords`
- 列表页不硬编码论文，通过 relationship 关联查询

### research-paper (Piece)

- `title`、`year`、`venue`、`abstract`、`externalUrl`、`cover`(area)
  - 论文列表卡片上的 `title` / `abstract` / `venue` 由 Piece 字段渲染；如需原位编辑可在 Piece 中改为 area（当前保持 string，由管理端编辑）
- Piece 用于独立生命周期与跨页查询，slug 作为稳定标识

## 新增模块与注册项

- `backend/modules/research-paper/` — 新建 Piece
- `backend/app.js` — 注册 research-paper
- `frontend/src/templates/CoreCompetencyPage.astro` / `ResearchArchivePage.astro`
- `frontend/src/components/core/CoreCapabilityNavigation.tsx`
- `frontend/src/styles/core.css`、`frontend/src/styles/research.css`（含 rich-text area 排版适配）
- `frontend/public/media/core-panels/` — 面板默认回退图（`panel-1.gif` / `panel-2.png` / `panel-3.jpg` / `panel-4.png`）
- `frontend/src/lib/editableText.js` — `areaText()` 工具，area → 纯文本
- 联动更新（顺带补齐，非本域核心）：`solution-page` / `about-page` / `dataset-library-page` 的可见文本同样 area 化 + 补全模板与 SEO 字段，新增 `frontend/src/templates/SolutionPage.astro` 样式 `solution.css`

## 数据导入方法

```bash
# 执行目录 backend/
# 推荐先导入论文，再导入核心能力页，最后导入学术研究页（确保关联到论文）
node app research-paper:import
node app core-competency-page:import
node app research-archive-page:import
```

> Windows PowerShell 提示：请先通过 `backend/.env` 配置或 `$env:APOS_DB_URI="sqlite://data/spatial-verse-cms.sqlite"` 设置环境变量，再执行上面的命令。

- 5 篇论文 + 2 个页面
- 所有可见文本通过 `self.apos.area.fromPlaintext()` 转为合法 rich-text area，前台可直接点击原位编辑
- 核心能力页与学术研究页新增 `outro`（收尾区块）中文草稿数据
- 导入数据含 SEO 描述/关键词（`seoDescription` / `seoKeywords`）
- 稳定 slug，重复导入会更新；导入后调用 `publish` 发布
- 已确认草稿与发布版 slug 一致（`/coohomcloud/corecompetency`、`/coohomcloud/corecompetency/paper`）

## 已完成修复记录

- **数据缺少 `type` 字段**：`research-paper:import` 数据曾缺 `type: 'research-paper'`，导致框架 `getManager` 返回 undefined 报 `Cannot read properties of undefined (reading 'emit')`。已补上 `type` 字段。
- **草稿未发布 404**：曾以 `zh:draft` 草稿状态存在，未登录访客访问页面返回 404。三个 import 任务已改为导入后调用 `publish`，页面与论文均已发布。
- **论文关联为空**：历史脏数据（slug 带数字后缀的重复文档）导致学术研究页关联 0 篇论文。已清空 `research-paper` 与两个页面类型文档后重新导入，数据库验证 published 页面关联 5 篇论文。
- **侧边导航重复**：核心能力页曾同时存在静态 `.core-capability-index` 与 React 齿轮导航两套跳转按钮造成重叠。已删除前者，保留带齿轮动画的 React 导航。
- **发布后 slug 被加后缀导致 404**：数据库中残留 slug 带数字后缀的脏文档（如 `corecompetency28`、`paper8`、`_id` 为 `undefined` 的论文），重新发布时 Apostrophe 自动为 slug 去重加后缀，访客访问干净的 `/coohomcloud/corecompetency` 返回 404。已清理这三类文档后按顺序重新导入，draft 与 published slug 一致。
- **published 版论文关联丢失**：学术研究页 draft 含 `papersIds`，但发布后 published 版 `papersIds` 为空导致列表 `_papers` 为 0。已把 draft 的 `papersIds` 复制到 `zh:published` 文档，API 验证返回 5 篇论文。
- **文本字段原位编辑改造**：标题/副标题/eyebrow/标签/卡片文本由 `string` 改为 `area`（rich-text），模板改用 `<AposArea />` 渲染；React 齿轮导航、aria 属性、key 通过 `areaText()` 取纯文本；`outro` 链接通过 `resolveHref()` 解析 `_page` 关系，移除模板内硬编码链接数组。
- **`--pink` 变量缺失**：面板第 4 项 `accent-pink` 背景不生效，根因是 `site-chrome.css` 未定义 `--pink` 令牌。已补充 `--pink: #ff7ab6`。
- **齿轮导航遮挡版面**：React 齿轮导航固定定位 `right: 0` 会重叠面板内容。已改为 `right: -130px`，使其悬停滑出、平时在视口外不遮挡。
- **rich-text 换行/间距破坏**：文本 area 化后 `<p>` 默认 margin 与 `white-space` 导致标签、页眉、meta 等出现换行和间距错乱。已在 `core.css` / `research.css` 增加 rich-text widget 排版适配（清 margin、inline-flex、`white-space: nowrap`）。
- **面板媒体空插槽**：`media` area 为空时原本显示占位文字，现改为回退前端静态默认图（原站视觉参考图），CMS 有媒体时优先渲染。

## 已迁移媒体

- CMS 上传媒体暂无（`media` 字段保留给编辑人员上传）
- 面板默认回退图已入库 `frontend/public/media/core-panels/`（4 张，对应四项能力）：
  - `panel-1.gif`（01 物理增强）
  - `panel-2.png`（02 分割标注）
  - `panel-3.jpg`（03 场景增强）
  - `panel-4.png`（04 多通道支持）
- 回退逻辑在 `CoreCompetencyPage.astro`：`capability.media.items?.length` 有值渲染 `<AposArea>`，否则 `<img class="core-capability-panel-default-media">`

## 验证结果

- 前后端 `npm run build` 通过
- 后端 7 个修改的 JS 文件 `node --check` 通过；源码无残留非法标签
- 本地 dev 环境验证：
  - `GET /coohomcloud/corecompetency` → 200，`intro.title`、`outro.heading` 等 `metaType: "area"`
  - `GET /coohomcloud/corecompetency/paper` → 200，`_papers` 返回 5 篇论文，`intro.title`、`sectionHead.heading`、`outro.heading` 均为 area
- 数据库验证：
  - 5 篇论文 `zh:published`（另有 `zh:draft` 供编辑）
  - 学术研究页 `zh:published` 关联 5 篇论文
  - 核心能力页 `zh:published` 正常
- 侧边导航去重后仅保留一套 React 齿轮导航；齿轮悬停滑出不遮挡面板
- `--pink` 令牌生效，四项 accent 正常；rich-text 文本无异常换行

## 已知差异

1. 核心能力面板 `media` 字段暂由编辑人员上传；当前展示回退到 `frontend/public/media/core-panels/` 默认图
2. 论文排序按年份降序（`sort: { year: -1 }`）
3. 封面暂无数据
4. React island 使用 `client:visible`
5. 英文 locale 尚未创建
6. 少量纯装饰标识仍为模板硬编码，如 `SPATIALVERSE ENGINE`、`CMS / MEDIA FIELD`、`CORE SYSTEM / COMPLETE`、`SCROLL TO NEXT CAPABILITY`、`CORE` 等；`CORE CAPABILITY / 01` 等面板页眉已由 `header` 字段接管（area）
7. 论文列表卡片的 `title` / `abstract` / `venue` 仍为 Piece string 字段（管理端编辑）；如需前台原位编辑可后续将 Piece 字段改为 area
