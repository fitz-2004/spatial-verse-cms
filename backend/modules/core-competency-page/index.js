import importTask from './lib/tasks/import.js';

// 页面正文所有可见文本均使用 area（rich-text）字段，编辑人员在
// 前台 aposEdit 模式下可直接点击编辑。短文本（eyebrow/标题/标签等）
// 同样使用 area 字段以获得统一的原位编辑体验；需要纯文本的场景
// （React island、aria 属性）由前端 lib/editableText.js 的 areaText() 提取。
const richTextArea = {
  type: 'area',
  options: {
    widgets: {
      '@apostrophecms/rich-text': {}
    },
    max: 1
  }
};

export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: '核心能力页',
    pluralLabel: '核心能力页'
  },
  tasks(self) {
    return {
      import: importTask(self)
    };
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
            title: {
              ...richTextArea,
              label: 'Title 大标题'
            },
            lead: {
              ...richTextArea,
              label: 'Lead 引导语'
            },
            subcopy: {
              ...richTextArea,
              label: 'Subcopy 副文案'
            },
            signals: {
              type: 'array',
              label: 'Signals 数据类型标签',
              titleField: 'label',
              fields: {
                add: {
                  label: {
                    ...richTextArea,
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
              ...richTextArea,
              label: 'Number 编号',
              required: true
            },
            header: {
              ...richTextArea,
              label: 'Header 整段页眉（如 CORE CAPABILITY / 01）'
            },
            label: {
              ...richTextArea,
              label: 'Label 整行标签（如 01 / PHYSICAL ENHANCEMENT）'
            },
            title: {
              ...richTextArea,
              label: 'Title 标题',
              required: true
            },
            text: {
              ...richTextArea,
              label: 'Text 描述'
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
      },
      outro: {
        type: 'object',
        label: 'Outro 收尾区块',
        fields: {
          add: {
            eyebrow: {
              ...richTextArea,
              label: 'Eyebrow 索引标签'
            },
            heading: {
              ...richTextArea,
              label: 'Heading 大标题'
            },
            links: {
              type: 'array',
              label: 'Links 下一层级链接',
              titleField: 'label',
              fields: {
                add: {
                  number: {
                    ...richTextArea,
                    label: 'Number 编号'
                  },
                  label: {
                    ...richTextArea,
                    label: 'Label 标签'
                  },
                  _page: {
                    type: 'relationship',
                    label: 'Internal Page 内部页面',
                    withType: '@apostrophecms/any-page-type',
                    max: 1,
                    help: '优先选择内部页面；选中后前台链接自动解析'
                  }
                }
              }
            }
          }
        }
      },
      seoTitle: {
        type: 'string',
        label: 'SEO 标题（留空使用页面标题）',
        help: '可选，覆盖 <title> 与搜索引擎显示的标题。'
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
        help: '逗号分隔，例如：3D 数据, 核心能力, 群核'
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'intro',
          'capabilities',
          'outro'
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