import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

export interface Capability {
  number: string;
  label: string;
  title: string;
  text: string;
}

const capabilityAccents = ['cyan', 'purple', 'acid', 'pink'] as const;

interface CapabilityNavigationProps {
  capabilities: Capability[];
}

export default function CoreCapabilityNavigation({ capabilities }: CapabilityNavigationProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const panels = capabilities
      .map((_, index) => document.getElementById(`core-capability-${index + 1}`))
      .filter((panel): panel is HTMLElement => panel instanceof HTMLElement);

    if (!panels.length) return;
    const capabilityStack = document.querySelector<HTMLElement>('.core-capability-stack');
    if (!capabilityStack) return;

    let frame = 0;
    const updateActivePanel = () => {
      frame = 0;
      const stackBounds = capabilityStack.getBoundingClientRect();
      setIsVisible(stackBounds.top < window.innerHeight * 0.9 && stackBounds.bottom > window.innerHeight * 0.1);
      const viewportCenter = window.innerHeight * 0.5;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      panels.forEach((panel, index) => {
        const bounds = panel.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height * 0.5 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex((current) => current === closestIndex ? current : closestIndex);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActivePanel);
    };

    updateActivePanel();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [capabilities]);

  const activeCapability = capabilities[activeIndex];
  if (!activeCapability) return null;

  const gearStyle = { '--gear-angle': `${activeIndex * 90}deg` } as CSSProperties;

  return (
    <nav className={`core-capability-gear-nav ${isVisible ? 'is-visible' : ''}`} data-accent={capabilityAccents[activeIndex]} aria-label="核心能力导航" style={gearStyle}>
      <div className="core-capability-gear-dock">
        <div className="core-capability-gear-assembly" aria-hidden="true">
          <span className="core-capability-gear-ring" />
          <span className="core-capability-gear-ring core-capability-gear-ring-inner" />
          <span className="core-capability-gear-pointer" />
          <span className="core-capability-gear-center"><i>CORE</i><b>{activeCapability.number}</b></span>
        </div>

        <div className="core-capability-gear-items">
          {capabilities.map((capability, index) => (
            <a
              className={`core-capability-gear-item ${index === activeIndex ? 'is-active' : ''}`}
              data-accent={capabilityAccents[index]}
              href={`#core-capability-${index + 1}`}
              key={capability.number}
              aria-current={index === activeIndex ? 'step' : undefined}
            >
              <span>{capability.number}</span>
              <b>{capability.title}</b>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}