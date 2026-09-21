/* __IIFE__ */
(function () {
'use strict';

/* ---------- Prompt Engineer ---------- */
/* A library of reusable prompts: write once, then send them straight into a
   chat. Stored in the same local database as everything else, so the
   terminal (`costa prompts`) sees the identical list. */

const Pr = window.Store;

let items = [];
let filter = '';

function tagList(tags) {
  return (tags || '').split(',').map((t) => t.trim()).filter(Boolean);
}

function card(p) {
  const tags = tagList(p.tags);
  return `
    <div class="card prompt-card" data-prompt-id="${p.id}">
      <div class="prompt-head">
        <div class="prompt-title">${Pr.esc(p.title)}</div>
        <div class="list-actions">
          <button class="btn" data-use="${p.id}">${window.icon('send')} Use</button>
          <button class="icon-btn sm" data-edit="${p.id}" title="Edit">${window.icon('design')}</button>
          <button class="icon-btn sm" data-copy="${p.id}" title="Copy">${window.icon('file')}</button>
          <button class="icon-btn sm" data-del="${p.id}" title="Delete">${window.icon('trash')}</button>
        </div>
      </div>
      <pre class="prompt-body">${Pr.esc(p.body)}</pre>
      ${p.images?.length ? `<div class="img-strip img-strip--sm">${p.images.map((u) => `<span class="img-thumb"><img src="${Pr.esc(u)}" alt="" /></span>`).join('')}</div>` : ''}
      <div class="prompt-foot">
        <div class="tag-row">${tags.map((t) => `<span class="tag">${Pr.esc(t)}</span>`).join('')}</div>
        <span class="prompt-uses">${p.uses ? `used ${p.uses}×` : 'never used'}</span>
      </div>
    </div>`;
}

function editor(p = null) {
  // Images live in the modal's own working copy until Save, so cancelling
  // doesn't leave half-attached references on the prompt.
  let images = [...(p?.images || [])];

  window.Modal.open(`
    <h3>${p ? 'Edit prompt' : 'New prompt'}</h3>
    <div class="field"><label>Title</label><input type="text" id="pTitle" value="${Pr.esc(p?.title || '')}" placeholder="Cyberpunk landing page" /></div>
    <div class="field"><label>Tags <span style="color:var(--muted)">(comma separated)</span></label><input type="text" id="pTags" value="${Pr.esc(p?.tags || '')}" placeholder="web, hero, brand" /></div>
    <div class="field"><label>Prompt</label><textarea id="pBody" style="min-height:180px" placeholder="Write the full prompt here…">${Pr.esc(p?.body || '')}</textarea></div>
    <div class="field">
      <label>Reference images</label>
      <div class="img-strip" id="pImages"></div>
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:8px">
        <label class="btn" style="cursor:pointer">${window.icon('file')} Upload<input type="file" id="pUpload" accept="image/*" hidden multiple /></label>
        <button type="button" class="btn" id="pFromUrl">${window.icon('globe')} From URL</button>
      </div>
      <div class="hint" style="margin-top:6px">Dropped or pasted images work too. They're saved locally and sent with the prompt.</div>
    </div>
    <div class="modal-actions">
      <button class="btn" data-modal-close>Cancel</button>
      <button class="btn btn-primary" id="pSave">Save</button>
    </div>
  `, (modal) => {
    const strip = modal.querySelector('#pImages');

    function renderStrip() {
      strip.innerHTML = images.length
        ? images.map((url, i) => `
            <span class="img-thumb">
              <img src="${Pr.esc(url)}" alt="" />
              <button type="button" data-rm-img="${i}" title="Remove">${window.icon('close')}</button>
            </span>`).join('')
        : `<p class="empty-note" style="margin:0">No images attached.</p>`;
      strip.querySelectorAll('[data-rm-img]').forEach((b) =>
        b.addEventListener('click', () => { images.splice(Number(b.dataset.rmImg), 1); renderStrip(); }));
    }
    renderStrip();

    async function addFiles(fileList) {
      const fd = new FormData();
      for (const f of fileList) if (f.type.startsWith('image/')) fd.append('files', f);
      if (!fd.has('files')) return;
      try {
        const { files } = await Pr.api.upload('/api/assets/upload', fd);
        images.push(...files.map((f) => f.url));
        renderStrip();
      } catch (err) { Pr.toast(err.message); }
    }

    modal.querySelector('#pUpload').addEventListener('change', (e) => {
      addFiles(e.target.files);
      e.target.value = '';
    });

    modal.querySelector('#pFromUrl').addEventListener('click', async () => {
      const url = prompt('Paste an image URL:');
      if (!url) return;
      try {
        const { file } = await Pr.api.post('/api/assets/import-url', { url });
        images.push(file.url);
        renderStrip();
      } catch (err) { Pr.toast(err.message); }
    });

    // Drag-and-drop and clipboard paste, anywhere in the editor.
    modal.addEventListener('dragover', (e) => e.preventDefault());
    modal.addEventListener('drop', (e) => {
      if (!e.dataTransfer.files.length) return;
      e.preventDefault();
      addFiles(e.dataTransfer.files);
    });
    modal.addEventListener('paste', (e) => {
      const files = [...(e.clipboardData?.files || [])];
      if (files.length) { e.preventDefault(); addFiles(files); }
    });

    modal.querySelector('#pSave').addEventListener('click', async () => {
      const payload = {
        title: modal.querySelector('#pTitle').value.trim(),
        tags: modal.querySelector('#pTags').value.trim(),
        body: modal.querySelector('#pBody').value.trim(),
        images,
      };
      if (!payload.title || !payload.body) { Pr.toast('Title and prompt are required.'); return; }
      try {
        if (p) await Pr.api.put(`/api/prompts/${p.id}`, payload);
        else await Pr.api.post('/api/prompts', payload);
        window.Modal.close();
        Pr.toast(p ? 'Prompt updated.' : 'Prompt saved.');
        await load();
      } catch (err) { Pr.toast(err.message); }
    });
  });
}

function render() {
  const view = document.getElementById('view');
  const term = filter.trim().toLowerCase();
  const shown = term
    ? items.filter((p) =>
        p.title.toLowerCase().includes(term) ||
        p.body.toLowerCase().includes(term) ||
        (p.tags || '').toLowerCase().includes(term))
    : items;

  view.innerHTML = `
    <div class="view-inner">
      <div class="prompt-toolbar">
        <div class="search-box" style="margin:0;flex:1">
          ${window.icon('search')}
          <input type="text" id="promptSearch" placeholder="Search prompts…" value="${Pr.esc(filter)}" />
        </div>
        <button class="btn btn-primary" id="newPrompt">${window.icon('plus')} New prompt</button>
      </div>

      ${shown.length
        ? `<div class="prompt-grid">${shown.map(card).join('')}</div>`
        : items.length
          ? `<p class="empty-note" style="padding:30px 0">No prompts match "${Pr.esc(filter)}".</p>`
          : `<div class="empty-state" style="padding:50px 20px">
               <div class="mascot" data-mascot="lg"></div>
               <h2>No saved prompts yet</h2>
               <p>Save the prompts you reuse — briefs, brand rules, image directions — and send them into any chat in one click.</p>
               <button class="btn btn-primary" id="newPromptEmpty" style="margin-top:16px">${window.icon('plus')} New prompt</button>
             </div>`}
    </div>
  `;

  Pr.paintMascots();

  const search = view.querySelector('#promptSearch');
  search?.addEventListener('input', () => {
    filter = search.value;
    const pos = search.selectionStart;
    render();
    const next = document.getElementById('promptSearch');
    next.focus();
    next.setSelectionRange(pos, pos);
  });

  view.querySelector('#newPrompt')?.addEventListener('click', () => editor());
  view.querySelector('#newPromptEmpty')?.addEventListener('click', () => editor());

  view.querySelectorAll('[data-edit]').forEach((b) =>
    b.addEventListener('click', () => editor(items.find((p) => p.id === Number(b.dataset.edit)))));

  view.querySelectorAll('[data-del]').forEach((b) =>
    b.addEventListener('click', async () => {
      const p = items.find((x) => x.id === Number(b.dataset.del));
      if (!confirm(`Delete prompt "${p.title}"?`)) return;
      await Pr.api.del(`/api/prompts/${p.id}`);
      Pr.toast('Prompt deleted.');
      await load();
    }));

  view.querySelectorAll('[data-copy]').forEach((b) =>
    b.addEventListener('click', async () => {
      const p = items.find((x) => x.id === Number(b.dataset.copy));
      try { await navigator.clipboard.writeText(p.body); Pr.toast('Copied to clipboard.'); }
      catch { Pr.toast('Clipboard blocked by the browser.'); }
    }));

  view.querySelectorAll('[data-use]').forEach((b) =>
    b.addEventListener('click', async () => {
      const p = items.find((x) => x.id === Number(b.dataset.use));
      Pr.api.post(`/api/prompts/${p.id}/use`).catch(() => {});
      // Hand off to a fresh chat with the prompt — and its reference images —
      // already staged in the composer.
      window.Chat.startNew(null, p.body, (p.images || []).map((url) => ({
        name: url.split('/').pop(),
        url,
      })));
    }));
}

async function load() {
  items = await Pr.api.get('/api/prompts').catch(() => []);
  render();
}

function mount() {
  const topbar = document.getElementById('topbar');
  document.getElementById('composerWrap').hidden = true;
  // Start clean each visit — a filter left over from last time makes the
  // library look half-empty.
  filter = '';

  topbar.innerHTML = `
    <div class="mascot" data-mascot="sm" style="width:26px;height:21px"></div>
    <div class="topbar-title"><span>Prompt Engineer</span></div>
    <div class="topbar-actions">
      ${window.Chat.modelPickerHTML()}
      <button class="btn" data-new-chat>${window.icon('plus')} New</button>
    </div>
  `;
  window.Chat.bindModelPicker(topbar);

  document.getElementById('view').innerHTML = `<div class="view-inner"><p class="empty-note">Loading…</p></div>`;
  load();
}

window.Prompts = { mount };
})();
