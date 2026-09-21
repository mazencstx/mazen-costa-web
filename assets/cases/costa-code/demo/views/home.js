/* __IIFE__ */
(function () {
'use strict';

/* ---------- Home dashboard ---------- */
const H = window.Store;

let range = 'all';
let tab = 'overview';
let cached = null;

function greeting() {
  const p = H.state.settings.profile || {};
  const name = p.nickname || (p.fullName || '').split(' ')[0];
  return name ? window.Content.t('home.greeting', { name: H.esc(name) }) : window.Content.t('home.greetingNoName');
}

function statTile(label, value, opts = {}) {
  return `<div class="stat">
    <div class="stat-label">${H.esc(label)}</div>
    <div class="stat-value${opts.sm ? ' sm' : ''}">${value}</div>
  </div>`;
}

function heatLevel(count, max) {
  if (!count) return 0;
  if (max <= 1) return 4;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

function renderStatsCard(s) {
  if (tab === 'models') {
    const models = Object.entries(s.byModel || {}).sort((a, b) => b[1] - a[1]);
    const total = models.reduce((sum, [, n]) => sum + n, 0) || 1;
    const body = models.length
      ? `<div style="padding:16px">${models.map(([m, n]) => `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
              <span>${H.esc(m)}</span>
              <span style="color:var(--muted)">${n} ${n === 1 ? 'reply' : 'replies'}</span>
            </div>
            <div style="height:6px;border-radius:3px;background:var(--heat-0);overflow:hidden">
              <div style="height:100%;width:${Math.round((n / total) * 100)}%;background:var(--accent)"></div>
            </div>
          </div>`).join('')}</div>`
      : `<p class="empty-note" style="padding:20px">No model activity in this range yet.</p>`;
    return body;
  }

  const tokens = `${s.tokensEstimated ? '~' : ''}${H.fmtNumber(s.totalTokens)}`;
  return `
    <div class="stat-grid">
      ${statTile(window.Content.t('stat.sessions'), H.fmtNumber(s.sessions))}
      ${statTile(window.Content.t('stat.messages'), H.fmtNumber(s.messages))}
      ${statTile(window.Content.t('stat.tokens'), tokens)}
      ${statTile(window.Content.t('stat.activeDays'), H.fmtNumber(s.activeDays))}
      ${statTile(window.Content.t('stat.currentStreak'), `${s.currentStreak}d`)}
      ${statTile(window.Content.t('stat.longestStreak'), `${s.longestStreak}d`)}
      ${statTile(window.Content.t('stat.peakHour'), H.fmtHour(s.peakHour), { sm: true })}
      ${statTile(window.Content.t('stat.favoriteModel'), H.esc(s.favoriteModel || '—'), { sm: true })}
    </div>
    <div class="heatmap-wrap">
      <div class="heatmap">
        ${s.heatmap.map((d) => `<div class="heat-cell" data-level="${heatLevel(d.count, s.maxCount)}" title="${d.date}: ${d.count} message${d.count === 1 ? '' : 's'}"></div>`).join('')}
      </div>
    </div>
    <div class="heat-foot">${H.esc(s.comparison || '')}</div>
  `;
}

function render(container) {
  const s = cached;
  container.innerHTML = `
    <div class="view-inner">
      <div class="card">
        <div class="card-head">
          <div class="tabs">
            <button class="tab${tab === 'overview' ? ' active' : ''}" data-tab="overview">${H.esc(window.Content.t('home.tabOverview'))}</button>
            <button class="tab${tab === 'models' ? ' active' : ''}" data-tab="models">${H.esc(window.Content.t('home.tabModels'))}</button>
          </div>
          <div class="seg">
            ${['all', '3d', '7d', '30d'].map((r) => `<button class="${r === range ? 'active' : ''}" data-range="${r}">${r === 'all' ? 'All' : r}</button>`).join('')}
          </div>
        </div>
        ${s ? renderStatsCard(s) : `<p class="empty-note" style="padding:24px">Loading stats…</p>`}
      </div>

      <h2 class="section-title">${H.esc(window.Content.t('home.quickActions'))}</h2>
      <div class="quick-grid">
        ${window.Sidebar.CAPABILITIES.map((c) => `
          <button class="quick-card" data-capability="${c.id}">
            ${window.Content.iconFor(c.id)}
            <span class="quick-label">${H.esc(c.label)}</span>
          </button>
        `).join('')}
      </div>

      <div class="home-foot">
        <div class="mascot" data-mascot="lg"></div>
        <div class="home-foot-tag">${H.esc(window.Content.t('brand.slogan'))}</div>
      </div>
    </div>
  `;

  H.paintMascots();

  container.querySelectorAll('[data-tab]').forEach((b) =>
    b.addEventListener('click', () => { tab = b.dataset.tab; render(container); }));
  container.querySelectorAll('[data-range]').forEach((b) =>
    b.addEventListener('click', () => { range = b.dataset.range; load(container); }));
}

async function load(container) {
  try {
    cached = await H.api.get(`/api/stats?range=${encodeURIComponent(range)}`);
  } catch (err) {
    cached = null;
    H.toast(`Couldn't load stats: ${err.message}`);
  }
  render(container);
}

function mount() {
  const topbar = document.getElementById('topbar');
  const view = document.getElementById('view');
  document.getElementById('composerWrap').hidden = true;

  topbar.innerHTML = `
    <div class="topbar-title">${window.Content.t('home.emoji')} <span>${greeting()}</span></div>
    <div class="topbar-actions">
      ${window.Chat.modelPickerHTML()}
      <button class="btn" data-new-chat>${window.icon('plus')} New</button>
    </div>
  `;
  window.Chat.bindModelPicker(topbar);

  view.innerHTML = `<div class="view-inner"><p class="empty-note">Loading…</p></div>`;
  load(view);
}

window.Home = { mount };
})();
