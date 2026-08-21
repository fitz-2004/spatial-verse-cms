# SpatialVerse CMS — 群核空间智能平台

基于 **ApostropheCMS + Astro** 的空间智能数据平台官网管理系统。

本仓库是 **SpatialVerse**（群核空间智能平台）官网的前后端一体化项目：ApostropheCMS 作为后端内容管理平台，Astro 作为前端渲染框架。两者通过 `@apostrophecms/apostrophe-astro` 桥接包连接，兼顾 Astro 的高性能与现代开发体验，以及 ApostropheCMS 的可视化、原地编辑能力。

---

## ✨ 功能特性

- **可视化内容管理**：在网站前台直接点击内容进行原地编辑（In-Context Editing），无需跳转管理后台
- **高性能前端**：Astro 服务端渲染（SSR）+ 按需 Hydration，提供优异的 Web Vitals 表现
- **多语言支持**：中文 `zh` 为默认语言（URL 无前缀），英文 `en` 使用 `/en` 前缀
- **内容模型完善**：Page Type + Piece + Widget 三层内容架构，覆盖页面、论文、数据集等实体
- **数据导入任务**：内置可重复执行的中文草稿数据导入脚本，稳定 slug 支持重复更新
- **React 客户端岛**：核心能力交互、数据集筛选等复杂交互保留为 React Island（`client:visible`）

---

## 📋 环境要求

| 依赖 | 版本 |
|---|---|
| Node.js | `>= 22` |
| MongoDB | `>= 6.0`（本地开发也可使用 SQLite） |

> **Windows 用户**：建议为后端启用 [WSL2](https://docs.apostrophecms.org/cookbook/windows-development.html)。

---

## 🚀 快速开始

### 1. 安装依赖

在仓库根目录执行，`postinstall` 脚本会自动安装 `frontend` 和 `backend` 两个子项目的依赖：

```bash
npm install
```

### 2. 配置环境变量（推荐）

项目支持 `.env` 文件配置环境变量（后端已内置 `dotenv`），配置一次即可在 Windows / macOS / Linux 任意平台使用，无需在每条命令前添加环境变量前缀。

**后端**：复制 `backend/.env.example` 为 `backend/.env`，添加数据库连接：

```bash
# backend/.env
APOS_EXTERNAL_FRONT_KEY=dev
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite
```

**前端**：复制 `frontend/.env.example` 为 `frontend/.env`：

```bash
# frontend/.env
APOS_EXTERNAL_FRONT_KEY=dev
```

> 两个项目的 `APOS_EXTERNAL_FRONT_KEY` 必须一致。开发脚本已内置 `dev`，如使用 `.env` 请保持相同值。

### 3. 启动后端（ApostropheCMS）

打开第一个终端：

```bash
cd backend
npm run dev
```

后端默认地址：**http://localhost:3000**

> **说明**：`backend/data/` 中的 SQLite 数据库已被 Git 忽略。首次启动会自动创建空数据库，正常现象，不必担心「代码缺失」。

### 4. 启动前端（Astro）

打开第二个终端：

```bash
cd frontend
npm run dev
```

前端默认地址：**http://localhost:4321**

### 5. 创建管理员账号

在 `backend` 目录执行（配置 `.env` 后无需添加环境变量前缀）：

```bash
node app @apostrophecms/user:add admin admin
```

> `admin` 为用户名，`admin` 为密码，可自定义（命令格式：`用户名 角色`，角色通常为 `admin`）。

### 6. 导入中文草稿数据

在 `backend` 目录依次执行以下命令，导入初始页面与内容草稿：

```bash
# 导入 5 篇论文草稿
node app research-paper:import

# 导入「核心能力」页面草稿
node app core-competency-page:import

# 导入「学术研究」页面草稿（自动关联论文）
node app research-archive-page:import
```

> 所有导入任务使用稳定 slug，重复执行只会更新、不会重复创建。

### 7. 登录管理后台

浏览器访问 **http://localhost:4321/login**，使用刚才创建的管理员账号登录。登录后即可在网站前台享受原地编辑体验。

---

## 📐 架构概览

```
┌─────────────────────┐          REST / 认证          ┌─────────────────────┐
│   ApostropheCMS     │  ◄─────────────────────────►  │       Astro         │
│   （后端 · 端口 3000）│                              │ （前端 · 端口 4321）  │
│                     │                              │                     │
│  · 内容模型 / Schema │                              │  · 页面渲染          │
│  · Page Type / Piece│                              │  · 模板映射          │
│  · Widget           │                              │  · Widget 渲染       │
│  · 管理后台 / 原地编辑│                              │  · 客户端交互（React）│
└─────────────────────┘                              └─────────────────────┘
```

**职责分工：**

- **后端（ApostropheCMS）** 拥有所有内容模型：页面类型（Page Type）、内容片段（Piece）、组件（Widget）以及管理编辑界面。前端不定义数据结构。
- **前端（Astro）** 负责所有渲染：从后端通过 REST 获取内容对象，并映射到 Astro 组件。前端不存储、不校验内容。
- **桥接包 `@apostrophecms/apostrophe-astro`** 连接两者，提供 `aposPageFetch`、`AposArea` 以及原地编辑覆盖层。

---

## 🗂️ 项目结构

```
├── backend/                    # ApostropheCMS 后端
│   ├── app.js                  # 后端入口与模块注册
│   ├── modules/
│   │   ├── @apostrophecms/     # 核心系统模块配置
│   │   │   ├── home-page/      # 首页 Page Type
│   │   │   ├── page/           # 页面类型注册表
│   │   │   ├── global/         # 全站内容（品牌/导航/联系方式/Footer）
│   │   │   └── i18n/           # 多语言配置（zh 默认 / en 使用 /en）
│   │   ├── default-page/       # 通用内容页
│   │   ├── solution-page/      # 解决方案页（5 个页面共用）
│   │   ├── core-competency-page/  # 核心能力页
│   │   ├── research-archive-page/ # 学术研究列表页
│   │   ├── research-paper/     # 论文 Piece
│   │   ├── dataset-library-page/  # 样例数据集页
│   │   └── about-page/         # 关于我们页
│   └── data/                   # 本地数据库（SQLite，Git 忽略）
│
├── frontend/                   # Astro 前端
│   ├── astro.config.mjs        # Astro 配置（含 Apostrophe 集成）
│   ├── public/                 # 静态资源
│   └── src/
│       ├── pages/              # 唯一路由 [...slug].astro
│       ├── templates/          # 页面模板（Page Type → Astro 组件映射）
│       ├── widgets/            # 组件模板（Widget → Astro 组件映射）
│       ├── components/         # Astro / React 组件
│       │   ├── core/           # 核心能力域组件
│       │   └── ...             # 公共组件（Header/Footer/ContactDrawer）
│       ├── styles/             # 全局与页面样式
│       └── lib/                # 前端工具
│
├── docs/                       # 文档
│   └── migration/              # 各页面域迁移记录
├── README.md                   # 本文件
├── AGENTS.md                   # Agent/开发者执行规则
├── ARCHITECTURE.md             # 架构快速参考
└── MIGRATION_WORK_SPLIT.md     # 并行迁移分工基线
```

---

## 📄 页面与内容模型

### 页面类型（Page Type）

| 页面 | URL | Page Type | Astro 模板 |
|---|---|---|---|
| 首页 | `/` | `@apostrophecms/home-page` | `HomePage.astro` |
| 智能体感知 | `/coohomcloud/solutions/aiagent` | `solution-page` | `SolutionPage.astro` |
| AIGC | `/coohomcloud/solutions/aigc` | `solution-page` | `SolutionPage.astro` |
| 机器人仿真 | `/coohomcloud/solutions/roboticsimulation` | `solution-page` | `SolutionPage.astro` |
| 产品可视化推广 | `/coohomcloud/solutions/visualizedproductpromotion` | `solution-page` | `SolutionPage.astro` |
| 拓展现实 | `/coohomcloud/solutions/xr` | `solution-page` | `SolutionPage.astro` |
| 核心能力 | `/coohomcloud/corecompetency` | `core-competency-page` | `CoreCompetencyPage.astro` |
| 学术研究 | `/coohomcloud/corecompetency/paper` | `research-archive-page` | `ResearchArchivePage.astro` |
| 样例数据集 | `/coohomcloud/corecompetency/data` | `dataset-library-page` | `DatasetLibraryPage.astro` |
| 关于我们 | `/coohomcloud/about` | `about-page` | `AboutPage.astro` |

### 内容片段（Piece）

| Piece | 说明 | 关键字段 |
|---|---|---|
| `research-paper` | 学术论文 | `title`、`year`、`venue`、`abstract`、`externalUrl`、`cover` |
| `dataset-item`（规划中） | 数据集条目 | 分类、标题、摘要、详情、格式/标签、下载链接等 |

### 组件（Widget）

标准 ApostropheCMS 组件：富文本（`rich-text`）、图片（`image`）、视频（`video`）、文件（`file`）、布局（`layout` / `layout-column` / `nested-layout-widget` / `nested-column-widget`）。

---

## 🔗 关键配置

### 环境变量

| 变量 | 说明 | 默认值 |
|---|---|---|
| `APOS_EXTERNAL_FRONT_KEY` | 前后端认证密钥，两个项目必须一致 | `dev`（开发脚本中内置） |
| `APOS_DB_URI` | 数据库连接串（本地开发使用 SQLite） | `sqlite://data/spatial-verse-cms.sqlite` |
| `APOS_HOST` | 后端地址（供前端连接） | `http://localhost:3000`（见 `astro.config.mjs`） |
| `PORT` | Astro 前端端口 | `4321` |
| `APOS_MONGODB_URI` | MongoDB 连接串（生产环境） | — |

> **Windows 用户提示**：环境变量推荐写入 `backend/.env` 与 `frontend/.env` 文件（项目已内置 `dotenv` 支持）。请勿在 PowerShell 中使用 `KEY=value npm run ...` 这类 Unix 风格的前缀语法，会导致命令错误。

### 多语言

- 中文 `zh`：默认语言，URL 无前缀（如 `/coohomcloud/corecompetency`）
- 英文 `en`：URL 使用 `/en` 前缀（如 `/en/coohomcloud/corecompetency`）
- 语言配置位于 `backend/modules/@apostrophecms/i18n/index.js`

---

## 👨‍💻 开发指南

### 新增页面类型（Page Type）

1. 在 `backend/modules/` 创建模块目录（如 `my-page/`），在 `index.js` 中设置 `extend: '@apostrophecms/page-type'` 并定义字段
2. 在 `backend/app.js` 的 `modules` 中注册：`'my-page': {}`
3. 在 `backend/modules/@apostrophecms/page/index.js` 的 `types` 数组中添加，供编辑人员选择
4. 在 `frontend/src/templates/` 创建 `MyPage.astro`，页面数据通过 `Astro.props.aposData.page` 获取
5. 在 `frontend/src/templates/index.js` 中添加映射：`'my-page': MyPage`

> **注意**：模板映射键必须与后端模块名完全一致，否则会静默回退到默认渲染器（页面显示空白但无报错）。

### 新增组件（Widget）

1. 在 `backend/modules/` 创建模块目录（如 `my-widget/`），在 `index.js` 中设置 `extend: '@apostrophecms/widget-type'`
2. 在 `backend/app.js` 中注册
3. 在 `frontend/src/widgets/` 创建 `MyWidget.astro`，组件数据通过 `Astro.props.widget` 获取
4. 在 `frontend/src/widgets/index.js` 中添加映射
5. 在相关后端 Schema 的 area `widgets` 配置中加入该组件

### 新增内容片段（Piece）

1. 在 `backend/modules/` 创建模块目录（如 `my-piece/`），在 `index.js` 中设置 `extend: '@apostrophecms/piece-type'` 并定义字段
2. 在 `backend/app.js` 中注册
3. 在页面的 Schema 中使用 `relationship` 字段关联该 Piece

### 图片处理

推荐使用 `@apostrophecms/apostrophe-astro/lib/attachment.js` 提供的工具函数：

```js
import {
  getAttachmentUrl,
  getAttachmentSrcset,
  getFocalPoint,
  getWidth,
  getHeight
} from '@apostrophecms/apostrophe-astro/lib/attachment.js';

// 关系字段以数组形式返回，即使 max: 1 也要用 [0]
const image = widget._image?.[0];
```

主要函数：

| 函数 | 说明 |
|---|---|
| `getAttachmentUrl(attachment)` | 获取图片 URL（可指定尺寸） |
| `getAttachmentSrcset(attachment)` | 生成响应式 srcset |
| `getFocalPoint(attachment)` | 获取焦点坐标（`object-position` 值） |
| `getWidth(attachment)` / `getHeight(attachment)` | 获取图片宽高（自动适配裁剪） |

### `_` 前缀约定

以 `_` 开头的字段是关系字段（relationship）。Apostrophe 在请求时解析它们，并**始终以数组形式返回**，即使 `max: 1`：

```js
const image = widget._image?.[0];
const author = article._author?.[0]?.title;
```

### 组件注册表

| 注册文件 | 映射内容 |
|---|---|
| `frontend/src/templates/index.js` | 页面类型名 → Astro 组件 |
| `frontend/src/widgets/index.js` | Widget 名 → Astro 组件 |

---

## 🏗️ 构建与部署

### 本地构建验证

```bash
# 前端构建
cd frontend
npm run build

# 后端构建
cd backend
npm run build
```

### 生产部署

生产环境需要分别部署前后端两个项目：

#### 后端（ApostropheCMS）

所需环境：

- Node.js 环境（建议 v22+）
- MongoDB 数据库
- 媒体存储方案（如 AWS S3）

关键环境变量：

```bash
NODE_ENV=production
APOS_MONGODB_URI=YOUR_mongodb_connection_string
APOS_EXTERNAL_FRONT_KEY=a_random_string
APOS_S3_BUCKET=YOUR-bucket-name
APOS_S3_SECRET=YOUR-s3-secret
APOS_S3_KEY=YOUR-s3-key
APOS_S3_REGION=YOUR-chosen-region
```

#### 前端（Astro）

本项目使用 Astro SSR（`output: 'server'`）模式，可部署到支持 SSR 的平台（Netlify、Vercel、Cloudflare Pages、AWS Amplify 等）。需要额外设置：

```bash
APOS_EXTERNAL_FRONT_KEY=a_random_string   # 必须与后端一致
APOS_HOST=your-backend-url
```

---

## 🗃️ 数据管理

### 数据导入

项目为每个页面域提供可重复执行的数据导入任务（需在 `backend/.env` 中配置 `APOS_DB_URI`）：

```bash
# 论文数据（5 篇）
node app research-paper:import

# 核心能力页
node app core-competency-page:import

# 学术研究页（自动关联论文）
node app research-archive-page:import
```

> 未使用 `.env` 时，Windows PowerShell 可使用以下等价写法：
> ```powershell
> $env:APOS_DB_URI="sqlite://data/spatial-verse-cms.sqlite"; node app research-paper:import
> ```

> **注意**：SQLite 数据库位于 `backend/data/`，已被 Git 忽略，不会随代码仓库同步。克隆仓库后需要重新创建管理员并导入草稿数据。

### 内容发布

目前业务页面均以 **中文草稿（`zh:draft`）** 状态存在，未发布。英文内容后续作为相同文档的 `en` locale 添加。发布管理在 ApostropheCMS 管理后台进行。

---

## 📚 相关文档

| 文档 | 说明 |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | 架构快速参考（职责划分、组件注册、`_` 前缀约定等） |
| [`AGENTS.md`](./AGENTS.md) | Agent 与开发人员执行规则（分工、边界、验收标准） |
| [`MIGRATION_WORK_SPLIT.md`](./MIGRATION_WORK_SPLIT.md) | 并行迁移分工基线（页面、负责人、交付标准） |
| [`docs/onboarding.md`](./docs/onboarding.md) | 对接文档（环境准备、内容模型、数据导入、验收清单） |
| [`docs/marketing-operations-manual.md`](./docs/marketing-operations-manual.md) | 市场部操作手册（登录、原地编辑、新增学术论文等） |
| [`docs/migration/core-research.md`](./docs/migration/core-research.md) | 核心能力与学术研究迁移记录 |

### 外部文档

- [ApostropheCMS 文档](https://docs.apostrophecms.org/)
- [Astro 文档](https://docs.astro.build/)
- [apostrophe-astro 桥接包](https://github.com/apostrophecms/apostrophe-astro)
- [Astro + ApostropheCMS 集成指南](https://docs.astro.build/en/guides/cms/apostrophecms/)

---

## 🛠️ 常用命令速查

```bash
# 安装全部依赖（根目录）
npm install

# 配置后端 .env（backend/，首次使用）
# 复制 backend/.env.example 为 backend/.env，并设置 APOS_DB_URI

# 启动后端（backend/）
npm run dev

# 后端构建（backend/）
npm run build

# 启动前端（frontend/）
npm run dev

# 前端构建（frontend/）
npm run build

# 创建管理员（backend/）
node app @apostrophecms/user:add admin admin

# 前端生产预览（frontend/，构建后执行）
npm run preview
```

---

## ⚖️ 许可证

MIT License