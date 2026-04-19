/**
 * Local DB — abstraction localStorage pour simuler Firestore en mode dev.
 * Quand Firebase est connecte, on remplacera ces fonctions par les helpers Firestore.
 *
 * SECURITE : meme en local, on ne stocke QUE des ciphertexts pour les messages.
 */

import { lsGet, lsSet } from './storage';
import { LS_KEYS } from '../config';
import type { Contact } from '../types/contact';
import type { Conversation } from '../types/conversation';
import type { Message } from '../types/message';
import type { Story } from '../types/story';
import type { Task } from '../types/task';
import type { Notification } from '../types/notification';
import {
  SEED_CONTACTS,
  buildSeedConversations,
  buildSeedMessages,
  buildSeedStories,
  buildSeedTasks,
  buildSeedNotifs,
} from './seed';

const KEYS = {
  contacts: 'cm_contacts',
  conversations: 'cm_conversations',
  messages: 'cm_messages',
  stories: 'cm_stories',
  tasks: 'cm_tasks',
  notifs: 'cm_notifs',
  seededFor: 'cm_seeded_for',
} as const;

/** Initialise le seed si ce n'est pas deja fait pour cet user. */
export function seedIfNeeded(ownerId: string): void {
  if (lsGet<string | null>(KEYS.seededFor, null) === ownerId) return;
  lsSet(KEYS.contacts, SEED_CONTACTS);
  lsSet(KEYS.conversations, buildSeedConversations(ownerId));
  lsSet(KEYS.messages, buildSeedMessages(ownerId));
  lsSet(KEYS.stories, buildSeedStories());
  lsSet(KEYS.tasks, buildSeedTasks(ownerId));
  lsSet(KEYS.notifs, buildSeedNotifs(ownerId));
  lsSet(KEYS.seededFor, ownerId);
}

export function getContacts(): Contact[] { return lsGet<Contact[]>(KEYS.contacts, []); }
export function setContacts(v: Contact[]): void { lsSet(KEYS.contacts, v); }
export function getContactById(id: string): Contact | undefined {
  return getContacts().find((c) => c.contactUid === id);
}

export function getConversations(): Conversation[] { return lsGet<Conversation[]>(KEYS.conversations, []); }
export function setConversations(v: Conversation[]): void { lsSet(KEYS.conversations, v); }
export function getConversationById(id: string): Conversation | undefined {
  return getConversations().find((c) => c.id === id);
}

export function getMessages(): Message[] { return lsGet<Message[]>(KEYS.messages, []); }
export function setMessages(v: Message[]): void { lsSet(KEYS.messages, v); }
export function getMessagesByConv(convId: string): Message[] {
  return getMessages().filter((m) => m.convId === convId).sort((a, b) => a.sentAtMs - b.sentAtMs);
}
export function getLastMessage(convId: string): Message | undefined {
  const list = getMessagesByConv(convId);
  return list[list.length - 1];
}
export function addMessage(m: Message): void {
  setMessages([...getMessages(), m]);
}

export function getStories(): Story[] { return lsGet<Story[]>(KEYS.stories, []); }
export function setStories(v: Story[]): void { lsSet(KEYS.stories, v); }
export function getActiveStories(): Story[] {
  const t = Date.now();
  return getStories().filter((s) => s.expiresAtMs > t).sort((a, b) => b.createdAtMs - a.createdAtMs);
}

export function getTasks(): Task[] { return lsGet<Task[]>(KEYS.tasks, []); }
export function setTasks(v: Task[]): void { lsSet(KEYS.tasks, v); }
export function getTasksByDate(iso: string): Task[] {
  return getTasks().filter((t) => t.date === iso);
}

export function getNotifs(): Notification[] { return lsGet<Notification[]>(KEYS.notifs, []); }
export function setNotifs(v: Notification[]): void { lsSet(KEYS.notifs, v); }
export function unreadNotifsCount(): number { return getNotifs().filter((n) => !n.read).length; }

/** Remise a zero — utilise dans Settings > Reset data. */
export function resetAllData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  Object.values(LS_KEYS).forEach((k) => localStorage.removeItem(k));
}
