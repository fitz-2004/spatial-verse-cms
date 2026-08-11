let capabilitySwitchTimer: number | undefined;

function updateCapabilityStatus() {
  const capabilityStatus = document.querySelector<HTMLElement>('#capability-status');
  const activeCapabilityButton = document.querySelector<HTMLButtonElement>('.capability-item[data-video][aria-pressed="true"]');
  if (!capabilityStatus || !activeCapabilityButton) return;
  const title = activeCapabilityButton.querySelector('h3')?.textContent || '';
  const nextStatus = `${title} / LIVE`;
  if (capabilityStatus.textContent !== nextStatus) capabilityStatus.textContent = nextStatus;
}

function selectCapability(button: HTMLButtonElement) {
  const capabilityVideo = document.querySelector<HTMLVideoElement>('#capability-video');
  const capabilityMedia = document.querySelector<HTMLElement>('#capability-media');
  const capabilityButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.capability-item[data-video]'));
  if (!capabilityVideo || !capabilityMedia) return;
  capabilityButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  updateCapabilityStatus();

  const nextVideo = button.dataset.video;
  if (!nextVideo || capabilityVideo.dataset.activeVideo === nextVideo) {
    capabilityVideo.play().catch(() => {});
    return;
  }

  window.clearTimeout(capabilitySwitchTimer);
  capabilityMedia.classList.add('is-switching');
  capabilityVideo.pause();
  capabilityVideo.dataset.activeVideo = nextVideo;
  capabilityVideo.src = nextVideo;

  const finishSwitch = () => {
    if (capabilityVideo.dataset.activeVideo !== nextVideo) return;
    capabilityMedia.classList.remove('is-switching');
    capabilityVideo.play().catch(() => {});
  };
  capabilityVideo.addEventListener('loadeddata', finishSwitch, { once: true });
  capabilityVideo.load();
  capabilitySwitchTimer = window.setTimeout(finishSwitch, 1800);
}

function capabilityButtonFromEvent(event: Event) {
  return event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>('.capability-item[data-video]')
    : null;
}

document.addEventListener('pointerover', (event) => {
  const button = capabilityButtonFromEvent(event);
  if (button) selectCapability(button);
});
document.addEventListener('focusin', (event) => {
  const button = capabilityButtonFromEvent(event);
  if (button) selectCapability(button);
});
document.addEventListener('click', (event) => {
  const button = capabilityButtonFromEvent(event);
  if (button) selectCapability(button);
});
document.addEventListener('spatialverse:languagechange', updateCapabilityStatus);
updateCapabilityStatus();
