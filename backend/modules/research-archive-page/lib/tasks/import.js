// 学术研究页中文数据导入任务
// 运行：APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app research-archive-page:import
// 重复运行会更新而不是重复创建（使用稳定 slug /coohomcloud/corecompetency/paper）

function buildData(self) {
  // 用 Apostrophe 官方 fromPlaintext 把字符串转为可原位编辑的 rich-text area（不传 _id，自动生成合法 area id）
  const area = (text) => self.apos.area.fromPlaintext(text);
  return {
    title: '学术研究',
    slug: '/coohomcloud/corecompetency/paper',
    type: 'research-archive-page',
    published: true,
    intro: {
      eyebrow: area('03 / RESEARCH ARCHIVE'),
      title: area('学术研究'),
      lead: area('这里汇聚群核空间智能团队在合成数据、AIGC、智能体与室内场景理解方向的研究成果。'),
      signals: [
        { label: area('SYNTHETIC DATA') },
        { label: area('AGENT RESEARCH') },
        { label: area('SPATIAL COMPUTING') }
      ]
    },
    sectionHead: {
      index: area('RESEARCH ARCHIVE / 2018—NOW'),
      heading: area('从空间数据到智能系统')
    },
    outro: {
      eyebrow: area('RESEARCH ARCHIVE / COMPLETE'),
      heading: area('返回核心能力，继续探索群核的数据基础设施'),
      links: [
        {
          number: area('01'),
          label: area('核心能力')
        },
        {
          number: area('03'),
          label: area('样例数据集')
        }
      ]
    }
  };
}

export default (self) => {
  return {
    usage: '导入学术研究页中文数据并发布。\n运行：node app research-archive-page:import',
    async task() {
      const apos = self.apos;
      const pages = apos.modules['@apostrophecms/page'];
      const papers = apos.modules['research-paper'];
      const req = apos.task.getReq();
      const data = buildData(self);

      const paperSlugs = [
        'learning-based-inverse-rendering-of-complex-indoor-scenes',
        'minervas-massive-interior-environments-virtual-synthesis',
        'learning-to-recommend-frame-for-interactive-video-object-segmentation',
        'structured3d-a-large-photo-realistic-dataset-for-structured-3d-modeling',
        'data-driven-interior-plan-generation-for-residential-buildings'
      ];
      const found = await papers.find(req, { slug: { $in: paperSlugs } }).toArray();
      if (found.length) {
        data.papersIds = [ ...new Set(found.map((p) => String(p._id).split(':')[0])) ];
      }

      const existingPage = await pages.find(req, { slug: data.slug }).toArray();
      if (existingPage.length > 0) {
        const draft = await pages.update(req, { ...data, _id: existingPage[0]._id, aposLocale: 'zh:draft' });
        await pages.publish(req, draft);
        console.log(`✅ 学术研究页已更新并发布: ${data.slug}（关联 ${(data.papersIds || []).length} 篇论文）`);
      } else {
        const home = await pages.find(req, { level: 0 }).toObject();
        if (!home) {
          throw new Error('Home 页面不存在，无法插入子页面');
        }
        const draft = await pages.insert(req, home._id, 'lastChild', { ...data, aposLocale: 'zh:draft', aposMode: 'draft' });
        await pages.publish(req, draft);
        console.log(`✅ 学术研究页已创建并发布: ${data.slug}（关联 ${(data.papersIds || []).length} 篇论文）`);
      }
    }
  };
};