// 可见文本使用 area（rich-text）字段，支持前台点击编辑。
const richTextArea = {
  type: 'area',
  options: {
    widgets: { '@apostrophecms/rich-text': {} },
    max: 1
  }
};

const tag = {
  type: 'array',
  fields: {
    add: {
      label: { ...richTextArea, label: 'Tag 标签' }
    }
  }
};

export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Dataset Library Page 样例数据集页'
  },
  fields: {
    add: {
      intro: {
        type: 'object',
        label: 'Intro 简介',
        fields: {
          add: {
            eyebrow: { ...richTextArea, label: 'Eyebrow 索引标签' },
            title: { ...richTextArea, label: 'Title 大标题' },
            lead: { ...richTextArea, label: 'Lead 引导语' },
            filters: {
              type: 'array',
              label: 'Filters 筛选标签',
              titleField: 'label',
              fields: {
                add: {
                  label: { ...richTextArea, label: 'Filter 标签' }
                }
              }
            }
          }
        }
      },
      groups: {
        type: 'array',
        label: 'Groups 数据分组说明',
        titleField: 'title',
        fields: {
          add: {
            number: { ...richTextArea, label: 'Number 编号' },
            type: { ...richTextArea, label: 'Type 类型标签' },
            title: { ...richTextArea, label: 'Title 标题', required: true },
            text: { ...richTextArea, label: 'Text 描述' },
            tags: tag
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
        help: '逗号分隔，例如：数据集, 3D 模型, 群核'
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [ 'title', 'intro', 'groups' ]
      },
      seo: {
        label: 'SEO',
        fields: [ 'seoTitle', 'seoDescription', 'seoKeywords' ]
      }
    }
  }
};
