export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: '样例数据集页',
    pluralLabel: '样例数据集页'
  },
  fields: {
    add: {
      intro: {
        type: 'object',
        label: 'Intro 页面简介',
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
              label: 'Lead 页面简介',
              textarea: true
            }
          }
        }
      },
      library: {
        type: 'object',
        label: 'Library 数据集资源库',
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
            description: {
              type: 'string',
              label: 'Description 区块说明',
              textarea: true
            },
            searchLabel: {
              type: 'string',
              label: 'Search Label 搜索标签'
            },
            searchPlaceholder: {
              type: 'string',
              label: 'Search Placeholder 搜索占位文案'
            },
            filterAllLabel: {
              type: 'string',
              label: 'All Filter 全部数据'
            },
            filterModelLabel: {
              type: 'string',
              label: 'Model Filter 模型数据'
            },
            filterSceneLabel: {
              type: 'string',
              label: 'Scene Filter 场景数据'
            },
            filterImageLabel: {
              type: 'string',
              label: 'Image Filter 图像数据'
            },
            emptyTitle: {
              type: 'string',
              label: 'Empty Title 空结果标题'
            },
            emptyText: {
              type: 'string',
              label: 'Empty Text 空结果说明'
            },
            downloadHeading: {
              type: 'string',
              label: 'Download Heading 下载格式标题'
            },
            downloadButtonLabel: {
              type: 'string',
              label: 'Download Button 下载按钮'
            },
            unavailableLabel: {
              type: 'string',
              label: 'Unavailable Label 无下载资源'
            }
          }
        }
      },
      _items: {
        type: 'relationship',
        label: 'Dataset Items 数据集',
        withType: 'dataset-item',
        max: 50,
        required: false,
        // Second-level relationships are not loaded by default, so the gallery
        // images of each dataset would be missing on the front end.
        withRelationships: [ '_gallery' ]
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
          'intro',
          'library',
          '_items'
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
