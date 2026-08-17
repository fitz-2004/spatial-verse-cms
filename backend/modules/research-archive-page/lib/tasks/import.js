// 学术研究页中文数据导入任务
// 运行：APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app research-archive-page:import
// 重复运行会更新而不是重复创建（使用稳定 slug /coohomcloud/corecompetency/paper）

function buildData() {
  return {
    title: '学术研究',
    slug: '/coohomcloud/corecompetency/paper',
    type: 'research-archive-page',
    published: true,
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
    usage: '导入学术研究页中文数据并发布。\n运行：node app research-archive-page:import',
    async task() {
      const apos = self.apos;
      const pages = apos.modules['@apostrophecms/page'];
      const papers = apos.modules['research-paper'];
      const req = apos.task.getReq();
      const data = buildData();

      const paperSlugs = [
        'learning-based-inverse-rendering-of-complex-indoor-scenes',
        'minervas-massive-interior-environments-virtual-synthesis',
        'learning-to-recommend-frame-for-interactive-video-object-segmentation',
        'structured3d-a-large-photo-realistic-dataset-for-structured-3d-modeling',
        'data-driven-interior-plan-generation-for-residential-buildings'
      ];
      const found = await papers.find(req, { slug: { $in: paperSlugs } }).toArray();

      // relationship 字段 _papers 的底层存储为 papersIds（idsStorage）。
      // 使用裸 _id（去掉 locale 后缀）并去重，避免 draft/published 重复。
      // 若查询结果为空则保留原 papersIds，避免覆盖成空关联。
      const existingPage = await pages.find(req, { slug: data.slug }).toArray();
      if (found.length) {
        data.papersIds = [ ...new Set(found.map((p) => String(p._id).split(':')[0])) ];
      } else if (existingPage.length) {
        data.papersIds = existingPage[0].papersIds || [];
      }

      if (existingPage.length > 0) {
        const draft = await pages.update(req, { ...data, _id: existingPage[0]._id, aposLocale: 'zh:draft' });
        await pages.publish(req, draft);
        console.log(`✅ 学术研究页已更新并发布: ${data.slug}（关联 ${data.papersIds.length} 篇论文）`);
      } else {
        const home = await pages.find(req, { level: 0 }).toObject();
        if (!home) {
          throw new Error('Home 页面不存在，无法插入子页面');
        }
        const draft = await pages.insert(req, home._id, 'lastChild', { ...data, aposLocale: 'zh:draft', aposMode: 'draft' });
        await pages.publish(req, draft);
        console.log(`✅ 学术研究页已创建并发布: ${data.slug}（关联 ${data.papersIds.length} 篇论文）`);
      }
    }
  };
};