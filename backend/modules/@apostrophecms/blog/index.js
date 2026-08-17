export default {
  fields: {
    add: {
      main: {
        type: 'area',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {},
            '@apostrophecms/image': {},
            '@apostrophecms/video': {},
            'nested-layout': {}
          }
        }
      }
    },
    group: {
      basics: {
        fields: [ 'title', 'publishedAt', 'main' ]
      }
    }
  }
};