export const inlineTextField = (label, tag = 'p') => ({
  type: 'area',
  label,
  max: 1,
  options: {
    max: 1,
    widgets: {
      '@apostrophecms/rich-text': {
        toolbar: [ 'bold', 'italic', 'link' ],
        styles: [
          {
            tag,
            label
          }
        ]
      }
    }
  },
  def: [ '@apostrophecms/rich-text' ]
});

export const stringField = (label, options = {}) => ({
  type: 'string',
  label,
  ...options
});

export const textField = (label, options = {}) => stringField(label, {
  textarea: true,
  ...options
});

export const videoField = (label) => ({
  type: 'attachment',
  label,
  fileGroup: 'videos',
  help: '上传 MP4、MOV 或 WebM 视频。留空时前端使用随代码交付的原站备用媒体。'
});
