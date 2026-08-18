# 公共 Footer 统一规则

## 最终决定

全站只使用一套公共 Footer：

- 公共路由 `frontend/src/pages/[...slug].astro` 统一渲染一次 `SiteFooter`。
- `frontend/src/components/SiteFooter.astro` 内部只输出一个正式 `<footer id="footer">`。
- 首页及其他 Page Template 只负责 `<main>` 内的页面内容，不得再次导入、复制或实现全站 Footer。

## 原站历史节点的处理

原站 `dby_vibe@eb1246e63ee01b5f03a6ea93dc122e65ef337e7c` 中存在以下历史 Footer 节点：

- `legacy-footer`
- `secondary-route-footer`
- `about-footer`
- `core-page-footer`
- `solution-detail-footer`

这些节点在原站带有 `aria-hidden="true"`，并被 CSS 设置为 `display: none`，不属于实际视觉页面。迁移时不要复制它们，也不要用 `height: 0` 保留它们。

## 各页面负责人的要求

1. 不修改或重复引入 `SiteFooter.astro`。
2. 不在自己的 Astro Template、React island 或页面组件中实现品牌导航、联系方式、备案信息、全站链接等 Footer 内容。
3. 页面末尾可以实现属于正文的 CTA、下一页导航或区块结束提示，但不得命名或表现为第二套全站 Footer。
4. 如果当前分支已经复制了上述历史 Footer，请直接删除，不要隐藏。
5. 如确需修改公共 Footer，先交由集成负责人处理，并通过独立公共提交同步。

## 直接同步文件

各迁移分支应使用同一份：

```text
frontend/src/components/SiteFooter.astro
```

不要手工重复修改。收到公共版本后直接替换本分支的同名文件。

## 最终集成检查

合并所有页面分支后，集成负责人必须执行：

```bash
rg -n "legacy-footer|secondary-route-footer|about-footer|core-page-footer|solution-detail-footer" frontend/src
```

处理目标：

- 删除所有历史 Footer 节点。
- 删除不再被引用的历史 Footer CSS。
- 确认每个 URL 只有一个可见的 `.site-footer`。
- 验证桌面端、移动端、中文与英文 locale。
- 验证 Footer 导航、联系方式、Dataset Products、备案信息和返回顶部功能。
