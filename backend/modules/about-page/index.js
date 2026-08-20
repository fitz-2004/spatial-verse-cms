// 可见文本使用 area（rich-text）字段，支持前台点击编辑。
const richTextArea = {
  type: 'area',
  options: {
    widgets: { '@apostrophecms/rich-text': {} },
    max: 1
  }
};

const indexItem = {
  type: 'object',
  fields: {
    add: {
      index: { ...richTextArea, label: 'Index 索引' },
      title: { ...richTextArea, label: 'Title 标题', required: true },
      body: { ...richTextArea, label: 'Body 正文' }
    }
  }
};

const metricItem = {
  type: 'array',
  fields: {
    add: {
      value: {
        type: 'string',
        label: 'Value 数值',
        required: true
      },
      label: { ...richTextArea, label: 'Label 标签', required: true }
    }
  }
};

export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'About Page 关于我们'
  },
  fields: {
    add: {
      intro: {
        type: 'object',
        label: 'Intro 首屏',
        fields: {
          add: {
            eyebrow: { ...richTextArea, label: 'Eyebrow 索引标签' },
            title: { ...richTextArea, label: 'Title 大标题' },
            lead: { ...richTextArea, label: 'Lead 引导语' },
            ctaLabel: { ...richTextArea, label: 'CTA 按钮文字' }
          }
        }
      },
      story: {
        ...indexItem,
        label: 'Story 平台起源'
      },
      focus: {
        type: 'array',
        label: 'Focus 服务领域',
        titleField: 'label',
        fields: {
          add: {
            label: { ...richTextArea, label: 'Focus 标签' }
          }
        }
      },
      network: {
        ...indexItem,
        label: 'Network 数据网络'
      },
      metrics: {
        type: 'array',
        label: 'Metrics 数据规模',
        titleField: 'title',
        fields: {
          add: {
            title: { ...richTextArea, label: 'Title 标题' },
            items: metricItem
          }
        }
      },
      quote: {
        type: 'object',
        label: 'Quote 行业反馈',
        fields: {
          add: {
            index: { ...richTextArea, label: 'Index 索引' },
            text: { ...richTextArea, label: 'Quote 引言' },
            name: { ...richTextArea, label: 'Name 姓名' },
            organization: { ...richTextArea, label: 'Organization 机构' }
          }
        }
      },
      cta: {
        type: 'object',
        label: 'CTA 下一连接',
        fields: {
          add: {
            index: { ...richTextArea, label: 'Index 索引' },
            title: { ...richTextArea, label: 'Title 标题' },
            ctaLabel: { ...richTextArea, label: 'CTA 按钮文字' }
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
        help: '逗号分隔，例如：关于我们, 群核, 空间智能'
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'intro',
          'story',
          'focus',
          'network',
          'metrics',
          'quote',
          'cta'
        ]
      },
      seo: {
        label: 'SEO',
        fields: [ 'seoTitle', 'seoDescription', 'seoKeywords' ]
      }
    }
  }
};
