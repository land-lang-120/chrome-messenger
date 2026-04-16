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
