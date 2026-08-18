import {
  inlineTextField,
  stringField,
  videoField
} from '../@apostrophecms/home-page/lib/homeWidgetFields.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: '首页 · 核心能力'
  },
  fields: {
    add: {
      introEyebrow: inlineTextField('区块索引'),
      introHeading: inlineTextField('区块标题', 'h2'),
      introDescription: inlineTextField('区块描述'),
      capabilities: {
        type: 'array',
        label: '核心能力',
        min: 4,
        max: 4,
        help: '视觉固定为 4 项。稳定标识建立后不要修改。',
        fields: {
          add: {
            key: stringField('稳定标识', { required: true }),
            number: stringField('序号', { required: true }),
            label: stringField('英文标签', { required: true }),
            heading: inlineTextField('标题', 'h3'),
            description: inlineTextField('描述'),
            media: videoField('展示视频')
          }
        }
      }
    }
  }
};
