# 首页 ApostropheCMS + Astro 迁移交付

## 状态与边界

- 负责人：沈远卓
- 原站基准：`spatial-verse-site` `dby_vibe@eb1246e63ee01b5f03a6ea93dc122e65ef337e7c`
- 中文 URL：`/`
- Page Type / Template：`@apostrophecms/home-page` / `HomePage.astro`
- 数据状态：只更新 `zh:draft`，导入任务不发布
- Piece：无
- 首页 Widget：6 个固定单例 `home-*` Widget

Header、Footer、联系抽屉、locale、导航和全站联系方式仍由公共层管理。首页没有复制这些组件，也没有为其他负责人的页面预建模型。

## 为什么固定页面也使用 Widget

首页的区块位置和顺序必须固定，但可见文字需要在页面上直接编辑。纯 Page fields 能管理数据，却只能从文档表单进入；因此首页采用受控的混合模型：

1. Page fields 管理 title、SEO 和六个固定 Area。
2. 每个 Area 在 Template 中位置固定，只允许一个对应 Widget，`max: 1`。
3. Widget 不能跨区块插入或重排；数组内容仍归所属 Widget 管理。
4. 可见文字使用受限 Rich Text Area，支持页面上的直接文字编辑。
5. 视频、链接和结构化数组从对应 Widget 的字段表单管理。
6. 动画、背景和切换状态留在 Astro、TypeScript 与 React island，不进入 CMS 内容模型。

这不是自由搭建页，也不是全站 Widget 库。它是 `AGENTS.md` 记录的“固定区块需要原位编辑”窄例外，命名和文件均限定在首页域内。

## 内容模型

### Page fields 与完整页面级 SEO

| 字段 | 用途 |
|---|---|
| `title` | Apostrophe 页面标题与 SEO 标题回退 |
| `seoTitle` | HTML `<title>`，建议不超过 60 字符 |
| `seoDescription` | meta description，建议不超过 160 字符 |
| `seoCanonicalUrl` | canonical 覆盖值；留空时由正式站点域名和当前路径生成 |
| `seoRobots` | index/noindex 与 follow/nofollow |
| `seoOgTitle` / `seoOgDescription` / `seoOgImage` | Open Graph 分享信息 |
| `seoTwitterCard` | Twitter Card 类型 |

公共 `SeoHead.astro` 在 Astro 服务端响应中输出：

- title、description、robots、canonical；
- Open Graph 与 Twitter Card；
- 已存在 locale 对应页面的 `hreflang` 和 `x-default`；
- WebSite/WebPage + Organization JSON-LD。

Astro/SSR 负责把这些内容真正生成到可抓取 HTML 中；Page fields 的作用是让编辑人员无需改代码即可管理元数据。生产环境必须设置 `PUBLIC_SITE_URL`，避免 canonical 和分享 URL 使用本地地址。社交图未配置时会安全省略图片标签。

### 固定 Area 与 Widget

| Page Area | Area/映射类型 | 后端模块目录 | 内容 |
|---|---|---|---|
| `homeBrandArea` | `home-brand` | `home-brand-widget` | 品牌开屏 |
| `homeHeroArea` | `home-hero` | `home-hero-widget` | Hero、CTA |
| `homeSolutionsArea` | `home-solutions` | `home-solutions-widget` | 解决方案引导、任务链、5 个方案及媒体 |
| `homeCapabilitiesArea` | `home-capabilities` | `home-capabilities-widget` | 核心能力引导、4 个能力及媒体 |
| `homeWhyArea` | `home-why` | `home-why-widget` | 学术与技术支持、4 个指标；指标数值支持 Rich Text 原位编辑 |
| `homeSupportArea` | `home-support` | `home-support-widget` | 3 种支持模式与 CTA |

注意 Apostrophe 的模块目录保留 `-widget` 后缀，但 Area item type 和 Astro registry key 必须去掉后缀。六个 canonical 映射是 `home-brand`、`home-hero`、`home-solutions`、`home-capabilities`、`home-why`、`home-support`。

## 前端渲染与编辑

`HomePage.astro` 按固定顺序渲染六个 `<AposArea>`。每个首页 Widget 只负责自己的 Astro 结构；`HomeRichTextWidget.astro` 保留 Apostrophe contextual 标记，使受限 Rich Text 可直接点击编辑。

首页标题字段要求保留原站语义标签：品牌标题使用 `h1`，章节与方案标题使用 `h2`，能力、支持模式和指标使用 `h3`。导入任务会把历史裸文本规范化为字段指定标签；前端渲染器也提供相同的只读兼容层，避免尚未发布的新草稿导致 Preview 丢失标签、class 和对应视觉样式。

`homeContextual.ts` 负责区块 reveal、方案/能力/支持模式切换和能力轮盘。它监听 Apostrophe 在 Draft/Preview 切换时替换的 DOM 并重新初始化，不保存 CMS 内容。首屏 `DeepSeekHarnessBackground.tsx` 仍是 React island。

首页不再保留 React/mock 页面回退。Published、Preview 和 Edit 始终使用同一个 `HomePage.astro`，并按固定顺序由六个服务端 `<AposArea>` 渲染。若数据库缺少必要 Area，应修复或重新导入 CMS 数据，禁止静默切换到另一套页面实现。

## 草稿数据导入

使用与本机原生依赖一致的 Node.js 22：

```bash
cd backend
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite \
node app @apostrophecms/home-page:seed-draft
```

任务会：

- 只查找并更新现有 `zh:draft` Home，不创建第二个首页；
- 创建或迁移六个固定单例 Area/Widget 和嵌套 Rich Text；
- 现有新模型内容优先，首次迁移可读取旧 Page fields；
- 保留已上传媒体，只在缺失时导入首页实际引用的 9 个视频；
- 初始化 SEO 默认值，但不覆盖已经填写的值；
- 安全清理确认为空的 Starter `main` / `objectField`；
- 不改 `zh:published`、`/archive`、Global、英文内容或其他页面；
- 可重复执行，不重复创建页面和媒体。

当前本地结果：1 个 `zh:draft` Home、6 个首页 Widget、5 个方案、4 个能力、9 个视频。SQLite 与上传目录被 Git 忽略，其他成员需在自己的数据库运行任务，不能交换整个数据库。

## 媒体

| CMS 用途 | 原站文件 |
|---|---|
| 智能体感知 | `sv-67dd966bd4fd.mp4` |
| AIGC | `sv-77cb71efb29a.mp4` |
| 机器人仿真 | `sv-9ab887ebe4c8.mp4` |
| 产品可视化推广 | `sv-fdd162096d1b.mp4` |
| XR | `sv-54b3d57b0eeb.mov` |
| 物理增强能力 | `sv-c81b92093be3.mp4` |
| 分割标注能力 | `sv-408e1d887d91.mp4` |
| 场景增强能力 | `sv-ca457b587268.mp4` |
| 多通道支持能力 | `sv-86d2e1bb66d2.mov` |

文件位于 `frontend/public/media/home/`，只迁移首页实际引用资源。

## 文件与合并边界

首页域新增：

- `backend/modules/@apostrophecms/home-page/lib/`
- `backend/modules/home-*-widget/`
- `frontend/src/widgets/home/`
- `frontend/src/components/home/`
- `frontend/src/lib/homeWidget.ts`、`homeContextual.ts`
- `frontend/src/styles/home.css`

共享文件只做隔离的小改动：

- `backend/app.js`：独立区块注册六个首页 Widget；
- `frontend/src/widgets/index.js`：独立区块注册六个 canonical 映射；
- `frontend/src/components/SeoHead.astro`：通用页面级 SEO 输出；
- `frontend/src/pages/[...slug].astro`：只调用通用 `SeoHead`，无首页专属分支；
- `frontend/.env.example`：记录 `PUBLIC_SITE_URL`；
- React integration 依赖与 `astro.config.mjs` 由首页集成负责人统一保留一份。

其他页面分支无需导入首页 Widget，也不应修改首页 Page Type。合并时共享注册项按域保留，不覆盖其他负责人的映射。

## 本地检查

1. 以相同 `APOS_EXTERNAL_FRONT_KEY` 启动 backend 和 frontend。
2. 访问 `http://localhost:4321/login` 登录。
3. 访问 `http://localhost:4321/?aposEdit=1` 检查 Draft。
4. 页面应显示 6 个首页区块编辑入口和各可见文案的 Rich Text 原位编辑入口。
5. Preview 下验证方案、能力和支持模式切换；不要为检查而执行 Update/Publish。

`Update/Publish` 会把当前草稿复制到公开版本；导入任务只写草稿数据库。建立或更新首页基线时，必须在审核草稿后完成发布，确保公开版本也具备相同的六个 Area；前端不会再以 mock 内容掩盖不完整的 CMS 数据。

## 验证与已知事项

- Frontend production build：通过。
- Backend production build：通过。
- 匿名 Astro SSR：HTTP 200，并输出页面级 SEO HTML。
- Draft contextual editing：6 个首页 Widget 编辑入口、25 个 Rich Text 编辑入口可见。
- Preview 交互：方案切换等状态正常。
- 草稿边界：导入任务未发布页面。
- 公共 Header/Footer：仍只由公共路由输出，首页 Template 不重复实现。

Starter 的 Blog Area 仍会提示不存在的 `two-column` Widget，这是既有无关警告，按 `AGENTS.md` 不在首页分支处理。英文 locale 暂不猜测；后续创建真实英文对应页面后，`hreflang` 才会输出英文链接。
