export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Home Capabilities'
  },
  fields: {
    add: {
      eyebrow: {
        type: 'string',
        label: 'Eyebrow',
        required: true,
        max: 60,
        def: 'Core capabilities'
      },
      titleZh: {
        type: 'string',
        label: 'Title (Chinese)',
        required: true,
        max: 40,
        def: '核心能力'
      },
      titleEn: {
        type: 'string',
        label: 'Title (English)',
        required: true,
        max: 60,
        def: 'Our Capabilities'
      },
      descriptionZh: {
        type: 'string',
        label: 'Description (Chinese)',
        required: true,
        textarea: true,
        max: 260
      },
      descriptionEn: {
        type: 'string',
        label: 'Description (English)',
        required: true,
        textarea: true,
        max: 420
      },
      buttonLabelZh: {
        type: 'string',
        label: 'Button Label (Chinese)',
        required: true,
        max: 24,
        def: '了解更多'
      },
      buttonLabelEn: {
        type: 'string',
        label: 'Button Label (English)',
        required: true,
        max: 30,
        def: 'View More'
      },
      _buttonPage: {
        type: 'relationship',
        label: 'Button Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      },
      _capabilities: {
        type: 'relationship',
        label: 'Capabilities',
        withType: 'capability',
        min: 4,
        max: 4,
        required: true
      }
    },
    group: {
      content: {
        label: 'Content',
        fields: [
          'eyebrow',
          'titleZh',
          'titleEn',
          'descriptionZh',
          'descriptionEn',
          'buttonLabelZh',
          'buttonLabelEn',
          '_buttonPage',
          '_capabilities'
        ]
      }
    }
  }
};
