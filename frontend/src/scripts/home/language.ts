type CopyDictionary = Record<'zh' | 'en', Record<string, string>>;

function readCopy(): CopyDictionary {
  const copyNode = document.querySelector<HTMLScriptElement>('#spatial-verse-copy');
  try {
    return copyNode?.textContent
      ? JSON.parse(copyNode.textContent) as CopyDictionary
      : { zh: {}, en: {} };
  } catch {
    return { zh: {}, en: {} };
  }
}

let copy = readCopy();

let currentLanguage: 'zh' | 'en' = 'zh';
try {
  const savedLanguage = localStorage.getItem('spatialVerseLanguage');
  if (savedLanguage === 'en' || savedLanguage === 'zh') currentLanguage = savedLanguage;
} catch {
  // Storage can be unavailable in strict privacy modes; Chinese remains default.
}

function applyLanguage(language: 'zh' | 'en') {
  copy = readCopy();
  currentLanguage = language;
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.documentElement.dataset.spatialVerseLanguage = language;
  const pageTitle = copy[language]?.['page.title'];
  if (pageTitle) document.title = pageTitle;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    const value = key ? copy[language]?.[key] : undefined;
    if (value !== undefined) element.textContent = value;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((element) => {
    const key = element.dataset.i18nHtml;
    const value = key ? copy[language]?.[key] : undefined;
    if (value !== undefined) element.innerHTML = value;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    const value = key ? copy[language]?.[key] : undefined;
    if (value !== undefined) element.setAttribute('placeholder', value);
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-alt]').forEach((element) => {
    const key = element.dataset.i18nAlt;
    const value = key ? copy[language]?.[key] : undefined;
    if (value !== undefined) element.setAttribute('alt', value);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-language]').forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  try { localStorage.setItem('spatialVerseLanguage', language); } catch {}
  document.dispatchEvent(new CustomEvent('spatialverse:languagechange'));
}

function translateAddedContent(root: HTMLElement) {
  copy = readCopy();
  const elements = [ root, ...root.querySelectorAll<HTMLElement>('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-alt]') ];
  elements.forEach((element) => {
    const textKey = element.dataset.i18n;
    const htmlKey = element.dataset.i18nHtml;
    const placeholderKey = element.dataset.i18nPlaceholder;
    const altKey = element.dataset.i18nAlt;
    if (textKey) {
      const value = copy[currentLanguage]?.[textKey];
      if (value !== undefined && element.textContent !== value) element.textContent = value;
    }
    if (htmlKey) {
      const value = copy[currentLanguage]?.[htmlKey];
      if (value !== undefined && element.innerHTML !== value) element.innerHTML = value;
    }
    if (placeholderKey) {
      const value = copy[currentLanguage]?.[placeholderKey];
      if (value !== undefined && element.getAttribute('placeholder') !== value) element.setAttribute('placeholder', value);
    }
    if (altKey) {
      const value = copy[currentLanguage]?.[altKey];
      if (value !== undefined && element.getAttribute('alt') !== value) element.setAttribute('alt', value);
    }
  });
}

document.addEventListener('click', (event) => {
  const button = event.target instanceof Element
    ? event.target.closest<HTMLButtonElement>('[data-language]')
    : null;
  if (button) applyLanguage(button.dataset.language === 'en' ? 'en' : 'zh');
});

applyLanguage(currentLanguage);

const languageContentObserver = new MutationObserver((records) => {
  let addedElement = false;
  records.forEach((record) => {
    record.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        addedElement = true;
        if (node.id === 'spatial-verse-copy' || node.querySelector('#spatial-verse-copy')) copy = readCopy();
        translateAddedContent(node);
      }
    });
  });
  if (addedElement) document.dispatchEvent(new CustomEvent('spatialverse:languagechange'));
});
languageContentObserver.observe(document.body, { childList: true, subtree: true });
