import { inlineTextField, stringField } from '../about-page/lib/aboutWidgetFields.js';
export default { extend: '@apostrophecms/widget-type', options: { label: '关于我们 · Hero' }, fields: { add: { eyebrow: inlineTextField('索引标签'), heading: inlineTextField('标题', 'h1'), lead: inlineTextField('引导文案'), cta: inlineTextField('按钮文字', 'span'), ctaHref: stringField('按钮链接', { required: true }) } } };
