(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- language (EN / AR), remembered ----
  const setLang = (l) => {
    root.lang = l; root.dir = l === "ar" ? "rtl" : "ltr";
    document.title = l === "ar" ? "مازن كوستا — المؤسس والمدير التنفيذي لكوستا استوديو" : "Mazen Costa — Founder & CEO, Costa Studio";
    try { localStorage.setItem("mc-lang", l); } catch (e) {}
  };
  let saved = null; try { saved = localStorage.getItem("mc-lang"); } catch (e) {}
  const param = new URLSearchParams(location.search).get("lang");
  setLang(param === "ar" || param === "en" ? param : saved || "en");
  $("#lang").addEventListener("click", () => setLang(root.lang === "ar" ? "en" : "ar"));

  // ---- reveal on scroll ----
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal,.pop").forEach((el) => io.observe(el));

  // ---- counters ----
  const co = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const n = +e.target.dataset.count, t0 = performance.now(), dur = 1200;
    if (reduce) return;
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur), v = Math.round(n * (1 - Math.pow(1 - p, 3))); e.target.textContent = v; if (p < 1) requestAnimationFrame(tick); };
    e.target.textContent = 0; requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach((el) => co.observe(el));

  // ---- nav: progress bar, hide on scroll down, active link ----
  const bar = $("#progress"), nav = $("#nav"); let lastY = 0;
  const secs = $$("main section[id]"), links = $$(".links a");
  const onScroll = () => {
    const y = scrollY, h = document.body.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    nav.classList.toggle("hide", y > lastY && y > 300); lastY = y;
    let cur = ""; secs.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id; });
    links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + cur));
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if (reduce) return;

  // ---- 3D tilt on cards ----
  $$(".tilt").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transition = "transform .08s"; c.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`;
    });
    c.addEventListener("pointerleave", () => { c.style.transition = "transform .45s cubic-bezier(.3,1.5,.5,1), box-shadow .25s"; c.style.transform = ""; });
  });

  // ---- hero: parallax + tap to change pose ----
  const art = $("#heroArt"), ch = $("#heroChar");
  const poses = ["a_over1", "j_show_f", "h_hero_f", "l_two", "b_over2", "k_side", "d_port", "f_two1"];
  let pi = 0; poses.forEach((p) => { const i = new Image(); i.src = `assets/char/${p}.webp`; });
  const swap = () => {
    pi = (pi + 1) % poses.length; ch.classList.remove("swap", "in"); void ch.offsetWidth;
    ch.src = `assets/char/${poses[pi]}.webp`; ch.style.animation = ""; ch.classList.add("in", "swap");
  };
  ch.addEventListener("click", swap); $("#poke").addEventListener("click", swap);
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || scrollY > innerHeight) return;
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    art.style.setProperty("--px", `${x * -18}px`); $$(".star,.burst", art).forEach((s, i) => { s.style.translate = `${x * (14 + i * 6)}px ${y * (14 + i * 6)}px`; });
  });


  // ---- contact character: follows the pointer (tilt + shift), hops on tap ----
  const cc = $("#contactChar"), ci = $("#ccImg");
  if (cc && ci) {
    let raf = 0;
    const move = (cx, cy) => {
      const r = cc.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width * 0.9)));
      const y = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height * 0.9)));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { ci.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translate(${x * 14}px, ${y * 8}px) scale(1.04)`; });
      cc.classList.add("moved");
    };
    const inView = () => { const r = cc.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
    addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" && inView()) move(e.clientX, e.clientY); });
    cc.addEventListener("pointerdown", (e) => { move(e.clientX, e.clientY); cc.classList.remove("hop"); void cc.offsetWidth; cc.classList.add("hop"); });
    cc.addEventListener("animationend", () => cc.classList.remove("hop"));
    cc.addEventListener("pointerleave", () => { ci.style.transform = ""; });
    if (matchMedia("(pointer:coarse)").matches) {
      addEventListener("deviceorientation", (e) => { if (!inView() || e.gamma == null) return; const x = Math.max(-1, Math.min(1, e.gamma / 30)), y = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); ci.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 8}deg) scale(1.03)`; }, { passive: true });
    }
  }

  // ---- comic sparks trail (desktop) ----
  if (matchMedia("(pointer:fine)").matches) {
    let last = 0;
    addEventListener("pointermove", (e) => {
      const t = performance.now(); if (t - last < 90) return; last = t;
      const s = document.createElement("i"); s.className = "spark"; s.style.left = e.clientX - 8 + "px"; s.style.top = e.clientY - 8 + "px";
      document.body.appendChild(s); setTimeout(() => s.remove(), 800);
    });
  }
})();
