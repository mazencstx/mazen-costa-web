(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- language: the page is written in Arabic with data-en overrides ----
  function swap(attr, get, set, en) {
    $$("[" + attr + "]").forEach((el) => {
      const keep = "data-ar-" + attr;
      if (!el.hasAttribute(keep)) el.setAttribute(keep, get(el));
      set(el, en ? el.getAttribute(attr) : el.getAttribute(keep));
    });
  }
  function applyLang(l) {
    const en = l === "en";
    root.lang = l; root.dir = en ? "ltr" : "rtl";
    swap("data-en", (e) => e.textContent, (e, v) => { e.textContent = v; }, en);
    swap("data-en-html", (e) => e.innerHTML, (e, v) => { e.innerHTML = v; }, en);
    swap("data-en-content", (e) => e.getAttribute("content") || "", (e, v) => e.setAttribute("content", v), en);
    swap("data-en-wa-href", (e) => e.getAttribute("href") || "", (e, v) => e.setAttribute("href", v), en);
    const t = $("title"); if (t) document.title = t.textContent;
    try { localStorage.setItem("mc-lang", l); } catch (e) {}
    window.dispatchEvent(new CustomEvent("mc-lang", { detail: l }));
  }
  let saved = null; try { saved = localStorage.getItem("mc-lang"); } catch (e) {}
  const param = new URLSearchParams(location.search).get("lang");
  applyLang(param === "ar" || param === "en" ? param : saved || "en");
  $("#lang").addEventListener("click", () => applyLang(root.lang === "ar" ? "en" : "ar"));

  // ---- reveal ----
  $$(".cs-figure,.cs-scope-card,.cs-type-card,.cs-file,.cs-step,.cs-stat,.cs-font-card,.cs-meta-item,.cs-note,.cs-live,.cs-ba-col,.cs-timeline li,.cs-section-label,.cs-section h2,.cs-section h3,.cs-section>.wrap>p,.cs-caption-box,.cs-rule-col,.cs-logo-hero,.next-card").forEach((el, i) => { el.classList.add("reveal"); el.style.transitionDelay = (i % 4) * 0.07 + "s"; });
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  $$(".reveal,.pop").forEach((el) => io.observe(el));

  // ---- nav + progress ----
  const bar = $("#progress"), nav = $("#nav"); let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY, h = document.body.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    nav.classList.toggle("hide", y > lastY && y > 300); lastY = y;
  }, { passive: true });

  if (reduce) return;

  // ---- tilt on hover (desktop) ----
  $$(".cs-figure,.cs-meta-item,.cs-scope-card,.cs-type-card").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.setProperty("--tx", `${x * 5}deg`); c.style.setProperty("--ty", `${-y * 5}deg`);
    });
  });

  // ---- comic sparks trail ----
  if (matchMedia("(pointer:fine)").matches) {
    let last = 0;
    addEventListener("pointermove", (e) => {
      const t = performance.now(); if (t - last < 90) return; last = t;
      const s = document.createElement("i"); s.className = "spark"; s.style.left = e.clientX - 8 + "px"; s.style.top = e.clientY - 8 + "px";
      document.body.appendChild(s); setTimeout(() => s.remove(), 800);
    });
  }
})();
