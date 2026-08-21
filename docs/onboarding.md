# SpatialVerse 官网 CMS 对接文档

本文件面向**对接人员 / 开发人员**，提供从环境准备、内容模型、数据导入到上线发布的完整对接指引。市场部日常操作请查阅 [`marketing-operations-manual.md`](./marketing-operations-manual.md)。

---

## 1. 项目概述

- 技术栈：ApostropheCMS（后端内容管理）+ Astro（前端 SSR 渲染）
- 桥接：`@apostrophecms/apostrophe-astro`
- 仓库地址：`spatial-verse-cms`（Git 仓库）
- 工作区根：`h:/spatial-verse`（含只读原站参考 `spatial-verse-site`）

### 环境要求

| 依赖 | 版本 |
|---|---|
| Node.js | `>= 22` |
| 数据库 | MongoDB `>= 6.0`（本地开发可用 SQLite） |

### 关键端口

| 服务 | 地址 |
|---|---|
| 后端（ApostropheCMS） | `http://localhost:3000` |
| 前端（Astro） | `http://localhost:4321` |
| 管理后台 / 登录 | `http://localhost:4321/login` |

---

## 2. 快速启动

```bash
# 1. 安装依赖（根目录，postinstall 自动装前后端）
npm install

# 2. 配置环境变量
# backend/.env
APOS_EXTERNAL_FRONT_KEY=dev
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite
# frontend/.env
APOS_EXTERNAL_FRONT_KEY=dev

# 3. 启动后端（终端 1）
cd backend && npm run dev

# 4. 启动前端（终端 2）
cd frontend && npm run dev

# 5. 创建管理员（backend/）
node app @apostrophecms/user:add admin admin

# 6. 导入中文草稿数据（backend/，按顺序）
node app research-paper:import
node app core-competency-page:import
node app research-archive-page:import
```

> **Windows 提示**：环境变量请写入 `.env` 文件，不要使用 `KEY=value npm run ...` 前缀语法。

---

## 3. 内容模型

### 3.1 页面类型（Page Type）

| 页面 | URL | Page Type | 字段分组 |
|---|---|---|---|
| 首页 | `/` | `@apostrophecms/home-page` | — |
| 解决方案 ×5 | `/coohomcloud/solutions/*` | `solution-page` | Basics / SEO |
| 核心能力 | `/coohomcloud/corecompetency` | `core-competency-page` | Basics / SEO |
| 学术研究 | `/coohomcloud/corecompetency/paper` | `research-archive-page` | Basics / SEO |
| 样例数据集 | `/coohomcloud/corecompetency/data` | `dataset-library-page` | Basics / SEO |
| 关于我们 | `/coohomcloud/about` | `about-page` | Basics / SEO |

### 3.2 内容片段（Piece）

| Piece | 说明 | 关键字段 |
|---|---|---|
| `research-paper` | 学术论文 | `title`、`year`、`venue`、`abstract`、`externalUrl`、`cover`（area） |

### 3.3 字段建模约定

- **原位编辑**：所有前台可见文本使用 `area`（rich-text）字段，前台 `aposEdit` 模式可点击编辑；需要纯文本的场景由 `frontend/src/lib/editableText.js` 的 `areaText()` 提取。
- **SEO**：每个 Page Type 提供 `seo` 分组（`seoTitle` / `seoDescription` / `seoKeywords`），公共路由自动输出 meta description。
- **关系字段**：以 `_` 开头的字段为 relationship，请求时解析并**始终以数组返回**（即使 `max: 1`）。
- **Widget 类型名** = 模块名去掉 `-widget` 后缀（area 配置与前端映射键均用类型名）。

---

## 4. 数据导入与发布

### 4.1 导入任务

所有导入任务使用稳定 slug，**重复执行只会更新、不会重复创建**：

```bash
cd backend
node app research-paper:import        # 5 篇论文
node app core-competency-page:import  # 核心能力页
node app research-archive-page:import # 学术研究页（自动关联论文）
```

### 4.2 发布状态

- 业务页面/论文默认以中文草稿（`zh:draft`）创建，导入任务会调用 `publish` 发布。
- **未发布页面访客访问返回 404**，登录后可预览。
- 英文 `en` locale 后续作为相同文档添加，URL 使用 `/en` 前缀。

### 4.3 已知坑位（务必注意）

1. **数据必须含 `type` 字段**，否则框架 `getManager` 返回 undefined 报 `Cannot read properties of undefined (reading 'emit')`。
2. **发布后 slug 被加数字后缀**：数据库残留脏文档（slug 带数字后缀、`docId` 为 undefined）会导致 Apostrophe 发布时自动去重加后缀，访客访问干净 URL 404。清理脏文档后按顺序重新导入。
3. **published 版论文关联丢失**：relationship 的 `papersIds` 有时只存在于 draft，发布后 published 版为空导致列表 `_papers` 为 0。需要把 draft 的 `papersIds` 复制到 `zh:published` 文档。
4. **重复导入会误创建新页面**：若库中仅有 draft（published 被误删），`pages.find`（默认 published 模式）查不到会走 insert 分支。修复方向：恢复 published 版本或增强 import 回退查 draft。
5. **数据库与媒体不入库**：`backend/data/`（SQLite）与 `backend/public/uploads/` 均在 Git 忽略，克隆后需重建管理员并重新导入。

---

## 5. 验证清单（对接验收）

- [ ] 前后端 `npm run build` 均通过
- [ ] `GET /coohomcloud/corecompetency` → 200
- [ ] `GET /coohomcloud/corecompetency/paper` → 200，且 `_papers` 返回 5 篇论文
- [ ] 学术研究页 `zh:published` 关联论文数 = 论文发布总数
- [ ] draft 与 published slug 一致（无数字后缀）
- [ ] 登陆 `/login` 后前台可原地编辑，发布后访客可见

---

## 6. 相关文档

| 文档 | 说明 |
|---|---|
| [`README.md`](../README.md) | 项目总览与快速开始 |
| [`ARCHITECTURE.md`](../ARCHITECTURE.md) | 架构快速参考 |
| [`AGENTS.md`](../AGENTS.md) | Agent 执行规则 |
| [`marketing-operations-manual.md`](./marketing-operations-manual.md) | 市场部操作手册 |
| [`migration/core-research.md`](./migration/core-research.md) | 核心能力与学术研究迁移记录 |