export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Home Solutions'
  },
  fields: {
    add: {
      eyebrow: {
        type: 'string',
        label: 'Eyebrow',
        required: true,
        max: 60,
        def: 'Solution matrix'
      },
      titleLine1Zh: {
        type: 'string',
        label: 'Title Line 1 (Chinese)',
        required: true,
        max: 35,
        def: '从现实空间'
      },
      titleLine2Zh: {
        type: 'string',
        label: 'Title Line 2 (Chinese)',
        required: true,
        max: 35,
        def: '到智能世界'
      },
      titleLine1En: {
        type: 'string',
        label: 'Title Line 1 (English)',
        required: true,
        max: 45,
        def: 'From Real Spaces'
      },
      titleLine2En: {
        type: 'string',
        label: 'Title Line 2 (English)',
        required: true,
        max: 45,
        def: 'to Intelligent Worlds'
      },
      descriptionZh: {
        type: 'string',
        label: 'Description (Chinese)',
        required: true,
        textarea: true,
        max: 240
      },
      descriptionEn: {
        type: 'string',
        label: 'Description (English)',
        required: true,
        textarea: true,
        max: 360
      },
      previewVideoUrl: {
        type: 'url',
        label: 'Preview Video URL',
        required: true,
        help: 'Use an HTTPS MP4 or browser-compatible video URL.'
      },
      cardButtonLabelZh: {
        type: 'string',
        label: 'Card Button Label (Chinese)',
        required: true,
        max: 24,
        def: '了解更多'
      },
      cardButtonLabelEn: {
        type: 'string',
        label: 'Card Button Label (English)',
        required: true,
        max: 30,
        def: 'View More'
      },
      _products: {
        type: 'relationship',
        label: 'Products',
        withType: 'product',
        min: 1,
        max: 6,
        required: true
      }
    },
    group: {
      content: {
        label: 'Content',
        fields: [
          'eyebrow',
          'titleLine1Zh',
          'titleLine2Zh',
          'titleLine1En',
          'titleLine2En',
          'descriptionZh',
          'descriptionEn',
          'previewVideoUrl',
          'cardButtonLabelZh',
          'cardButtonLabelEn',
          '_products'
        ]
      }
    }
  }
};
