export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: '数据集',
    pluralLabel: '数据集',
    searchable: true
  },
  fields: {
    add: {
      category: {
        type: 'select',
        label: 'Category 分类',
        choices: [
          {
            label: 'Model 模型数据',
            value: 'model'
          },
          {
            label: 'Scene 场景数据',
            value: 'scene'
          },
          {
            label: 'Image 图像数据',
            value: 'image'
          }
        ]
      },
      categoryLabel: {
        type: 'string',
        label: 'Category Label 分类标签'
      },
      summary: {
        type: 'string',
        label: 'Summary 摘要',
        textarea: true
      },
      description: {
        type: 'string',
        label: 'Description 详情',
        textarea: true
      },
      formats: {
        type: 'array',
        label: 'Formats 格式',
        titleField: 'label',
        fields: {
          add: {
            label: {
              type: 'string',
              label: 'Label 格式名称'
            }
          }
        }
      },
      tags: {
        type: 'array',
        label: 'Tags 标签',
        titleField: 'label',
        fields: {
          add: {
            label: {
              type: 'string',
              label: 'Label 标签名称'
            }
          }
        }
      },
      preview: {
        type: 'area',
        label: 'Preview 预览图',
        options: {
          widgets: {
            '@apostrophecms/image': {}
          },
          max: 1
        }
      },
      _gallery: {
        type: 'relationship',
        label: 'Gallery 图库',
        withType: '@apostrophecms/image'
      },
      downloads: {
        type: 'array',
        label: 'Downloads 下载选项',
        titleField: 'label',
        fields: {
          add: {
            label: {
              type: 'string',
              label: 'Label 显示名称'
            },
            url: {
              type: 'url',
              label: 'URL 下载地址'
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
          'slug',
          'category',
          'categoryLabel',
          'summary',
          'description',
          'formats',
          'tags'
        ]
      },
      media: {
        label: 'Media',
        fields: [
          'preview',
          '_gallery'
        ]
      },
      downloadOptions: {
        label: 'Downloads',
        fields: [
          'downloads'
        ]
      }
    }
  }
};
