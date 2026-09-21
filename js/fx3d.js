/* 3D pointer-follow for every element marked data-3d="strength": tilts toward the mouse, shifts slightly, hops on tap.
   Uses the transform property; idle bobbing uses the separate translate/rotate properties, so both combine. */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = [...document.querySelectorAll("[data-3d]")];
  if (!els.length) return;
  const st = new Map(); let px = innerWidth / 2, py = innerHeight / 2, active = false, raf = 0, idle = 0;
  const clamp = (v) => Math.max(-1, Math.min(1, v));
  const io = new IntersectionObserver((es) => es.forEach((e) => { const s = st.get(e.target); s.vis = e.isIntersecting; if (s.vis) kick(); }), { rootMargin: "80px" });
  els.forEach((el) => { st.set(el, { rx: 0, ry: 0, tx: 0, ty: 0, vis: false, on: false, t0: 0 }); io.observe(el); });
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  function ready(el, s, now) {
    if (s.on) return true;
    const needsIn = el.classList.contains("reveal") || el.classList.contains("pop");
    if (needsIn && !el.classList.contains("in")) return false;
    if (!s.t0) s.t0 = now;
    if (now - s.t0 < 1100) return false;             // let the entrance animation finish first
    el.style.transition = "none"; el.style.willChange = "transform"; s.on = true; return true;
  }
  function loop(now) {
    raf = 0; let moving = false;
    st.forEach((s, el) => {
      if (!s.vis) return;
      if (!ready(el, s, now)) { moving = true; return; }
      const k = parseFloat(el.dataset["3d"]) || 1, r = el.getBoundingClientRect();
      const dx = active ? clamp((px - (r.left + r.width / 2)) / (innerWidth * 0.45)) : 0;
      const dy = active ? clamp((py - (r.top + r.height / 2)) / (innerHeight * 0.45)) : 0;
      const trx = -dy * 11 * k, try_ = dx * 16 * k, ttx = dx * 12 * k, tty = dy * 7 * k;
      s.rx += (trx - s.rx) * 0.13; s.ry += (try_ - s.ry) * 0.13; s.tx += (ttx - s.tx) * 0.13; s.ty += (tty - s.ty) * 0.13;
      el.style.transform = `perspective(900px) rotateY(${s.ry.toFixed(2)}deg) rotateX(${s.rx.toFixed(2)}deg) translate3d(${s.tx.toFixed(1)}px,${s.ty.toFixed(1)}px,0)`;
      if (Math.abs(trx - s.rx) + Math.abs(try_ - s.ry) + Math.abs(ttx - s.tx) > 0.05) moving = true;
    });
    if (moving || active) raf = requestAnimationFrame(loop);
  }
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    px = e.clientX; py = e.clientY; active = true; clearTimeout(idle); kick();
    idle = setTimeout(() => { active = false; kick(); }, 2500);
  }, { passive: true });
  document.addEventListener("pointerleave", () => { active = false; kick(); });
  addEventListener("scroll", kick, { passive: true });
  // tap / click: cartoon hop
  els.forEach((el) => el.addEventListener("pointerdown", () => { el.classList.remove("hop3d"); void el.offsetWidth; el.classList.add("hop3d"); }));
  els.forEach((el) => el.addEventListener("animationend", (e) => { if (e.animationName === "hop3d") el.classList.remove("hop3d"); }));
})();
