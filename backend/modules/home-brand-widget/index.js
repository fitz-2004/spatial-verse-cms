import { inlineTextField } from '../@apostrophecms/home-page/lib/homeWidgetFields.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: '首页 · 品牌开屏'
  },
  fields: {
    add: {
      kicker: inlineTextField('眉题'),
      heading: inlineTextField('主标题', 'h1'),
      descriptor: inlineTextField('品牌描述')
    }
  }
};
