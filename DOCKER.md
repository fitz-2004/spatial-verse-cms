# Spatial Verse CMS 本地 Docker 运行

该方案只用于当前恢复后的本地 SQLite 版本，不依赖 Neon、Render 或 Vercel。

## 持久化范围

Docker Compose 将宿主机目录直接挂载到后端容器：

- `backend/data/` → `/app/backend/data/`：SQLite 主文件及其 WAL/SHM 文件
- `backend/public/uploads/` → `/app/backend/public/uploads/`：ApostropheCMS 上传媒体

因此执行 `docker compose down`、重新构建镜像或删除容器都不会删除 CMS 内容和上传文件。

## 启动

在仓库根目录执行：

```bash
docker compose up --build -d
```

首次构建会安装 Linux 版本的 Node.js 依赖，耗时取决于网络与机器性能。

查看状态：

```bash
docker compose ps
```

实时查看日志：

```bash
docker compose logs -f backend frontend
```

访问地址：

- Astro 网站及 CMS 登录入口：http://localhost:4321
- ApostropheCMS 后端：http://localhost:3000

## 停止与重启

```bash
docker compose stop
docker compose start
```

删除容器但保留 SQLite 和上传媒体：

```bash
docker compose down
```

代码发生变化后重新构建：

```bash
docker compose up --build -d
```

## 管理命令

例如创建管理员：

```bash
docker compose exec backend node app @apostrophecms/user:add admin admin
```

运行 ApostropheCMS 构建：

```bash
docker compose exec backend npm run build
```

运行 Astro 构建：

```bash
docker compose exec frontend npm run build
```

## 可选本地密钥

Compose 默认使用仅适合本机开发的 session secret。若多人共享同一套本地环境，可在仓库根目录创建不提交 Git 的 `.env`：

```dotenv
APOS_EXTERNAL_FRONT_KEY=dev
APOS_SESSION_SECRET=替换为足够长的随机字符串
```

两项只用于容器环境；不要把真实密钥提交到仓库。
