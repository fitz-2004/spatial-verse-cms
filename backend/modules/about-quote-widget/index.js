import { inlineTextField } from '../about-page/lib/aboutWidgetFields.js';
export default { extend: '@apostrophecms/widget-type', options: { label: '关于我们 · 用户反馈' }, fields: { add: { eyebrow: inlineTextField('索引标签'), quote: inlineTextField('引述', 'blockquote'), name: inlineTextField('姓名', 'strong'), organization: inlineTextField('机构', 'span') } } };
