# SpatialVerse CMS 当前迁移进度

> 更新日期：2026-08-21
>
> 当前工作分支：`dev`
>
> 整理基准提交：`e4a6775`（删除首页 React mock 回退分支）
>
> 协作目标分支：`dev`

本文记录仓库当前已经完成的内容、仅存在于本机 CMS 数据库中的内容、尚未完成的页面和下一步工作。所有参与迁移的开发人员仍须先阅读根目录的 [`AGENTS.md`](./AGENTS.md) 与 [`MIGRATION_WORK_SPLIT.md`](./MIGRATION_WORK_SPLIT.md)；各页面域的模型细节以 `docs/migration/` 下对应文档为准。

已完成 Page Type 的字段、Widget 与代码文件映射速查见 [`CONTENT_MODEL.md`](./CONTENT_MODEL.md)。

## 1. 当前架构结论

正式页面统一采用以下链路：

```text
ApostropheCMS Page / Area / Widget / Piece 数据
                    ↓
          apostrophe-astro 获取数据
                    ↓
             Astro Template 渲染
                    ↓
          服务端生成可抓取的 HTML
```

- ApostropheCMS 管理页面树、草稿/公开内容、媒体、Page fields、Area、Widget、Piece 和 Global。
- Astro 负责页面 HTML、结构、样式及 SEO 输出。
- React 只允许作为动画或复杂交互的客户端 island，不负责保存 CMS 内容，也不得作为另一套页面渲染方案。
- `frontend/src/pages/[...slug].astro` 是唯一正式路由，统一装配 SEO、Header、页面 Template、Footer 和 Apostrophe 编辑上下文。
- Preview、Edit 与匿名访客页面必须使用同一份 Astro Template 和同一套组件；它们只能因读取的 CMS 文档版本和编辑工具层不同而不同。

### Widget 与“发布”的准确含义

Widget 包含两个不同层次，不能混为一谈：

1. **Widget 类型代码**：例如 `home-hero-widget` 的后端模块及对应 Astro 映射。它由开发人员写入仓库、注册并随应用部署，**不需要编辑人员在 CMS 中发布**。
2. **Widget 内容实例**：编辑人员在某个页面 Area 中创建的具体内容，如首页 Hero 的标题、按钮和媒体。它属于页面文档数据，并分别存在于草稿版本与公开版本中。

因此，之前所说的“发布新 Widget”并不准确。准确说法是：**把包含新版 Area/Widget 内容实例的页面草稿发布到该页面的公开版本**。如果草稿已经导入六个首页 Area，但公开版本仍是迁移前的旧页面数据，那么公开版本可能没有这些 Area 内容；这属于数据库中草稿与公开文档不同步，不是 Widget 代码没有发布。

当前首页已删除为这种数据不完整情况准备的 React/mock 回退。缺少 CMS 内容时应修复或重新导入对应页面数据，并在审核后发布，不能切换到另一套前端实现掩盖问题。

## 2. 页面迁移状态

| 页面范围 | URL | Page Type | 代码状态 | CMS 数据状态 |
|---|---|---|---|---|
| 首页 | `/` | `@apostrophecms/home-page` | 已完成 Astro + ApostropheCMS 接入、视觉迁移、原位编辑、交互和 SEO | 本机已有 `zh:draft` 与对应公开版本；均使用六个 CMS Area |
| 五个 Solution 页面 | `/coohomcloud/solutions/*` | `solution-page` | 已整合楼博涵的 Astro + ApostropheCMS 实现 | 本机已导入 5 个 `zh:draft`；尚未发布 |
| 核心能力 | `/coohomcloud/corecompetency` | `core-competency-page` | 已整合 Astro + ApostropheCMS、4 个能力面板、原位编辑与交互导航 | 本机已导入 1 个 `zh:draft`；尚未发布 |
| 学术研究 | `/coohomcloud/corecompetency/paper` | `research-archive-page` | 已整合 Astro + ApostropheCMS、论文 Piece 关系及列表视觉 | 本机已导入页面草稿与 5 个 `research-paper` 草稿；尚未发布 |
| 样例数据集 | `/coohomcloud/corecompetency/data` | `dataset-library-page` | 仅有 Page Type 与最小 Template 占位 | `dataset-item` Piece 与正文未迁移 |
| 关于我们 | `/coohomcloud/about` | `about-page` | 仅有 Page Type 与最小 Template 占位 | 正文未迁移 |

其中五个 Solution URL、字段、组件、导入任务和已知差异见 [`docs/migration/solutions.md`](./docs/migration/solutions.md)。核心能力与学术研究见 [`docs/migration/core-research.md`](./docs/migration/core-research.md)。首页完整内容模型见 [`docs/migration/home.md`](./docs/migration/home.md)。

## 3. 首页完成情况

### 内容模型

首页使用六个固定单例 Area，顺序由 `HomePage.astro` 固定：

| Page Area | Widget 类型 | 内容范围 |
|---|---|---|
| `homeBrandArea` | `home-brand` | 品牌开屏 |
| `homeHeroArea` | `home-hero` | 首页 Hero 与 CTA |
| `homeSolutionsArea` | `home-solutions` | 五个解决方案入口及媒体 |
| `homeCapabilitiesArea` | `home-capabilities` | 四个核心能力及媒体 |
| `homeWhyArea` | `home-why` | 技术支持内容与四个可原位编辑指标 |
| `homeSupportArea` | `home-support` | 三种支持模式与 CTA |

- 每个 Area 位于固定位置，只允许对应的一个首页 Widget，不能跨区块拖动或重排。
- 可见文字通过受限 Rich Text Area 支持原位编辑。
- SEO、slug 等技术字段仍属于 Home Page fields。
- 首页交互由 `homeContextual.ts` 管理；`DeepSeekHarnessBackground.tsx` 只负责背景动画。
- 已删除 `HomeExperience.tsx`、`fromApostrophe.ts`、`mock.ts` 和 `types.ts`，不存在 React/mock 整页回退。
- Preview、Edit 和公开状态现在都只渲染 `HomePage.astro` 中相同的六个 `<AposArea>`。

### 已验证事项

- 首页视觉和主要交互已按原站恢复。
- Header 和 Footer 只由公共路由各渲染一次。
- Draft/Preview 切换后 Header 不再被错误隐藏。
- 首页能力标题不会再因 Edit/Preview 切换出现 `x物理增强能力` 与 `物理增强能力` 不一致。
- 四个指标在 Preview 与 Edit 中使用相同字号、颜色、行高和布局。
- 首页 Production build 已通过。
- 匿名 SSR 返回 HTTP 200，并输出 Astro 服务端 HTML。

## 4. Solution 整合情况

- 五个页面共用一个 `solution-page` 和一个 `SolutionPage.astro`。
- 已整合 Hero、媒体、挑战、优势、服务和 CTA 组件。
- 已接入 Page fields、Rich Text 原位编辑与公共 SEO 输出。
- 已纳入五个实际引用视频，目录为 `frontend/public/media/solutions/`。
- 已提供范围受控的 `solution-page:import-drafts` 导入任务。
- 本机集成数据库已导入五个中文草稿，不包含 Solution 公开版本。
- 已验证桌面视觉和主要滚动效果；移动端、全部响应式断点及无媒体降级仍需补充验收。

## 5. 公共基础完成情况

- 公共 Header：`frontend/src/components/SiteHeader.astro`
- 公共 Footer：`frontend/src/components/SiteFooter.astro`
- 联系抽屉：`frontend/src/components/ContactDrawer.astro`
- 公共路由：`frontend/src/pages/[...slug].astro`
- 公共 SEO：`frontend/src/components/SeoHead.astro`
- 全局站点数据：`backend/modules/@apostrophecms/global/`
- 中文 `zh` 为默认 locale，英文 `en` 使用 `/en` 的 i18n 基础配置已建立。
- 全站只保留一个正式 Footer；历史 `legacy-footer` 等节点不迁移，详见 [`docs/migration/shared-footer.md`](./docs/migration/shared-footer.md)。

公共 SEO 当前支持：

- `<title>` 与 meta description
- canonical 与 robots
- Open Graph 与 Twitter Card
- `hreflang` 与 `x-default`
- WebSite、WebPage、Organization JSON-LD

Astro 本身负责把 SEO 标签生成到 HTML；Page fields 负责让 CMS 编辑人员无需修改代码即可管理这些标签的内容。生产环境仍需配置正确的 `PUBLIC_SITE_URL`。

## 6. 核心能力与学术研究整合情况

- 核心能力页使用 `core-competency-page`，固定输出简介、四项能力和收尾链接。
- 学术研究页使用 `research-archive-page`，通过 relationship 关联 `research-paper` Piece。
- 核心能力的 React 组件仅作为交互 island，CMS 内容由 Astro Template 服务端渲染。
- 已纳入四项能力实际使用的回退媒体，CMS Area 上传媒体后优先显示 CMS 内容。
- 已提供 `core-research-import:import-drafts` 范围化导入任务，只写这两个页面和论文的中文草稿。
- 本机已导入 2 个页面草稿与 5 个论文草稿，没有创建任何公开版本。
- 已验证 Frontend/Backend production build、4 个能力面板、5 篇论文及单套公共 Header/Footer。

## 7. Git 与本机 CMS 数据边界

当前代码分支相对 `origin/dev` 为领先状态，尚未推送本次最新提交。仓库中的代码提交不包含以下本机状态：

- `backend/data/spatial-verse-cms.sqlite`
- SQLite 的 `-wal`、`-shm` 运行文件
- Apostrophe 管理员账号
- `backend/public/uploads/` 中的 CMS 上传文件
- 页面草稿、公开版本和 Global 的数据库内容

本机当前只保留一套正式开发数据库：

```text
backend/data/spatial-verse-cms.sqlite
```

`-wal` 与 `-shm` 是 SQLite 在进程运行时自动创建的配套文件，不是额外数据库，后端正常关闭后通常会合并或消失。团队同步不能只依赖 `git pull`：各页面负责人还必须提供范围受控、可重复执行的草稿导入任务和所需媒体，禁止用整个 SQLite 覆盖其他人的数据库。

## 8. 当前尚未完成

1. 数据集页面和 `dataset-item` Piece，包括真实下载选项；不得迁移访客图片上传逻辑。
2. 关于我们页面的正式迁移。
3. Solution、核心能力和学术研究的完整移动端与全部响应式断点验收。
4. 英文 `en` 页面内容与对应 locale 文档。
5. 四个页面域全部完成后的共享注册冲突复核、全路由回归和最终数据汇总。
6. 正式部署域名确定后配置 `PUBLIC_SITE_URL` 并复查 canonical、分享链接和 `hreflang`。

## 9. 下一步建议顺序

1. 审核当前 `dev` 中首页、Solution、核心能力与学术研究的集成结果。
2. 其他负责人从更新后的 `origin/dev` 同步公共基线，不复制已完成页面域的内容模型。
3. 各负责人完成自己页面域的模型、Astro 视觉、CMS 连接、草稿导入任务和域内迁移文档。
4. 每个域分别完成前后端 build、Preview/Edit 一致性、桌面和移动端验收。
5. 集成负责人只合并共享注册、依赖、路由和公共层变更，不重构其他负责人的域内模型。
6. 最后统一导入各域草稿，逐页审核后再决定哪些页面发布为公开版本。

## 10. 开发检查原则

- 匿名访问：检查公开版本，即外部访客将看到的 CMS 内容。
- Preview：检查当前草稿的只读视觉，不应出现编辑框。
- Edit：仍使用同一 Astro 页面和草稿内容，只额外显示 Apostrophe 编辑工具与原位编辑边界。
- Preview 与 Edit 的页面结构和业务样式必须一致；编辑态只允许增加 CMS UI，不允许切换到另一套 Template 或 mock 数据。
- 如果公开页面与 Preview 不同，先比较 CMS 的公开版本和草稿版本，不要引入前端 fallback。
- 如果 Preview 与 Edit 不同，优先检查 contextual DOM 替换后的脚本重新初始化、编辑器包装节点和 CSS 选择器。
