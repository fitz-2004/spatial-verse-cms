# SpatialVerse CMS Agent Instructions

本文件是参与 `spatial-verse-cms` 并行迁移的 Agent 和开发人员的执行入口。开始任何页面迁移前，必须完整阅读本文件和根目录的 [`MIGRATION_WORK_SPLIT.md`](./MIGRATION_WORK_SPLIT.md)。后者包含全部 URL、Page Type、负责人、文件边界和详细验收标准；本文件强调能够直接执行且不能违反的规则。

## 1. 项目和版本基线

- CMS 仓库：`https://github.com/fitz-2004/spatial-verse-cms.git`
- 协作基线分支：`dev`
- 本文件创建前的 CMS 基线提交：`e07c4fab2c045d8dbf2759f5fcc18a1dafb31ed9`
- 原站仓库：`https://github.com/bding5746-del/spatial-verse-site.git`
- 原站参考分支：`dby_vibe`
- 当前原站参考提交：`eb1246e63ee01b5f03a6ea93dc122e65ef337e7c`
- 原站项目实际位于 `spatial-verse-site/homepage/`；`homepage` 只是历史目录名，不代表只迁移首页。

所有迁移分支必须从 `origin/dev` 创建，不得从 `main`、旧提交或另一位开发者的功能分支开始：

```bash
git fetch origin
git switch -c <your-branch> origin/dev
```

建议分支：

- 沈远卓：`migration/home`
- 楼博涵：`migration/solutions`
- 池一锴：`migration/core-research`
- 陈俊烨：`migration/dataset-about`

功能分支通过 PR 合并到 `dev`。除集成负责人外，不直接推送或重写 `dev`。

## 2. 固定分工

| 负责人 | 页面范围 | Page Type / Piece |
|---|---|---|
| 沈远卓 | 首页 `/`，并负责最终集成 | `@apostrophecms/home-page` |
| 楼博涵 | 五个 Solution 页面 | `solution-page` |
| 池一锴 | 核心能力、学术研究 | `core-competency-page`、`research-archive-page`、`research-paper` Piece |
| 陈俊烨 | 样例数据集、关于我们 | `dataset-library-page`、`about-page`、`dataset-item` Piece |

不要按 URL 数量新增 Page Type。五个 Solution 页面必须共用一个 `solution-page` 和一个 `SolutionPage.astro`。完整 URL 映射见 `MIGRATION_WORK_SPLIT.md`。

每位负责人自行决定自己范围内的 Page fields、局部 Widget、Piece 具体字段、Astro Component 拆分和动画组织；不得提前设计其他负责人的内容模型。

## 3. 公共层禁止重复实现

页面 Template 只负责 `<main>` 内的页面内容。以下公共文件已经建立，页面分支原则上只使用、不修改：

- `frontend/src/pages/[...slug].astro`
- `frontend/src/components/SiteHeader.astro`
- `frontend/src/components/SiteFooter.astro`
- `frontend/src/components/ContactDrawer.astro`
- `frontend/src/lib/siteChrome.js`
- `frontend/src/styles/site-chrome.css`
- `backend/modules/@apostrophecms/global/index.js`
- `backend/modules/@apostrophecms/i18n/`

禁止在页面内再次实现 Header、Footer、第二 Footer、移动菜单、locale 切换或 Contact Drawer。确需改变公共行为时，单独提交一个小型公共 PR，并说明所有受影响页面。

沈远卓负责最终解决这些共享文件的注册或依赖冲突：

- `backend/app.js`
- `backend/modules/@apostrophecms/page/index.js`
- `frontend/src/templates/index.js`
- `frontend/src/widgets/index.js`
- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/astro.config.mjs`

其他负责人如果必须修改上述文件，应将共享修改放在独立 commit 中，方便集成时选择或手工合并。

## 4. 架构判断规则

- Page Type：页面整体结构和编辑模型。
- Widget：编辑人员确实需要自由插入、删除、重排的内容区块。
- Piece：具有独立生命周期并需要跨页面查询、筛选或复用的实体。本轮已确认的是 `research-paper` 与 `dataset-item`。
- Astro Component：固定布局、动画、Canvas/WebGL、搜索、筛选、弹层、计数器及其他表现/交互逻辑。
- Global：只放品牌、导航、联系方式、Footer、社交链接等真正全站内容。

固定页面结构优先使用 Page fields + Astro Component。不要为了组件化而把所有 section 都做成 Widget，也不要建立覆盖全站的“大一统”内容模型。

需要让固定区块中的可见文字支持 Apostrophe 原位编辑时，允许负责人采用“固定单例 Area + 域内 Widget”这一窄例外，但必须同时满足：Area 位于 Template 的固定位置；只允许一个指定 Widget 类型；`max: 1`；不允许跨区块插入、删除或重排；SEO、slug 等页面技术字段继续放在 Page fields；动画与状态逻辑继续由 Astro Component、TypeScript 或 React island 负责。该例外必须写入本域 `docs/migration/<domain>.md`，不得据此建立跨负责人共享的大型 Widget 模型。

Page Type 名、后端模块名和 Astro Template 映射键必须完全一致。域内新增命名使用前缀：`home-*`、`solution-*`、`core-*`、`research-*`、`dataset-*`、`about-*`。

## 5. Locale、URL 和页面树

- 中文 `zh` 是默认 locale，URL 使用 `/`。
- 英文 `en` 使用 `/en`。
- 业务 URL 全部小写。
- `/coohomcloud` 和 `/coohomcloud/solutions` 不创建容器页。
- 业务页面在 Apostrophe 页面树中直接作为 Home 子页面，但保留完整 slug。
- `/archive` 是 ApostropheCMS 系统归档页，不修改、不删除、不导出、不纳入迁移。
- 当前只建立中文 `zh:draft` 页面和 Piece，不发布；英文以后作为相同文档的 `en` locale 添加。

不得猜测不明确的 URL、父子关系或英文内容。

## 6. 本地启动

要求 Node.js 22 或更高版本。首次安装：

```bash
npm install
```

建议每位开发者使用自己的本地 SQLite。后端在一个终端运行：

```bash
cd backend
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite npm run dev
```

前端在另一个终端运行：

```bash
cd frontend
npm run dev
```

默认地址：

- ApostropheCMS backend：`http://localhost:3000`
- Astro frontend：`http://localhost:4321`

创建本地管理员：

```bash
cd backend
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app @apostrophecms/user:add admin admin
```

后端和前端的 `APOS_EXTERNAL_FRONT_KEY` 必须一致；当前开发脚本都使用 `dev`。

## 7. Git 不包含 CMS 数据

以下内容被 Git 忽略，不会随 `dev` 分支下载：

- `backend/data/` 中的 SQLite 数据库
- Apostrophe 用户
- 中文 Global 初始值
- 已建立的草稿页面和 Piece
- `backend/public/uploads/` 中的上传媒体

因此 clone 后出现空数据库是正常情况，不要误判为代码缺失。每位负责人只在自己的数据库中创建负责页面和 Piece 的中文草稿。

禁止提交或用整个 SQLite 数据库覆盖集成环境。每个页面域最终必须提供一个范围受控、可重复执行的导入任务/脚本或 Apostrophe 导出包：

- 使用稳定的原站标识，重复导入应更新而不是重复创建。
- 只包含本域 Page、Piece 和实际引用媒体。
- 不包含 Global、`/archive` 或其他负责人的文档。
- 业务页面和 Piece 导入后仍为草稿。

只迁移当前页面实际引用的媒体，不导入全部抓取资源。

## 8. React 客户端岛

当前 Astro frontend 尚未安装 React integration。原站以下实现是 React 组件：

- 首页 `deepseek-harness-bg.tsx`
- 核心能力交互体验
- 数据集搜索、筛选和详情弹层
- About 指标计数器

为了降低视觉和交互偏差，允许保留为 React island：

- 首页首屏背景使用 `client:load`。
- 首屏以下的重交互组件优先使用 `client:visible`。
- CMS 数据由 Astro Template 作为 props 传入 island；客户端不得自行保存 CMS 内容。
- 第一个需要 React 的分支应以独立基础设施 commit 添加 `@astrojs/react`、`react`、`react-dom` 和 Astro integration。
- 集成时只保留一份依赖与配置修改。

允许改写为无框架 TypeScript，但必须证明视觉、交互、事件解绑和资源清理与原站等价。

## 9. 数据集迁移的强制例外

原站 `dby_vibe` 的最新数据集代码已经正确实现真实下载，但仍包含已经决定废弃的访客图片导入逻辑。

陈俊烨及任何处理 Dataset 的 Agent 必须：

- 将最新下载选项迁移到 `dataset-item` Piece；每项至少包含显示名称和真实 URL。
- 保留格式单选、“免费下载”、无下载资源状态和外部链接行为。
- 由 CMS 编辑人员上传和管理预览图/图库。
- 不迁移“＋ 导入图片”按钮。
- 不迁移 `file input`、`importedImages`、`URL.createObjectURL`、临时预览状态及相关提示文案。
- 不把外部 ZIP、RAR、BLEND、USD 等下载资源导入图片媒体库。

## 10. 原站迁移约束

- 原站是视觉和行为参考，不是可以整目录复制的代码模块。
- 不复制原站的 `layout.tsx`、Header、Footer 或整份 `globals.css`。
- 只提取本域实际使用的样式，写入本域样式文件。
- 首页负责人必须纳入最新 `homepage/app/deepseek-harness-bg.tsx`。
- Dataset 负责人必须以 `eb1246e` 中的下载数据为准。
- 后续原站更新必须先记录新 commit，再由受影响负责人定向同步。

## 11. 构建和验收

每个页面域提交前必须通过：

```bash
cd frontend
npm run build
```

```bash
cd backend
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite npm run build
```

还必须验证：

- 桌面端和移动端视觉。
- 页面区块顺序、动画和响应式行为。
- 交互页面的键盘操作、弹层关闭、空数据和无下载状态。
- In-context editing 无映射错误。
- URL 全部小写，locale 遵循 `/` 与 `/en`。
- 页面没有重复 Header/Footer。
- 页面内容来自 CMS，不长期硬编码业务文案或媒体 URL。
- 页面级 SEO 字段由 Page Type 管理，并由公共 Astro 路由服务端输出可抓取的 `<title>`、description、canonical、robots、Open Graph、Twitter Card、语言替代链接和 JSON-LD；Widget 只管理页面可见内容。
- 页面与 Piece 仍是草稿。

当前后端可能提示 Blog Area 引用了不存在的 `two-column` Widget。这是 Starter 遗留警告，与本轮页面迁移无关；不要在页面功能分支中顺手修复。

## 12. 每个分支的交付文件

每个负责人必须新增 `docs/migration/<domain>.md`，至少记录：

- 原站参考 commit。
- 页面 URL、Page Type 和 Piece 类型。
- 字段清单与关键建模理由。
- 新增模块、依赖和注册项。
- 数据导入/导出方法及草稿数量。
- 实际迁移媒体清单与来源。
- 桌面、移动端、中英文和交互验证结果。
- 前后端构建结果。
- 已知差异与待确认问题。

代码、CMS 草稿数据交付方式、媒体清单和验证报告缺一不可。集成负责人只解决共享注册、依赖、路由连通性和 Git 冲突，不擅自重构其他负责人的内容模型。
