import {
  inlineTextField,
  stringField,
  videoField
} from '../@apostrophecms/home-page/lib/homeWidgetFields.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: '首页 · 解决方案任务链'
  },
  fields: {
    add: {
      introEyebrow: inlineTextField('区块索引'),
      introHeading: inlineTextField('区块标题', 'h2'),
      introDescription: inlineTextField('区块描述'),
      missionTitle: stringField('任务链底部标题', { required: true }),
      coreTop: stringField('核心上行', { required: true }),
      coreBottom: stringField('核心下行', { required: true }),
      solutions: {
        type: 'array',
        label: '解决方案',
        min: 5,
        max: 5,
        help: '视觉固定为 5 项。稳定标识建立后不要修改。',
        fields: {
          add: {
            key: stringField('稳定标识', { required: true }),
            slug: stringField('解决方案 slug', { required: true }),
            heading: inlineTextField('标题', 'h2'),
            description: inlineTextField('详细描述'),
            stageLabel: stringField('英文阶段名', { required: true }),
            stageSignal: stringField('活跃信号文字', { required: true }),
            stageStatus: stringField('在线状态', { required: true }),
            stageInsight: inlineTextField('核心洞察'),
            media: videoField('展示视频')
          }
        }
      }
    }
  }
};
