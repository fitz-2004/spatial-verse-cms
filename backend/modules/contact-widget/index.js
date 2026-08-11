export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Home Contact'
  },
  fields: {
    add: {
      eyebrow: {
        type: 'string',
        label: 'Eyebrow',
        required: true,
        max: 60,
        def: 'Open a channel'
      },
      titleLine1Zh: {
        type: 'string',
        label: 'Title Line 1 (Chinese)',
        required: true,
        max: 20,
        def: '联系'
      },
      titleLine2Zh: {
        type: 'string',
        label: 'Title Line 2 (Chinese)',
        required: true,
        max: 20,
        def: '我们'
      },
      titleLine1En: {
        type: 'string',
        label: 'Title Line 1 (English)',
        required: true,
        max: 30,
        def: 'Contact'
      },
      titleLine2En: {
        type: 'string',
        label: 'Title Line 2 (English)',
        required: true,
        max: 30,
        def: 'Us'
      },
      descriptionZh: {
        type: 'string',
        label: 'Description (Chinese)',
        required: true,
        textarea: true,
        max: 360
      },
      descriptionEn: {
        type: 'string',
        label: 'Description (English)',
        required: true,
        textarea: true,
        max: 560
      },
      emailLabelZh: {
        type: 'string',
        label: 'Email Field Label (Chinese)',
        required: true,
        max: 30,
        def: '电子邮件*'
      },
      emailLabelEn: {
        type: 'string',
        label: 'Email Field Label (English)',
        required: true,
        max: 30,
        def: 'Work email*'
      },
      submitLabelZh: {
        type: 'string',
        label: 'Submit Label (Chinese)',
        required: true,
        max: 20,
        def: '提交'
      },
      submitLabelEn: {
        type: 'string',
        label: 'Submit Label (English)',
        required: true,
        max: 20,
        def: 'Submit'
      },
      consentZh: {
        type: 'string',
        label: 'Consent Text (Chinese)',
        required: true,
        textarea: true,
        max: 300
      },
      consentEn: {
        type: 'string',
        label: 'Consent Text (English)',
        required: true,
        textarea: true,
        max: 450
      },
      successMessageZh: {
        type: 'string',
        label: 'Success Message (Chinese)',
        required: true,
        max: 100,
        def: '提交通道正在配置中，请先通过 cloud@coohom.com 联系我们。'
      },
      successMessageEn: {
        type: 'string',
        label: 'Success Message (English)',
        required: true,
        max: 140,
        def: 'The submission channel is being configured. Please contact us at cloud@coohom.com.'
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
          'emailLabelZh',
          'emailLabelEn',
          'submitLabelZh',
          'submitLabelEn',
          'consentZh',
          'consentEn',
          'successMessageZh',
          'successMessageEn'
        ]
      }
    }
  }
};
