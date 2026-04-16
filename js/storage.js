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
