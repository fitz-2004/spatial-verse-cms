import {
  inlineTextField,
  stringField
} from '../@apostrophecms/home-page/lib/homeWidgetFields.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: '首页 · 学术与技术支持'
  },
  fields: {
    add: {
      eyebrow: inlineTextField('区块索引'),
      heading: inlineTextField('标题', 'h2'),
      description: inlineTextField('描述'),
      linkLabel: stringField('链接文字', { required: true }),
      linkHref: stringField('链接地址', { required: true }),
      metrics: {
        type: 'array',
        label: '平台指标',
        min: 4,
        max: 4,
        fields: {
          add: {
            value: inlineTextField('数值', 'h3'),
            label: stringField('说明', { required: true })
          }
        }
      }
    }
  }
};
