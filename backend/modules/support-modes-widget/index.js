export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Home Support Modes'
  },
  fields: {
    add: {
      eyebrow: {
        type: 'string',
        label: 'Eyebrow',
        required: true,
        max: 60,
        def: 'Support modes'
      },
      titleZh: {
        type: 'string',
        label: 'Title (Chinese)',
        required: true,
        max: 40,
        def: '支持模式'
      },
      titleEn: {
        type: 'string',
        label: 'Title (English)',
        required: true,
        max: 60,
        def: 'How Can We Help You?'
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
      dataSolutionsTitleZh: {
        type: 'string',
        label: 'Data Solutions Title (Chinese)',
        required: true,
        max: 40,
        def: '数据解决方案服务'
      },
      dataSolutionsTitleEn: {
        type: 'string',
        label: 'Data Solutions Title (English)',
        required: true,
        max: 60,
        def: 'Data Solutions Services'
      },
      _dataSolutionsImage: {
        type: 'relationship',
        label: 'Data Solutions Image',
        withType: '@apostrophecms/image',
        max: 1,
        required: true
      },
      dataSolutionsImageAltZh: {
        type: 'string',
        label: 'Data Solutions Image Alt (Chinese)',
        required: true,
        max: 100
      },
      dataSolutionsImageAltEn: {
        type: 'string',
        label: 'Data Solutions Image Alt (English)',
        required: true,
        max: 140
      },
      dataSolutionsButtonLabelZh: {
        type: 'string',
        label: 'Data Solutions Button Label (Chinese)',
        required: true,
        max: 24,
        def: '了解更多'
      },
      dataSolutionsButtonLabelEn: {
        type: 'string',
        label: 'Data Solutions Button Label (English)',
        required: true,
        max: 30,
        def: 'View More'
      },
      customProcessingTitleZh: {
        type: 'string',
        label: 'Custom Processing Title (Chinese)',
        required: true,
        max: 40,
        def: '定制化数据处理服务'
      },
      customProcessingTitleEn: {
        type: 'string',
        label: 'Custom Processing Title (English)',
        required: true,
        max: 70,
        def: 'Customized Data Processing Services'
      },
      _customProcessingImage: {
        type: 'relationship',
        label: 'Custom Processing Image',
        withType: '@apostrophecms/image',
        max: 1,
        required: true
      },
      customProcessingImageAltZh: {
        type: 'string',
        label: 'Custom Processing Image Alt (Chinese)',
        required: true,
        max: 100
      },
      customProcessingImageAltEn: {
        type: 'string',
        label: 'Custom Processing Image Alt (English)',
        required: true,
        max: 140
      },
      researchTitleZh: {
        type: 'string',
        label: 'Research Title (Chinese)',
        required: true,
        max: 40,
        def: '学术研究合作'
      },
      researchTitleEn: {
        type: 'string',
        label: 'Research Title (English)',
        required: true,
        max: 60,
        def: 'Academic Research Collaboration'
      },
      _researchImage: {
        type: 'relationship',
        label: 'Research Image',
        withType: '@apostrophecms/image',
        max: 1,
        required: true
      },
      researchImageAltZh: {
        type: 'string',
        label: 'Research Image Alt (Chinese)',
        required: true,
        max: 100
      },
      researchImageAltEn: {
        type: 'string',
        label: 'Research Image Alt (English)',
        required: true,
        max: 140
      },
      researchButtonLabelZh: {
        type: 'string',
        label: 'Research Button Label (Chinese)',
        required: true,
        max: 24,
        def: '了解更多'
      },
      researchButtonLabelEn: {
        type: 'string',
        label: 'Research Button Label (English)',
        required: true,
        max: 30,
        def: 'View More'
      },
      _researchPage: {
        type: 'relationship',
        label: 'Research Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      }
    },
    group: {
      heading: {
        label: 'Heading',
        fields: [
          'eyebrow',
          'titleZh',
          'titleEn',
          'descriptionZh',
          'descriptionEn'
        ]
      },
      dataSolutions: {
        label: 'Data Solutions',
        fields: [
          'dataSolutionsTitleZh',
          'dataSolutionsTitleEn',
          '_dataSolutionsImage',
          'dataSolutionsImageAltZh',
          'dataSolutionsImageAltEn',
          'dataSolutionsButtonLabelZh',
          'dataSolutionsButtonLabelEn'
        ]
      },
      customProcessing: {
        label: 'Custom Processing',
        fields: [
          'customProcessingTitleZh',
          'customProcessingTitleEn',
          '_customProcessingImage',
          'customProcessingImageAltZh',
          'customProcessingImageAltEn'
        ]
      },
      research: {
        label: 'Research',
        fields: [
          'researchTitleZh',
          'researchTitleEn',
          '_researchImage',
          'researchImageAltZh',
          'researchImageAltEn',
          'researchButtonLabelZh',
          'researchButtonLabelEn',
          '_researchPage'
        ]
      }
    }
  }
};
