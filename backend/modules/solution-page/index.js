export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Solution Page'
  },
  fields: {
    add: {
      englishTitle: {
        type: 'string',
        label: 'English Title',
        help: 'Uppercase English label shown in the hero (e.g. "AI AGENT UNDERSTANDING")',
        required: true
      },
      sequence: {
        type: 'integer',
        label: 'Visual Sequence',
        help: 'Position number (1-5) displayed in the visual engine core',
        def: 1,
        min: 1,
        max: 5
      },
      accent: {
        type: 'string',
        label: 'Accent Color (hex)',
        help: 'Primary accent color, e.g. #29f5d1 for AI Agent, #9d7cff for AIGC',
        def: '#29f5d1'
      },
      heroTitle: {
        type: 'area',
        label: 'Hero Subtitle',
        help: 'Accent-colored subtitle beneath the page title (click to edit in context)',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      heroLead: {
        type: 'area',
        label: 'Hero Description',
        help: 'Hero lead paragraph (click to edit in context)',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      media: {
        type: 'attachment',
        label: 'Hero Media (video or image)',
        help: 'Auto-playing video or image displayed in the media section. MP4/MOV renders as video, others as image.',
        group: 'all'
      },
      videoDescription: {
        type: 'area',
        label: 'Media Section Description',
        help: 'Text description beside the media frame (click to edit in context)',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      challengeTitle: {
        type: 'area',
        label: 'Challenges Section Title',
        help: 'Click to edit in context',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      challenges: {
        type: 'array',
        label: 'Challenges',
        titleField: 'title',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Title',
              required: true
            },
            text: {
              type: 'string',
              label: 'Description',
              textarea: true,
              required: true
            }
          }
        }
      },
      advantageTitle: {
        type: 'area',
        label: 'Advantages Section Title',
        help: 'Click to edit in context',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      advantages: {
        type: 'array',
        label: 'Advantages',
        titleField: 'title',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Title',
              required: true
            },
            text: {
              type: 'string',
              label: 'Description',
              textarea: true,
              required: true
            }
          }
        }
      },
      serviceTitle: {
        type: 'area',
        label: 'Services Section Title',
        help: 'Click to edit in context',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      services: {
        type: 'array',
        label: 'Services',
        titleField: 'title',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Title',
              required: true
            },
            text: {
              type: 'string',
              label: 'Description',
              textarea: true,
              required: true
            }
          }
        }
      },
      ctaTitle: {
        type: 'area',
        label: 'CTA Title',
        help: 'Large heading above the contact button (click to edit in context)',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          },
          max: 1
        }
      },
      seoTitle: {
        type: 'string',
        label: 'SEO Title',
        help: 'Browser tab title and search engine title tag',
        def: 'SpatialVerse'
      },
      seoDescription: {
        type: 'string',
        label: 'SEO Description',
        textarea: true,
        help: 'Page meta description for search engines',
        def: '空间智能解决方案'
      },
      ogImage: {
        type: 'attachment',
        label: 'Social Share Image',
        help: 'Image shown when sharing on social media (1200x630 recommended)',
        group: 'images'
      }
    },
    group: {
      hero: {
        label: 'Hero',
        fields: [ 'englishTitle', 'sequence', 'accent', 'heroTitle', 'heroLead' ]
      },
      media: {
        label: 'Media',
        fields: [ 'media', 'videoDescription' ]
      },
      challenges: {
        label: 'Challenges',
        fields: [ 'challengeTitle', 'challenges' ]
      },
      advantages: {
        label: 'Advantages',
        fields: [ 'advantageTitle', 'advantages' ]
      },
      services: {
        label: 'Services',
        fields: [ 'serviceTitle', 'services' ]
      },
      cta: {
        label: 'CTA',
        fields: [ 'ctaTitle' ]
      },
      seo: {
        label: 'SEO',
        fields: [ 'seoTitle', 'seoDescription', 'ogImage' ]
      }
    }
  }
};