export const inlineTextField = (label, tag = 'p') => ({
  type: 'area', label, max: 1,
  options: { max: 1, widgets: { '@apostrophecms/rich-text': { toolbar: ['bold', 'italic', 'link'], insert: [], styles: [{ tag, label }] } } },
  def: ['@apostrophecms/rich-text']
});
export const stringField = (label, options = {}) => ({ type: 'string', label, ...options });
