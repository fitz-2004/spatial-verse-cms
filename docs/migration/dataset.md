# Dataset Library 迁移记录

## 范围

- 原站基准：`spatial-verse-site` 的 `dby_vibe` / `eb1246e63ee01b5f03a6ea93dc122e65ef337e7c`
- 中文 URL：`/coohomcloud/corecompetency/data`
- Page Type：`dataset-library-page`
- Piece：`dataset-item`
- Astro Template：`frontend/src/templates/DatasetLibraryPage.astro`
- React island：`frontend/src/components/dataset/DatasetLibraryExperience.tsx`

页面模板只渲染 `<main>` 内的数据集内容；Header、Footer、语言切换与联系抽屉均由公共路由层提供，未重复实现。

## 内容模型

`dataset-library-page` 保存页面固定内容、SEO、分类筛选显示名和 `_datasets` relationship。relationship 的顺序就是资源库展示顺序。

`dataset-item` 是可独立创建、编辑、检索和复用的 Piece：

- `sourceKey`：原型稳定 id，也是重复导入更新键。
- `rank`、`category`、`title`、`summary`、`description`。
- `formats[]`、`tags[]`。
- `cover` 与 `gallery[]`：由 CMS 管理的图片附件。
- `downloads[]`：显示名称与真实外部 URL；不把 ZIP、RAR、BLEND、USD 上传到图片媒体库。

新增数据集的操作：先在 CMS 的「数据集资源」中创建 `dataset-item`，填写下载选项并上传预览图/图库；再编辑数据集页面，在「展示的数据集」中关联该 Piece。

## 原型数据与媒体

导入任务包含原型的 15 条数据集：模型 10 条、场景 2 条、图像 3 条。15 条数据均使用原站 `original-media.ts` 中配置的封面；3 条图像数据还带有共 13 张详情图库，所有资源已保存到：

```text
frontend/public/media/datasets/
```

导入时这些文件会被创建为 Apostrophe 附件，之后可在 CMS 中替换。若后续新建的 Piece 没有上传 `cover`，前端才会显示信号占位图。

不迁移原型的访客本地上传功能：`＋ 导入图片`、`file input`、`URL.createObjectURL` 和 `importedImages` 均不存在于 CMS 实现。

## 草稿导入

使用 Node 22：

```bash
cd backend
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite \
  /opt/homebrew/opt/node@22/bin/node app dataset-library-page:import-drafts
```

任务会按 `sourceKey` 更新已有 Piece，按固定 slug 更新/创建页面，只处理中文草稿，不导入 Global、`/archive` 或其他页面，且不会发布。

## 验证

- `node --check`：`dataset-item`、`dataset-library-page` 与 seed 文件通过。
- `npm run build`：前后端构建通过。
- 草稿导入：页面 1 个、`dataset-item` 15 个、发布 0 个。
- 浏览器草稿预览：Header/Footer、页首、15 张封面卡片（占位图 0 张）、分类筛选（图像数据 3 条）、关键词检索（“弓形” 1 条）和详情下载弹层均通过。

本机若仍有原型站占用 `localhost:3000`，可临时用 CMS 后端 `3001` 与 Astro 前端 `4322` 联调；编辑器预览 URL 需带上 Apostrophe 的草稿会话，直接匿名访问只会读取已发布内容。
