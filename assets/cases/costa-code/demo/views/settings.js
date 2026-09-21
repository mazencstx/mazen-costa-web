/* __IIFE__ */
(function () {
'use strict';

/* ---------- Settings overlay ---------- */
const St = window.Store;
const { state } = St;

let activeSection = 'general';
let searchTerm = '';

const SECTIONS = [
  { group: 'Account', items: [
    { id: 'general', label: 'General', icon: 'gear' },
    { id: 'account', label: 'Account', icon: 'user' },
    { id: 'privacy', label: 'Privacy', icon: 'shield' },
    { id: 'billing', label: 'Billing', icon: 'card' },
    { id: 'usage', label: 'Usage', icon: 'chart' },
    { id: 'capabilities', label: 'Capabilities', icon: 'sparkle' },
    { id: 'claude-code', label: 'Claude Code', icon: 'code' },
    { id: 'cowork', label: 'Cowork', icon: 'note' },
    { id: 'chrome', label: 'Claude in Chrome', icon: 'globe' },
  ] },
  { group: 'Desktop app', items: [
    { id: 'desktop', label: 'General', icon: 'monitor' },
    { id: 'extensions', label: 'Extensions', icon: 'puzzle' },
    { id: 'developer', label: 'Developer', icon: 'terminal' },
  ] },
  { group: 'Customize', items: [
    { id: 'skills', label: 'Skills', icon: 'bolt' },
    { id: 'connectors', label: 'Connectors', icon: 'plug' },
    { id: 'plugins', label: 'Plugins', icon: 'puzzle' },
    { id: 'memory', label: 'Memory', icon: 'brain' },
  ] },
];

const TITLES = Object.fromEntries(
  SECTIONS.flatMap((g) => g.items.map((i) => [i.id, i.label]))
);

const SUBTITLES = {
  general: 'Manage your profile and how Costa Code works for you.',
  account: 'Your local account details.',
  privacy: 'Everything Costa Code stores lives on this machine.',
  billing: 'Plans and payment.',
  usage: 'How much you have used Costa Code.',
  capabilities: 'What Costa Code can build for you.',
  'claude-code': 'How the local Claude Code CLI is invoked.',
  cowork: 'Shared workspaces and collaboration.',
  chrome: 'Use Costa Code from your browser.',
  desktop: 'Desktop application preferences.',
  extensions: 'Editor and IDE extensions.',
  developer: 'Diagnostics and low-level configuration.',
  skills: 'Reusable instructions Costa Code can invoke by name.',
  connectors: 'Connect external tools and data sources.',
  plugins: 'Extend Costa Code with plugins.',
  memory: 'Notes and tasks Costa Code keeps for you.',
};

/* This build runs entirely on the user's own machine — there is no account
   server, no billing, no browser extension. Rather than shipping controls
   that look live but do nothing, those sections say so plainly. */
const LOCAL_ONLY = {
  account: 'Costa Code Web runs entirely on this machine with no account server, so there is nothing to sign in to. Your profile lives in Settings → General and is stored in the local database.',
  billing: 'There is no billing — this is your own local build talking to your own API keys. Provider costs are billed by Anthropic, Google, or DeepSeek directly.',
  cowork: 'Cowork needs a hosted, multi-user backend. This build is local-only by design (see the "Why local-only" section of the README).',
  chrome: 'The browser extension needs a published, hosted app to talk to. Not part of the local build.',
  extensions: 'Editor extensions ship with the official Claude Code distribution, not with this local wrapper.',
  connectors: 'Connectors need a hosted OAuth broker. Not available in the local build.',
  plugins: 'A plugin runtime is not part of this build. Skills (Customize → Skills) cover the same ground locally.',
  desktop: 'This is the web build running in your browser. The Electron desktop shell has its own settings.',
};

/* ---------- Nav ---------- */
function renderNav() {
  const nav = document.getElementById('settingsNav');
  const term = searchTerm.trim().toLowerCase();

  const groups = SECTIONS.map((g) => {
    const items = g.items.filter((i) => !term || i.label.toLowerCase().includes(term) || i.id.includes(term));
    if (!items.length) return '';
    return `<div class="nav-section">
      <div class="nav-label">${St.esc(g.group)}</div>
      ${items.map((i) => `
        <button class="nav-item${i.id === activeSection ? ' active' : ''}" data-section="${i.id}">
          <span class="nav-ic">${window.icon(i.icon)}</span><span>${St.esc(i.label)}</span>
        </button>`).join('')}
    </div>`;
  }).join('');

  const profile = state.settings.profile || {};
  nav.innerHTML = `
    <div class="settings-brand">
      ${window.logoIcon('rounded')}
      <div class="brand-word">
        <div class="brand-name">Costa Code</div>
        <div class="brand-tag">AI Software Engineer</div>
      </div>
    </div>
    <div class="search-box">
      ${window.icon('search')}
      <input type="text" id="settingsSearch" placeholder="Search settings…" value="${St.esc(searchTerm)}" />
      <kbd>⌘K</kbd>
    </div>
    <div class="settings-nav-scroll">${groups || `<p class="empty-note" style="padding:0 8px">No matches.</p>`}</div>
    <div class="sidebar-foot">
      <div class="user-card" style="cursor:default">
        <span class="user-avatar">${window.logoImg()}</span>
        <span class="user-meta">
          <span class="user-name">${St.esc(profile.fullName || 'Set your name')}</span>
          <span class="user-plan">${St.esc(profile.role || 'Local build')}</span>
        </span>
      </div>
    </div>
  `;

  nav.querySelectorAll('[data-section]').forEach((b) =>
    b.addEventListener('click', () => { activeSection = b.dataset.section; render(); }));

  const search = nav.querySelector('#settingsSearch');
  search.addEventListener('input', () => {
    searchTerm = search.value;
    const pos = search.selectionStart;
    renderNav();
    const next = document.getElementById('settingsSearch');
    next.focus();
    next.setSelectionRange(pos, pos);
  });
}

/* ---------- Section bodies ---------- */
function notice(text) {
  return `<div class="notice">${window.icon('shield')}<div><strong>Not available in the local build.</strong><br>${St.esc(text)}</div></div>`;
}

function generalSection() {
  const p = state.settings.profile || {};
  const instructions = state.settings.instructions || '';
  const appearance = state.settings.appearance || 'system';
  const motion = state.settings.motion || 'system';
  const chatFont = state.settings.chatFont || 'sans';

  return `
    <div class="field-group">
      <h3>Profile</h3>
      <div class="profile-row">
        <div class="avatar-edit">
          ${window.logoIcon('rounded')}
          <span class="icon-btn">${window.icon('design')}</span>
        </div>
        <div class="profile-fields">
          <div class="field">
            <label for="setFullName">Full name</label>
            <input type="text" id="setFullName" value="${St.esc(p.fullName)}" placeholder="Mazen Costa" />
          </div>
          <div class="field">
            <label for="setNickname">What should Costa Code call you?</label>
            <input type="text" id="setNickname" value="${St.esc(p.nickname)}" placeholder="Costa" />
          </div>
          <div class="field">
            <label for="setRole">What best describes your work?</label>
            <select id="setRole">
              ${['', 'Design', 'Engineering', 'Product', 'Marketing', 'Founder', 'Student', 'Other']
                .map((r) => `<option value="${r}"${r === p.role ? ' selected' : ''}>${r || 'Select…'}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="field-group">
      <h3>Instructions for Costa Code</h3>
      <p class="hint">Costa Code will keep these in mind across chats and projects — in the terminal too.</p>
      <div class="field">
        <textarea id="setInstructions" maxlength="2000" placeholder="e.g. Always explain in Egyptian Arabic, always use JSX not TSX…">${St.esc(instructions)}</textarea>
        <div class="counter"><span id="insCount">${instructions.length}</span>/2000</div>
      </div>
    </div>

    <div class="field-group">
      <h3>Preferences</h3>
      <div class="pref-row">
        <div class="pref-text"><strong>Appearance</strong><span>Choose your preferred theme.</span></div>
        <div class="pref-control choice">
          ${[['system', 'monitor'], ['light', 'sun'], ['dark', 'moon']].map(([v, ic]) =>
            `<button data-appearance="${v}" class="${appearance === v ? 'active' : ''}" title="${v}">${window.icon(ic)}</button>`).join('')}
        </div>
      </div>
      <div class="pref-row">
        <div class="pref-text"><strong>Chat font</strong><span>The font used in conversations.</span></div>
        <div class="pref-control">
          <select id="setChatFont" style="min-width:170px;background:var(--panel);color:var(--text);border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 11px;font-family:var(--font-body);font-size:13px">
            ${[['sans', 'Inter Sans'], ['serif', 'Anthropic Serif'], ['mono', 'JetBrains Mono']]
              .map(([v, l]) => `<option value="${v}"${chatFont === v ? ' selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="pref-row">
        <div class="pref-text"><strong>Motion</strong><span>Reduce animation in streaming responses and other interface elements.</span></div>
        <div class="pref-control choice">
          <button data-motion="system" class="${motion === 'system' ? 'active' : ''}">System</button>
          <button data-motion="reduced" class="${motion === 'reduced' ? 'active' : ''}">Reduced</button>
        </div>
      </div>
    </div>
  `;
}

function bindGeneral(panel) {
  const save = St.debounceSave || ((patch) => St.saveSettings(patch));

  panel.querySelector('#setFullName')?.addEventListener('change', (e) =>
    save({ profile: { ...state.settings.profile, fullName: e.target.value.trim() } }).then(afterProfile));
  panel.querySelector('#setNickname')?.addEventListener('change', (e) =>
    save({ profile: { ...state.settings.profile, nickname: e.target.value.trim() } }).then(afterProfile));
  panel.querySelector('#setRole')?.addEventListener('change', (e) =>
    save({ profile: { ...state.settings.profile, role: e.target.value } }).then(afterProfile));

  const ins = panel.querySelector('#setInstructions');
  const count = panel.querySelector('#insCount');
  ins?.addEventListener('input', () => { count.textContent = ins.value.length; });
  ins?.addEventListener('change', () => {
    St.saveSettings({ instructions: ins.value });
    St.toast('Instructions saved — applied to web and terminal.');
  });

  panel.querySelectorAll('[data-appearance]').forEach((b) =>
    b.addEventListener('click', () => {
      St.saveSettings({ appearance: b.dataset.appearance });
      St.applyAppearance();
      render();
      window.Sidebar.render();
    }));

  panel.querySelector('#setChatFont')?.addEventListener('change', (e) => {
    St.saveSettings({ chatFont: e.target.value });
    St.applyChatFont();
  });

  panel.querySelectorAll('[data-motion]').forEach((b) =>
    b.addEventListener('click', () => {
      St.saveSettings({ motion: b.dataset.motion });
      St.applyMotion();
      render();
    }));
}

function afterProfile() {
  window.Sidebar.render();
  renderNav();
}

async function usageSection() {
  const s = await St.api.get('/api/stats?range=all').catch(() => null);
  if (!s) return `<p class="empty-note">Couldn't load usage.</p>`;
  return `
    <div class="field-group">
      <h3>All time</h3>
      <dl>
        <div class="kv"><dt>Sessions</dt><dd>${s.sessions}</dd></div>
        <div class="kv"><dt>Messages</dt><dd>${s.messages}</dd></div>
        <div class="kv"><dt>Total tokens</dt><dd>${s.tokensEstimated ? '~' : ''}${s.totalTokens.toLocaleString()}</dd></div>
        <div class="kv"><dt>Active days</dt><dd>${s.activeDays}</dd></div>
        <div class="kv"><dt>Longest streak</dt><dd>${s.longestStreak} days</dd></div>
        <div class="kv"><dt>Peak hour</dt><dd>${St.fmtHour(s.peakHour)}</dd></div>
        <div class="kv"><dt>Favorite model</dt><dd>${St.esc(s.favoriteModel || '—')}</dd></div>
      </dl>
      <p class="hint" style="margin-top:12px">${St.esc(s.comparison)}</p>
    </div>
    <div class="notice">${window.icon('chart')}<div>Token counts are real where the provider reports them. The local Claude Code CLI reports none, so those are estimated at ~4 characters per token and shown with a "~".</div></div>
  `;
}

function capabilitiesSection() {
  return `<div class="field-group">
    <h3>What Costa Code can build</h3>
    <p class="hint">Click any of these in the sidebar or on Home to start with a matching prompt.</p>
    ${window.Sidebar.CAPABILITIES.map((c) => `
      <div class="list-row">
        <span style="width:22px;height:22px;color:var(--text-2);flex-shrink:0">${window.icon(c.id)}</span>
        <div class="list-main">
          <div class="list-title">${St.esc(c.label)}</div>
          <div class="list-desc">${St.esc(c.prompt)}…</div>
        </div>
      </div>`).join('')}
  </div>
  <div class="field-group">
    <h3>Studio agents</h3>
    <p class="hint">Each opens a chat with a specialised Costa Studio persona — the same personas the terminal's build phases use.</p>
    ${state.personas.map((p) => `
      <div class="list-row">
        <span style="width:22px;height:22px;color:var(--text-2);flex-shrink:0">${window.icon(p.id)}</span>
        <div class="list-main">
          <div class="list-title">${St.esc(p.agent)}</div>
          <div class="list-desc">${St.esc(p.tagline)}</div>
        </div>
      </div>`).join('')}
  </div>`;
}

function claudeCodeSection() {
  const mode = state.settings.claudeCode?.permissionMode || 'acceptEdits';
  const p = state.providers['claude-code'];
  return `
    <div class="field-group">
      <h3>Local CLI</h3>
      <dl>
        <div class="kv"><dt>Status</dt><dd>${p?.ready ? 'Available' : 'Not detected'}</dd></div>
        <div class="kv"><dt>Invocation</dt><dd>claude -p … --append-system-prompt …</dd></div>
      </dl>
    </div>
    <div class="field-group">
      <h3>Permissions</h3>
      <div class="pref-row">
        <div class="pref-text"><strong>Permission mode</strong><span>How much Claude Code may do without asking. "Accept edits" auto-approves file edits; other actions still prompt.</span></div>
        <div class="pref-control choice">
          <button data-perm="acceptEdits" class="${mode === 'acceptEdits' ? 'active' : ''}">Accept edits</button>
          <button data-perm="default" class="${mode === 'default' ? 'active' : ''}">Ask every time</button>
        </div>
      </div>
    </div>
    <div class="notice">${window.icon('shield')}<div><strong>This provider runs a real agent on your machine.</strong><br>It can read and edit files with the permissions above. Never expose this server on a public network.</div></div>
  `;
}

function privacySection() {
  return `
    <div class="field-group">
      <h3>Your data</h3>
      <p class="hint">Everything is stored in a local SQLite file. Nothing is sent anywhere except the model provider you pick for a given message.</p>
      <dl>
        <div class="kv"><dt>Database</dt><dd>costa-code-web/data/costa.db</dd></div>
        <div class="kv"><dt>Uploads</dt><dd>costa-code-web/.uploads/</dd></div>
        <div class="kv"><dt>Skills</dt><dd>~/.claude/skills/</dd></div>
      </dl>
    </div>
    <div class="field-group">
      <h3>Export</h3>
      <p class="hint">Download every chat, note, task, and setting as JSON.</p>
      <button class="btn" data-export>${window.icon('file')} Export all data</button>
    </div>
    <div class="field-group">
      <h3>Delete</h3>
      <p class="hint">Permanently removes the selected data from the local database. This cannot be undone.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-danger" data-wipe="chats">Delete all chats</button>
        <button class="btn btn-danger" data-wipe="notes">Delete all notes</button>
        <button class="btn btn-danger" data-wipe="tasks">Delete all tasks</button>
      </div>
    </div>
  `;
}

function developerSection() {
  const rows = Object.entries(state.providers).map(([, p]) => `
    <div class="list-row">
      <div class="list-main">
        <div class="list-title">${St.esc(p.label)}</div>
        <div class="list-desc">${p.envKey ? `Env var: ${St.esc(p.envKey)}` : 'Local CLI — no key needed'}</div>
      </div>
      <span class="pill ${p.ready ? 'ready' : 'missing'}">${p.ready ? 'ready' : 'no key'}</span>
    </div>`).join('');
  return `
    <div class="field-group">
      <h3>Providers</h3>
      <p class="hint">Keys are read server-side from <code>.env</code> and never sent to the browser. Restart the server after editing.</p>
      ${rows}
    </div>
    <div class="field-group">
      <h3>Endpoints</h3>
      <dl>
        <div class="kv"><dt>Server</dt><dd>${St.esc(location.origin)}</dd></div>
        <div class="kv"><dt>Stats</dt><dd>GET /api/stats?range=</dd></div>
        <div class="kv"><dt>Settings</dt><dd>GET, PUT /api/settings</dd></div>
        <div class="kv"><dt>Files</dt><dd>GET /api/fs/list, /api/fs/read</dd></div>
      </dl>
    </div>
  `;
}

async function skillsSection() {
  const items = await St.api.get('/api/skills').catch(() => []);
  return `
    <div class="field-group">
      <h3>Skills <span style="color:var(--muted);font-weight:400">(${items.length})</span></h3>
      <p class="hint">Read from <code>~/.claude/skills</code> — the same folder Claude Code and the terminal use.</p>
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <button class="btn" data-new-skill>${window.icon('plus')} New skill</button>
        <label class="btn" style="cursor:pointer">${window.icon('file')} Upload .md<input type="file" id="skillUpload" accept=".md" hidden /></label>
      </div>
      ${items.length ? items.map((s) => `
        <div class="list-row">
          <div class="list-main">
            <div class="list-title">${St.esc(s.name)}</div>
            <div class="list-desc">${St.esc(s.description)}</div>
          </div>
          <div class="list-actions">
            <button class="btn" data-try-skill="${St.esc(s.slug)}">Try</button>
            <button class="icon-btn sm" data-edit-skill="${St.esc(s.slug)}" data-name="${St.esc(s.name)}" data-desc="${St.esc(s.description)}" title="Edit">${window.icon('design')}</button>
            <button class="icon-btn sm" data-del-skill="${St.esc(s.slug)}" title="Delete">${window.icon('trash')}</button>
          </div>
        </div>`).join('') : `<p class="empty-note">No skills yet.</p>`}
    </div>
  `;
}

async function memorySection() {
  const [notes, tasks] = await Promise.all([
    St.api.get('/api/notes').catch(() => []),
    St.api.get('/api/tasks').catch(() => []),
  ]);
  return `
    <div class="field-group">
      <h3>Notes <span style="color:var(--muted);font-weight:400">(${notes.length})</span></h3>
      <p class="hint">Shared with the terminal — <code>costa notes list</code>.</p>
      ${notes.length ? notes.map((n) => `
        <div class="list-row"><div class="list-main"><div class="list-desc" style="color:var(--text)">${St.esc(n.content)}</div></div>
        <button class="icon-btn sm" data-del-note="${n.id}">${window.icon('trash')}</button></div>`).join('')
        : `<p class="empty-note">No notes yet.</p>`}
    </div>
    <div class="field-group">
      <h3>Tasks <span style="color:var(--muted);font-weight:400">(${tasks.filter((t) => !t.done).length} open)</span></h3>
      <p class="hint">Shared with the terminal — <code>costa tasks list</code>.</p>
      ${tasks.length ? tasks.map((t) => `
        <div class="list-row"><div class="list-main"><div class="list-desc" style="${t.done ? 'text-decoration:line-through' : 'color:var(--text)'}">${St.esc(t.text)}</div></div>
        <button class="icon-btn sm" data-del-task="${t.id}">${window.icon('trash')}</button></div>`).join('')
        : `<p class="empty-note">No tasks yet.</p>`}
    </div>
  `;
}

/* ---------- Render ---------- */
async function render() {
  renderNav();
  const panel = document.getElementById('settingsPanel');

  const bodyFor = {
    general: () => generalSection(),
    usage: usageSection,
    capabilities: () => capabilitiesSection(),
    'claude-code': () => claudeCodeSection(),
    privacy: () => privacySection(),
    developer: () => developerSection(),
    skills: skillsSection,
    memory: memorySection,
  };

  const build = bodyFor[activeSection];
  const body = build ? await build() : notice(LOCAL_ONLY[activeSection] || 'This section is part of the hosted product.');

  panel.innerHTML = `
    <div class="settings-head">
      <div style="flex:1;min-width:0">
        <h1>${St.esc(TITLES[activeSection] || 'Settings')}</h1>
        <p>${St.esc(SUBTITLES[activeSection] || '')}</p>
      </div>
      <button class="icon-btn" data-close-settings title="Close">${window.icon('close')}</button>
    </div>
    <div class="settings-body">${body}</div>
  `;

  if (activeSection === 'general') bindGeneral(panel);
  if (activeSection === 'claude-code') bindClaudeCode(panel);
  if (activeSection === 'privacy') bindPrivacy(panel);
  if (activeSection === 'skills') bindSkills(panel);
  if (activeSection === 'memory') bindMemory(panel);
}

function bindClaudeCode(panel) {
  panel.querySelectorAll('[data-perm]').forEach((b) =>
    b.addEventListener('click', () => {
      St.saveSettings({ claudeCode: { ...(state.settings.claudeCode || {}), permissionMode: b.dataset.perm } });
      render();
    }));
}

function bindPrivacy(panel) {
  panel.querySelector('[data-export]')?.addEventListener('click', async () => {
    const data = await St.api.get('/api/data/export');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `costa-code-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  panel.querySelectorAll('[data-wipe]').forEach((b) =>
    b.addEventListener('click', async () => {
      const scope = b.dataset.wipe;
      if (!confirm(`Delete all ${scope}? This cannot be undone.`)) return;
      await St.api.post('/api/data/wipe', { scope });
      St.toast(`All ${scope} deleted.`);
      if (scope === 'chats') {
        state.activeChatId = null;
        state.history = [];
        await window.Chat.refreshChats();
      }
      render();
    }));
}

function skillModal({ slug = null, name = '', description = '', content = '' } = {}) {
  window.Modal.open(`
    <h3>${slug ? `Edit ${St.esc(slug)}` : 'New skill'}</h3>
    <div class="field"><label>Name</label><input type="text" id="skName" value="${St.esc(name)}" /></div>
    <div class="field"><label>Description</label><input type="text" id="skDesc" value="${St.esc(description)}" /></div>
    <div class="field"><label>Content (SKILL.md body)</label><textarea id="skBody">${St.esc(content)}</textarea></div>
    <div class="modal-actions">
      <button class="btn" data-modal-close>Cancel</button>
      <button class="btn btn-primary" id="skSave">Save</button>
    </div>
  `, (modal) => {
    modal.querySelector('#skSave').addEventListener('click', async () => {
      const body = {
        name: modal.querySelector('#skName').value.trim(),
        description: modal.querySelector('#skDesc').value.trim(),
        content: modal.querySelector('#skBody').value,
      };
      if (!body.name || !body.description) { St.toast('Name and description are required.'); return; }
      try {
        if (slug) await St.api.put(`/api/skills/${slug}`, body);
        else await St.api.post('/api/skills', body);
        window.Modal.close();
        render();
        St.toast('Skill saved.');
      } catch (err) { St.toast(err.message); }
    });
  });
}

function bindSkills(panel) {
  panel.querySelector('[data-new-skill]')?.addEventListener('click', () => skillModal());
  panel.querySelector('#skillUpload')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      await St.api.upload('/api/skills/upload', fd);
      render();
      St.toast('Skill uploaded.');
    } catch (err) { St.toast(err.message); }
    e.target.value = '';
  });
  panel.querySelectorAll('[data-edit-skill]').forEach((b) =>
    b.addEventListener('click', () => skillModal({
      slug: b.dataset.editSkill, name: b.dataset.name, description: b.dataset.desc,
    })));
  panel.querySelectorAll('[data-del-skill]').forEach((b) =>
    b.addEventListener('click', async () => {
      if (!confirm(`Delete skill "${b.dataset.delSkill}"?`)) return;
      try { await St.api.del(`/api/skills/${b.dataset.delSkill}`); render(); St.toast('Skill deleted.'); }
      catch (err) { St.toast(err.message); }
    }));
  panel.querySelectorAll('[data-try-skill]').forEach((b) =>
    b.addEventListener('click', () => {
      close();
      window.Router.go('#/chat');
      setTimeout(() => window.Chat.prefill(`/${b.dataset.trySkill} `), 60);
    }));
}

function bindMemory(panel) {
  panel.querySelectorAll('[data-del-note]').forEach((b) =>
    b.addEventListener('click', async () => { await St.api.del(`/api/notes/${b.dataset.delNote}`); render(); }));
  panel.querySelectorAll('[data-del-task]').forEach((b) =>
    b.addEventListener('click', async () => { await St.api.del(`/api/tasks/${b.dataset.delTask}`); render(); }));
}

/* ---------- Open / close ---------- */
function open(section) {
  if (section) activeSection = section;
  document.getElementById('settingsOverlay').classList.add('open');
  render();
}
function close() {
  document.getElementById('settingsOverlay').classList.remove('open');
  window.Sidebar.render();
}
function isOpen() { return document.getElementById('settingsOverlay').classList.contains('open'); }

window.Settings = { open, close, isOpen, render };
})();
