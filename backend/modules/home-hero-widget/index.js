import {
  inlineTextField,
  stringField
} from '../@apostrophecms/home-page/lib/homeWidgetFields.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: '首页 · Hero'
  },
  fields: {
    add: {
      eyebrow: inlineTextField('眉题'),
      heading: inlineTextField('主标题', 'h2'),
      description: inlineTextField('描述'),
      primaryCtaLabel: stringField('主按钮文字', { required: true }),
      primaryCtaTarget: stringField('主按钮页内目标 ID', {
        required: true,
        help: '例如 solutions。不要填写 #。'
      }),
      secondaryCtaLabel: stringField('次按钮文字', { required: true }),
      secondaryCtaHref: stringField('次按钮链接', { required: true })
    }
  }
};
