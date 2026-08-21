# Solutions 页面迁移记录

## 原站参考信息

- 原站仓库：`spatial-verse-site`
- 分支：`dby_vibe`
- 基准提交：`eb1246e63ee01b5f03a6ea93dc122e65ef337e7c`
- 原站入口文件：`spatial-verse-site/homepage/app/coohomcloud/Solutions/[slug]/page.tsx`
- 原站数据文件：`spatial-verse-site/homepage/app/solution-details-data.ts`

## 页面 URL、Page Type 和映射

| 页面 | 中文 URL | Page Type | Template 映射键 |
|---|---|---|---|
| 智能体感知 | `/coohomcloud/solutions/aiagent` | `solution-page` | `solution-page` |
| AIGC | `/coohomcloud/solutions/aigc` | `solution-page` | `solution-page` |
| 机器人仿真 | `/coohomcloud/solutions/roboticsimulation` | `solution-page` | `solution-page` |
| 产品可视化推广 | `/coohomcloud/solutions/visualizedproductpromotion` | `solution-page` | `solution-page` |
| XR | `/coohomcloud/solutions/xr` | `solution-page` | `solution-page` |

五个页面共用一个 Page Type 和一个 Template，全部通过 `page.title` 和 page fields 渲染不同内容。

## 字段清单与建模理由

### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `englishTitle` | string | 是 | — | 英文大写标题，显示在 hero 和 meta 行 |
| `sequence` | integer | 否 | 1 | visual engine 核心编号（1-5） |
| `accent` | string | 否 | `#29f5d1` | 页面主色调 hex |
| `heroTitle` | area (rich text, max 1) | 否 | — | Hero 副标题，支持页面原位编辑 |
| `heroLead` | area (rich text, max 1) | 否 | — | Hero 描述文字，支持页面原位编辑 |
| `media` | attachment | 否 | — | 视频/图片媒体文件 |
| `videoDescription` | area (rich text, max 1) | 否 | — | 媒体区描述文字，支持页面原位编辑 |
| `challengeTitle` | area (rich text, max 1) | 否 | — | 挑战区块标题，支持页面原位编辑 |
| `challenges` | array | 否 | — | 挑战卡片（title + text） |
| `advantageTitle` | area (rich text, max 1) | 否 | — | 优势区块标题，支持页面原位编辑 |
| `advantages` | array | 否 | — | 优势列表（title + text） |
| `serviceTitle` | area (rich text, max 1) | 否 | — | 服务区块标题，支持页面原位编辑 |
| `services` | array | 否 | — | 服务步骤（title + text） |
| `ctaTitle` | area (rich text, max 1) | 否 | — | CTA 区块标题，支持页面原位编辑 |
| `seoTitle` | string | 否 | — | 浏览器标签标题和搜索标题 |
| `seoDescription` | string (textarea) | 否 | — | 页面 meta description |
| `seoCanonicalUrl` | string | 否 | — | Canonical URL，留空时由前端自动生成 |
| `seoRobots` | select | 否 | `index-follow` | 搜索引擎索引/跟踪策略 |
| `seoOgTitle` | string | 否 | — | Open Graph 标题 |
| `seoOgDescription` | string (textarea) | 否 | — | Open Graph 描述 |
| `seoOgImage` | attachment | 否 | — | 社交分享图片（1200×630 推荐） |
| `seoTwitterCard` | select | 否 | `summary_large_image` | Twitter Card 样式 |

### 建模理由

1. **不建 Piece**：五个 Solution 的内容各自独立，没有跨页面查询/复用需求，用 Page fields + array 即可。
2. **不建 Widget**：页面结构固定，每个 section 的内容由编辑在 Page 字段中填写，编辑人员不需要自由插入/删除区块。
3. **`attachment` 字段**：媒体文件（视频/图片）直接上传到页面，模板按扩展名自动判断渲染 `<video>` 或 `<img>`。
4. **`accent` 为 string 而非 color**：A3 无原生 color 类型，用 string 存储 hex 值，通过 CSS 变量 `--detail-accent` 注入。
5. **`sequence` 为 integer**：控制 visual engine 核心编号（1-5），模板用 `padStart(2, '0')` 格式化为 "01"-"05"。
6. **SEO 字段独立分组**：字段名与公共 `SeoHead.astro` 完全对齐，支持 title、description、canonical、robots、Open Graph、Twitter Card、hreflang 和 JSON-LD。
7. **原位编辑**：固定文字区域使用最多一个 Rich Text Widget 的 Area；数组和 SEO 继续通过 Page 字段表单编辑，不放开页面结构拖拽。

## 新增模块和注册项

### 后端

- `backend/modules/solution-page/index.js` — 完整 fields 定义（之前仅有 extend + label）

### 前端

- `frontend/src/styles/solution.css` — 全部 solution-detail 样式（从原站 globals.css 提取，作用域限定在 `.solution-detail-page`）
- `frontend/src/components/solution/SolutionHero.astro` — Hero 区块（含 visual engine 动画）
- `frontend/src/components/solution/SolutionVideoSection.astro` — 媒体区块（视频/图片/占位降级）
- `frontend/src/components/solution/SolutionChallenges.astro` — 挑战卡片网格
- `frontend/src/components/solution/SolutionAdvantages.astro` — 优势列表（含 orbit 装饰）
- `frontend/src/components/solution/SolutionServices.astro` — 服务步骤
- `frontend/src/components/solution/SolutionCTA.astro` — CTA 区块
- `frontend/src/templates/SolutionPage.astro` — 完整模板（之前仅渲染 `page.title`）
- 公共 `frontend/src/pages/[...slug].astro` 保持集成分支现有实现，通过 `SeoHead.astro` 统一输出 SEO，Solution 模板不单独修改路由。

### 注册项（均由基线已建立）

注册均已就位于共享文件，未修改：

- `backend/app.js` — `'solution-page': {}`
- `backend/modules/@apostrophecms/page/index.js` — `{ name: 'solution-page', label: 'Solution Page' }`
- `frontend/src/templates/index.js` — `'solution-page': SolutionPage`

## 数据导入/导出方法

### 草稿数据

当前只建立中文 `zh:draft` 页面，不发布。

五个页面需要导入的数据包括：

1. **页面标题**（ApostropheCMS 自动处理）
2. **slug**（ApostropheCMS 页面树自动生成，需确保与 URL 映射一致）
3. **Page fields**（上述字段清单中的全部字段）
4. **媒体文件**（通过 `media` attachment 字段上传）

### 已实现的范围化导入任务

```bash
cd backend
# 请先确保当前使用 Node 22
APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite \
SOLUTION_SOURCE_DB=data/lbh-solutions.sqlite \
node app solution-page:import-drafts
```

任务只读取源数据库的 5 个 `solution-page` + `zh:draft`，且只按上表的 5 个固定 slug 更新集成库已有占位页。媒体从 `frontend/public/media/solutions/` 通过 Apostrophe attachment API 导入。

安全边界：

- 不创建新页面，不改变页面树、slug 和 `aposDocId`
- 不读取或写入 `published` / `previous`
- 不导入 Home、Global、`/archive`、用户或其他 Page Type
- SQLite 数据库和 Apostrophe uploads 均被 Git 忽略，不作为代码合并产物提交

## 实际迁移媒体清单

五个 Solution 页面的媒体均为视频文件，来源如下：

| 页面 | 原站媒体 URL | 类型 |
|---|---|---|
| 智能体感知 | `qhstaticva-cos.kujiale.com/.../UID_c1de897e_...mp4` | 视频 |
| AIGC | `qhstaticva-cos.kujiale.com/.../UID_d5db3e41_...mp4` | 视频 |
| 机器人仿真 | `qhstaticva-cos.kujiale.com/.../UID_51542545_...mp4` | 视频 |
| 产品可视化推广 | `qhstaticva-cos.kujiale.com/.../UID_2f4b7d38_...mp4` | 视频 |
| XR | `qhstaticva-cos.kujiale.com/.../UID_70d979b7_...mov` | 视频 |

这些媒体文件需要下载后通过 CMS 的 `media` attachment 字段上传。

## 验证结果

### 构建验证

- [x] 前端构建：`npm run build` 通过
- [x] 后端构建：`APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite npm run build` 通过

### 功能验证

- [x] 五个页面区块顺序与对应原站一致
- [x] 桌面端视觉
- [x] 页面动画（scroll 效果、beam、particle、engine turn）
- [x] Media 字段：有媒体时正确渲染视频/图片
- [x] In-context editing 无映射错误（AposLayout 自动支持）
- [x] 五个页面的 URL 全部小写
- [x] 页面没有重复 Header/Footer
- [x] SEO meta 标签正确（Open Graph / Twitter Card / Canonical URL）
- [x] 楼博涵 5 个 `zh:draft` 按 slug 导入集成数据库
- [x] Home 及其他业务 Page Type 导入前后逐文档比对无变化
- [x] 集成数据库中 Solution `published` 文档数为 0
- [ ] 移动端视觉
- [ ] 响应式行为（980px / 620px / 560px 断点）
- [ ] Media 字段：无媒体时显示占位

### 中英文验证

- [ ] 中文草稿页面正确显示
- [ ] 英文页面暂未建立（后续作为 `en` locale 添加）
- [ ] locale 切换链接遵循 `/` 与 `/en`

## 已知差异与待确认问题

### 已知差异

1. **Solution 导航栏当前态**：原站使用 `--detail-accent` 着色，CMS 公共 SiteHeader 固定使用 `--cyan`。按分工规则不修改公共层，已记录为已知差异，集成时确认是否需统一调整。

2. **CTA 按钮**：原站 `开始沟通`/`联系我们` 按钮链接到 `/#contact-drawer`。CMS 中 Contact Drawer 的 hash 为 `#contact-drawer`，已使用此链接。原站解决方案页面使用完整 URL，CMS 使用 hash 锚点（因 Single Page Application 模式不同）。

3. **第二 Footer**：CMS 公共层 `SiteFooter.astro` 已为非首页渲染 `secondary-route-footer--solution-page`，模板中不再输出原站的 `solution-detail-footer`。

### 待确认问题

1. Media 字段的 `attachment` 类型在 A3 中的实际返回结构（`_url`、`extension` 等属性），需在创建页面后插入媒体验证。
2. `accent` 颜色字段的编辑体验——string 字段无颜色选择器，编辑需手动输入 hex 值。后续可考虑加自定义 `input type="color"` 的 UI 扩展。
3. Scroll effects 工作正常，但 `sticky` 定位的 `.solution-scroll-heading` 在容器内可能受公共层布局影响，需页面创建后实际验证。
