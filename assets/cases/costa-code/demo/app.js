/* __IIFE__ */
(function () {
'use strict';

/* ---------- Bootstrap + router + global events ---------- */
const A = window.Store;
const { state } = A;

/* ---------- Modal helper ---------- */
const Modal = {
  open(html, bind) {
    const backdrop = document.getElementById('modalBackdrop');
    const modal = document.getElementById('modal');
    modal.innerHTML = html;
    backdrop.classList.add('open');
    modal.classList.add('open');
    modal.querySelectorAll('[data-modal-close]').forEach((b) => b.addEventListener('click', Modal.close));
    if (bind) bind(modal);
  },
  close() {
    document.getElementById('modalBackdrop').classList.remove('open');
    document.getElementById('modal').classList.remove('open');
  },
};
window.Modal = Modal;
document.getElementById('modalBackdrop').addEventListener('click', Modal.close);

/* ---------- Router ---------- */
function parseHash() {
  const raw = (location.hash || '#/home').replace(/^#\/?/, '');
  const [name, param] = raw.split('/');
  return { name: name || 'home', param };
}

let currentRoute = { name: 'home' };

const Router = {
  current: () => currentRoute,
  go(hash) {
    // Assigning the hash it already has fires no `hashchange`, which would
    // silently drop navigations like switching between two Studio personas
    // (both land on #/chat). Re-render directly in that case.
    if (location.hash === hash) { renderRoute(); return; }
    location.hash = hash;
  },
  replace(hash) { history.replaceState(null, '', hash); currentRoute = parseHash(); },
};
window.Router = Router;

async function renderRoute() {
  currentRoute = parseHash();

  if (currentRoute.name === 'settings') {
    window.Settings.open(currentRoute.param);
    return;
  }
  if (window.Settings.isOpen()) window.Settings.close();

  if (currentRoute.name === 'chat') {
    if (currentRoute.param && Number(currentRoute.param) !== state.activeChatId) {
      await window.Chat.openChat(currentRoute.param);
    } else {
      window.Chat.mount();
    }
  } else if (currentRoute.name === 'prompts') {
    state.activePersonaId = null;
    window.Prompts.mount();
  } else {
    state.activePersonaId = null;
    window.Home.mount();
  }
  window.Sidebar.render();
}

window.addEventListener('hashchange', renderRoute);

/* ---------- Global click delegation ---------- */
document.addEventListener('click', async (e) => {
  const t = e.target;

  const go = t.closest('[data-go]');
  if (go) { Router.go(go.dataset.go); closeMobileSidebar(); return; }

  const cap = t.closest('[data-capability]');
  if (cap) {
    const c = window.Sidebar.CAPABILITIES.find((x) => x.id === cap.dataset.capability);
    if (c) {
      if (currentRoute.name === 'chat') window.Chat.prefill(c.prompt);
      else window.Chat.startNew(null, c.prompt);
      closeMobileSidebar();
    }
    return;
  }

  const persona = t.closest('[data-persona]');
  if (persona) { window.Chat.startNew(persona.dataset.persona); closeMobileSidebar(); return; }

  const del = t.closest('[data-del-chat]');
  if (del) {
    e.stopPropagation();
    await A.api.del(`/api/chats/${del.dataset.delChat}`);
    if (Number(del.dataset.delChat) === state.activeChatId) window.Chat.startNew();
    await window.Chat.refreshChats();
    return;
  }

  const chatRow = t.closest('[data-chat]');
  if (chatRow) { Router.go(`#/chat/${chatRow.dataset.chat}`); closeMobileSidebar(); return; }

  const groupToggle = t.closest('[data-group-toggle]');
  if (groupToggle) {
    const g = groupToggle.closest('.group');
    g.classList.toggle('open');
    if (g.classList.contains('open')) window.Panels.render(g.dataset.group);
    return;
  }

  if (t.closest('[data-open-editor]')) { window.SiteEditor.open(); return; }
  if (t.closest('[data-close-editor]')) { window.SiteEditor.close(); return; }
  if (t.closest('[data-open-settings]')) { Router.go('#/settings/general'); return; }
  if (t.closest('[data-close-settings]')) {
    window.Settings.close();
    Router.go(state.activeChatId ? `#/chat/${state.activeChatId}` : '#/home');
    return;
  }

  const themeBtn = t.closest('[data-toggle-theme]');
  if (themeBtn) {
    const next = A.resolveTheme() === 'dark' ? 'light' : 'dark';
    await A.saveSettings({ appearance: next });
    A.applyAppearance();
    window.Sidebar.render();
    if (window.Settings.isOpen()) window.Settings.render();
    return;
  }
});

/* ---------- Mobile sidebar ---------- */
const sidebarEl = document.getElementById('sidebar');
const backdropEl = document.getElementById('sidebarBackdrop');
function closeMobileSidebar() {
  sidebarEl.classList.remove('open');
  backdropEl.classList.remove('open');
}
document.getElementById('menuToggle').addEventListener('click', () => {
  sidebarEl.classList.toggle('open');
  backdropEl.classList.toggle('open', sidebarEl.classList.contains('open'));
});
backdropEl.addEventListener('click', closeMobileSidebar);
document.getElementById('menuToggle').innerHTML = window.icon('chevron');

/* ---------- Keyboard ---------- */
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (!window.Settings.isOpen()) Router.go('#/settings/general');
    setTimeout(() => document.getElementById('settingsSearch')?.focus(), 60);
    return;
  }
  if (e.key === 'Escape') {
    if (document.getElementById('modal').classList.contains('open')) { Modal.close(); return; }
    if (window.SiteEditor.isOpen()) { window.SiteEditor.close(); return; }
    if (window.Settings.isOpen()) {
      window.Settings.close();
      Router.go(state.activeChatId ? `#/chat/${state.activeChatId}` : '#/home');
    }
  }
});

/* ---------- Hero video: pause when the tab is hidden ---------- */
const hero = document.getElementById('heroVideo');
document.addEventListener('visibilitychange', () => {
  if (!hero) return;
  if (document.hidden) hero.pause();
  else hero.play().catch(() => {});
});

/* ---------- Boot ---------- */
(async function boot() {
  await A.loadSettings();

  const [providers, personas, chats] = await Promise.all([
    A.api.get('/api/providers').catch(() => ({})),
    A.api.get('/api/personas').catch(() => []),
    A.api.get('/api/chats').catch(() => []),
  ]);
  state.providers = providers;
  state.personas = personas;
  state.chats = chats;

  // Resume the last chat when landing straight on #/chat with no id.
  const saved = localStorage.getItem('costa-active-chat');
  const route = parseHash();
  if (route.name === 'chat' && !route.param && saved && chats.some((c) => String(c.id) === saved)) {
    history.replaceState(null, '', `#/chat/${saved}`);
  }
  if (!location.hash) history.replaceState(null, '', '#/home');

  // Apply any Site Editor overrides for the brand mark and hero media.
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.href = window.Content.asset('logo.mark');
  const heroMedia = window.Content.asset('hero.media');
  if (hero && heroMedia && hero.getAttribute('src') !== heroMedia) {
    hero.setAttribute('src', heroMedia);
    hero.load();
  }

  A.setMascot('idle');
  await renderRoute();
})();
})();
