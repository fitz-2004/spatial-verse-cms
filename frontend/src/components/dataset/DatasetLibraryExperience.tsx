import { useEffect, useMemo, useState, type CSSProperties } from 'react';

type Download = { label?: string; url?: string };
type LabeledValue = { label?: string } | string;
type Attachment = { _url?: string; _urls?: { original?: string }; attachment?: Attachment };

export type DatasetItem = {
  _id?: string;
  sourceKey?: string;
  category?: 'model' | 'scene' | 'image';
  title?: string;
  summary?: string;
  description?: string;
  formats?: LabeledValue[];
  tags?: LabeledValue[];
  downloads?: Download[];
  cover?: Attachment;
  gallery?: Array<{ image?: Attachment; alt?: string }>;
};

type Filter = { id?: string; label?: string };

const categoryLabel: Record<string, string> = {
  model: 'MODEL DATASET',
  scene: 'SCENE DATASET',
  image: 'IMAGE DATASET'
};

const attachmentUrl = (attachment?: Attachment) => attachment?._url
  || attachment?._urls?.original
  || attachment?.attachment?._url
  || attachment?.attachment?._urls?.original;

const labels = (values?: LabeledValue[]) => (values || [])
  .map((value) => typeof value === 'string' ? value : value?.label || '')
  .filter(Boolean);

function DatasetMedia({ dataset, src, compact = false }: { dataset: DatasetItem; src?: string; compact?: boolean }) {
  const key = dataset.sourceKey || dataset._id || '00';
  if (src) return <img className="dataset-library-image" src={src} alt={`${dataset.title || '数据集'}预览图`} loading="lazy" />;
  return (
    <div className={`dataset-library-placeholder ${compact ? 'is-compact' : ''}`} aria-label={`${dataset.title || '数据集'}图片插口`}>
      <div className="dataset-placeholder-lines" aria-hidden="true"><i /><i /><i /></div>
      <span>IMAGE SLOT / CMS</span>
      <strong>{key.slice(0, 2).toUpperCase()}</strong>
      <small>请在 CMS 上传预览图</small>
    </div>
  );
}

export default function DatasetLibraryExperience({
  datasets = [],
  filters = [],
  eyebrow = 'DATASET LIBRARY / SEARCH NODE',
  title = '数据集资源库',
  lead = '按数据类型和关键词筛选，打开卡片查看详情并预览下载信息。',
  searchPlaceholder = '搜索数据集名称、标签或格式',
  emptyTitle = 'NO DATA SIGNAL',
  emptyMessage = '没有找到匹配的数据集，请更换关键词或分类。'
}: {
  datasets?: DatasetItem[];
  filters?: Filter[];
  eyebrow?: string;
  title?: string;
  lead?: string;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  const normalizedFilters = filters.length ? filters : [
    { id: 'all', label: '全部数据' }, { id: 'model', label: '模型数据' },
    { id: 'scene', label: '场景数据' }, { id: 'image', label: '图像数据' }
  ];
  const [activeFilter, setActiveFilter] = useState(normalizedFilters[0]?.id || 'all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DatasetItem | null>(null);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
  const [selectedDownloadIndex, setSelectedDownloadIndex] = useState(0);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null);
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('dataset-modal-open');
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('dataset-modal-open');
    };
  }, [selected]);

  const filteredDatasets = useMemo(() => {
    const search = query.trim().toLowerCase();
    return datasets.filter((dataset) => {
      const matchesCategory = activeFilter === 'all' || dataset.category === activeFilter;
      const searchable = [dataset.title, dataset.summary, dataset.description, dataset.category, ...labels(dataset.tags), ...labels(dataset.formats), ...(dataset.downloads || []).map((download) => download.label)]
        .filter(Boolean).join(' ').toLowerCase();
      return matchesCategory && (!search || searchable.includes(search));
    });
  }, [activeFilter, datasets, query]);

  const openDataset = (dataset: DatasetItem) => {
    setSelected(dataset);
    setSelectedPreviewIndex(0);
    setSelectedDownloadIndex(0);
  };
  const gallery = selected
    ? (selected.gallery || []).map((entry) => attachmentUrl(entry.image)).filter((url): url is string => Boolean(url))
    : [];
  const selectedCover = selected ? attachmentUrl(selected.cover) : undefined;
  const activeImage = gallery[selectedPreviewIndex] || selectedCover;
  const activeDownload = selected?.downloads?.[selectedDownloadIndex];

  return (
    <section className="dataset-library-section dataset-library-apple" aria-labelledby="dataset-library-title">
      <div className="content-width">
        <div className="dataset-library-toolbar">
          <div>
            <p className="section-index">{eyebrow}</p>
            <h2 id="dataset-library-title">{title}</h2>
            <p>{lead}</p>
          </div>
          <label className="dataset-search dataset-apple-search">
            <span>SEARCH</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} />
            <b aria-hidden="true">⌕</b>
            {query && <button type="button" aria-label="清空搜索" onClick={() => setQuery('')}>×</button>}
          </label>
        </div>

        <div className="dataset-library-controls dataset-apple-controls" data-active-filter={activeFilter}>
          <div className="dataset-radar" aria-hidden="true"><i className="dataset-radar-ring radar-ring-one" /><i className="dataset-radar-ring radar-ring-two" /><i className="dataset-radar-ring radar-ring-three" /><i className="dataset-radar-sweep" /><span className="dataset-radar-core" /></div>
          <div className="dataset-filter-tabs dataset-apple-segmented" role="tablist" aria-label="数据集分类">
            {normalizedFilters.map((filter) => {
              const id = filter.id || 'all';
              const count = id === 'all' ? datasets.length : datasets.filter((dataset) => dataset.category === id).length;
              return <button type="button" role="tab" aria-selected={activeFilter === id} className={activeFilter === id ? 'is-active' : ''} onClick={() => setActiveFilter(id)} key={id}>{filter.label}<span>{count}</span></button>;
            })}
          </div>
          <span className="dataset-result-count" aria-live="polite">{String(filteredDatasets.length).padStart(2, '0')} RESULTS</span>
        </div>

        {filteredDatasets.length ? (
          <div className="dataset-library-grid" key={`${activeFilter}-${query}`} data-scanning={query ? 'true' : 'false'}>
            {filteredDatasets.map((dataset, index) => {
              const formats = labels(dataset.formats);
              const tags = labels(dataset.tags);
              const cover = attachmentUrl(dataset.cover);
              return (
                <article className="dataset-library-card dataset-apple-card" style={{ '--dataset-index': index } as CSSProperties} key={dataset._id || dataset.sourceKey} role="button" tabIndex={0} onClick={() => openDataset(dataset)} onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDataset(dataset); }
                }}>
                  <div className="dataset-library-card-media"><div className="dataset-cms-media-slot"><DatasetMedia dataset={dataset} src={cover} /></div><span className="dataset-card-code">{categoryLabel[dataset.category || ''] || 'DATASET'}</span></div>
                  <div className="dataset-library-card-copy"><div><span>{(dataset.category || 'dataset').toUpperCase()} / {formats.join(' · ')}</span><b>↗</b></div><h3>{dataset.title}</h3><p>{dataset.summary}</p><div className="dataset-card-tags">{tags.map((tag) => <small key={tag}>{tag}</small>)}</div></div>
                </article>
              );
            })}
          </div>
        ) : <div className="dataset-empty-state"><strong>{emptyTitle}</strong><p>{emptyMessage}</p></div>}
      </div>

      {selected && <div className="dataset-lightbox-backdrop dataset-apple-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
        <div className="dataset-lightbox dataset-apple-sheet" role="dialog" aria-modal="true" aria-labelledby="dataset-lightbox-title" onMouseDown={(event) => event.stopPropagation()}>
          <button className="dataset-lightbox-close" type="button" onClick={() => setSelected(null)} aria-label="关闭数据集详情">×</button>
          <div className="dataset-lightbox-media"><DatasetMedia dataset={selected} src={activeImage} compact />
            {gallery.length > 1 && <div className="dataset-lightbox-thumbs">{gallery.map((image, index) => <button type="button" className={index === selectedPreviewIndex ? 'is-active' : ''} onClick={() => setSelectedPreviewIndex(index)} key={image}><img src={image} alt="" /></button>)}</div>}
            <p>MEDIA PREVIEW / {categoryLabel[selected.category || ''] || 'DATASET'}</p>
          </div>
          <div className="dataset-lightbox-info"><p className="section-index">DATASET / {(selected.category || 'dataset').toUpperCase()}</p><h2 id="dataset-lightbox-title">{selected.title}</h2><p className="dataset-lightbox-description">{selected.description}</p>
            <div className="dataset-download-form"><span>数据格式</span><div>{(selected.downloads || []).map((download, index) => <label key={download.url || `${download.label}-${index}`}><input type="radio" name={`dataset-download-${selected.sourceKey || selected._id}`} checked={selectedDownloadIndex === index} onChange={() => setSelectedDownloadIndex(index)} />{download.label}</label>)}</div></div>
            {activeDownload?.url ? <a className="dataset-download-button" href={activeDownload.url} target="_blank" rel="noreferrer">免费下载 <span>↓</span></a> : <span className="dataset-download-unavailable">暂无可下载资源</span>}
          </div>
        </div>
      </div>}
    </section>
  );
}
