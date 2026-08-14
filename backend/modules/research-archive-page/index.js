export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: '学术研究列表页',
    pluralLabel: '学术研究列表页'
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
            signals: {
              type: 'array',
              label: 'Signals 数据标签',
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
      sectionHead: {
        type: 'object',
        label: 'Archive 区块标题',
        fields: {
          add: {
            index: {
              type: 'string',
              label: 'Section Index 索引'
            },
            heading: {
              type: 'string',
              label: 'Heading 标题'
            }
          }
        }
      },
      _papers: {
        type: 'relationship',
        label: '关联论文',
        withType: 'research-paper',
        max: 50,
        required: false
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'intro',
          'sectionHead',
          '_papers'
        ]
      }
    }
  }
};