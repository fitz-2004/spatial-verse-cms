# Dataset Library 迁移记录

## 1. 范围与来源

- 原站参考分支：`dby_vibe`
- 原站参考提交：`eb1246e63ee01b5f03a6ea93dc122e65ef337e7c`
- 中文 URL：`/coohomcloud/corecompetency/data`
- Page Type：`dataset-library-page`
- Piece Type：`dataset-item`
- 原站数据：`homepage/app/dataset-library-data.ts`
- 原站交互：`homepage/app/coohomcloud/CoreCompetency/Data/dataset-library-experience.tsx`
- 原站媒体映射：`homepage/app/original-media.ts`

本域不包含 About、Header、Footer、公共路由或其他页面域。

## 2. 内容模型

### `dataset-item`

| 字段 | 类型 | 用途 |
|---|---|---|
| `title` / `slug` | Apostrophe 内置字段 | 标题及原站稳定 id |
| `category` | select | `model` / `scene` / `image` 分类筛选 |
| `categoryLabel` | string | 原站卡片角标，例如 `PHYSICAL MODEL` |
| `summary` | textarea string | 卡片摘要 |
| `description` | textarea string | 详情弹层说明 |
| `formats[]` | array | 卡片多值格式展示和搜索 |
| `tags[]` | array | 卡片标签和搜索 |
| `preview` | 单图 Area | CMS 编辑人员管理的卡片预览图 |
| `_gallery` | image relationship | CMS 编辑人员管理的详情图库 |
| `downloads[]` | array | 每项包含显示名称 `label` 和真实外部 `url` |

`formats[]` 是多值展示字段。详情弹层的格式 radio 来自 `downloads[]`，两者没有合并。

### `dataset-library-page`

- `intro`：页面索引、标题和简介。
- `library`：资源库标题、说明、搜索、筛选和空状态等可见文案。
- `_items`：关联并按编辑顺序输出 `dataset-item`，条目不硬编码在 Page。
- `seo*`：公共 SEO 路由所需标题、描述、canonical、robots、Open Graph 和 Twitter Card 字段。

## 3. 前端

- Astro Template 将 CMS Page 和 Piece 数据整理成可序列化 props。
- `DatasetLibraryExperience.tsx` 使用现有 React integration，以 `client:visible` 加载。
- 支持卡片列表、关键词搜索、三类筛选、formats/tags 展示、详情弹层、图库缩略图、downloads radio、真实外链下载、关闭按钮和 Escape 关闭。
- 缺少预览图时显示占位状态；缺少图库时回退到 preview；缺少 downloads 时显示无资源状态。
- 没有访客上传入口，不包含 FileReader、Object URL 或 `importedImages`。
- Dataset 样式位于域组件目录，不修改公共样式。

## 4. 草稿导入

注册模块后运行：

```bash
cd backend
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app dataset-import:import-drafts
```

Windows PowerShell：

```powershell
$env:APOS_DB_URI='sqlite://data/spatial-verse-cms.sqlite'
node app dataset-import:import-drafts
```

任务约束：

- 仅使用任务内固定的 15 个原站 Dataset id 幂等更新 `zh:draft`。
- slug 等于原站稳定 id。
- 创建或更新 1 个 Dataset Library 中文草稿页面，并只关联上述 15 个 Piece。
- 不清库、不删除或覆盖其他成员内容、不创建英文内容。
- 不发布 Page、Piece 或图片。
- 只下载原站实际引用的预览图和图库图片到 Apostrophe 图片媒体库。
- ZIP、RAR、BLEND、USD 等 Dataset 下载资源不会被下载；`downloads[].url` 只保存原站真实外链。

只读复核：

```powershell
node app dataset-import:verify-drafts
```

输出页面关联条数、每条数据的预览图 uploads URL、图库张数和下载项数量。

2026-08-24 本地导入验证：

- `dataset-library-page` `zh:draft`：1
- `dataset-item` `zh:draft`：15
- `dataset-item` `zh:published`：0
- 页面关联 Piece：15
- 有 preview：15
- 有 gallery：3
- Dataset 图片草稿：24 个唯一原站图片
- `verify-drafts` 输出：15 条数据全部解析出 `/uploads/attachments/...` 预览图，3 条含图库（3 / 5 / 5 张）

## 4.1 已修复的三个实现缺陷

1. 预览图关系写入失败：导入任务原先向图片 Widget 传入 `aposDocId` 字符串。Apostrophe 的 relationship 转换器把裸字符串当标题匹配，找不到目标后写入空关系，`prepareForStorage` 随即把 `imageIds` 清空，因此 15 条数据的 `preview` 都没有图片，前端只能渲染占位块。现在传入 `{ _id }` 对象，并在关系为空时直接报错。
2. 图库在页面查询中缺失：Apostrophe 默认不加载“关系的关系”，`dataset-library-page._items` 取回的 `dataset-item` 上没有 `_gallery`。现在在 `_items` 上声明 `withRelationships: [ '_gallery' ]`。
3. 下载按钮文字不可见：公共 `.spatialverse-body a { color: inherit }` 的选择器权重高于 `.dataset-download-button`，按钮继承了弹层的深色文字，叠在深色底上几乎不可见。现在把按钮配色收敛到 `.dataset-lightbox-info .dataset-download-button`。

搜索框此前出现两个清除按钮：`type="search"` 的浏览器原生清除按钮叠加了组件自带按钮。现在隐藏原生按钮，只保留组件按钮（原站同样存在该重叠，此处按“只保留一个合理清除按钮”的要求处理）。

## 5. 文件与注册

- `backend/modules/dataset-item/index.js`
- `backend/modules/dataset-library-page/index.js`
- `backend/modules/dataset-import/index.js`
- `backend/modules/dataset-import/lib/datasetData.js`
- `frontend/src/templates/DatasetLibraryPage.astro`
- `frontend/src/components/dataset/DatasetLibraryExperience.tsx`
- `frontend/src/components/dataset/dataset-library.css`
- `docs/migration/dataset.md`

共享注册文件 `backend/app.js` 新增 `dataset-item` 和 `dataset-import`。该修改应按 `AGENTS.md` 单独 commit，便于集成负责人处理。

## 6. 验证

- Dataset 后端 JavaScript 语法检查：通过。
- Frontend production build：通过。
- Backend production build：通过。
- IDE lint：无新增问题。
- 导入任务：通过，输出 1 个页面、15 个 Piece、0 个 published。
- 后端仍会输出 Starter 已知的 `two-column` Widget 警告；本域未修改该问题。

待后续人工浏览器验收：

- CMS Edit/Preview 中的 Piece relationship 顺序与图片编辑。
- 桌面和移动端视觉细节。
- 弹层键盘焦点与真实下载链接的浏览器行为。
- 英文 locale 尚未迁移。
