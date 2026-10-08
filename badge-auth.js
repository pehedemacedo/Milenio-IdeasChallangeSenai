/* Login demonstrativo por QR de crachá. O perfil fica restrito a esta aba. */
(() => {
  const SESSION_KEY = 'milenio-demo-badge-session';
  const BADGES = [
    { id: 'SUP-001', payload: 'MILENIO|CRACHA|SUP-001', name: 'Ana Souza', role: 'supervisor' },
    { id: 'OP-001', payload: 'MILENIO|CRACHA|OP-001', name: 'Carlos Lima', role: 'operator' }
  ];
  const OPERATOR_VIEWS = new Set(['painel', 'ops', 'maquinas', 'desenhos', 'paradas']);
  const SUPERVISOR_ACTIONS = new Set([
    'new-op', 'new-machine', 'settings', 'new-drawing', 'set-drawing',
    'prepare-transfer', 'transfer-download', 'transfer-copy', 'ack', 'print',
    'qr-open', 'op-finish'
  ]);
  let activeBadge = loadSession();
  let cameraStream = null;
  let cameraFrame = 0;
  let lastDecodeAt = 0;
  let scanCanvas = null;

  function loadSession() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      return BADGES.find(b => b.id === saved?.badgeId) || null;
    } catch { return null; }
  }

  function roleName(role) {
    return role === 'supervisor' ? 'Supervisor' : 'Operador';
  }

  function isLoggedIn() { return Boolean(activeBadge); }
  function profile() { return activeBadge ? { ...activeBadge } : null; }

  function canView(view) {
    if (!activeBadge) return false;
    if (activeBadge.role === 'supervisor') {
      return ['painel', 'ops', 'maquinas', 'desenhos', 'paradas', 'alertas', 'qrcodes', 'integracao', 'qr-detail'].includes(view);
    }
    return OPERATOR_VIEWS.has(view);
  }

  function canAction(action) {
    if (!activeBadge) return false;
    return activeBadge.role === 'supervisor' || !SUPERVISOR_ACTIONS.has(action);
  }

  function loginMarkup() {
    return `<div class="badge-login-layout">
      <header class="badge-login-brand">
        <img src="assets/logo.png" alt="Milênio" class="badge-login-logo">
        <div><div class="brand-name">Milênio <small>CHÃO DE FÁBRICA</small></div></div>
      </header>
      <div class="row g-3 align-items-stretch">
        <div class="col-12 col-lg-8 col-xl-7 mx-auto">
          <section class="panel-card badge-login-card h-100">
            <div class="eyebrow">ACESSO POR CRACHÁ</div>
            <h1 class="badge-login-title">Entre com seu crachá</h1>
            <p class="section-subtitle mb-3">Aponte a câmera para o QR Code. O sistema abre o perfil vinculado ao crachá.</p>
            <div id="badgeFeedback" class="alert alert-secondary py-2 small" role="status">Ative a câmera e escaneie o QR do crachá cadastrado.</div>
            <div class="badge-camera-frame">
              <video id="badgeVideo" class="badge-video" autoplay playsinline muted aria-label="Câmera para leitura do QR do crachá"></video>
              <div id="badgeCameraPlaceholder" class="badge-camera-placeholder">
                <div class="badge-camera-icon">▦</div>
                <strong>Câmera desligada</strong>
                <span>Ela só será ativada quando você tocar em “Escanear crachá”.</span>
              </div>
            </div>
            <div class="d-flex flex-wrap gap-2 mt-3">
              <button type="button" class="btn btn-primary" data-action="badge-scan-start">Escanear crachá</button>
              <button type="button" class="btn btn-outline-secondary" data-action="badge-scan-stop" hidden>Parar câmera</button>
            </div>
          </section>
        </div>
      </div>
      <p class="badge-login-disclaimer"><strong>Protótipo:</strong> somente os códigos cadastrados em <code>badge-auth.js</code> são aceitos. A câmera é usada localmente para ler o QR; este login não é uma autenticação segura.</p>
    </div>`;
  }

  function mount(root) {
    if (cameraStream) stopCamera();
    document.body.classList.add('badge-locked');
    const nav = document.querySelector('.navbar');
    if (nav) nav.hidden = true;
    root.classList.add('badge-login-root');
    root.innerHTML = loginMarkup();
  }

  function prepareApp() {
    document.body.classList.remove('badge-locked');
    const root = document.getElementById('viewRoot');
    if (root) root.classList.remove('badge-login-root');
    const nav = document.querySelector('.navbar');
    if (nav) nav.hidden = false;
    const profileLabel = document.getElementById('badgeProfile');
    if (profileLabel && activeBadge) profileLabel.textContent = `${activeBadge.name} · ${roleName(activeBadge.role)}`;
    const logout = document.querySelector('[data-action="badge-logout"]');
    if (logout) logout.hidden = !activeBadge;
  }

  function afterRender() {
    prepareApp();
    document.querySelectorAll('[data-view]').forEach(el => {
      el.hidden = !canView(el.dataset.view);
    });
    document.querySelectorAll('[data-action]').forEach(el => {
      if (SUPERVISOR_ACTIONS.has(el.dataset.action)) el.hidden = !canAction(el.dataset.action);
    });
    const logout = document.querySelector('[data-action="badge-logout"]');
    if (logout) logout.hidden = !activeBadge;
  }

  function showFeedback(message, type = 'secondary') {
    const el = document.getElementById('badgeFeedback');
    if (!el) return;
    el.className = `alert alert-${type} py-2 small`;
    el.textContent = message;
  }

  function acceptPayload(payload) {
    const normalized = String(payload || '').trim();
    const badge = BADGES.find(b => b.payload === normalized);
    if (!badge) {
      showFeedback('QR não reconhecido. Confira se o código deste crachá está cadastrado no app.', 'warning');
      return false;
    }
    activeBadge = badge;
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ badgeId: badge.id })); } catch { /* sessão somente em memória */ }
    stopCamera();
    window.dispatchEvent(new CustomEvent('badge-auth-change', { detail: { loggedIn: true } }));
    return true;
  }

  async function startCamera() {
    const video = document.getElementById('badgeVideo');
    const placeholder = document.getElementById('badgeCameraPlaceholder');
    const start = document.querySelector('[data-action="badge-scan-start"]');
    const stop = document.querySelector('[data-action="badge-scan-stop"]');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      showFeedback('A câmera exige uma página segura. Abra o app por HTTPS ou em http://localhost; depois permita o acesso à câmera.', 'warning');
      return;
    }
    if (typeof jsQR !== 'function') {
      showFeedback('O leitor QR local não carregou. Atualize a página e tente novamente.', 'danger');
      return;
    }
    try {
      if (start) start.disabled = true;
      cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' } }
      });
      video.srcObject = cameraStream;
      await video.play();
      video.classList.add('is-active');
      if (placeholder) placeholder.hidden = true;
      if (start) start.hidden = true;
      if (stop) stop.hidden = false;
      showFeedback('Câmera ativa. Mantenha o QR do crachá dentro do quadro.', 'success');
      lastDecodeAt = 0;
      scanFrame();
    } catch (error) {
      stopCamera();
      if (start) { start.disabled = false; start.hidden = false; }
      const message = error?.name === 'NotAllowedError'
        ? 'Acesso à câmera negado. Permita a câmera nas configurações do navegador e tente novamente.'
        : 'Não consegui abrir a câmera. Verifique se ela está disponível e tente de novo.';
      showFeedback(message, 'warning');
    }
  }

  function scanFrame() {
    if (!cameraStream) return;
    const video = document.getElementById('badgeVideo');
    if (video && video.readyState >= 2 && video.videoWidth && performance.now() - lastDecodeAt > 160) {
      lastDecodeAt = performance.now();
      const scale = Math.min(1, 720 / video.videoWidth);
      const width = Math.max(1, Math.round(video.videoWidth * scale));
      const height = Math.max(1, Math.round(video.videoHeight * scale));
      if (!scanCanvas) scanCanvas = document.createElement('canvas');
      if (scanCanvas.width !== width || scanCanvas.height !== height) {
        scanCanvas.width = width;
        scanCanvas.height = height;
      }
      const context = scanCanvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(video, 0, 0, width, height);
      const image = context.getImageData(0, 0, width, height);
      const result = jsQR(image.data, image.width, image.height, { inversionAttempts: 'dontInvert' });
      if (result?.data && acceptPayload(result.data)) return;
    }
    cameraFrame = requestAnimationFrame(scanFrame);
  }

  function stopCamera() {
    if (cameraFrame) cancelAnimationFrame(cameraFrame);
    cameraFrame = 0;
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    const video = document.getElementById('badgeVideo');
    if (video) { video.pause(); video.srcObject = null; video.classList.remove('is-active'); }
    const placeholder = document.getElementById('badgeCameraPlaceholder');
    if (placeholder) placeholder.hidden = false;
    const start = document.querySelector('[data-action="badge-scan-start"]');
    const stop = document.querySelector('[data-action="badge-scan-stop"]');
    if (start) { start.hidden = false; start.disabled = false; }
    if (stop) stop.hidden = true;
  }

  function handleClick(event) {
    const button = event.target.closest?.('[data-action]');
    const action = button?.dataset.action;
    if (!activeBadge) {
      if (action === 'badge-scan-start') { event.preventDefault(); startCamera(); return true; }
      if (action === 'badge-scan-stop') { event.preventDefault(); stopCamera(); showFeedback('Leitura pausada.'); return true; }
      return true;
    }
    if (action === 'badge-logout') {
      event.preventDefault();
      stopCamera();
      activeBadge = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* sessão somente em memória */ }
      window.dispatchEvent(new CustomEvent('badge-auth-change', { detail: { loggedIn: false } }));
      return true;
    }
    return false;
  }

  window.BadgeAuth = { isLoggedIn, profile, canView, canAction, mount, prepareApp, afterRender, handleClick };
})();
