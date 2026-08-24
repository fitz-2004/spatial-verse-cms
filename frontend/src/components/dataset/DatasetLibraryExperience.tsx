import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent
} from 'react';

export type DatasetCategory = 'model' | 'scene' | 'image';

export interface DatasetDownload {
  label: string;
  url: string;
}

export interface DatasetItem {
  id: string;
  category: DatasetCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  description: string;
  formats: string[];
  tags: string[];
  previewUrl?: string;
  galleryUrls: string[];
  downloads: DatasetDownload[];
}

export interface DatasetLibraryCopy {
  eyebrow: string;
  title: string;
  description: string;
  searchLabel: string;
  searchPlaceholder: string;
  filterAllLabel: string;
  filterModelLabel: string;
  filterSceneLabel: string;
  filterImageLabel: string;
  emptyTitle: string;
  emptyText: string;
  downloadHeading: string;
  downloadButtonLabel: string;
  unavailableLabel: string;
}

interface DatasetLibraryExperienceProps {
  items: DatasetItem[];
  copy: DatasetLibraryCopy;
}

type FilterId = 'all' | DatasetCategory;

const categoryFilters: Array<{
  id: FilterId;
  labelKey: keyof DatasetLibraryCopy;
}> = [
  {
    id: 'all',
    labelKey: 'filterAllLabel'
  },
  {
    id: 'model',
    labelKey: 'filterModelLabel'
  },
  {
    id: 'scene',
    labelKey: 'filterSceneLabel'
  },
  {
    id: 'image',
    labelKey: 'filterImageLabel'
  }
];

function DatasetMedia({
  item,
  imageUrl,
  compact = false
}: {
  item: DatasetItem;
  imageUrl?: string;
  compact?: boolean;
}) {
  return (
    <div className="dataset-cms-media-slot">
      {imageUrl ? (
        <img
          className="dataset-library-image"
          src={imageUrl}
          alt={`${item.title}预览图`}
          loading="lazy"
        />
      ) : (
        <div
          className={`dataset-library-placeholder ${compact ? 'is-compact' : ''}`}
          aria-label={`${item.title}暂无预览图`}
        >
          <div className="dataset-placeholder-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>IMAGE SLOT / CMS</span>
          <strong>{item.id.slice(0, 2).toUpperCase()}</strong>
          <small>暂无预览图</small>
        </div>
      )}
    </div>
  );
}

export default function DatasetLibraryExperience({
  items,
  copy
}: DatasetLibraryExperienceProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DatasetItem | null>(null);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
  const [selectedDownloadIndex, setSelectedDownloadIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const closeDataset = () => {
    setSelected(null);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  };

  useEffect(() => {
    if (!selected) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDataset();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('dataset-modal-open');
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('dataset-modal-open');
    };
  }, [selected]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
      const searchable = [
        item.title,
        item.summary,
        item.description,
        item.categoryLabel,
        ...item.tags,
        ...item.formats,
        ...item.downloads.map((download) => download.label)
      ].join(' ').toLowerCase();
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [
    activeFilter,
    items,
    query
  ]);

  const openDataset = (item: DatasetItem) => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setSelected(item);
    setSelectedPreviewIndex(0);
    setSelectedDownloadIndex(0);
  };

  const openFromKeyboard = (
    event: ReactKeyboardEvent<HTMLElement>,
    item: DatasetItem
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDataset(item);
    }
  };

  const selectedGallery = selected
    ? (
      selected.galleryUrls.length
        ? selected.galleryUrls
        : selected.previewUrl
          ? [ selected.previewUrl ]
          : []
    )
    : [];
  const selectedPreview = selectedGallery[selectedPreviewIndex]
    || selected?.previewUrl;
  const selectedDownload = selected?.downloads[selectedDownloadIndex];

  return (
    <section
      className="dataset-library-section dataset-library-apple"
      aria-labelledby="dataset-library-title"
    >
      <div className="content-width">
        <div className="dataset-library-toolbar">
          <div>
            <p className="section-index">{copy.eyebrow}</p>
            <h2 id="dataset-library-title">{copy.title}</h2>
            <p>{copy.description}</p>
          </div>
          <label className="dataset-search dataset-apple-search">
            <span>{copy.searchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
            />
            <b aria-hidden="true">⌕</b>
            {query && (
              <button
                type="button"
                aria-label="清空搜索"
                onClick={() => setQuery('')}
              >
                ×
              </button>
            )}
          </label>
        </div>

        <div className="dataset-library-controls dataset-apple-controls">
          <div
            className="dataset-filter-tabs dataset-apple-segmented"
            role="tablist"
            aria-label="数据集分类"
          >
            {categoryFilters.map((filter) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === filter.id}
                className={activeFilter === filter.id ? 'is-active' : ''}
                onClick={() => setActiveFilter(filter.id)}
                key={filter.id}
              >
                {copy[filter.labelKey]}
                <span>
                  {filter.id === 'all'
                    ? items.length
                    : items.filter((item) => item.category === filter.id).length}
                </span>
              </button>
            ))}
          </div>
          <span className="dataset-result-count" aria-live="polite">
            {String(filteredItems.length).padStart(2, '0')} RESULTS
          </span>
        </div>

        {filteredItems.length ? (
          <div className="dataset-library-grid">
            {filteredItems.map((item, index) => (
              <article
                className="dataset-library-card dataset-apple-card"
                style={{ '--dataset-index': index } as CSSProperties}
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => openDataset(item)}
                onKeyDown={(event) => openFromKeyboard(event, item)}
              >
                <div className="dataset-library-card-media">
                  <DatasetMedia item={item} imageUrl={item.previewUrl} />
                  <span className="dataset-card-code">{item.categoryLabel}</span>
                </div>
                <div className="dataset-library-card-copy">
                  <div>
                    <span>
                      {item.category.toUpperCase()} / {item.formats.join(' · ')}
                    </span>
                    <b aria-hidden="true">↗</b>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="dataset-card-tags">
                    {item.tags.map((tag) => <small key={tag}>{tag}</small>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="dataset-empty-state">
            <strong>{copy.emptyTitle}</strong>
            <p>{copy.emptyText}</p>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="dataset-lightbox-backdrop dataset-apple-backdrop"
          role="presentation"
          onMouseDown={closeDataset}
        >
          <div
            className="dataset-lightbox dataset-apple-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dataset-lightbox-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              className="dataset-lightbox-close"
              type="button"
              onClick={closeDataset}
              aria-label="关闭数据集详情"
            >
              ×
            </button>
            <div className="dataset-lightbox-media">
              <DatasetMedia
                item={selected}
                imageUrl={selectedPreview}
                compact
              />
              {selectedGallery.length > 1 && (
                <div className="dataset-lightbox-thumbs">
                  {selectedGallery.map((imageUrl, index) => (
                    <button
                      type="button"
                      className={index === selectedPreviewIndex ? 'is-active' : ''}
                      onClick={() => setSelectedPreviewIndex(index)}
                      aria-label={`查看第 ${index + 1} 张预览图`}
                      key={imageUrl}
                    >
                      <img src={imageUrl} alt="" />
                    </button>
                  ))}
                </div>
              )}
              <p>MEDIA PREVIEW / {selected.categoryLabel}</p>
            </div>
            <div className="dataset-lightbox-info">
              <p className="section-index">
                DATASET / {selected.category.toUpperCase()}
              </p>
              <h2 id="dataset-lightbox-title">{selected.title}</h2>
              <p className="dataset-lightbox-description">{selected.description}</p>
              {selected.downloads.length > 0 && (
                <div className="dataset-download-form">
                  <span>{copy.downloadHeading}</span>
                  <div>
                    {selected.downloads.map((download, index) => (
                      <label key={`${download.label}-${download.url}`}>
                        <input
                          type="radio"
                          name={`dataset-download-${selected.id}`}
                          checked={selectedDownloadIndex === index}
                          onChange={() => setSelectedDownloadIndex(index)}
                        />
                        {download.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {selectedDownload ? (
                <a
                  className="dataset-download-button"
                  href={selectedDownload.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.downloadButtonLabel} <span>↓</span>
                </a>
              ) : (
                <span className="dataset-download-unavailable">
                  {copy.unavailableLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
