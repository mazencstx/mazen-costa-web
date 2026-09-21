/* Project brief: same behaviour as the original brief (autosave, progress, WhatsApp / copy / PDF / clear), no server. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement, form = $("#briefForm"), KEY = "mc_brief_v1";
  const lang = () => (root.lang === "ar" ? "ar" : "en");
  const WA = "201130728071";

  // placeholders follow the language
  const setPh = () => $$("[data-ph-en]").forEach((el) => { el.placeholder = lang() === "ar" ? el.dataset.phAr : el.dataset.phEn; });
  window.addEventListener("mc-lang", setPh); setPh();

  // ---------- persistence ----------
  let timer = 0;
  const collect = () => { const d = {}; new FormData(form).forEach((v, k) => { if (k === "services") (d.services = d.services || []).push(v); else d[k] = v; }); return d; };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(collect())); } catch (e) {} const t = $("#savedTag"); t.classList.add("show"); clearTimeout(timer); timer = setTimeout(() => t.classList.remove("show"), 1400); };
  function restore() {
    let d; try { d = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return; } if (!d) return;
    Object.keys(d).forEach((k) => {
      if (k === "services") { const w = (d.services || []).map(String); $$('[name="services"]').forEach((el) => { if (w.includes(el.value)) el.checked = true; }); }
      else if (k === "budget") $$('[name="budget"]').forEach((el) => { if (el.value === String(d[k])) el.checked = true; });
      else { const el = form.elements[k]; if (el) el.value = d[k]; }
    });
  }
  function progress() {
    const f = $$('input[type="text"],input[type="tel"],input[type="email"],textarea', form);
    let done = f.filter((x) => x.value.trim()).length; const total = f.length + 2;
    if ($('[name="services"]:checked')) done++; if ($('[name="budget"]:checked')) done++;
    const pct = Math.round((done / total) * 100); $("#briefBar").style.width = pct + "%"; $("#briefPct").textContent = pct + "%";
  }
  const labels = (name) => $$(`[name="${name}"]:checked`).map((el) => (lang() === "ar" ? el.dataset.ar : el.dataset.en) || el.value);

  // ---------- the composed brief ----------
  const KEYS = ["name", "phone", "brand", "email", "links", "services", "offer", "age", "channels", "audience", "geo", "words", "likes", "dislikes", "colors", "noColors", "langs", "competitors", "edge", "goals", "deadline", "budget", "assets", "notes"];
  const LBL = {
    en: { head: "Project Brief — Mazen Costa", name: "Name", phone: "WhatsApp", brand: "Brand", email: "Email", links: "Links", services: "Needs", offer: "Offers", age: "Running for", channels: "Sells via", audience: "Audience", geo: "Location", words: "Three words", likes: "Likes", dislikes: "Avoid", colors: "Colours", noColors: "No colours", langs: "Language", competitors: "Competitors", edge: "Difference", goals: "Goals", deadline: "Deadline", budget: "Budget", assets: "Has already", notes: "Notes" },
    ar: { head: "بريف مشروع — مازن كوستا", name: "الاسم", phone: "واتساب", brand: "البراند", email: "الإيميل", links: "اللينكات", services: "المطلوب", offer: "بيقدم", age: "مدة النشاط", channels: "بيبيع فين", audience: "الجمهور", geo: "المكان", words: "تلات كلمات", likes: "بيعجبه", dislikes: "مش عايز", colors: "ألوان", noColors: "ألوان مرفوضة", langs: "اللغة", competitors: "المنافسين", edge: "الفرق", goals: "الأهداف", deadline: "الديدلاين", budget: "الميزانية", assets: "الموجود", notes: "ملاحظات" },
  };
  function pairs() {
    const d = collect(); d.services = labels("services"); d.budget = labels("budget")[0] || ""; const L = LBL[lang()], out = [];
    KEYS.forEach((k) => { let v = d[k]; if (Array.isArray(v)) v = v.join("، "); if (!v || !String(v).trim()) return; out.push([L[k], String(v).trim()]); });
    return { head: L.head, rows: out };
  }
  const buildText = () => { const p = pairs(); return [p.head, "━━━━━━━━━━━━━━", ...p.rows.map(([k, v]) => `${k}: ${v}`)].join("\n"); };

  // ---------- actions ----------
  function validate() {
    let ok = true;
    $$("[data-req]", form).forEach((el) => { const bad = !el.value.trim(); el.closest(".field").classList.toggle("invalid", bad); if (bad) ok = false; });
    $("#briefErr").classList.toggle("show", !ok);
    if (!ok) { const f = $(".field.invalid input", form); if (f) { f.scrollIntoView({ block: "center", behavior: "smooth" }); f.focus({ preventScroll: true }); } }
    return ok;
  }
  $("#sendWa").addEventListener("click", function (e) { if (!validate()) { e.preventDefault(); return; } this.href = `https://wa.me/${WA}?text=${encodeURIComponent(buildText())}`; });
  $("#copyBrief").addEventListener("click", function () {
    const txt = buildText(), done = () => { const old = this.innerHTML; this.textContent = lang() === "ar" ? "اتنسخ ✓" : "Copied ✓"; setTimeout(() => { this.innerHTML = old; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done).catch(fb); else fb();
    function fb() { const ta = document.createElement("textarea"); ta.value = txt; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e) {} ta.remove(); }
  });
  $("#printBrief").addEventListener("click", () => {
    const p = pairs(), esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    $("#printSheet").innerHTML = `<div class="ps-head"><img src="assets/logo-red.png" alt=""><div><b>MAZEN COSTA</b><span>${esc(p.head)}</span></div><em>costastudio.art · +20 113 072 8071</em></div>` +
      `<div class="ps-rows">${p.rows.map(([k, v]) => `<div class="ps-row"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join("") || `<p class="ps-empty">${lang() === "ar" ? "البريف فاضي" : "The brief is empty"}</p>`}</div>`;
    root.dir = lang() === "ar" ? "rtl" : "ltr"; window.print();
  });
  $("#clearBrief").addEventListener("click", () => {
    if (!confirm(lang() === "ar" ? "تمسح كل اللي كتبته؟ مش هينفع ترجعه." : "Clear everything you have written? This cannot be undone.")) return;
    form.reset(); try { localStorage.removeItem(KEY); } catch (e) {}
    $$(".field", form).forEach((f) => f.classList.remove("invalid")); $("#briefErr").classList.remove("show"); progress();
  });
  form.addEventListener("input", (e) => {
    const f = e.target.closest(".field");
    if (f && f.classList.contains("invalid") && e.target.value.trim()) { f.classList.remove("invalid"); if (!$(".field.invalid", form)) $("#briefErr").classList.remove("show"); }
    save(); progress();
  });
  form.addEventListener("change", () => { save(); progress(); });
  form.addEventListener("submit", (e) => e.preventDefault());
  restore(); progress();
})();
