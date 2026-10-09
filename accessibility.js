/* Preferências locais de visualização e acessibilidade. */
(() => {
  const STORAGE_KEY = 'milenio-accessibility-v1';
  const MIN_ZOOM = 80;
  const MAX_ZOOM = 140;
  let prefs = loadPreferences();

  function loadPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {};
      const value = Number(saved.zoom);
      return {
        theme: saved.theme === 'dark' ? 'dark' : 'light',
        zoom: Number.isFinite(value) ? clampZoom(value) : 100,
        colorblind: Boolean(saved.colorblind)
      };
    } catch {
      return { theme: 'light', zoom: 100, colorblind: false };
    }
  }

  function clampZoom(value) {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(value / 10) * 10));
  }

  function savePreferences() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { /* controles continuam funcionando nesta sessão */ }
  }

  function updateButtons() {
    document.querySelectorAll('[data-a11y="theme-light"], [data-a11y="theme-dark"]').forEach(button => {
      const active = button.dataset.a11y === `theme-${prefs.theme}`;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('a11y-selected', active);
    });
    const zoom = document.getElementById('zoomLevel');
    if (zoom) {
      const label = `${prefs.zoom}%`;
      if (zoom.textContent !== label) zoom.textContent = label;
    }
    const zoomOut = document.querySelector('[data-a11y="zoom-out"]');
    const zoomIn = document.querySelector('[data-a11y="zoom-in"]');
    if (zoomOut) zoomOut.disabled = prefs.zoom <= MIN_ZOOM;
    if (zoomIn) zoomIn.disabled = prefs.zoom >= MAX_ZOOM;
    const colorButton = document.querySelector('[data-a11y="colorblind"]');
    if (colorButton) {
      colorButton.setAttribute('aria-pressed', String(prefs.colorblind));
      colorButton.classList.toggle('a11y-selected', prefs.colorblind);
      colorButton.title = prefs.colorblind
        ? 'Desativar a paleta de cores amigável para daltonismo'
        : 'Ativar paleta de cores amigável para daltonismo';
    }
  }

  function applyPreferences() {
    document.body.dataset.theme = prefs.theme;
    document.documentElement.dataset.colorblind = prefs.colorblind ? 'on' : 'off';
    document.documentElement.style.fontSize = `${prefs.zoom}%`;
    updateButtons();
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-a11y]');
    if (!button) return;
    event.preventDefault();
    switch (button.dataset.a11y) {
      case 'theme-light': prefs.theme = 'light'; break;
      case 'theme-dark': prefs.theme = 'dark'; break;
      case 'zoom-in': prefs.zoom = clampZoom(prefs.zoom + 10); break;
      case 'zoom-out': prefs.zoom = clampZoom(prefs.zoom - 10); break;
      case 'colorblind': prefs.colorblind = !prefs.colorblind; break;
      default: return;
    }
    savePreferences();
    applyPreferences();
  });

  new MutationObserver(updateButtons).observe(document.body, { childList: true, subtree: true });
  applyPreferences();
})();
