import MetricCounter from './MetricCounter';

export interface AboutMetricItem {
  value: string;
  label: string;
}

export default function AboutMetrics({ items }: { items: AboutMetricItem[] }) {
  return (
    <div className="about-metric-grid">
      {items.map((metric) => (
        <div className="about-metric" key={`${metric.label}-${metric.value}`}>
          <MetricCounter value={metric.value} />
          <span>{metric.label}</span>
        </div>
      ))}
    </div>
  );
}
