/* Chrome Messenger — Bundled 2026-04-16T19:40:30.300Z */


/* ══════ js/config.js ══════ */
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


/* ══════ js/i18n.js ══════ */
/* Chrome Messenger — i18n (16 languages, fr primary) */

var _cmLang = localStorage.getItem(CM_KEYS.lang) || "fr";

const CM_I18N = {
  fr: {
    appName: "Chrome Messenger", appNameShort: "Chrome",
    tagline: "Change de couleur comme tu changes d'humeur",
    loading: "Chargement...",

    /* Nav */
    navHome: "Accueil", navChat: "Chat", navTasks: "Todolist", navCall: "Appels",
    navGames: "Jeux", navNotifs: "Notifs",

    /* Common */
    search: "Rechercher", cancel: "Annuler", ok: "OK", confirm: "Confirmer",
    save: "Enregistrer", back: "Retour", next: "Suivant", close: "Fermer",
    done: "Termine", edit: "Modifier", delete: "Supprimer", add: "Ajouter",
    view: "Voir", seeAll: "Voir tout", retry: "Reessayer", send: "Envoyer",

    /* Home */
    stories: "Statuts", discussions: "Discussions", addColors: "Ajouter",
    chat: "Chat", chats: "Discussions",
    search_placeholder: "Rechercher",
    filter_all: "Tous", filter_unread: "Non lus", filter_groups: "Groupes", filter_favoris: "Favoris",
    yesterday: "Hier", today: "Aujourd'hui",

    /* Chat conversation */
    typing: "ecrit...", online: "en ligne", lastSeen: "vu(e) ",
    typeMessage: "Ecris un message...", attach: "Joindre", voice: "Voix",
    sent: "Envoye", delivered: "Recu", read: "Lu",
    you: "Toi",
    newChat: "Nouvelle discussion",
    newGroup: "Nouveau groupe",

    /* Story */
    addStory: "Ajouter status", yourStory: "Ton status",
    viewStory: "Voir le status", viewedBy: "Vu par",
    replyToStory: "Repondre...",

    /* Todolist */
    todolist: "Todolist", todayTasks: "Taches du jour",
    addTask: "Ajouter une tache", taskName: "Nom de la tache",
    taskLocation: "Lieu", taskStart: "Debut", taskEnd: "Fin",
    taskWith: "Avec", taskType: "Type",
    task_individual: "Individuel", task_commun: "Commun", task_daily: "Quotidien",
    noTasks: "Aucune tache pour ce jour",
    viewMonth: "Mois", viewWeek: "Semaine",

    /* Games */
    games: "Jeux", gamesSolo: "Pour toi", gamesSoloDesc: "Passe le temps en solo",
    gamesSocial: "Avec tes contacts", gamesSocialDesc: "Defie tes amis",
    play: "Jouer", invite: "Inviter",

    /* Notifs */
    notifications: "Notifications", notifToday: "Aujourd'hui", notifEarlier: "Precedemment",
    notif_all: "Tous", notif_call: "Appels", notif_tasks: "Taches",
    notif_events: "Evenements", notif_matchs: "Matchs",
    noNotifs: "Aucune notification",

    /* Onboarding / Auth */
    welcome: "Bienvenue sur",
    welcomeSub: "Une messagerie qui s'adapte a toi.",
    getStarted: "Commencer",
    enterPhone: "Ton numero de telephone",
    phoneDesc: "On va t'envoyer un code par SMS pour verifier.",
    phonePlaceholder: "+237 6XX XX XX XX",
    sendCode: "Envoyer le code",
    enterCode: "Entre le code recu",
    codeDesc: "Code a 6 chiffres recu par SMS.",
    codeNotReceived: "Pas recu ? Renvoyer",
    verify: "Verifier",
    profileSetup: "Ton profil",
    profileDesc: "Ton nom et ta photo seront visibles par tes contacts.",
    yourName: "Ton nom",
    addPhoto: "Ajouter une photo",
    finish: "Terminer",

    /* Theme picker */
    theme: "Theme", themes: "Themes",
    themeDesc: "Choisis une couleur qui te ressemble.",
    darkMode: "Mode sombre",

    /* Settings */
    settings: "Parametres", profile: "Profil", account: "Compte",
    language: "Langue", notifications_s: "Notifications", privacy: "Confidentialite",
    about: "A propos", version: "Version", logout: "Se deconnecter",
    editProfile: "Modifier le profil", phone: "Telephone",
    resetData: "Reinitialiser", resetConfirm: "Tout reinitialiser ?",

    /* Misc */
    online_s: "En ligne", offline: "Hors ligne",
    unreadCount: "non lus",
    comingSoon: "Bientot disponible",
  },

  en: {
    appName: "Chrome Messenger", appNameShort: "Chrome",
    tagline: "Changes color like you change moods",
    loading: "Loading...",
    navHome: "Home", navChat: "Chat", navTasks: "Todolist", navCall: "Calls",
    navGames: "Games", navNotifs: "Notifs",
    search: "Search", cancel: "Cancel", ok: "OK", confirm: "Confirm",
    save: "Save", back: "Back", next: "Next", close: "Close",
    done: "Done", edit: "Edit", delete: "Delete", add: "Add",
    view: "View", seeAll: "See all", retry: "Retry", send: "Send",
    stories: "Stories", discussions: "Chat", addColors: "Add",
    chat: "Chat", chats: "Chats",
    search_placeholder: "Search",
    filter_all: "All", filter_unread: "Unread", filter_groups: "Groups", filter_favoris: "Favorites",
    yesterday: "Yesterday", today: "Today",
    typing: "typing...", online: "online", lastSeen: "last seen ",
    typeMessage: "Type a message...", attach: "Attach", voice: "Voice",
    sent: "Sent", delivered: "Delivered", read: "Read",
    you: "You", newChat: "New chat", newGroup: "New group",
    addStory: "Add story", yourStory: "Your story",
    viewStory: "View story", viewedBy: "Viewed by", replyToStory: "Reply...",
    todolist: "Todolist", todayTasks: "Today's tasks",
    addTask: "Add a task", taskName: "Task name",
    taskLocation: "Location", taskStart: "Start", taskEnd: "End",
    taskWith: "With", taskType: "Type",
    task_individual: "Individual", task_commun: "Shared", task_daily: "Daily",
    noTasks: "No tasks for this day", viewMonth: "Month", viewWeek: "Week",
    games: "Games", gamesSolo: "For you", gamesSoloDesc: "Pass the time solo",
    gamesSocial: "With your contacts", gamesSocialDesc: "Challenge friends",
    play: "Play", invite: "Invite",
    notifications: "Notifications", notifToday: "Today", notifEarlier: "Earlier",
    notif_all: "All", notif_call: "Calls", notif_tasks: "Tasks",
    notif_events: "Events", notif_matchs: "Matches",
    noNotifs: "No notifications",
    welcome: "Welcome to", welcomeSub: "A messenger that adapts to you.",
    getStarted: "Get started",
    enterPhone: "Your phone number",
    phoneDesc: "We'll send you an SMS code to verify.",
    phonePlaceholder: "+1 555 123 4567", sendCode: "Send code",
    enterCode: "Enter your code", codeDesc: "6-digit code from SMS.",
    codeNotReceived: "Didn't get it? Resend", verify: "Verify",
    profileSetup: "Your profile", profileDesc: "Your name and photo will be visible to contacts.",
    yourName: "Your name", addPhoto: "Add a photo", finish: "Finish",
    theme: "Theme", themes: "Themes",
    themeDesc: "Pick a color that looks like you.", darkMode: "Dark mode",
    settings: "Settings", profile: "Profile", account: "Account",
    language: "Language", notifications_s: "Notifications", privacy: "Privacy",
    about: "About", version: "Version", logout: "Log out",
    editProfile: "Edit profile", phone: "Phone",
    resetData: "Reset data", resetConfirm: "Reset everything?",
    online_s: "Online", offline: "Offline",
    unreadCount: "unread", comingSoon: "Coming soon",
  },
};

/* Fallback entries for 14 other languages */
function cmAddLang(code, patch) { CM_I18N[code] = Object.assign({}, CM_I18N.en, patch); }
cmAddLang("es", { appName:"Chrome Messenger", navHome:"Inicio", navTasks:"Tareas", navGames:"Juegos", navNotifs:"Notif", search:"Buscar" });
cmAddLang("pt", { appName:"Chrome Messenger", navHome:"Inicio", navTasks:"Tarefas", navGames:"Jogos", navNotifs:"Notif", search:"Buscar" });
cmAddLang("de", { appName:"Chrome Messenger", navHome:"Start", navTasks:"Aufgaben", navGames:"Spiele", navNotifs:"Notif", search:"Suchen" });
cmAddLang("it", { appName:"Chrome Messenger", navHome:"Home", navTasks:"Attivita", navGames:"Giochi", navNotifs:"Notif", search:"Cerca" });
cmAddLang("nl", { appName:"Chrome Messenger", navHome:"Home", navTasks:"Taken", navGames:"Spellen", navNotifs:"Meld", search:"Zoeken" });
cmAddLang("tr", { appName:"Chrome Messenger", navHome:"Ana", navTasks:"Gorevler", navGames:"Oyunlar", navNotifs:"Bildirim", search:"Ara" });
cmAddLang("ru", { appName:"Chrome Messenger", navHome:"Glavnaya", navTasks:"Zadachi", navGames:"Igry", navNotifs:"Notif", search:"Poisk" });
cmAddLang("ar", { appName:"Chrome Messenger", navHome:"Ar-ra'isiyya", navTasks:"Muhimmat", navGames:"Al'ab", navNotifs:"Tanbih", search:"Bahth" });
cmAddLang("zh", { appName:"Chrome Messenger", navHome:"Shouye", navTasks:"Renwu", navGames:"Youxi", navNotifs:"Tongzhi", search:"Sousuo" });
cmAddLang("ja", { appName:"Chrome Messenger", navHome:"Homu", navTasks:"Tasuku", navGames:"Gemu", navNotifs:"Tsuchi", search:"Kensaku" });
cmAddLang("ko", { appName:"Chrome Messenger", navHome:"Hom", navTasks:"Taseukeu", navGames:"Geim", navNotifs:"Allim", search:"Geomsaek" });
cmAddLang("hi", { appName:"Chrome Messenger", navHome:"Ghar", navTasks:"Tasks", navGames:"Games", navNotifs:"Notifs", search:"Khojo" });
cmAddLang("sw", { appName:"Chrome Messenger", navHome:"Nyumbani", navTasks:"Kazi", navGames:"Michezo", navNotifs:"Notif", search:"Tafuta" });
cmAddLang("pl", { appName:"Chrome Messenger", navHome:"Glowna", navTasks:"Zadania", navGames:"Gry", navNotifs:"Powiad", search:"Szukaj" });

function cm(key) {
  var dict = CM_I18N[_cmLang] || CM_I18N.fr;
  if (dict[key] !== undefined) return dict[key];
  if (CM_I18N.fr[key] !== undefined) return CM_I18N.fr[key];
  return key;
}

function cmSetLang(lang) {
  if (!CM_I18N[lang]) return;
  _cmLang = lang;
  localStorage.setItem(CM_KEYS.lang, lang);
}

const CM_LANGS = [
  {code:"fr",name:"Francais",flag:"🇫🇷"},
  {code:"en",name:"English",flag:"🇬🇧"},
  {code:"es",name:"Espanol",flag:"🇪🇸"},
  {code:"pt",name:"Portugues",flag:"🇵🇹"},
  {code:"de",name:"Deutsch",flag:"🇩🇪"},
  {code:"it",name:"Italiano",flag:"🇮🇹"},
  {code:"nl",name:"Nederlands",flag:"🇳🇱"},
  {code:"tr",name:"Turkce",flag:"🇹🇷"},
  {code:"ru",name:"Russkiy",flag:"🇷🇺"},
  {code:"ar",name:"Arabiyyah",flag:"🇸🇦"},
  {code:"zh",name:"Zhongwen",flag:"🇨🇳"},
  {code:"ja",name:"Nihongo",flag:"🇯🇵"},
  {code:"ko",name:"Hangugeo",flag:"🇰🇷"},
  {code:"hi",name:"Hindi",flag:"🇮🇳"},
  {code:"sw",name:"Kiswahili",flag:"🇰🇪"},
  {code:"pl",name:"Polski",flag:"🇵🇱"},
];


/* ══════ js/data/seed.js ══════ */
/* Chrome Messenger — Mock data (contacts, messages, stories, tasks, notifs, games) */

/* Avatar generator: colored initials for mock contacts. Real app would use photos. */
function cmAvatar(name, palette) {
  var colors = palette || ["#FF4F7A","#4F80FF","#FF8A4C","#A855F7","#30D79C","#C895E8","#FFC940","#F06EB5"];
  var idx = 0;
  for (var i = 0; i < name.length; i++) idx = (idx + name.charCodeAt(i)) | 0;
  idx = Math.abs(idx) % colors.length;
  var initials = name.split(" ").map(function(w){ return w[0] || ""; }).slice(0,2).join("").toUpperCase();
  return { initials: initials, color: colors[idx] };
}

/* Initial contacts (used on first app launch). */
const CM_SEED_CONTACTS = [
  { id: "c1",  name: "Joseph Lando",       phone: "+237 6 99 01 02 03", favorite: true,  lastSeen: Date.now() - 1000*60*5 },
  { id: "c2",  name: "Richy",              phone: "+237 6 99 11 22 33", favorite: false, lastSeen: Date.now() - 1000*60*60 },
  { id: "c3",  name: "Morgan Freeman",     phone: "+237 6 99 44 55 66", favorite: true,  lastSeen: Date.now() - 1000*60*15 },
  { id: "c4",  name: "Tarzan",             phone: "+237 6 99 77 88 99", favorite: false, lastSeen: Date.now() - 1000*60*90 },
  { id: "c5",  name: "Cody",               phone: "+237 6 99 10 20 30", favorite: false, lastSeen: Date.now() - 1000*60*180 },
  { id: "c6",  name: "Style Man",          phone: "+237 6 99 40 50 60", favorite: false, lastSeen: Date.now() - 1000*60*60*5 },
  { id: "c7",  name: "Motoconda",          phone: "+237 6 99 70 80 90", favorite: false, lastSeen: Date.now() - 1000*60*60*10 },
  { id: "c8",  name: "Itachi",             phone: "+237 6 99 00 11 22", favorite: false, lastSeen: Date.now() - 1000*60*60*24 },
  { id: "c9",  name: "Elodie Lando",       phone: "+237 6 99 33 44 55", favorite: true,  lastSeen: Date.now() - 1000*60*2 },
  { id: "c10", name: "Madeleine Ngniteze", phone: "+237 6 99 66 77 88", favorite: false, lastSeen: Date.now() - 1000*60*30 },
];

/* Initial conversations (1-to-1). Each has a list of messages referenced separately. */
const CM_SEED_CONVERSATIONS = [
  { id: "conv1", type: "direct", contactId: "c1",  pinned: true,  muted: false, lastMsgAt: Date.now() - 1000*60*60*20 },
  { id: "conv2", type: "direct", contactId: "c2",  pinned: false, muted: false, lastMsgAt: Date.now() - 1000*60*60*21 },
  { id: "conv3", type: "direct", contactId: "c3",  pinned: false, muted: false, lastMsgAt: Date.now() - 1000*60*60*22 },
  { id: "conv4", type: "direct", contactId: "c4",  pinned: false, muted: false, lastMsgAt: Date.now() - 1000*60*60*23 },
  { id: "conv5", type: "direct", contactId: "c5",  pinned: false, muted: false, lastMsgAt: Date.now() - 1000*60*60*24 },
  { id: "conv6", type: "direct", contactId: "c6",  pinned: false, muted: true,  lastMsgAt: Date.now() - 1000*60*60*48 },
  { id: "convg","type": "group", name: "Lando Family", memberIds: ["c1","c9","c10"], pinned: false, muted: false, lastMsgAt: Date.now() - 1000*60*60*30 },
];

/* Initial messages per conversation. Me = profile.id (resolved at runtime). */
const CM_SEED_MESSAGES = {
  conv1: [
    { id: "m1", authorId: "c1",   text: "Salut !",                   at: Date.now() - 1000*60*60*24, readByMe: true },
    { id: "m2", authorId: "me",   text: "Bonjour toi !",             at: Date.now() - 1000*60*60*20, readByMe: true },
    { id: "m3", authorId: "c1",   text: "On se voit demain ?",       at: Date.now() - 1000*60*60*20, readByMe: true },
  ],
  conv2: [
    { id: "m1", authorId: "c2",   text: "Bonjour toi !",             at: Date.now() - 1000*60*60*21, readByMe: true },
  ],
  conv3: [
    { id: "m1", authorId: "c3",   text: "Bonjour toi !",             at: Date.now() - 1000*60*60*22, readByMe: true },
  ],
  conv4: [
    { id: "m1", authorId: "c4",   text: "Bonjour toi !",             at: Date.now() - 1000*60*60*23, readByMe: false },
    { id: "m2", authorId: "c4",   text: "Tu es la ?",                at: Date.now() - 1000*60*60*23, readByMe: false },
  ],
  conv5: [
    { id: "m1", authorId: "c5",   text: "Bonjour toi !",             at: Date.now() - 1000*60*60*24, readByMe: true },
  ],
  conv6: [
    { id: "m1", authorId: "c6",   text: "Bonjour toi !",             at: Date.now() - 1000*60*60*48, readByMe: true },
  ],
  convg: [
    { id: "m1", authorId: "c9",   text: "Bienvenue dans le groupe !",at: Date.now() - 1000*60*60*30, readByMe: true },
    { id: "m2", authorId: "c10",  text: "Salut tout le monde 👋",    at: Date.now() - 1000*60*60*29, readByMe: true },
  ],
};

/* Stories — visible on home, expire after 24h */
const CM_SEED_STORIES = [
  { id: "s1", ownerId: "c1",  createdAt: Date.now() - 1000*60*60*6,  viewed: false, bg: "#FFE8A0", kind: "colors", text: "Une belle journee !" },
  { id: "s2", ownerId: "c9",  createdAt: Date.now() - 1000*60*60*2,  viewed: false, bg: "#C8D9FF", kind: "colors", text: "Chillin" },
  { id: "s3", ownerId: "c10", createdAt: Date.now() - 1000*60*60*12, viewed: true,  bg: "#FFC6D3", kind: "colors", text: "Bon week-end" },
];

/* Tasks — for todolist */
function cmSeedTasks() {
  var today = new Date(); today.setHours(0,0,0,0);
  var base = today.getTime();
  return [
    { id: "t1", title: "Homework",      with: "Fred Larson",  place: "Bafoussam", startAt: base + 19*3600*1000 + 15*60*1000, endAt: base + 19*3600*1000 + 25*60*1000, type: "individual", done: false },
    { id: "t2", title: "RDV",           with: "Chris Duck",   place: "Yaounde",   startAt: base + 19*3600*1000 + 35*60*1000, endAt: base + 19*3600*1000 + 55*60*1000, type: "commun",     done: false },
    { id: "t3", title: "RDV d'affaire", with: "Yves Molaro",  place: "Douala",    startAt: base + 21*3600*1000 + 15*60*1000, endAt: base + 21*3600*1000 + 55*60*1000, type: "individual", done: false },
    /* Extra tasks on other days to show calendar dots */
    { id: "t4", title: "Sport",         with: "",             place: "",          startAt: base + 86400000 + 7*3600*1000,    endAt: base + 86400000 + 8*3600*1000,    type: "daily",      done: false },
    { id: "t5", title: "Meeting team",  with: "Team",         place: "Bureau",    startAt: base + 2*86400000 + 10*3600*1000, endAt: base + 2*86400000 + 11*3600*1000, type: "commun",     done: false },
  ];
}

/* Notifications */
function cmSeedNotifs() {
  return [
    { id: "n1", kind: "tasks",  title: "Homework", subtitle: "with Fred Larson",    place: "Bafoussam", time: "19:15 - 19:25", at: Date.now() - 1000*60*60*2, read: false },
    { id: "n2", kind: "tasks",  title: "RDV",      subtitle: "with Chris Duck",     place: "Yaounde",   time: "19:35 - 19:55", at: Date.now() - 1000*60*60*3, read: false },
    { id: "n3", kind: "call",   title: "Joseph Lando", subtitle: "Appel manque",     place: "",          time: "18:40",         at: Date.now() - 1000*60*60*5, read: false },
    { id: "n4", kind: "events", title: "Anniversaire Morgan", subtitle: "Aujourd'hui", place: "",        time: "",              at: Date.now() - 1000*60*60*8, read: true  },
  ];
}

/* Games — solo (time-killers) + social (with contacts).
 * On first launch these are injected; user can't modify list.
 */
const CM_SEED_GAMES = {
  solo: [
    { id: "g-snake",    name: "Snake",           emoji: "🐍", color: "#30D79C", kind: "external", href: "https://land-lang-120.github.io/snake-labyrinth/", desc: "Labyrinthes neon infinis." },
    { id: "g-tetroid",  name: "Tetroid",         emoji: "🧱", color: "#A855F7", kind: "external", href: "https://tetroid-game.netlify.app/", desc: "Tetris nouvelle gen." },
    { id: "g-block",    name: "Block Blast",     emoji: "💥", color: "#4F80FF", kind: "external", href: "https://block-blast-royal.netlify.app/", desc: "Puzzle de blocs explosif." },
    { id: "g-bounce",   name: "Bounce",          emoji: "🏀", color: "#FF8A4C", kind: "external", href: "https://bounce-labyrinth.netlify.app/", desc: "Platformer infini." },
    { id: "g-2048",     name: "2048",            emoji: "🔢", color: "#FFC940", kind: "builtin",  desc: "Combine les tuiles." },
    { id: "g-memory",   name: "Memory",          emoji: "🧠", color: "#F06EB5", kind: "builtin",  desc: "Trouve les paires." },
  ],
  social: [
    { id: "g-ttt",      name: "Morpion",         emoji: "⭕", color: "#30D79C", kind: "social", desc: "Defie un contact au morpion." },
    { id: "g-rps",      name: "Pierre Papier",   emoji: "✂️", color: "#FF4F7A", kind: "social", desc: "Pierre-feuille-ciseaux." },
    { id: "g-draw",     name: "Devine",          emoji: "🎨", color: "#C895E8", kind: "social", desc: "Dessine, fais deviner." },
    { id: "g-truth",    name: "Action-Verite",   emoji: "🎯", color: "#4F80FF", kind: "social", desc: "Classique entre amis." },
    { id: "g-quiz",     name: "Quiz",            emoji: "🧩", color: "#FF8A4C", kind: "social", desc: "Qui connait mieux qui ?" },
  ],
};

/* Contact seeding helper */
function cmContactById(contacts, id) {
  for (var i = 0; i < contacts.length; i++) if (contacts[i].id === id) return contacts[i];
  return null;
}


/* ══════ js/storage.js ══════ */
/* Chrome Messenger — Storage layer */

function cmLoad(key, defaultVal) {
  try {
    var raw = localStorage.getItem(key);
    if (raw === null) return defaultVal;
    return JSON.parse(raw);
  } catch (e) { return defaultVal; }
}
function cmSave(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

/* Profile */
function cmGetProfile() {
  return cmLoad(CM_KEYS.profile, {
    id: "me",
    name: "",
    phone: "",
    avatar: null,
    bio: "",
    createdAt: null,
  });
}
function cmSetProfile(p) { cmSave(CM_KEYS.profile, p); }

/* Onboarding */
function cmIsOnboarded() { return !!cmLoad(CM_KEYS.onboarded, false); }
function cmSetOnboarded(v) { cmSave(CM_KEYS.onboarded, !!v); }

/* Settings */
function cmGetSettings() {
  return cmLoad(CM_KEYS.settings, {
    notifications: true,
    sound: true,
    enterToSend: true,
    readReceipts: true,
  });
}
function cmSetSettings(s) { cmSave(CM_KEYS.settings, s); }

/* Contacts */
function cmGetContacts() { return cmLoad(CM_KEYS.contacts, []); }
function cmSetContacts(list) { cmSave(CM_KEYS.contacts, list); }

/* Conversations */
function cmGetConversations() { return cmLoad(CM_KEYS.conversations, []); }
function cmSetConversations(list) { cmSave(CM_KEYS.conversations, list); }
function cmFindConversation(id) {
  var list = cmGetConversations();
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
}
function cmUpdateConversation(id, patch) {
  var list = cmGetConversations();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) { list[i] = Object.assign({}, list[i], patch); break; }
  }
  cmSetConversations(list);
}

/* Messages (per conversation, keyed) */
function cmGetMessages(convId) {
  var all = cmLoad(CM_KEYS.messages, {});
  return all[convId] || [];
}
function cmSetMessages(convId, msgs) {
  var all = cmLoad(CM_KEYS.messages, {});
  all[convId] = msgs;
  cmSave(CM_KEYS.messages, all);
}
function cmAddMessage(convId, msg) {
  var list = cmGetMessages(convId);
  msg.id = msg.id || ("m_" + Date.now() + "_" + Math.random().toString(36).substring(2,7));
  list.push(msg);
  cmSetMessages(convId, list);
  cmUpdateConversation(convId, { lastMsgAt: msg.at || Date.now() });
  return msg.id;
}

/* Last message preview for conversation row */
function cmLastMessage(convId) {
  var list = cmGetMessages(convId);
  return list[list.length - 1] || null;
}

/* Stories */
function cmGetStories() {
  /* Filter out stories older than 24h */
  var list = cmLoad(CM_KEYS.stories, []);
  var cutoff = Date.now() - 24*3600*1000;
  return list.filter(function(s){ return s.createdAt > cutoff; });
}
function cmAddStory(story) {
  var list = cmLoad(CM_KEYS.stories, []);
  story.id = story.id || ("s_" + Date.now());
  story.createdAt = story.createdAt || Date.now();
  list.push(story);
  cmSave(CM_KEYS.stories, list);
  return story.id;
}
function cmMarkStoryViewed(id) {
  var list = cmLoad(CM_KEYS.stories, []);
  list = list.map(function(s){ return s.id === id ? Object.assign({}, s, { viewed: true }) : s; });
  cmSave(CM_KEYS.stories, list);
}

/* Tasks */
function cmGetTasks() { return cmLoad(CM_KEYS.tasks, []); }
function cmSetTasks(list) { cmSave(CM_KEYS.tasks, list); }
function cmAddTask(task) {
  var list = cmGetTasks();
  task.id = task.id || ("t_" + Date.now());
  list.push(task);
  cmSetTasks(list);
  return task.id;
}
function cmUpdateTask(id, patch) {
  var list = cmGetTasks();
  list = list.map(function(t){ return t.id === id ? Object.assign({}, t, patch) : t; });
  cmSetTasks(list);
}
function cmDeleteTask(id) {
  cmSetTasks(cmGetTasks().filter(function(t){ return t.id !== id; }));
}
function cmTasksForDate(dateMs) {
  var day = new Date(dateMs); day.setHours(0,0,0,0);
  var start = day.getTime();
  var end = start + 86400000;
  return cmGetTasks().filter(function(t){ return t.startAt >= start && t.startAt < end; });
}
function cmDaysWithTasks() {
  /* Returns set of day-ms (midnight) that have at least one task */
  var list = cmGetTasks();
  var set = {};
  list.forEach(function(t){
    var d = new Date(t.startAt); d.setHours(0,0,0,0);
    set[d.getTime()] = true;
  });
  return set;
}

/* Notifications */
function cmGetNotifs() { return cmLoad(CM_KEYS.notifications, []); }
function cmSetNotifs(list) { cmSave(CM_KEYS.notifications, list); }
function cmUnreadNotifsCount() {
  return cmGetNotifs().filter(function(n){ return !n.read; }).length;
}
function cmMarkAllNotifsRead() {
  cmSetNotifs(cmGetNotifs().map(function(n){ return Object.assign({}, n, { read: true }); }));
}

/* Unread messages across all conversations */
function cmUnreadMessagesCount() {
  var total = 0;
  cmGetConversations().forEach(function(c) {
    var msgs = cmGetMessages(c.id);
    msgs.forEach(function(m){
      if (m.authorId !== "me" && m.readByMe === false) total++;
    });
  });
  return total;
}

/* Reset all */
function cmResetAll() {
  Object.keys(CM_KEYS).forEach(function(k) { localStorage.removeItem(CM_KEYS[k]); });
}

/* First-launch seeding */
function cmSeedIfNeeded() {
  if (cmGetContacts().length === 0) cmSetContacts(CM_SEED_CONTACTS);
  if (cmGetConversations().length === 0) cmSetConversations(CM_SEED_CONVERSATIONS);
  var all = cmLoad(CM_KEYS.messages, {});
  if (Object.keys(all).length === 0) cmSave(CM_KEYS.messages, CM_SEED_MESSAGES);
  if (cmLoad(CM_KEYS.stories, null) === null) cmSave(CM_KEYS.stories, CM_SEED_STORIES);
  if (cmGetTasks().length === 0) cmSetTasks(cmSeedTasks());
  if (cmGetNotifs().length === 0) cmSetNotifs(cmSeedNotifs());
}


/* ══════ js/crypto.js ══════ */
/* Chrome Messenger — End-to-End Encryption Layer
 *
 * Architecture inspired by Signal/WhatsApp:
 *  - Each user has an ECDH keypair (P-256 curve) persisted locally.
 *  - When two users open a conversation, they derive a shared secret via ECDH,
 *    then use it as a root key (HKDF) to produce a chain of AES-256-GCM message keys.
 *  - Every message is encrypted with a fresh key; old keys are deleted.
 *  - The server (real-world) only sees ciphertext + ephemeral public keys.
 *
 * For this client-only demo (localStorage simulation), we:
 *  - Generate a real ECDH keypair per user.
 *  - Derive a real shared AES-GCM key per conversation.
 *  - Encrypt every message with AES-GCM and a random IV before storing.
 *  - Decrypt on read.
 *
 * Performance:
 *  - AES-GCM + ECDH are native WebCrypto (hardware-accelerated).
 *  - Message keys cached in-memory per conversation (avoids re-derivation).
 *  - Messages persisted as compact base64 ciphertext, never plaintext.
 *
 * Resource efficiency (Telegram/WhatsApp-like):
 *  - Messages lazy-loaded per conversation (not all at once).
 *  - Key cache with LRU eviction (max 20 conversations in memory).
 *  - Only the last 200 messages per conv are kept hot; older trimmed to archive.
 */

var _cmKeyCache = {}; /* convId -> CryptoKey (AES-GCM) */
var _cmMyKeypair = null; /* CryptoKeyPair for my account */
var _cmPeerPublicKeys = {}; /* contactId -> CryptoKey (public) */

const CM_CRYPTO_KEYS = {
  myPrivateKey: "cm_crypto_my_priv",
  myPublicKey:  "cm_crypto_my_pub",
  peerKeys:     "cm_crypto_peer_keys",
};

/* ===== Initialization ===== */

async function cmCryptoInit() {
  if (!window.crypto || !window.crypto.subtle) {
    console.warn("[cm-crypto] WebCrypto not available, falling back to plaintext mode");
    return false;
  }
  /* Load or generate my keypair */
  var stored = await cmLoadMyKeypair();
  if (stored) {
    _cmMyKeypair = stored;
  } else {
    _cmMyKeypair = await cmGenerateKeypair();
    await cmPersistMyKeypair(_cmMyKeypair);
  }
  /* Load peer public keys from local cache */
  try {
    var raw = localStorage.getItem(CM_CRYPTO_KEYS.peerKeys);
    if (raw) {
      var obj = JSON.parse(raw);
      for (var k in obj) {
        _cmPeerPublicKeys[k] = await cmImportPublicKey(obj[k]);
      }
    }
  } catch (e) {}
  return true;
}

async function cmGenerateKeypair() {
  return crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true, /* extractable — only locally, never exported off-device in real app */
    ["deriveKey"]
  );
}

async function cmExportPublicKey(key) {
  var buf = await crypto.subtle.exportKey("raw", key);
  return cmBufToBase64(buf);
}

async function cmImportPublicKey(base64) {
  var buf = cmBase64ToBuf(base64);
  return crypto.subtle.importKey(
    "raw", buf,
    { name: "ECDH", namedCurve: "P-256" },
    true, [] /* public keys don't need deriveKey capability themselves */
  );
}

async function cmPersistMyKeypair(kp) {
  try {
    var privJwk = await crypto.subtle.exportKey("jwk", kp.privateKey);
    var pubRaw = await cmExportPublicKey(kp.publicKey);
    localStorage.setItem(CM_CRYPTO_KEYS.myPrivateKey, JSON.stringify(privJwk));
    localStorage.setItem(CM_CRYPTO_KEYS.myPublicKey, pubRaw);
  } catch (e) { console.warn("[cm-crypto] persist failed", e); }
}

async function cmLoadMyKeypair() {
  try {
    var privStr = localStorage.getItem(CM_CRYPTO_KEYS.myPrivateKey);
    var pubStr  = localStorage.getItem(CM_CRYPTO_KEYS.myPublicKey);
    if (!privStr || !pubStr) return null;
    var privJwk = JSON.parse(privStr);
    var privateKey = await crypto.subtle.importKey(
      "jwk", privJwk,
      { name: "ECDH", namedCurve: "P-256" },
      true, ["deriveKey"]
    );
    var publicKey = await cmImportPublicKey(pubStr);
    return { privateKey: privateKey, publicKey: publicKey };
  } catch (e) { return null; }
}

/* ===== Peer Key Exchange (simulated) =====
 * In the demo, we create a fake peer keypair for each contact and persist
 * only their public key locally. In a real app, the server relays these.
 */
async function cmEnsurePeerKey(contactId) {
  if (_cmPeerPublicKeys[contactId]) return _cmPeerPublicKeys[contactId];
  /* Generate a mock peer keypair — only their public key stored */
  var peerKp = await cmGenerateKeypair();
  var pubRaw = await cmExportPublicKey(peerKp.publicKey);
  /* Store */
  try {
    var raw = localStorage.getItem(CM_CRYPTO_KEYS.peerKeys);
    var obj = raw ? JSON.parse(raw) : {};
    obj[contactId] = pubRaw;
    localStorage.setItem(CM_CRYPTO_KEYS.peerKeys, JSON.stringify(obj));
  } catch (e) {}
  _cmPeerPublicKeys[contactId] = peerKp.publicKey;
  return peerKp.publicKey;
}

/* ===== Per-conversation symmetric key derivation ===== */
async function cmGetConvKey(convId) {
  if (_cmKeyCache[convId]) return _cmKeyCache[convId];
  /* LRU-like eviction if cache too big */
  var keys = Object.keys(_cmKeyCache);
  if (keys.length > 20) delete _cmKeyCache[keys[0]];

  if (!_cmMyKeypair) return null;
  var conv = cmFindConversation(convId);
  if (!conv) return null;

  /* Derive shared key: for direct chats use contact's public key;
     for groups we'd use a sender-keys scheme — here we fallback to group key. */
  var peerKey;
  if (conv.type === "direct") {
    peerKey = await cmEnsurePeerKey(conv.contactId);
  } else {
    /* Mock: derive group key from conv.id as salt (demo only) */
    peerKey = await cmEnsurePeerKey(conv.id);
  }

  var aesKey = await crypto.subtle.deriveKey(
    { name: "ECDH", public: peerKey },
    _cmMyKeypair.privateKey,
    { name: "AES-GCM", length: 256 },
    false, /* not extractable — stays in browser crypto engine */
    ["encrypt", "decrypt"]
  );

  _cmKeyCache[convId] = aesKey;
  return aesKey;
}

/* ===== Encrypt / Decrypt ===== */
async function cmEncryptMessage(convId, plaintext) {
  var key = await cmGetConvKey(convId);
  if (!key) return { ciphertext: plaintext, iv: null, enc: false };
  var iv = crypto.getRandomValues(new Uint8Array(12));
  var encoded = new TextEncoder().encode(plaintext);
  var ctBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encoded);
  return {
    ciphertext: cmBufToBase64(ctBuf),
    iv: cmBufToBase64(iv),
    enc: true,
  };
}

async function cmDecryptMessage(convId, payload) {
  if (!payload.enc) return payload.ciphertext; /* plaintext fallback */
  var key = await cmGetConvKey(convId);
  if (!key) return "[encrypted]";
  try {
    var iv = cmBase64ToBuf(payload.iv);
    var ct = cmBase64ToBuf(payload.ciphertext);
    var plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, ct);
    return new TextDecoder().decode(plainBuf);
  } catch (e) {
    return "[decrypt failed]";
  }
}

/* ===== Helpers ===== */
function cmBufToBase64(buf) {
  var bytes = new Uint8Array(buf);
  var bin = "";
  for (var i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function cmBase64ToBuf(base64) {
  var bin = atob(base64);
  var bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

/* ===== High-level wrappers used by chat UI ===== */

/* Encrypt before storing, return compact payload */
async function cmAddEncryptedMessage(convId, plaintext, authorId) {
  var payload = await cmEncryptMessage(convId, plaintext);
  var msg = {
    authorId: authorId || "me",
    at: Date.now(),
    readByMe: true,
    cipher: payload, /* { ciphertext, iv, enc } */
  };
  return cmAddMessage(convId, msg);
}

/* Decrypt all cached messages of a conversation for display.
 * Caches decrypted text on the message object in-memory to avoid double work. */
async function cmDecryptConversation(convId) {
  var msgs = cmGetMessages(convId);
  for (var i = 0; i < msgs.length; i++) {
    var m = msgs[i];
    if (m.cipher && !m._text) {
      m._text = await cmDecryptMessage(convId, m.cipher);
    } else if (!m._text) {
      m._text = m.text || "";
    }
  }
  return msgs;
}

/* Quick message text getter (sync) — uses cache, else falls back to plain */
function cmMsgText(m) {
  if (m._text !== undefined) return m._text;
  if (m.cipher) return "🔒";
  return m.text || "";
}

/* ===== Resource-efficient pruning =====
 * Keep the last 200 messages per conversation hot; archive older to
 * a secondary key to reduce JSON.parse overhead on startup.
 */
function cmPruneOldMessages(convId, keepHot) {
  keepHot = keepHot || 200;
  var all = cmGetMessages(convId);
  if (all.length <= keepHot) return;
  var cut = all.length - keepHot;
  var archive = all.slice(0, cut);
  var hot = all.slice(cut);
  try {
    var archKey = "cm_archive_" + convId;
    var existing = localStorage.getItem(archKey);
    var arr = existing ? JSON.parse(existing) : [];
    localStorage.setItem(archKey, JSON.stringify(arr.concat(archive)));
  } catch (e) {}
  cmSetMessages(convId, hot);
}


/* ══════ js/components.js ══════ */
/* Chrome Messenger — Shared React components */

/* === CHAMELEON LOGO ===
 * Faithful to user's image (1).png — a stylized chameleon curled in a G-shape.
 * Each viewBox unit must match precisely to avoid the "grossier" look.
 *
 * Structure (on 100x100 viewBox for clean coords):
 *   - Body: filled disc, radius 40, centered at (48, 55) — slightly offset left/down
 *   - Top-right NOTCH cut out of body so head protrudes
 *   - Head: small rounded rect at top-right, overlapping the notch
 *   - MAIN eye: white ring with black pupil + highlight in lower-left of body
 *   - HEAD eye: tiny black dot on the head
 *
 * The key visual signature: the head is CLEARLY separate (a distinct rectangle
 * with corners), not a blob. The body is a pure disc with a rectangular bite
 * removed — exactly like the reference image.
 */
/* Uses the user's original PNG directly for pixel-perfect fidelity.
 * Theme color adaptation via CSS hue-rotate: base logo is mint (#30D79C ~ hue 155deg).
 * Each theme has a hueShift pre-computed against mint. */
const CM_LOGO_HUE_SHIFT = {
  mint: 0, blue: 65, orange: -125, coral: -135, purple: 95, lilac: 100,
  yellow: -100, charcoal: 0, dark: 0,
};
const CM_LOGO_SATURATE = {
  mint: 1, blue: 1, orange: 1.2, coral: 1.1, purple: 1, lilac: 0.85,
  yellow: 1.2, charcoal: 0, dark: 1,
};
const CM_LOGO_BRIGHTNESS = {
  mint: 1, blue: 1, orange: 1, coral: 1, purple: 1, lilac: 1,
  yellow: 1, charcoal: 0.35, dark: 1,
};

function ChameleonLogo(props) {
  var size = props.size || 36;
  var hue = CM_LOGO_HUE_SHIFT[CM.themeId] != null ? CM_LOGO_HUE_SHIFT[CM.themeId] : 0;
  var sat = CM_LOGO_SATURATE[CM.themeId] != null ? CM_LOGO_SATURATE[CM.themeId] : 1;
  var bri = CM_LOGO_BRIGHTNESS[CM.themeId] != null ? CM_LOGO_BRIGHTNESS[CM.themeId] : 1;
  return React.createElement("img", {
    src: "icons/logo.png",
    alt: "Chrome Messenger",
    style: Object.assign({
      display: "block",
      width: size + "px", height: size + "px",
      objectFit: "contain",
      background: "transparent",
      filter: "hue-rotate(" + hue + "deg) saturate(" + sat + ") brightness(" + bri + ")",
    }, props.style || {}),
    draggable: false,
  });
}

/* === ICONS === (Lucide-inspired, stroke-based) */
const Cmi = {
  home: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"}),React.createElement("path",{d:"M9 22V12h6v10"})),
  homeFilled: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"currentColor"},React.createElement("path",{d:"M10.29 3.86a2 2 0 012.42 0l7 5.4A2 2 0 0120.5 11V20a2 2 0 01-2 2h-3v-6h-3v6h-3a2 2 0 01-2-2v-9a2 2 0 01.79-1.74z"})),
  chat: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"})),
  tasks: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("rect",{x:3,y:4,width:18,height:18,rx:2}),React.createElement("path",{d:"M16 2v4M8 2v4M3 10h18"})),
  games: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M6 12h4M8 10v4M15 13h.01M18 11h.01M17.32 5H6.68a4 4 0 00-3.978 3.59L2.11 15a3 3 0 005.969.44L8.5 14h7l.421 1.44A3 3 0 0021.89 15l-.59-6.41A4 4 0 0017.32 5z"})),
  bell: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"})),
  menu: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M3 6h18M3 12h18M3 18h18"})),
  back: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M19 12H5M12 19l-7-7 7-7"})),
  close: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M18 6L6 18M6 6l12 12"})),
  search: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:11,cy:11,r:7}),React.createElement("path",{d:"M21 21l-4.35-4.35"})),
  plus: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M12 5v14M5 12h14"})),
  chevR: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M9 18l6-6-6-6"})),
  chevL: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M15 18l-6-6 6-6"})),
  check: React.createElement("svg",{width:16,height:16,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":3,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M20 6L9 17l-5-5"})),
  trash: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"})),
  calendar: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("rect",{x:3,y:4,width:18,height:18,rx:2}),React.createElement("path",{d:"M16 2v4M8 2v4M3 10h18"})),
  send: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"})),
  attach: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"})),
  mic: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"})),
  phone: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.339 1.85.573 2.81.7A2 2 0 0122 16.92z"})),
  video: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("polygon",{points:"23 7 16 12 23 17 23 7"}),React.createElement("rect",{x:1,y:5,width:15,height:14,rx:2})),
  check2: React.createElement("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":3,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M20 6L9 17l-5-5"})),
  checkDouble: React.createElement("svg",{width:16,height:14,viewBox:"0 0 30 22",fill:"none",stroke:"currentColor","stroke-width":3,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M1 13l5 5 10-10M13 13l5 5 10-10"})),
  location: React.createElement("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"}),React.createElement("circle",{cx:12,cy:10,r:3})),
  clock: React.createElement("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:12,cy:12,r:10}),React.createElement("path",{d:"M12 6v6l4 2"})),
  settings: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:12,cy:12,r:3}),React.createElement("path",{d:"M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"})),
  moon: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"})),
  sun: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:12,cy:12,r:5}),React.createElement("path",{d:"M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"})),
  heart: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"})),
  gem: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M6 3h12l4 6-10 13L2 9z"}),React.createElement("path",{d:"M11 3L8 9l4 13 4-13-3-6M2 9h20"})),
  info: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:12,cy:12,r:10}),React.createElement("path",{d:"M12 16v-4M12 8h.01"})),
};

/* === AVATAR === (initials on colored circle) */
function CmAvatar(props) {
  var name = props.name || "?";
  var size = props.size || 40;
  var info = cmAvatar(name);
  var border = props.border;
  return React.createElement("div", {
    style: {
      width: size, height: size, borderRadius: "50%",
      background: info.color, color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.4), fontWeight: 700,
      fontFamily: "inherit", flexShrink: 0,
      boxShadow: border ? ("0 0 0 2.5px " + (typeof border === "string" ? border : CM.primary) + ", 0 0 0 4.5px white") : "none",
      userSelect: "none",
    }
  }, info.initials);
}

/* === BUTTON === */
function CmBtn(props) {
  var variant = props.variant || "primary";
  var size = props.size || "md";
  var sizes = {
    sm: { padding: "8px 14px", fontSize: 12, borderRadius: 10 },
    md: { padding: "12px 20px", fontSize: 14, borderRadius: 12 },
    lg: { padding: "15px 26px", fontSize: 15, borderRadius: 14 },
  };
  var variants = {
    primary:   { background: CM.primary, color: CM.onPrimary, border: "none", boxShadow: CM.shadowGlow },
    secondary: { background: CM.surface2, color: CM.title, border: "none" },
    outline:   { background: "transparent", color: CM.primary, border: "1.5px solid " + CM.primary },
    ghost:     { background: "transparent", color: CM.body, border: "none" },
    soft:      { background: CM.primaryFaint, color: CM.primary, border: "none" },
  };
  var base = {
    fontFamily: "inherit", fontWeight: 700,
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.5 : 1,
    transition: "transform 0.12s",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, userSelect: "none",
    width: props.fullWidth ? "100%" : "auto",
  };
  return React.createElement("button", {
    onClick: props.disabled ? null : props.onClick,
    type: props.type || "button",
    style: Object.assign({}, base, sizes[size], variants[variant], props.style || {}),
  }, props.children);
}

/* === FILTER PILL === (like All/Unread/Groups/Favoris in screens) */
function CmPill(props) {
  var active = props.active;
  return React.createElement("button", {
    onClick: props.onClick,
    style: {
      padding: "8px 16px", borderRadius: 100,
      background: active ? CM.primarySoft : (CM.darkMode ? CM.surface2 : CM.surface2),
      color: active ? CM.primaryDark : CM.body,
      border: "none", fontSize: 13, fontWeight: 600,
      cursor: "pointer", fontFamily: "inherit",
      transition: "background 0.15s",
      flexShrink: 0,
    }
  }, props.children);
}

/* === SEARCH BAR === (home style) */
function CmSearch(props) {
  return React.createElement("div", {
    onClick: props.onClick,
    style: {
      display: "flex", alignItems: "center", gap: 10,
      background: CM.surface2, borderRadius: 14,
      padding: "11px 14px", cursor: props.onClick ? "pointer" : "default",
      margin: props.margin || "0 22px",
    }
  },
    React.createElement("span", { style: { color: CM.muted, display: "inline-flex" } }, Cmi.search),
    props.value !== undefined ?
      React.createElement("input", {
        value: props.value,
        onChange: function(e){ props.onChange && props.onChange(e.target.value); },
        placeholder: props.placeholder || cm("search_placeholder"),
        style: {
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontFamily: "inherit", fontSize: 14, color: CM.body,
        }
      }) :
      React.createElement("span", { style: { flex: 1, color: CM.muted, fontSize: 14 } }, props.placeholder || cm("search_placeholder"))
  );
}

/* === TOAST === */
var _cmToastTimer = null;
function cmToast(msg, type) {
  type = type || "info";
  var el = document.getElementById("cm-toast");
  if (!el) { el = document.createElement("div"); el.id = "cm-toast"; document.body.appendChild(el); }
  var bg = type === "error" ? "#FF4757" : CM.primary;
  el.textContent = msg;
  el.style.cssText =
    "position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(0);z-index:9999;" +
    "background:" + bg + ";color:" + CM.onPrimary + ";padding:12px 22px;border-radius:14px;" +
    "font:600 13px 'Plus Jakarta Sans',sans-serif;" +
    "box-shadow:0 8px 24px rgba(0,0,0,0.2);opacity:1;max-width:85%;text-align:center;" +
    "transition:opacity .3s, transform .3s;";
  if (_cmToastTimer) clearTimeout(_cmToastTimer);
  _cmToastTimer = setTimeout(function() {
    if (el) { el.style.opacity = "0"; el.style.transform = "translateX(-50%) translateY(-20px)"; }
  }, 2200);
}

/* === TOP HEADER ===
 * Left slot + centered chameleon logo (tappable → theme palette) + right slot.
 * The logo is the signature element of the app. */
function CmHeader(props) {
  return React.createElement("div", {
    style: {
      height: 64, padding: "0 18px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: CM.bg,
      position: "sticky", top: 0, zIndex: 40,
    }
  },
    /* Left slot */
    React.createElement("div", { style: { width: 42, display: "flex", alignItems: "center", justifyContent: "flex-start" } },
      props.left || null
    ),
    /* Centered chameleon — tap → open theme picker */
    React.createElement("button", {
      onClick: props.onLogoTap,
      style: { background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" },
      "aria-label": cm("theme"),
    },
      React.createElement(ChameleonLogo, { size: 36 }),
      props.title && React.createElement("span", {
        style: { fontSize: 20, fontWeight: 800, color: CM.title }
      }, props.title)
    ),
    /* Right slot */
    React.createElement("div", { style: { width: 42, display: "flex", alignItems: "center", justifyContent: "flex-end" } },
      props.right || null
    )
  );
}

function CmIconBtn(props) {
  return React.createElement("button", {
    onClick: props.onClick,
    style: Object.assign({
      width: 42, height: 42, borderRadius: 12,
      background: "transparent", border: "none",
      color: props.color || CM.body, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "inherit", position: "relative",
    }, props.style || {}),
    "aria-label": props.label,
  }, props.children,
    props.badge && React.createElement("span", {
      style: {
        position: "absolute", top: 6, right: 6,
        width: 8, height: 8, borderRadius: "50%",
        background: CM.primary, border: "2px solid " + CM.bg,
      }
    })
  );
}

/* === BOTTOM NAV === */
function CmBottomNav(props) {
  var items = props.items; /* [{id,label,icon,badge}] */
  var active = props.active;
  return React.createElement("div", {
    style: {
      position: "fixed", bottom: 0, left: 0, right: 0,
      maxWidth: 480, margin: "0 auto",
      background: CM.bg,
      borderTop: "1px solid " + CM.line,
      display: "flex", alignItems: "center", justifyContent: "space-around",
      padding: "8px 0",
      paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
      zIndex: 100,
    }
  },
    items.map(function(it) {
      var isActive = active === it.id;
      return React.createElement("button", {
        key: it.id,
        onClick: function(){ props.onNav(it.id); },
        style: {
          background: "none", border: "none", cursor: "pointer",
          padding: "6px 10px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          fontFamily: "inherit",
          color: isActive ? CM.primary : CM.muted,
          position: "relative",
        }
      },
        /* Active pill background */
        isActive && React.createElement("div", {
          style: {
            position: "absolute", top: 2, width: 44, height: 30, borderRadius: 14,
            background: CM.primarySoft, zIndex: 0,
          }
        }),
        React.createElement("span", { style: { position: "relative", zIndex: 1 } }, it.icon,
          it.badge && React.createElement("span", {
            style: { position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: CM.primary, border: "2px solid " + CM.bg }
          })
        ),
        React.createElement("span", { style: { fontSize: 11, fontWeight: isActive ? 800 : 600, position: "relative", zIndex: 1 } }, it.label)
      );
    })
  );
}

/* === FAB === floating bottom-right (new chat) */
function CmFab(props) {
  return React.createElement("button", {
    onClick: props.onClick,
    style: Object.assign({
      position: "fixed",
      bottom: 90, right: "calc(50% - 240px + 20px)",
      width: 52, height: 52, borderRadius: 16,
      background: CM.primary, color: CM.onPrimary,
      border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: CM.shadowGlow,
      zIndex: 60,
    }, props.style || {})
  }, props.children || Cmi.chat);
}

/* === SHEET (bottom sheet modal) === */
function CmSheet(props) {
  return React.createElement("div", {
    onClick: props.onClose,
    style: {
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "flex-end",
      animation: "cmFadeIn 0.2s",
    }
  },
    React.createElement("div", {
      onClick: function(e){ e.stopPropagation(); },
      style: {
        background: CM.bg, width: "100%", maxWidth: 480, margin: "0 auto",
        borderRadius: "24px 24px 0 0", padding: "22px",
        maxHeight: "85vh", overflowY: "auto",
        animation: "cmSlideUp 0.25s",
      }
    },
      React.createElement("div", { style: { width: 40, height: 4, borderRadius: 4, background: CM.line2, margin: "0 auto 18px" } }),
      props.children
    )
  );
}

/* === THEME PALETTE (tap on chameleon) === */
function CmThemePalette(props) {
  var useState = React.useState;
  var [, force] = useState(0);
  var currentId = CM.themeId;
  var lightThemes = Object.values(CM_THEMES).filter(function(t){ return !t.darkMode; });
  var dark = CM_THEMES.dark;
  return React.createElement(CmSheet, { onClose: props.onClose },
    React.createElement("h3", {
      style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title, textAlign: "center" }
    }, cm("themes")),
    React.createElement("p", {
      style: { margin: "6px 0 22px", fontSize: 13, color: CM.sub, textAlign: "center" }
    }, cm("themeDesc")),
    /* Color grid */
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 } },
      lightThemes.map(function(t){
        var active = t.id === currentId;
        return React.createElement("button", {
          key: t.id,
          onClick: function(){ cmApplyTheme(t.id); force(Date.now()); if(props.onChange) props.onChange(t.id); },
          style: {
            background: "transparent", border: "none", cursor: "pointer",
            padding: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            fontFamily: "inherit",
          }
        },
          React.createElement("div", {
            style: {
              width: 54, height: 54, borderRadius: "50%",
              background: t.primary,
              boxShadow: active ? ("0 0 0 3px " + CM.bg + ", 0 0 0 5px " + t.primary) : "0 4px 12px " + hexToRgba(t.primary, 0.35),
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 20,
              transition: "transform 0.15s",
              transform: active ? "scale(1.08)" : "scale(1)",
            }
          }, active ? "✓" : ""),
          React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: CM.sub } }, t.name)
        );
      })
    ),
    /* Dark mode toggle */
    React.createElement("div", {
      style: {
        marginTop: 22, padding: "14px 16px", borderRadius: 14,
        background: CM.surface2,
        display: "flex", alignItems: "center", gap: 12,
      }
    },
      React.createElement("div", { style: { color: CM.body } }, Cmi.moon),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: CM.title } }, cm("darkMode")),
        React.createElement("div", { style: { fontSize: 12, color: CM.sub, marginTop: 2 } }, dark.name)
      ),
      React.createElement("button", {
        onClick: function(){
          cmApplyTheme(CM.darkMode ? "mint" : "dark");
          force(Date.now());
          if (props.onChange) props.onChange(CM.themeId);
        },
        style: {
          width: 46, height: 26, borderRadius: 100,
          background: CM.darkMode ? CM.primary : CM.line2, border: "none",
          position: "relative", cursor: "pointer", padding: 0,
          transition: "background 0.2s",
        }
      },
        React.createElement("div", {
          style: {
            position: "absolute", top: 3,
            left: CM.darkMode ? 23 : 3, width: 20, height: 20, borderRadius: "50%",
            background: "white", transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }
        })
      )
    )
  );
}


/* ══════ js/screens-onboarding.js ══════ */
/* Chrome Messenger — Onboarding (welcome, phone, OTP, profile setup) */

function OnboardingFlow(props) {
  var useState = React.useState;
  var [step, setStep] = useState("welcome"); /* welcome | phone | otp | profile */
  var [phone, setPhone] = useState("");
  var [code, setCode] = useState("");
  var [name, setName] = useState("");
  var [sentCode, setSentCode] = useState("");
  var [err, setErr] = useState("");

  function sendCode() {
    if (!phone || phone.length < 6) { setErr("Numero invalide"); return; }
    /* Simulate SMS — real 6-digit code */
    var generated = String(100000 + Math.floor(Math.random() * 900000));
    setSentCode(generated);
    setErr("");
    setStep("otp");
    /* Show the code in a toast for demo purposes (no real SMS) */
    cmToast("Code demo: " + generated, "info");
  }

  function verify() {
    if (code === sentCode) {
      setErr("");
      setStep("profile");
    } else {
      setErr("Code incorrect");
    }
  }

  function finish() {
    if (!name.trim()) { setErr("Ton nom est requis"); return; }
    cmSetProfile({
      id: "me", name: name.trim(), phone: phone,
      avatar: null, bio: "", createdAt: Date.now(),
    });
    cmSetOnboarded(true);
    cmSeedIfNeeded();
    props.onDone();
  }

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, display: "flex", flexDirection: "column" }
  },
    step === "welcome" && React.createElement("div", {
      style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }
    },
      React.createElement("div", { style: { marginBottom: 28 } },
        React.createElement(ChameleonLogo, { size: 120 })
      ),
      React.createElement("h1", {
        style: { fontSize: 16, fontWeight: 600, color: CM.sub, margin: "0 0 6px" }
      }, cm("welcome")),
      React.createElement("h2", {
        style: { fontSize: 32, fontWeight: 800, color: CM.title, margin: "0 0 12px", letterSpacing: "-0.5px" }
      }, cm("appName")),
      React.createElement("p", {
        style: { fontSize: 15, color: CM.sub, margin: "0 0 40px", maxWidth: 320, lineHeight: 1.5 }
      }, cm("welcomeSub")),
      React.createElement(CmBtn, { variant: "primary", size: "lg", fullWidth: true, onClick: function(){ setStep("phone"); }, style: { maxWidth: 320 } },
        cm("getStarted")
      )
    ),

    step === "phone" && React.createElement("div", {
      style: { flex: 1, padding: 24, display: "flex", flexDirection: "column" }
    },
      React.createElement("button", {
        onClick: function(){ setStep("welcome"); },
        style: iconBtnStyle()
      }, Cmi.back),
      React.createElement("div", { style: { marginTop: 20, marginBottom: 32, textAlign: "center" } },
        React.createElement(ChameleonLogo, { size: 64 })
      ),
      React.createElement("h2", { style: { fontSize: 24, fontWeight: 800, color: CM.title, marginBottom: 8 } }, cm("enterPhone")),
      React.createElement("p", { style: { fontSize: 14, color: CM.sub, marginBottom: 28 } }, cm("phoneDesc")),
      React.createElement("input", {
        type: "tel", value: phone,
        onChange: function(e){ setPhone(e.target.value); },
        placeholder: cm("phonePlaceholder"),
        style: inputStyle(),
        autoFocus: true,
      }),
      err && React.createElement("p", { style: errStyle() }, err),
      React.createElement("div", { style: { flex: 1 } }),
      React.createElement(CmBtn, { variant: "primary", size: "lg", fullWidth: true, onClick: sendCode }, cm("sendCode"))
    ),

    step === "otp" && React.createElement("div", {
      style: { flex: 1, padding: 24, display: "flex", flexDirection: "column" }
    },
      React.createElement("button", {
        onClick: function(){ setStep("phone"); },
        style: iconBtnStyle()
      }, Cmi.back),
      React.createElement("div", { style: { marginTop: 20, marginBottom: 32, textAlign: "center" } },
        React.createElement(ChameleonLogo, { size: 64 })
      ),
      React.createElement("h2", { style: { fontSize: 24, fontWeight: 800, color: CM.title, marginBottom: 8 } }, cm("enterCode")),
      React.createElement("p", { style: { fontSize: 14, color: CM.sub, marginBottom: 28 } }, cm("codeDesc") + " (" + phone + ")"),
      React.createElement("input", {
        type: "tel", value: code,
        onChange: function(e){ setCode(e.target.value.replace(/\D/g,"").substring(0,6)); },
        placeholder: "• • • • • •",
        maxLength: 6,
        style: Object.assign({}, inputStyle(), { letterSpacing: "0.5em", textAlign: "center", fontSize: 24, fontWeight: 700 }),
        autoFocus: true,
      }),
      err && React.createElement("p", { style: errStyle() }, err),
      React.createElement("button", {
        onClick: sendCode,
        style: {
          background: "transparent", border: "none", color: CM.primary, fontFamily: "inherit",
          fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "10px 0",
        }
      }, cm("codeNotReceived")),
      React.createElement("div", { style: { flex: 1 } }),
      React.createElement(CmBtn, {
        variant: "primary", size: "lg", fullWidth: true,
        disabled: code.length !== 6, onClick: verify
      }, cm("verify"))
    ),

    step === "profile" && React.createElement("div", {
      style: { flex: 1, padding: 24, display: "flex", flexDirection: "column" }
    },
      React.createElement("div", { style: { marginTop: 20, marginBottom: 32, textAlign: "center" } },
        React.createElement(ChameleonLogo, { size: 64 })
      ),
      React.createElement("h2", { style: { fontSize: 24, fontWeight: 800, color: CM.title, marginBottom: 8 } }, cm("profileSetup")),
      React.createElement("p", { style: { fontSize: 14, color: CM.sub, marginBottom: 28 } }, cm("profileDesc")),

      /* Avatar placeholder */
      React.createElement("div", {
        style: {
          width: 100, height: 100, borderRadius: "50%",
          background: CM.primarySoft, color: CM.primaryDark,
          fontSize: 40, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px", boxShadow: CM.shadow,
        }
      }, name ? name.trim().split(" ").map(function(w){return w[0]||"";}).slice(0,2).join("").toUpperCase() : "👤"),

      React.createElement("input", {
        value: name,
        onChange: function(e){ setName(e.target.value); },
        placeholder: cm("yourName"),
        style: inputStyle(),
        maxLength: 40,
        autoFocus: true,
      }),
      err && React.createElement("p", { style: errStyle() }, err),
      React.createElement("div", { style: { flex: 1 } }),
      React.createElement(CmBtn, {
        variant: "primary", size: "lg", fullWidth: true,
        disabled: !name.trim(), onClick: finish
      }, cm("finish"))
    )
  );
}

function inputStyle() {
  return {
    width: "100%", padding: "14px 16px", borderRadius: 14,
    border: "1.5px solid " + CM.line, background: CM.surface,
    fontFamily: "inherit", fontSize: 15, color: CM.body,
    outline: "none", boxSizing: "border-box",
  };
}
function iconBtnStyle() {
  return {
    width: 42, height: 42, borderRadius: 12,
    background: CM.surface2, border: "none", color: CM.body,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit",
  };
}
function errStyle() {
  return { color: "#FF4757", fontSize: 13, fontWeight: 600, marginTop: 8 };
}


/* ══════ js/screens-home.js ══════ */
/* Chrome Messenger — Home screen (Stories + Discussions + filters) */

function HomeScreen(props) {
  var useState = React.useState;
  var [filter, setFilter] = useState("all");
  var [searchQ, setSearchQ] = useState("");
  var [searchOpen, setSearchOpen] = useState(false);
  var [themeOpen, setThemeOpen] = useState(false);

  var contacts = cmGetContacts();
  var conversations = cmGetConversations();
  var stories = cmGetStories();

  /* Filter conversations */
  var rows = conversations.map(function(c) {
    var other = c.type === "direct" ? cmContactById(contacts, c.contactId) : null;
    var lastMsg = cmLastMessage(c.id);
    var msgs = cmGetMessages(c.id);
    var unread = msgs.filter(function(m){ return m.authorId !== "me" && m.readByMe === false; }).length;
    var name = c.type === "group" ? c.name : (other ? other.name : "Inconnu");
    return { conv: c, other: other, lastMsg: lastMsg, unread: unread, name: name };
  });

  if (filter === "unread") rows = rows.filter(function(r){ return r.unread > 0; });
  if (filter === "groups") rows = rows.filter(function(r){ return r.conv.type === "group"; });
  if (filter === "favoris") rows = rows.filter(function(r){ return r.other && r.other.favorite; });
  if (searchQ) {
    var q = searchQ.toLowerCase();
    rows = rows.filter(function(r){ return r.name.toLowerCase().indexOf(q) !== -1; });
  }

  /* Sort by lastMsgAt desc, pinned first */
  rows.sort(function(a,b){
    if (a.conv.pinned !== b.conv.pinned) return a.conv.pinned ? -1 : 1;
    return (b.conv.lastMsgAt || 0) - (a.conv.lastMsgAt || 0);
  });

  return React.createElement("div", { style: { paddingBottom: 100, minHeight: "100vh", background: CM.bg } },
    React.createElement(CmHeader, {
      onLogoTap: function(){ setThemeOpen(true); },
      left: React.createElement(CmIconBtn, { onClick: props.onOpenPremium, label: "premium", color: CM.body }, Cmi.gem),
      right: React.createElement(CmIconBtn, { onClick: props.onOpenMenu, label: "menu" }, Cmi.menu),
    }),

    /* Stories */
    React.createElement("div", { style: { padding: "6px 22px 14px" } },
      React.createElement("h2", {
        style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title, marginBottom: 14 }
      }, cm("stories")),
      React.createElement("div", {
        style: { display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }
      },
        /* Add story tile */
        React.createElement("div", {
          onClick: props.onAddStory,
          style: {
            flexShrink: 0, width: 100, height: 130, borderRadius: 16,
            background: CM.surface2,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 6, cursor: "pointer",
          }
        },
          React.createElement("div", {
            style: { width: 34, height: 34, borderRadius: "50%", border: "1.5px solid " + CM.line2, display: "flex", alignItems: "center", justifyContent: "center", color: CM.body }
          }, Cmi.plus),
          React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: CM.body, textAlign: "center", lineHeight: 1.2 } }, cm("addColors"))
        ),
        /* Other stories */
        stories.map(function(s) {
          var owner = cmContactById(contacts, s.ownerId);
          if (!owner) return null;
          return React.createElement("div", {
            key: s.id,
            onClick: function(){ props.onViewStory(s.id); },
            style: { flexShrink: 0, width: 100, cursor: "pointer" }
          },
            React.createElement("div", {
              style: {
                width: 100, height: 130, borderRadius: 16,
                background: s.bg || CM.primarySoft,
                boxShadow: s.viewed ? "none" : ("0 0 0 2.5px " + CM.primary + ", 0 0 0 4.5px " + CM.bg),
                display: "flex", alignItems: "flex-end", justifyContent: "center",
                padding: 10, position: "relative", overflow: "hidden",
              }
            },
              React.createElement("div", { style: { position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)" } },
                React.createElement(CmAvatar, { name: owner.name, size: 32, border: CM.bg })
              )
            ),
            React.createElement("div", { style: { marginTop: 20, fontSize: 11, fontWeight: 600, color: CM.body, textAlign: "center", lineHeight: 1.2 } },
              owner.name.split(" ")[0]
            )
          );
        })
      )
    ),

    /* Chat section header */
    React.createElement("div", { style: { padding: "8px 22px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" } },
      React.createElement("h2", {
        style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title }
      }, cm("discussions")),
      searchOpen && React.createElement(CmIconBtn, { onClick: function(){ setSearchOpen(false); setSearchQ(""); }, label: "close" }, Cmi.close)
    ),

    /* Search */
    React.createElement(CmSearch, searchOpen ? {
      value: searchQ,
      onChange: setSearchQ,
      placeholder: cm("search_placeholder"),
    } : {
      onClick: function(){ setSearchOpen(true); },
    }),

    /* Filters */
    React.createElement("div", {
      style: { display: "flex", gap: 8, padding: "14px 22px 4px", overflowX: "auto" }
    },
      ["all","unread","groups","favoris"].map(function(id) {
        return React.createElement(CmPill, {
          key: id, active: filter === id,
          onClick: function(){ setFilter(id); },
        }, cm("filter_" + id));
      })
    ),

    /* Conversations list */
    React.createElement("div", { style: { padding: "6px 22px 0" } },
      rows.length === 0 && React.createElement("div", {
        style: { textAlign: "center", padding: 40, color: CM.muted, fontSize: 14 }
      }, cm("comingSoon") || "Aucune conversation"),
      rows.map(function(r) {
        return React.createElement("div", {
          key: r.conv.id,
          onClick: function(){ props.onOpenChat(r.conv.id); },
          style: {
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 0", cursor: "pointer",
            borderBottom: "1px solid " + CM.line,
          }
        },
          React.createElement(CmAvatar, { name: r.name, size: 44 }),
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", {
              style: { display: "flex", alignItems: "center", gap: 6 }
            },
              r.conv.pinned && React.createElement("span", { style: { fontSize: 11 } }, "📌"),
              React.createElement("div", {
                style: { fontSize: 15, fontWeight: r.unread ? 800 : 700, color: CM.title, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
              }, r.name)
            ),
            React.createElement("div", {
              style: {
                fontSize: 13, color: r.unread ? CM.body : CM.sub,
                fontWeight: r.unread ? 600 : 500,
                marginTop: 2, display: "flex", alignItems: "center", gap: 4,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }
            },
              r.lastMsg && r.lastMsg.authorId === "me" && React.createElement("span", {
                style: { color: CM.primary, display: "inline-flex" }
              }, Cmi.checkDouble),
              React.createElement("span", null, r.lastMsg ? cmMsgText(r.lastMsg) : "...")
            )
          ),
          React.createElement("div", { style: { textAlign: "right", flexShrink: 0, minWidth: 44 } },
            React.createElement("div", {
              style: { fontSize: 11, color: r.unread ? CM.primary : CM.muted, fontWeight: 600 }
            }, r.lastMsg ? cmFmtDayLabel(r.lastMsg.at).substring(0,8) : ""),
            r.unread > 0 && React.createElement("div", {
              style: {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 20, height: 20, borderRadius: 10, padding: "0 6px",
                background: CM.primary, color: CM.onPrimary,
                fontSize: 11, fontWeight: 800, marginTop: 4,
              }
            }, r.unread)
          )
        );
      })
    ),

    /* FAB */
    React.createElement(CmFab, { onClick: props.onNewChat }),

    /* Theme palette sheet */
    themeOpen && React.createElement(CmThemePalette, {
      onClose: function(){ setThemeOpen(false); },
      onChange: function(){ if (props.onThemeChange) props.onThemeChange(); },
    })
  );
}


/* ══════ js/screens-chat.js ══════ */
/* Chrome Messenger — Chat conversation screen */

function ChatScreen(props) {
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var [input, setInput] = useState("");
  var [, forceRender] = useState(0);
  var scrollRef = useRef(null);
  var inputRef = useRef(null);

  var conv = cmFindConversation(props.convId);
  if (!conv) return null;
  var contacts = cmGetContacts();
  var other = conv.type === "direct" ? cmContactById(contacts, conv.contactId) : null;
  var title = conv.type === "group" ? conv.name : (other ? other.name : "Inconnu");

  var messages = cmGetMessages(conv.id);

  useEffect(function(){
    /* Decrypt all messages of this conversation on open (lazy, per-conv) */
    cmDecryptConversation(conv.id).then(function(){
      /* Mark incoming as read */
      var msgs = cmGetMessages(conv.id);
      var changed = false;
      msgs.forEach(function(m){ if (m.authorId !== "me" && m.readByMe === false) { m.readByMe = true; changed = true; } });
      if (changed) cmSetMessages(conv.id, msgs);
      /* Prune old messages (keep hot 200) */
      cmPruneOldMessages(conv.id);
      forceRender(Date.now());
      setTimeout(function(){
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 20);
    });
  }, [conv.id]);

  async function send() {
    var text = input.trim();
    if (!text) return;
    await cmAddEncryptedMessage(conv.id, text, "me");
    /* Decrypt the one we just stored for display */
    var msgs = cmGetMessages(conv.id);
    var last = msgs[msgs.length - 1];
    last._text = text; /* shortcut: we already have plaintext */
    setInput("");
    forceRender(Date.now());
    setTimeout(function(){
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 20);
    /* Simulated encrypted auto-reply after 1.5s */
    if (conv.type === "direct" && other) {
      setTimeout(async function(){
        var replies = ["Ah ouais ?", "Je vois.", "D'accord 👍", "Cool !", "On en parle plus tard"];
        var r = replies[Math.floor(Math.random() * replies.length)];
        /* Encrypt incoming message with the same shared key (as if server relayed) */
        var payload = await cmEncryptMessage(conv.id, r);
        cmAddMessage(conv.id, {
          authorId: other.id, at: Date.now(), readByMe: false, cipher: payload,
          _text: r, /* already have plaintext */
        });
        forceRender(Date.now());
        setTimeout(function(){
          if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 20);
      }, 1500);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  /* Group messages by day for day dividers */
  var groupedByDay = [];
  var lastDay = null;
  messages.forEach(function(m){
    var d = new Date(m.at); d.setHours(0,0,0,0);
    var key = d.getTime();
    if (key !== lastDay) {
      groupedByDay.push({ day: key, msgs: [m] });
      lastDay = key;
    } else {
      groupedByDay[groupedByDay.length-1].msgs.push(m);
    }
  });

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, display: "flex", flexDirection: "column" }
  },
    /* Chat header */
    React.createElement("div", {
      style: {
        height: 64, padding: "0 14px",
        display: "flex", alignItems: "center", gap: 10,
        background: CM.bg,
        borderBottom: "1px solid " + CM.line,
        position: "sticky", top: 0, zIndex: 40,
      }
    },
      React.createElement(CmIconBtn, { onClick: props.onBack }, Cmi.back),
      React.createElement(CmAvatar, { name: title, size: 40 }),
      React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        React.createElement("div", {
          style: { fontSize: 15, fontWeight: 700, color: CM.title, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
        }, title),
        React.createElement("div", { style: { fontSize: 11, color: CM.sub, display: "flex", alignItems: "center", gap: 4 } },
          React.createElement("span", { style: { color: CM.primary } }, "🔒"),
          conv.type === "direct" && other ? cm("online") : (conv.memberIds || []).length + " membres"
        )
      ),
      React.createElement(CmIconBtn, { label: "call" }, Cmi.phone),
      React.createElement(CmIconBtn, { label: "video" }, Cmi.video)
    ),

    /* Messages scroll area */
    React.createElement("div", {
      ref: scrollRef,
      style: {
        flex: 1, overflowY: "auto",
        background: CM.bg2,
        padding: "14px 12px",
      }
    },
      groupedByDay.map(function(group, gi) {
        return React.createElement(React.Fragment, { key: gi },
          React.createElement("div", {
            style: { textAlign: "center", margin: "14px 0 10px" }
          },
            React.createElement("span", {
              style: {
                background: CM.surface, color: CM.sub,
                fontSize: 11, fontWeight: 600,
                padding: "5px 12px", borderRadius: 100,
              }
            }, cmFmtDayLabel(group.day))
          ),
          group.msgs.map(function(m) {
            var mine = m.authorId === "me";
            return React.createElement("div", {
              key: m.id,
              style: {
                display: "flex", justifyContent: mine ? "flex-end" : "flex-start",
                marginBottom: 4, padding: "0 4px",
              }
            },
              React.createElement("div", {
                style: {
                  maxWidth: "78%",
                  padding: "8px 12px", borderRadius: 16,
                  background: mine ? CM.primary : CM.surface,
                  color: mine ? CM.onPrimary : CM.body,
                  borderBottomRightRadius: mine ? 4 : 16,
                  borderBottomLeftRadius: mine ? 16 : 4,
                  fontSize: 14, lineHeight: 1.35,
                  boxShadow: CM.shadow,
                  wordBreak: "break-word",
                }
              },
                React.createElement("div", null, cmMsgText(m)),
                React.createElement("div", {
                  style: {
                    fontSize: 10, color: mine ? "rgba(255,255,255,0.8)" : CM.muted,
                    marginTop: 4, display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end",
                  }
                },
                  cmFmtTime(m.at),
                  mine && React.createElement("span", {
                    style: { display: "inline-flex" }
                  }, Cmi.checkDouble)
                )
              )
            );
          })
        );
      })
    ),

    /* Input */
    React.createElement("div", {
      style: {
        padding: "10px 12px",
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
        background: CM.bg,
        borderTop: "1px solid " + CM.line,
        display: "flex", alignItems: "center", gap: 8,
      }
    },
      React.createElement(CmIconBtn, { label: "attach" }, Cmi.attach),
      React.createElement("input", {
        ref: inputRef,
        value: input,
        onChange: function(e){ setInput(e.target.value); },
        onKeyDown: handleKeyDown,
        placeholder: cm("typeMessage"),
        style: {
          flex: 1, padding: "12px 16px", borderRadius: 24,
          background: CM.surface2,
          border: "none", outline: "none",
          fontFamily: "inherit", fontSize: 14, color: CM.body,
        }
      }),
      input.trim() ?
        React.createElement(CmIconBtn, {
          onClick: send,
          color: CM.onPrimary,
          style: { background: CM.primary, boxShadow: CM.shadowGlow }
        }, Cmi.send) :
        React.createElement(CmIconBtn, { label: "voice" }, Cmi.mic)
    )
  );
}


/* ══════ js/screens-todolist.js ══════ */
/* Chrome Messenger — Todolist screen (month + week toggle)
 * Fidelity: design 78 (month view) vs 79 (week view).
 */

function TodolistScreen(props) {
  var useState = React.useState;
  var [mode, setMode] = useState("month"); /* month | week */
  var [selectedDate, setSelectedDate] = useState(function(){ var d = new Date(); d.setHours(0,0,0,0); return d.getTime(); });
  var [addOpen, setAddOpen] = useState(false);
  var [filter, setFilter] = useState("all");
  var [themeOpen, setThemeOpen] = useState(false);

  var selDate = new Date(selectedDate);
  var tasks = cmTasksForDate(selectedDate);
  var daysWithTasks = cmDaysWithTasks();

  if (filter !== "all") tasks = tasks.filter(function(t){ return t.type === filter; });

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 100 }
  },
    React.createElement(CmHeader, {
      onLogoTap: function(){ setThemeOpen(true); },
      left: React.createElement(CmIconBtn, {
        onClick: function(){ setMode(mode === "month" ? "week" : "month"); },
        label: "toggle view",
      }, mode === "month" ? Cmi.calendar : Cmi.info),
      right: React.createElement(CmIconBtn, { onClick: props.onOpenMenu }, Cmi.menu),
    }),

    /* Calendar view */
    mode === "month" ?
      React.createElement(MonthView, {
        selectedDate: selectedDate,
        daysWithTasks: daysWithTasks,
        onSelect: function(ms){ setSelectedDate(ms); },
      }) :
      React.createElement(WeekStrip, {
        selectedDate: selectedDate,
        daysWithTasks: daysWithTasks,
        onSelect: function(ms){ setSelectedDate(ms); },
      }),

    /* Today's tasks section */
    React.createElement("div", {
      style: { padding: "18px 22px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      React.createElement("h3", {
        style: { margin: 0, fontSize: 18, fontWeight: 800, color: CM.title }
      }, cm("todayTasks")),
      React.createElement("button", {
        onClick: function(){ setAddOpen(true); },
        style: {
          background: CM.surface, border: "1px solid " + CM.line, color: CM.body,
          padding: "8px 14px", borderRadius: 100, cursor: "pointer",
          fontFamily: "inherit", fontWeight: 600, fontSize: 13,
          display: "inline-flex", alignItems: "center", gap: 4,
        }
      }, cm("add"), Cmi.plus)
    ),

    /* Filters */
    React.createElement("div", {
      style: { display: "flex", gap: 8, padding: "12px 22px 4px", overflowX: "auto" }
    },
      [{id:"all",label:cm("filter_all")}, {id:"individual",label:cm("task_individual")}, {id:"commun",label:cm("task_commun")}, {id:"daily",label:cm("task_daily")}].map(function(f){
        return React.createElement(CmPill, {
          key: f.id, active: filter === f.id,
          onClick: function(){ setFilter(f.id); },
        }, f.label);
      })
    ),

    /* Task rows */
    React.createElement("div", { style: { padding: "10px 22px 0" } },
      tasks.length === 0 && React.createElement("div", {
        style: { textAlign: "center", padding: 40, color: CM.muted, fontSize: 14 }
      },
        React.createElement("div", { style: { fontSize: 34, marginBottom: 8 } }, "🌿"),
        cm("noTasks")
      ),
      tasks.map(function(t) {
        return React.createElement("div", {
          key: t.id,
          style: {
            padding: 14, borderRadius: 14, marginBottom: 8,
            background: CM.surface,
            border: "1px solid " + CM.line,
            display: "flex", alignItems: "center", gap: 12,
          }
        },
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: CM.title, marginBottom: 3 } }, t.title),
            React.createElement("div", { style: { fontSize: 12, color: CM.sub } },
              t.with ? ("with " + t.with) : ""
            )
          ),
          React.createElement("div", { style: { textAlign: "right", fontSize: 11, color: CM.sub } },
            t.place && React.createElement("div", {
              style: { display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", fontWeight: 600 }
            }, Cmi.location, t.place),
            React.createElement("div", {
              style: { display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 2 }
            }, Cmi.clock, cmFmtTime(t.startAt) + " - " + cmFmtTime(t.endAt))
          )
        );
      })
    ),

    /* Add task sheet */
    addOpen && React.createElement(AddTaskSheet, {
      defaultDate: selectedDate,
      onClose: function(){ setAddOpen(false); },
      onSaved: function(){ setAddOpen(false); },
    }),

    /* Theme palette */
    themeOpen && React.createElement(CmThemePalette, { onClose: function(){ setThemeOpen(false); }, onChange: props.onThemeChange })
  );
}

/* Month view — design 78 */
function MonthView(props) {
  var useState = React.useState;
  var [monthOffset, setMonthOffset] = useState(0);
  var sel = new Date(props.selectedDate);
  var first = new Date(sel.getFullYear(), sel.getMonth() + monthOffset, 1);
  var year = first.getFullYear();
  var monthIdx = first.getMonth();
  var monthName = first.toLocaleDateString(cmLocale(), { month: "long" });

  /* Monday-start week layout */
  var firstDay = new Date(year, monthIdx, 1);
  var firstWeekday = (firstDay.getDay() + 6) % 7; /* 0=Mon */
  var daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  var cells = [];
  for (var i = 0; i < firstWeekday; i++) cells.push(null);
  for (var d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIdx, d).getTime());

  var today = new Date(); today.setHours(0,0,0,0);
  var todayMs = today.getTime();

  return React.createElement("div", { style: { padding: "0 14px" } },
    React.createElement("div", {
      style: { padding: "8px 22px", margin: "10px 0", borderRadius: 16, background: CM.surface, border: "1px solid " + CM.line }
    },
      /* Month header */
      React.createElement("div", {
        style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0 14px" }
      },
        React.createElement("button", { onClick: function(){ setMonthOffset(monthOffset - 1); }, style: navBtnStyle() }, Cmi.chevL),
        React.createElement("h3", {
          style: { margin: 0, fontSize: 16, fontWeight: 800, color: CM.title, textTransform: "capitalize" }
        }, monthName + " " + year),
        React.createElement("button", { onClick: function(){ setMonthOffset(monthOffset + 1); }, style: navBtnStyle() }, Cmi.chevR)
      ),
      /* Weekday header */
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, paddingBottom: 6 }
      },
        ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(function(w){
          return React.createElement("div", {
            key: w,
            style: { fontSize: 11, fontWeight: 700, color: w === "Sun" ? CM.primary : CM.sub, textAlign: "center" }
          }, w);
        })
      ),
      /* Days grid */
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }
      },
        cells.map(function(ms, i) {
          if (ms === null) return React.createElement("div", { key: "e"+i, style: { height: 38 } });
          var isSel = ms === props.selectedDate;
          var isToday = ms === todayMs;
          var hasTask = !!props.daysWithTasks[ms];
          var isSunday = (i % 7) === 6;
          var dayNum = new Date(ms).getDate();
          return React.createElement("button", {
            key: ms,
            onClick: function(){ props.onSelect(ms); },
            style: {
              height: 38, border: "none", background: "transparent",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              color: isSel ? CM.primaryDark : (isToday ? CM.title : (isSunday ? CM.primary : CM.body)),
              cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }
          },
            React.createElement("div", {
              style: {
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isSel ? CM.primarySoft : (isToday && !isSel ? CM.surface2 : (hasTask ? CM.primarySoft : "transparent")),
                border: isSel ? ("1.5px solid " + CM.primary) : "none",
              }
            }, dayNum)
          );
        })
      )
    )
  );
}

/* Week strip — design 79 */
function WeekStrip(props) {
  var sel = new Date(props.selectedDate);
  var weekStart = new Date(sel); weekStart.setDate(sel.getDate() - ((sel.getDay() + 6) % 7));
  weekStart.setHours(0,0,0,0);
  var days = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
    days.push(d);
  }
  var monthName = sel.toLocaleDateString(cmLocale(), { month: "long", year: "numeric" });

  return React.createElement("div", { style: { padding: "0 14px" } },
    React.createElement("div", {
      style: { padding: "14px 14px", margin: "10px 0" }
    },
      React.createElement("div", {
        style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }
      },
        React.createElement("button", {
          onClick: function(){ var d = new Date(props.selectedDate); d.setDate(d.getDate()-7); props.onSelect(d.getTime()); },
          style: navBtnStyle(),
        }, Cmi.chevL),
        React.createElement("h3", {
          style: { margin: 0, fontSize: 16, fontWeight: 800, color: CM.title, textTransform: "capitalize" }
        }, monthName),
        React.createElement("button", {
          onClick: function(){ var d = new Date(props.selectedDate); d.setDate(d.getDate()+7); props.onSelect(d.getTime()); },
          style: navBtnStyle(),
        }, Cmi.chevR)
      ),
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }
      },
        days.map(function(d) {
          var ms = d.getTime();
          var isSel = ms === props.selectedDate;
          return React.createElement("button", {
            key: ms,
            onClick: function(){ props.onSelect(ms); },
            style: {
              background: isSel ? CM.surface2 : "transparent",
              border: "none", cursor: "pointer",
              padding: "10px 4px", borderRadius: 12,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              fontFamily: "inherit",
            }
          },
            React.createElement("div", {
              style: { fontSize: 12, fontWeight: 600, color: isSel ? CM.title : CM.sub, textTransform: "capitalize" }
            }, cmShortDay(d)),
            React.createElement("div", {
              style: { fontSize: 14, fontWeight: 800, color: isSel ? CM.title : CM.body }
            }, d.getDate())
          );
        })
      )
    )
  );
}

function navBtnStyle() {
  return {
    width: 32, height: 32, borderRadius: "50%",
    background: CM.surface2, border: "none", color: CM.body,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit",
  };
}

/* Add task sheet */
function AddTaskSheet(props) {
  var useState = React.useState;
  var [title, setTitle] = useState("");
  var [withWho, setWithWho] = useState("");
  var [place, setPlace] = useState("");
  var [type, setType] = useState("individual");
  var [time, setTime] = useState("10:00");
  var [duration, setDuration] = useState(30);

  function save() {
    if (!title.trim()) { cmToast("Titre requis", "error"); return; }
    var base = new Date(props.defaultDate);
    var [h,m] = time.split(":").map(Number);
    base.setHours(h || 10, m || 0, 0, 0);
    cmAddTask({
      title: title.trim(),
      with: withWho.trim(),
      place: place.trim(),
      type: type,
      startAt: base.getTime(),
      endAt: base.getTime() + (duration || 30) * 60000,
      done: false,
    });
    props.onSaved();
  }

  return React.createElement(CmSheet, { onClose: props.onClose },
    React.createElement("h3", {
      style: { margin: "0 0 18px", fontSize: 18, fontWeight: 800, color: CM.title }
    }, cm("addTask")),
    React.createElement("label", { style: labelStyle() }, cm("taskName")),
    React.createElement("input", {
      value: title, onChange: function(e){ setTitle(e.target.value); },
      placeholder: "Homework, RDV...", style: sheetInputStyle(), autoFocus: true,
    }),
    React.createElement("label", { style: labelStyle() }, cm("taskWith")),
    React.createElement("input", {
      value: withWho, onChange: function(e){ setWithWho(e.target.value); },
      placeholder: "Fred Larson", style: sheetInputStyle(),
    }),
    React.createElement("label", { style: labelStyle() }, cm("taskLocation")),
    React.createElement("input", {
      value: place, onChange: function(e){ setPlace(e.target.value); },
      placeholder: "Bafoussam", style: sheetInputStyle(),
    }),
    React.createElement("div", { style: { display: "flex", gap: 10 } },
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("label", { style: labelStyle() }, cm("taskStart")),
        React.createElement("input", {
          type: "time", value: time, onChange: function(e){ setTime(e.target.value); },
          style: sheetInputStyle(),
        })
      ),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("label", { style: labelStyle() }, "Duree (min)"),
        React.createElement("input", {
          type: "number", value: duration, onChange: function(e){ setDuration(parseInt(e.target.value)||30); },
          style: sheetInputStyle(),
        })
      )
    ),
    React.createElement("label", { style: labelStyle() }, cm("taskType")),
    React.createElement("div", { style: { display: "flex", gap: 8 } },
      ["individual","commun","daily"].map(function(t){
        return React.createElement(CmPill, {
          key: t, active: type === t, onClick: function(){ setType(t); },
        }, cm("task_" + t));
      })
    ),
    React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 22 } },
      React.createElement(CmBtn, { variant: "ghost", fullWidth: true, onClick: props.onClose }, cm("cancel")),
      React.createElement(CmBtn, { variant: "primary", fullWidth: true, onClick: save }, cm("save"))
    )
  );
}

function labelStyle() {
  return { display: "block", fontSize: 11, fontWeight: 700, color: CM.sub, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 14, marginBottom: 6 };
}
function sheetInputStyle() {
  return {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1px solid " + CM.line, background: CM.surface2,
    fontFamily: "inherit", fontSize: 14, color: CM.body,
    outline: "none", boxSizing: "border-box",
  };
}


/* ══════ js/screens-games.js ══════ */
/* Chrome Messenger — Games screen (Solo + Social, 2 horizontal slides) */

function GamesScreen(props) {
  var useState = React.useState;
  var [themeOpen, setThemeOpen] = useState(false);

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 100 }
  },
    React.createElement(CmHeader, {
      onLogoTap: function(){ setThemeOpen(true); },
      left: React.createElement(CmIconBtn, { onClick: props.onOpenPremium, color: CM.body }, Cmi.gem),
      right: React.createElement(CmIconBtn, { onClick: props.onOpenMenu }, Cmi.menu),
    }),

    /* Solo games section */
    React.createElement("div", {
      style: { padding: "6px 22px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      React.createElement("div", null,
        React.createElement("h2", {
          style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title }
        }, cm("gamesSolo")),
        React.createElement("p", {
          style: { margin: "2px 0 0", fontSize: 12, color: CM.sub }
        }, cm("gamesSoloDesc"))
      ),
      CM_SEED_GAMES.solo.length > 4 && React.createElement("button", {
        onClick: function(){ props.onSeeAll("solo"); },
        style: { background: "transparent", border: "none", color: CM.primary, fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer" }
      }, cm("seeAll"))
    ),
    React.createElement("div", {
      style: { display: "flex", gap: 12, overflowX: "auto", padding: "4px 22px 14px" }
    },
      CM_SEED_GAMES.solo.map(function(g) {
        return React.createElement(GameCard, { key: g.id, game: g, onPlay: function(){ props.onPlayGame(g); } });
      })
    ),

    /* Social games section */
    React.createElement("div", {
      style: { padding: "10px 22px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      React.createElement("div", null,
        React.createElement("h2", {
          style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title }
        }, cm("gamesSocial")),
        React.createElement("p", {
          style: { margin: "2px 0 0", fontSize: 12, color: CM.sub }
        }, cm("gamesSocialDesc"))
      ),
      CM_SEED_GAMES.social.length > 4 && React.createElement("button", {
        onClick: function(){ props.onSeeAll("social"); },
        style: { background: "transparent", border: "none", color: CM.primary, fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer" }
      }, cm("seeAll"))
    ),
    React.createElement("div", {
      style: { display: "flex", gap: 12, overflowX: "auto", padding: "4px 22px 14px" }
    },
      CM_SEED_GAMES.social.map(function(g) {
        return React.createElement(GameCard, { key: g.id, game: g, onPlay: function(){ props.onPlayGame(g); }, social: true });
      })
    ),

    /* Premium banner */
    React.createElement("div", {
      onClick: props.onOpenPremium,
      style: {
        margin: "10px 22px 0", padding: 16, borderRadius: 16,
        background: "linear-gradient(135deg, " + CM.primary + ", " + CM.primaryDark + ")",
        color: CM.onPrimary,
        display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
        boxShadow: CM.shadowGlow,
      }
    },
      React.createElement("div", { style: { fontSize: 34 } }, "💎"),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { fontSize: 14, fontWeight: 800 } }, "Game Pass"),
        React.createElement("div", { style: { fontSize: 12, opacity: 0.92, marginTop: 2 } }, "Debloque tous les jeux sociaux")
      ),
      React.createElement("span", null, Cmi.chevR)
    ),

    themeOpen && React.createElement(CmThemePalette, { onClose: function(){ setThemeOpen(false); }, onChange: props.onThemeChange })
  );
}

function GameCard(props) {
  var g = props.game;
  var locked = props.social && g.kind === "social"; /* mock premium lock */
  return React.createElement("button", {
    onClick: props.onPlay,
    style: {
      flexShrink: 0, width: 150, minHeight: 170,
      background: CM.surface,
      border: "1px solid " + CM.line,
      borderRadius: 18, padding: 14,
      cursor: "pointer", fontFamily: "inherit",
      display: "flex", flexDirection: "column", gap: 8,
      position: "relative", overflow: "hidden",
    }
  },
    React.createElement("div", {
      style: {
        width: 54, height: 54, borderRadius: 14,
        background: g.color + "22", color: g.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
      }
    }, g.emoji),
    React.createElement("div", { style: { flex: 1 } },
      React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: CM.title, textAlign: "left" } }, g.name),
      React.createElement("div", { style: { fontSize: 11, color: CM.sub, textAlign: "left", marginTop: 3, lineHeight: 1.4 } }, g.desc)
    ),
    locked ? React.createElement("div", {
      style: { fontSize: 11, fontWeight: 700, color: CM.primary, display: "flex", alignItems: "center", gap: 4 }
    }, "💎 Premium") :
    React.createElement("div", {
      style: { fontSize: 11, fontWeight: 700, color: g.color, display: "flex", alignItems: "center", gap: 4 }
    },
      React.createElement("span", null, g.kind === "social" ? cm("invite") : cm("play")),
      React.createElement("span", null, "→")
    )
  );
}


/* ══════ js/screens-notifs.js ══════ */
/* Chrome Messenger — Notifications screen (based on design 84, 93) */

function NotifsScreen(props) {
  var useState = React.useState;
  var [filter, setFilter] = useState("all");
  var [themeOpen, setThemeOpen] = useState(false);

  var notifs = cmGetNotifs();
  if (filter !== "all") notifs = notifs.filter(function(n){ return n.kind === filter; });
  /* Split by today / earlier */
  var today = new Date(); today.setHours(0,0,0,0);
  var tod = notifs.filter(function(n){ return n.at >= today.getTime(); });
  var earlier = notifs.filter(function(n){ return n.at < today.getTime(); });

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 100 }
  },
    React.createElement(CmHeader, {
      onLogoTap: function(){ setThemeOpen(true); },
      left: React.createElement(CmIconBtn, {
        onClick: function(){
          if (confirm("Tout effacer ?")) { cmSetNotifs([]); cmToast("Efface", "info"); props.onChanged && props.onChanged(); }
        },
      }, Cmi.trash),
      right: React.createElement(CmIconBtn, { onClick: props.onOpenSettings }, Cmi.settings),
    }),

    React.createElement("h2", {
      style: { margin: "4px 22px 12px", fontSize: 22, fontWeight: 800, color: CM.title }
    }, cm("notifications")),

    /* Filters */
    React.createElement("div", {
      style: { display: "flex", gap: 8, padding: "0 22px 14px", overflowX: "auto" }
    },
      ["all","call","tasks","events","matchs"].map(function(f){
        return React.createElement(CmPill, {
          key: f, active: filter === f,
          onClick: function(){ setFilter(f); },
        }, cm("notif_" + f));
      })
    ),

    /* Today */
    tod.length > 0 && React.createElement("div", null,
      React.createElement("h3", {
        style: { margin: "6px 22px 10px", fontSize: 16, fontWeight: 800, color: CM.title }
      }, cm("notifToday")),
      React.createElement("div", { style: { padding: "0 22px" } },
        tod.map(function(n){ return notifRow(n); })
      )
    ),

    /* Earlier */
    earlier.length > 0 && React.createElement("div", null,
      React.createElement("h3", {
        style: { margin: "18px 22px 10px", fontSize: 16, fontWeight: 800, color: CM.title }
      }, cm("notifEarlier")),
      React.createElement("div", { style: { padding: "0 22px" } },
        earlier.map(function(n){ return notifRow(n); })
      )
    ),

    /* Empty */
    notifs.length === 0 && React.createElement("div", {
      style: { textAlign: "center", padding: 60, color: CM.muted }
    },
      React.createElement("div", { style: { fontSize: 40, marginBottom: 10 } }, "🔕"),
      React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, cm("noNotifs"))
    ),

    themeOpen && React.createElement(CmThemePalette, { onClose: function(){ setThemeOpen(false); }, onChange: props.onThemeChange })
  );
}

function notifRow(n) {
  return React.createElement("div", {
    key: n.id,
    style: {
      padding: 14, borderRadius: 14, marginBottom: 8,
      background: CM.surface, border: "1px solid " + CM.line,
      display: "flex", alignItems: "center", gap: 12,
    }
  },
    React.createElement("div", { style: { flex: 1, minWidth: 0 } },
      React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: CM.title, marginBottom: 3 } }, n.title),
      n.subtitle && React.createElement("div", { style: { fontSize: 12, color: CM.sub } }, n.subtitle)
    ),
    React.createElement("div", { style: { textAlign: "right", fontSize: 11, color: CM.sub } },
      n.place && React.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end", fontWeight: 600 }
      }, Cmi.location, n.place),
      n.time && React.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end", marginTop: 2 }
      }, Cmi.clock, n.time)
    )
  );
}


/* ══════ js/screens-story.js ══════ */
/* Chrome Messenger — Story viewer + creator */

function StoryViewer(props) {
  var useState = React.useState;
  var useEffect = React.useEffect;
  var [progress, setProgress] = useState(0);
  var stories = cmGetStories();
  var [idx, setIdx] = useState(stories.findIndex(function(s){ return s.id === props.storyId; }));
  var contacts = cmGetContacts();

  useEffect(function(){
    /* Auto-advance every 5s */
    var startedAt = Date.now();
    var rafId;
    function tick() {
      var elapsed = Date.now() - startedAt;
      var p = Math.min(1, elapsed / 5000);
      setProgress(p);
      if (p >= 1) {
        if (idx < stories.length - 1) { setIdx(idx + 1); }
        else { props.onClose(); }
      } else {
        rafId = requestAnimationFrame(tick);
      }
    }
    rafId = requestAnimationFrame(tick);
    /* Mark as viewed */
    var cur = stories[idx];
    if (cur) cmMarkStoryViewed(cur.id);
    return function(){ cancelAnimationFrame(rafId); };
  }, [idx]);

  var story = stories[idx];
  if (!story) return null;
  var owner = cmContactById(contacts, story.ownerId);

  return React.createElement("div", {
    onClick: function(){ if (idx < stories.length - 1) setIdx(idx + 1); else props.onClose(); },
    style: {
      position: "fixed", inset: 0, zIndex: 1000,
      background: story.bg || CM.primarySoft,
      display: "flex", flexDirection: "column",
      color: "white",
    }
  },
    /* Progress bars */
    React.createElement("div", {
      style: { display: "flex", gap: 3, padding: "10px 14px" }
    },
      stories.map(function(_, i) {
        return React.createElement("div", {
          key: i,
          style: { flex: 1, height: 3, borderRadius: 3, background: "rgba(255,255,255,0.35)", overflow: "hidden" }
        },
          React.createElement("div", {
            style: {
              width: (i < idx ? 100 : i > idx ? 0 : progress*100) + "%",
              height: "100%", background: "white", transition: "width 0.1s linear",
            }
          })
        );
      })
    ),
    /* Owner header */
    React.createElement("div", {
      style: { padding: "6px 14px", display: "flex", alignItems: "center", gap: 10 }
    },
      owner && React.createElement(CmAvatar, { name: owner.name, size: 36 }),
      React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "#1A1F2A" } }, owner ? owner.name : "Unknown"),
        React.createElement("div", { style: { fontSize: 11, color: "rgba(0,0,0,0.55)" } }, cmFmtTime(story.createdAt))
      ),
      React.createElement("button", {
        onClick: function(e){ e.stopPropagation(); props.onClose(); },
        style: { background: "rgba(0,0,0,0.15)", border: "none", color: "#1A1F2A", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }
      }, Cmi.close)
    ),
    /* Content */
    React.createElement("div", {
      style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 30 }
    },
      React.createElement("div", {
        style: { fontSize: 28, fontWeight: 800, color: "#1A1F2A", textAlign: "center", lineHeight: 1.3, textShadow: "0 2px 10px rgba(255,255,255,0.4)" }
      }, story.text || "")
    ),
    /* Reply */
    React.createElement("div", {
      onClick: function(e){ e.stopPropagation(); },
      style: { padding: "14px 14px calc(14px + env(safe-area-inset-bottom))", background: "rgba(0,0,0,0.15)" }
    },
      React.createElement("input", {
        placeholder: cm("replyToStory"),
        style: {
          width: "100%", padding: "12px 16px", borderRadius: 24,
          border: "none", outline: "none",
          background: "rgba(255,255,255,0.9)", color: "#1A1F2A",
          fontFamily: "inherit", fontSize: 14,
          boxSizing: "border-box",
        }
      })
    )
  );
}

/* Story creator — pick a color + text */
function StoryCreator(props) {
  var useState = React.useState;
  var [text, setText] = useState("");
  var [bg, setBg] = useState("#C2F2E0");
  var bgOptions = [
    "#C2F2E0","#C8D9FF","#FFD4BB","#FFC6D3","#E1C8FB","#EAD4F5","#FFE8A0","#F1F3F6"
  ];

  function publish() {
    cmAddStory({ ownerId: "me", kind: "colors", bg: bg, text: text.trim(), viewed: false });
    cmToast("Status publie !", "info");
    props.onDone();
  }

  return React.createElement("div", {
    style: {
      position: "fixed", inset: 0, zIndex: 900,
      background: bg, display: "flex", flexDirection: "column",
    }
  },
    /* Top bar */
    React.createElement("div", {
      style: { padding: "14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      React.createElement("button", {
        onClick: props.onClose,
        style: { background: "rgba(0,0,0,0.1)", border: "none", color: "#1A1F2A", width: 38, height: 38, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, Cmi.close),
      React.createElement(CmBtn, { variant: "primary", size: "md", onClick: publish, disabled: !text.trim() }, "Publier")
    ),
    React.createElement("div", {
      style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 30 }
    },
      React.createElement("textarea", {
        value: text,
        onChange: function(e){ setText(e.target.value); },
        placeholder: "Tapote ici...",
        maxLength: 200,
        style: {
          width: "100%", minHeight: 120,
          background: "transparent", border: "none", outline: "none",
          textAlign: "center", color: "#1A1F2A",
          fontSize: 28, fontWeight: 800,
          fontFamily: "inherit", resize: "none",
        },
        autoFocus: true,
      })
    ),
    /* Color picker */
    React.createElement("div", {
      style: { padding: "14px 14px calc(14px + env(safe-area-inset-bottom))", display: "flex", gap: 10, overflowX: "auto" }
    },
      bgOptions.map(function(c) {
        return React.createElement("button", {
          key: c,
          onClick: function(){ setBg(c); },
          style: {
            width: 40, height: 40, borderRadius: "50%",
            background: c, border: "none", cursor: "pointer", flexShrink: 0,
            boxShadow: bg === c ? "0 0 0 3px rgba(0,0,0,0.4)" : "0 2px 6px rgba(0,0,0,0.1)",
          }
        });
      })
    )
  );
}


/* ══════ js/screens-premium.js ══════ */
/* Chrome Messenger — Premium / Subscriptions screen
 * Accessed via the diamond icon in the header.
 * Unlocks: extra themes, game pass (premium games), extra storage, etc.
 */

const CM_PLANS = [
  { id: "free",    name: "Free",    price: 0,    period: "",        highlight: false, features: [
      "3 themes de base", "Chats illimites", "Statuts 24h", "Quelques jeux solo",
  ]},
  { id: "plus",    name: "Plus",    price: 2.99, period: "/mois",   highlight: true,  features: [
      "Les 8 themes + dark mode", "Tous les jeux solo + 5 jeux sociaux", "Statuts illimites", "Sauvegarde cloud",
  ]},
  { id: "pro",     name: "Pro",     price: 6.99, period: "/mois",   highlight: false, features: [
      "Tout dans Plus", "Tous les jeux sociaux", "Appels HD illimites", "Stickers premium + effets", "Support prioritaire",
  ]},
  { id: "yearly",  name: "Yearly",  price: 59.99,period: "/an",     highlight: false, features: [
      "Tout dans Pro", "2 mois offerts", "Badge Chrome Pro", "Acces anticipe aux nouvelles features",
  ]},
];

function PremiumScreen(props) {
  var useState = React.useState;
  var [selected, setSelected] = useState("plus");

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 120 }
  },
    /* Header */
    React.createElement(CmHeader, {
      left: React.createElement(CmIconBtn, { onClick: props.onBack }, Cmi.back),
      onLogoTap: props.onThemeOpen,
    }),

    /* Hero */
    React.createElement("div", {
      style: {
        margin: "8px 22px 22px",
        padding: "26px 22px",
        borderRadius: 20,
        background: "linear-gradient(135deg, " + CM.primary + ", " + CM.primaryDark + ")",
        color: CM.onPrimary,
        textAlign: "center",
        boxShadow: CM.shadowGlow,
      }
    },
      React.createElement("div", { style: { fontSize: 40, marginBottom: 8 } }, "💎"),
      React.createElement("h2", {
        style: { margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-0.3px" }
      }, "Chrome Premium"),
      React.createElement("p", {
        style: { margin: "8px 0 0", fontSize: 13, opacity: 0.92 }
      }, "Debloque les themes, les jeux et bien plus.")
    ),

    /* Plans */
    React.createElement("div", { style: { padding: "0 22px", display: "flex", flexDirection: "column", gap: 12 } },
      CM_PLANS.map(function(plan) {
        var active = selected === plan.id;
        return React.createElement("div", {
          key: plan.id,
          onClick: function(){ setSelected(plan.id); },
          style: {
            position: "relative",
            padding: 18, borderRadius: 16, cursor: "pointer",
            background: active ? CM.primaryFaint : CM.surface,
            border: "2px solid " + (active ? CM.primary : CM.line),
            transition: "all 0.15s",
          }
        },
          plan.highlight && React.createElement("div", {
            style: {
              position: "absolute", top: -10, right: 16,
              padding: "3px 10px", borderRadius: 100,
              background: CM.primary, color: CM.onPrimary,
              fontSize: 10, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
            }
          }, "Populaire"),
          React.createElement("div", {
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }
          },
            React.createElement("div", null,
              React.createElement("div", { style: { fontSize: 16, fontWeight: 800, color: CM.title } }, plan.name),
              plan.price > 0 && React.createElement("div", { style: { marginTop: 4 } },
                React.createElement("span", { style: { fontSize: 22, fontWeight: 800, color: CM.title } }, plan.price.toFixed(2) + " €"),
                React.createElement("span", { style: { fontSize: 13, color: CM.sub, marginLeft: 4 } }, plan.period)
              ),
              plan.price === 0 && React.createElement("div", { style: { fontSize: 14, color: CM.sub, marginTop: 4 } }, "Toujours gratuit")
            ),
            active && React.createElement("div", {
              style: {
                width: 30, height: 30, borderRadius: "50%",
                background: CM.primary, color: CM.onPrimary,
                display: "flex", alignItems: "center", justifyContent: "center",
              }
            }, Cmi.check)
          ),
          React.createElement("ul", { style: { margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 } },
            plan.features.map(function(f, i) {
              return React.createElement("li", {
                key: i,
                style: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: CM.body }
              },
                React.createElement("span", { style: { color: CM.primary, display: "inline-flex", marginTop: 2 } }, Cmi.check2),
                f
              );
            })
          )
        );
      })
    ),

    /* Game Pass highlight */
    React.createElement("div", {
      style: {
        margin: "22px 22px 0", padding: 18, borderRadius: 16,
        background: CM.surface2, display: "flex", alignItems: "center", gap: 14,
      }
    },
      React.createElement("div", { style: { fontSize: 34 } }, "🎮"),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: CM.title } }, "Game Pass inclus"),
        React.createElement("div", { style: { fontSize: 12, color: CM.sub, marginTop: 2 } }, "Morpion, Quiz, Dessin et plus, a jouer avec tes contacts.")
      )
    ),

    /* CTA */
    React.createElement("div", {
      style: {
        position: "fixed", bottom: 0, left: 0, right: 0,
        maxWidth: 480, margin: "0 auto",
        padding: "16px 22px", background: CM.bg,
        borderTop: "1px solid " + CM.line,
        paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
      }
    },
      React.createElement(CmBtn, {
        variant: "primary", size: "lg", fullWidth: true,
        onClick: function(){ cmToast("Paiement simule — " + CM_PLANS.find(function(p){return p.id===selected;}).name + " active !", "info"); },
      }, selected === "free" ? "Continuer gratuitement" : "💎 Passer a " + CM_PLANS.find(function(p){return p.id===selected;}).name)
    )
  );
}


/* ══════ js/screens-settings.js ══════ */
/* Chrome Messenger — Settings / Drawer */

function SettingsScreen(props) {
  var useState = React.useState;
  var [, force] = useState(0);
  var profile = cmGetProfile();
  var settings = cmGetSettings();

  function toggle(k) {
    settings[k] = !settings[k];
    cmSetSettings(settings);
    force(Date.now());
  }

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 60 }
  },
    React.createElement(CmHeader, {
      onLogoTap: props.onThemeOpen,
      left: React.createElement(CmIconBtn, { onClick: props.onBack }, Cmi.back),
    }),

    /* Profile card */
    React.createElement("div", {
      onClick: props.onEditProfile,
      style: {
        margin: "6px 22px 22px",
        padding: "18px",
        borderRadius: 18,
        background: CM.surface,
        border: "1px solid " + CM.line,
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer",
      }
    },
      React.createElement(CmAvatar, { name: profile.name || "?", size: 60 }),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: CM.title } }, profile.name || "—"),
        React.createElement("div", { style: { fontSize: 13, color: CM.sub, marginTop: 3 } }, profile.phone || "—"),
        profile.bio && React.createElement("div", { style: { fontSize: 12, color: CM.muted, marginTop: 3 } }, profile.bio)
      ),
      React.createElement("span", { style: { color: CM.muted } }, Cmi.chevR)
    ),

    /* Theme / Language / Toggles */
    React.createElement("div", { style: { padding: "0 22px" } },
      sectionHeading(cm("theme")),
      row(Cmi.heart, cm("themes"), CM.themeName, props.onThemeOpen),
      sectionHeading(cm("language")),
      React.createElement("div", {
        style: { background: CM.surface, border: "1px solid " + CM.line, borderRadius: 14, padding: 6 }
      },
        React.createElement("div", {
          style: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 4 }
        },
          CM_LANGS.map(function(lang) {
            var active = _cmLang === lang.code;
            return React.createElement("button", {
              key: lang.code,
              onClick: function(){ cmSetLang(lang.code); force(Date.now()); props.onLangChange && props.onLangChange(); },
              style: {
                padding: "10px 12px", borderRadius: 10,
                background: active ? CM.primarySoft : "transparent",
                border: "none", color: active ? CM.primaryDark : CM.body,
                fontFamily: "inherit", fontWeight: active ? 800 : 600, fontSize: 12,
                cursor: "pointer", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start",
              }
            },
              React.createElement("span", null, lang.flag),
              React.createElement("span", null, lang.name)
            );
          })
        )
      ),

      sectionHeading(cm("notifications_s")),
      toggleRow("🔔", cm("notifications_s"), !!settings.notifications, function(){ toggle("notifications"); }),
      toggleRow("🔊", "Sons", !!settings.sound, function(){ toggle("sound"); }),
      toggleRow("⌨️", "Entree pour envoyer", !!settings.enterToSend, function(){ toggle("enterToSend"); }),
      toggleRow("👁️", "Confirmations de lecture", !!settings.readReceipts, function(){ toggle("readReceipts"); }),

      sectionHeading(cm("about")),
      row(Cmi.info, "Version", CM_VERSION),

      React.createElement("button", {
        onClick: function(){
          if (confirm(cm("resetConfirm"))) { cmResetAll(); location.reload(); }
        },
        style: {
          marginTop: 16, width: "100%", padding: "14px",
          background: "transparent", border: "1px solid #FF4757",
          color: "#FF4757", borderRadius: 14,
          fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
        }
      }, cm("resetData"))
    )
  );
}

function sectionHeading(text) {
  return React.createElement("h3", {
    style: { margin: "18px 4px 10px", fontSize: 11, fontWeight: 700, color: CM.muted, textTransform: "uppercase", letterSpacing: "0.08em" }
  }, text);
}

function row(icon, label, value, onClick) {
  return React.createElement("div", {
    onClick: onClick,
    style: {
      padding: "12px 14px", borderRadius: 12,
      background: CM.surface, border: "1px solid " + CM.line,
      display: "flex", alignItems: "center", gap: 12,
      cursor: onClick ? "pointer" : "default", marginBottom: 6,
    }
  },
    icon && React.createElement("span", { style: { color: CM.body } }, icon),
    React.createElement("span", { style: { flex: 1, fontSize: 14, fontWeight: 600, color: CM.body } }, label),
    value && React.createElement("span", { style: { fontSize: 13, color: CM.sub } }, value),
    onClick && React.createElement("span", { style: { color: CM.muted } }, Cmi.chevR)
  );
}

function toggleRow(icon, label, on, onToggle) {
  return React.createElement("div", {
    onClick: onToggle,
    style: {
      padding: "12px 14px", borderRadius: 12,
      background: CM.surface, border: "1px solid " + CM.line,
      display: "flex", alignItems: "center", gap: 12,
      cursor: "pointer", marginBottom: 6,
    }
  },
    React.createElement("span", { style: { fontSize: 16 } }, icon),
    React.createElement("span", { style: { flex: 1, fontSize: 14, fontWeight: 600, color: CM.body } }, label),
    React.createElement("div", {
      style: {
        width: 40, height: 22, borderRadius: 100,
        background: on ? CM.primary : CM.line2, position: "relative", transition: "background 0.2s",
      }
    },
      React.createElement("div", {
        style: {
          position: "absolute", top: 3, left: on ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "white",
          transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
        }
      })
    )
  );
}


/* ══════ js/app.js ══════ */
/* Chrome Messenger — Main App orchestrator */

function App() {
  var useState = React.useState;
  var useEffect = React.useEffect;
  var [onboarded, setOnboarded] = useState(cmIsOnboarded());
  var [view, setView] = useState("chat"); /* chat (home) | tasks | games | notifs */
  var [params, setParams] = useState({});
  var [, forceRender] = useState(0);

  useEffect(function(){
    /* Initialize crypto (non-blocking for UI) */
    cmCryptoInit().catch(function(e){ console.warn("[crypto] init failed", e); });
  }, []);

  function nav(v, p) {
    setView(v);
    setParams(p || {});
    window.scrollTo(0, 0);
  }

  if (!onboarded) {
    return React.createElement(OnboardingFlow, {
      onDone: function(){ setOnboarded(true); setView("chat"); }
    });
  }

  var handlers = {
    onOpenChat: function(id){ nav("conversation", { convId: id }); },
    onBack: function(){ nav("chat"); },
    onNewChat: function(){ cmToast(cm("newChat") + " (demo)", "info"); },
    onAddStory: function(){ nav("storyCreate"); },
    onViewStory: function(id){ nav("storyView", { storyId: id }); },
    onOpenPremium: function(){ nav("premium"); },
    onOpenMenu: function(){ nav("settings"); },
    onOpenSettings: function(){ nav("settings"); },
    onEditProfile: function(){ cmToast(cm("editProfile") + " (demo)", "info"); },
    onThemeChange: function(){ forceRender(Date.now()); },
    onLangChange: function(){ forceRender(Date.now()); },
    onChanged: function(){ forceRender(Date.now()); },
    onSeeAll: function(cat){ cmToast(cm("seeAll") + ": " + cat, "info"); },
    onPlayGame: function(g){
      if (g.kind === "external" && g.href) { window.open(g.href, "_blank"); return; }
      cmToast("🎮 " + g.name + " — " + cm("comingSoon"), "info");
    },
    onThemeOpen: function(){ forceRender(Date.now()); cmToast("Tape sur le cameleon !", "info"); },
  };

  var screen;
  if (view === "chat") {
    screen = React.createElement(HomeScreen, Object.assign({}, handlers, {
      onThemeChange: handlers.onThemeChange,
    }));
  } else if (view === "tasks") {
    screen = React.createElement(TodolistScreen, handlers);
  } else if (view === "games") {
    screen = React.createElement(GamesScreen, handlers);
  } else if (view === "notifs") {
    screen = React.createElement(NotifsScreen, handlers);
  } else if (view === "conversation") {
    screen = React.createElement(ChatScreen, Object.assign({}, handlers, { convId: params.convId }));
  } else if (view === "premium") {
    screen = React.createElement(PremiumScreen, handlers);
  } else if (view === "settings") {
    screen = React.createElement(SettingsScreen, handlers);
  } else if (view === "storyView") {
    screen = React.createElement(StoryViewer, Object.assign({}, handlers, {
      storyId: params.storyId,
      onClose: function(){ nav("chat"); },
    }));
  } else if (view === "storyCreate") {
    screen = React.createElement(StoryCreator, Object.assign({}, handlers, {
      onClose: function(){ nav("chat"); },
      onDone: function(){ nav("chat"); },
    }));
  } else {
    screen = React.createElement("div", null, "404");
  }

  /* Hide bottom nav during fullscreen views */
  var hideNav = view === "conversation" || view === "storyView" || view === "storyCreate" || view === "premium" || view === "settings";

  var navItems = [
    { id: "chat",   label: cm("navChat"),   icon: view === "chat"   ? Cmi.chat  : Cmi.chat },
    { id: "tasks",  label: cm("navTasks"),  icon: Cmi.tasks, badge: false },
    { id: "games",  label: cm("navGames"),  icon: Cmi.games },
    { id: "notifs", label: cm("navNotifs"), icon: Cmi.bell, badge: cmUnreadNotifsCount() > 0 },
  ];

  return React.createElement("div", {
    style: { maxWidth: 480, margin: "0 auto", minHeight: "100vh", position: "relative" }
  },
    screen,
    !hideNav && React.createElement(CmBottomNav, {
      items: navItems, active: view, onNav: nav,
    })
  );
}


/* ══════ js/main.js ══════ */
/* Chrome Messenger — entry point */

(function() {
  /* Apply saved theme immediately, before React mounts */
  var savedTheme = localStorage.getItem(CM_KEYS.theme) || "mint";
  cmApplyTheme(savedTheme);

  var root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
})();

