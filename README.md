# SpatialVerse CMS

群核空间智能平台网站的内容管理与前端渲染项目。ApostropheCMS 管理页面、媒体、草稿/发布、全局内容与用户权限；Astro 负责服务端渲染 HTML、视觉、动效、交互和 SEO 输出。

## 当前交付基线

- Git 协作分支：`dev`
- 当前运行时代码基线：`bdd4652`（2026-09-04）；其后的提交仅整理交付文档与历史文档，不改变网站运行逻辑。
- 本次整合：已合入 `lbh-dynamic-nav`，顶部导航改由 CMS 的 `Global.primaryNav` 管理；编辑人员可新增、删除、排序一级导航并配置下拉子链接。
- Docker 基础镜像：使用 DaoCloud Node 镜像，适配国内服务器无法稳定拉取 Docker Hub 的场景。

> 云服务器不会自动同步 GitHub。将此版本部署到服务器前，必须先备份 SQLite、uploads 与 `.env`，再上传纯代码包并重建容器。

## 架构

```text
浏览器
  ↓
Nginx（生产/云端入口）
  ├─ /poster/* → /var/www/posters/* 静态海报文件
  └─ 其他路径 → Astro :4321
                     ↓
               ApostropheCMS :3000
                     ↓
       SQLite + backend/public/uploads
```

- **ApostropheCMS**：Page Type、Page fields、Area、Widget、Piece、Global、媒体、SEO 字段、用户及草稿/发布。
- **Astro**：唯一正式路由 `frontend/src/pages/[...slug].astro`，统一输出 Header、Template、Footer、编辑上下文与 SEO。
- **React islands**：仅承载复杂动效或交互；不保存 CMS 内容。
- **Nginx 静态海报**：海报不进入 CMS、Astro 或 Docker 镜像；CMS 仅保存如 `/poster/summer-sale/` 的入口链接。

## 已接入页面

| 页面域 | Page Type / Piece | Astro Template |
| --- | --- | --- |
| 首页 `/` | `@apostrophecms/home-page` + `home-*` 固定 Widget | `HomePage.astro` |
| 五个解决方案 | `solution-page` | `SolutionPage.astro` |
| 核心能力 | `core-competency-page` | `CoreCompetencyPage.astro` |
| 学术研究 | `research-archive-page` + `research-paper` | `ResearchArchivePage.astro` |
| 样例数据集 | `dataset-library-page` + `dataset-item` | `DatasetLibraryPage.astro` |
| 关于我们 | `about-page` + `about-*` 固定 Widget | `AboutPage.astro` |

完整字段、Widget 与文件映射见 [CONTENT_MODEL.md](./CONTENT_MODEL.md)。

## 本地 Docker 运行

前提：Docker Desktop / Docker Engine 与 Docker Compose v2。

```bash
docker compose up --build -d
docker compose ps
```

- 网站及 CMS 登录：<http://localhost:4321/>
- 后端：<http://localhost:3000/>
- 管理员从 `/login` 登录后进入 Edit、Preview、Publish 流程。

详细命令见 [DOCKER.md](./DOCKER.md)。`backend/data/`、`backend/public/uploads/` 和根目录 `.env` 均不在 Git 中；不得用空目录或他人的完整数据库覆盖它们。

## 文档索引

- [最终交付、使用与部署手册](./docs/delivery/SpatialVerse_CMS项目交付与使用手册_2026-09-04_最终版.docx)
- [云端部署交接](./CLOUD_DEPLOYMENT_HANDOFF.md)
- [内容模型速查](./CONTENT_MODEL.md)
- [协作和代码边界](./AGENTS.md)
- [迁移 URL、分工与验收基线](./MIGRATION_WORK_SPLIT.md)
- 页面域迁移记录：[`docs/migration/`](./docs/migration/)

## 生产上线仍需完成

当前 Docker Compose 使用开发运行模式，适合验收与内容编辑。正式上线前仍需完成：生产 build/serve、域名和 HTTPS、ECS 安全组收敛、SQLite 与 uploads 的离机备份及恢复演练、全页面/移动端/中英文/SEO 内容验收。
