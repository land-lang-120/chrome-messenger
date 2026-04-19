/** Francais = langue de reference (source de verite pour les cles). */
export const fr: Readonly<Record<string, string>> = {
  appName: 'Chrome Messenger',
  welcome: 'Bienvenue sur',
  welcomeSub: 'Une messagerie qui s\'adapte a toi.',
  getStarted: 'Commencer',

  /* Phone / OTP */
  enterPhone: 'Ton numero de telephone',
  phoneDesc: 'On va t\'envoyer un code par SMS pour verifier.',
  phonePlaceholder: '+237 6XX XX XX XX',
  sendCode: 'Envoyer le code',
  enterCode: 'Entre le code recu',
  codeDesc: 'Code a 6 chiffres recu par SMS.',
  codeNotReceived: 'Pas recu ? Renvoyer',
  verify: 'Verifier',
  invalidPhone: 'Numero invalide',
  invalidCode: 'Code incorrect',

  /* Profile */
  profileSetup: 'Ton profil',
  profileDesc: 'Ton nom et ta photo seront visibles par tes contacts.',
  yourName: 'Ton nom',
  yourBio: 'Une courte bio (optionnel)',
  finish: 'Terminer',

  /* Nav */
  navChat: 'Chat',
  navTasks: 'Tasks',
  navGames: 'Games',
  navNotifs: 'Notifs',

  /* Home */
  stories: 'Statuts',
  addColors: 'Ajouter',
  discussions: 'Discussions',
  search: 'Rechercher',
  filterAll: 'Tous',
  filterUnread: 'Non lus',
  filterGroups: 'Groupes',
  filterFavorites: 'Favoris',
  today: 'Aujourd\'hui',
  yesterday: 'Hier',
  online: 'En ligne',
  noDiscussions: 'Aucune discussion pour le moment',
  noStories: 'Aucun statut pour le moment',

  /* Chat */
  typeMessage: 'Ecris un message…',
  voiceCall: 'Appel vocal',
  videoCall: 'Appel video',
  callStarting: 'Appel en cours',
  encryptedNote: 'Messages chiffres de bout en bout',
  sendShort: 'Envoyer',

  /* Todolist */
  todoTitle: 'Taches du jour',
  addTask: 'Ajouter',
  taskAll: 'Tous',
  taskIndividual: 'Individuel',
  taskCommon: 'Commun',
  taskDaily: 'Quotidien',
  monthView: 'Vue mois',
  weekView: 'Vue semaine',

  /* Games */
  gamesForYou: 'Pour toi',
  gamesForYouSub: 'Passe le temps en solo',
  gamesSocial: 'Avec tes contacts',
  gamesSocialSub: 'Defie tes amis',
  seeAll: 'Voir tout',
  play: 'Jouer',
  premium: 'Premium',
  gamePass: 'Game Pass',
  gamePassSub: 'Debloque tous les jeux sociaux',

  /* Notifs */
  notifications: 'Notifications',
  notifAll: 'Tous',
  notifCalls: 'Appels',
  notifTasks: 'Taches',
  notifEvents: 'Evenements',

  /* Common */
  cancel: 'Annuler',
  ok: 'OK',
  confirm: 'Confirmer',
  save: 'Enregistrer',
  back: 'Retour',
  next: 'Suivant',
  close: 'Fermer',
  loading: 'Chargement…',

  /* Settings */
  language: 'Langue',
  theme: 'Theme',
  themesTitle: 'Themes',
  themesSub: 'Choisis une couleur qui te ressemble.',
  darkMode: 'Mode sombre',
  darkModeSub: 'Nuit',
  about: 'A propos',
  resetData: 'Reinitialiser les donnees',
  resetConfirm: 'Cette action supprimera toutes tes donnees locales. Continuer ?',
  logout: 'Se deconnecter',

  /* Premium */
  planFree: 'Free',
  planPlus: 'Plus',
  planPro: 'Pro',
  planYearly: 'Yearly',
  subscribe: 'S\'abonner',
  currentPlan: 'Plan actuel',
};

export const FR_KEYS = [
  'appName','welcome','welcomeSub','getStarted',
  'enterPhone','phoneDesc','phonePlaceholder','sendCode',
  'enterCode','codeDesc','codeNotReceived','verify','invalidPhone','invalidCode',
  'profileSetup','profileDesc','yourName','yourBio','finish',
  'navChat','navTasks','navGames','navNotifs',
  'stories','addColors','discussions','search',
  'filterAll','filterUnread','filterGroups','filterFavorites',
  'today','yesterday','online','noDiscussions','noStories',
  'typeMessage','voiceCall','videoCall','callStarting','encryptedNote','sendShort',
  'todoTitle','addTask','taskAll','taskIndividual','taskCommon','taskDaily','monthView','weekView',
  'gamesForYou','gamesForYouSub','gamesSocial','gamesSocialSub','seeAll','play','premium','gamePass','gamePassSub',
  'notifications','notifAll','notifCalls','notifTasks','notifEvents',
  'cancel','ok','confirm','save','back','next','close','loading',
  'language','theme','themesTitle','themesSub','darkMode','darkModeSub','about','resetData','resetConfirm','logout',
  'planFree','planPlus','planPro','planYearly','subscribe','currentPlan',
] as const;

export type DictKey = typeof FR_KEYS[number];
export type Dict = Readonly<Record<DictKey, string>>;
