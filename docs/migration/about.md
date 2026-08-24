# About 迁移记录

## 1. 范围与来源

- 原站参考分支：`dby_vibe`
- 原站参考提交：`eb1246e63ee01b5f03a6ea93dc122e65ef337e7c`
- 中文 URL：`/coohomcloud/about`
- Page Type / Template：`about-page` / `AboutPage.astro`
- Piece：无。指标计数器是 React island，不建立 About Piece。
- 原站实现：`homepage/app/coohomcloud/about/page.tsx`
- 原站文案：`homepage/app/home-data.ts` 的 `about`
- 原站计数器：`homepage/app/metric-counter.tsx`

本域不包含 Dataset、Header、Footer、公共路由或其他页面域。原站 `about-footer` 属于已废弃的隐藏第二 Footer，按 `docs/migration/shared-footer.md` 不复制。

## 2. 内容模型

全部业务内容放在 `about-page` 自身 fields：

| 字段 | 类型 | 用途 |
|---|---|---|
| `hero` | object | 首屏 eyebrow、标题、简介、CTA、轨道节点与底部状态 |
| `story` | object | 平台起源标题、正文、服务领域数组 |
| `network` | object | 数据网络标题、正文、时间轴说明、门户链接数组 |
| `metrics` | object | 规模标题和指标数组（`value` + `label`） |
| `quote` | object | 客户反馈引用 |
| `cta` | object | 页尾联系引导 |
| `seo*` | 页面级 SEO | 公共 `SeoHead.astro` 输出 title、description、canonical、robots、OG、Twitter Card |

固定页面结构使用 Page fields + Astro Component，不使用 Widget，也不使用“固定单例 Area”例外。没有 `_gallery`：最新原站 About 页面及其直接组件没有引用独立图片。

门户链接使用已确认的小写业务 URL：`/coohomcloud/corecompetency`、`/coohomcloud/corecompetency/paper`、`/coohomcloud/corecompetency/data`。联系 CTA 指向公共 `#contact-drawer`。

## 3. 前端

- `AboutPage.astro` 只渲染 `<main>` 内的 About 区块，不输出 Header/Footer。
- `AboutMetrics.tsx` 以 `client:visible` 加载；`MetricCounter.tsx` 保留原站 1150ms 缓动计数和 `prefers-reduced-motion` 行为。
- CMS 数据由 Template 作为 props 传入 island。
- 样式只提取 About 实际规则到 `frontend/src/components/about/about-page.css`，保留网格、扫描线、轨道、时间轴等 CSS 图形。

## 4. 草稿导入

注册模块后运行：

```bash
cd backend
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app about-import:import-drafts
```

Windows PowerShell：

```powershell
$env:APOS_DB_URI='sqlite://data/spatial-verse-cms.sqlite'
node app about-import:import-drafts
```

任务约束：

- 使用稳定 slug `/coohomcloud/about`，重复导入更新同一份 `zh:draft`。
- 只创建或更新 1 个 About 中文草稿页面。
- 不创建 Piece、不发布、不清库、不修改 Dataset 或其他成员内容。
- 不导入 `original-media.about` 中的图片。这些条目只存在于媒体目录，未被最新 About 页面实际引用。

只读复核：

```powershell
node app about-import:verify-drafts
```

## 5. 文件与注册

- `backend/modules/about-page/index.js`
- `backend/modules/about-import/index.js`
- `backend/modules/about-import/lib/aboutData.js`
- `frontend/src/templates/AboutPage.astro`
- `frontend/src/components/about/AboutMetrics.tsx`
- `frontend/src/components/about/MetricCounter.tsx`
- `frontend/src/components/about/about-page.css`
- `docs/migration/about.md`

共享注册文件 `backend/app.js` 新增 `about-import`。该修改应按 `AGENTS.md` 单独 commit，便于集成负责人处理。`about-page` 的 Page Type 与 Astro 映射已在公共基线中存在。

## 6. 媒体清单

最新原站 About 没有实际引用独立图片。视觉来自 CSS 网格、扫描线、轨道和时间轴，不进入 CMS 媒体库。`original-media.ts` 的 `about` 分组和抓取 catalog 中带 `About` 标签的 URL 不是当前页面实现的一部分。

## 7. 验证

- Frontend production build：通过。
- Backend production build：通过。
- `git diff --check`：通过。
- 后端仍会输出 Starter 已知的 `two-column` Widget 警告；本域未修改该问题。

待人工浏览器验收：

- 桌面端和移动端 About 区块顺序、轨道动画、指标计数和门户 hover。
- 联系 CTA 打开公共 Contact Drawer。
- CMS Edit/Preview 中的页面字段。
- 英文 locale 尚未迁移。

## 8. 已知差异

- 原站 About 页内 Header/Footer 由公共层承担，不在本 Template 重复。
- 原站门户曾使用大小写混合 URL；本域使用已确认的小写路径。
