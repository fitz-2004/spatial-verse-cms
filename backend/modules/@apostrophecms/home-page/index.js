export default {
  options: {
    label: 'Home Page'
  },
  fields: {
    add: {
      seoTitle: {
        type: 'string',
        label: 'SEO Title (Chinese)',
        max: 70
      },
      seoTitleEn: {
        type: 'string',
        label: 'SEO Title (English)',
        max: 70
      },
      seoDescription: {
        type: 'string',
        label: 'SEO Description (Chinese)',
        textarea: true,
        max: 160
      },
      seoDescriptionEn: {
        type: 'string',
        label: 'SEO Description (English)',
        textarea: true,
        max: 160
      },
      hero: {
        type: 'area',
        label: 'Hero',
        max: 1,
        options: {
          max: 1,
          widgets: {
            hero: {}
          }
        }
      },
      why: {
        type: 'area',
        label: 'Why Spatial Verse',
        max: 1,
        options: {
          max: 1,
          widgets: {
            why: {}
          }
        }
      },
      solutions: {
        type: 'area',
        label: 'Solutions',
        max: 1,
        options: {
          max: 1,
          widgets: {
            solutions: {}
          }
        }
      },
      capabilities: {
        type: 'area',
        label: 'Capabilities',
        max: 1,
        options: {
          max: 1,
          widgets: {
            capabilities: {}
          }
        }
      },
      supportModes: {
        type: 'area',
        label: 'Support Modes',
        max: 1,
        options: {
          max: 1,
          widgets: {
            'support-modes': {}
          }
        }
      },
      contact: {
        type: 'area',
        label: 'Contact',
        max: 1,
        options: {
          max: 1,
          widgets: {
            contact: {}
          }
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'seoTitle',
          'seoTitleEn',
          'seoDescription',
          'seoDescriptionEn'
        ]
      },
      sections: {
        label: 'Home Sections',
        fields: [
          'hero',
          'why',
          'solutions',
          'capabilities',
          'supportModes',
          'contact'
        ]
      }
    }
  }
};
