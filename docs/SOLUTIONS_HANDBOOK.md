# Solution 页面使用手册

> 适用于 `spatial-verse-cms` 中 5 个 Solution 详情页（`aiagent` / `aigc` / `roboticsimulation` / `visualizedproductpromotion` / `xr`）。
> 内容模型定义在 [`backend/modules/solution-page/index.js`](file:///Users/administrator/Documents/spatial-verse/spatial-verse-cms/backend/modules/solution-page/index.js)；前端组件在 `frontend/src/components/solution/`；页面模板在 [`frontend/src/templates/SolutionPage.astro`](file:///Users/administrator/Documents/spatial-verse/spatial-verse-cms/frontend/src/templates/SolutionPage.astro)。

---

## 1. 页面整体结构（自上而下 5 段）

| 段 | 编号 | section-index 文案（写死） | 组件 |
| --- | --- | --- | --- |
| Hero | 01 | `01 / SOLUTIONS / <englishTitle>` | `SolutionHero.astro` |
| 视频/媒体 | 02 | `02 / LIVE DATA SIGNAL` | `SolutionVideoSection.astro` |
| 行业挑战 | 02 | `02 / INDUSTRY CHALLENGE` | `SolutionChallenges.astro` |
| 方案优势 | 03 | `03 / SOLUTION ADVANTAGE` | `SolutionAdvantages.astro` |
| 服务能力 | 04 | `04 / SERVICE CAPABILITY` | `SolutionServices.astro` |
| 行动召唤 | 05 | `05 / NEXT CONNECTION` | `SolutionCTA.astro` |

> 注：02 同时出现在视频段和挑战段。原站设计如此，没有合并；如有需要再调 `section-index` 文案。

---

## 2. 字段类型速查（哪些能改、哪些不能改）

字段分四种类型，**编辑能力完全不同**：

| 类型 | 字段 | 编辑方式 |
| --- | --- | --- |
| `string`（单行文本） | `englishTitle` / `sequence` / `accent` / `seoTitle` / `seoDescription` | 编辑器侧栏表单输入，**不能在页面上点哪改哪** |
| `area`（富文本块，page-level 字段） | `heroTitle` / `heroLead` / `videoDescription` / `challengeTitle` / `advantageTitle` / `serviceTitle` / `ctaTitle` | **可以原位编辑**：登录后点击内容直接出铅笔图标 |
| `array`（对象数组） | `challenges` / `advantages` / `services` | 编辑器侧栏添加/删除/排序条目；条目内的 `title` / `text` 不能原位编辑 |
| `attachment`（文件） | `media`（视频/图片）/ `ogImage`（社交分享图） | 编辑器侧栏上传；前台只展示 |

> 简单记忆：**section 标题、Hero 副标题/描述、视频旁描述、CTA 标题** 这 7 处可原位点哪改哪；**卡片里的标题和描述、英文标签、序号、颜色、SEO** 只能在侧栏表单改。

---

## 3. 哪些是写死的（编辑器也改不了）

为对齐原站设计，以下文本是**组件里硬编码**的，不要期望改 CMS 字段就能改：

- 5 段 section-index（`01 / SOLUTIONS / ...`、`02 / LIVE DATA SIGNAL`、`02 / INDUSTRY CHALLENGE`、`03 / SOLUTION ADVANTAGE`、`04 / SERVICE CAPABILITY`、`05 / NEXT CONNECTION`）—— 写在各组件模板里
- Hero 底部的 `01 / 05` 滚动提示 —— 写在 [`SolutionHero.astro`](file:///Users/administrator/Documents/spatial-verse/spatial-verse-cms/frontend/src/components/solution/SolutionHero.astro)
- 视频旁描述的 fallback 文本 `首页解决方案中的对应视频已同步到本页面，用于展示该方向的数据生成、空间理解与应用状态。` —— 写在 [`SolutionVideoSection.astro`](file:///Users/administrator/Documents/spatial-verse/spatial-verse-cms/frontend/src/components/solution/SolutionVideoSection.astro)
- CTA 标题 fallback `让下一组数据进入真实应用。` —— 写在 [`SolutionPage.astro`](file:///Users/administrator/Documents/spatial-verse/spatial-verse-cms/frontend/src/templates/SolutionPage.astro)
- 卡片编号、按钮文案 `REQUEST A DEMO` 等 —— 硬编码

> 改这些需要程序员改组件源码 + 重新部署前端。

---

## 4. 字段分组（编辑器侧栏顺序）

`fields.group` 把字段分成 6 个组，**侧栏会按这个顺序显示**：

1. **Hero**：`englishTitle` / `sequence` / `accent` / `heroTitle` / `heroLead`
2. **Media**：`media` / `videoDescription`
3. **Challenges**：`challengeTitle` / `challenges`
4. **Advantages**：`advantageTitle` / `advantages`
5. **Services**：`serviceTitle` / `services`
6. **CTA**：`ctaTitle`
7. **SEO**：`seoTitle` / `seoDescription` / `ogImage`

---

## 5. 原位编辑（In-Context Editing）怎么用

只在**编辑者登录**且**前台 run 模式**下生效（admin 界面不会出铅笔图标）。

1. 浏览器打开 http://localhost:4321/coohomcloud/solutions/aiagent 等
2. 鼠标悬停或点击任意 `area` 字段（见第 2 节表格）
3. 出现淡蓝边框 + 浮动工具栏：可加粗、列表、链接、改字号等基础富文本操作
4. `Ctrl/Cmd+S` 或点工具栏的 ✓ 保存；`Esc` 取消
5. **不能原位编辑的字段**（string / array 卡片内 / 硬编码文本）需要去 admin 侧栏或组件里改

> 没看到铅笔？检查是否登录、是否在 run 模式（admin 不会渲染 in-context UI）、浏览器是否缓存了登出态（硬刷新会清掉登录）。

---

## 6. 主题色（accent）怎么选

| 页面 | 主题色 |
| --- | --- |
| aiagent | `#29f5d1` 薄荷青 |
| aigc | `#9d7cff` 紫 |
| roboticsimulation | `#b8ff6b` 酸绿 |
| visualizedproductpromotion | `#ff7ab6` 粉 |
| xr | `#6cc8ff` 蓝 |

> 主题色会同时影响：Hero 副标题颜色、Hero 渐变光斑、媒体段左侧指示线。改 `accent` 字段后立即生效（不需要重启后端）。

---

## 7. 媒体上传（视频/图片）规范

- **位置**：编辑器侧栏 `Media` 组 → `Hero Media (video or image)`
- **支持格式**：`.mp4 .mov .webm .m4v .avi .mkv`（视频） / `.jpg .png .webp`（图片）
- **大小**：建议 ≤ 50 MB（自动播放，太大会卡）
- **上传到**：必须通过侧栏字段上传，或先去 Files 库（http://localhost:4321/login → Files）；直接拖到 Media 库不会被引用
- **MP4/MOV** 渲染为带控件的视频，**其它**（包括 webm）作为 `<img>` 静态图
- **后端启动方式**（必须）：`APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite npm run dev`，否则 MongoDB 连不上

---

## 8. 设计与样式注意事项

- **配色变量**：在 [`frontend/src/styles/solution.css`](file:///Users/administrator/Documents/spatial-verse/spatial-verse-cms/frontend/src/styles/solution.css) 顶部 L8-28 强制覆盖了 `--cyan / --purple / --acid / --pink / --ink / --muted / --subtle / --line / --void / --surface`，确保与原站"Frontier minimal sci-fi"系统一致
- **作用域**：所有 solution 样式都套在 `.solution-detail-page` 下面，**不会污染** header / footer / 公共页
- **页脚**：统一使用 [`SiteFooter.astro`](file:///Users/administrator/Documents/spatial-verse/spatial-verse-cms/frontend/src/components/site/SiteFooter.astro)，**不要**在 solution 模板里写自定义 footer
- **按钮样式**：透明描边 + 底部脉冲流动线，hover 时 `gap: 18px → 28px`、颜色 → 浅白；**不要**改成实心（会破坏原站风格）
- **眉题（section-index）**：薄荷绿 `var(--cyan)`、16px、字重 350、字距 0.2em，全大写
- **不要改写**：section-index 文案 / 段编号（02 同时在两段）/ `01 / 05` 滚动提示 / CTA 按钮文案 `REQUEST A DEMO` —— 这些是设计骨架

---

## 9. URL 与 SEO

- 路径格式：`/coohomcloud/solutions/<slug>`，slug 全部小写（`aiagent` 不是 `AIAgent`）
- 必须是 **Home 页面**的子页，**不是** Coohomcloud 页面下（注意：解决方案子页 ≠ 产品子页的位置）
- **保存为草稿**（不要直接 Publish），等所有字段填完 + 视频上传完再发布
- SEO 三件套：
  - `seoTitle`：`{Label} - Solutions - CoohomCloud` 格式
  - `seoDescription`：60-160 字符，含关键词
  - `ogImage`：1200×630 PNG/JPG

---

## 10. 数据与发布流程

- **本地数据**：SQLite `backend/data/spatial-verse-cms.sqlite`，**不入 git**（已在 .gitignore）
- **新建一页**流程：
  1. admin → Pages → Home → New Page → Solution Page
  2. 填 English Title（必填）/ Accent / Visual Sequence
  3. 上传媒体（视频）
  4. 填 7 个 area 字段（标题/副标题/描述/CTA）
  5. 填 3 个 array（每段至少 3 条）
  6. 填 SEO
  7. **Save Draft**（先草稿）→ 验证前端 → 再 Publish
- **数据迁移**：Apostrophe 自带 export/import；不要直接拷贝 SQLite 文件
- **视频文件**：放 `homepage/public/media/spatialverse/original/`，但引用走 CMS 的 `media` 字段（不要在模板里写死路径）

---

## 11. 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 视频上传报"unsupported" | 后端 `addFileGroups` 未配视频组 | 检查 `backend/app.js` 是否有 `addFileGroups` 注册 |
| 看不到铅笔图标 | 未登录 / 在 admin 模式 / 浏览器缓存 | 硬刷新 + 重新登 run 模式 |
| 改了副标题没变白字 | `accent` 字段为空 | 填 `#29f5d1` 等 |
| 改字段后没生效 | Astro 没热更新 | 保存一次，浏览器再硬刷新 |
| 页面 404 | slug 拼写/大小写错 | 必须小写：`aiagent` 不是 `AIAgent` |
| MongoDB 连不上 | 没用 SQLite 启动 | 改用 `APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite npm run dev` |

---

## 12. 改模型的代价评估

- **加一个 area 字段**（比如"团队介绍"）：改 `solution-page/index.js` + 改模板 + 重启后端 + 跑迁移 → 5 个文件级别
- **加一个 array 段**（比如"客户案例"）：同上 + 写新组件 + 加 CSS → 半天的活
- **换页脚**：1 行（[SiteFooter.astro](file:///Users/administrator/Documents/spatial-verse/spatial-verse-cms/frontend/src/components/site/SiteFooter.astro) 是公共的，改完所有 solution 都生效）
- **换主题色**：改 `accent` 字段即可，**不用动代码**
- **换视频**：改 `media` 字段，**不用动代码**

---

**最后更新**：2026-08-19 · 5 页全部就绪 + 视觉与原站一致（35/35 项验证通过）
