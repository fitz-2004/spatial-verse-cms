// 从 Apostrophe area 字段提取纯文本的工具。
// area 字段（rich-text widget）支持前台点击编辑；当需要把 area 内容
// 作为纯文本传给 React island、aria 属性或 key 时使用本工具。
export function areaText(value) {
  if (!value) {
    return '';
  }
  if (value.metaType === 'area') {
    return (value.items || [])
      .map((widget) => (widget && widget.content) || '')
      .join(' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return typeof value === 'string' ? value : '';
}