/* __IIFE__ */
(function () {
'use strict';

/* ---------- Sidebar ---------- */
const { state, esc } = window.Store;

const CAP_IDS = ['aiCoding', 'websites', 'mobileApps', 'animations', 'pdfDocs', 'databases', 'deploy'];

// The CORE rail — also reused by Home's Quick Actions so the two can't drift.
// Labels and starter prompts resolve through the content registry, so the
// Site Editor can rename or re-word any of them.
function capabilities() {
  return CAP_IDS.map((id) => ({
    id,
    label: window.Content.t(`cap.${id}`),
    prompt: window.Content.t(`capPrompt.${id}`),
  }));
}

const STUDIO_ICONS = { design: 'design', motion: 'motion', code: 'code', ai: 'ai', cloud: 'cloud' };

function navItem({ icon: iconName, label, active, count, attrs = '' }) {
  return `<button class="nav-item${active ? ' active' : ''}" ${attrs}>
    <span class="nav-ic">${window.Content.iconFor(iconName)}</span>
    <span>${esc(label)}</span>
    ${count != null ? `<span class="nav-count">${esc(count)}</span>` : ''}
  </button>`;
}

function group(id, label, bodyHTML, { open = false, count = null } = {}) {
  return `<div class="group${open ? ' open' : ''}" data-group="${id}">
    <button class="group-head" data-group-toggle="${id}">
      <span>${esc(label)}</span>
      ${count != null ? `<span class="nav-count">${esc(count)}</span>` : ''}
      <span class="group-chev">${window.icon('chevronDown')}</span>
    </button>
    <div class="group-body">${bodyHTML}</div>
  </div>`;
}

function renderSidebar() {
  const el = document.getElementById('sidebar');
  if (!el) return;

  const route = window.Router?.current() || { name: 'home' };
  const profile = state.settings.profile || {};
  const openGroups = new Set(
    [...el.querySelectorAll('.group.open')].map((g) => g.dataset.group)
  );
  if (!el.dataset.ready) openGroups.add('history');

  el.innerHTML = `
    <div class="sidebar-scroll">
      <div class="brand">
        <span class="logo-icon logo-icon--rounded">${window.Content.logoImg('logo.mark')}</span>
        <div class="brand-word">
          <div class="brand-name">${esc(window.Content.t('brand.name'))}</div>
          <div class="brand-tag">${esc(window.Content.t('brand.tagline'))}</div>
        </div>
      </div>

      <div class="nav-section">
        ${navItem({ icon: 'home', label: window.Content.t('nav.home'), active: route.name === 'home', attrs: 'data-go="#/home"' })}
        ${navItem({ icon: 'sparkle', label: window.Content.t('nav.prompts'), active: route.name === 'prompts', attrs: 'data-go="#/prompts"' })}
      </div>

      <div class="nav-section">
        <div class="nav-label">${esc(window.Content.t('nav.group.core'))}</div>
        ${capabilities().map((c) => navItem({
          icon: c.id, label: c.label, attrs: `data-capability="${c.id}"`,
        })).join('')}
      </div>

      <div class="nav-section">
        <div class="nav-label">${esc(window.Content.t('nav.group.studio'))}</div>
        ${state.personas.map((p) => navItem({
          icon: STUDIO_ICONS[p.id] || 'sparkle',
          label: p.label,
          active: route.name === 'chat' && state.activePersonaId === p.id,
          attrs: `data-persona="${p.id}" title="${esc(p.agent)} — ${esc(p.tagline)}"`,
        })).join('')}
      </div>

      ${group('history', window.Content.t('nav.group.history'), renderHistory(), { open: openGroups.has('history'), count: state.chats.length })}
      ${group('notes', window.Content.t('nav.group.notes'), `<div data-panel="notes"><p class="empty-note">Loading…</p></div>`, { open: openGroups.has('notes') })}
      ${group('tasks', window.Content.t('nav.group.tasks'), `<div data-panel="tasks"><p class="empty-note">Loading…</p></div>`, { open: openGroups.has('tasks') })}
      ${group('files', window.Content.t('nav.group.files'), `<div data-panel="files"><p class="empty-note">Loading…</p></div>`, { open: openGroups.has('files') })}
      ${group('providers', window.Content.t('nav.group.providers'), renderProviders(), { open: openGroups.has('providers') })}
    </div>

    <div class="sidebar-foot">
      <button class="user-card" data-open-settings>
        <span class="user-avatar">${window.Content.logoImg('logo.mark')}</span>
        <span class="user-meta">
          <span class="user-name">${esc(profile.fullName || 'Set your name')}</span>
          <span class="user-plan">${esc(profile.role || 'Local build')}</span>
        </span>
        <span class="icon-btn sm">${window.icon('gear')}</span>
      </button>
      <div class="theme-row">
        <span class="theme-label">
          ${window.icon(window.Store.resolveTheme() === 'dark' ? 'moon' : 'sun')}
          ${window.Store.resolveTheme() === 'dark' ? 'Dark mode' : 'Light mode'}
        </span>
        <span class="foot-actions">
          <button class="round-btn" data-toggle-theme title="Toggle theme">
            ${window.icon(window.Store.resolveTheme() === 'dark' ? 'sun' : 'moon')}
          </button>
          <button class="round-btn round-btn--accent" data-open-editor title="Site Editor — change any logo, icon, image or text">
            ${window.icon('design')}
          </button>
        </span>
      </div>
    </div>
  `;
  el.dataset.ready = '1';

  // Lazily fill whichever collapsible panels are open.
  for (const id of ['notes', 'tasks', 'files']) {
    if (openGroups.has(id)) window.Panels?.render(id);
  }
}

function renderHistory() {
  if (!state.chats.length) return `<p class="empty-note">No chats yet.</p>`;
  return state.chats.map((c) => `
    <div class="chat-row${c.id === state.activeChatId ? ' active' : ''}" data-chat="${c.id}">
      <span>${esc(c.title)}</span>
      <button class="row-del" data-del-chat="${c.id}" title="Delete chat">${window.icon('close')}</button>
    </div>
  `).join('');
}

function renderProviders() {
  const entries = Object.entries(state.providers);
  if (!entries.length) return `<p class="empty-note">Loading…</p>`;
  return entries.map(([, p]) => `
    <div class="chat-row" style="cursor:default">
      <span>${esc(p.label)}</span>
      <span class="pill ${p.ready ? 'ready' : 'missing'}">${p.ready ? 'ready' : (p.envKey ? 'no key' : 'n/a')}</span>
    </div>
  `).join('');
}

window.Sidebar = {
  render: renderSidebar,
  capabilities,
  CAP_IDS,
  // Kept as a getter so callers always see current (possibly overridden) labels.
  get CAPABILITIES() { return capabilities(); },
};
})();
