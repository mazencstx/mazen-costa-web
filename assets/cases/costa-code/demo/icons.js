'use strict';

/* ---------- Icon set ---------- */
/* Line-art, 24x24, 1.5px stroke with rounded caps — matching the reference
   sheet. The outline uses `currentColor` so it inherits the theme's text
   color; the red details (PDF label, DB bands, deploy arrow, sparkles) use
   var(--icon-accent), so one definition serves light and dark. */

const S = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
const A = 'var(--icon-accent)';

function svg(body, viewBox = '0 0 24 24') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${body}</svg>`;
}

const ICONS = {
  /* ---- Capability icons (the CORE rail + Quick Actions) ---- */

  // Browser window with traffic-light dots
  aiCoding: () => svg(`
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" ${S}/>
    <path d="M2.5 8.5h19" ${S}/>
    <circle cx="5.5" cy="6.25" r=".85" fill="${A}"/>
    <circle cx="8" cy="6.25" r=".85" fill="${A}"/>
    <circle cx="10.5" cy="6.25" r=".85" fill="${A}"/>
  `),

  // Phone with a notch — "Websites" in the reference sheet
  websites: () => svg(`
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" ${S}/>
    <path d="M10 2.5h4v1.6a.9.9 0 0 1-.9.9h-2.2a.9.9 0 0 1-.9-.9V2.5Z" fill="${A}"/>
    <circle cx="12" cy="18" r="1" fill="${A}"/>
  `),

  // Plain phone
  mobileApps: () => svg(`
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" ${S}/>
    <circle cx="12" cy="18" r="1" fill="${A}"/>
  `),

  // Four-point sparkle + two small sparks
  animations: () => svg(`
    <path d="M13 4.5c.35 3.1 2.4 5.15 5.5 5.5-3.1.35-5.15 2.4-5.5 5.5-.35-3.1-2.4-5.15-5.5-5.5 3.1-.35 5.15-2.4 5.5-5.5Z" ${S}/>
    <circle cx="6" cy="6" r="1.1" fill="${A}"/>
    <path d="M19 4.2l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3Z" fill="${A}"/>
    <path d="M8.5 17.5l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4.4-1Z" fill="${A}"/>
  `),

  // Document with a folded corner and a red PDF label
  pdfDocs: () => svg(`
    <path d="M6 2.75h7.5L19 8.25v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-18.5a1 1 0 0 1 1-1Z" ${S}/>
    <path d="M13.5 2.75v4.5a1 1 0 0 0 1 1H19" ${S}/>
    <text x="12" y="17.6" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="5.2" font-weight="700" fill="${A}">PDF</text>
  `),

  // Cylinder with red bands
  databases: () => svg(`
    <ellipse cx="12" cy="5.75" rx="7" ry="3.25" ${S}/>
    <path d="M5 5.75v12.5c0 1.8 3.13 3.25 7 3.25s7-1.45 7-3.25V5.75" ${S}/>
    <path d="M5 10.9c0 1.8 3.13 3.25 7 3.25s7-1.45 7-3.25" fill="none" stroke="${A}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M5 15.1c0 1.8 3.13 3.25 7 3.25s7-1.45 7-3.25" fill="none" stroke="${A}" stroke-width="1.5" stroke-linecap="round"/>
  `),

  // Cloud with a red up-arrow
  deploy: () => svg(`
    <path d="M7 19.5a4.5 4.5 0 0 1-.6-8.96 5.5 5.5 0 0 1 10.83-1.06A4.25 4.25 0 0 1 17.5 19.5" ${S}/>
    <path d="M12 21.5V10.5" fill="none" stroke="${A}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M8.75 13.5L12 10.25l3.25 3.25" fill="none" stroke="${A}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  /* ---- Studio rail ---- */
  design: () => svg(`
    <path d="M3.5 20.5l1-4 11-11a2.12 2.12 0 0 1 3 3l-11 11-4 1Z" ${S}/>
    <path d="M13.5 7l3.5 3.5" ${S}/>
    <circle cx="19" cy="19" r="1.2" fill="${A}"/>
  `),
  motion: () => svg(`
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" ${S}/>
    <path d="M10 9.75l4.5 2.75L10 15.25v-5.5Z" fill="${A}"/>
  `),
  code: () => svg(`
    <path d="M8.5 8.5L4.5 12l4 3.5" ${S}/>
    <path d="M15.5 8.5l4 3.5-4 3.5" ${S}/>
    <path d="M13.5 5.5l-3 13" fill="none" stroke="${A}" stroke-width="1.5" stroke-linecap="round"/>
  `),
  ai: () => svg(`
    <circle cx="12" cy="12" r="8.5" ${S}/>
    <circle cx="12" cy="12" r="3.25" fill="none" stroke="${A}" stroke-width="1.5"/>
    <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" ${S}/>
  `),
  cloud: () => svg(`
    <path d="M7 18.5a4.5 4.5 0 0 1-.6-8.96 5.5 5.5 0 0 1 10.83-1.06A4.25 4.25 0 0 1 17.5 18.5H7Z" ${S}/>
    <circle cx="12" cy="14" r="1.1" fill="${A}"/>
  `),

  /* ---- UI chrome ---- */
  home: () => svg(`
    <path d="M3.5 10.5L12 3.5l8.5 7" ${S}/>
    <path d="M5.5 9v10.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9" ${S}/>
    <path d="M9.75 20.5v-6h4.5v6" ${S}/>
  `),
  search: () => svg(`
    <circle cx="11" cy="11" r="6.5" ${S}/>
    <path d="M15.8 15.8l4.7 4.7" ${S}/>
  `),
  gear: () => svg(`
    <circle cx="12" cy="12" r="3.25" ${S}/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" ${S}/>
  `),
  sun: () => svg(`
    <circle cx="12" cy="12" r="4" ${S}/>
    <path d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77" ${S}/>
  `),
  moon: () => svg(`<path d="M20.5 14.3A8.5 8.5 0 1 1 9.7 3.5a6.6 6.6 0 0 0 10.8 10.8Z" ${S}/>`),
  monitor: () => svg(`
    <rect x="2.5" y="4" width="19" height="13" rx="2" ${S}/>
    <path d="M8.5 20.5h7M12 17v3.5" ${S}/>
  `),
  paperclip: () => svg(`<path d="M16.5 7.5v8a4.5 4.5 0 0 1-9 0v-9a3 3 0 0 1 6 0v8.5a1.5 1.5 0 0 1-3 0V8" ${S}/>`),
  chevron: () => svg(`<path d="M9 6l6 6-6 6" ${S}/>`),
  chevronDown: () => svg(`<path d="M6 9l6 6 6-6" ${S}/>`),
  close: () => svg(`<path d="M6 6l12 12M18 6L6 18" ${S}/>`),
  plus: () => svg(`<path d="M12 5v14M5 12h14" ${S}/>`),
  send: () => svg(`<path d="M4 12l16-8-5.5 16-3-6.5L4 12Z" ${S}/>`),
  folder: () => svg(`<path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4l2 2.5h7.5A1.5 1.5 0 0 1 20 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5V7Z" ${S}/>`),
  file: () => svg(`
    <path d="M6.5 2.75h7L18.5 7.75v13.5h-12V2.75Z" ${S}/>
    <path d="M13.5 2.75v5h5" ${S}/>
  `),
  note: () => svg(`
    <rect x="4" y="3.5" width="16" height="17" rx="2" ${S}/>
    <path d="M8 8.5h8M8 12h8M8 15.5h5" ${S}/>
  `),
  check: () => svg(`<path d="M5 12.5l4.5 4.5L19 7" ${S}/>`),
  trash: () => svg(`
    <path d="M4 6.5h16M9 6.5V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" ${S}/>
    <path d="M6.5 6.5l.9 13a1 1 0 0 0 1 .95h7.2a1 1 0 0 0 1-.95l.9-13" ${S}/>
  `),
  sparkle: () => svg(`<path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4Z" ${S}/>`),
  bolt: () => svg(`<path d="M13.5 3L5 13.5h5.5L10 21l8.5-10.5H13L13.5 3Z" ${S}/>`),
  user: () => svg(`
    <circle cx="12" cy="8" r="4" ${S}/>
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" ${S}/>
  `),
  shield: () => svg(`<path d="M12 2.75l7.5 3v6c0 4.5-3.1 8.6-7.5 9.75C7.6 20.35 4.5 16.25 4.5 11.75v-6l7.5-3Z" ${S}/>`),
  card: () => svg(`
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" ${S}/>
    <path d="M2.5 10h19" ${S}/>
  `),
  chart: () => svg(`
    <path d="M4 20.5V4" ${S}/><path d="M4 20.5h16" ${S}/>
    <path d="M8 16.5v-4M12 16.5v-8M16 16.5v-5.5" fill="none" stroke="${A}" stroke-width="1.8" stroke-linecap="round"/>
  `),
  puzzle: () => svg(`<path d="M10 3.5a2 2 0 0 1 4 0V5h3.5a1 1 0 0 1 1 1v3.5H20a2 2 0 0 1 0 4h-1.5V17a1 1 0 0 1-1 1H14v1.5a2 2 0 0 1-4 0V18H6.5a1 1 0 0 1-1-1v-3.5H4a2 2 0 0 1 0-4h1.5V6a1 1 0 0 1 1-1H10V3.5Z" ${S}/>`),
  plug: () => svg(`
    <path d="M9 3.5v6M15 3.5v6" ${S}/>
    <path d="M6 9.5h12v2a6 6 0 0 1-12 0v-2Z" ${S}/>
    <path d="M12 17.5v3" ${S}/>
  `),
  brain: () => svg(`<path d="M9.5 3.5A3 3 0 0 0 6.6 7a3 3 0 0 0-1.6 5.3A3.2 3.2 0 0 0 7 18a3 3 0 0 0 5 1.8V3.9a3 3 0 0 0-2.5-.4ZM14.5 3.5A3 3 0 0 1 17.4 7a3 3 0 0 1 1.6 5.3A3.2 3.2 0 0 1 17 18a3 3 0 0 1-5 1.8" ${S}/>`),
  terminal: () => svg(`
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" ${S}/>
    <path d="M7 9.5l3 2.5-3 2.5" fill="none" stroke="${A}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.5 15h4.5" ${S}/>
  `),
  globe: () => svg(`
    <circle cx="12" cy="12" r="8.5" ${S}/>
    <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.4-3.3-8.5S9.8 5.9 12 3.5Z" ${S}/>
  `),
  wave: () => svg(`<path d="M4 12c1.5-3 3-3 4.5 0s3 3 4.5 0 3-3 4.5 0" ${S}/>`),
};

function icon(name) {
  const fn = ICONS[name];
  return fn ? fn() : '';
}

if (typeof module !== 'undefined') module.exports = { ICONS, icon };
