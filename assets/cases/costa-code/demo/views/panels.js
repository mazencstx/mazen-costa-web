/* __IIFE__ */
(function () {
'use strict';

/* ---------- Collapsible sidebar panels: Notes / Tasks / Files ---------- */
const P = window.Store;

let filesPath = '.';

function slot(id) { return document.querySelector(`[data-panel="${id}"]`); }

/* ---------- Notes ---------- */
async function renderNotes() {
  const el = slot('notes');
  if (!el) return;
  const items = await P.api.get('/api/notes').catch(() => []);
  el.innerHTML = `
    <form class="inline-form" data-note-form>
      <textarea rows="2" placeholder="Quick note…"></textarea>
      <button type="submit" class="btn">Add</button>
    </form>
    ${items.length
      ? items.map((n) => `
        <div class="chat-row" style="cursor:default;align-items:flex-start">
          <span style="white-space:normal;line-height:1.5">${P.esc(n.content)}</span>
          <button class="row-del" data-del-note="${n.id}">${window.icon('close')}</button>
        </div>`).join('')
      : `<p class="empty-note">No notes yet.</p>`}
  `;

  el.querySelector('[data-note-form]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const ta = e.target.querySelector('textarea');
    const content = ta.value.trim();
    if (!content) return;
    await P.api.post('/api/notes', { content });
    ta.value = '';
    renderNotes();
  });
  el.querySelectorAll('[data-del-note]').forEach((b) =>
    b.addEventListener('click', async () => {
      await P.api.del(`/api/notes/${b.dataset.delNote}`);
      renderNotes();
    }));
}

/* ---------- Tasks ---------- */
async function renderTasks() {
  const el = slot('tasks');
  if (!el) return;
  const items = await P.api.get('/api/tasks').catch(() => []);
  el.innerHTML = `
    <form class="inline-form" data-task-form>
      <input type="text" placeholder="New task…" />
      <button type="submit" class="btn">Add</button>
    </form>
    ${items.length
      ? items.map((t) => `
        <div class="chat-row" style="cursor:default">
          <label style="display:flex;gap:8px;align-items:center;flex:1;cursor:pointer;min-width:0">
            <input type="checkbox" data-task="${t.id}" ${t.done ? 'checked' : ''} style="accent-color:var(--accent);flex-shrink:0" />
            <span style="${t.done ? 'text-decoration:line-through;color:var(--muted)' : ''}">${P.esc(t.text)}</span>
          </label>
          <button class="row-del" data-del-task="${t.id}">${window.icon('close')}</button>
        </div>`).join('')
      : `<p class="empty-note">No tasks yet.</p>`}
  `;

  el.querySelector('[data-task-form]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const text = input.value.trim();
    if (!text) return;
    await P.api.post('/api/tasks', { text });
    input.value = '';
    renderTasks();
  });
  el.querySelectorAll('[data-task]').forEach((cb) =>
    cb.addEventListener('change', async () => {
      await P.api.patch(`/api/tasks/${cb.dataset.task}`, { done: cb.checked });
      renderTasks();
    }));
  el.querySelectorAll('[data-del-task]').forEach((b) =>
    b.addEventListener('click', async () => {
      await P.api.del(`/api/tasks/${b.dataset.delTask}`);
      renderTasks();
    }));
}

/* ---------- Files ---------- */
function fileIcon(name, isDir) {
  if (isDir) return 'folder';
  return 'file';
}

async function renderFiles(path = filesPath) {
  const el = slot('files');
  if (!el) return;
  let data;
  try {
    data = await P.api.get(`/api/fs/list?path=${encodeURIComponent(path)}`);
  } catch (err) {
    el.innerHTML = `<p class="empty-note">${P.esc(err.message)}</p>`;
    return;
  }
  filesPath = data.path;

  const parts = data.path === '.' ? [] : data.path.split('/');
  const crumbs = [`<button data-crumb=".">~</button>`];
  let acc = '';
  for (const part of parts) {
    acc = acc ? `${acc}/${part}` : part;
    crumbs.push(`<span>/</span><button data-crumb="${P.esc(acc)}">${P.esc(part)}</button>`);
  }

  el.innerHTML = `
    <div class="file-crumbs">${crumbs.join('')}</div>
    <div class="file-list">
      ${data.path !== '.' ? `<button class="file-row is-dir" data-dir="${P.esc(parts.slice(0, -1).join('/') || '.')}">${window.icon('folder')}<span>..</span></button>` : ''}
      ${data.entries.map((e) => {
        const full = data.path === '.' ? e.name : `${data.path}/${e.name}`;
        return `<button class="file-row${e.isDir ? ' is-dir' : ''}" data-${e.isDir ? 'dir' : 'file'}="${P.esc(full)}">
          ${window.icon(fileIcon(e.name, e.isDir))}<span>${P.esc(e.name)}</span>
        </button>`;
      }).join('')}
    </div>
  `;

  el.querySelectorAll('[data-crumb]').forEach((b) => b.addEventListener('click', () => renderFiles(b.dataset.crumb)));
  el.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => renderFiles(b.dataset.dir)));
  el.querySelectorAll('[data-file]').forEach((b) => b.addEventListener('click', () => previewFile(b.dataset.file)));
}

async function previewFile(relPath) {
  let data;
  try {
    data = await P.api.get(`/api/fs/read?path=${encodeURIComponent(relPath)}`);
  } catch (err) {
    P.toast(err.message);
    return;
  }
  window.Modal.open(`
    <h3>${P.esc(relPath)}</h3>
    <pre class="file-preview">${P.esc(data.content)}</pre>
    <div class="modal-actions">
      <button class="btn" data-modal-close>Close</button>
      <button class="btn btn-primary" data-insert-ref="${P.esc(relPath)}">Insert reference</button>
    </div>
  `, (modal) => {
    modal.querySelector('[data-insert-ref]').addEventListener('click', () => {
      const input = document.getElementById('promptInput');
      if (input) {
        input.value += (input.value ? ' ' : '') + `@~/${relPath} `;
        input.dispatchEvent(new Event('input'));
      }
      window.Modal.close();
      input?.focus();
    });
  });
}

function render(id) {
  if (id === 'notes') return renderNotes();
  if (id === 'tasks') return renderTasks();
  if (id === 'files') return renderFiles();
}

window.Panels = { render, renderNotes, renderTasks, renderFiles };
})();
