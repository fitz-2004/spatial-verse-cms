export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: '关于我们页',
    pluralLabel: '关于我们页'
  },
  fields: {
    add: {
      hero: {
        type: 'object',
        label: 'Hero 首屏',
        fields: {
          add: {
            eyebrow: {
              type: 'string',
              label: 'Eyebrow 索引标签'
            },
            title: {
              type: 'string',
              label: 'Title 页面标题'
            },
            lead: {
              type: 'string',
              label: 'Lead 简介',
              textarea: true
            },
            ctaLabel: {
              type: 'string',
              label: 'CTA 按钮文案'
            },
            ctaHref: {
              type: 'string',
              label: 'CTA 链接'
            },
            statusLeft: {
              type: 'string',
              label: 'Hero 底部左侧状态'
            },
            statusRight: {
              type: 'string',
              label: 'Hero 底部右侧提示'
            },
            orbitAria: {
              type: 'string',
              label: '轨道场景无障碍标签'
            },
            orbitCoreKicker: {
              type: 'string',
              label: '核心标记上标'
            },
            orbitCoreTitle: {
              type: 'string',
              label: '核心标记标题'
            },
            orbitCoreCaption: {
              type: 'string',
              label: '核心标记说明'
            },
            orbitNodes: {
              type: 'array',
              label: '轨道节点',
              titleField: 'label',
              fields: {
                add: {
                  label: {
                    type: 'string',
                    label: '节点文案'
                  }
                }
              }
            }
          }
        }
      },
      story: {
        type: 'object',
        label: 'Story 平台起源',
        fields: {
          add: {
            eyebrow: {
              type: 'string',
              label: 'Eyebrow 区块索引'
            },
            title: {
              type: 'string',
              label: 'Title 区块标题'
            },
            body: {
              type: 'string',
              label: 'Body 正文',
              textarea: true
            },
            focus: {
              type: 'array',
              label: '服务领域',
              titleField: 'label',
              fields: {
                add: {
                  label: {
                    type: 'string',
                    label: '领域名称'
                  }
                }
              }
            }
          }
        }
      },
      network: {
        type: 'object',
        label: 'Network 数据网络',
        fields: {
          add: {
            eyebrow: {
              type: 'string',
              label: 'Eyebrow 区块索引'
            },
            title: {
              type: 'string',
              label: 'Title 区块标题'
            },
            body: {
              type: 'string',
              label: 'Body 正文',
              textarea: true
            },
            railCaption: {
              type: 'string',
              label: '时间轴说明'
            },
            portals: {
              type: 'array',
              label: '门户链接',
              titleField: 'label',
              fields: {
                add: {
                  index: {
                    type: 'string',
                    label: '序号'
                  },
                  label: {
                    type: 'string',
                    label: '链接文案'
                  },
                  href: {
                    type: 'string',
                    label: '链接地址'
                  }
                }
              }
            }
          }
        }
      },
      metrics: {
        type: 'object',
        label: 'Metrics 平台规模',
        fields: {
          add: {
            eyebrow: {
              type: 'string',
              label: 'Eyebrow 区块索引'
            },
            title: {
              type: 'string',
              label: 'Title 区块标题'
            },
            items: {
              type: 'array',
              label: '指标',
              titleField: 'label',
              fields: {
                add: {
                  value: {
                    type: 'string',
                    label: '数值'
                  },
                  label: {
                    type: 'string',
                    label: '指标说明'
                  }
                }
              }
            }
          }
        }
      },
      quote: {
        type: 'object',
        label: 'Quote 客户反馈',
        fields: {
          add: {
            eyebrow: {
              type: 'string',
              label: 'Eyebrow 区块索引'
            },
            text: {
              type: 'string',
              label: '引用正文',
              textarea: true
            },
            name: {
              type: 'string',
              label: '姓名'
            },
            organization: {
              type: 'string',
              label: '机构'
            }
          }
        }
      },
      cta: {
        type: 'object',
        label: 'CTA 联系引导',
        fields: {
          add: {
            eyebrow: {
              type: 'string',
              label: 'Eyebrow 区块索引'
            },
            title: {
              type: 'string',
              label: 'Title 区块标题'
            },
            buttonLabel: {
              type: 'string',
              label: '按钮文案'
            },
            buttonHref: {
              type: 'string',
              label: '按钮链接'
            }
          }
        }
      },
      seoTitle: {
        type: 'string',
        label: 'SEO 标题（留空使用页面标题）'
      },
      seoDescription: {
        type: 'string',
        label: 'SEO 描述',
        textarea: true
      },
      seoKeywords: {
        type: 'string',
        label: 'SEO 关键词'
      },
      seoCanonicalUrl: {
        type: 'string',
        label: 'Canonical URL'
      },
      seoRobots: {
        type: 'select',
        label: '搜索引擎索引策略',
        def: 'index-follow',
        choices: [
          {
            label: '允许索引和跟踪链接',
            value: 'index-follow'
          },
          {
            label: '禁止索引，允许跟踪链接',
            value: 'noindex-follow'
          },
          {
            label: '允许索引，禁止跟踪链接',
            value: 'index-nofollow'
          },
          {
            label: '禁止索引和跟踪链接',
            value: 'noindex-nofollow'
          }
        ]
      },
      seoOgTitle: {
        type: 'string',
        label: '社交分享标题',
        max: 60
      },
      seoOgDescription: {
        type: 'string',
        label: '社交分享描述',
        textarea: true,
        max: 200
      },
      seoOgImage: {
        type: 'attachment',
        label: '社交分享图片',
        fileGroup: 'images'
      },
      seoTwitterCard: {
        type: 'select',
        label: 'Twitter Card',
        def: 'summary_large_image',
        choices: [
          {
            label: '大图卡片',
            value: 'summary_large_image'
          },
          {
            label: '摘要卡片',
            value: 'summary'
          }
        ]
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'hero',
          'story',
          'network',
          'metrics',
          'quote',
          'cta'
        ]
      },
      seo: {
        label: 'SEO',
        fields: [
          'seoTitle',
          'seoDescription',
          'seoKeywords',
          'seoCanonicalUrl',
          'seoRobots',
          'seoOgTitle',
          'seoOgDescription',
          'seoOgImage',
          'seoTwitterCard'
        ]
      }
    }
  }
};
