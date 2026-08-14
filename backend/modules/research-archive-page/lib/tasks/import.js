// 学术研究页中文草稿数据导入任务
// 运行：APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app research-archive-page:import
// 重复运行会更新而不是重复创建（使用稳定 slug /coohomcloud/corecompetency/paper）

function buildData() {
  return {
    title: '学术研究',
    slug: '/coohomcloud/corecompetency/paper',
    type: 'research-archive-page',
    published: false,
    intro: {
      eyebrow: '03 / RESEARCH ARCHIVE',
      title: '学术研究',
      lead: '这里汇聚群核空间智能团队在合成数据、AIGC、智能体与室内场景理解方向的研究成果。',
      signals: [
        { label: 'SYNTHETIC DATA' },
        { label: 'AGENT RESEARCH' },
        { label: 'SPATIAL COMPUTING' }
      ]
    },
    sectionHead: {
      index: 'RESEARCH ARCHIVE / 2018—NOW',
      heading: '从空间数据到智能系统'
    }
  };
}

export default (self) => {
  return {
    usage: '导入学术研究页中文草稿数据。\n运行：node app research-archive-page:import',
    async task() {
      const apos = self.apos;
      const pages = apos.modules['@apostrophecms/page'];
      const papers = apos.modules['research-paper'];
      const req = apos.task.getReq();
      const data = buildData();

      // 关联论文 Pieces（使用稳定 slug 匹配）
      const paperSlugs = [
        'learning-based-inverse-rendering-of-complex-indoor-scenes',
        'minervas-massive-interior-environments-virtual-synthesis',
        'learning-to-recommend-frame-for-interactive-video-object-segmentation',
        'structured3d-a-large-photo-realistic-dataset-for-structured-3d-modeling',
        'data-driven-interior-plan-generation-for-residential-buildings'
      ];
      const found = await papers.find(req, { slug: { $in: paperSlugs } }).toArray();
      data._papers = found.map((p) => ({ ...p }));

      const existing = await pages.find(req, { slug: data.slug }).toArray();
      if (existing.length > 0) {
        await pages.update(req, { ...data, _id: existing[0]._id });
        console.log(`✅ 学术研究页草稿已更新: ${data.slug}（关联 ${found.length} 篇论文）`);
      } else {
        await pages.insert(req, { ...data, aposMode: 'draft' });
        console.log(`✅ 学术研究页草稿已创建: ${data.slug}（关联 ${found.length} 篇论文）`);
      }
    }
  };
};
