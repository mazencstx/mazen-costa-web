/* __IIFE__ */
(function () {
'use strict';

/* ---------- API client ---------- */
const api = {
  async get(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
    return res.json();
  },
  async send(method, path, body) {
    const res = await fetch(path, {
      method,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204) return null;
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
    return res.json();
  },
  post(path, body) { return api.send('POST', path, body); },
  put(path, body) { return api.send('PUT', path, body); },
  patch(path, body) { return api.send('PATCH', path, body); },
  del(path) { return api.send('DELETE', path); },
  async upload(path, formData) {
    const res = await fetch(path, { method: 'POST', body: formData });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
    return res.json();
  },
};

/* ---------- App state ---------- */
const state = {
  settings: {},
  providers: {},
  personas: [],
  chats: [],
  activeChatId: null,
  activePersonaId: null,
  history: [],
  pendingAttachments: [],
};

const listeners = new Set();
function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit(event, detail) { for (const fn of listeners) fn(event, detail); }

/* ---------- Settings (server-persisted, shared with the CLI) ---------- */
const DEFAULT_SETTINGS = {
  profile: { fullName: '', nickname: '', role: '' },
  instructions: '',
  appearance: 'system',      // system | light | dark
  chatFont: 'sans',          // sans | serif | mono
  motion: 'system',          // system | reduced
  claudeCode: { permissionMode: 'acceptEdits' },
};

async function loadSettings() {
  const saved = await api.get('/api/settings').catch(() => ({}));
  state.settings = { ...DEFAULT_SETTINGS, ...saved, profile: { ...DEFAULT_SETTINGS.profile, ...(saved.profile || {}) } };
  applyAppearance();
  applyMotion();
  applyChatFont();
  return state.settings;
}

async function saveSettings(patch) {
  state.settings = { ...state.settings, ...patch };
  emit('settings', state.settings);
  return api.put('/api/settings', patch);
}

/* ---------- Theme ---------- */
const mql = window.matchMedia('(prefers-color-scheme: dark)');

function resolveTheme() {
  const pref = state.settings.appearance || 'system';
  if (pref === 'system') return mql.matches ? 'dark' : 'light';
  return pref;
}

function applyAppearance() {
  document.documentElement.dataset.theme = resolveTheme();
  emit('theme', resolveTheme());
}

// Keep `system` live rather than only reading the OS once at boot.
mql.addEventListener('change', () => {
  if ((state.settings.appearance || 'system') === 'system') applyAppearance();
});

function applyMotion() {
  const pref = state.settings.motion || 'system';
  const reduced = pref === 'reduced' || (pref === 'system' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
}

const FONT_STACKS = {
  sans: "'Inter', system-ui, sans-serif",
  serif: "'Georgia', 'Times New Roman', serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};
function applyChatFont() {
  const stack = FONT_STACKS[state.settings.chatFont] || FONT_STACKS.sans;
  document.documentElement.style.setProperty('--font-chat', stack);
}

/* ---------- Mascot controller ---------- */
/* One place decides which expression is showing, so the sidebar mascot and
   any other mounted mascot always agree. `sleeping` kicks in after a couple
   of idle minutes; transient states (success/error) auto-revert. */
const IDLE_SLEEP_MS = 2 * 60 * 1000;
let mascotState = 'idle';
let sleepTimer = null;
let revertTimer = null;

function mountedMascots() { return document.querySelectorAll('[data-mascot]'); }

function paintMascots() {
  for (const el of mountedMascots()) {
    const size = el.dataset.mascot;
    el.dataset.state = mascotState;
    el.innerHTML = window.mascotSVG(mascotState);
    if (size) el.classList.add('mascot');
  }
}

function setMascot(next, { revertAfter = 0 } = {}) {
  clearTimeout(revertTimer);
  mascotState = next;
  paintMascots();
  if (revertAfter) revertTimer = setTimeout(() => setMascot('idle'), revertAfter);
  scheduleSleep();
}

function scheduleSleep() {
  clearTimeout(sleepTimer);
  if (mascotState !== 'idle') return;
  sleepTimer = setTimeout(() => {
    if (mascotState === 'idle') { mascotState = 'sleeping'; paintMascots(); }
  }, IDLE_SLEEP_MS);
}

// Any real interaction wakes it up.
['pointerdown', 'keydown'].forEach((evt) => {
  window.addEventListener(evt, () => {
    if (mascotState === 'sleeping') setMascot('idle');
    else scheduleSleep();
  }, { passive: true });
});

/* ---------- Small helpers ---------- */
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

function fmtNumber(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

function fmtHour(h) {
  if (h == null) return '—';
  const suffix = h < 12 ? 'AM' : 'PM';
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr} ${suffix}`;
}

let toastTimer = null;
function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

window.Store = {
  api, state, subscribe, emit,
  loadSettings, saveSettings, DEFAULT_SETTINGS,
  applyAppearance, applyMotion, applyChatFont, resolveTheme,
  setMascot, paintMascots, getMascotState: () => mascotState,
  esc, fmtNumber, fmtHour, toast,
};
})();
