/* __IIFE__ */
(function () {
'use strict';

/* ---------- Site Editor ---------- */
/* One panel to change any brand asset, any icon, the hero media, and any
   piece of copy in the app. Everything it writes goes into the shared
   settings store as an override on top of the defaults declared in
   content.js, so "Reset" always has something honest to fall back to. */

const E = window.Store;
let tab = 'branding';
let assets = [];
let textFilter = '';

const TABS = [
  { id: 'branding', label: 'Branding', icon: 'sparkle' },
  { id: 'icons', label: 'Icons', icon: 'puzzle' },
  { id: 'media', label: 'Hero media', icon: 'motion' },
  { id: 'text', label: 'Text', icon: 'note' },
  { id: 'library', label: 'Uploads', icon: 'folder' },
];

/* ---------- Asset slot ---------- */
function assetSlot(key, def) {
  const current = window.Content.asset(key);
  const overridden = Boolean(window.Content.overridesAssets()[key]);
  const isMedia = def.kind === 'media';
  const preview = current
    ? (isMedia && /\.(mp4|webm|mov)$/i.test(current)
        ? `<video src="${current}" muted loop playsinline class="slot-preview"></video>`
        : `<img src="${current}" alt="" class="slot-preview" />`)
    : `<span class="slot-preview slot-preview--icon">${window.icon(key.replace('icon.', '')) || ''}</span>`;

  return `
    <div class="asset-slot" data-asset-key="${key}">
      <div class="slot-thumb">${preview}</div>
      <div class="slot-meta">
        <div class="slot-label">${E.esc(def.label)}</div>
        <div class="slot-value">${current ? E.esc(current) : 'Built-in default'}</div>
      </div>
      <div class="slot-actions">
        <label class="btn" title="Upload a file">
          ${window.icon('file')} Upload
          <input type="file" hidden data-asset-upload="${key}" accept="${isMedia ? 'image/*,video/*' : 'image/*'}" />
        </label>
        <button class="btn" data-asset-url="${key}" title="Import from a URL">${window.icon('globe')}</button>
        <button class="btn" data-asset-pick="${key}" title="Pick from uploads">${window.icon('folder')}</button>
        ${overridden ? `<button class="icon-btn sm" data-asset-reset="${key}" title="Reset to default">${window.icon('trash')}</button>` : ''}
      </div>
    </div>`;
}

function brandingBody() {
  const keys = ['logo.mark', 'logo.full'];
  return `
    <div class="field-group">
      <h3>Logos</h3>
      <p class="hint">Used for the sidebar mark, the avatar, the favicon, and the chat hero lockup.</p>
      ${keys.map((k) => assetSlot(k, window.Content.DEFAULT_ASSETS[k])).join('')}
    </div>
    <div class="field-group">
      <h3>Brand text</h3>
      ${['brand.name', 'brand.tagline', 'brand.slogan'].map(textRow).join('')}
    </div>`;
}

function iconsBody() {
  const keys = Object.keys(window.Content.DEFAULT_ASSETS).filter((k) => k.startsWith('icon.'));
  return `
    <div class="field-group">
      <h3>Icons</h3>
      <p class="hint">Replace any built-in line-art icon with your own image. Leave empty to keep the built-in one. Square, transparent PNG or SVG works best.</p>
      ${keys.map((k) => assetSlot(k, window.Content.DEFAULT_ASSETS[k])).join('')}
    </div>`;
}

function mediaBody() {
  return `
    <div class="field-group">
      <h3>Hero background</h3>
      <p class="hint">The ambient video or image behind the whole app. Its opacity follows the current theme.</p>
      ${assetSlot('hero.media', window.Content.DEFAULT_ASSETS['hero.media'])}
    </div>`;
}

/* ---------- Text ---------- */
function textRow(key) {
  const def = window.Content.DEFAULT_TEXT[key];
  const current = window.Content.overridesText()[key];
  const value = current ?? def;
  const changed = current != null && current !== def;
  return `
    <div class="field text-row${changed ? ' is-changed' : ''}">
      <label>
        <span class="text-key">${E.esc(key)}</span>
        ${changed ? `<button class="text-reset" data-text-reset="${key}">reset</button>` : ''}
      </label>
      <input type="text" data-text-key="${key}" value="${E.esc(value)}" />
      ${changed ? `<div class="text-default">default: ${E.esc(def)}</div>` : ''}
    </div>`;
}

function textBody() {
  const term = textFilter.trim().toLowerCase();
  const groups = window.Content.TEXT_GROUPS.map((g) => {
    const keys = Object.keys(window.Content.DEFAULT_TEXT).filter((k) => {
      if (!g.match(k)) return false;
      if (!term) return true;
      return k.toLowerCase().includes(term) ||
        String(window.Content.DEFAULT_TEXT[k]).toLowerCase().includes(term);
    });
    if (!keys.length) return '';
    return `<div class="field-group"><h3>${E.esc(g.label)}</h3>${keys.map(textRow).join('')}</div>`;
  }).join('');

  return `
    <div class="search-box" style="margin:0 0 18px">
      ${window.icon('search')}
      <input type="text" id="textFilter" placeholder="Search text…" value="${E.esc(textFilter)}" />
    </div>
    <p class="hint" style="margin-bottom:16px">Every string below is live in the app. <code>{name}</code> is filled in automatically.</p>
    ${groups || `<p class="empty-note">No text matches "${E.esc(textFilter)}".</p>`}`;
}

/* ---------- Uploads library ---------- */
function libraryBody() {
  if (!assets.length) {
    return `<div class="field-group">
      <h3>Uploads</h3>
      <p class="hint">Files you upload for logos, icons, or the hero appear here.</p>
      <p class="empty-note">Nothing uploaded yet.</p>
    </div>`;
  }
  return `<div class="field-group">
    <h3>Uploads <span style="color:var(--muted);font-weight:400">(${assets.length})</span></h3>
    <p class="hint">Stored in <code>public/assets/custom/</code>. Deleting a file that's still in use falls the slot back to its default.</p>
    <div class="asset-grid">
      ${assets.map((a) => `
        <div class="asset-tile">
          <div class="tile-thumb">${/\.(mp4|webm|mov)$/i.test(a.url)
            ? `<video src="${a.url}" muted loop playsinline></video>`
            : `<img src="${a.url}" alt="" />`}</div>
          <div class="tile-name" title="${E.esc(a.name)}">${E.esc(a.name)}</div>
          <button class="icon-btn sm" data-asset-del="${E.esc(a.name)}" title="Delete">${window.icon('trash')}</button>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------- Render ---------- */
function render() {
  const panel = document.getElementById('editorPanel');
  if (!panel) return;

  const bodies = { branding: brandingBody, icons: iconsBody, media: mediaBody, text: textBody, library: libraryBody };
  panel.innerHTML = `
    <div class="settings-head">
      <div style="flex:1;min-width:0">
        <h1>Site Editor</h1>
        <p>Change any logo, icon, image, video, or piece of text in Costa Code.</p>
      </div>
      <button class="btn" data-editor-resetall title="Restore every default">Reset all</button>
      <button class="icon-btn" data-close-editor title="Close">${window.icon('close')}</button>
    </div>
    <div class="editor-tabs">
      ${TABS.map((t) => `<button class="tab${t.id === tab ? ' active' : ''}" data-editor-tab="${t.id}">${window.icon(t.icon)} ${E.esc(t.label)}</button>`).join('')}
    </div>
    <div class="settings-body">${bodies[tab]()}</div>
  `;
  bind(panel);
}

function bind(panel) {
  panel.querySelectorAll('[data-editor-tab]').forEach((b) =>
    b.addEventListener('click', async () => {
      tab = b.dataset.editorTab;
      if (tab === 'library') await loadAssets();
      render();
    }));

  panel.querySelector('[data-close-editor]')?.addEventListener('click', close);

  panel.querySelector('[data-editor-resetall]')?.addEventListener('click', async () => {
    if (!confirm('Restore every logo, icon, media and text back to the built-in defaults?')) return;
    await window.Content.resetAll();
    refreshApp();
    render();
    E.toast('Everything reset to defaults.');
  });

  // --- assets ---
  panel.querySelectorAll('[data-asset-upload]').forEach((input) =>
    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('files', file);
      try {
        const { files } = await E.api.upload('/api/assets/upload', fd);
        await window.Content.setAsset(input.dataset.assetUpload, files[0].url);
        refreshApp();
        render();
        E.toast('Updated.');
      } catch (err) { E.toast(err.message); }
      e.target.value = '';
    }));

  panel.querySelectorAll('[data-asset-url]').forEach((b) =>
    b.addEventListener('click', () => importFromURL(b.dataset.assetUrl)));

  panel.querySelectorAll('[data-asset-pick]').forEach((b) =>
    b.addEventListener('click', () => pickFromLibrary(b.dataset.assetPick)));

  panel.querySelectorAll('[data-asset-reset]').forEach((b) =>
    b.addEventListener('click', async () => {
      await window.Content.setAsset(b.dataset.assetReset, null);
      refreshApp();
      render();
    }));

  panel.querySelectorAll('[data-asset-del]').forEach((b) =>
    b.addEventListener('click', async () => {
      if (!confirm(`Delete ${b.dataset.assetDel}?`)) return;
      await E.api.del(`/api/assets/${encodeURIComponent(b.dataset.assetDel)}`);
      await loadAssets();
      render();
    }));

  // --- text ---
  panel.querySelectorAll('[data-text-key]').forEach((input) =>
    input.addEventListener('change', async () => {
      await window.Content.setText(input.dataset.textKey, input.value);
      refreshApp();
      render();
    }));

  panel.querySelectorAll('[data-text-reset]').forEach((b) =>
    b.addEventListener('click', async () => {
      await window.Content.setText(b.dataset.textReset, null);
      refreshApp();
      render();
    }));

  const filterInput = panel.querySelector('#textFilter');
  filterInput?.addEventListener('input', () => {
    textFilter = filterInput.value;
    const pos = filterInput.selectionStart;
    render();
    const next = document.getElementById('textFilter');
    next.focus();
    next.setSelectionRange(pos, pos);
  });
}

async function importFromURL(key) {
  const url = prompt('Paste an image or video URL:');
  if (!url) return;
  E.toast('Importing…');
  try {
    const { file } = await E.api.post('/api/assets/import-url', { url });
    await window.Content.setAsset(key, file.url);
    refreshApp();
    await loadAssets();
    render();
    E.toast('Imported.');
  } catch (err) { E.toast(err.message); }
}

async function pickFromLibrary(key) {
  await loadAssets();
  if (!assets.length) { E.toast('Nothing uploaded yet.'); return; }
  window.Modal.open(`
    <h3>Pick an asset</h3>
    <div class="asset-grid">
      ${assets.map((a) => `
        <button class="asset-tile asset-tile--pick" data-pick="${E.esc(a.url)}">
          <div class="tile-thumb">${/\.(mp4|webm|mov)$/i.test(a.url)
            ? `<video src="${a.url}" muted></video>` : `<img src="${a.url}" alt="" />`}</div>
          <div class="tile-name">${E.esc(a.name)}</div>
        </button>`).join('')}
    </div>
    <div class="modal-actions"><button class="btn" data-modal-close>Cancel</button></div>
  `, (modal) => {
    modal.querySelectorAll('[data-pick]').forEach((b) =>
      b.addEventListener('click', async () => {
        await window.Content.setAsset(key, b.dataset.pick);
        window.Modal.close();
        refreshApp();
        render();
        E.toast('Updated.');
      }));
  });
}

async function loadAssets() {
  const res = await E.api.get('/api/assets').catch(() => ({ files: [] }));
  assets = res.files || [];
}

// Repaint the parts of the app that read from the content registry, so an
// edit is visible immediately behind the panel.
function refreshApp() {
  window.Sidebar.render();
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.href = window.Content.asset('logo.mark');
  const hero = document.getElementById('heroVideo');
  const media = window.Content.asset('hero.media');
  if (hero && media && hero.getAttribute('src') !== media) {
    hero.setAttribute('src', media);
    hero.load();
    hero.play().catch(() => {});
  }
  const route = window.Router.current();
  if (route.name === 'home') window.Home.mount();
  else if (route.name === 'prompts') window.Prompts.mount();
  else if (route.name === 'chat') window.Chat.mount();
}

/* ---------- Open / close ---------- */
async function open() {
  document.getElementById('editorOverlay').classList.add('open');
  if (tab === 'library') await loadAssets();
  render();
}
function close() {
  document.getElementById('editorOverlay').classList.remove('open');
}
function isOpen() { return document.getElementById('editorOverlay').classList.contains('open'); }

window.SiteEditor = { open, close, isOpen, render };
})();
