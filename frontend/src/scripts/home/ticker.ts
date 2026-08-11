// The ticker's copy, duplicate sequence, 26s duration and motion are fixed in
// the Astro component and CSS. This hook only restores playback after a tab is
// made visible; it does not expose content or timing as editable data.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  document.querySelectorAll<HTMLElement>('.ticker-track').forEach((track) => {
    track.getAnimations().forEach((animation) => animation.play());
  });
});
