export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Home Hero'
  },
  fields: {
    add: {
      eyebrow: {
        type: 'string',
        label: 'Eyebrow',
        required: true,
        max: 60,
        def: 'Synthetic spatial intelligence'
      },
      titleLeadZh: {
        type: 'string',
        label: 'Title Lead (Chinese)',
        required: true,
        max: 30,
        def: '群核空间'
      },
      titleAccentZh: {
        type: 'string',
        label: 'Title Accent (Chinese)',
        required: true,
        max: 30,
        def: '智能平台'
      },
      titleLeadEn: {
        type: 'string',
        label: 'Title Lead (English)',
        required: true,
        max: 40,
        def: 'SpatialVerse'
      },
      titleAccentEn: {
        type: 'string',
        label: 'Title Accent (English)',
        required: true,
        max: 50,
        def: 'Intelligence Platform'
      },
      descriptionLeadZh: {
        type: 'string',
        label: 'Description Lead (Chinese)',
        required: true,
        max: 80,
        def: 'AI数据解决方案先行者。'
      },
      descriptionLeadEn: {
        type: 'string',
        label: 'Description Lead (English)',
        required: true,
        max: 120,
        def: 'Pioneer in AI Data Solutions.'
      },
      descriptionZh: {
        type: 'string',
        label: 'Description (Chinese)',
        required: true,
        textarea: true,
        max: 420
      },
      descriptionEn: {
        type: 'string',
        label: 'Description (English)',
        required: true,
        textarea: true,
        max: 700
      },
      videoUrl: {
        type: 'url',
        label: 'Background Video URL',
        help: 'Use an HTTPS MP4 or browser-compatible video URL.'
      },
      _desktopImage: {
        type: 'relationship',
        label: 'Desktop Fallback Image',
        withType: '@apostrophecms/image',
        max: 1
      },
      _mobileImage: {
        type: 'relationship',
        label: 'Mobile Fallback Image',
        withType: '@apostrophecms/image',
        max: 1
      },
      primaryButtonLabelZh: {
        type: 'string',
        label: 'Primary Button Label (Chinese)',
        required: true,
        max: 30,
        def: '探索解决方案'
      },
      primaryButtonLabelEn: {
        type: 'string',
        label: 'Primary Button Label (English)',
        required: true,
        max: 40,
        def: 'Explore Solutions'
      },
      primaryButtonUrl: {
        type: 'string',
        label: 'Primary Button URL',
        help: 'Use a site-relative path or fragment, for example #solutions.',
        required: true,
        max: 200,
        pattern: '^(?:/|#)[^\\s]*$',
        def: '#solutions'
      },
      secondaryButtonLabelZh: {
        type: 'string',
        label: 'Secondary Button Label (Chinese)',
        required: true,
        max: 30,
        def: '下载免费数据集'
      },
      secondaryButtonLabelEn: {
        type: 'string',
        label: 'Secondary Button Label (English)',
        required: true,
        max: 40,
        def: 'Download Free Dataset'
      },
      _secondaryButtonPage: {
        type: 'relationship',
        label: 'Secondary Button Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      }
    },
    group: {
      content: {
        label: 'Content',
        fields: [
          'eyebrow',
          'titleLeadZh',
          'titleAccentZh',
          'titleLeadEn',
          'titleAccentEn',
          'descriptionLeadZh',
          'descriptionLeadEn',
          'descriptionZh',
          'descriptionEn'
        ]
      },
      media: {
        label: 'Media',
        fields: [
          'videoUrl',
          '_desktopImage',
          '_mobileImage'
        ]
      },
      actions: {
        label: 'Actions',
        fields: [
          'primaryButtonLabelZh',
          'primaryButtonLabelEn',
          'primaryButtonUrl',
          'secondaryButtonLabelZh',
          'secondaryButtonLabelEn',
          '_secondaryButtonPage'
        ]
      }
    }
  }
};
