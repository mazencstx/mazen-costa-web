/* __IIFE__ */
(function () {
'use strict';

/* ---------- Chat ---------- */
const C = window.Store;
const { state } = C;

let messagesEl = null;

/* ---------- Model picker (shared with Home's topbar) ---------- */
function modelPickerHTML() {
  const opts = Object.entries(state.providers).map(([key, p]) => {
    const label = p.ready ? p.label : `${p.label} (needs ${p.envKey})`;
    return `<optgroup label="${C.esc(label)}"${p.ready ? '' : ' disabled'}>${
      p.models.map((m) => `<option value="${key}::${m.id}"${p.ready ? '' : ' disabled'}>${C.esc(m.label)}</option>`).join('')
    }</optgroup>`;
  }).join('');
  return `<div class="model-pick">
    <span class="status-dot" id="statusDot"></span>
    <select id="modelSelect" aria-label="Model">${opts}</select>
  </div>`;
}

function bindModelPicker(scope) {
  const select = scope.querySelector('#modelSelect');
  if (!select) return;
  const saved = localStorage.getItem('costa-model');
  if (saved && [...select.options].some((o) => o.value === saved && !o.disabled)) select.value = saved;
  updateStatusDot(scope);
  select.addEventListener('change', () => {
    localStorage.setItem('costa-model', select.value);
    updateStatusDot(scope);
  });
  scope.querySelector('[data-new-chat]')?.addEventListener('click', () => window.Chat.startNew());
}

function updateStatusDot(scope) {
  const select = scope.querySelector('#modelSelect');
  const dot = scope.querySelector('#statusDot');
  if (!select || !dot) return;
  const [providerKey] = (select.value || '').split('::');
  dot.className = 'status-dot ' + (state.providers[providerKey]?.ready ? 'ok' : 'warn');
}

function currentModel() {
  const select = document.getElementById('modelSelect');
  const [provider, model] = (select?.value || '').split('::');
  return { provider, model };
}

/* ---------- Typewriter ---------- */
/* Reveals streamed text at a steady pace regardless of how big or few the
   network chunks are — `claude -p` returns its whole answer in one burst, so
   without this it would pop in fully formed instead of typing out. */
function typeOut(bubbleEl, stream) {
  bubbleEl.innerHTML = `<span class="msg-text"></span><span class="type-cursor" data-mascot="xs"></span>`;
  const textEl = bubbleEl.querySelector('.msg-text');
  const cursor = bubbleEl.querySelector('.type-cursor');
  cursor.innerHTML = window.mascotSVG('coding');

  const reduced = document.documentElement.dataset.motion === 'reduced';
  let shown = 0;

  return new Promise((resolve) => {
    function tick() {
      const full = stream.text;
      if (reduced) {
        shown = full.length;
        textEl.textContent = full;
      } else if (shown < full.length) {
        const backlog = full.length - shown;
        const step = backlog > 500 ? 8 : backlog > 150 ? 4 : backlog > 40 ? 2 : 1;
        shown = Math.min(full.length, shown + step);
        textEl.textContent = full.slice(0, shown);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
      if (shown >= full.length && stream.done) { cursor.remove(); resolve(); return; }
      setTimeout(tick, reduced ? 60 : 14);
    }
    tick();
  });
}

/* ---------- Rendering ---------- */
function emptyStateHTML() {
  const persona = state.personas.find((p) => p.id === state.activePersonaId);
  const nickname = (state.settings.profile?.nickname || 'Costa').toUpperCase();
  return `<div class="empty-state">
    <div class="hero-logo">${window.Content.logoImg('logo.full')}</div>
    <h2 class="hero-hello">${persona
      ? C.esc(persona.agent)
      : C.esc(window.Content.t('chat.heroTitle', { name: nickname }))}</h2>
    <p>${persona
      ? C.esc(persona.tagline) + ' — describe what you need.'
      : C.esc(window.Content.t('chat.heroSubtitle'))}</p>
  </div>`;
}

function addBubble(role, text) {
  const empty = messagesEl.querySelector('.empty-state');
  if (empty) empty.remove();
  const div = document.createElement('div');
  div.className = `msg msg-${role}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function renderMessages() {
  messagesEl.innerHTML = state.history.length ? '' : emptyStateHTML();
  for (const m of state.history) addBubble(m.role, m.content);
  C.paintMascots();
}

/* ---------- Composer ---------- */
function composerHTML() {
  const accept = (state.settings.claudeCode?.permissionMode || 'acceptEdits') === 'acceptEdits';
  return `<div class="composer-inner">
    <div class="attachments" id="attachments"></div>
    <form class="composer" id="composer">
      <div class="composer-top">
        <textarea id="promptInput" rows="1" placeholder="${C.esc(window.Content.t('chat.placeholder'))}" autofocus></textarea>
        <button type="submit" class="btn btn-primary" id="sendBtn">${C.esc(window.Content.t('chat.send'))}</button>
      </div>
      <div class="composer-bar">
        <span class="bar-chip" style="cursor:default">${window.icon('terminal')} ${C.esc(window.Content.t('chat.local'))}</span>
        <label class="bar-chip" style="cursor:pointer" title="Attach files">
          ${window.icon('paperclip')}
          <input type="file" id="fileInput" hidden multiple />
        </label>
        <span class="bar-spacer"></span>
        <label class="switch" title="Let Claude Code edit files without asking each time">
          <input type="checkbox" id="acceptEdits" ${accept ? 'checked' : ''} />
          <span class="switch-track"></span>
          ${C.esc(window.Content.t('chat.acceptEdits'))}
        </label>
      </div>
    </form>
  </div>`;
}

function bindComposer(wrap) {
  const form = wrap.querySelector('#composer');
  const input = wrap.querySelector('#promptInput');

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 180) + 'px';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });
  input.addEventListener('dragover', (e) => e.preventDefault());
  input.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  });
  // Screenshots pasted straight from the clipboard.
  input.addEventListener('paste', (e) => {
    const files = [...(e.clipboardData?.files || [])];
    if (files.length) { e.preventDefault(); uploadFiles(files); }
  });

  wrap.querySelector('#fileInput').addEventListener('change', (e) => {
    if (e.target.files.length) uploadFiles(e.target.files);
    e.target.value = '';
  });

  wrap.querySelector('#acceptEdits').addEventListener('change', (e) => {
    C.saveSettings({ claudeCode: { ...(state.settings.claudeCode || {}), permissionMode: e.target.checked ? 'acceptEdits' : 'default' } });
  });

  form.addEventListener('submit', onSubmit);
}

function renderAttachments() {
  const bar = document.getElementById('attachments');
  if (!bar) return;
  bar.innerHTML = state.pendingAttachments.map((a, i) => {
    const isImg = /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(a.url || '') || (a.type || '').startsWith('image/');
    return `<span class="chip${isImg ? ' chip--img' : ''}">
      ${isImg ? `<img src="${C.esc(a.url)}" alt="" />` : ''}${C.esc(a.name)}
      <button type="button" data-rm-att="${i}">${window.icon('close')}</button>
    </span>`;
  }).join('');
  bar.querySelectorAll('[data-rm-att]').forEach((b) =>
    b.addEventListener('click', () => {
      state.pendingAttachments.splice(Number(b.dataset.rmAtt), 1);
      renderAttachments();
    }));
}

async function uploadFiles(fileList) {
  const fd = new FormData();
  for (const f of fileList) fd.append('files', f);
  try {
    const { files } = await C.api.upload('/api/upload', fd);
    state.pendingAttachments.push(...files);
    renderAttachments();
  } catch (err) {
    C.toast(`Upload failed: ${err.message}`);
  }
}

/* ---------- Send ---------- */
async function onSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('promptInput');
  let text = input.value.trim();
  if (!text) return;

  const { provider, model } = currentModel();
  if (!provider) { C.toast('Pick a model first.'); return; }

  if (state.pendingAttachments.length) {
    text += '\n\nAttached files:\n' + state.pendingAttachments.map((a) => `- ${location.origin}${a.url} (${a.name})`).join('\n');
  }

  if (!state.activeChatId) {
    const created = await C.api.post('/api/chats', { title: input.value.trim().slice(0, 48) || window.Content.t('chat.newChatTitle') });
    state.activeChatId = created.id;
    localStorage.setItem('costa-active-chat', String(created.id));
    window.Router.replace(`#/chat/${created.id}`);
  }

  addBubble('user', text);
  state.history.push({ role: 'user', content: text });
  input.value = '';
  input.style.height = 'auto';
  state.pendingAttachments = [];
  renderAttachments();

  const sendBtn = document.getElementById('sendBtn');
  sendBtn.disabled = true;
  C.setMascot('thinking');

  const bubble = addBubble('assistant', '');
  bubble.innerHTML = `<span class="typing-dots"><span></span><span></span><span></span></span>`;

  const stream = { text: '', done: false };
  let reveal = null;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        provider, model, messages: state.history,
        chatId: state.activeChatId, personaId: state.activePersonaId,
      }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const piece = decoder.decode(value, { stream: true });
      if (!piece) continue;
      if (!reveal) { C.setMascot('coding'); reveal = typeOut(bubble, stream); }
      stream.text += piece;
    }
    stream.done = true;
    if (reveal) await reveal;
    else bubble.textContent = '';

    state.history.push({ role: 'assistant', content: stream.text });
    C.setMascot('success', { revertAfter: 1400 });
  } catch (err) {
    stream.done = true;
    if (reveal) await reveal;
    bubble.classList.add('msg-error');
    bubble.textContent = `⚠ ${err.message}`;
    C.setMascot('error', { revertAfter: 1600 });
  } finally {
    sendBtn.disabled = false;
    await refreshChats();
  }
}

/* ---------- Chat lifecycle ---------- */
async function refreshChats() {
  state.chats = await C.api.get('/api/chats').catch(() => []);
  window.Sidebar.render();
}

async function openChat(id) {
  state.activeChatId = Number(id);
  localStorage.setItem('costa-active-chat', String(id));
  const rows = await C.api.get(`/api/chats/${id}/messages`).catch(() => []);
  state.history = rows.map((r) => ({ role: r.role, content: r.content }));
  mount();
}

// Text handed over from another view (a capability tile, a saved prompt).
// Stashed rather than typed straight into the DOM because the composer may
// not exist yet when the hand-off happens; mount() consumes it.
let pendingPrefill = null;

function startNew(personaId = null, prefillText = null, attachments = null) {
  state.activeChatId = null;
  state.activePersonaId = personaId;
  state.history = [];
  if (prefillText) pendingPrefill = prefillText;
  state.pendingAttachments = attachments ? [...attachments] : [];
  localStorage.removeItem('costa-active-chat');
  window.Router.go('#/chat');
}

function prefill(text) {
  const input = document.getElementById('promptInput');
  if (!input) { pendingPrefill = text; return; }
  input.value = text;
  input.dispatchEvent(new Event('input'));
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

/* ---------- Mount ---------- */
function mount() {
  const topbar = document.getElementById('topbar');
  const view = document.getElementById('view');
  const wrap = document.getElementById('composerWrap');

  const chat = state.chats.find((c) => c.id === state.activeChatId);
  const persona = state.personas.find((p) => p.id === state.activePersonaId);
  const title = chat ? chat.title : persona ? `${persona.label} studio` : window.Content.t('chat.newChatTitle');

  topbar.innerHTML = `
    <div class="mascot" data-mascot="sm" style="width:26px;height:21px"></div>
    <div class="topbar-title"><span>${C.esc(title)}</span></div>
    <div class="topbar-actions">
      ${modelPickerHTML()}
      <button class="btn" data-new-chat>${window.icon('plus')} ${C.esc(window.Content.t('chat.new'))}</button>
    </div>
  `;
  bindModelPicker(topbar);

  view.innerHTML = `<div class="messages" id="messages"></div>`;
  messagesEl = document.getElementById('messages');
  renderMessages();

  wrap.hidden = false;
  wrap.innerHTML = composerHTML();
  bindComposer(wrap);
  renderAttachments();
  C.paintMascots();

  if (pendingPrefill) {
    const text = pendingPrefill;
    pendingPrefill = null;
    prefill(text);
  }
}

window.Chat = {
  mount, openChat, startNew, prefill, refreshChats,
  modelPickerHTML, bindModelPicker,
};
})();
