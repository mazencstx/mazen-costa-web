/* ============================================================
   Costa Code Web — DEMO MODE
   ------------------------------------------------------------
   This build is served as static files, so there is no Node server
   behind it. Every call the app makes to /api/* is answered here
   instead:

     • GET  routes return the real response shapes, captured from the
       actual server (see demo-data.js) and populated with sample
       content so the interface renders as it does in production.
     • POST /api/chat streams a scripted reply back in chunks, through
       the same reader loop the live build uses, so the typing
       animation and mascot states behave identically.
     • Writes (POST/PUT/PATCH/DELETE) are accepted and applied to the
       in-memory copy, so clicking around feels real for the session
       and nothing throws. Nothing persists past a refresh.

   Everything else in the app is client-side and runs untouched.
   ============================================================ */
(function () {
  'use strict';

  var DB = JSON.parse(JSON.stringify(window.COSTA_DEMO_DATA || {}));
  var nextId = 1000;

  var REPLY = [
    "You're looking at the real Costa Code Web interface, running as a static demo — ",
    "so this particular reply is scripted rather than generated.\n\n",
    "In the full build this same view streams live from Claude, Gemini or DeepSeek, ",
    "with the model picker in the top bar switching between them, every chat saved to ",
    "SQLite, and the mascot reacting as the answer comes in.\n\n",
    "Everything else here is real and clickable — open the saved prompts, browse the ",
    "notes and tasks, check the usage dashboard in settings, and try the site editor.\n\n",
    "— Costa Studio"
  ].join('');

  /* Hand the reply over in small chunks so the app's reader loop and
     type-out animation behave just like a real streamed response. */
  function streamOf(text) {
    var enc = new TextEncoder();
    var i = 0;
    return new ReadableStream({
      pull: function (c) {
        if (i >= text.length) { c.close(); return; }
        var step = 3 + Math.floor(Math.random() * 4);
        c.enqueue(enc.encode(text.slice(i, i + step)));
        i += step;
        return new Promise(function (r) { setTimeout(r, 14); });
      }
    });
  }

  function json(body, status) {
    return new Response(JSON.stringify(body), {
      status: status || 200,
      headers: { 'content-type': 'application/json' }
    });
  }
  var noContent = function () { return new Response(null, { status: 204 }); };

  function pathOf(url) {
    // keep the query string: /api/stats?range=7d is a distinct fixture key
    var i = url.indexOf('/api/');
    return i === -1 ? url : url.slice(i);
  }

  function handle(route, method, body) {
    var m;

    /* ---- chat streaming ---- */
    if (route === '/api/chat' && method === 'POST') {
      return new Response(streamOf(REPLY), {
        status: 200,
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      });
    }

    /* ---- chat messages ---- */
    if ((m = route.match(/^\/api\/chats\/([^/]+)\/messages$/))) {
      return json(DB['/api/chats/' + m[1] + '/messages'] || []);
    }

    /* ---- creates ---- */
    if (method === 'POST' && route === '/api/chats') {
      var chat = { id: ++nextId, title: (body && body.title) || 'New chat',
                   created_at: new Date().toISOString() };
      DB['/api/chats'].unshift(chat);
      DB['/api/chats/' + chat.id + '/messages'] = [];
      return json(chat, 201);
    }
    if (method === 'POST' && route === '/api/notes') {
      var note = { id: ++nextId, content: (body && body.content) || '',
                   created_at: new Date().toISOString() };
      DB['/api/notes'].unshift(note);
      return json(note, 201);
    }
    if (method === 'POST' && route === '/api/tasks') {
      var task = { id: ++nextId, title: (body && body.title) || '', done: 0,
                   created_at: new Date().toISOString() };
      DB['/api/tasks'].unshift(task);
      return json(task, 201);
    }
    if (method === 'POST' && route === '/api/prompts') {
      var pr = Object.assign({ id: ++nextId, uses: 0,
                               created_at: new Date().toISOString() }, body || {});
      DB['/api/prompts'].unshift(pr);
      return json(pr, 201);
    }

    /* ---- task toggle ---- */
    if (method === 'PATCH' && (m = route.match(/^\/api\/tasks\/(\d+)$/))) {
      var t = DB['/api/tasks'].find(function (x) { return String(x.id) === m[1]; });
      if (t) t.done = body && body.done ? 1 : 0;
      return json(t || {});
    }

    /* ---- prompt "use" counter ---- */
    if (method === 'POST' && (m = route.match(/^\/api\/prompts\/(\d+)\/use$/))) {
      var p = DB['/api/prompts'].find(function (x) { return String(x.id) === m[1]; });
      if (p) p.uses = (p.uses || 0) + 1;
      return json(p || {});
    }

    /* ---- settings ---- */
    if (method === 'PUT' && route === '/api/settings') {
      DB['/api/settings'] = Object.assign({}, DB['/api/settings'], body || {});
      return json(DB['/api/settings']);
    }

    /* ---- deletes ---- */
    if (method === 'DELETE') {
      var lists = { chats: '/api/chats', notes: '/api/notes',
                    tasks: '/api/tasks', prompts: '/api/prompts' };
      for (var k in lists) {
        var re = new RegExp('^/api/' + k + '/([^/]+)$');
        if ((m = route.match(re)) && Array.isArray(DB[lists[k]])) {
          DB[lists[k]] = DB[lists[k]].filter(function (x) { return String(x.id) !== m[1]; });
          return noContent();
        }
      }
      return noContent();
    }

    /* ---- plain reads ---- */
    if (Object.prototype.hasOwnProperty.call(DB, route)) return json(DB[route]);

    /* ---- filesystem browser: not available without a server ---- */
    if (route.indexOf('/api/fs/') === 0) return json({ entries: [], files: [], path: '' });

    /* ---- anything else: shape-safe empty ---- */
    if (method !== 'GET') return json({ ok: true });
    return json([]);
  }

  var realFetch = window.fetch.bind(window);

  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf('/api/') === -1) return realFetch(input, init);

    var method = ((init && init.method) || 'GET').toUpperCase();
    var body = null;
    if (init && init.body) { try { body = JSON.parse(init.body); } catch (e) { body = null; } }

    try {
      return Promise.resolve(handle(pathOf(url), method, body));
    } catch (e) {
      return Promise.resolve(json({ error: String(e && e.message || e) }, 500));
    }
  };

  /* A small, dismissible note so a visitor knows why the reply is canned. */
  function banner() {
    if (document.getElementById('ccDemoNote')) return;
    var el = document.createElement('div');
    el.id = 'ccDemoNote';
    el.innerHTML =
      '<span dir="auto">ديمو ثابت — الواجهة الحقيقية بالكامل، ورد الشات مكتوب مسبقًا.<br>' +
      '<b>Static demo</b> — the real interface; the chat reply is scripted.</span>' +
      '<button type="button" aria-label="close">&times;</button>';
    /* Rides in the empty middle of the top bar — the page title sits left and
       the model picker right, while the composer owns the bottom. */
    el.style.cssText = [
      'position:fixed', 'z-index:99999', 'left:50%', 'transform:translateX(-50%)',
      'top:16px', 'max-width:min(520px,74vw)', 'display:flex', 'gap:14px',
      'align-items:center', 'justify-content:space-between',
      'background:rgba(12,12,14,.94)', 'color:#fff',
      'border:1px solid rgba(255,255,255,.14)', 'border-radius:10px',
      'padding:11px 15px', 'font:500 12.5px/1.55 Inter,system-ui,sans-serif',
      'box-shadow:0 10px 34px rgba(0,0,0,.45)', 'backdrop-filter:blur(6px)',
      'transition:opacity .4s'
    ].join(';');
    var b = el.querySelector('button');
    b.style.cssText = 'background:none;border:0;color:#FF2A2A;font-size:21px;line-height:1;cursor:pointer;padding:0 2px;flex-shrink:0';
    b.addEventListener('click', function () { el.remove(); });
    document.body.appendChild(el);
    /* Say it once, then get out of the way. */
    setTimeout(function () {
      if (!el.isConnected) return;
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 450);
    }, 11000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', banner);
  } else { banner(); }
})();
