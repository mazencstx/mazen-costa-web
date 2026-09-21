/* MAZEN ARCADE — two original mini-games sharing one points wallet.
   1) LOGO CATCHER   — catch Costa logos, dodge TEMPLATE boxes.
   2) ONE MAN AGENCY — you are the whole agency: four desks, one person. Serve every client before their patience runs out.
   Points add up across games and unlock discount tiers, claimed through a WhatsApp message with a code.
   NOTE: the wallet lives in the visitor's browser, so it is a fun loyalty mechanic, not a secure system (see _source/verify.html). */
(() => {
  "use strict";
  const root = document.documentElement;
  const lang = () => (root.lang === "ar" ? "ar" : "en");

  // ================= CONFIG (edit these) =================
  const TIERS = [{ pts: 150, off: 5 }, { pts: 400, off: 10 }, { pts: 800, off: 15 }];   // total points -> % discount
  const RUN_CAP = 120;                    // max points one single run can add (limits abuse)
  const WA_NUMBER = "201130728071";
  // ========================================================

  const TXT = {
    en: {
      arcade: "MAZEN ARCADE", sub: "Play. Collect points. Win a discount.", wallet: "YOUR POINTS", next: (n, o) => `${n} more points → ${o}% off`, maxed: "Top tier unlocked!", codeLabel: "Your code",
      claim: "CLAIM ON WHATSAPP", locked: (n) => `${n} more points to unlock`, g1: "LOGO CATCHER", g1d: "Catch logos, dodge templates", g2: "DEADLINE DASH", g2d: "Run. Jump. Beat the deadline.", best: "BEST", score: "SCORE",
      back: "‹ Games", play: "PLAY", again: "PLAY AGAIN", over: "GAME OVER", newbest: "NEW BEST!", earned: (n) => `+${n} points`, wa: "Tell Mazen your score", rankLabel: "Your rank",
      ranks: ["Intern", "Junior Designer", "Designer", "Art Director", "Creative Director"], tiersTitle: "DISCOUNT TIERS", note: "Discount is confirmed by Mazen on WhatsApp",
      c_sub: "Catch the Costa logos. Dodge the templates.", c_how: "Move with your mouse, finger or arrow keys", c_leg: ["+1 logo", "+5 AI star", "lose a life"], tpl: "TEMPLATE", combo: "COMBO", starMsg: "AI STAR: templates cleared!",
      a_sub: "Keep running. The deadline won't wait.", a_how: "Tap or press Space to jump. Tap again in the air to double-jump. Hold to jump higher.", a_leg: ["+2 per logo", "jump the boxes", "AI star: shield"], obs: ["REVISION", "TEMPLATE", "URGENT", "DEADLINE"], m: "M", dist: "DISTANCE", short: (n) => `${n} m short of your best distance!`, tierUp: (o) => `${o}% OFF UNLOCKED!`, shield: "AI SHIELD", clean: "CLEAN", newDist: "NEW BEST DISTANCE!", tapHint: "TAP TO JUMP",
      msg: (o) => `Hi Mazen! I earned ${o.pts} points playing on your site and unlocked ${o.off}% off. Code: ${o.code}`, msgScore: (o) => `Hi Mazen! I scored ${o.score} in ${o.game} on your site (${o.rank}). My total: ${o.pts} points${o.code ? `, code ${o.code}` : ""}.`,
    },
    ar: {
      arcade: "ركن مازن للألعاب", sub: "العب. اجمع نقاط. اكسب خصم.", wallet: "نقاطك", next: (n, o) => `${n} نقطة كمان → خصم ${o}%`, maxed: "وصلت لأعلى مستوى!", codeLabel: "كودك",
      claim: "استلم الخصم على واتساب", locked: (n) => `${n} نقطة كمان عشان يتفتح`, g1: "صيّاد اللوجوهات", g1d: "امسك اللوجوهات وتفادى القوالب", g2: "سباق التسليم", g2d: "اجري واقفز واسبق الديدلاين", best: "الأعلى", score: "النقاط",
      back: "‹ الألعاب", play: "العب", again: "العب تاني", over: "خلصت اللعبة", newbest: "رقم قياسي!", earned: (n) => `+${n} نقطة`, wa: "قول لمازن نتيجتك", rankLabel: "لقبك",
      ranks: ["متدرب", "مصمم مبتدئ", "مصمم", "آرت دايركتور", "مدير إبداعي"], tiersTitle: "مستويات الخصم", note: "الخصم بيتأكد من مازن على واتساب",
      c_sub: "امسك لوجوهات كوستا وتفادى القوالب الجاهزة.", c_how: "حرّك بالماوس أو صباعك أو الأسهم", c_leg: ["+1 لوجو", "+5 نجمة AI", "تخسر روح"], tpl: "قالب", combo: "كومبو", starMsg: "نجمة الـ AI: القوالب اتمسحت!",
      a_sub: "كمّل جري. الديدلاين مش هيستنّى.", a_how: "اضغط أو Space للقفز. اضغط تاني في الهوا لقفزة مزدوجة. امسك أكتر لقفزة أعلى.", a_leg: ["+2 لكل لوجو", "اقفز فوق الصناديق", "نجمة AI: درع"], obs: ["تعديل", "قالب", "مستعجل", "ديدلاين"], m: "م", dist: "المسافة", short: (n) => `باقي ${n} متر وتكسر رقمك!`, tierUp: (o) => `اتفتح خصم ${o}%!`, shield: "درع AI", clean: "نضيف", newDist: "أبعد مسافة ليك!", tapHint: "اضغط عشان تقفز",
      msg: (o) => `أهلًا مازن! جمعت ${o.pts} نقطة وأنا بلعب على موقعك وفتحت خصم ${o.off}%. الكود: ${o.code}`, msgScore: (o) => `أهلًا مازن! جبت ${o.score} في ${o.game} على موقعك (${o.rank}). مجموع نقاطي: ${o.pts}${o.code ? `، الكود ${o.code}` : ""}.`,
    },
  };
  const T = () => TXT[lang()];
  const RANK_AT = [0, 8, 20, 40, 70];
  const rankOf = (s) => { let i = 0; RANK_AT.forEach((v, k) => { if (s >= v) i = k; }); return i; };

  const W = 480, H = 720, FLOOR = H - 28, RED = "#E21B1B", INK = "#111", YEL = "#FFE14D";
  let ui, cv, ctx, raf = 0, last = 0, running = false, state = "hub", game = 0;
  const imgs = {}; let audio = null; const keys = {};

  // ---------- wallet ----------
  const wallet = { pts: 0, b1: 0, b2: 0, plays: 0 };
  try { Object.assign(wallet, JSON.parse(localStorage.getItem("mc-wallet") || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem("mc-wallet", JSON.stringify(wallet)); } catch (e) {} };
  const tierOf = (pts) => { let t = null; TIERS.forEach((x) => { if (pts >= x.pts) t = x; }); return t; };
  const nextTier = (pts) => TIERS.find((x) => pts < x.pts) || null;
  const codeFor = (pts, off) => `MC${off}-${pts}-${(((pts * 37 + off * 101) % 9973)).toString(36).toUpperCase().padStart(3, "0")}`;
  const curCode = () => { const t = tierOf(wallet.pts); return t ? codeFor(wallet.pts, t.off) : ""; };
  const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  function beep(f, d = 0.07, type = "square", v = 0.04) {
    try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); const o = audio.createOscillator(), g = audio.createGain(); o.type = type; o.frequency.value = f; g.gain.value = v; o.connect(g); g.connect(audio.destination); const n = audio.currentTime; g.gain.exponentialRampToValueAtTime(0.0001, n + d); o.start(n); o.stop(n + d); } catch (e) {}
  }
  function load() { const list = { logo: "assets/logo-red.png", p: "assets/char/a_over1.webp", p2: "assets/char/a_over1_f.webp" }; Object.entries(list).forEach(([k, src]) => { if (!imgs[k]) { const i = new Image(); i.src = src; imgs[k] = i; } }); }

  // ---------- drawing helpers ----------
  const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); };
  function txt(s, x, y, size, color, align = "center", weight = 900, font) { ctx.font = `${weight} ${size}px ${font || (lang() === "ar" || size < 28 ? "Cairo" : "'Bebas Neue', Cairo")}`; ctx.textAlign = align; ctx.fillStyle = color; ctx.fillText(s, x, y); }
  function hard(x, y, w, h, fill, r = 16, off = 5) { ctx.fillStyle = INK; rr(x + off, y + off, w, h, r); ctx.fill(); ctx.fillStyle = fill; rr(x, y, w, h, r); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  function star4(cx, cy, r, fill) { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = (Math.PI / 4) * i - Math.PI / 2, rad = i % 2 ? r * 0.36 : r; ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke(); }
  function bg(floor) {
    ctx.fillStyle = RED; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "rgba(255,255,255,.16)";
    for (let y = 8; y < H; y += 22) for (let x = ((y / 22) % 2) * 11 + 4; x < W; x += 22) { const k = 1 - y / H; ctx.beginPath(); ctx.arc(x, y, 1.8 * (0.35 + k), 0, 7); ctx.fill(); }
    ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(W * 0.62, 0); ctx.bezierCurveTo(W * 0.66, 30, W * 0.78, 46, W * 0.9, 40); ctx.bezierCurveTo(W * 0.96, 38, W * 0.99, 62, W, 70); ctx.lineTo(W, 0); ctx.closePath(); ctx.fill();
    if (floor) { ctx.fillStyle = INK; ctx.fillRect(0, FLOOR, W, H - FLOOR); ctx.fillStyle = "#fff"; ctx.fillRect(0, FLOOR, W, 4); }
  }
  const inRect = (x, y, rx, ry, rw, rh) => x > rx && x < rx + rw && y > ry && y < ry + rh;

  // ---------- shared fx ----------
  let parts = [], pops = [], shake = 0, flash = 0, t = 0, tierBanner = 0, tierBannerText = "", tierAnn = -1, overAt = 0;
  const burst = (x, y, color, n = 10) => { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 80 + Math.random() * 180; parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, life: 0.6, r: 3 + Math.random() * 5, color }); } };
  const pop = (text, x, y, color) => pops.push({ text, x, y, life: 0.9, color });
  function fxUpdate(dt) { parts.forEach((p) => { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt; }); parts = parts.filter((p) => p.life > 0); pops.forEach((p) => { p.life -= dt; p.y -= 50 * dt; }); pops = pops.filter((p) => p.life > 0); shake = Math.max(0, shake - dt); flash = Math.max(0, flash - dt); tierBanner = Math.max(0, tierBanner - dt); }
  function tierWatch(score) {
    const proj = wallet.pts + Math.min(RUN_CAP, score), idx = TIERS.filter((x) => proj >= x.pts).length - 1;
    if (idx > tierAnn) { tierAnn = idx; tierBanner = 2.6; tierBannerText = T().tierUp(TIERS[idx].off); flash = 0.25; beep(660, 0.1, "triangle", 0.06); setTimeout(() => beep(880, 0.12, "triangle", 0.06), 110); setTimeout(() => beep(1180, 0.22, "triangle", 0.06), 240); }
  }
  function tierBar(score, y, big) {
    const proj = wallet.pts + Math.min(RUN_CAP, score), nt = nextTier(proj), cur = tierOf(proj), prev = cur ? cur.pts : 0, tgt = nt ? nt.pts : (cur ? cur.pts : 1), k = nt ? (proj - prev) / (tgt - prev) : 1, bx = 40, bw = W - 80, bh = big ? 16 : 8;
    ctx.fillStyle = "rgba(255,255,255,.25)"; rr(bx, y, bw, bh, bh / 2); ctx.fill(); ctx.fillStyle = YEL; rr(bx, y, Math.max(bh, bw * Math.min(1, k)), bh, bh / 2); ctx.fill();
    if (big) txt(nt ? T().next(nt.pts - proj, nt.off) : T().maxed, W / 2, y - 9, 14, "#fff", "center", 800);
  }
  function fxDraw() {
    parts.forEach((p) => { ctx.globalAlpha = Math.max(0, p.life / 0.6); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
    pops.forEach((p) => { ctx.globalAlpha = Math.min(1, p.life * 1.6); txt(p.text, p.x, p.y, p.text.length > 6 ? 20 : 30, p.color, "center", 900, "'Bebas Neue',Cairo"); ctx.globalAlpha = 1; });
    if (tierBanner > 0) { ctx.globalAlpha = Math.min(1, tierBanner * 2); hard(30, 150, W - 60, 64, YEL, 20, 6); txt(tierBannerText, W / 2, 192, lang() === "ar" ? 28 : 34, INK); ctx.globalAlpha = 1; }
  }

  // ---------- run result ----------
  let res = { score: 0, gained: 0, newBest: false };
  function finish(score, extra) {
    const gained = Math.min(RUN_CAP, Math.round(score)), key = game === 1 ? "b1" : "b2", dist = (extra && extra.dist) || 0, prevBest = wallet.d2 || 0;
    res = { score, gained, newBest: false, dist, prevBest };
    if (score > wallet[key]) { wallet[key] = score; res.newBest = true; }
    if (game === 2 && dist > prevBest) wallet.d2 = dist;
    wallet.pts += gained; wallet.plays++; save(); state = "over"; overAt = performance.now(); beep(200, 0.3, "triangle", 0.06);
  }

  // =================== GAME 1: LOGO CATCHER ===================
  const g1 = { px: W / 2, tx: W / 2, score: 0, lives: 3, combo: 1, streak: 0, spawn: 0, items: [], starMsg: 0 };
  function g1reset() { Object.assign(g1, { px: W / 2, tx: W / 2, score: 0, lives: 3, combo: 1, streak: 0, spawn: 0.6, items: [], starMsg: 0 }); parts = []; pops = []; shake = flash = 0; t = 0; tierBanner = 0; tierAnn = TIERS.filter((x) => wallet.pts >= x.pts).length - 1; }
  const lvl1 = () => Math.min(1, t / 70);
  function g1hit() { const p = imgs.p, ph = 160, pw = p && p.naturalWidth ? ph * p.naturalWidth / p.naturalHeight : 140; return { x: g1.px - pw * 0.4, y: FLOOR - ph + 20, w: pw * 0.8, h: ph * 0.45, pw, ph }; }
  function g1update(dt) {
    t += dt; const L = lvl1(); tierWatch(g1.score);
    if (keys.ArrowLeft || keys.a || keys.A) g1.tx -= 520 * dt; if (keys.ArrowRight || keys.d || keys.D) g1.tx += 520 * dt;
    g1.tx = Math.max(50, Math.min(W - 50, g1.tx)); g1.px += (g1.tx - g1.px) * Math.min(1, dt * 16);
    g1.spawn -= dt;
    if (g1.spawn <= 0) {
      const r = Math.random(); let kind = "logo"; if (r < 0.05 + L * 0.02) kind = "star"; else if (r < 0.2 + L * 0.2) kind = "tpl";
      const size = kind === "tpl" ? 74 : kind === "star" ? 52 : 58;
      g1.items.push({ kind, x: 40 + Math.random() * (W - 80), y: -size, vy: 170 + L * 250 + Math.random() * 40, size, rot: (Math.random() - 0.5) * 0.6, vr: (Math.random() - 0.5) * 2, wob: Math.random() * 6 });
      g1.spawn = Math.max(0.36, 0.95 - L * 0.6) * (0.8 + Math.random() * 0.4);
    }
    const hb = g1hit();
    for (let i = g1.items.length - 1; i >= 0; i--) {
      const it = g1.items[i]; it.y += it.vy * dt; it.rot += it.vr * dt; it.wob += dt * 4; it.x += Math.sin(it.wob) * 14 * dt; const r = it.size / 2;
      if (it.x + r > hb.x && it.x - r < hb.x + hb.w && it.y + r > hb.y && it.y - r < hb.y + hb.h) {
        g1.items.splice(i, 1);
        if (it.kind === "logo") { g1.streak++; g1.combo = g1.streak >= 5 ? 1 + Math.min(4, Math.floor(g1.streak / 5)) : 1; g1.score += g1.combo; pop("+" + g1.combo, it.x, it.y, "#fff"); burst(it.x, it.y, "#fff", 8); beep(520 + Math.min(g1.streak, 20) * 24, 0.07); }
        else if (it.kind === "star") { g1.score += 5; g1.streak++; pop("+5", it.x, it.y - 10, YEL); burst(it.x, it.y, YEL, 18); g1.items = g1.items.filter((o) => o.kind !== "tpl" || (burst(o.x, o.y, "#999", 8), false)); g1.starMsg = 1.8; flash = 0.25; beep(880, 0.16, "triangle", 0.06); }
        else { g1.lives--; g1.streak = 0; g1.combo = 1; shake = 0.35; flash = 0.2; burst(it.x, it.y, "#222", 14); beep(120, 0.22, "sawtooth", 0.06); if (g1.lives <= 0) return finish(g1.score); }
      } else if (it.y - r > H) { g1.items.splice(i, 1); if (it.kind === "logo") { g1.streak = 0; g1.combo = 1; } }
    }
    fxUpdate(dt); g1.starMsg = Math.max(0, g1.starMsg - dt);
  }
  function g1item(it) {
    ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
    if (it.kind === "logo") { const im = imgs.logo; ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.arc(4, 6, it.size * 0.5, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, it.size * 0.58, 0, 7); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); if (im && im.naturalWidth) ctx.drawImage(im, -it.size * 0.38, -it.size * 0.4, it.size * 0.76, it.size * 0.79); }
    else if (it.kind === "star") { star4(0, 0, it.size * 0.62, YEL); txt("AI", 0, 7, 20, INK, "center", 900, "'Bebas Neue',Cairo"); }
    else { hard(-it.size / 2, -it.size * 0.3, it.size, it.size * 0.6, "#D9D6D0", 8, 4); ctx.strokeStyle = "#8b877f"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); rr(-it.size / 2 + 6, -it.size * 0.3 + 6, it.size - 12, it.size * 0.6 - 12, 4); ctx.stroke(); ctx.setLineDash([]); txt(T().tpl, 0, 6, 17, "#55524c"); }
    ctx.restore();
  }
  function g1draw() {
    bg(true); g1.items.forEach(g1item);
    const hb = g1hit(), p = imgs.p;
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(g1.px, FLOOR + 2, hb.pw * 0.34, 8, 0, 0, 7); ctx.fill();
    if (p && p.naturalWidth) { ctx.save(); ctx.translate(g1.px, FLOOR); ctx.rotate((g1.tx - g1.px) / 400); ctx.drawImage(p, -hb.pw / 2, -hb.ph, hb.pw, hb.ph); ctx.restore(); }
    fxDraw();
    if (state === "play") {
      const s = T(); hud(g1.score, Math.max(wallet.b1, g1.score), g1.lives); tierBar(g1.score, FLOOR + 10, false);
      if (g1.combo > 1) { hard(W / 2 - 52, 70, 104, 30, INK, 15, 3); txt(`${s.combo} x${g1.combo}`, W / 2, 92, 18, "#fff", "center", 900, "'Bebas Neue',Cairo"); }
      if (g1.starMsg > 0) { ctx.globalAlpha = Math.min(1, g1.starMsg); txt(s.starMsg, W / 2, 130, 20, YEL); ctx.globalAlpha = 1; }
    }
  }
  function hud(score, best, lives) {
    const s = T();
    hard(12, 14, 130, 46, "#fff", 14, 4); txt(s.score, 77, 32, 14, RED); txt(String(score), 77, 54, 28, INK, "center", 900, "'Bebas Neue',Cairo");
    hard(W - 190, 14, 130, 46, "#fff", 14, 4); txt(s.best, W - 125, 32, 14, RED); txt(String(best), W - 125, 54, 28, INK, "center", 900, "'Bebas Neue',Cairo");
    for (let i = 0; i < 3; i++) { const x = W / 2 - 34 + i * 34; if (i < lives) star4(x, 38, 14, "#fff"); else { ctx.globalAlpha = 0.3; star4(x, 38, 14, "#000"); ctx.globalAlpha = 1; } }
  }

  // =================== GAME 2: DEADLINE DASH (endless runner) ===================
  const GY = 560, PX = 120, GRAV = 2700, JV = 900, JV2 = 820, M = 40;   // ground y, player x, gravity, jump speeds, px per metre
  const g2 = {};
  const spdAt = (tt) => 340 + Math.min(330, tt * 5.4);
  function g2reset() {
    Object.assign(g2, { dist: 0, tt: 0, logos: 0, bonus: 0, score: 0, py: 0, vy: 0, jumps: 0, holding: false, obs: [], coins: [], star: null, nextObs: 560, nextStar: 5200, shield: 0, magnet: 0, cleared: 0, dead: 0, spin: 0, squash: 0, dust: 0, mile: 0, mileT: 0, mileText: "", ghost: false });
    parts = []; pops = []; shake = 0; flash = 0; tierBanner = 0; tierAnn = TIERS.filter((x) => wallet.pts >= x.pts).length - 1;
  }
  g2reset();

  function g2jump() {
    if (state !== "play" || g2.dead) return;
    if (g2.py <= 0.5) {
      g2.vy = JV; g2.jumps = 1; g2.holding = true; g2.squash = -0.18; beep(420, 0.07, "triangle", 0.05);
      for (let i = 0; i < 5; i++) parts.push({ x: PX - 10 + Math.random() * 20, y: GY, vx: -60 - Math.random() * 90, vy: -30 - Math.random() * 50, life: 0.4, r: 3 + Math.random() * 3, color: "rgba(255,255,255,.75)" });
    } else if (g2.jumps < 2) { g2.vy = JV2; g2.jumps = 2; g2.holding = true; g2.squash = -0.2; beep(640, 0.08, "triangle", 0.05); burst(PX, GY - g2.py - 10, "#fff", 8); }
  }
  function g2release() { g2.holding = false; }

  function addCoins(x0, x1, base, arc, n) { for (let i = 0; i < n; i++) { const k = n === 1 ? 0.5 : i / (n - 1); g2.coins.push({ wx: x0 + (x1 - x0) * k, py: base + Math.sin(k * Math.PI) * arc, got: false }); } }
  function g2spawn() {
    const L = Math.min(1, g2.tt / 60), labs = T().obs, lab = () => labs[Math.floor(Math.random() * 3)];
    while (g2.nextObs < g2.dist + W + 160) {
      const x = g2.nextObs, r = Math.random(), sp = spdAt(g2.tt); let width = 70;
      if (g2.tt > 9 && r < 0.2) { g2.obs.push({ kind: "fly", wx: x, w: 78, h: 50, b: 104, label: labs[3], passed: false }); addCoins(x - 10, x + 88, 22, 0, 4); width = 90; }
      else if (g2.tt > 15 && r < 0.3 + L * 0.2) { const h = 52 + Math.random() * 12; g2.obs.push({ kind: "box", wx: x, w: 54, h, label: lab(), passed: false }, { kind: "box", wx: x + 150, w: 54, h, label: lab(), passed: false }); addCoins(x - 6, x + 216, h + 50, 55, 6); width = 210; }
      else { const w = 54 + Math.random() * 26, h = 50 + Math.random() * 30; g2.obs.push({ kind: "box", wx: x, w, h, label: lab(), passed: false }); addCoins(x - 8, x + w + 8, h + 46, 50, 4); width = w; }
      g2.nextObs = x + width + sp * (0.86 - L * 0.12) + 80 + Math.random() * 240 * (1 - L * 0.5);
      if (Math.random() < 0.45) { const gx = g2.nextObs - 200; addCoins(gx, gx + 110, 22, 0, 4); }
    }
    while (g2.nextStar < g2.dist + W + 100) { g2.star = { wx: g2.nextStar, py: 150 + Math.random() * 40 }; g2.nextStar += 6500 + Math.random() * 3500; }
  }
  function g2die() {
    g2.dead = 0.001; g2.vy = 780; g2.spin = 0; shake = 0.5; flash = 0.25; burst(PX, GY - g2.py - 40, "#fff", 14); burst(PX, GY - g2.py - 40, "#222", 10); beep(110, 0.32, "sawtooth", 0.07);
  }
  function g2dead(dt) {
    g2.dead += dt; t += dt; g2.vy -= GRAV * dt; g2.py = Math.max(0, g2.py + g2.vy * dt); if (g2.py === 0 && g2.vy < 0) g2.vy = 0; g2.spin += dt * 9; fxUpdate(dt);
    if (g2.dead > 0.95) finish(g2.score, { dist: Math.floor(g2.dist / M) });
  }
  function g2update(dt) {
    if (g2.dead) return g2dead(dt);
    g2.tt += dt; t += dt; const sp = spdAt(g2.tt); g2.dist += sp * dt; g2spawn();
    const gf = g2.holding && g2.vy > 0 ? 0.6 : 1;
    g2.vy -= GRAV * gf * dt; g2.py += g2.vy * dt;
    if (g2.py <= 0) { if (g2.py < -1 && g2.vy < -300) { g2.squash = 0.22; beep(170, 0.04, "sine", 0.05); for (let i = 0; i < 6; i++) parts.push({ x: PX - 14 + Math.random() * 28, y: GY, vx: (Math.random() - 0.5) * 160, vy: -40 - Math.random() * 60, life: 0.4, r: 3 + Math.random() * 3, color: "rgba(255,255,255,.75)" }); } g2.py = 0; g2.vy = 0; g2.jumps = 0; }
    g2.squash *= Math.pow(0.0008, dt);
    g2.dust -= dt; if (g2.py === 0 && g2.dust <= 0) { g2.dust = 0.08; parts.push({ x: PX - 18, y: GY, vx: -110 - Math.random() * 60, vy: -30 - Math.random() * 50, life: 0.35, r: 2 + Math.random() * 3, color: "rgba(255,255,255,.6)" }); }
    // collisions
    const pt = g2.py + 6, pb = g2.py + 82, px0 = PX - 22, px1 = PX + 22;
    for (let i = g2.obs.length - 1; i >= 0; i--) {
      const o = g2.obs[i], sx = PX + (o.wx - g2.dist);
      if (sx < -160) { g2.obs.splice(i, 1); continue; } if (sx > W + 60) continue;
      const ob = o.kind === "fly" ? o.b : 0, ot = ob + o.h;
      if (px1 > sx + 6 && px0 < sx + o.w - 6 && pb > ob + 4 && pt < ot - 4) {
        if (g2.shield) { g2.shield = 0; g2.obs.splice(i, 1); shake = 0.25; flash = 0.2; burst(sx + o.w / 2, GY - ob - o.h / 2, YEL, 16); pop(T().shield + "!", PX + 40, GY - 130, YEL); beep(300, 0.14, "triangle", 0.06); }
        else { g2die(); return; }
      } else if (!o.passed && sx + o.w < PX - 30) {
        o.passed = true; g2.cleared++;
        if (g2.cleared % 5 === 0) { g2.bonus += 5; pop(`${T().clean} x${g2.cleared}  +5`, PX + 90, GY - 160, "#fff"); beep(760, 0.1, "triangle", 0.05); }
      }
    }
    // coins, star
    g2.magnet = Math.max(0, g2.magnet - dt);
    for (let i = g2.coins.length - 1; i >= 0; i--) {
      const c = g2.coins[i], sx = PX + (c.wx - g2.dist);
      if (sx < -60) { g2.coins.splice(i, 1); continue; } if (sx > W + 60) continue;
      if (g2.magnet > 0) { const dx = g2.dist - c.wx, dy = g2.py + 40 - c.py, d = Math.hypot(dx, dy); if (d < 250) { c.wx += dx * 7 * dt; c.py += dy * 7 * dt; } }
      if (Math.hypot(PX - sx, g2.py + 40 - c.py) < 36) { g2.coins.splice(i, 1); g2.logos++; pop("+2", sx, GY - c.py - 30, "#fff"); beep(700 + Math.min(g2.logos, 24) * 18, 0.05, "square", 0.035); }
    }
    if (g2.star) { const sx = PX + (g2.star.wx - g2.dist); if (sx < -80) g2.star = null; else if (Math.hypot(PX - sx, g2.py + 40 - g2.star.py) < 52) { g2.star = null; g2.shield = 1; g2.magnet = 6; flash = 0.25; burst(PX, GY - g2.py - 50, YEL, 22); pop(T().shield, PX + 30, GY - 150, YEL); beep(900, 0.18, "triangle", 0.06); } }
    // score, milestones, ghost of your best distance
    g2.score = Math.floor(g2.dist / 250) + g2.logos * 2 + g2.bonus; tierWatch(g2.score);
    const m = Math.floor(g2.dist / M); if (m >= (g2.mile + 1) * 100) { g2.mile++; g2.mileT = 1.7; g2.mileText = `${g2.mile * 100} ${T().m}`; beep(520, 0.09, "triangle", 0.05); setTimeout(() => beep(780, 0.12, "triangle", 0.05), 90); }
    g2.mileT = Math.max(0, g2.mileT - dt);
    const bw = (wallet.d2 || 0) * M; if (!g2.ghost && bw > 0 && g2.dist > bw) { g2.ghost = true; g2.mileT = 1.7; g2.mileText = T().newDist; flash = 0.2; beep(980, 0.2, "triangle", 0.06); }
    fxUpdate(dt);
  }

  // ---- background
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const mkLayer = (seed, minH, maxH, minW, maxW) => { const b = []; let x = 0, i = 0; while (x < 1000) { const w = minW + hash(seed + i) * (maxW - minW), h = minH + hash(seed + i + 50) * (maxH - minH); b.push({ x, w, h }); x += w + 4 + hash(seed + i + 90) * 12; i++; } b.period = x; return b; };
  const LAY1 = mkLayer(3, 90, 240, 40, 90), LAY2 = mkLayer(11, 60, 190, 46, 100);
  function skyline(L, scroll, color, win) {
    ctx.fillStyle = color; const off = -(scroll % L.period);
    for (let rep = 0; rep < 3; rep++) for (const b of L) {
      const bx = off + rep * L.period + b.x; if (bx > W || bx + b.w < 0) continue;
      ctx.fillStyle = color; ctx.fillRect(bx, GY - b.h, b.w, b.h);
      if (win) { ctx.fillStyle = "rgba(255,255,255,.13)"; for (let yy = GY - b.h + 12; yy < GY - 14; yy += 17) for (let xx = bx + 7; xx < bx + b.w - 9; xx += 13) if (hash(b.x * 7 + xx * 3 + yy) > 0.55) ctx.fillRect(xx, yy, 5, 8); }
    }
  }
  function g2item(o, sx) {
    if (o.kind === "fly") {
      const y = GY - o.b - o.h; hard(sx, y, o.w, o.h, INK, 14, 4);
      ctx.strokeStyle = YEL; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(sx + 18, y + o.h / 2, 11, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sx + 18, y + o.h / 2 - 7); ctx.lineTo(sx + 18, y + o.h / 2); ctx.lineTo(sx + 24, y + o.h / 2 + 3); ctx.stroke();
      txt(o.label, sx + 50, y + o.h / 2 + 5, o.label.length > 6 ? 11 : 13, YEL, "center", 900);
    } else {
      const y = GY - o.h; hard(sx, y, o.w, o.h, "#D9D6D0", 9, 4);
      ctx.strokeStyle = "#8b877f"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); rr(sx + 6, y + 6, o.w - 12, o.h - 12, 4); ctx.stroke(); ctx.setLineDash([]);
      txt(o.label, sx + o.w / 2, y + o.h / 2 + 5, o.label.length > 6 ? 11 : 13, "#55524c", "center", 900);
    }
  }
  function g2draw() {
    bg(false); const d = g2.dist, s = T();
    skyline(LAY1, d * 0.12, "rgba(110,8,8,.55)", false); skyline(LAY2, d * 0.3, "rgba(17,17,17,.9)", true);
    // ground
    ctx.fillStyle = INK; ctx.fillRect(0, GY, W, H - GY); ctx.fillStyle = "#fff"; ctx.fillRect(0, GY, W, 4);
    ctx.fillStyle = "rgba(255,255,255,.22)"; for (let x = -(d % 70); x < W; x += 70) ctx.fillRect(x, GY + 34, 34, 4); for (let x = -((d * 1.6) % 110); x < W; x += 110) ctx.fillRect(x, GY + 74, 56, 4);
    // speed lines
    const sp = spdAt(g2.tt); if (state === "play" && sp > 430) { ctx.fillStyle = "rgba(255,255,255,.22)"; for (let i = 0; i < 6; i++) { const y = 120 + i * 58 + hash(i) * 20, x = W - ((d * 1.8 + i * 173) % (W + 120)); ctx.fillRect(x, y, 70 + (sp - 430) * 0.25, 3); } }
    // ghost of best distance
    const bw = (wallet.d2 || 0) * M; if (bw > 0) { const gx = PX + (bw - d); if (gx > -20 && gx < W + 20) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.setLineDash([9, 7]); ctx.beginPath(); ctx.moveTo(gx, 130); ctx.lineTo(gx, GY); ctx.stroke(); ctx.setLineDash([]); hard(gx - 4, 118, 78, 26, YEL, 8, 3); txt(`${s.best} ${wallet.d2}${s.m}`, gx + 35, 136, 12, INK); } }
    // world
    g2.obs.forEach((o) => { const sx = PX + (o.wx - d); if (sx > -100 && sx < W + 20) g2item(o, sx); });
    g2.coins.forEach((c) => { const sx = PX + (c.wx - d); if (sx < -30 || sx > W + 30) return; const y = GY - c.py - Math.sin(t * 6 + c.wx) * 3; ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.arc(sx + 2, y + 3, 15, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(sx, y, 16, 0, 7); ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke(); const im = imgs.logo; if (im && im.naturalWidth) ctx.drawImage(im, sx - 10, y - 10.5, 20, 21); });
    if (g2.star) { const sx = PX + (g2.star.wx - d), y = GY - g2.star.py + Math.sin(t * 5) * 6; ctx.save(); ctx.translate(sx, y); ctx.rotate(t * 1.5); star4(0, 0, 30, YEL); ctx.rotate(-t * 1.5); txt("AI", 0, 7, 18, INK, "center", 900, "'Bebas Neue',Cairo"); ctx.restore(); }
    // player
    const p = imgs.p, ph = 100, pw = p && p.naturalWidth ? ph * p.naturalWidth / p.naturalHeight : 90, run = g2.py === 0 && !g2.dead && state === "play";
    ctx.fillStyle = "rgba(0,0,0,.35)"; const sr = pw * 0.32 * (1 - Math.min(0.55, g2.py / 320)); ctx.beginPath(); ctx.ellipse(PX, GY + 3, sr, 6, 0, 0, 7); ctx.fill();
    if (p && p.naturalWidth) {
      ctx.save(); ctx.translate(PX, GY - g2.py);
      if (g2.dead) { ctx.translate(0, -ph / 2); ctx.rotate(g2.spin); ctx.translate(0, ph / 2); }
      else ctx.rotate(-Math.max(-0.3, Math.min(0.3, g2.vy / 2800)) + (run ? Math.sin(g2.tt * 22) * 0.05 : 0));
      ctx.scale(1 + g2.squash, 1 - g2.squash);
      ctx.drawImage(p, -pw / 2, -ph + (run ? -Math.abs(Math.sin(g2.tt * 14)) * 7 : 0), pw, ph); ctx.restore();
    }
    if (g2.shield) { ctx.save(); ctx.translate(PX, GY - g2.py - 48); ctx.rotate(t * 2); ctx.strokeStyle = YEL; ctx.lineWidth = 4; ctx.setLineDash([14, 9]); ctx.beginPath(); ctx.arc(0, 0, 64, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = "rgba(255,225,77,.16)"; ctx.fill(); ctx.restore(); }
    fxDraw();
    if (state === "play") {
      hud2();
      if (g2.mileT > 0) { ctx.globalAlpha = Math.min(1, g2.mileT * 2); txt(g2.mileText, W / 2, 262, lang() === "ar" ? 48 : 70, "#fff", "center", 900, "'Bebas Neue',Cairo"); ctx.globalAlpha = 1; }
      tierBar(g2.score, GY + 96, true);
      if (g2.tt < 4) { ctx.globalAlpha = Math.min(1, (4 - g2.tt)); txt(s.tapHint, W / 2, 330, 20, "#fff", "center", 900); ctx.globalAlpha = 1; }
    }
  }
  function hud2() {
    const s = T(), m = Math.floor(g2.dist / M);
    hard(12, 14, 130, 46, "#fff", 14, 4); txt(s.score, 77, 32, 14, RED); txt(String(g2.score), 77, 54, 28, INK, "center", 900, "'Bebas Neue',Cairo");
    hard(W - 190, 14, 130, 46, "#fff", 14, 4); txt(s.dist, W - 125, 32, 14, RED); txt(`${m} ${s.m}`, W - 125, 54, 28, INK, "center", 900, "'Bebas Neue',Cairo");
    if (g2.shield) { hard(W / 2 - 62, 20, 124, 30, YEL, 15, 3); txt(s.shield, W / 2, 41, 15, INK); }
  }

  // =================== SCREENS ===================
  function card(y, h, fn) { hard(40, y, W - 80, h, "#fff", 26, 8); fn(); }
  function hub() {
    const s = T(), pts = wallet.pts, tier = tierOf(pts), nt = nextTier(pts);
    txt(s.arcade, W / 2, 96, lang() === "ar" ? 44 : 60, "#fff"); txt(s.sub, W / 2, 128, 17, "#FFE9E7", "center", 800);
    hard(40, 150, W - 80, 172, "#fff", 22, 7);
    txt(s.wallet, W / 2, 182, 15, RED);
    txt(String(pts), W / 2, 252, 72, INK, "center", 900, "'Bebas Neue',Cairo");
    const bx = 64, bw = W - 128, prev = tier ? tier.pts : 0, tgt = nt ? nt.pts : (tier ? tier.pts : 1), k = nt ? Math.max(0, (pts - prev) / (tgt - prev)) : 1;
    ctx.fillStyle = "#eee"; rr(bx, 268, bw, 16, 8); ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke();
    if (k > 0) { ctx.fillStyle = RED; rr(bx + 2, 270, Math.max(14, (bw - 4) * k), 12, 6); ctx.fill(); }
    txt(nt ? s.next(nt.pts - pts, nt.off) : s.maxed, W / 2, 308, 15, INK, "center", 800);
    // game cards
    [[s.g1, s.g1d, wallet.b1, 340, 1], [s.g2, s.g2d, wallet.b2, 434, 2]].forEach(([n, d, b, y]) => {
      hard(40, y, W - 80, 84, "#fff", 20, 6); txt(n, W / 2, y + 34, lang() === "ar" ? 28 : 34, RED); txt(d, W / 2, y + 58, 14, INK, "center", 700); if (b) txt(`${s.best}: ${b}`, W / 2, y + 74, 12, RED, "center", 900);
      
    });
    // claim
    const canClaim = !!tier;
    hard(40, 534, W - 80, 52, canClaim ? "#25D366" : "#cfcac2", 26, 5);
    txt(canClaim ? `${s.claim} · ${tier.off}%` : s.locked(TIERS[0].pts - pts), W / 2, 568, lang() === "ar" ? 20 : 22, canClaim ? "#fff" : "#77716A");
    if (canClaim) txt(`${s.codeLabel}: ${curCode()}`, W / 2, 610, 15, "#fff", "center", 900);
    else txt(TIERS.map((x) => `${x.pts}=${x.off}%`).join("   "), W / 2, 610, 14, "#FFE9E7", "center", 800);
    txt(s.note, W / 2, 640, 12, "rgba(255,255,255,.75)", "center", 700);
  }
  function gameMenu() {
    const s = T(), one = game === 1;
    backPill();
    card(150, 430, () => {
      txt(one ? s.g1 : s.g2, W / 2, 232, lang() === "ar" ? 44 : 62, RED);
      txt(one ? s.c_sub : s.a_sub, W / 2, 274, 19, INK, "center", 800);
      const how = one ? s.c_how : s.a_how; wrap(how, W / 2, 306, W - 140, 20, 15, "#77716A");
      const xs = [W / 2 - 130, W / 2, W / 2 + 130], L = one ? s.c_leg : s.a_leg;
      if (one) { const im = imgs.logo; if (im && im.naturalWidth) ctx.drawImage(im, xs[0] - 22, 372, 44, 46); star4(xs[1], 394, 22, YEL); hard(xs[2] - 26, 378, 52, 32, "#D9D6D0", 7, 3); }
      else { const im = imgs.logo; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(xs[0], 394, 22, 0, 7); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); if (im && im.naturalWidth) ctx.drawImage(im, xs[0] - 14, 380, 28, 29); hard(xs[1] - 26, 376, 52, 36, "#D9D6D0", 8, 3); txt(s.obs[0], xs[1], 399, 11, "#55524c"); star4(xs[2], 394, 22, YEL); txt("AI", xs[2], 401, 15, INK, "center", 900, "'Bebas Neue',Cairo"); }
      L.forEach((x, i) => wrap(x, xs[i], 444, 110, 17, 13, INK));
      hard(W / 2 - 90, 488, 180, 56, RED, 28, 5); txt(s.play, W / 2, 526, lang() === "ar" ? 28 : 38, "#fff");
      const b = one ? wallet.b1 : wallet.b2; if (b) txt(`${s.best}: ${b}`, W / 2, 568, 15, INK, "center", 900);
    });
  }
  function wrap(text, x, y, maxW, lh, size, color) { ctx.font = `800 ${size}px Cairo`; const words = text.split(" "); let line = "", yy = y; ctx.textAlign = "center"; ctx.fillStyle = color; words.forEach((w) => { const test = line ? line + " " + w : w; if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = w; yy += lh; } else line = test; }); ctx.fillText(line, x, yy); }
  function backPill() { hard(14, 78, 92, 30, "#fff", 15, 3); txt(T().back, 60, 99, 14, INK); }
  function over() {
    const s = T(), ri = rankOf(res.score), tier = tierOf(wallet.pts), nt = nextTier(wallet.pts), g = game === 2;
    card(130, 470, () => {
      txt(s.over, W / 2, 200, lang() === "ar" ? 40 : 54, INK);
      if (res.newBest) txt(s.newbest, W / 2, 228, 20, RED); else if (g) txt(`${s.rankLabel}: ${s.ranks[ri]}`, W / 2, 228, 15, "#77716A", "center", 800);
      txt(String(res.score), W / 2, 306, 90, RED, "center", 900, "'Bebas Neue',Cairo");
      hard(W / 2 - 80, 320, 160, 32, YEL, 16, 3); txt(s.earned(res.gained), W / 2, 343, 18, INK);
      if (g) {
        txt(`${res.dist} ${s.m}   ·   ${s.best}: ${Math.max(res.prevBest, res.dist)} ${s.m}`, W / 2, 380, 16, INK, "center", 900);
        txt(`${s.wallet}: ${wallet.pts}${tier ? "  ·  " + tier.off + "%" : ""}`, W / 2, 401, 14, "#77716A", "center", 800);
        if (res.prevBest > res.dist) txt(s.short(res.prevBest - res.dist), W / 2, 421, 14, RED, "center", 900);
        if (nt) txt(s.next(nt.pts - wallet.pts, nt.off), W / 2, 440, 14, RED, "center", 800);
      } else {
        txt(`${s.rankLabel}: ${s.ranks[ri]}`, W / 2, 384, 19, INK, "center", 900);
        txt(`${s.wallet}: ${wallet.pts}${tier ? "  ·  " + tier.off + "%" : ""}`, W / 2, 410, 15, "#77716A", "center", 800);
        if (nt) txt(s.next(nt.pts - wallet.pts, nt.off), W / 2, 432, 14, RED, "center", 800);
      }
      hard(W / 2 - 100, 452, 200, 48, RED, 24, 5); txt(s.again, W / 2, 485, lang() === "ar" ? 22 : 30, "#fff");
      hard(W / 2 - 132, 514, 264, 38, tier ? "#25D366" : INK, 19, 4); txt(tier ? `${s.claim} · ${tier.off}%` : s.wa, W / 2, 539, 15, "#fff");
      hard(W / 2 - 60, 562, 120, 26, "#fff", 13, 2); txt(s.back, W / 2, 581, 12, INK);
    });
  }

  // =================== INPUT ===================
  function startGame() { if (game === 1) g1reset(); else g2reset(); state = "play"; beep(660, 0.09, "triangle"); }
  function click(x, y) {
    const s = T();
    if (state === "hub") {
      if (inRect(x, y, 40, 340, W - 80, 80)) { game = 1; state = "menu"; }
      else if (inRect(x, y, 40, 434, W - 80, 80)) { game = 2; state = "menu"; }
      else if (inRect(x, y, 40, 534, W - 80, 52) && tierOf(wallet.pts)) { const tr = tierOf(wallet.pts); window.open(waLink(s.msg({ pts: wallet.pts, off: tr.off, code: curCode() })), "_blank", "noopener"); }
    } else if (state === "menu") {
      if (inRect(x, y, 14, 78, 92, 30)) state = "hub"; else if (inRect(x, y, W / 2 - 90, 488, 180, 56)) startGame();
    } else if (state === "over") {
      if (inRect(x, y, W / 2 - 100, 452, 200, 48)) { if (performance.now() - overAt > 450) startGame(); }
      else if (inRect(x, y, W / 2 - 132, 514, 264, 38)) { const tr = tierOf(wallet.pts); window.open(waLink(tr ? s.msg({ pts: wallet.pts, off: tr.off, code: curCode() }) : s.msgScore({ score: res.score, game: game === 1 ? s.g1 : `${s.g2} (${res.dist} ${s.m})`, rank: s.ranks[rankOf(res.score)], pts: wallet.pts, code: curCode() })), "_blank", "noopener"); }
      else if (inRect(x, y, W / 2 - 60, 562, 120, 26)) state = "hub";
    } else if (state === "play" && game === 2) g2jump();
  }
  function build() {
    if (ui) return;
    ui = document.createElement("div"); ui.className = "cg-overlay"; ui.setAttribute("role", "dialog"); ui.setAttribute("aria-label", "Mazen Arcade");
    ui.innerHTML = `<div class="cg-box"><button class="cg-x" type="button" aria-label="Close">✕</button><canvas class="cg-cv" width="${W * 2}" height="${H * 2}"></canvas></div>`;
    document.body.appendChild(ui);
    cv = ui.querySelector("canvas"); ctx = cv.getContext("2d"); ctx.scale(2, 2);
    ui.querySelector(".cg-x").addEventListener("click", close);
    ui.addEventListener("pointerdown", (e) => { if (e.target === ui) close(); });
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]; };
    cv.addEventListener("pointermove", (e) => { if (state === "play" && game === 1) g1.tx = pos(e)[0]; });
    cv.addEventListener("pointerdown", (e) => { const [x, y] = pos(e); if (state === "play" && game === 1) g1.tx = x; click(x, y); });
    cv.addEventListener("pointerup", () => g2release()); cv.addEventListener("pointercancel", () => g2release()); cv.addEventListener("pointerleave", () => g2release());
    cv.style.touchAction = "none";
  }
  function draw() {
    ctx.save(); if (shake > 0) ctx.translate((Math.random() - 0.5) * 36 * shake, (Math.random() - 0.5) * 24 * shake);
    if (state === "hub") { bg(false); hub(); }
    else if (state === "menu") { (game === 1 ? g1draw : g2draw)(); gameMenu(); }
    else { (game === 1 ? g1draw : g2draw)(); if (state === "over") { if (game === 1) hud(res.score, wallet.b1, 0); else hud2(); over(); } }
    if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash * 1.4})`; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
  }
  function loop(now) {
    if (!running) return; const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    if (state === "play") (game === 1 ? g1update : g2update)(dt); else { t += dt; if (state === "menu" && game === 2) g2.dist += 150 * dt; fxUpdate(dt); }
    draw(); raf = requestAnimationFrame(loop);
  }
  function open() { build(); load(); ui.classList.add("show"); document.body.classList.add("cg-lock"); state = "hub"; parts = []; pops = []; running = true; last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); const tip = document.getElementById("mcTip"); if (tip) tip.classList.remove("show"); }
  function close() { running = false; cancelAnimationFrame(raf); if (ui) ui.classList.remove("show"); document.body.classList.remove("cg-lock"); }
  addEventListener("keydown", (e) => {
    if (!ui || !ui.classList.contains("show")) return;
    if (e.key === "Escape") return close(); keys[e.key] = true;
    if (state === "play" && game === 2 && [" ", "ArrowUp", "w", "W"].includes(e.key) && !e.repeat) g2jump();
    if ((e.key === "Enter" || e.key === " ") && (state === "menu" || (state === "over" && performance.now() - overAt > 450))) { e.preventDefault(); startGame(); }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) e.preventDefault();
  });
  addEventListener("keyup", (e) => { keys[e.key] = false; if ([" ", "ArrowUp", "w", "W"].includes(e.key)) g2release(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && state === "play") state = "menu"; });
  document.querySelectorAll("[data-play-game]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); open(); }));
  window.MazenGame = { open, close, wallet, TIERS, codeFor, _dbg: () => ({ state, game, dist: g2.dist, py: g2.py, jumps: g2.jumps, score: g2.score, obs: g2.obs.map((o) => ({ sx: PX + o.wx - g2.dist, w: o.w, kind: o.kind })) }) };
})();
