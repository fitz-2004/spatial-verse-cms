# 中英文 Localization 公共基线

## 架构

- 中文 `zh` 是默认 Locale，URL 不加前缀，例如 `/coohomcloud/solutions/aiagent`。
- 英文 `en` 是同一 Apostrophe 文档的 Localization，URL 使用 `/en`前缀，例如 `/en/coohomcloud/solutions/aiagent`。
- 中英文共用 Page Type、Widget、Piece、Astro Template 和 CSS，仅 CMS 内容、发布状态和 SEO 字段独立。
- 管理员在 Apostrophe 右上角切换 Locale，分别编辑中文和英文内容。

## 初始化英文内容

```bash
cd backend
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite \
node app site-localization:ensure-en
```

该任务会为以下内容创建缺失的 `en:draft` Localization：

- Home
- 5 个 Solution 页面
- Core Competency
- Research Archive 和 `research-paper`
- Dataset Library 和 `dataset-item`
- About

规则：

- 首次从 `zh:draft` 复制页面结构和内容，作为英文录入起点。
- 已存在的英文内容不会被重新运行任务覆盖。
- 唯一例外是 Apostrophe 首次启动自动建立的空英文 Home，任务会将它初始化。
- 复制得到的英文页面默认使用 `noindex-follow`，翻译和审校完成后再由编辑修改索引策略。
- 默认只建立草稿，不发布。

如果明确需要让未登录访客立即访问尚未翻译的英文占位页：

```bash
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite \
PUBLISH_EN_PLACEHOLDERS=1 \
node app site-localization:ensure-en
```

正式流程应优先在 English Locale 完成翻译、预览和审核，再从 CMS 发布。

## 迁移原站英文文案

原站 `dby_vibe` 的 `homepage/app/site-locale-copy.ts` 是旧客户端语言切换使用的完整中英文对照表。CMS 基线将该对照表保存在 `backend/modules/site-localization/lib/originalEnglishCopy.js`，通过任务写入真正的 Apostrophe English Localization：

```bash
cd backend
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite \
node app site-localization:translate-en
```

如需同时更新公开版本：

```bash
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite \
PUBLISH_EN_TRANSLATIONS=1 \
node app site-localization:translate-en
```

- 该任务会处理已批准的 Page、`research-paper` 和 `dataset-item`。
- 只有英文值仍与中文值完全相同时才会套用原站英文映射。
- 管理员已经独立修改过的英文值不会被覆盖。
- 运行后，英文数据仍存储在同一个 SQLite/Apostrophe 数据库中，不生成每页独立英文 JSON 文件。

## 不可违反的规则

- 不建立 `titleZh` / `titleEn` 这类双份字段。
- 不复制英文 Page Type 或 Astro Template。
- 不使用前端 DOM 字典替换 CMS 内容。
- 内部链接必须使用当前 Locale，英文页面不得硬编码跳回中文 URL。
- 英文页面发布前必须单独检查 SEO title、description、canonical、robots 和分享图。
