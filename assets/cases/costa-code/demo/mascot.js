'use strict';

/* ---------- Costa Code mascot ---------- */
/* All 10 expressions are generated from one shared body bitmap, so the
   silhouette is identical across every state by construction — only the eye
   row and an optional accessory layer change. That's what keeps the mascot
   recognizable as the same character whether it's idle, thinking, or asleep.

   The canonical brand mark stays public/assets/logo.png (favicon + the
   sidebar wordmark lockup); this generated version is what animates. */

const W = 14;
const H = 11;
const LOGO_SRC = './assets/logo.png';

// Body silhouette: rounded top, block torso, four legs. Eyes are punched
// out of rows 3-4 by the expression layer, not here.
function bodyFilled(r, c) {
  if (r <= 2) {
    const span = [[3, 10], [2, 11], [1, 12]][r];
    return c >= span[0] && c <= span[1];
  }
  if (r >= 3 && r <= 7) return true;
  if (r === 8 || r === 9) return [1, 2, 4, 5, 8, 9, 11, 12].includes(c);
  return false;
}

const EYE_COLS = { left: [3, 4], right: [9, 10] };

// Each expression decides, for the two eye rows, which cells are cut out of
// the body (the "whites" of the eyes).
const EYES = {
  // Two open square eyes.
  open: (r, c) => inEye(r, c, [3, 4]),
  // Squinting/closed — a single flat line on the lower eye row.
  closed: (r, c) => inEye(r, c, [4]),
  // Happy arc: outer cells on the top row only.
  happy: (r, c) => {
    if (r !== 3) return false;
    return c === 3 || c === 10;
  },
  // Left open, right shut.
  wink: (r, c) => {
    const left = c >= EYE_COLS.left[0] && c <= EYE_COLS.left[1];
    const right = c >= EYE_COLS.right[0] && c <= EYE_COLS.right[1];
    if (left) return r === 3 || r === 4;
    if (right) return r === 4;
    return false;
  },
  // Narrow "looking at the code" eyes — inner column only.
  focused: (r, c) => {
    if (r !== 3 && r !== 4) return false;
    return c === 4 || c === 9;
  },
};

function inEye(r, c, rows) {
  if (!rows.includes(r)) return false;
  const left = c >= EYE_COLS.left[0] && c <= EYE_COLS.left[1];
  const right = c >= EYE_COLS.right[0] && c <= EYE_COLS.right[1];
  return left || right;
}

// state -> { eyes, accessory }
const EXPRESSIONS = {
  idle: { eyes: 'open' },
  coding: { eyes: 'focused', accessory: 'code' },
  thinking: { eyes: 'open', accessory: 'dots' },
  success: { eyes: 'happy' },
  loading: { eyes: 'open', accessory: 'spinner' },
  error: { eyes: 'open', accessory: 'alert' },
  sleeping: { eyes: 'closed', accessory: 'zzz' },
  excited: { eyes: 'open', accessory: 'sparkles' },
  love: { eyes: 'hearts' },
  wink: { eyes: 'wink' },
};

function accessorySVG(kind) {
  switch (kind) {
    case 'code':
      return `<g class="mascot-acc mascot-acc--code"><rect x="0.5" y="6.5" width="4.5" height="4" rx="0.5" fill="var(--mascot-acc-bg,#111)"/><path d="M2.2 8l-.9.9.9.9M3.6 8l.9.9-.9.9" stroke="currentColor" stroke-width=".45" fill="none" stroke-linecap="round"/></g>`;
    case 'dots':
      return `<g class="mascot-acc mascot-acc--dots" fill="currentColor"><circle cx="15.4" cy="2.6" r=".55"/><circle cx="16.9" cy="1.7" r=".75"/><circle cx="18.7" cy=".6" r="1"/></g>`;
    case 'spinner':
      return `<g class="mascot-acc mascot-acc--spinner"><circle cx="15.6" cy="9.2" r="1.7" fill="none" stroke="currentColor" stroke-width=".6" stroke-linecap="round" stroke-dasharray="2.2 1.6"/></g>`;
    case 'alert':
      return `<g class="mascot-acc mascot-acc--alert" fill="currentColor"><rect x="15" y="1" width="1.3" height="3.6" rx=".5"/><rect x="15" y="5.4" width="1.3" height="1.3" rx=".5"/></g>`;
    case 'zzz':
      return `<g class="mascot-acc mascot-acc--zzz" fill="currentColor" font-family="ui-monospace,monospace" font-weight="700"><text x="13.6" y="3.2" font-size="2.4">z</text><text x="15.4" y="1.9" font-size="1.9">z</text><text x="16.9" y="0.9" font-size="1.5">z</text></g>`;
    case 'sparkles':
      return `<g class="mascot-acc mascot-acc--sparkles" fill="currentColor"><path d="M1.4 1.6l.35 1 1 .35-1 .35-.35 1-.35-1-1-.35 1-.35.35-1Z"/><path d="M13.2 1.1l.3.85.85.3-.85.3-.3.85-.3-.85-.85-.3.85-.3.3-.85Z"/><path d="M15.1 5.6l.25.7.7.25-.7.25-.25.7-.25-.7-.7-.25.7-.25.25-.7Z"/></g>`;
    default:
      return '';
  }
}

function mascotSVG(state = 'idle') {
  const expr = EXPRESSIONS[state] || EXPRESSIONS.idle;

  // "love" replaces the eye squares with heart shapes rather than cutting
  // cells out, so it's drawn as an overlay on top of a solid body.
  const eyeFn = expr.eyes === 'hearts' ? null : EYES[expr.eyes] || EYES.open;

  let rects = '';
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (!bodyFilled(r, c)) continue;
      if (eyeFn && eyeFn(r, c)) continue; // punched out for the eyes
      rects += `<rect x="${c}" y="${r}" width="1" height="1"/>`;
    }
  }

  const hearts =
    expr.eyes === 'hearts'
      ? `<g fill="var(--mascot-eye,#fff)"><path d="M3.15 3.35a.55.55 0 0 1 .85-.3.55.55 0 0 1 .85.3c0 .5-.85 1.05-.85 1.05s-.85-.55-.85-1.05Z"/><path d="M9.15 3.35a.55.55 0 0 1 .85-.3.55.55 0 0 1 .85.3c0 .5-.85 1.05-.85 1.05s-.85-.55-.85-1.05Z"/></g>`
      : '';

  const acc = expr.accessory ? accessorySVG(expr.accessory) : '';
  // Viewbox is widened past the 14-col grid so accessories (zzz, sparkles,
  // spinner) have room without shifting the body's position.
  return `<svg viewBox="-1 -1 22 13" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="mascot-svg mascot-svg--${state}">${rects}${hearts}${acc}</svg>`;
}

/* ---------- Logo icon framings (rounded / squircle / circle / bare) ---------- */
function logoIcon(variant = 'rounded') {
  const cls = `logo-icon logo-icon--${variant}`;
  return `<span class="${cls}"><img src="${LOGO_SRC}" alt="Costa Code" draggable="false" /></span>`;
}

function logoImg() {
  return `<img src="${LOGO_SRC}" alt="Costa Code" draggable="false" />`;
}

const MASCOT_STATES = Object.keys(EXPRESSIONS);

if (typeof module !== 'undefined') {
  module.exports = { mascotSVG, logoIcon, logoImg, MASCOT_STATES, LOGO_SRC };
}
