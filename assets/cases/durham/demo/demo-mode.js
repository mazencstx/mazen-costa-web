/* ============================================================
   DURHAM — DEMO MODE
   ------------------------------------------------------------
   Served as static files, so there is no Express server behind this.
   The three endpoints the storefront uses are answered here instead,
   against the real catalogue in demo-data.js:

     GET  /api/products[?color=]  → filtered list
     GET  /api/products/:id       → one product (404 when missing,
                                     same as the server)
     POST /api/orders             → mints an order and returns 201

   The cart itself was always client-side, so it is untouched. Orders
   are confirmed on screen but nothing is transmitted or stored.
   ============================================================ */
(function () {
  'use strict';

  var PRODUCTS = window.DURHAM_DEMO_PRODUCTS || [];
  var orderSeq = 1042;

  function json(body, status) {
    return new Response(JSON.stringify(body), {
      status: status || 200,
      headers: { 'content-type': 'application/json' }
    });
  }

  function handle(url, method, body) {
    var u;
    try { u = new URL(url, location.href); } catch (e) { return null; }
    var p = u.pathname;
    var i = p.indexOf('/api/');
    if (i === -1) return null;
    p = p.slice(i);

    // GET /api/products/:id
    var m = p.match(/^\/api\/products\/(.+)$/);
    if (m && method === 'GET') {
      var found = PRODUCTS.filter(function (x) { return String(x.id) === String(m[1]); })[0];
      return found ? json(found) : json({ error: 'Product not found' }, 404);
    }

    // GET /api/products?color=
    if (p === '/api/products' && method === 'GET') {
      var color = u.searchParams.get('color');
      return json(color ? PRODUCTS.filter(function (x) { return x.color === color; }) : PRODUCTS);
    }

    // POST /api/orders
    if (p === '/api/orders' && method === 'POST') {
      var d = body || {};
      if (!d.name || !d.phone || !d.address || !d.items || !d.items.length) {
        return json({ error: 'name, phone, address and items are required' }, 400);
      }
      return json({
        id: ++orderSeq,
        name: d.name, phone: d.phone, address: d.address,
        notes: d.notes || '', items: d.items,
        total_egp: Number(d.total_egp) || 0,
        created_at: new Date().toISOString()
      }, 201);
    }

    if (p.indexOf('/api/') === 0) return json([]);
    return null;
  }

  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf('/api/') === -1) return realFetch(input, init);
    var method = ((init && init.method) || 'GET').toUpperCase();
    var body = null;
    if (init && init.body) { try { body = JSON.parse(init.body); } catch (e) {} }
    var res = handle(url, method, body);
    return res ? Promise.resolve(res) : realFetch(input, init);
  };

  /* A small, dismissible note explaining that checkout is not real. */
  function banner() {
    if (document.getElementById('dhDemoNote')) return;
    var el = document.createElement('div');
    el.id = 'dhDemoNote';
    el.innerHTML =
      '<span dir="auto">ديمو ثابت — المتجر شغال بالكامل، بس الطلب مش بيتبعت فعليًا.<br>' +
      '<b>Static demo</b> — the store works; orders are not actually submitted.</span>' +
      '<button type="button" aria-label="close">&times;</button>';
    el.style.cssText = [
      'position:fixed', 'z-index:99999', 'left:50%', 'transform:translateX(-50%)',
      'bottom:16px', 'max-width:min(560px,90vw)', 'display:flex', 'gap:14px',
      'align-items:center', 'justify-content:space-between',
      'background:rgba(10,10,10,.95)', 'color:#fff',
      'border:1px solid rgba(255,255,255,.16)', 'border-radius:8px',
      'padding:11px 15px',
      'font:500 12.5px/1.55 system-ui,-apple-system,Segoe UI,sans-serif',
      'box-shadow:0 10px 32px rgba(0,0,0,.4)', 'transition:opacity .4s'
    ].join(';');
    var b = el.querySelector('button');
    b.style.cssText = 'background:none;border:0;color:#fff;font-size:21px;line-height:1;cursor:pointer;padding:0 2px;flex-shrink:0;opacity:.7';
    b.addEventListener('click', function () { el.remove(); });
    document.body.appendChild(el);
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
