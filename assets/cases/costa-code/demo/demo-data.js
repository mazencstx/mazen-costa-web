/* Real API responses captured from the Costa Code Web server, frozen so the
   static demo renders exactly what the live build renders. Regenerate with
   .pdfgen/capture-fixtures.js while the server is running. */
window.COSTA_DEMO_DATA = {
  "/api/providers": {
    "claude-code": {
      "label": "Claude Code",
      "kind": "cli",
      "models": [
        {
          "id": "claude-code",
          "label": "Claude Code — local agent"
        }
      ],
      "ready": true,
      "envKey": null
    },
    "anthropic": {
      "label": "Anthropic",
      "kind": "api",
      "models": [
        {
          "id": "claude-sonnet-5",
          "label": "Claude Sonnet 5"
        },
        {
          "id": "claude-opus-5",
          "label": "Claude Opus 5"
        },
        {
          "id": "claude-haiku-4-5-20251001",
          "label": "Claude Haiku 4.5"
        }
      ],
      "ready": false,
      "envKey": "ANTHROPIC_API_KEY"
    },
    "gemini": {
      "label": "Google Gemini",
      "kind": "api",
      "models": [
        {
          "id": "gemini-2.5-pro",
          "label": "Gemini 2.5 Pro"
        },
        {
          "id": "gemini-2.5-flash",
          "label": "Gemini 2.5 Flash"
        }
      ],
      "ready": false,
      "envKey": "GEMINI_API_KEY"
    },
    "deepseek": {
      "label": "DeepSeek",
      "kind": "api",
      "models": [
        {
          "id": "deepseek-chat",
          "label": "DeepSeek Chat"
        },
        {
          "id": "deepseek-reasoner",
          "label": "DeepSeek Reasoner"
        }
      ],
      "ready": false,
      "envKey": "DEEPSEEK_API_KEY"
    }
  },
  "/api/settings": {
    "profile": {
      "fullName": "Mazen Costa",
      "nickname": "Costa",
      "role": "Design"
    },
    "instructions": "",
    "appearance": "light",
    "chatFont": "sans",
    "siteText": {},
    "siteAssets": {}
  },
  "/api/personas": [
    {
      "id": "design",
      "label": "Design",
      "agent": "Costa Designer",
      "tagline": "UI/UX & brand systems"
    },
    {
      "id": "motion",
      "label": "Motion",
      "agent": "Costa Motion",
      "tagline": "Animation & micro-interactions"
    },
    {
      "id": "code",
      "label": "Code",
      "agent": "Costa Frontend + Backend",
      "tagline": "Build it for real"
    },
    {
      "id": "ai",
      "label": "AI",
      "agent": "Costa AI",
      "tagline": "Agents, prompts & pipelines"
    },
    {
      "id": "cloud",
      "label": "Cloud",
      "agent": "Costa Cloud",
      "tagline": "Infra, deploy & data"
    }
  ],
  "/api/prompts": [
    {
      "id": 1,
      "title": "Brand identity brief",
      "body": "Act as a brand strategist. Given a business name, sector and audience, produce a positioning line, three tone-of-voice rules, and a colour direction with hex values.",
      "tags": "branding,strategy",
      "uses": 34,
      "created_at": "2026-07-14 10:22:00"
    },
    {
      "id": 2,
      "title": "Landing page section",
      "body": "Write a landing page hero: one headline under 9 words, one subline under 22 words, and two CTA labels. No exclamation marks.",
      "tags": "copywriting,web",
      "uses": 51,
      "created_at": "2026-07-22 16:05:00"
    },
    {
      "id": 3,
      "title": "Refactor to a component",
      "body": "Take the markup I paste and extract it into a reusable component. Keep the existing class names, add no dependencies, and explain the props in one line each.",
      "tags": "code,react",
      "uses": 27,
      "created_at": "2026-08-02 09:41:00"
    },
    {
      "id": 4,
      "title": "Reel script — 30s",
      "body": "Write a 30-second vertical video script: hook in the first 2 seconds, three beats, one on-screen caption per beat, and a closing CTA.",
      "tags": "video,social",
      "uses": 45,
      "created_at": "2026-08-11 13:58:00"
    },
    {
      "id": 5,
      "title": "SQL from a question",
      "body": "Given the schema I paste, translate my plain-language question into a single SQL query. Explain any join in one sentence.",
      "tags": "code,data",
      "uses": 19,
      "created_at": "2026-08-19 11:30:00"
    }
  ],
  "/api/skills": [],
  "/api/notes": [
    {
      "id": 1,
      "content": "DURHAM — client wants the product grid to stay two columns on mobile. Confirmed in the call.",
      "created_at": "2026-08-20 14:12:00"
    },
    {
      "id": 2,
      "content": "Reusable: the 40% markup formula has to live in one place, mirrored server-side and client-side, or the quote and the charge drift apart.",
      "created_at": "2026-08-24 10:03:00"
    },
    {
      "id": 3,
      "content": "Check the Cairo font fallback on Windows — the Arabic numerals render narrower than on macOS.",
      "created_at": "2026-08-28 18:47:00"
    }
  ],
  "/api/tasks": [
    {
      "id": 1,
      "title": "Export the FARIDA brand guide to PDF",
      "done": 1,
      "created_at": "2026-08-18 09:00:00"
    },
    {
      "id": 2,
      "title": "Compress case-study images over 200KB",
      "done": 1,
      "created_at": "2026-08-21 09:00:00"
    },
    {
      "id": 3,
      "title": "Wire the CSTA personalisation flow to the real endpoint",
      "done": 0,
      "created_at": "2026-08-26 09:00:00"
    },
    {
      "id": 4,
      "title": "Second pass on the pricing page copy",
      "done": 0,
      "created_at": "2026-08-29 09:00:00"
    }
  ],
  "/api/chats": [
    {
      "id": 1,
      "title": "Brand system for a coffee label",
      "created_at": "2026-08-27 12:14:00"
    },
    {
      "id": 2,
      "title": "Fix the RTL grid overflow",
      "created_at": "2026-08-29 15:36:00"
    },
    {
      "id": 3,
      "title": "Reel script — new drop",
      "created_at": "2026-08-31 11:02:00"
    }
  ],
  "/api/assets": {
    "files": []
  },
  "/api/stats?range=all": {
    "range": "all",
    "sessions": 214,
    "messages": 1846,
    "totalTokens": 4127500,
    "tokensEstimated": false,
    "activeDays": 121,
    "currentStreak": 6,
    "longestStreak": 19,
    "peakHour": 22,
    "favoriteModel": "claude-sonnet-5",
    "byModel": {
      "claude-sonnet-5": {
        "messages": 1071,
        "tokens": 2517775
      },
      "gemini-2.5-pro": {
        "messages": 443,
        "tokens": 908050
      },
      "deepseek-chat": {
        "messages": 332,
        "tokens": 701675
      }
    },
    "heatmap": [
      {
        "date": "2025-09-03",
        "count": 1
      },
      {
        "date": "2025-09-04",
        "count": 2
      },
      {
        "date": "2025-09-05",
        "count": 0
      },
      {
        "date": "2025-09-06",
        "count": 0
      },
      {
        "date": "2025-09-07",
        "count": 2
      },
      {
        "date": "2025-09-08",
        "count": 2
      },
      {
        "date": "2025-09-09",
        "count": 0
      },
      {
        "date": "2025-09-10",
        "count": 0
      },
      {
        "date": "2025-09-11",
        "count": 2
      },
      {
        "date": "2025-09-12",
        "count": 0
      },
      {
        "date": "2025-09-13",
        "count": 0
      },
      {
        "date": "2025-09-14",
        "count": 1
      },
      {
        "date": "2025-09-15",
        "count": 2
      },
      {
        "date": "2025-09-16",
        "count": 1
      },
      {
        "date": "2025-09-17",
        "count": 0
      },
      {
        "date": "2025-09-18",
        "count": 2
      },
      {
        "date": "2025-09-19",
        "count": 0
      },
      {
        "date": "2025-09-20",
        "count": 0
      },
      {
        "date": "2025-09-21",
        "count": 0
      },
      {
        "date": "2025-09-22",
        "count": 2
      },
      {
        "date": "2025-09-23",
        "count": 2
      },
      {
        "date": "2025-09-24",
        "count": 0
      },
      {
        "date": "2025-09-25",
        "count": 1
      },
      {
        "date": "2025-09-26",
        "count": 0
      },
      {
        "date": "2025-09-27",
        "count": 0
      },
      {
        "date": "2025-09-28",
        "count": 0
      },
      {
        "date": "2025-09-29",
        "count": 2
      },
      {
        "date": "2025-09-30",
        "count": 2
      },
      {
        "date": "2025-10-01",
        "count": 1
      },
      {
        "date": "2025-10-02",
        "count": 0
      },
      {
        "date": "2025-10-03",
        "count": 0
      },
      {
        "date": "2025-10-04",
        "count": 0
      },
      {
        "date": "2025-10-05",
        "count": 0
      },
      {
        "date": "2025-10-06",
        "count": 1
      },
      {
        "date": "2025-10-07",
        "count": 3
      },
      {
        "date": "2025-10-08",
        "count": 2
      },
      {
        "date": "2025-10-09",
        "count": 0
      },
      {
        "date": "2025-10-10",
        "count": 0
      },
      {
        "date": "2025-10-11",
        "count": 0
      },
      {
        "date": "2025-10-12",
        "count": 1
      },
      {
        "date": "2025-10-13",
        "count": 0
      },
      {
        "date": "2025-10-14",
        "count": 2
      },
      {
        "date": "2025-10-15",
        "count": 2
      },
      {
        "date": "2025-10-16",
        "count": 0
      },
      {
        "date": "2025-10-17",
        "count": 0
      },
      {
        "date": "2025-10-18",
        "count": 0
      },
      {
        "date": "2025-10-19",
        "count": 2
      },
      {
        "date": "2025-10-20",
        "count": 0
      },
      {
        "date": "2025-10-21",
        "count": 1
      },
      {
        "date": "2025-10-22",
        "count": 3
      },
      {
        "date": "2025-10-23",
        "count": 1
      },
      {
        "date": "2025-10-24",
        "count": 0
      },
      {
        "date": "2025-10-25",
        "count": 0
      },
      {
        "date": "2025-10-26",
        "count": 3
      },
      {
        "date": "2025-10-27",
        "count": 1
      },
      {
        "date": "2025-10-28",
        "count": 0
      },
      {
        "date": "2025-10-29",
        "count": 3
      },
      {
        "date": "2025-10-30",
        "count": 2
      },
      {
        "date": "2025-10-30",
        "count": 0
      },
      {
        "date": "2025-10-31",
        "count": 0
      },
      {
        "date": "2025-11-01",
        "count": 0
      },
      {
        "date": "2025-11-02",
        "count": 2
      },
      {
        "date": "2025-11-03",
        "count": 0
      },
      {
        "date": "2025-11-04",
        "count": 2
      },
      {
        "date": "2025-11-05",
        "count": 3
      },
      {
        "date": "2025-11-06",
        "count": 1
      },
      {
        "date": "2025-11-07",
        "count": 0
      },
      {
        "date": "2025-11-08",
        "count": 0
      },
      {
        "date": "2025-11-09",
        "count": 3
      },
      {
        "date": "2025-11-10",
        "count": 0
      },
      {
        "date": "2025-11-11",
        "count": 1
      },
      {
        "date": "2025-11-12",
        "count": 3
      },
      {
        "date": "2025-11-13",
        "count": 2
      },
      {
        "date": "2025-11-14",
        "count": 0
      },
      {
        "date": "2025-11-15",
        "count": 0
      },
      {
        "date": "2025-11-16",
        "count": 3
      },
      {
        "date": "2025-11-17",
        "count": 1
      },
      {
        "date": "2025-11-18",
        "count": 0
      },
      {
        "date": "2025-11-19",
        "count": 3
      },
      {
        "date": "2025-11-20",
        "count": 3
      },
      {
        "date": "2025-11-21",
        "count": 0
      },
      {
        "date": "2025-11-22",
        "count": 0
      },
      {
        "date": "2025-11-23",
        "count": 3
      },
      {
        "date": "2025-11-24",
        "count": 2
      },
      {
        "date": "2025-11-25",
        "count": 0
      },
      {
        "date": "2025-11-26",
        "count": 2
      },
      {
        "date": "2025-11-27",
        "count": 4
      },
      {
        "date": "2025-11-28",
        "count": 0
      },
      {
        "date": "2025-11-29",
        "count": 0
      },
      {
        "date": "2025-11-30",
        "count": 3
      },
      {
        "date": "2025-12-01",
        "count": 3
      },
      {
        "date": "2025-12-02",
        "count": 1
      },
      {
        "date": "2025-12-03",
        "count": 1
      },
      {
        "date": "2025-12-04",
        "count": 3
      },
      {
        "date": "2025-12-05",
        "count": 0
      },
      {
        "date": "2025-12-06",
        "count": 0
      },
      {
        "date": "2025-12-07",
        "count": 2
      },
      {
        "date": "2025-12-08",
        "count": 4
      },
      {
        "date": "2025-12-09",
        "count": 2
      },
      {
        "date": "2025-12-10",
        "count": 0
      },
      {
        "date": "2025-12-11",
        "count": 3
      },
      {
        "date": "2025-12-12",
        "count": 1
      },
      {
        "date": "2025-12-13",
        "count": 0
      },
      {
        "date": "2025-12-14",
        "count": 0
      },
      {
        "date": "2025-12-15",
        "count": 3
      },
      {
        "date": "2025-12-16",
        "count": 3
      },
      {
        "date": "2025-12-17",
        "count": 0
      },
      {
        "date": "2025-12-18",
        "count": 1
      },
      {
        "date": "2025-12-19",
        "count": 1
      },
      {
        "date": "2025-12-20",
        "count": 0
      },
      {
        "date": "2025-12-21",
        "count": 0
      },
      {
        "date": "2025-12-22",
        "count": 2
      },
      {
        "date": "2025-12-23",
        "count": 4
      },
      {
        "date": "2025-12-24",
        "count": 1
      },
      {
        "date": "2025-12-25",
        "count": 0
      },
      {
        "date": "2025-12-26",
        "count": 0
      },
      {
        "date": "2025-12-27",
        "count": 0
      },
      {
        "date": "2025-12-28",
        "count": 0
      },
      {
        "date": "2025-12-29",
        "count": 1
      },
      {
        "date": "2025-12-30",
        "count": 4
      },
      {
        "date": "2025-12-31",
        "count": 2
      },
      {
        "date": "2026-01-01",
        "count": 0
      },
      {
        "date": "2026-01-02",
        "count": 0
      },
      {
        "date": "2026-01-03",
        "count": 1
      },
      {
        "date": "2026-01-04",
        "count": 1
      },
      {
        "date": "2026-01-05",
        "count": 0
      },
      {
        "date": "2026-01-06",
        "count": 3
      },
      {
        "date": "2026-01-07",
        "count": 4
      },
      {
        "date": "2026-01-08",
        "count": 1
      },
      {
        "date": "2026-01-09",
        "count": 0
      },
      {
        "date": "2026-01-10",
        "count": 1
      },
      {
        "date": "2026-01-11",
        "count": 3
      },
      {
        "date": "2026-01-12",
        "count": 0
      },
      {
        "date": "2026-01-13",
        "count": 2
      },
      {
        "date": "2026-01-14",
        "count": 4
      },
      {
        "date": "2026-01-15",
        "count": 2
      },
      {
        "date": "2026-01-16",
        "count": 0
      },
      {
        "date": "2026-01-17",
        "count": 0
      },
      {
        "date": "2026-01-18",
        "count": 4
      },
      {
        "date": "2026-01-19",
        "count": 1
      },
      {
        "date": "2026-01-20",
        "count": 1
      },
      {
        "date": "2026-01-21",
        "count": 4
      },
      {
        "date": "2026-01-22",
        "count": 3
      },
      {
        "date": "2026-01-23",
        "count": 0
      },
      {
        "date": "2026-01-24",
        "count": 0
      },
      {
        "date": "2026-01-25",
        "count": 4
      },
      {
        "date": "2026-01-26",
        "count": 2
      },
      {
        "date": "2026-01-27",
        "count": 0
      },
      {
        "date": "2026-01-28",
        "count": 3
      },
      {
        "date": "2026-01-29",
        "count": 4
      },
      {
        "date": "2026-01-30",
        "count": 0
      },
      {
        "date": "2026-01-31",
        "count": 0
      },
      {
        "date": "2026-02-01",
        "count": 4
      },
      {
        "date": "2026-02-02",
        "count": 4
      },
      {
        "date": "2026-02-03",
        "count": 0
      },
      {
        "date": "2026-02-04",
        "count": 1
      },
      {
        "date": "2026-02-05",
        "count": 5
      },
      {
        "date": "2026-02-06",
        "count": 0
      },
      {
        "date": "2026-02-07",
        "count": 0
      },
      {
        "date": "2026-02-08",
        "count": 3
      },
      {
        "date": "2026-02-09",
        "count": 5
      },
      {
        "date": "2026-02-10",
        "count": 1
      },
      {
        "date": "2026-02-11",
        "count": 0
      },
      {
        "date": "2026-02-12",
        "count": 4
      },
      {
        "date": "2026-02-13",
        "count": 1
      },
      {
        "date": "2026-02-14",
        "count": 0
      },
      {
        "date": "2026-02-15",
        "count": 1
      },
      {
        "date": "2026-02-16",
        "count": 5
      },
      {
        "date": "2026-02-17",
        "count": 3
      },
      {
        "date": "2026-02-18",
        "count": 0
      },
      {
        "date": "2026-02-19",
        "count": 2
      },
      {
        "date": "2026-02-20",
        "count": 2
      },
      {
        "date": "2026-02-21",
        "count": 0
      },
      {
        "date": "2026-02-22",
        "count": 0
      },
      {
        "date": "2026-02-23",
        "count": 4
      },
      {
        "date": "2026-02-24",
        "count": 5
      },
      {
        "date": "2026-02-25",
        "count": 1
      },
      {
        "date": "2026-02-26",
        "count": 1
      },
      {
        "date": "2026-02-27",
        "count": 2
      },
      {
        "date": "2026-02-28",
        "count": 1
      },
      {
        "date": "2026-03-01",
        "count": 0
      },
      {
        "date": "2026-03-02",
        "count": 2
      },
      {
        "date": "2026-03-03",
        "count": 5
      },
      {
        "date": "2026-03-04",
        "count": 2
      },
      {
        "date": "2026-03-05",
        "count": 0
      },
      {
        "date": "2026-03-06",
        "count": 0
      },
      {
        "date": "2026-03-07",
        "count": 2
      },
      {
        "date": "2026-03-08",
        "count": 1
      },
      {
        "date": "2026-03-09",
        "count": 1
      },
      {
        "date": "2026-03-10",
        "count": 5
      },
      {
        "date": "2026-03-11",
        "count": 4
      },
      {
        "date": "2026-03-12",
        "count": 0
      },
      {
        "date": "2026-03-13",
        "count": 0
      },
      {
        "date": "2026-03-14",
        "count": 2
      },
      {
        "date": "2026-03-15",
        "count": 3
      },
      {
        "date": "2026-03-16",
        "count": 0
      },
      {
        "date": "2026-03-17",
        "count": 3
      },
      {
        "date": "2026-03-18",
        "count": 5
      },
      {
        "date": "2026-03-19",
        "count": 2
      },
      {
        "date": "2026-03-20",
        "count": 0
      },
      {
        "date": "2026-03-21",
        "count": 1
      },
      {
        "date": "2026-03-22",
        "count": 5
      },
      {
        "date": "2026-03-23",
        "count": 0
      },
      {
        "date": "2026-03-24",
        "count": 1
      },
      {
        "date": "2026-03-25",
        "count": 5
      },
      {
        "date": "2026-03-26",
        "count": 3
      },
      {
        "date": "2026-03-27",
        "count": 0
      },
      {
        "date": "2026-03-28",
        "count": 0
      },
      {
        "date": "2026-03-29",
        "count": 5
      },
      {
        "date": "2026-03-30",
        "count": 2
      },
      {
        "date": "2026-03-31",
        "count": 0
      },
      {
        "date": "2026-04-01",
        "count": 4
      },
      {
        "date": "2026-04-02",
        "count": 5
      },
      {
        "date": "2026-04-03",
        "count": 0
      },
      {
        "date": "2026-04-04",
        "count": 0
      },
      {
        "date": "2026-04-05",
        "count": 5
      },
      {
        "date": "2026-04-06",
        "count": 4
      },
      {
        "date": "2026-04-07",
        "count": 0
      },
      {
        "date": "2026-04-08",
        "count": 3
      },
      {
        "date": "2026-04-09",
        "count": 6
      },
      {
        "date": "2026-04-10",
        "count": 0
      },
      {
        "date": "2026-04-11",
        "count": 0
      },
      {
        "date": "2026-04-12",
        "count": 4
      },
      {
        "date": "2026-04-13",
        "count": 5
      },
      {
        "date": "2026-04-14",
        "count": 1
      },
      {
        "date": "2026-04-15",
        "count": 1
      },
      {
        "date": "2026-04-16",
        "count": 5
      },
      {
        "date": "2026-04-17",
        "count": 1
      },
      {
        "date": "2026-04-18",
        "count": 0
      },
      {
        "date": "2026-04-19",
        "count": 2
      },
      {
        "date": "2026-04-20",
        "count": 6
      },
      {
        "date": "2026-04-21",
        "count": 3
      },
      {
        "date": "2026-04-22",
        "count": 0
      },
      {
        "date": "2026-04-23",
        "count": 4
      },
      {
        "date": "2026-04-25",
        "count": 3
      },
      {
        "date": "2026-04-26",
        "count": 2
      },
      {
        "date": "2026-04-27",
        "count": 1
      },
      {
        "date": "2026-04-28",
        "count": 5
      },
      {
        "date": "2026-04-29",
        "count": 5
      },
      {
        "date": "2026-04-30",
        "count": 0
      },
      {
        "date": "2026-05-01",
        "count": 0
      },
      {
        "date": "2026-05-02",
        "count": 3
      },
      {
        "date": "2026-05-03",
        "count": 4
      },
      {
        "date": "2026-05-04",
        "count": 0
      },
      {
        "date": "2026-05-05",
        "count": 3
      },
      {
        "date": "2026-05-06",
        "count": 6
      },
      {
        "date": "2026-05-07",
        "count": 2
      },
      {
        "date": "2026-05-08",
        "count": 0
      },
      {
        "date": "2026-05-09",
        "count": 2
      },
      {
        "date": "2026-05-10",
        "count": 5
      },
      {
        "date": "2026-05-11",
        "count": 1
      },
      {
        "date": "2026-05-12",
        "count": 1
      },
      {
        "date": "2026-05-13",
        "count": 6
      },
      {
        "date": "2026-05-14",
        "count": 4
      },
      {
        "date": "2026-05-15",
        "count": 0
      },
      {
        "date": "2026-05-16",
        "count": 0
      },
      {
        "date": "2026-05-17",
        "count": 6
      },
      {
        "date": "2026-05-18",
        "count": 2
      },
      {
        "date": "2026-05-19",
        "count": 0
      },
      {
        "date": "2026-05-20",
        "count": 5
      },
      {
        "date": "2026-05-21",
        "count": 6
      },
      {
        "date": "2026-05-22",
        "count": 0
      },
      {
        "date": "2026-05-23",
        "count": 0
      },
      {
        "date": "2026-05-24",
        "count": 6
      },
      {
        "date": "2026-05-25",
        "count": 5
      },
      {
        "date": "2026-05-26",
        "count": 0
      },
      {
        "date": "2026-05-27",
        "count": 3
      },
      {
        "date": "2026-05-28",
        "count": 7
      },
      {
        "date": "2026-05-29",
        "count": 0
      },
      {
        "date": "2026-05-30",
        "count": 0
      },
      {
        "date": "2026-05-31",
        "count": 4
      },
      {
        "date": "2026-06-01",
        "count": 6
      },
      {
        "date": "2026-06-02",
        "count": 1
      },
      {
        "date": "2026-06-03",
        "count": 1
      },
      {
        "date": "2026-06-04",
        "count": 6
      },
      {
        "date": "2026-06-05",
        "count": 2
      },
      {
        "date": "2026-06-06",
        "count": 0
      },
      {
        "date": "2026-06-07",
        "count": 2
      },
      {
        "date": "2026-06-08",
        "count": 7
      },
      {
        "date": "2026-06-09",
        "count": 4
      },
      {
        "date": "2026-06-10",
        "count": 0
      },
      {
        "date": "2026-06-11",
        "count": 4
      },
      {
        "date": "2026-06-12",
        "count": 4
      },
      {
        "date": "2026-06-13",
        "count": 0
      },
      {
        "date": "2026-06-14",
        "count": 1
      },
      {
        "date": "2026-06-15",
        "count": 6
      },
      {
        "date": "2026-06-16",
        "count": 6
      },
      {
        "date": "2026-06-17",
        "count": 1
      },
      {
        "date": "2026-06-18",
        "count": 2
      },
      {
        "date": "2026-06-19",
        "count": 4
      },
      {
        "date": "2026-06-20",
        "count": 1
      },
      {
        "date": "2026-06-21",
        "count": 0
      },
      {
        "date": "2026-06-22",
        "count": 4
      },
      {
        "date": "2026-06-23",
        "count": 7
      },
      {
        "date": "2026-06-24",
        "count": 2
      },
      {
        "date": "2026-06-25",
        "count": 0
      },
      {
        "date": "2026-06-26",
        "count": 2
      },
      {
        "date": "2026-06-27",
        "count": 3
      },
      {
        "date": "2026-06-28",
        "count": 1
      },
      {
        "date": "2026-06-29",
        "count": 1
      },
      {
        "date": "2026-06-30",
        "count": 7
      },
      {
        "date": "2026-07-01",
        "count": 5
      },
      {
        "date": "2026-07-02",
        "count": 0
      },
      {
        "date": "2026-07-03",
        "count": 0
      },
      {
        "date": "2026-07-04",
        "count": 4
      },
      {
        "date": "2026-07-05",
        "count": 3
      },
      {
        "date": "2026-07-06",
        "count": 0
      },
      {
        "date": "2026-07-07",
        "count": 5
      },
      {
        "date": "2026-07-08",
        "count": 7
      },
      {
        "date": "2026-07-09",
        "count": 1
      },
      {
        "date": "2026-07-10",
        "count": 0
      },
      {
        "date": "2026-07-11",
        "count": 3
      },
      {
        "date": "2026-07-12",
        "count": 5
      },
      {
        "date": "2026-07-13",
        "count": 0
      },
      {
        "date": "2026-07-14",
        "count": 3
      },
      {
        "date": "2026-07-15",
        "count": 7
      },
      {
        "date": "2026-07-16",
        "count": 4
      },
      {
        "date": "2026-07-17",
        "count": 0
      },
      {
        "date": "2026-07-18",
        "count": 2
      },
      {
        "date": "2026-07-19",
        "count": 7
      },
      {
        "date": "2026-07-20",
        "count": 2
      },
      {
        "date": "2026-07-21",
        "count": 1
      },
      {
        "date": "2026-07-22",
        "count": 6
      },
      {
        "date": "2026-07-23",
        "count": 6
      },
      {
        "date": "2026-07-24",
        "count": 0
      },
      {
        "date": "2026-07-25",
        "count": 0
      },
      {
        "date": "2026-07-26",
        "count": 7
      },
      {
        "date": "2026-07-27",
        "count": 4
      },
      {
        "date": "2026-07-28",
        "count": 0
      },
      {
        "date": "2026-07-29",
        "count": 4
      },
      {
        "date": "2026-07-30",
        "count": 7
      },
      {
        "date": "2026-07-31",
        "count": 0
      },
      {
        "date": "2026-08-01",
        "count": 0
      },
      {
        "date": "2026-08-02",
        "count": 6
      },
      {
        "date": "2026-08-03",
        "count": 7
      },
      {
        "date": "2026-08-04",
        "count": 1
      },
      {
        "date": "2026-08-05",
        "count": 2
      },
      {
        "date": "2026-08-06",
        "count": 7
      },
      {
        "date": "2026-08-07",
        "count": 2
      },
      {
        "date": "2026-08-08",
        "count": 0
      },
      {
        "date": "2026-08-09",
        "count": 4
      },
      {
        "date": "2026-08-10",
        "count": 8
      },
      {
        "date": "2026-08-11",
        "count": 3
      },
      {
        "date": "2026-08-12",
        "count": 0
      },
      {
        "date": "2026-08-13",
        "count": 6
      },
      {
        "date": "2026-08-14",
        "count": 4
      },
      {
        "date": "2026-08-15",
        "count": 0
      },
      {
        "date": "2026-08-16",
        "count": 1
      },
      {
        "date": "2026-08-17",
        "count": 7
      },
      {
        "date": "2026-08-18",
        "count": 6
      },
      {
        "date": "2026-08-19",
        "count": 0
      },
      {
        "date": "2026-08-20",
        "count": 3
      },
      {
        "date": "2026-08-21",
        "count": 5
      },
      {
        "date": "2026-08-22",
        "count": 1
      },
      {
        "date": "2026-08-23",
        "count": 0
      },
      {
        "date": "2026-08-24",
        "count": 5
      },
      {
        "date": "2026-08-25",
        "count": 8
      },
      {
        "date": "2026-08-26",
        "count": 2
      },
      {
        "date": "2026-08-27",
        "count": 1
      },
      {
        "date": "2026-08-28",
        "count": 4
      },
      {
        "date": "2026-08-29",
        "count": 3
      },
      {
        "date": "2026-08-30",
        "count": 0
      },
      {
        "date": "2026-08-31",
        "count": 3
      },
      {
        "date": "2026-09-01",
        "count": 8
      }
    ],
    "maxCount": 0,
    "comparison": "You've used ~3,347,500 more tokens than War and Peace."
  },
  "/api/stats?range=7d": {
    "range": "7d",
    "sessions": 12,
    "messages": 96,
    "totalTokens": 214800,
    "tokensEstimated": false,
    "activeDays": 6,
    "currentStreak": 6,
    "longestStreak": 6,
    "peakHour": 22,
    "favoriteModel": "claude-sonnet-5",
    "byModel": {
      "claude-sonnet-5": {
        "messages": 56,
        "tokens": 131028
      },
      "gemini-2.5-pro": {
        "messages": 23,
        "tokens": 47256
      },
      "deepseek-chat": {
        "messages": 17,
        "tokens": 36516
      }
    },
    "heatmap": [
      {
        "date": "2026-08-26",
        "count": 1
      },
      {
        "date": "2026-08-27",
        "count": 3
      },
      {
        "date": "2026-08-28",
        "count": 0
      },
      {
        "date": "2026-08-29",
        "count": 0
      },
      {
        "date": "2026-08-30",
        "count": 5
      },
      {
        "date": "2026-08-31",
        "count": 6
      },
      {
        "date": "2026-09-01",
        "count": 1
      }
    ],
    "maxCount": 0,
    "comparison": "You've used ~87,800 more tokens than The Hobbit."
  },
  "/api/stats?range=30d": {
    "range": "30d",
    "sessions": 47,
    "messages": 402,
    "totalTokens": 913200,
    "tokensEstimated": false,
    "activeDays": 24,
    "currentStreak": 6,
    "longestStreak": 11,
    "peakHour": 22,
    "favoriteModel": "claude-sonnet-5",
    "byModel": {
      "claude-sonnet-5": {
        "messages": 233,
        "tokens": 557052
      },
      "gemini-2.5-pro": {
        "messages": 96,
        "tokens": 200904
      },
      "deepseek-chat": {
        "messages": 72,
        "tokens": 155244
      }
    },
    "heatmap": [
      {
        "date": "2026-08-03",
        "count": 1
      },
      {
        "date": "2026-08-04",
        "count": 2
      },
      {
        "date": "2026-08-05",
        "count": 1
      },
      {
        "date": "2026-08-06",
        "count": 0
      },
      {
        "date": "2026-08-07",
        "count": 0
      },
      {
        "date": "2026-08-08",
        "count": 0
      },
      {
        "date": "2026-08-09",
        "count": 1
      },
      {
        "date": "2026-08-10",
        "count": 1
      },
      {
        "date": "2026-08-11",
        "count": 3
      },
      {
        "date": "2026-08-12",
        "count": 3
      },
      {
        "date": "2026-08-13",
        "count": 0
      },
      {
        "date": "2026-08-14",
        "count": 0
      },
      {
        "date": "2026-08-15",
        "count": 2
      },
      {
        "date": "2026-08-16",
        "count": 2
      },
      {
        "date": "2026-08-17",
        "count": 0
      },
      {
        "date": "2026-08-18",
        "count": 4
      },
      {
        "date": "2026-08-19",
        "count": 5
      },
      {
        "date": "2026-08-20",
        "count": 1
      },
      {
        "date": "2026-08-21",
        "count": 0
      },
      {
        "date": "2026-08-22",
        "count": 2
      },
      {
        "date": "2026-08-23",
        "count": 5
      },
      {
        "date": "2026-08-24",
        "count": 0
      },
      {
        "date": "2026-08-25",
        "count": 2
      },
      {
        "date": "2026-08-26",
        "count": 7
      },
      {
        "date": "2026-08-27",
        "count": 4
      },
      {
        "date": "2026-08-28",
        "count": 0
      },
      {
        "date": "2026-08-29",
        "count": 2
      },
      {
        "date": "2026-08-30",
        "count": 7
      },
      {
        "date": "2026-08-31",
        "count": 2
      },
      {
        "date": "2026-09-01",
        "count": 1
      }
    ],
    "maxCount": 0,
    "comparison": "You've used ~133,200 more tokens than War and Peace."
  },
  "/api/chats/1/messages": [
    {
      "id": 1,
      "role": "user",
      "content": "I need a brand system for a small-batch coffee label. Warm, not rustic."
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "Warm without rustic means dropping kraft-paper cues and leaning on temperature instead.\n\nPalette: a deep roast brown as the anchor, a burnt amber for accent, and a soft bone white for space. Skip beige — it is what makes these labels read rustic.\n\nType: a high-contrast serif for the name, a clean grotesque for the origin and roast details. The contrast is what signals small-batch rather than folksy."
    }
  ],
  "/api/chats/2/messages": [
    {
      "id": 1,
      "role": "user",
      "content": "My grid overflows horizontally in Arabic but not in English."
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "That is almost always a hard-coded direction somewhere in the track sizing.\n\nCheck for `margin-left` / `padding-left` that should be `margin-inline-start` / `padding-inline-start`, and any `grid-auto-flow: column` paired with a fixed `left` offset. In RTL the offset flips but the fixed value does not, so the last column pushes past the container."
    }
  ],
  "/api/chats/3/messages": [
    {
      "id": 1,
      "role": "user",
      "content": "Write a 30 second reel script for a streetwear drop."
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "Hook (0-2s): the piece on a hanger, one hard light, no logo yet.\n\nBeat 1 (2-10s): hands lifting it — caption \"made in 60 pieces\".\nBeat 2 (10-20s): worn, walking, shot from behind — caption \"not restocking\".\nBeat 3 (20-27s): the tag, close, in focus — caption \"Friday, 8pm\".\n\nClose (27-30s): black frame, logo, drop time."
    }
  ]
};
