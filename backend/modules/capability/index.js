export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Capability',
    pluralLabel: 'Capabilities',
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
        label: 'Video URL',
        required: true,
        help: 'Use an HTTPS MP4 or browser-compatible video URL.'
      },
      _detailPage: {
        type: 'relationship',
        label: 'Detail Page',
        withType: '@apostrophecms/any-page-type',
        max: 1
      }
    },
    group: {
      basics: {
        label: 'Capability Content',
        fields: [
          'title',
          'displayTitleZh',
          'displayTitleEn',
          'descriptionZh',
          'descriptionEn',
          'videoUrl',
          '_detailPage'
        ]
      }
    }
  }
};
