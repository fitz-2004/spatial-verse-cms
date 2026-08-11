document.addEventListener('submit', (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== 'contact-form') return;
  event.preventDefault();
  const note = event.target.querySelector<HTMLElement>('.form-note');
  const language = document.documentElement.dataset.spatialVerseLanguage;
  const copyNode = document.querySelector<HTMLScriptElement>('#spatial-verse-copy');
  try {
    const copy = copyNode?.textContent ? JSON.parse(copyNode.textContent) : {};
    const message = copy?.[language === 'en' ? 'en' : 'zh']?.['contact.success'];
    if (note) note.textContent = typeof message === 'string' ? message : '';
  } catch {
    if (note) note.textContent = '';
  }
});
