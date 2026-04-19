/**
 * Seed data — utilise en mode dev / demo pour avoir des donnees
 * d'exemple sans serveur. En prod Firebase, on lit depuis Firestore.
 */

import type { Contact } from '../types/contact';
import type { Conversation } from '../types/conversation';
import type { Message } from '../types/message';
import type { Story } from '../types/story';
import type { Task } from '../types/task';
import type { Notification } from '../types/notification';

export const SEED_CONTACTS: readonly Contact[] = [
  { contactUid: 'c1',  name: 'Joseph Lando',      category: 'family',        favorite: true,  addedAtMs: Date.now() },
  { contactUid: 'c2',  name: 'Richy',              category: 'friends',       favorite: false, addedAtMs: Date.now() },
  { contactUid: 'c3',  name: 'Morgan Freeman',     category: 'acquaintances', favorite: false, addedAtMs: Date.now() },
  { contactUid: 'c4',  name: 'Tarzan',             category: 'friends',       favorite: false, addedAtMs: Date.now() },
  { contactUid: 'c5',  name: 'Cody',               category: 'colleagues',    favorite: false, addedAtMs: Date.now() },
  { contactUid: 'c6',  name: 'Lando Family',       category: 'family',        favorite: false, addedAtMs: Date.now() },
  { contactUid: 'c7',  name: 'Style Man',          category: 'utilities',     favorite: false, addedAtMs: Date.now() },
  { contactUid: 'c8',  name: 'Fred Larson',        category: 'colleagues',    favorite: false, addedAtMs: Date.now() },
  { contactUid: 'c9',  name: 'Elodie Lando',       category: 'family',        favorite: true,  addedAtMs: Date.now() },
  { contactUid: 'c10', name: 'Madeleine Ngniteze', category: 'friends',       favorite: false, addedAtMs: Date.now() },
];

const now = Date.now();

export function buildSeedConversations(ownerId: string): readonly Conversation[] {
  return [
    { id: 'conv_c1',  type: 'direct', members: [ownerId, 'c1'],  createdAtMs: now - 86400000 * 30, lastMessageId: null, lastMessageAtMs: now - 60000,       pinned: true },
    { id: 'conv_c2',  type: 'direct', members: [ownerId, 'c2'],  createdAtMs: now - 86400000 * 20, lastMessageId: null, lastMessageAtMs: now - 86400000 * 2 },
    { id: 'conv_c3',  type: 'direct', members: [ownerId, 'c3'],  createdAtMs: now - 86400000 * 15, lastMessageId: null, lastMessageAtMs: now - 60000 * 10 },
    { id: 'conv_c4',  type: 'direct', members: [ownerId, 'c4'],  createdAtMs: now - 86400000 * 10, lastMessageId: null, lastMessageAtMs: now - 86400000 },
    { id: 'conv_c5',  type: 'direct', members: [ownerId, 'c5'],  createdAtMs: now - 86400000 * 8,  lastMessageId: null, lastMessageAtMs: now - 86400000 },
    { id: 'conv_c6',  type: 'group',  members: [ownerId, 'c1', 'c9', 'c10'], createdAtMs: now - 86400000 * 40, lastMessageId: null, lastMessageAtMs: now - 86400000, name: 'Lando Family' },
    { id: 'conv_c7',  type: 'direct', members: [ownerId, 'c7'],  createdAtMs: now - 86400000 * 5,  lastMessageId: null, lastMessageAtMs: now - 86400000 * 3 },
  ];
}

/** Encode string UTF-8 → base64 safe (supporte les emojis). */
function utf8ToB64(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

/** Messages non chiffres pour seed local uniquement (on triche avec plaintext visible). */
export function buildSeedMessages(_ownerId: string): readonly Message[] {
  const mk = (id: string, convId: string, senderId: string, plaintext: string, minsAgo: number): Message => ({
    id, convId, senderId,
    kind: 'text',
    cipher: { ciphertext: utf8ToB64(plaintext), iv: 'AAAAAAAAAAAAAAAA' }, // factice
    sentAtMs: now - minsAgo * 60000,
    deliveredAtMs: now - minsAgo * 60000,
    readAtByUid: {},
    replyToId: null,
    reactionsByUid: {},
    plaintext,
  });
  return [
    mk('m1', 'conv_c1', 'c1', 'On se voit demain ?', 1),
    mk('m2', 'conv_c2', 'c2', 'Je vois.', 2880),
    mk('m3', 'conv_c3', 'c3', 'Bonjour toi !', 15),
    mk('m4', 'conv_c4', 'c4', 'Tu es la ?', 1440),
    mk('m5', 'conv_c5', 'c5', 'Bonjour toi !', 1440),
    mk('m6', 'conv_c6', 'c1', 'Salut tout le monde 👋', 1440),
    mk('m7', 'conv_c7', 'c7', 'Bonjour toi !', 4320),
  ];
}

export function buildSeedStories(): readonly Story[] {
  return [
    { id: 's1', ownerId: 'c1',  createdAtMs: now - 3600000 * 6,  expiresAtMs: now + 3600000 * 18, kind: 'color', bg: '#FFE8A0', text: 'Belle journee !', mediaUrl: null, viewedByUid: {}, allowedCategories: null },
    { id: 's2', ownerId: 'c9',  createdAtMs: now - 3600000 * 2,  expiresAtMs: now + 3600000 * 22, kind: 'color', bg: '#C8D9FF', text: 'Chillin',         mediaUrl: null, viewedByUid: {}, allowedCategories: null },
    { id: 's3', ownerId: 'c10', createdAtMs: now - 3600000 * 12, expiresAtMs: now + 3600000 * 12, kind: 'color', bg: '#FFC6D3', text: 'Bon week-end',   mediaUrl: null, viewedByUid: { me: now }, allowedCategories: null },
  ];
}

export function buildSeedTasks(ownerId: string): readonly Task[] {
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  return [
    { id: 't1', ownerId, sharedWith: [], title: 'Homework',     kind: 'common',     date: iso, startTime: '19:15', endTime: '19:25', location: 'Bafoussam', done: false, reminderEnabled: true, createdAtMs: now },
    { id: 't2', ownerId, sharedWith: [], title: 'RDV',          kind: 'individual', date: iso, startTime: '19:35', endTime: '19:55', location: 'Yaounde',   done: false, reminderEnabled: true, createdAtMs: now },
    { id: 't3', ownerId, sharedWith: [], title: 'RDV d\'affaire', kind: 'individual', date: iso, startTime: '21:15', endTime: '21:55', location: 'Douala',    done: false, reminderEnabled: false, createdAtMs: now },
  ];
}

export function buildSeedNotifs(ownerId: string): readonly Notification[] {
  return [
    { id: 'n1', ownerId, kind: 'task-reminder',    title: 'Homework',        body: 'with Fred Larson — 19:15-19:25 — Bafoussam', data: {}, createdAtMs: now - 60000,    read: false },
    { id: 'n2', ownerId, kind: 'task-reminder',    title: 'RDV',             body: 'with Chris Duck — 19:35-19:55 — Yaounde',   data: {}, createdAtMs: now - 180000,   read: false },
    { id: 'n3', ownerId, kind: 'call-missed',      title: 'Joseph Lando',    body: 'Appel manque',                              data: {}, createdAtMs: now - 300000,   read: false },
    { id: 'n4', ownerId, kind: 'birthday',         title: 'Anniversaire Morgan', body: 'Aujourd\'hui',                            data: {}, createdAtMs: now - 600000,   read: false },
  ];
}
