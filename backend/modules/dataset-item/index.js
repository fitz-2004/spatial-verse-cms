export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: '数据集资源',
    pluralLabel: '数据集资源',
    searchable: true,
    sort: { rank: 1, title: 1 }
  },
  fields: {
    add: {
      sourceKey: {
        type: 'string',
        label: '稳定来源标识',
        required: true,
        help: '原型数据集的唯一 id。导入时以此更新，创建后不要随意修改。'
      },
      rank: {
        type: 'integer',
        label: '默认排序',
        def: 100,
        help: '数值越小越靠前；页面关联关系仍可覆盖展示顺序。'
      },
      category: {
        type: 'select',
        label: '数据分类',
        required: true,
        choices: [
          { label: '模型数据', value: 'model' },
          { label: '场景数据', value: 'scene' },
          { label: '图像数据', value: 'image' }
        ]
      },
      summary: {
        type: 'string',
        label: '卡片摘要',
        textarea: true,
        required: true
      },
      description: {
        type: 'string',
        label: '详情说明',
        textarea: true,
        required: true
      },
      formats: {
        type: 'array',
        label: '数据格式',
        titleField: 'label',
        fields: {
          add: {
            label: {
              type: 'string',
              label: '格式名称',
              required: true,
              help: '例如 OBJ、USD、RGB 或 DATASET ZIP。'
            }
          }
        }
      },
      tags: {
        type: 'array',
        label: '检索标签',
        titleField: 'label',
        fields: {
          add: {
            label: {
              type: 'string',
              label: '标签名称',
              required: true
            }
          }
        }
      },
      cover: {
        type: 'attachment',
        label: '卡片预览图',
        fileGroup: 'images',
        help: '用于资源卡片；留空时前端显示该数据集的信号占位图。'
      },
      gallery: {
        type: 'array',
        label: '详情图库',
        titleField: 'alt',
        fields: {
          add: {
            image: {
              type: 'attachment',
              label: '图片',
              fileGroup: 'images',
              required: true
            },
            alt: {
              type: 'string',
              label: '替代文本',
              help: '描述图片内容，供辅助技术与图片加载失败时使用。'
            }
          }
        }
      },
      downloads: {
        type: 'array',
        label: '下载选项',
        titleField: 'label',
        fields: {
          add: {
            label: {
              type: 'string',
              label: '显示名称',
              required: true,
              help: '例如 OBJ、USD、BLENDER 或 DATASET ZIP。'
            },
            url: {
              type: 'url',
              label: '真实外部下载地址',
              required: true,
              help: 'ZIP、RAR、BLEND、USD 等外部资源 URL；不要上传到图片媒体库。'
            }
          }
        }
      }
    },
    group: {
      basics: {
        label: '基本信息',
        fields: [ 'title', 'sourceKey', 'rank', 'category', 'summary', 'description' ]
      },
      presentation: {
        label: '格式、标签与媒体',
        fields: [ 'formats', 'tags', 'cover', 'gallery' ]
      },
      distribution: {
        label: '下载资源',
        fields: [ 'downloads' ]
      }
    }
  }
};
