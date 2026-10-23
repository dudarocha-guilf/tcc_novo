(() => {
  const storageKey = 'letrikaTema';
  const root = document.documentElement;
  let theme = 'light';

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'dark' || savedTheme === 'light') theme = savedTheme;
  } catch {
    theme = 'light';
  }

  root.dataset.theme = theme;

  function updateButton(button) {
    const dark = root.dataset.theme === 'dark';
    button.textContent = dark ? '☀ Claro' : '☾ Escuro';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
    button.title = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
  }

  function mountButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle btn btn-small';
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(storageKey, root.dataset.theme);
      } catch {
        // Theme still changes for the current page if storage is unavailable.
      }
      updateButton(button);
    });
    updateButton(button);

    const nav = document.querySelector('.topbar nav');
    const logoutButton = nav?.querySelector('#logoutBtn');
    if (nav) nav.insertBefore(button, logoutButton || null);
    else {
      button.classList.add('theme-toggle-fixed');
      document.body.appendChild(button);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountButton, { once: true });
  } else {
    mountButton();
  }
})();