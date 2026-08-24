import { useEffect, useState } from 'react';

export default function AboutMetricCounter({ value }: { value: string }) {
  const match = String(value).match(/([\d.]+)(.*)/);
  const target = Number(match?.[1] || 0);
  const suffix = match?.[2] || '';
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = performance.now(); const duration = 850;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setCurrent(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [target]);
  const number = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
  return <strong>{number}{suffix}</strong>;
}
