# Spatial Verse CMS 云端部署交接

本文记录截至 2026-09-02 的云端部署状态，以及后续接手人需要维护的文件、数据、容器和静态海报流程。

## 1. 当前云端实例

| 项目 | 当前信息 |
| --- | --- |
| 云服务器 | 阿里云 ECS，Ubuntu 26.04 LTS，x86_64 / amd64 |
| 公网地址 | `121.40.101.242` |
| SSH | `root@121.40.101.242`，端口 `22` |
| 项目目录 | `/opt/spatial-verse-cms` |
| Docker | Docker Engine 29.1.3，Docker Compose 2.40.3 |
| Astro 前端 | 容器内端口 `4321` |
| ApostropheCMS 后端 | 容器内端口 `3000` |
| 内容数据库 | `/opt/spatial-verse-cms/backend/data/spatial-verse-cms.sqlite` |
| CMS 上传媒体 | `/opt/spatial-verse-cms/backend/public/uploads/` |

服务器无法直接访问 GitHub。因此本次代码由 Mac 通过 SCP 上传，而不是在服务器执行 `git clone`。

## 2. 当前部署代码来源与重要差异

服务器最初从代码包 `spatial-verse-cms-code-dev-d39b01f-20260831.zip` 解压，基线为 Git 提交 `d39b01f`。随后服务器为适应国内镜像网络做过两项**手工修改**：

1. 删除 Dockerfile 的 `# syntax=docker/dockerfile:1.7`，因为阿里云镜像加速器中没有 `docker/dockerfile:1.7`。
2. 将 Dockerfile 中两处基础镜像改为：

   ```dockerfile
   FROM m.daocloud.io/docker.io/library/node:22-bookworm-slim
   ```

GitHub `dev` 之后还有提交 `69587e8`，其中包含第一项修复；服务器不能直接 Git 拉取，因此接手人更新部署时必须先比较服务器工作目录与 `dev`，不得盲目覆盖 Dockerfile。

## 3. 容器与持久化

服务由项目根目录的 `docker-compose.yml` 管理：

```bash
cd /opt/spatial-verse-cms
docker compose ps
docker compose logs -f backend frontend
```

两个服务：

| 服务 | 作用 | 数据 |
| --- | --- | --- |
| `backend` | ApostropheCMS、登录、权限、内容 API、上传文件 | 挂载 `backend/data/`、`backend/public/uploads/` |
| `frontend` | Astro SSR 前端与 `/login` 编辑入口 | 通过 Docker 内网访问 `backend:3000` |

绝对不要删除以下目录：

```text
/opt/spatial-verse-cms/backend/data/
/opt/spatial-verse-cms/backend/public/uploads/
```

它们不在 Git 中，包含 SQLite、CMS 用户、页面内容和上传媒体。更新前应停止后端并备份：

```bash
cd /opt/spatial-verse-cms
docker compose stop backend
tar -C backend -czf /opt/backup-spatial-verse-YYYYMMDD.tar.gz data public/uploads
docker compose start backend
```

## 4. 当前运行与安全状态

当前 Compose 使用开发模式：后端 `npm run dev`、前端 `astro dev`。它适用于当前验收和内容编辑，但不是最终的生产运行方式。后续应由接手人完成生产镜像构建、Nginx HTTPS 反代、域名和证书配置。

Nginx 模板向当前 Astro 开发服务器转发时会固定内部 `Host: 127.0.0.1:4321`，以避免 Vite 对陌生公网域名返回 `403`；原始域名保存在 `X-Forwarded-Host`。这是当前开发模式的兼容处理，切换为生产版 Astro server 后可按需改为转发原始 `Host`。

运行时环境变量位于项目根目录 `.env`，至少包括：

```dotenv
APOS_EXTERNAL_FRONT_KEY=随机字符串
APOS_SESSION_SECRET=随机字符串
```

该文件不可提交 Git，也不可复制到公开文档。更换 `APOS_SESSION_SECRET` 会让全部管理员浏览器重新登录；不会损坏 SQLite。

## 5. 静态海报页面（新增约定）

静态海报不进入 ApostropheCMS，也不创建 Page Type、Widget 或 Astro 路由。Nginx 直接处理：

```text
https://www.example.com/poster/autumn/
        ↓
/var/www/posters/autumn/index.html
```

版本控制的 Nginx 模板位于：

```text
deploy/nginx/spatial-verse-cms.conf
```

首次配置海报能力的服务器操作：

```bash
apt update
apt install -y nginx
mkdir -p /var/www/posters
chown -R www-data:www-data /var/www/posters
cp /opt/spatial-verse-cms/deploy/nginx/spatial-verse-cms.conf /etc/nginx/sites-available/spatial-verse-cms
ln -s /etc/nginx/sites-available/spatial-verse-cms /etc/nginx/sites-enabled/spatial-verse-cms
# 保留一份可恢复副本，避免默认站点抢占同一域名的 HTTP 请求。
mv /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.disabled
nginx -t
systemctl reload nginx
```

启用前必须把 Nginx 配置中的 `example.com`、`www.example.com` 替换为真实域名。配置 HTTPS 后，再将安全组对公网仅开放 `80`、`443` 和受限来源的 `22`；不要开放 `3000`，也不要长期开放 `4321`。

### 新增一张海报

假设海报地址为 `/poster/autumn/`：

```bash
mkdir -p /var/www/posters/autumn
```

上传文件至该目录，使其结构为：

```text
/var/www/posters/autumn/index.html
/var/www/posters/autumn/assets/...
```

海报中的 CSS、JS、图片引用应使用相对路径（如 `./assets/banner.webp`），或完整的
`/poster/autumn/assets/banner.webp` 路径；不要写成 `/assets/banner.webp`，否则会指向
主站 Astro 的资源目录。`/poster/...` 在中文和英文页面中保持同一个 URL，不会被前端
自动加上 `/en` 前缀。

验证：

```bash
curl -I http://127.0.0.1/poster/autumn/
```

然后在 ApostropheCMS 任意已有的 URL 字段中填写：

```text
/poster/autumn/
```

海报上线不需要 `docker compose up --build`，也不需要修改 CMS 模型或重启 Nginx。

### 下线一张海报

先在 CMS 中移除/替换链接，再将对应目录移动到服务器备份目录，不要直接永久删除：

```bash
mkdir -p /var/www/posters-archive
mv /var/www/posters/autumn /var/www/posters-archive/autumn-YYYYMMDD
```

## 6. 更新代码

由于服务器无法连接 GitHub，更新流程为：

1. 在开发机从 `dev` 打包纯代码；不含 `node_modules`、`.git`、SQLite、uploads、`.env`。
2. 使用 `scp` 上传到 `/opt/`。
3. 先备份 `backend/data/` 和 `backend/public/uploads/`。
4. 解压到临时目录，使用 `rsync` 更新代码；排除数据、uploads 与 `.env`。
5. 比较并保留服务器的国内镜像 Dockerfile 适配，或更新为统一的可访问镜像源。
6. `docker compose up --build -d` 后检查：

   ```bash
   docker compose ps
   curl -I http://127.0.0.1:4321
   docker compose logs --tail=100 backend frontend
   ```

## 7. 已知问题与待办

- 服务器不能直连 GitHub；部署使用 SCP 代码包。
- 阿里云专属 Docker 加速器未同步 `node:22-bookworm-slim`；服务器目前使用 DaoCloud 前缀镜像。
- 当前运行的是开发模式，应迁移到真正的 production build / serve。
- 尚未配置 Nginx、域名、HTTPS、Certbot 或 ECS 安全组正式规则。
- 当前数据库是本地 SQLite；单机部署可用，但必须定期离机备份。
