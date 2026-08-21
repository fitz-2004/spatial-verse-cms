import {
  inlineTextField,
  stringField
} from '../@apostrophecms/home-page/lib/homeWidgetFields.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: '首页 · 支持模式'
  },
  fields: {
    add: {
      eyebrow: inlineTextField('区块索引'),
      heading: inlineTextField('标题', 'h2'),
      description: inlineTextField('描述'),
      platformLabel: stringField('卡片品牌名', { required: true }),
      linkLabel: stringField('卡片链接文字', { required: true }),
      linkHref: stringField('卡片链接地址', { required: true }),
      modes: {
        type: 'array',
        label: '模式列表',
        min: 3,
        max: 3,
        fields: {
          add: {
            heading: inlineTextField('标题', 'h3')
          }
        }
      }
    }
  }
};
