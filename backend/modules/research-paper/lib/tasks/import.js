// Research Paper 中文数据导入任务
// 运行：APOS_DB_URI=sqlite://data/spatial-verse-cms.sqlite node app research-paper:import
// 重复运行会更新而不是重复创建（使用稳定 slug）

function buildPapers() {
  return [
    {
      type: 'research-paper',
      title: 'Learning-based Inverse Rendering of Complex Indoor Scenes with Differentiable Monte Carlo Raytracing',
      slug: 'learning-based-inverse-rendering-of-complex-indoor-scenes',
      year: '2022',
      venue: 'SIGGRAPH ASIA 2022',
      abstract: '从单张图像联合恢复几何结构、空间变化光照与外观信息。',
      externalUrl: 'https://jingsenzhu.github.io/',
      published: true
    },
    {
      type: 'research-paper',
      title: 'MINERVAS: Massive Interior Environments Virtual Synthesis',
      slug: 'minervas-massive-interior-environments-virtual-synthesis',
      year: '2022',
      venue: 'CGF 2022',
      abstract: '面向室内场景修改与 2D 图像合成的可编程虚拟合成系统。',
      externalUrl: 'https://coohom.github.io/',
      published: true
    },
    {
      type: 'research-paper',
      title: 'Learning to Recommend Frame for Interactive Video Object Segmentation in the Wild',
      slug: 'learning-to-recommend-frame-for-interactive-video-object-segmentation',
      year: '2021',
      venue: 'CVPR 2021',
      abstract: '通过交互式帧推荐，提升复杂视频对象分割的标注效率。',
      externalUrl: 'https://arxiv.org/abs/2101.12027',
      published: true
    },
    {
      type: 'research-paper',
      title: 'Structured3D: A Large Photo-realistic Dataset for Structured 3D Modeling',
      slug: 'structured3d-a-large-photo-realistic-dataset-for-structured-3d-modeling',
      year: '2020',
      venue: 'ECCV 2020',
      abstract: '面向结构化 3D 建模的大规模高真实感室内合成数据集。',
      externalUrl: 'https://structured3d-dataset.org/',
      published: true
    },
    {
      type: 'research-paper',
      title: 'Data-driven Interior Plan Generation for Residential Buildings',
      slug: 'data-driven-interior-plan-generation-for-residential-buildings',
      year: '2019',
      venue: 'SIGGRAPH ASIA 2019',
      abstract: '探索语言条件下的户型生成与室内纹理合成。',
      externalUrl: 'https://staff.ustc.edu.cn/',
      published: true
    }
  ];
}

export default (self) => {
  return {
    usage: '导入 Research Paper 中文数据并发布。\n运行：node app research-paper:import',
    async task() {
      const papers = self.apos.modules['research-paper'];
      const req = self.apos.task.getReq();
      const papersData = buildPapers();

      for (const data of papersData) {
        const existing = await papers.find(req, { slug: data.slug }).toArray();
        if (existing.length > 0) {
          const draft = await papers.update(req, { ...data, _id: existing[0]._id, aposLocale: 'zh:draft' });
          await papers.publish(req, draft);
          console.log(`✅ 论文已更新并发布: ${data.title}`);
        } else {
          const draft = await papers.insert(req, { ...data, aposLocale: 'zh:draft', aposMode: 'draft' });
          await papers.publish(req, draft);
          console.log(`✅ 论文已创建并发布: ${data.title}`);
        }
      }
      console.log(`\n完成：共导入并发布 ${papersData.length} 篇论文`);
    }
  };
};