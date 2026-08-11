export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Product',
    pluralLabel: 'Products',
    sort: {
      title: 1
    }
  },
  fields: {
    add: {
      displayTitleZh: {
        type: 'string',
        label: 'Display Title (Chinese)',
        required: true,
        max: 50
      },
      displayTitleEn: {
        type: 'string',
        label: 'Display Title (English)',
        required: true,
        max: 70
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
        max: 850
      },
      _detailPage: {
        type: 'relationship',
        label: 'Detail Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      }
    },
    group: {
      basics: {
        label: 'Product Content',
        fields: [
          'title',
          'displayTitleZh',
          'displayTitleEn',
          'descriptionZh',
          'descriptionEn',
          '_detailPage'
        ]
      }
    }
  }
};
