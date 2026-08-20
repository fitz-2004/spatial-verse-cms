// 页面正文所有可见文本均使用 area（rich-text）字段，编辑人员在
// 前台 aposEdit 模式下可直接点击编辑。短文本（编号/标签/标题等）
// 同样使用 area 字段；需要纯文本的场景由前端 areaText() 提取。
const richTextArea = {
  type: 'area',
  options: {
    widgets: {
      '@apostrophecms/rich-text': {}
    },
    max: 1
  }
};

const cardItem = {
  type: 'array',
  fields: {
    add: {
      title: {
        ...richTextArea,
        label: 'Title 标题',
        required: true
      },
      text: {
        ...richTextArea,
        label: 'Text 描述'
      }
    }
  }
};

export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Solution Page 解决方案页'
  },
  fields: {
    add: {
      intro: {
        type: 'object',
        label: 'Intro 简介',
        fields: {
          add: {
            eyebrow: {
              ...richTextArea,
              label: 'Eyebrow 索引标签'
            },
            englishTitle: {
              ...richTextArea,
              label: 'English Title 英文标题'
            },
            title: {
              ...richTextArea,
              label: 'Title 主标题',
              required: true
            },
            lead: {
              ...richTextArea,
              label: 'Lead 引导语'
            }
          }
        }
      },
      challenges: {
        type: 'object',
        label: 'Challenges 挑战区块',
        fields: {
          add: {
            title: {
              ...richTextArea,
              label: 'Title 区块标题'
            },
            items: {
              ...cardItem,
              label: 'Items 挑战列表'
            }
          }
        }
      },
      advantages: {
        type: 'object',
        label: 'Advantages 优势区块',
        fields: {
          add: {
            title: {
              ...richTextArea,
              label: 'Title 区块标题'
            },
            items: {
              ...cardItem,
              label: 'Items 优势列表'
            }
          }
        }
      },
      services: {
        type: 'object',
        label: 'Services 服务区块',
        fields: {
          add: {
            title: {
              ...richTextArea,
              label: 'Title 区块标题'
            },
            items: {
              ...cardItem,
              label: 'Items 服务列表'
            }
          }
        }
      },
      seoTitle: {
        type: 'string',
        label: 'SEO 标题（留空使用页面标题）',
        help: '可选，覆盖 title 与搜索引擎显示的标题。'
      },
      seoDescription: {
        type: 'string',
        label: 'SEO 描述',
        textarea: true,
        help: '搜索引擎 meta description。公共路由会自动输出。'
      },
      seoKeywords: {
        type: 'string',
        label: 'SEO 关键词',
        help: '逗号分隔，例如：智能体感知, 解决方案, 群核'
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'intro',
          'challenges',
          'advantages',
          'services'
        ]
      },
      seo: {
        label: 'SEO',
        fields: [
          'seoTitle',
          'seoDescription',
          'seoKeywords'
        ]
      }
    }
  }
};