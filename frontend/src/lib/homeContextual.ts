const HOME_INITIALIZED = 'homeContextualInitialized';

let activeCleanup: (() => void) | undefined;
let initializationFrame: number | undefined;

function indexOf(element: Element, name: string) {
  return Number(element.getAttribute(name) || 0);
}

function setupReveals(root: HTMLElement) {
  document.documentElement.classList.add('has-reveal');
  const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  elements.forEach((element, index) => element.style.setProperty('--reveal-index', String(index % 5)));
  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return () => {};
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}

function setupBrand(root: HTMLElement, abortSignal: AbortSignal) {
  const section = root.querySelector<HTMLElement>('[data-brand-transition]');
  const panel = root.querySelector<HTMLElement>('[data-brand-panel]');
  if (!section || !panel) return;
  const update = () => {
    const rect = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    panel.style.setProperty('--brand-shift', `${progress * -6}vh`);
    panel.style.setProperty('--brand-scale', String(1 - progress * 0.035));
    panel.style.setProperty('--brand-fade', String(1 - progress * 0.58));
  };
  update();
  window.addEventListener('scroll', update, { passive: true, signal: abortSignal });
  window.addEventListener('resize', update, { passive: true, signal: abortSignal });
}

function setupSolutions(root: HTMLElement, abortSignal: AbortSignal) {
  const section = root.querySelector<HTMLElement>('[data-home-solutions]');
  if (!section) return;
  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-home-solution-tab]'));
  const panels = Array.from(section.querySelectorAll<HTMLElement>('[data-home-solution-panel]'));
  const stage = section.querySelector<HTMLElement>('[data-home-solution-stage]');
  const signal = section.querySelector<HTMLElement>('[data-home-solution-signal]');
  const activate = (active: number) => {
    tabs.forEach((tab) => {
      const selected = indexOf(tab, 'data-home-solution-tab') === active;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    panels.forEach((panel) => {
      panel.hidden = indexOf(panel, 'data-home-solution-panel') !== active;
    });
    const activeTab = tabs.find((tab) => indexOf(tab, 'data-home-solution-tab') === active);
    if (stage) stage.textContent = activeTab?.querySelector('small')?.textContent || '';
    if (signal) signal.textContent = activeTab?.dataset.signal || '';
  };
  tabs.forEach((tab) => {
    const activateTab = () => activate(indexOf(tab, 'data-home-solution-tab'));
    tab.addEventListener('click', activateTab, { signal: abortSignal });
    tab.addEventListener('focus', activateTab, { signal: abortSignal });
    tab.addEventListener('mouseenter', activateTab, { signal: abortSignal });
  });
}

function setupCapabilities(root: HTMLElement, abortSignal: AbortSignal) {
  const track = root.querySelector<HTMLElement>('[data-home-capabilities]');
  if (!track) return;
  const tabs = Array.from(track.querySelectorAll<HTMLButtonElement>('[data-home-capability-tab]'));
  const panels = Array.from(track.querySelectorAll<HTMLElement>('[data-home-capability-panel]'));
  const rail = track.querySelector<HTMLElement>('[data-home-capability-rail]');
  const number = track.querySelector<HTMLElement>('[data-home-capability-number]');
  const label = track.querySelector<HTMLElement>('[data-home-capability-label]');
  let active = Math.max(0, tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true'));
  let wheelTotal = 0;
  let lockedUntil = 0;
  const activate = (next: number) => {
    active = Math.max(0, Math.min(tabs.length - 1, next));
    tabs.forEach((tab) => {
      const selected = indexOf(tab, 'data-home-capability-tab') === active;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    panels.forEach((panel) => {
      panel.hidden = indexOf(panel, 'data-home-capability-panel') !== active;
    });
    if (rail) {
      Array.from({ length: tabs.length }, (_, index) => index + 1)
        .forEach((value) => rail.classList.toggle(`capability-active-${value}`, value === active + 1));
      rail.style.setProperty('--capability-angle', `${51 + active * 72}deg`);
    }
    if (number) number.textContent = String(active + 1).padStart(2, '0');
    if (label) label.textContent = tabs[active]?.dataset.label || '';
  };
  tabs.forEach((tab) => tab.addEventListener(
    'click',
    () => activate(indexOf(tab, 'data-home-capability-tab')),
    { signal: abortSignal }
  ));
  track.addEventListener('wheel', (event) => {
    if (window.matchMedia('(max-width: 960px)').matches || Date.now() < lockedUntil) return;
    const rect = track.getBoundingClientRect();
    const inPinnedRange = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
    if (!inPinnedRange) return;
    wheelTotal += event.deltaY;
    if (Math.abs(wheelTotal) < 560) return;
    const direction = Math.sign(wheelTotal);
    wheelTotal = 0;
    const next = active + direction;
    if (next < 0 || next >= tabs.length) return;
    event.preventDefault();
    activate(next);
    lockedUntil = Date.now() + 620;
  }, { passive: false, signal: abortSignal });
}

function setupSupport(root: HTMLElement, abortSignal: AbortSignal) {
  const section = root.querySelector<HTMLElement>('[data-home-support]');
  if (!section) return;
  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-home-support-tab]'));
  const panels = Array.from(section.querySelectorAll<HTMLElement>('[data-home-support-panel]'));
  const activate = (active: number) => {
    tabs.forEach((tab) => {
      const selected = indexOf(tab, 'data-home-support-tab') === active;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    panels.forEach((panel) => {
      panel.hidden = indexOf(panel, 'data-home-support-panel') !== active;
    });
  };
  tabs.forEach((tab) => {
    const activateTab = () => activate(indexOf(tab, 'data-home-support-tab'));
    tab.addEventListener('click', activateTab, { signal: abortSignal });
    tab.addEventListener('focus', activateTab, { signal: abortSignal });
    tab.addEventListener('mouseenter', activateTab, { signal: abortSignal });
  });
}

function initializeHome() {
  const root = document.querySelector<HTMLElement>('[data-home-contextual]');
  activeCleanup?.();
  activeCleanup = undefined;
  if (!root) return;

  const controller = new AbortController();
  const cleanupReveals = setupReveals(root);
  root.dataset[HOME_INITIALIZED] = 'true';
  setupBrand(root, controller.signal);
  setupSolutions(root, controller.signal);
  setupCapabilities(root, controller.signal);
  setupSupport(root, controller.signal);

  activeCleanup = () => {
    controller.abort();
    cleanupReveals();
    delete root.dataset[HOME_INITIALIZED];
  };
}

function scheduleInitialization() {
  if (initializationFrame !== undefined) cancelAnimationFrame(initializationFrame);
  initializationFrame = requestAnimationFrame(() => {
    initializationFrame = undefined;
    initializeHome();
  });
}

function observeHomeReplacements() {
  const observer = new MutationObserver((mutations) => {
    const root = document.querySelector<HTMLElement>('[data-home-contextual]');
    const affectsHome = mutations.some((mutation) => Array.from(mutation.addedNodes).some((node) => {
      if (!(node instanceof Element)) return false;
      return node.matches('[data-home-contextual]')
        || Boolean(node.querySelector('[data-home-contextual]'))
        || Boolean(root?.contains(node));
    }));
    if (affectsHome) scheduleInitialization();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeHome();
    observeHomeReplacements();
  }, { once: true });
} else {
  initializeHome();
  observeHomeReplacements();
}
document.addEventListener('astro:page-load', scheduleInitialization);
