export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: '核心能力页',
    pluralLabel: '核心能力页'
  },
  fields: {
    add: {
      intro: {
        type: 'object',
        label: 'Intro 简介',
        fields: {
          add: {
            eyebrow: {
              type: 'string',
              label: 'Eyebrow 索引标签'
            },
            title: {
              type: 'string',
              label: 'Title 标题'
            },
            lead: {
              type: 'string',
              label: 'Lead 引导语',
              textarea: true
            },
            subcopy: {
              type: 'string',
              label: 'Subcopy 副文案',
              textarea: true
            },
            signals: {
              type: 'array',
              label: 'Signals 数据类型标签',
              titleField: 'label',
              fields: {
                add: {
                  label: {
                    type: 'string',
                    label: 'Signal 标签'
                  }
                }
              }
            }
          }
        }
      },
      capabilities: {
        type: 'array',
        label: 'Capabilities 核心能力',
        titleField: 'title',
        fields: {
          add: {
            number: {
              type: 'string',
              label: 'Number 编号',
              required: true
            },
            label: {
              type: 'string',
              label: 'Label 英文标签'
            },
            title: {
              type: 'string',
              label: 'Title 标题',
              required: true
            },
            text: {
              type: 'string',
              label: 'Text 描述',
              textarea: true
            },
            media: {
              type: 'area',
              label: 'Media 媒体',
              options: {
                widgets: {
                  '@apostrophecms/image': {},
                  '@apostrophecms/video': {}
                },
                max: 1
              }
            }
          }
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'intro',
          'capabilities'
        ]
      }
    }
  }
};