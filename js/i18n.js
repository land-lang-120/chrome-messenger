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
