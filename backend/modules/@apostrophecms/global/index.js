export default {
  options: {
    label: 'Global Header and Footer'
  },
  fields: {
    add: {
      brandLabel: {
        type: 'string',
        label: 'Brand Label',
        required: true,
        max: 40,
        def: 'SPATIAL VERSE'
      },
      brandAriaLabelZh: {
        type: 'string',
        label: 'Brand Accessible Label (Chinese)',
        required: true,
        max: 80,
        def: '群核空间智能平台首页'
      },
      brandAriaLabelEn: {
        type: 'string',
        label: 'Brand Accessible Label (English)',
        required: true,
        max: 100,
        def: 'SpatialVerse home page'
      },
      _homePage: {
        type: 'relationship',
        label: 'Home Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      },
      homeLabelZh: {
        type: 'string',
        label: 'Home Label (Chinese)',
        required: true,
        max: 20,
        def: '首页'
      },
      homeLabelEn: {
        type: 'string',
        label: 'Home Label (English)',
        required: true,
        max: 20,
        def: 'Home'
      },
      solutionsLabelZh: {
        type: 'string',
        label: 'Solutions Label (Chinese)',
        required: true,
        max: 20,
        def: '解决方案'
      },
      solutionsLabelEn: {
        type: 'string',
        label: 'Solutions Label (English)',
        required: true,
        max: 30,
        def: 'Solutions'
      },
      capabilitiesLabelZh: {
        type: 'string',
        label: 'Capabilities Label (Chinese)',
        required: true,
        max: 20,
        def: '核心能力'
      },
      capabilitiesLabelEn: {
        type: 'string',
        label: 'Capabilities Label (English)',
        required: true,
        max: 30,
        def: 'Core Competency'
      },
      _capabilitiesPage: {
        type: 'relationship',
        label: 'Capabilities Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      },
      researchLabelZh: {
        type: 'string',
        label: 'Research Label (Chinese)',
        required: true,
        max: 20,
        def: '学术研究'
      },
      researchLabelEn: {
        type: 'string',
        label: 'Research Label (English)',
        required: true,
        max: 30,
        def: 'Academic Research'
      },
      _researchPage: {
        type: 'relationship',
        label: 'Research Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      },
      datasetsLabelZh: {
        type: 'string',
        label: 'Datasets Label (Chinese)',
        required: true,
        max: 20,
        def: '样例数据集'
      },
      datasetsLabelEn: {
        type: 'string',
        label: 'Datasets Label (English)',
        required: true,
        max: 30,
        def: 'Example Datasets'
      },
      _datasetsPage: {
        type: 'relationship',
        label: 'Datasets Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      },
      aboutLabelZh: {
        type: 'string',
        label: 'About Label (Chinese)',
        required: true,
        max: 20,
        def: '关于我们'
      },
      aboutLabelEn: {
        type: 'string',
        label: 'About Label (English)',
        required: true,
        max: 30,
        def: 'About Us'
      },
      _aboutPage: {
        type: 'relationship',
        label: 'About Page',
        withType: '@apostrophecms/any-page-type',
        max: 1,
        required: true
      },
      contactLabelZh: {
        type: 'string',
        label: 'Contact Label (Chinese)',
        required: true,
        max: 20,
        def: '联系我们'
      },
      contactLabelEn: {
        type: 'string',
        label: 'Contact Label (English)',
        required: true,
        max: 30,
        def: 'Contact Us'
      },
      footerDescriptionZh: {
        type: 'string',
        label: 'Footer Description (Chinese)',
        required: true,
        textarea: true,
        max: 220
      },
      footerDescriptionEn: {
        type: 'string',
        label: 'Footer Description (English)',
        required: true,
        textarea: true,
        max: 320
      },
      email: {
        type: 'email',
        label: 'Contact Email',
        required: true,
        def: 'cloud@coohom.com'
      },
      phoneLabel: {
        type: 'string',
        label: 'Phone Display Label',
        required: true,
        max: 40,
        def: '+1 (213) 465-0013'
      },
      phoneNumber: {
        type: 'string',
        label: 'Phone Number',
        help: 'Enter digits and an optional leading +. The frontend creates the tel: URL.',
        required: true,
        max: 30,
        def: '+12134650013'
      },
      datasetProductLabel1: {
        type: 'string',
        label: 'Dataset Product 1',
        required: true,
        max: 60,
        def: '2D Synthetic Datasets/Videos'
      },
      datasetProductLabel2: {
        type: 'string',
        label: 'Dataset Product 2',
        required: true,
        max: 60,
        def: '3D Models'
      },
      datasetProductLabel3: {
        type: 'string',
        label: 'Dataset Product 3',
        required: true,
        max: 60,
        def: '3D Scenes'
      },
      socialLinks: {
        type: 'array',
        label: 'Social Links',
        max: 6,
        titleField: 'label',
        fields: {
          add: {
            label: {
              type: 'string',
              label: 'Label',
              required: true,
              max: 30
            },
            url: {
              type: 'url',
              label: 'URL',
              required: true
            }
          }
        }
      },
      registrationLabelZh: {
        type: 'string',
        label: 'ICP Label (Chinese)',
        required: true,
        max: 30,
        def: '备案号：'
      },
      registrationLabelEn: {
        type: 'string',
        label: 'ICP Label (English)',
        required: true,
        max: 40,
        def: 'Registration number:'
      },
      registrationNumber: {
        type: 'string',
        label: 'ICP Registration Number',
        required: true,
        max: 40,
        def: '浙ICP备12022366号'
      },
      registrationUrl: {
        type: 'url',
        label: 'ICP Registration URL',
        required: true,
        def: 'https://beian.miit.gov.cn/'
      },
      businessLicenseLabelZh: {
        type: 'string',
        label: 'Business License Label (Chinese)',
        required: true,
        max: 30,
        def: '营业执照'
      },
      businessLicenseLabelEn: {
        type: 'string',
        label: 'Business License Label (English)',
        required: true,
        max: 40,
        def: 'Business License'
      }
    },
    group: {
      brand: {
        label: 'Brand',
        fields: [
          'brandLabel',
          'brandAriaLabelZh',
          'brandAriaLabelEn',
          '_homePage'
        ]
      },
      header: {
        label: 'Header',
        fields: [
          'homeLabelZh',
          'homeLabelEn',
          'solutionsLabelZh',
          'solutionsLabelEn',
          'capabilitiesLabelZh',
          'capabilitiesLabelEn',
          '_capabilitiesPage',
          'researchLabelZh',
          'researchLabelEn',
          '_researchPage',
          'datasetsLabelZh',
          'datasetsLabelEn',
          '_datasetsPage',
          'aboutLabelZh',
          'aboutLabelEn',
          '_aboutPage',
          'contactLabelZh',
          'contactLabelEn'
        ]
      },
      footer: {
        label: 'Footer',
        fields: [
          'footerDescriptionZh',
          'footerDescriptionEn',
          'email',
          'phoneLabel',
          'phoneNumber',
          'datasetProductLabel1',
          'datasetProductLabel2',
          'datasetProductLabel3',
          'socialLinks',
          'registrationLabelZh',
          'registrationLabelEn',
          'registrationNumber',
          'registrationUrl',
          'businessLicenseLabelZh',
          'businessLicenseLabelEn'
        ]
      }
    }
  }
};
