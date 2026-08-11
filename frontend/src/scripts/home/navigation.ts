function currentNavigation() {
  return {
    menuButton: document.querySelector<HTMLButtonElement>('.menu-toggle'),
    siteNav: document.querySelector<HTMLElement>('.nav-links'),
    navDropdown: document.querySelector<HTMLElement>('.nav-dropdown'),
    navDropdownTrigger: document.querySelector<HTMLButtonElement>('.nav-dropdown-trigger')
  };
}

function closeNavDropdown() {
  const { navDropdown, navDropdownTrigger } = currentNavigation();
  navDropdown?.classList.remove('open');
  navDropdownTrigger?.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const { menuButton, siteNav, navDropdown, navDropdownTrigger } = currentNavigation();

  if (event.target.closest('.nav-dropdown-trigger') && navDropdownTrigger) {
    const open = !navDropdown?.classList.contains('open');
    navDropdown?.classList.toggle('open', open);
    navDropdownTrigger.setAttribute('aria-expanded', String(open));
    return;
  }

  if (event.target.closest('.menu-toggle') && menuButton) {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'CLOSE' : 'MENU';
    siteNav?.classList.toggle('open', open);
    if (!open) closeNavDropdown();
    return;
  }

  if (event.target.closest('.nav-links a')) {
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'MENU';
    siteNav?.classList.remove('open');
    closeNavDropdown();
    return;
  }

  if (navDropdown && !navDropdown.contains(event.target)) closeNavDropdown();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNavDropdown();
    currentNavigation().navDropdownTrigger?.focus();
  }
});
