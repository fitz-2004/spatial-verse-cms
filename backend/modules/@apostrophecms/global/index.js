const linkFields = () => ({
  label: {
    type: 'string',
    label: 'Label',
    required: true
  },
  _page: {
    type: 'relationship',
    label: 'Internal Page',
    withType: '@apostrophecms/any-page-type',
    max: 1,
    help: 'Preferred for internal links. The manual URL below is used as a fallback.'
  },
  href: {
    type: 'url',
    label: 'Manual URL'
  },
  newTab: {
    type: 'boolean',
    label: 'Open in a new tab',
    def: false
  }
});

export default {
  fields: {
    add: {
      brandName: {
        type: 'string',
        label: 'Brand Name'
      },
      brandEnglish: {
        type: 'string',
        label: 'English Brand Name'
      },
      brandDescriptor: {
        type: 'string',
        label: 'Brand Descriptor'
      },
      homeLabel: {
        type: 'string',
        label: 'Home Label'
      },
      solutionsLabel: {
        type: 'string',
        label: 'Solutions Label'
      },
      coreLabel: {
        type: 'string',
        label: 'Core Competency Label'
      },
      aboutLabel: {
        type: 'string',
        label: 'About Label'
      },
      contactLabel: {
        type: 'string',
        label: 'Contact Label'
      },
      solutionLinks: {
        type: 'array',
        label: 'Solution Navigation Links',
        fields: {
          add: linkFields()
        }
      },
      coreLinks: {
        type: 'array',
        label: 'Core Navigation Links',
        fields: {
          add: linkFields()
        }
      },
      contactTitle: {
        type: 'string',
        label: 'Contact Heading'
      },
      contactDescription: {
        type: 'string',
        label: 'Contact Description',
        textarea: true
      },
      contactEmail: {
        type: 'email',
        label: 'Contact Email'
      },
      contactPhone: {
        type: 'string',
        label: 'Contact Phone'
      },
      contactPrivacy: {
        type: 'string',
        label: 'Privacy Notice',
        textarea: true
      },
      datasetLinks: {
        type: 'array',
        label: 'Footer Dataset Links',
        fields: {
          add: {
            code: {
              type: 'string',
              label: 'Code'
            },
            title: {
              type: 'string',
              label: 'Title',
              required: true
            },
            description: {
              type: 'string',
              label: 'Description'
            },
            _page: linkFields()._page,
            href: linkFields().href,
            newTab: linkFields().newTab
          }
        }
      },
      footerGroups: {
        type: 'array',
        label: 'Footer Link Groups',
        fields: {
          add: {
            title: {
              type: 'string',
              label: 'Group Title',
              required: true
            },
            links: {
              type: 'array',
              label: 'Links',
              fields: {
                add: linkFields()
              }
            }
          }
        }
      },
      socialLinks: {
        type: 'array',
        label: 'Social Links',
        fields: {
          add: {
            label: {
              type: 'string',
              label: 'Visible Label',
              required: true
            },
            name: {
              type: 'string',
              label: 'Accessible Name',
              required: true
            },
            href: {
              type: 'url',
              label: 'URL',
              required: true
            }
          }
        }
      },
      registrationText: {
        type: 'string',
        label: 'Registration Text'
      },
      businessLicenseText: {
        type: 'string',
        label: 'Business License Text'
      }
    },
    group: {
      brand: {
        label: 'Brand',
        fields: [
          'brandName',
          'brandEnglish',
          'brandDescriptor'
        ]
      },
      navigation: {
        label: 'Navigation',
        fields: [
          'homeLabel',
          'solutionsLabel',
          'coreLabel',
          'aboutLabel',
          'contactLabel',
          'solutionLinks',
          'coreLinks'
        ]
      },
      contact: {
        label: 'Contact',
        fields: [
          'contactTitle',
          'contactDescription',
          'contactEmail',
          'contactPhone',
          'contactPrivacy'
        ]
      },
      footer: {
        label: 'Footer',
        fields: [
          'datasetLinks',
          'footerGroups',
          'socialLinks',
          'registrationText',
          'businessLicenseText'
        ]
      }
    }
  }
};
