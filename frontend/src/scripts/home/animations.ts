const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const initializedControls = new WeakSet<HTMLElement>();
const initializedRevealItems = new WeakSet<HTMLElement>();

const revealObserver = !reducedMotion && 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver?.unobserve(entry.target);
        }
      });
    }, { threshold: .12 })
  : null;

function initializeControl(control: HTMLElement) {
  if (reducedMotion || initializedControls.has(control)) return;
  initializedControls.add(control);

  control.addEventListener('pointermove', (event) => {
    const bounds = control.getBoundingClientRect();
    control.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
    control.style.setProperty('--my', `${event.clientY - bounds.top}px`);
  });
  control.addEventListener('click', () => {
    control.animate([
      { filter: 'brightness(1)', boxShadow: '0 0 0 rgba(89,236,255,0)' },
      { filter: 'brightness(1.45)', boxShadow: '0 0 48px rgba(89,236,255,.62)' },
      { filter: 'brightness(1)', boxShadow: '0 0 18px rgba(139,114,255,.2)' }
    ], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
  });
}

function initializeRevealItem(item: HTMLElement) {
  if (initializedRevealItems.has(item)) return;
  initializedRevealItems.add(item);

  if (!revealObserver) {
    item.classList.add('is-visible');
    return;
  }
  revealObserver.observe(item);
}

function initializeAnimatedContent(root: ParentNode) {
  if (root instanceof HTMLElement) {
    if (root.matches('.nav-cta, .button, .language-switch button, .menu-toggle')) initializeControl(root);
    if (root.matches('.reveal')) initializeRevealItem(root);
  }
  root.querySelectorAll<HTMLElement>('.nav-cta, .button, .language-switch button, .menu-toggle').forEach(initializeControl);
  root.querySelectorAll<HTMLElement>('.reveal').forEach(initializeRevealItem);
}

initializeAnimatedContent(document);

// Apostrophe swaps the page DOM when toggling Edit and Preview without
// re-running page scripts. Reinitialize only the newly inserted content.
const contentObserver = new MutationObserver((records) => {
  records.forEach((record) => {
    record.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) initializeAnimatedContent(node);
    });
  });
});
contentObserver.observe(document.body, { childList: true, subtree: true });
