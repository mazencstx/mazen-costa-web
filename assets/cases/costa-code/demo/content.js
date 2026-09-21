/* __IIFE__ */
(function () {
'use strict';

/* ---------- Content registry ---------- */
/* Every user-facing string and every brand asset in the app is declared here
   with a stable key. Views read through Content.t() / Content.asset() instead
   of hard-coding, which is what makes the Site Editor able to override any of
   them. Overrides live in the shared settings store, so they persist and are
   visible to the terminal too. */

const DEFAULT_TEXT = {
  // Brand
  'brand.name': 'Costa Code',
  'brand.tagline': 'AI Software Engineer',
  'brand.slogan': 'Code. Animate. Ship.',

  // Sidebar
  'nav.home': 'Home',
  'nav.prompts': 'Prompt Engineer',
  'nav.group.core': 'Core',
  'nav.group.studio': 'Studio',
  'nav.group.history': 'History',
  'nav.group.notes': 'Notes',
  'nav.group.tasks': 'Tasks',
  'nav.group.files': 'Files',
  'nav.group.providers': 'Providers',

  // Capabilities
  'cap.aiCoding': 'AI Coding',
  'cap.websites': 'Websites',
  'cap.mobileApps': 'Mobile Apps',
  'cap.animations': 'Animations',
  'cap.pdfDocs': 'PDF Docs',
  'cap.databases': 'Databases',
  'cap.deploy': 'Deploy',

  // Capability starter prompts
  'capPrompt.aiCoding': 'Write clean, production-ready code for: ',
  'capPrompt.websites': 'Build a full website for: ',
  'capPrompt.mobileApps': 'Build a mobile app screen for: ',
  'capPrompt.animations': 'Add a smooth animation for: ',
  'capPrompt.pdfDocs': 'Generate a PDF document for: ',
  'capPrompt.databases': 'Design a database schema for: ',
  'capPrompt.deploy': 'Give me the deploy steps for: ',

  // Home
  'home.greeting': "What's up next, {name}?",
  'home.greetingNoName': "What's up next?",
  'home.emoji': '👋',
  'home.quickActions': 'Quick Actions',
  'home.tabOverview': 'Overview',
  'home.tabModels': 'Models',
  'stat.sessions': 'Sessions',
  'stat.messages': 'Messages',
  'stat.tokens': 'Total tokens',
  'stat.activeDays': 'Active days',
  'stat.currentStreak': 'Current streak',
  'stat.longestStreak': 'Longest streak',
  'stat.peakHour': 'Peak hour',
  'stat.favoriteModel': 'Favorite model',

  // Chat
  'chat.heroTitle': 'HELLO ENG.{name} YOUR READY',
  'chat.heroSubtitle': 'Build anything with a single prompt.',
  'chat.placeholder': 'Build anything with a single prompt.',
  'chat.send': 'Send',
  'chat.new': 'New',
  'chat.local': 'Local',
  'chat.acceptEdits': 'Accept edits',
  'chat.newChatTitle': 'New chat',

  // Prompt Engineer
  'prompts.title': 'Prompt Engineer',
  'prompts.search': 'Search prompts…',
  'prompts.new': 'New prompt',
  'prompts.emptyTitle': 'No saved prompts yet',
  'prompts.emptyBody': 'Save the prompts you reuse — briefs, brand rules, image directions — and send them into any chat in one click.',
  'prompts.use': 'Use',

  // Settings
  'settings.title': 'Settings',
  'settings.search': 'Search settings…',
};

const DEFAULT_ASSETS = {
  'logo.mark': { label: 'Brand mark (sidebar, avatar, favicon)', value: './assets/logo.png', kind: 'image' },
  'logo.full': { label: 'Full logo lockup (chat hero)', value: './assets/logo-full.png', kind: 'image' },
  'hero.media': { label: 'Hero background video', value: './media/hero.mp4', kind: 'media' },
  'icon.aiCoding': { label: 'Icon — AI Coding', value: '', kind: 'icon' },
  'icon.websites': { label: 'Icon — Websites', value: '', kind: 'icon' },
  'icon.mobileApps': { label: 'Icon — Mobile Apps', value: '', kind: 'icon' },
  'icon.animations': { label: 'Icon — Animations', value: '', kind: 'icon' },
  'icon.pdfDocs': { label: 'Icon — PDF Docs', value: '', kind: 'icon' },
  'icon.databases': { label: 'Icon — Databases', value: '', kind: 'icon' },
  'icon.deploy': { label: 'Icon — Deploy', value: '', kind: 'icon' },
  'icon.design': { label: 'Icon — Design', value: '', kind: 'icon' },
  'icon.motion': { label: 'Icon — Motion', value: '', kind: 'icon' },
  'icon.code': { label: 'Icon — Code', value: '', kind: 'icon' },
  'icon.ai': { label: 'Icon — AI', value: '', kind: 'icon' },
  'icon.cloud': { label: 'Icon — Cloud', value: '', kind: 'icon' },
  'icon.home': { label: 'Icon — Home', value: '', kind: 'icon' },
  'icon.sparkle': { label: 'Icon — Prompt Engineer', value: '', kind: 'icon' },
};

// Grouping used by the Site Editor's Text tab.
const TEXT_GROUPS = [
  { label: 'Brand', match: (k) => k.startsWith('brand.') },
  { label: 'Navigation', match: (k) => k.startsWith('nav.') },
  { label: 'Capabilities', match: (k) => k.startsWith('cap.') },
  { label: 'Starter prompts', match: (k) => k.startsWith('capPrompt.') },
  { label: 'Home & stats', match: (k) => k.startsWith('home.') || k.startsWith('stat.') },
  { label: 'Chat', match: (k) => k.startsWith('chat.') },
  { label: 'Prompt Engineer', match: (k) => k.startsWith('prompts.') },
  { label: 'Settings', match: (k) => k.startsWith('settings.') },
];

function overridesText() { return window.Store.state.settings.siteText || {}; }
function overridesAssets() { return window.Store.state.settings.siteAssets || {}; }

// t('key', { name: 'Costa' }) — {placeholders} are filled from vars.
function t(key, vars) {
  const raw = overridesText()[key] ?? DEFAULT_TEXT[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
}

function asset(key) {
  const override = overridesAssets()[key];
  if (override) return override;
  return DEFAULT_ASSETS[key]?.value || '';
}

// Icons fall back to the built-in line-art SVG unless the Site Editor has
// pointed the key at an uploaded image.
function iconFor(name) {
  const custom = asset(`icon.${name}`);
  if (custom) return `<img src="${custom}" alt="" class="custom-icon" />`;
  return window.icon(name);
}

function logoImg(key = 'logo.mark') {
  return `<img src="${asset(key)}" alt="${t('brand.name')}" draggable="false" />`;
}

async function setText(key, value) {
  const next = { ...overridesText() };
  if (value == null || value === '' || value === DEFAULT_TEXT[key]) delete next[key];
  else next[key] = value;
  await window.Store.saveSettings({ siteText: next });
}

async function setAsset(key, value) {
  const next = { ...overridesAssets() };
  if (!value) delete next[key];
  else next[key] = value;
  await window.Store.saveSettings({ siteAssets: next });
}

async function resetAll() {
  await window.Store.saveSettings({ siteText: {}, siteAssets: {} });
}

window.Content = {
  t, asset, iconFor, logoImg, setText, setAsset, resetAll,
  DEFAULT_TEXT, DEFAULT_ASSETS, TEXT_GROUPS,
  overridesText, overridesAssets,
};
})();
