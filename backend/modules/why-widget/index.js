export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Home Why Spatial Verse'
  },
  fields: {
    add: {
      eyebrow: {
        type: 'string',
        label: 'Eyebrow',
        required: true,
        max: 60,
        def: 'Why Spatial Verse'
      },
      titleLine1Zh: {
        type: 'string',
        label: 'Title Line 1 (Chinese)',
        required: true,
        max: 30,
        def: '为什么'
      },
      titleLine2Zh: {
        type: 'string',
        label: 'Title Line 2 (Chinese)',
        required: true,
        max: 30,
        def: '选择我们？'
      },
      titleLine1En: {
        type: 'string',
        label: 'Title Line 1 (English)',
        required: true,
        max: 40,
        def: 'Why Choose'
      },
      titleLine2En: {
        type: 'string',
        label: 'Title Line 2 (English)',
        required: true,
        max: 40,
        def: 'SpatialVerse?'
      },
      descriptionZh: {
        type: 'string',
        label: 'Description (Chinese)',
        required: true,
        textarea: true,
        max: 500
      },
      descriptionEn: {
        type: 'string',
        label: 'Description (English)',
        required: true,
        textarea: true,
        max: 800
      },
      buttonLabelZh: {
        type: 'string',
        label: 'Button Label (Chinese)',
        required: true,
        max: 30,
        def: '探索更多学术成果'
      },
      buttonLabelEn: {
        type: 'string',
        label: 'Button Label (English)',
        required: true,
        max: 45,
        def: 'Explore More Academic Research'
      },
      _buttonPage: {
        type: 'relationship',
        label: 'Button Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      },
      metrics: {
        type: 'array',
        label: 'Metrics',
        min: 4,
        max: 4,
        required: true,
        titleField: 'labelZh',
        fields: {
          add: {
            value: {
              type: 'string',
              label: 'Value',
              required: true,
              max: 12
            },
            suffix: {
              type: 'string',
              label: 'Suffix',
              max: 5,
              def: '+'
            },
            labelZh: {
              type: 'string',
              label: 'Label (Chinese)',
              required: true,
              max: 30
            },
            labelEn: {
              type: 'string',
              label: 'Label (English)',
              required: true,
              max: 45
            }
          }
        }
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
          'buttonLabelZh',
          'buttonLabelEn',
          '_buttonPage'
        ]
      },
      statistics: {
        label: 'Statistics',
        fields: [
          'metrics'
        ]
      }
    }
  }
};
