/* AI Mazen Costa — a small on-page assistant. Retrieval over the site's own facts (no server, no API):
   the question is normalised (Arabic letter forms folded), tokenised and scored against each entry's keywords and body. */
(() => {
  "use strict";
  if (window.__mcAi) return; window.__mcAi = true;
  const root = document.documentElement;
  const inWork = /\/work\//.test(location.pathname);
  const BASE = inWork ? "../" : "";
  const W = (s) => (inWork ? "" : "work/") + s + ".html";
  const WA = (m) => "https://wa.me/201130728071?text=" + encodeURIComponent(m);
  const lang = () => (root.lang === "ar" ? "ar" : "en");

  const norm = (s) => String(s || "").toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/ة/g, "ه").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  const STOP = norm("في من على عن الى الي مع ال هو هي انا انت احنا ده دي دول ايه ازاي هل ممكن عايز عاوز يعني كده بس او و يا لو ان اللي كل عند فيه بتاع the a an of for to in on is are do does can what how why when where i you we my your our and or about tell me").split(" ");
  const toks = (s) => { const o = []; norm(s).split(" ").forEach((t) => { if (t.length < 2 || STOP.includes(t)) return; o.push(t); if (t.length > 4 && t.startsWith("ال")) o.push(t.slice(2)); }); return o; };

  // ---------- knowledge ----------
  const K = [
    { id: "who", k: "who mazen costa founder ceo about مين مازن كوستا المؤسس مدير تنفيذي نبذه عن تعريف",
      en: "Mazen Costa is the founder and CEO of Costa Studio in Cairo, Egypt. He opened Photoshop at 14, has 10+ years of design and code behind him, and two years deep inside AI. He builds a brand as one system: identity, website, content and an AI agent that keeps working after delivery. One person, not an agency.",
      ar: "مازن كوستا هو المؤسس والمدير التنفيذي لكوستا استوديو في القاهرة. بدأ فوتوشوب وعنده 14 سنة، وعنده +10 سنين تصميم وبرمجة وسنتين جوه الذكاء الاصطناعي. بيبني البراند كنظام واحد: هوية وموقع ومحتوى وAI Agent بيفضل شغال بعد التسليم. شخص واحد، مش وكالة.",
      chips: ["skills", "services", "work"], link: ["#about", { en: "About Mazen", ar: "من هو مازن" }] },
    { id: "skills", k: "skills tools experience design ai code marketing automation مهارات ادوات خبره تصميم برمجه اتمته تسويق فوتوشوب",
      en: "Five skills, one person:\n• Design: identity, character design, motion and 3D (Photoshop, Illustrator, 10+ years)\n• AI generation: Midjourney, Flux, Kling, Seedance, Nano Banana\n• Web development: full websites from scratch, no templates\n• Automation: AI agents and workflows\n• Marketing: copy, offers and content that sell",
      ar: "خمس مهارات من شخص واحد:\n• التصميم: هوية وشخصيات وموشن وثري دي (فوتوشوب وإليستريتور، +10 سنين)\n• الذكاء الاصطناعي: Midjourney وFlux وKling وSeedance وNano Banana\n• البرمجة: مواقع كاملة من الصفر بدون قوالب\n• الأتمتة: وكلاء ذكاء اصطناعي وأنظمة شغالة\n• التسويق: كوبي وعروض ومحتوى بيبيع",
      chips: ["services", "work"], link: ["#skills", { en: "See the skills", ar: "شوف المهارات" }] },
    { id: "services", k: "services offer what do you do خدمات بتقدم تعمل ايه هويه موقع سوشيال ريلز تسويق",
      en: "Seven services under one roof: brand identity, social media content, reels and video, websites, software development, AI files and agents, and digital marketing.",
      ar: "سبع خدمات تحت سقف واحد: هوية بصرية، بوستات وسوشيال ميديا، ريلز وفيديو، مواقع، تطوير برمجي، ملفات ذكاء اصطناعي، وتسويق رقمي.",
      chips: ["pricing", "process"], link: ["#skills", { en: "See services", ar: "شوف الخدمات" }] },
    { id: "pricing", k: "price pricing cost package packages how much سعر اسعار تكلفه باقه باقات بكام كام دولار",
      en: "Three packages:\n• Starter: $120. Logo, colour and font system, 3 social templates, PNG + SVG.\n• Full Brand System: $300 (most popular). Everything in Starter + a brand character, motion logo, full brand guide, 10 social templates, delivered in 5 days.\n• Full Studio: from $650. Complete identity + website + a custom AI system + first-month marketing plan + ongoing support. Final price depends on scope.",
      ar: "تلات باقات:\n• الأساسية: 120 دولار. شعار ونظام ألوان وخط و3 قوالب سوشيال وتسليم PNG + SVG.\n• نظام العلامة الكامل: 300 دولار (الأكتر طلبًا). كل الأساسية + شخصية بصرية وشعار متحرك ودليل هوية و10 قوالب سوشيال، تسليم خلال 5 أيام.\n• الشاملة: من 650 دولار. هوية كاملة + موقع + نظام ذكاء اصطناعي خاص ببراندك + خطة تسويق للشهر الأول + دعم مستمر. السعر النهائي حسب حجم المشروع.",
      chips: ["delivery", "start"], link: null },
    { id: "delivery", k: "delivery time days how long duration مده تسليم ايام هياخد قد ايه وقت",
      en: "The Full Brand System is delivered in 5 days. The Starter package is quick, and the Full Studio timeline depends on the scope. Tell me what you need on WhatsApp and you get a clear plan.",
      ar: "نظام العلامة الكامل بيتسلّم خلال 5 أيام. الباقة الأساسية سريعة، والباقة الشاملة مدتها حسب حجم المشروع. قولّي إيه المطلوب على واتساب وهيجيلك جدول واضح.",
      chips: ["pricing", "start"], link: null },
    { id: "process", k: "process steps how work workflow start begin طريقه شغل خطوات بنشتغل ازاي مراحل",
      en: "From first message to delivery, four steps: 1) Talk to me about your idea and goal. 2) We define the vision: market analysis and strategy. 3) Design and build with the latest tools. 4) Full delivery and ongoing support, plus an AI agent trained on your brand.",
      ar: "من أول رسالة لحد التسليم 4 خطوات: 1) تكلّمني عن فكرتك وهدفك. 2) نحدد الرؤية: تحليل السوق والاستراتيجية. 3) التصميم والتنفيذ بأحدث الأدوات. 4) تسليم كامل ودعم مستمر، وAI Agent مدرّب على براندك.",
      chips: ["start", "pricing"], link: ["#process", { en: "See the process", ar: "شوف الخطوات" }] },
    { id: "start", k: "start begin project brief hire contact whatsapp order ابدا مشروع بريف اطلب توظف واتساب كلم تواصل",
      en: "The easiest way: message me on WhatsApp with your idea and your goal. I will come back with a clear plan and a precise price. A 10-minute project brief also replaces an intro call.",
      ar: "أسهل طريقة: ابعتلي على واتساب فكرتك وهدفك، وهرجعلك بخطة واضحة وسعر أدق. وفي بريف مشروع من 10 دقايق بيغني عن مكالمة تعارف.",
      chips: ["brief", "contact"], link: [WA("Hi Mazen, I'd like to start a project"), { en: "Open WhatsApp", ar: "افتح واتساب" }], ext: true },
    { id: "brief", k: "brief form questionnaire quote estimate بريف استمارة نموذج استبيان اسئله عرض سعر",
      en: "The project brief takes about 10 minutes: 11 short sections, only your name and WhatsApp are required. It saves automatically, and you can send it on WhatsApp, copy it as text or save it as a PDF.",
      ar: "البريف بياخد حوالي 10 دقايق: 11 قسم قصير، والاسم والواتساب بس هما المطلوبين. بيتحفظ تلقائي، وتقدر تبعته على واتساب أو تنسخه كنص أو تحفظه PDF.",
      chips: ["start", "pricing"], link: [(inWork ? "../" : "") + "brief.html", { en: "Open the brief", ar: "افتح البريف" }] },
    { id: "contact", k: "contact whatsapp instagram tiktok facebook phone number reach email تواصل واتساب انستجرام تيك توك فيسبوك رقم تليفون",
      en: "WhatsApp: +20 113 072 8071\nInstagram: @costastudio.ai\nTikTok: @costa.studio1\nFacebook: Costa Studio\nWebsite: costastudio.art",
      ar: "واتساب: +20 113 072 8071\nإنستجرام: @costastudio.ai\nتيك توك: @costa.studio1\nفيسبوك: Costa Studio\nالموقع: costastudio.art",
      chips: ["start", "location"], link: [WA("Hi Mazen"), { en: "WhatsApp", ar: "واتساب" }], ext: true },
    { id: "location", k: "where location based cairo egypt language arabic english فين مكان القاهره مصر لغه عربي انجليزي بلد",
      en: "Mazen works out of Cairo, Egypt, and with clients anywhere online, in Arabic and English.",
      ar: "مازن شغال من القاهرة، مصر، ومع عملاء في أي مكان أونلاين، بالعربي والإنجليزي.",
      chips: ["contact"], link: null },
    { id: "different", k: "different why choose agency unique better ليه انت مختلف وكاله فرق يميزك افضل",
      en: "Because it is one person and one system. No hand-offs between five freelancers, so nothing gets lost in translation. You also get an AI trained on your brand, one investment with full ownership and no hidden monthly fees, consistency on every platform, and support after delivery in Arabic and English.",
      ar: "لأنه شخص واحد ونظام واحد. مفيش تسليم بين 5 فريلانسرز، فمفيش حاجة بتضيع في الترجمة. وكمان ذكاء اصطناعي مدرّب على براندك، واستثمار واحد بملكية كاملة ومفيش رسوم شهرية مخفية، وتناسق على كل المنصات، ودعم بعد التسليم بالعربي والإنجليزي.",
      chips: ["pricing", "work"], link: ["#system", { en: "The idea", ar: "الفكرة" }] },
    { id: "work", k: "work portfolio projects case studies examples اعمال مشاريع بورتفوليو شغل امثله",
      en: "Nine real projects: DURHAM, PULP, THE PRO ENGLISH, CSTA, FARIDA FURNITURE, COSTA CODE, COSTA STUDIO AI, COSTA STUDIO and this website, MAZEN COSTA PORTFOLIO. Ask me about any of them.",
      ar: "9 مشاريع حقيقية: DURHAM وPULP وTHE PRO ENGLISH وCSTA وFARIDA FURNITURE وCOSTA CODE وCOSTA STUDIO AI وCOSTA STUDIO والموقع ده نفسه MAZEN COSTA PORTFOLIO. اسألني عن أي واحد فيهم.",
      chips: ["durham", "pulp", "csta", "farida"], link: ["#work", { en: "See all work", ar: "شوف كل الأعمال" }] },
    { id: "durham", k: "durham streetwear clothes fashion store ecommerce ملابس ستريت وير متجر دورهام براند ملابس",
      en: "DURHAM: a minimal Egyptian streetwear brand. A black-and-white identity, hang tags, mailer bag, a product catalog and a full online store built from scratch (shop, cart and checkout).",
      ar: "DURHAM: براند ملابس ستريت وير مصري مينيمال. هوية أبيض وأسود، تاج المنتج وكيس الشحن وكتالوج، ومتجر إلكتروني كامل من الصفر (متجر وسلة ودفع).",
      chips: ["work", "start"], link: [W("durham"), { en: "Open the case study", ar: "افتح الشغل" }] },
    { id: "pulp", k: "pulp cosmetics fruit packaging beauty makeup تجميل عبوات فاكهه بلب مستحضرات",
      en: "PULP: a cosmetics brand with fruit-shaped packaging and a summer mascot. Identity, 8 product packages, and one campaign system for every product.",
      ar: "PULP: براند مستحضرات تجميل بعبوات بشكل الفاكهة وشخصية صيفية. هوية وعبوات 8 منتجات ونظام حملة موحد لكل منتج.",
      chips: ["work", "start"], link: [W("pulp"), { en: "Open the case study", ar: "افتح الشغل" }] },
    { id: "pro", k: "pro english courses platform app learning education انجليش كورسات منصه تطبيق تعليم",
      en: "THE PRO ENGLISH: an English courses platform. Identity, website and mobile app, a fixed content system (an 8-slide Instagram carousel and 5 Facebook post types) and a brand character for video.",
      ar: "THE PRO ENGLISH: منصة كورسات إنجليزي. هوية وموقع وتطبيق موبايل ونظام محتوى ثابت (كاروسيل 8 سلايدات و5 أنواع بوستات فيسبوك) وشخصية للفيديو.",
      chips: ["work", "start"], link: [W("the-pro-english"), { en: "Open the case study", ar: "افتح الشغل" }] },
    { id: "csta", k: "csta drinks beverage cup can coffee qr مشروبات كوباية كان قهوه سي ستا",
      en: "CSTA: a Cairo beverage brand. The idea is your face on your cup: scan a QR, upload a photo and get your own cartoon character on every drink. Logo, packaging, a 15-drink menu and a live website with the feature.",
      ar: "CSTA: براند مشروبات من القاهرة. الفكرة إن وشك على الكوباية: تسكان QR وترفع صورتك ويطلعلك كاراكتر كارتوني خاص بيك. لوجو وتغليف ومنيو 15 مشروب وموقع شغال بالفيتشر.",
      chips: ["work", "start"], link: [W("csta"), { en: "Open the case study", ar: "افتح الشغل" }] },
    { id: "farida", k: "farida furniture luxury restoration instagram فريده اثاث فاخر ترميم",
      en: "FARIDA FURNITURE: from a personal Instagram account to a luxury furniture brand. A one-line armchair logo, brand guide, business card, a full website, photography direction and an Instagram redesign.",
      ar: "FARIDA FURNITURE: من حساب إنستجرام شخصي لبراند أثاث فاخر. شعار كرسي بخط واحد ودليل هوية وكارت عمل وموقع كامل وتوجيه تصوير وإعادة تصميم الحساب.",
      chips: ["work", "start"], link: [W("farida"), { en: "Open the case study", ar: "افتح الشغل" }] },
    { id: "code", k: "costa code developer cli terminal mascot code prompt كوستا كود مطورين كود ماسكوت",
      en: "COSTA CODE: a product Mazen built for himself. An AI that writes code and ships websites from one prompt: a real CLI, a full web app, a pixel mascot with 10 expressions, and Arabic/English documentation.",
      ar: "COSTA CODE: منتج مازن بناه لنفسه. ذكاء اصطناعي بيكتب كود ويبني مواقع ببرومبت واحد: أداة CLI حقيقية وتطبيق ويب كامل وماسكوت بكسل بـ 10 تعبيرات وتوثيق عربي وإنجليزي.",
      chips: ["ai", "work"], link: [W("costa-code"), { en: "Open the case study", ar: "افتح الشغل" }] },
    { id: "ai", k: "ai studio models video image generation calculator credits ذكاء اصطناعي استوديو موديلز توليد كريديت اله حاسبه",
      en: "COSTA STUDIO AI: a full AI studio with one account and one balance. 60+ models (22 video, 18 image, 17 audio, 3 code), 8 studios, up to 4K, and a cost calculator before every generation. Credits never expire and there is no forced monthly plan.",
      ar: "COSTA STUDIO AI: استوديو ذكاء اصطناعي كامل بحساب واحد ورصيد واحد. +60 موديل (22 فيديو و18 صور و17 صوت و3 كود) و8 استوديوهات ودقة لحد 4K وآلة حاسبة قبل كل توليد. الكريديت مالوش تاريخ انتهاء ومفيش اشتراك شهري إجباري.",
      chips: ["code", "work"], link: [W("costa-studio-ai"), { en: "Open the case study", ar: "افتح الشغل" }] },
    { id: "studio", k: "costa studio brand logo identity website content system كوستا استوديو لوجو هويه الاستوديو",
      en: "COSTA STUDIO: the studio itself. Two interlocked C letters (design and code as one), a hand-coded bilingual website with light and dark themes, and a content system that follows the same rules everywhere.",
      ar: "COSTA STUDIO: الاستوديو نفسه. حرفين C متشابكين (التصميم والكود حاجة واحدة)، وموقع مكتوب بالإيد بعربي/إنجليزي وفاتح/غامق، ونظام محتوى بنفس القواعد في كل مكان.",
      chips: ["work", "start"], link: [W("costa-studio"), { en: "Open the case study", ar: "افتح الشغل" }] },
    { id: "bot", k: "bot robot real human ai are you who are you انت مين بوت روبوت حقيقي انسان شخص",
      en: "I am AI Mazen Costa, an automated assistant on this page. I answer from the information on this site: skills, services, packages and projects. For anything else, or for a quote, talk to Mazen himself on WhatsApp.",
      ar: "أنا AI Mazen Costa، مساعد آلي على الصفحة دي. بجاوب من المعلومات الموجودة في الموقع: المهارات والخدمات والباقات والمشاريع. لأي حاجة تانية أو عرض سعر، كلّم مازن نفسه على واتساب.",
      chips: ["start", "who"], link: null },
    { id: "hi", k: "hi hello hey hola salam مرحبا اهلا هاي سلام السلام صباح مساء",
      en: "Hi! I am AI Mazen Costa. Ask me about Mazen, his skills, services, packages or any of his projects.",
      ar: "أهلًا! أنا AI Mazen Costa. اسألني عن مازن أو مهاراته أو الخدمات أو الباقات أو أي مشروع من شغله.",
      chips: ["who", "services", "pricing", "work"], link: null },
    { id: "thanks", k: "thanks thank you great cool nice شكرا تسلم جميل حلو ممتاز تمام",
      en: "Anytime. If you want to start a project, WhatsApp is the fastest way to reach Mazen.",
      ar: "على الرحب والسعة. لو عايز تبدأ مشروع، واتساب أسرع طريقة توصل بيها لمازن.",
      chips: ["start"], link: null },
  ];
  const CHIP = {
    who: { en: "Who is Mazen?", ar: "مين مازن؟" }, skills: { en: "Skills", ar: "المهارات" }, services: { en: "Services", ar: "الخدمات" }, pricing: { en: "Packages & prices", ar: "الباقات والأسعار" },
    delivery: { en: "How long does it take?", ar: "بياخد قد إيه؟" }, process: { en: "How he works", ar: "بنشتغل إزاي" }, start: { en: "Start a project", ar: "ابدأ مشروع" }, brief: { en: "The project brief", ar: "بريف المشروع" }, contact: { en: "Contact", ar: "التواصل" },
    location: { en: "Where is he based?", ar: "فين مكانه؟" }, different: { en: "Why not an agency?", ar: "ليه مش وكالة؟" }, work: { en: "All projects", ar: "كل المشاريع" },
    durham: { en: "DURHAM", ar: "DURHAM" }, pulp: { en: "PULP", ar: "PULP" }, pro: { en: "THE PRO ENGLISH", ar: "THE PRO ENGLISH" }, csta: { en: "CSTA", ar: "CSTA" }, farida: { en: "FARIDA", ar: "FARIDA" },
    code: { en: "COSTA CODE", ar: "COSTA CODE" }, ai: { en: "COSTA STUDIO AI", ar: "COSTA STUDIO AI" }, studio: { en: "COSTA STUDIO", ar: "COSTA STUDIO" },
  };
  const TEXT = {
    en: { name: "AI Mazen Costa", status: "Online · answers from this site", ph: "Ask about Mazen or his work…", tip: "Ask AI Mazen Costa", note: "Automated assistant · for a quote, message Mazen on WhatsApp", none: "I could not find that on this site. Try one of the questions below, or message Mazen directly on WhatsApp.", wa: "Message Mazen on WhatsApp" },
    ar: { name: "AI Mazen Costa", status: "أونلاين · بجاوب من معلومات الموقع", ph: "اسألني عن مازن أو شغله…", tip: "اسأل AI Mazen Costa", note: "مساعد آلي · لعرض سعر كلّم مازن على واتساب", none: "ماقدرتش ألاقي ده في الموقع. جرّب واحد من الأسئلة تحت، أو كلّم مازن مباشرة على واتساب.", wa: "كلّم مازن على واتساب" },
  };
  K.forEach((e) => { e._k = toks(e.k); e._b = toks(e.en + " " + e.ar); });
  const search = (q) => { const qt = toks(q); if (!qt.length) return []; return K.map((e) => { let s = 0; qt.forEach((t) => { if (e._k.some((w) => w === t || (t.length > 3 && (w.startsWith(t) || t.startsWith(w))))) s += 3; else if (e._b.includes(t)) s += 1; }); return { e, s }; }).filter((r) => r.s > 0).sort((a, b) => b.s - a.s); };

  // ---------- UI ----------
  const av = BASE + "assets/ai-avatar.webp";
  const host = document.createElement("div");
  host.innerHTML = `
    <div class="mc-ai-tip" id="mcTip"></div>
    <button class="mc-ai-launcher" id="mcLauncher" type="button" aria-label="AI Mazen Costa"><img src="${av}" alt=""><span class="ai-badge">AI</span><span class="ai-x">✕</span></button>
    <section class="mc-ai-panel" id="mcPanel" role="dialog" aria-label="AI Mazen Costa">
      <div class="mc-ai-head"><img src="${av}" alt=""><div class="who"><b>AI MAZEN COSTA</b><small id="mcStatus"></small></div><button type="button" id="mcClose" aria-label="Close">✕</button></div>
      <div class="mc-ai-msgs" id="mcMsgs"></div>
      <div class="mc-chips" id="mcChips"></div>
      <form class="mc-ai-form" id="mcForm" autocomplete="off"><input id="mcInput" type="text" maxlength="200"><button type="submit" aria-label="Send"><span>➤</span></button></form>
      <div class="mc-ai-note" id="mcNote"></div>
    </section>`;
  document.body.appendChild(host);
  const $ = (id) => document.getElementById(id);
  const launcher = $("mcLauncher"), panel = $("mcPanel"), msgs = $("mcMsgs"), chips = $("mcChips"), input = $("mcInput"), tip = $("mcTip");
  let opened = false, greeted = false, tipShown = false;

  function labels() { const t = TEXT[lang()]; $("mcStatus").textContent = t.status; input.placeholder = t.ph; $("mcNote").textContent = t.note; tip.textContent = t.tip; }
  function scroll() { msgs.scrollTop = msgs.scrollHeight; }
  function add(text, who, links) {
    const m = document.createElement("div"); m.className = "mc-msg " + who; m.textContent = text;
    if (links && links.length) { const box = document.createElement("div"); box.className = "links"; links.forEach((l) => { const a = document.createElement("a"); a.textContent = l.label; a.href = l.href; if (l.ext) { a.target = "_blank"; a.rel = "noopener"; } else if (l.href.startsWith("#")) { a.addEventListener("click", () => { if (l.href.length > 1 && !document.querySelector(l.href)) return; toggle(false); }); } box.appendChild(a); }); m.appendChild(box); }
    msgs.appendChild(m); scroll(); return m;
  }
  function setChips(ids) { chips.innerHTML = ""; ids.forEach((id) => { const b = document.createElement("button"); b.type = "button"; b.textContent = CHIP[id][lang()]; b.addEventListener("click", () => ask(CHIP[id][lang()], id)); chips.appendChild(b); }); }
  function linkOf(e) { if (!e.link) return null; const href = e.link[0].startsWith("#") && inWork ? BASE + "index.html" + e.link[0] : e.link[0]; return [{ label: e.link[1][lang()], href, ext: !!e.ext }]; }
  function reply(e) { const L = lang(); const typing = document.createElement("div"); typing.className = "mc-typing"; typing.innerHTML = "<i></i><i></i><i></i>"; msgs.appendChild(typing); scroll(); setTimeout(() => { typing.remove(); add(e[L], "bot", linkOf(e)); setChips(e.chips || ["who", "services", "pricing", "work"]); }, 520); }
  function ask(text, id) {
    add(text, "user");
    const hit = id ? K.find((e) => e.id === id) : (search(text)[0] || {}).e;
    if (hit) return reply(hit);
    const L = lang(), t = TEXT[L], typing = document.createElement("div"); typing.className = "mc-typing"; typing.innerHTML = "<i></i><i></i><i></i>"; msgs.appendChild(typing); scroll();
    setTimeout(() => { typing.remove(); add(t.none, "bot", [{ label: t.wa, href: WA("Hi Mazen"), ext: true }]); setChips(["who", "services", "pricing", "work"]); }, 520);
  }
  function toggle(force) {
    opened = force === undefined ? !opened : force;
    panel.classList.toggle("open", opened); launcher.classList.toggle("open", opened); tip.classList.remove("show");
    if (opened) { labels(); if (!greeted) { greeted = true; const g = K.find((e) => e.id === "hi"); add(g[lang()], "bot"); setChips(g.chips); } setTimeout(() => input.focus(), 300); }
  }
  launcher.addEventListener("click", () => toggle()); $("mcClose").addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && opened) toggle(false); });
  $("mcForm").addEventListener("submit", (e) => { e.preventDefault(); const v = input.value.trim(); if (!v) return; input.value = ""; ask(v); });
  window.addEventListener("mc-lang", labels);
  new MutationObserver(labels).observe(root, { attributes: true, attributeFilter: ["lang"] });
  labels();
  setTimeout(() => { if (!opened && !tipShown) { tipShown = true; labels(); tip.classList.add("show"); setTimeout(() => tip.classList.remove("show"), 6000); } }, 3200);
})();
