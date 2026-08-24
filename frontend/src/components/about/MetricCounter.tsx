import { useEffect, useState } from 'react';

function splitMetric(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);
  return match ? { amount: Number(match[1]), suffix: match[2] } : { amount: 0, suffix: value };
}

function formatAmount(amount: number, original: number) {
  if (original % 1 !== 0) {
    return amount.toFixed(1);
  }
  return Math.round(amount).toLocaleString('en-US');
}

export default function MetricCounter({ value }: { value: string }) {
  const [metric, setMetric] = useState(value);

  useEffect(() => {
    const { amount: target, suffix } = splitMetric(value);
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMetric(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 1150;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setMetric(`${formatAmount(target * eased, target)}${suffix}`);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <strong className="metric-counter" aria-label={value}>{metric}</strong>;
}
