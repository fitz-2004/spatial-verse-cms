import importTask from './lib/tasks/import.js';

export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: '论文',
    pluralLabel: '论文',
    // 稳定标识：使用 slug 确保重复导入可以更新而不是重复创建
    sort: { year: -1 },
    searchable: true
  },
  tasks(self) {
    return {
      import: importTask(self)
    };
  },
  fields: {
    add: {
      year: {
        type: 'string',
        label: 'Year 年份',
        required: true,
        help: '四位数年份，例如 2022'
      },
      venue: {
        type: 'string',
        label: 'Venue 会议 / 期刊',
        required: true
      },
      abstract: {
        type: 'string',
        label: 'Abstract 摘要',
        textarea: true
      },
      externalUrl: {
        type: 'url',
        label: 'External URL 外链',
        required: true
      },
      cover: {
        type: 'area',
        label: 'Cover 封面图片',
        options: {
          widgets: {
            '@apostrophecms/image': {}
          },
          max: 1
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'year',
          'venue',
          'abstract',
          'externalUrl',
          'cover'
        ]
      }
    }
  }
};
