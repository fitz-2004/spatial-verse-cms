# SpatialVerse 并行迁移协作基线

本文是四人并行迁移的执行约定。目标是在保留原站视觉、动画和交互的前提下，将页面分别迁移到 ApostropheCMS + Astro，同时让每位负责人自行完成自己页面的内容模型、渲染组件和草稿数据，不提前建立一个覆盖全站的中心化内容模型。

## 1. 固定基线

- 原站仓库：`../spatial-verse-site`
- 原站分支：`dby_vibe`
- 本轮分析基准提交：`eb1246e63ee01b5f03a6ea93dc122e65ef337e7c`
- CMS 仓库：当前仓库 `spatial-verse-cms`
- 中文 `zh` 是默认 locale，URL 无语言前缀；英文 `en` 使用 `/en`。
- 业务 URL 全部使用小写。旧地址不依靠大小写区分。
- `/coohomcloud` 和 `/coohomcloud/solutions` 不创建容器页面。业务页面在 Apostrophe 页面树中直接作为 Home 的子页面，但 slug 保留完整路径。
- `/archive` 是 ApostropheCMS 系统归档页面，不修改、不删除，也不纳入业务迁移。
- 业务页面当前仅建立中文草稿；英文以后作为相同页面的 `en` locale 添加。

原站最新变化已经纳入本基线：

- 数据集详情中的“免费下载”现在使用每种格式对应的真实下载 URL。
- 首页新增 `homepage/app/deepseek-harness-bg.tsx` 互动背景。
- 原站数据集组件目前仍保留访客“＋ 导入图片”、`file input`、`URL.createObjectURL` 和 `importedImages`。这是已确认不应迁移的历史逻辑。迁移后预览图只能由 CMS 编辑人员管理。

如果原站 `dby_vibe` 后续继续更新，应先记录新提交，再由受影响页面的负责人定向同步；不要用原站整个目录覆盖 CMS 仓库。

## 2. 页面、URL 与 Page Type

Page Type 已在后端、页面选择器和 Astro Template 映射中建立。负责人应扩展自己已有的 Page Type，不能为每个 URL 再创建 Page Type。

| 页面 | 中文 URL | Page Type / 映射键 | Astro Template | 负责人 |
|---|---|---|---|---|
| 首页 | `/` | `@apostrophecms/home-page` | `HomePage.astro` | 沈远卓 |
| 智能体感知 | `/coohomcloud/solutions/aiagent` | `solution-page` | `SolutionPage.astro` | 楼博涵 |
| AIGC | `/coohomcloud/solutions/aigc` | `solution-page` | `SolutionPage.astro` | 楼博涵 |
| 机器人仿真 | `/coohomcloud/solutions/roboticsimulation` | `solution-page` | `SolutionPage.astro` | 楼博涵 |
| 产品可视化推广 | `/coohomcloud/solutions/visualizedproductpromotion` | `solution-page` | `SolutionPage.astro` | 楼博涵 |
| XR | `/coohomcloud/solutions/xr` | `solution-page` | `SolutionPage.astro` | 楼博涵 |
| 核心能力 | `/coohomcloud/corecompetency` | `core-competency-page` | `CoreCompetencyPage.astro` | 池一锴 |
| 学术研究 | `/coohomcloud/corecompetency/paper` | `research-archive-page` | `ResearchArchivePage.astro` | 池一锴 |
| 样例数据集 | `/coohomcloud/corecompetency/data` | `dataset-library-page` | `DatasetLibraryPage.astro` | 陈俊烨 |
| 关于我们 | `/coohomcloud/about` | `about-page` | `AboutPage.astro` | 陈俊烨 |

判断依据：五个 Solution 页面结构相同、只有内容不同，因此共用 `solution-page`。首页、核心能力、学术研究、数据集和关于我们具有明显不同的整体结构，分别保留独立 Page Type。局部差异通过字段、数组、Widget 或普通组件表达，不再增加 Page Type。

## 3. 四人任务分配

### 沈远卓：首页，并担任集成负责人

负责范围：

- `backend/modules/@apostrophecms/home-page/`
- `frontend/src/templates/HomePage.astro`
- 新建的 `frontend/src/components/home/`、`frontend/src/styles/home.css`
- 仅供首页使用且以 `home-` 开头的 Widget
- 首页中文草稿数据和其引用媒体

必须完成：

- 完整迁移首页各区块顺序、滚动效果、动画和响应式视觉。
- 迁移最新 `deepseek-harness-bg.tsx`。该效果属于普通前端交互组件/客户端岛，不属于 CMS Widget；CMS 只管理需要编辑的标题、文案、媒体及必要参数。
- 首页的区块内容模型由沈远卓根据编辑需求决定。只在本页使用的数据优先放在 Home Page 字段或 `home-*` Widget 中，不建立全站 Piece。
- 不复制 Header、Footer、语言切换和联系抽屉。

### 沈远卓 同时负责最终集成时的共享注册文件冲突，只合并注册和依赖，不替其他负责人决定内容模型：

- `backend/app.js`
- `backend/modules/@apostrophecms/page/index.js`
- `frontend/src/templates/index.js`
- `frontend/src/widgets/index.js`
- `frontend/package.json`、`frontend/package-lock.json`
- `frontend/astro.config.mjs`

### 楼博涵：五个 Solution 页面

负责范围：

- `backend/modules/solution-page/`
- `frontend/src/templates/SolutionPage.astro`
- 新建的 `frontend/src/components/solution/`、`frontend/src/styles/solution.css`
- 仅供解决方案使用且以 `solution-` 开头的 Widget
- 五个 Solution 中文草稿页面及其引用媒体

必须完成：

- 一个 Page Type 和一个 Template 渲染全部五个页面，禁止复制成五套模板。
- 页面文案、英文标题、Hero、挑战、优势、服务及 CTA 等由各页面文档提供。
- 重复卡片通常使用 `array` 或页面专属 Widget。当前内容没有跨页面独立管理需求，不建议建立 Solution Piece。
- 验证每个小写 URL 和五份不同内容都能正确渲染。



### 池一锴：核心能力与学术研究

负责范围：

- `backend/modules/core-competency-page/`
- `backend/modules/research-archive-page/`
- 新建的 `backend/modules/research-paper/`
- `frontend/src/templates/CoreCompetencyPage.astro`
- `frontend/src/templates/ResearchArchivePage.astro`
- 新建的 `frontend/src/components/core/`、`frontend/src/components/research/`
- 对应页面中文草稿数据、Research Paper Piece 草稿数据和引用媒体

必须完成：

- 核心能力页完整视觉、能力切换/滚动交互和响应式实现。
- `research-paper` 使用 Piece，这是已确认的模型决定。论文标题、摘要、作者、年份、外链/文件、封面等具体字段由池一锴根据原站数据与编辑场景确定。
- `research-archive-page` 负责列表页自身标题、简介、筛选/排序配置，并查询/关联 `research-paper`；不要把每篇论文硬编码成页面字段。
- 核心能力页和学术研究页可以共享 `core/` 下的普通组件，但不把这种局部共享提升为 Global。

### 陈俊烨：样例数据集与关于我们

负责范围：

- `backend/modules/dataset-library-page/`
- `backend/modules/about-page/`
- 新建的 `backend/modules/dataset-item/`
- `frontend/src/templates/DatasetLibraryPage.astro`
- `frontend/src/templates/AboutPage.astro`
- 新建的 `frontend/src/components/dataset/`、`frontend/src/components/about/`
- 对应页面中文草稿数据、Dataset Item Piece 草稿数据和引用媒体

必须完成：

- `dataset-item` 使用 Piece，这是已确认的模型决定。
- 每个 Dataset Item 至少支持分类、标题、摘要、详情、格式/标签、CMS 预览图或图库，以及可重复的下载选项。下载选项至少包含显示名称和真实 URL。
- 按最新原站实现保留格式单选和“免费下载”真实链接；外部下载资源不复制进媒体库。
- 不迁移访客上传图片按钮及相关浏览器临时预览逻辑。普通访客只能查看 CMS 编辑人员配置的图片。
- 迁移搜索、分类筛选、详情弹层、键盘关闭和响应式状态。
- 关于我们页由 `about-page` 自身字段管理。指标计数动画属于普通组件；当前没有跨页面复用需求，不建立 Piece。

## 4. 公共层：所有页面负责人只使用，不复制

以下文件属于公共基线。页面分支原则上不得直接修改：

- `frontend/src/pages/[...slug].astro`：唯一正式路由和 Apostrophe-Astro 接入。
- `frontend/src/components/SiteHeader.astro`：Header、下拉导航和移动菜单。
- `frontend/src/components/SiteFooter.astro`：主 Footer 和保留的第二 Footer。
- `frontend/src/components/ContactDrawer.astro`：当前仅展示、不提交的联系表单。
- `frontend/src/lib/siteChrome.js`：locale、链接和公共文案回退。
- `frontend/src/styles/site-chrome.css`：公共层样式。
- `backend/modules/@apostrophecms/global/index.js`：品牌、导航、联系方式、Footer 和社交链接。
- `backend/modules/@apostrophecms/i18n/`：`zh` 默认、`en` 使用 `/en`。

页面 Template 会自动被公共路由包裹，不得再次输出 Header、Footer 或 Contact Drawer。确实需要修改公共层时，单独提出一个小型公共 PR，说明受影响页面，由四人确认后再合入基线。

Global 只存真正的全站内容。页面 Hero、页面章节、论文、数据集等不能放进 Global。

## 5. 内容模型的去中心化边界

每位负责人可以独立决定自己范围内：

- Page Type 的具体 fields、数组和编辑分组。
- 哪些局部区块需要成为本页面域的 Widget。
- 普通 Astro Component 的拆分方式。
- 自己页面的动画实现和客户端状态组织。
- 自己负责的媒体字段、辅助字段、验证规则和编辑提示。

但必须遵守：

- Page Type 名、后端模块名与 Astro 映射键完全一致。
- 只有编辑人员需要自由插入、删除、重排的内容区块才做 Widget。固定结构只需 Page fields + Astro Component。
- 只有独立生命周期、跨页面查询/复用的实体才做 Piece。本轮已确定的 Piece 只有 `research-paper` 和 `dataset-item`。
- 动画、Canvas/WebGL、搜索、筛选、弹层、计数器等是普通组件或客户端岛，不是 Widget/Piece。
- Widget、Piece 和样式使用域前缀：`home-*`、`solution-*`、`core-*`、`research-*`、`dataset-*`、`about-*`。
- 禁止建立一个包含全站所有 section 的“大一统 Widget 库”或把其他负责人的字段提前加进其 Page Type。

## 6. React 客户端岛约定

原站的首页背景、核心能力体验、数据集筛选弹层和指标计数器是 React 客户端组件。为降低视觉和交互偏差，允许在 Astro 中保留为 React island：

- 首页首屏背景使用 `client:load`。
- 首屏以下且不影响初始布局的重交互组件优先使用 `client:visible`。
- CMS 数据必须由 Astro Template 作为 props 传入 island，客户端不能自行请求或保存 CMS 内容。
- 第一个需要 React 的分支提交一笔独立基础设施提交，添加 `@astrojs/react`、`react`、`react-dom` 及 Astro integration；沈远卓在集成时只保留一次依赖和配置变更。
- 如果负责人选择改写为无框架 TypeScript，也必须证明视觉、交互和清理逻辑等价，不能为了“纯 Astro”牺牲还原度。

## 7. Git 与文件冲突规则

所有人从同一个 CMS 公共基线提交创建分支，建议：

- `migration/home`
- `migration/solutions`
- `migration/core-research`
- `migration/dataset-about`

工作规则：

1. 每个分支只修改自己负责的 Page Type、Template、域组件、域样式、域 Widget/Piece 和数据交付文件。
2. 不从原站复制 `layout.tsx`、Header、Footer 或整份 `globals.css`。只迁移本域实际使用的规则，并放进本域样式文件。
3. 必须修改共享注册文件时，把注册修改做成独立 commit，方便沈远卓在集成时选择或手工合并。
4. 不修改正式路由 `frontend/src/pages/[...slug].astro`。
5. 不提交 `node_modules`、构建目录或本地 SQLite 数据库。
6. 每个分支至少每日 rebase/merge 最新公共基线；不要通过复制其他分支文件解决冲突。

## 8. CMS 数据与媒体交付

每位负责人维护自己的本地数据库，但不能把整个 SQLite 数据库提交或交给集成负责人覆盖：

- 仅建立自己负责页面的 `zh:draft` 数据，不发布业务页面。
- Piece 也先保持草稿。
- 使用稳定的原站标识，例如 Solution slug、Dataset `id`、Paper 唯一键，确保重复导入可以更新而不是重复创建。
- 每个分支交付一个仅包含本域的可重复导入脚本/任务或 Apostrophe 导出包，并附导入说明。
- 导出范围必须列出 Page、Piece 和媒体；不得包含 `/archive`、Global 或其他负责人页面。
- 只迁移当前页面实际引用的媒体，不导入全部抓取资源。
- Dataset 的外部 ZIP/RAR/BLEND/USD 等下载 URL 是内容数据，不作为图片媒体导入。

每个负责人在分支中新增 `docs/migration/<domain>.md`，至少记录：

- 原站基准 commit。
- 页面 URL、Page Type 和 Piece 类型。
- 字段清单与关键建模理由。
- 新增模块和注册项。
- 数据导入/导出方法及草稿数量。
- 已迁移媒体清单和来源。
- 桌面、移动端、中英文、交互和构建验证结果。
- 已知差异或待确认问题。

## 9. 每个分支的完成标准

一个页面域只有同时满足以下条件才可交付：

1. 视觉区块、顺序、动画、交互和响应式与对应原站页面一致。
2. 页面内容来自 ApostropheCMS，不在 Template 中长期硬编码业务文案或媒体 URL。
3. In-context editing 不报错；Page Type、Widget、Piece 和 Template 映射有效。
4. 中文页面和 Piece 仅为草稿；没有创建不明确的英文内容。
5. 所有内部 URL 使用已确认的小写路径，locale 链接遵循 `/` 与 `/en`。
6. Header/Footer 只出现公共层预期的结果，没有页面内重复实现。
7. 前端 `npm run build` 和后端 `npm run build` 通过。
8. 至少验收桌面与移动端；交互页面覆盖键盘关闭、空数据和无下载资源等状态。
9. 提供本域数据导出/导入说明和迁移记录。

## 10. 集成顺序

沈远卓按以下顺序合并，降低共享依赖和注册冲突：

1. 公共 React integration 提交（如果使用）。
2. Solution。
3. Core + Research Paper。
4. Dataset + About。
5. Home；最后核对首页到各业务页面的真实链接。
6. 汇总 `app.js`、Widget registry 和依赖锁文件，运行全站构建。
7. 按域依次导入草稿数据，检查无重复后再做完整页面树、locale 和视觉回归。

集成负责人只处理共享注册、依赖、路由连通性和冲突，不擅自改写各负责人已经说明的内容模型。模型冲突由对应页面负责人共同决定。
