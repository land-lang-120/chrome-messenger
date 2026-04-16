/* Chrome Messenger — Config & Theme Tokens
 * Chameleon identity: the app changes color dynamically via theme palette.
 * 8 light themes + 1 dark mode. The active theme updates CSS vars at runtime.
 */

/* === Theme definitions ===
 * Each theme ships a primary + primarySoft + text on primary.
 * Surface/background stays white (light) or near-black (dark mode).
 * The primary drives: logo, selected nav item, active bubble, FAB, accents.
 */
/* 8 theme colors matching the user's designs (screens 34-43).
 * Order matches the palette layout: Mint, Blue, Orange, Coral, Purple (vif), Lilac (doux), Yellow, Charcoal.
 * Dark mode is a separate toggle (can combine with any accent — but for v1 it uses Mint accent). */
const CM_THEMES = {
  mint: {
    id: "mint",      name: "Menthe",       emoji: "🌿",
    primary: "#30D79C", primaryDark: "#1EB380", primarySoft: "#C2F2E0",
    primaryFaint: "#E8FAF2", onPrimary: "#FFFFFF",
  },
  blue: {
    id: "blue",      name: "Azur",         emoji: "💧",
    primary: "#4F80FF", primaryDark: "#3B66D9", primarySoft: "#C8D9FF",
    primaryFaint: "#EAF0FF", onPrimary: "#FFFFFF",
  },
  orange: {
    id: "orange",    name: "Ambre",        emoji: "🔥",
    primary: "#FF8A4C", primaryDark: "#E06A2C", primarySoft: "#FFD4BB",
    primaryFaint: "#FFEEE2", onPrimary: "#FFFFFF",
  },
  coral: {
    id: "coral",     name: "Corail",       emoji: "🌸",
    primary: "#FF4F7A", primaryDark: "#DC3564", primarySoft: "#FFC6D3",
    primaryFaint: "#FFE7EE", onPrimary: "#FFFFFF",
  },
  purple: { /* Vivid purple — screen 37/30 */
    id: "purple",    name: "Violet",       emoji: "💜",
    primary: "#A855F7", primaryDark: "#8033D1", primarySoft: "#E1C8FB",
    primaryFaint: "#F3E8FF", onPrimary: "#FFFFFF",
  },
  lilac: { /* Soft lilac — screen 38/31 */
    id: "lilac",     name: "Lilas",        emoji: "💐",
    primary: "#C895E8", primaryDark: "#A974CB", primarySoft: "#EAD4F5",
    primaryFaint: "#F7EEFC", onPrimary: "#FFFFFF",
  },
  yellow: {
    id: "yellow",    name: "Tournesol",    emoji: "☀️",
    primary: "#FFC940", primaryDark: "#D9A820", primarySoft: "#FFE8A0",
    primaryFaint: "#FFF8E0", onPrimary: "#3A2E00",
  },
  charcoal: {
    id: "charcoal",  name: "Charbon",      emoji: "⚫",
    primary: "#2B2D33", primaryDark: "#14161A", primarySoft: "#BEC3CC",
    primaryFaint: "#EEEFF2", onPrimary: "#FFFFFF",
  },
  /* Dark mode — flips surfaces. Uses mint accent by default. */
  dark: {
    id: "dark",      name: "Nuit",         emoji: "🌙",
    primary: "#30D79C", primaryDark: "#1EB380", primarySoft: "#1F3A30",
    primaryFaint: "#142420", onPrimary: "#FFFFFF",
    darkMode: true,
  },
};

/* Surface tokens for light/dark */
const CM_SURFACES = {
  light: {
    bg:          "#FFFFFF",
    bg2:         "#F6F7FA",
    surface:     "#FFFFFF",
    surface2:    "#F1F3F6",
    surface3:    "#E8EBEF",
    line:        "#E5E8EC",
    line2:       "#CFD4DA",
    muted:       "#9AA3AE",
    sub:         "#5F6773",
    body:        "#2A2F38",
    title:       "#11141A",
    white:       "#FFFFFF",
  },
  dark: {
    bg:          "#0B0D10",
    bg2:         "#111418",
    surface:     "#151A1F",
    surface2:    "#1A2028",
    surface3:    "#222A33",
    line:        "#2A323C",
    line2:       "#3A4350",
    muted:       "#6B7683",
    sub:         "#9AA3AE",
    body:        "#D6DCE3",
    title:       "#F1F4F8",
    white:       "#FFFFFF",
  },
};

/* Active theme helpers — CM._ is the live merged object */
var CM = {};
function cmApplyTheme(themeId) {
  var t = CM_THEMES[themeId] || CM_THEMES.mint;
  var s = t.darkMode ? CM_SURFACES.dark : CM_SURFACES.light;
  /* Merge into live CM object (mutated in place so all existing refs update) */
  Object.keys(s).forEach(function(k){ CM[k] = s[k]; });
  ["primary","primaryDark","primarySoft","primaryFaint","onPrimary"].forEach(function(k){
    CM[k] = t[k];
  });
  CM.themeId = t.id;
  CM.themeName = t.name;
  CM.darkMode = !!t.darkMode;
  /* Shadows adapt to dark mode */
  CM.shadow     = t.darkMode ? "0 1px 3px rgba(0,0,0,0.4)"  : "0 1px 3px rgba(15,26,36,0.06)";
  CM.shadowMd   = t.darkMode ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(15,26,36,0.08)";
  CM.shadowLg   = t.darkMode ? "0 8px 24px rgba(0,0,0,0.6)" : "0 8px 24px rgba(15,26,36,0.12)";
  CM.shadowGlow = "0 6px 18px " + hexToRgba(t.primary, 0.35);
  /* Persist */
  try { localStorage.setItem(CM_KEYS.theme, themeId); } catch (e) {}
  /* Update meta theme-color for PWA status bar */
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t.primary);
  /* Update body bg for consistency with inertia scrolling */
  document.body && (document.body.style.background = CM.bg);
}

function hexToRgba(hex, alpha) {
  hex = String(hex || "").replace("#","");
  if (hex.length === 3) hex = hex.split("").map(function(c){ return c+c; }).join("");
  var r = parseInt(hex.substring(0,2), 16) || 0;
  var g = parseInt(hex.substring(2,4), 16) || 0;
  var b = parseInt(hex.substring(4,6), 16) || 0;
  return "rgba(" + r + "," + g + "," + b + "," + (alpha == null ? 1 : alpha) + ")";
}

/* App identity */
const CM_APP_NAME    = "Chrome Messenger";
const CM_APP_SHORT   = "Chrome";
const CM_VERSION     = "1.0.0";

/* Locale map */
const CM_LOCALES = {fr:"fr-FR",en:"en-US",es:"es-ES",pt:"pt-BR",de:"de-DE",it:"it-IT",nl:"nl-NL",tr:"tr-TR",ru:"ru-RU",ar:"ar-SA",zh:"zh-CN",ja:"ja-JP",ko:"ko-KR",hi:"hi-IN",sw:"sw-KE",pl:"pl-PL"};
const cmLocale = () => CM_LOCALES[_cmLang] || "fr-FR";

/* Utils */
const cmFmtDate = (d) => new Date(d).toLocaleDateString(cmLocale(), { day: "numeric", month: "short" });
const cmFmtTime = (d) => new Date(d).toLocaleTimeString(cmLocale(), { hour: "2-digit", minute: "2-digit" });
const cmFmtDayLabel = (d) => {
  var dt = new Date(d);
  var today = new Date(); today.setHours(0,0,0,0);
  var diff = Math.floor((today - dt) / 86400000);
  if (diff === 0) return cm("today");
  if (diff === 1) return cm("yesterday");
  if (diff < 7) return dt.toLocaleDateString(cmLocale(), { weekday: "long" });
  return cmFmtDate(d);
};
const cmShortDay = (d) => d.toLocaleDateString(cmLocale(), { weekday: "short" }).slice(0,3);
const cmIsSameDay = (a, b) => {
  var x = new Date(a), y = new Date(b);
  return x.getFullYear()===y.getFullYear() && x.getMonth()===y.getMonth() && x.getDate()===y.getDate();
};

/* Storage keys */
const CM_KEYS = {
  lang:         "cm_lang",
  theme:        "cm_theme",
  profile:      "cm_profile",
  contacts:     "cm_contacts",
  conversations:"cm_conversations",
  messages:     "cm_messages",
  stories:      "cm_stories",
  tasks:        "cm_tasks",
  notifications:"cm_notifs",
  settings:     "cm_settings",
  onboarded:    "cm_onboarded",
};

/* Discussion filters */
const CM_CHAT_FILTERS = ["all", "unread", "groups", "favoris"];

/* Notification filters */
const CM_NOTIF_FILTERS = ["all", "call", "tasks", "events", "matchs"];

/* Games categories */
const CM_GAME_CATEGORIES = ["solo", "social"];
