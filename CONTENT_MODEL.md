# SpatialVerse CMS 内容模型速查

> 当前范围：已完成的 Home、Solution、核心能力与学术研究页面域
>
> 面向：后续 CMS、Astro、视觉与交互开发人员
>
> 详细迁移记录：[`docs/migration/home.md`](./docs/migration/home.md)、[`docs/migration/solutions.md`](./docs/migration/solutions.md)、[`docs/migration/core-research.md`](./docs/migration/core-research.md)

## 1. 一眼看懂

| Page Type | 数量与用途 | 后端模型 | Astro Template | 内容组织 |
|---|---|---|---|---|
| `@apostrophecms/home-page` | 每个 locale 唯一根首页 `/`；只编辑已有首页，不新建 | `backend/modules/@apostrophecms/home-page/index.js` | `frontend/src/templates/HomePage.astro` | Page SEO fields + 6 个固定单例 Area/Widget |
| `solution-page` | 可重复创建；当前 5 个 Solution URL 共用 | `backend/modules/solution-page/index.js` | `frontend/src/templates/SolutionPage.astro` | 固定 Page fields、数组与 Rich Text Area；没有自定义 Solution Widget |
| `core-competency-page` | 核心能力页 `/coohomcloud/corecompetency` | `backend/modules/core-competency-page/index.js` | `frontend/src/templates/CoreCompetencyPage.astro` | Page fields、固定数组、Rich Text/媒体 Area |
| `research-archive-page` | 学术研究归档页 `/coohomcloud/corecompetency/paper` | `backend/modules/research-archive-page/index.js` | `frontend/src/templates/ResearchArchivePage.astro` | Page fields、Rich Text Area、`research-paper` relationship |
| `research-paper` | 可独立管理和关联的论文 Piece | `backend/modules/research-paper/index.js` | 由 `ResearchArchivePage.astro` 列表渲染 | Piece fields；不是 Page Type |

统一渲染链路：

```text
CMS Page 数据 → Astro Page Template → Astro Component / AposArea → HTML
```

- `Page field`：字段直接属于页面文档。
- `Area`：页面文档或 Widget 中可以容纳 Widget 的字段。
- `Widget`：Area 中的内容实例；Widget 类型由后端模块定义，并在 Astro Widget registry 中映射。
- `Piece`：可跨页面管理和查询的独立实体；当前 `research-paper` 用于学术研究论文。
- `Astro Component`：固定结构、视觉与前端交互，不是 CMS 内容类型。

## 2. 公共注册位置

| 作用 | 文件 | 必须一致的键 |
|---|---|---|
| 启用后端模块 | `backend/app.js` | 后端模块目录名 |
| 新建页面 Type 列表 | `backend/modules/@apostrophecms/page/index.js` | Page Type 名 |
| Page Type → Astro Template | `frontend/src/templates/index.js` | `@apostrophecms/home-page`、`solution-page` |
| Widget 类型 → Astro Widget | `frontend/src/widgets/index.js` | Area item type，例如 `home-hero` |
| 页面公共外壳 | `frontend/src/pages/[...slug].astro` | Header、SEO、Template、Footer、编辑上下文 |
| 公共 SEO 输出 | `frontend/src/components/SeoHead.astro` | 读取各 Page Type 的同名 SEO fields |

注意：后端自定义 Widget 模块目录必须以 `-widget` 结尾，但 Area item type 和前端 registry key 不带该后缀。例如：

```text
backend module: home-hero-widget
Area item type: home-hero
Astro registry: home-hero
```

## 3. Home Page 内容模型

### 3.1 页面规则

- Page Type：`@apostrophecms/home-page`
- URL：`/`
- 每个 locale 只有一个根首页，由 Apostrophe 以 `parkedId: home` 建立。
- 不要通过紫色 `+` 创建第二个 Home；访问 `/` 后点击 Edit 编辑已有首页。
- 页面区块位置和顺序固定，不允许编辑人员自由插入、删除或重排区块。
- 首页没有整页 React/mock 回退；Preview、Edit 和公开页面均使用 `HomePage.astro`。

### 3.2 Home Page fields

定义文件：`backend/modules/@apostrophecms/home-page/index.js`

| 字段 | 类型 | 用途 / 前端去向 |
|---|---|---|
| `title` | Apostrophe 内置 string | 页面标题；SEO 标题回退 |
| `slug` | Apostrophe 内置 string | 固定根路径 `/` |
| `seoTitle` | string | `<title>` |
| `seoDescription` | textarea string | meta description |
| `seoCanonicalUrl` | string | canonical 覆盖值 |
| `seoRobots` | select | robots 策略 |
| `seoOgTitle` | string | Open Graph 标题 |
| `seoOgDescription` | textarea string | Open Graph 描述 |
| `seoOgImage` | image attachment | 社交分享图片 |
| `seoTwitterCard` | select | Twitter Card 类型 |
| `homeBrandArea` | area，max 1 | 只允许 `home-brand` |
| `homeHeroArea` | area，max 1 | 只允许 `home-hero` |
| `homeSolutionsArea` | area，max 1 | 只允许 `home-solutions` |
| `homeCapabilitiesArea` | area，max 1 | 只允许 `home-capabilities` |
| `homeWhyArea` | area，max 1 | 只允许 `home-why` |
| `homeSupportArea` | area，max 1 | 只允许 `home-support` |

`HomePage.astro` 只按上述顺序输出六个 `<AposArea>`。首页样式集中在 `frontend/src/styles/home.css`，交互初始化在 `frontend/src/lib/homeContextual.ts`。

### 3.3 Home Widget 总表

| Area | Widget 类型 / registry key | 后端字段文件 | Astro 渲染文件 |
|---|---|---|---|
| `homeBrandArea` | `home-brand` | `backend/modules/home-brand-widget/index.js` | `frontend/src/widgets/home/HomeBrandWidget.astro` |
| `homeHeroArea` | `home-hero` | `backend/modules/home-hero-widget/index.js` | `frontend/src/widgets/home/HomeHeroWidget.astro` |
| `homeSolutionsArea` | `home-solutions` | `backend/modules/home-solutions-widget/index.js` | `frontend/src/widgets/home/HomeSolutionsWidget.astro` |
| `homeCapabilitiesArea` | `home-capabilities` | `backend/modules/home-capabilities-widget/index.js` | `frontend/src/widgets/home/HomeCapabilitiesWidget.astro` |
| `homeWhyArea` | `home-why` | `backend/modules/home-why-widget/index.js` | `frontend/src/widgets/home/HomeWhyWidget.astro` |
| `homeSupportArea` | `home-support` | `backend/modules/home-support-widget/index.js` | `frontend/src/widgets/home/HomeSupportWidget.astro` |

公共首页字段 helper：`backend/modules/@apostrophecms/home-page/lib/homeWidgetFields.js`

- `inlineTextField`：单个 `@apostrophecms/rich-text`，支持原位编辑。
- `stringField`：结构化短文本，在 Widget 表单中编辑。
- `videoField`：视频 attachment，在 Widget 表单中上传。
- 首页 Rich Text Astro 渲染器：`frontend/src/widgets/home/HomeRichTextWidget.astro`。

### 3.4 每个 Home Widget 的字段

#### `home-brand`

| 字段 | 类型 | 页面内容 |
|---|---|---|
| `kicker` | inline rich text | 眉题 |
| `heading` | inline rich text，`h1` | 品牌主标题 |
| `descriptor` | inline rich text | 品牌描述 |

背景动画：`frontend/src/components/home/DeepSeekHarnessBackground.tsx`。它是 React island，只负责动画，不保存 CMS 内容。

#### `home-hero`

| 字段 | 类型 | 页面内容 |
|---|---|---|
| `eyebrow` | inline rich text | Hero 眉题 |
| `heading` | inline rich text，`h2` | Hero 主标题 |
| `description` | inline rich text | Hero 描述 |
| `primaryCtaLabel` | string | 主按钮文字 |
| `primaryCtaTarget` | string | 页内目标 ID，不含 `#` |
| `secondaryCtaLabel` | string | 次按钮文字 |
| `secondaryCtaHref` | string | 次按钮链接 |

#### `home-solutions`

| 字段 | 类型 | 页面内容 |
|---|---|---|
| `introEyebrow` | inline rich text | 区块索引 |
| `introHeading` | inline rich text，`h2` | 区块标题 |
| `introDescription` | inline rich text | 区块描述 |
| `missionTitle` | string | 任务链底部标题 |
| `coreTop` / `coreBottom` | string | 中心核心两行文字 |
| `solutions` | array，固定 5 项 | 五个解决方案内容与媒体 |

`solutions[]`：

| 字段 | 类型 | 用途 |
|---|---|---|
| `key` | string | 稳定标识；建立后不要修改 |
| `slug` | string | 对应 Solution URL slug |
| `heading` | inline rich text，`h2` | 标题 |
| `description` | inline rich text | 详细描述 |
| `stageLabel` | string | 英文阶段名 |
| `stageSignal` | string | 活跃信号文字 |
| `stageStatus` | string | 在线状态 |
| `stageInsight` | inline rich text | 核心洞察 |
| `media` | video attachment | 右侧展示视频 |

#### `home-capabilities`

| 字段 | 类型 | 页面内容 |
|---|---|---|
| `introEyebrow` | inline rich text | 区块索引 |
| `introHeading` | inline rich text，`h2` | 区块标题 |
| `introDescription` | inline rich text | 区块描述 |
| `capabilities` | array，固定 4 项 | 四个核心能力内容与媒体 |

`capabilities[]`：

| 字段 | 类型 | 用途 |
|---|---|---|
| `key` | string | 稳定标识；建立后不要修改 |
| `number` | string | 显示序号 |
| `label` | string | 英文标签 |
| `heading` | inline rich text，`h3` | 能力标题 |
| `description` | inline rich text | 能力描述 |
| `media` | video attachment | 能力展示视频 |

#### `home-why`

| 字段 | 类型 | 页面内容 |
|---|---|---|
| `eyebrow` | inline rich text | 区块索引 |
| `heading` | inline rich text，`h2` | 标题 |
| `description` | inline rich text | 描述 |
| `linkLabel` / `linkHref` | string | CTA 文字与链接 |
| `metrics` | array，固定 4 项 | 平台指标 |

`metrics[]`：`value` 为可原位编辑的 `h3` rich text；`label` 为说明 string。

#### `home-support`

| 字段 | 类型 | 页面内容 |
|---|---|---|
| `eyebrow` | inline rich text | 区块索引 |
| `heading` | inline rich text，`h2` | 标题 |
| `description` | inline rich text | 描述 |
| `platformLabel` | string | 支持卡片品牌名 |
| `linkLabel` / `linkHref` | string | 卡片链接文字与地址 |
| `modes` | array，固定 3 项 | 三种支持模式 |

`modes[].heading` 为可原位编辑的 `h3` rich text。

### 3.5 Home 数据初始化

| 作用 | 文件 / 命令 |
|---|---|
| 默认内容 | `backend/modules/@apostrophecms/home-page/lib/homeSeed.js` |
| 旧字段 → 六个 Area | `backend/modules/@apostrophecms/home-page/lib/homeAreaMigration.js` |
| 幂等写入首页草稿 | `node app @apostrophecms/home-page:seed-draft` |

任务只更新已有 `zh:draft` 根首页，不创建第二个 Home，不自动发布。

## 4. Solution Page 内容模型

### 4.1 页面规则

- Page Type：`solution-page`
- 可创建多个页面；当前五个页面共用同一个模型和 Template。
- 后端所有字段集中在 `backend/modules/solution-page/index.js`。
- Astro 总模板为 `frontend/src/templates/SolutionPage.astro`。
- 样式为 `frontend/src/styles/solution.css`。
- 没有 `solution-*-widget` 自定义 Widget。
- 标题类可见文字使用 Page field 中的 Rich Text Area，Area 内只允许一个核心 `@apostrophecms/rich-text` Widget。

### 4.2 Solution Page fields 与前端对应

| CMS 分组 | Page fields | 类型 | Astro 渲染文件 / 位置 |
|---|---|---|---|
| 内置 | `title`、`slug`、visibility、导航状态 | Apostrophe 内置 | 所有组件、页面树和 URL |
| Hero | `englishTitle` | string | `SolutionHero.astro` |
| Hero | `sequence` | integer，1–5 | `SolutionHero.astro` 视觉编号 |
| Hero | `accent` | hex string | `SolutionPage.astro` 的 `--detail-accent` |
| Hero | `heroTitle`、`heroLead` | rich text area，max 1 | `SolutionHero.astro` |
| Media | `media` | attachment | `SolutionVideoSection.astro` 第二屏右侧媒体框 |
| Media | `videoDescription` | rich text area，max 1 | `SolutionVideoSection.astro` 第二屏左侧描述 |
| Challenges | `challengeTitle` | rich text area，max 1 | `SolutionChallenges.astro` |
| Challenges | `challenges[]` | array：`title`、`text` | `SolutionChallenges.astro` |
| Advantages | `advantageTitle` | rich text area，max 1 | `SolutionAdvantages.astro` |
| Advantages | `advantages[]` | array：`title`、`text` | `SolutionAdvantages.astro` |
| Services | `serviceTitle` | rich text area，max 1 | `SolutionServices.astro` |
| Services | `services[]` | array：`title`、`text` | `SolutionServices.astro` |
| CTA | `ctaTitle` | rich text area，max 1 | `SolutionCTA.astro` |
| SEO | `seoTitle`、`seoDescription`、`seoCanonicalUrl`、`seoRobots`、`seoOgTitle`、`seoOgDescription`、`seoOgImage`、`seoTwitterCard` | string/select/attachment | 公共 `SeoHead.astro` |

说明：后台当前将 `media` 标成 `Hero Media (video or image)`，但它实际不显示在第一屏 Hero，而显示在第二屏 `SolutionVideoSection.astro`。当前后端字段配置为 `fileGroup: 'videos'`，正常 CMS 上传流程实际只允许视频；组件虽然包含图片渲染分支，但当前字段不能正常选择图片。因此“or image”是现有标签与模型不一致的问题，后续应选择“改成仅视频”或“调整字段以真正支持图片”。空值会显示 CMS 媒体占位框。

### 4.3 Solution Astro 组件顺序

`SolutionPage.astro` 固定按以下顺序渲染：

1. `frontend/src/components/solution/SolutionHero.astro`
2. `frontend/src/components/solution/SolutionVideoSection.astro`
3. `frontend/src/components/solution/SolutionChallenges.astro`
4. `frontend/src/components/solution/SolutionAdvantages.astro`
5. `frontend/src/components/solution/SolutionServices.astro`
6. `frontend/src/components/solution/SolutionCTA.astro`

Rich Text Area 的统一渲染 helper：`frontend/src/components/solution/SolutionRichText.astro`。

### 4.4 当前 Solution URL

| 页面 | URL |
|---|---|
| 智能体感知 | `/coohomcloud/solutions/aiagent` |
| AIGC | `/coohomcloud/solutions/aigc` |
| 机器人仿真 | `/coohomcloud/solutions/roboticsimulation` |
| 产品可视化推广 | `/coohomcloud/solutions/visualizedproductpromotion` |
| XR | `/coohomcloud/solutions/xr` |

范围化草稿导入任务：`node app solution-page:import-drafts`。它只处理上述五个 `zh:draft` 页面，不自动发布。

## 5. 核心能力与学术研究内容模型

### 5.1 核心能力页

- Page Type：`core-competency-page`
- 模型：`backend/modules/core-competency-page/index.js`
- Template：`frontend/src/templates/CoreCompetencyPage.astro`
- 样式：`frontend/src/styles/core.css`
- 交互 island：`frontend/src/components/core/CoreCapabilityNavigation.tsx`

| 字段 | 类型 | 前端用途 |
|---|---|---|
| `intro` | object | 眉题、标题、说明和数据标签 |
| `capabilities[]` | array | 四项固定能力；编号、标题、说明和媒体 |
| `capabilities[].media` | area | CMS 图片/视频；为空时显示 `public/media/core-panels/` 回退媒体 |
| `outro` | object | 收尾标题及内部页面 relationship |
| `seo*` | string/select/image | 完整公共 SEO 输出 |

可见文本主要使用受控 Rich Text Area，支持 Edit 原位编辑。React 只接收 Astro 从 CMS 数据中提取的文本并处理交互，不创建第二套页面内容。

### 5.2 学术研究页

- Page Type：`research-archive-page`
- 模型：`backend/modules/research-archive-page/index.js`
- Template：`frontend/src/templates/ResearchArchivePage.astro`
- 样式：`frontend/src/styles/research.css`

| 字段 | 类型 | 前端用途 |
|---|---|---|
| `intro` | object | 页面眉题、标题、说明和信号标签 |
| `sectionHead` | object | 论文列表区编号与标题 |
| `_papers` | relationship | 关联并输出 `research-paper` Pieces |
| `outro` | object | 收尾标题及内部页面链接 |
| `seo*` | string/select/image | 完整公共 SEO 输出 |

### 5.3 论文 Piece

- Piece Type：`research-paper`
- 模型：`backend/modules/research-paper/index.js`
- 管理入口：Apostrophe 顶部“论文”

| 字段 | 类型 | 用途 |
|---|---|---|
| `title` / `slug` | string | 论文名称与稳定标识 |
| `year` | string | 发表年份 |
| `venue` | string | 期刊或会议 |
| `abstract` | textarea string | 摘要 |
| `externalUrl` | URL string | 外部论文链接 |
| `cover` | area | 封面媒体 |

范围化草稿导入任务：`core-research-import:import-drafts`。实现位于 `backend/modules/core-research-import/index.js`，只导入 2 个页面与 5 个论文中文草稿，不发布、不清库、不修改其他页面域。

## 6. 编辑方式速查

| 字段类型 | 编辑位置 | 适用内容 |
|---|---|---|
| Rich Text Area | 页面 Edit 原位编辑；也可在文档表单编辑 | 页面可见标题、描述、指标数值 |
| string / integer / select | Page 或 Widget 字段表单 | 稳定标识、链接、颜色、序号、状态 |
| attachment | Page 或 Widget 字段表单 / 媒体库 | 视频、图片、社交分享图 |
| array | Page 或 Widget 字段表单 | 固定数量或重复卡片数据 |

Preview 与 Edit 使用同一个 Astro Template；Edit 只额外显示 CMS 编辑 UI。匿名访客读取 `published`，登录后的 Preview/Edit 读取 `draft`。`visibility: public` 不等于已经发布。

## 7. 后续开发必须遵守

1. Page Type 名、后端模块名和 `frontend/src/templates/index.js` 映射键必须完全一致。
2. Widget 后端模块使用 `*-widget`，Area item type 与 Astro registry key 去掉 `-widget`。
3. 新页面域只定义自己的 fields、Widget 和组件，不修改首页或 Solution 内容模型。
4. 固定视觉结构优先使用 Page fields + Astro Component；只有确实需要原位编辑的固定区块才使用受控 Area/Widget。
5. SEO 字段放在 Page Type，不放进 Widget；公共 `SeoHead.astro` 输出最终 HTML。
6. React 只处理动画和复杂交互，CMS 数据必须由 Astro 作为 props 传入；不得建立第二套整页 mock 渲染。
7. CMS 数据库不随 Git 同步；每个页面域必须提供范围化、幂等、只写本域草稿的导入任务。
8. 发布前分别检查匿名公开版、Preview 草稿版和 Edit 草稿版，三者必须使用相同 Astro 结构与业务 CSS。
