/**
 * Firestore — helpers typesafe pour CRUD et subscriptions temps reel.
 * Centralise les chemins de collections pour eviter les strings magiques.
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  type QueryConstraint,
  type Unsubscribe,
} from 'firebase/firestore';

import { getFirebaseDb, isFirebaseEnabled } from './index';

/** Chemins de collections — source unique de verite. */
export const PATHS = {
  users: 'users',
  user: (uid: string) => `users/${uid}`,
  contacts: (ownerUid: string) => `contacts/${ownerUid}/list`,
  contact: (ownerUid: string, contactUid: string) => `contacts/${ownerUid}/list/${contactUid}`,
  conversations: 'conversations',
  conversation: (id: string) => `conversations/${id}`,
  messages: (convId: string) => `conversations/${convId}/messages`,
  message: (convId: string, msgId: string) => `conversations/${convId}/messages/${msgId}`,
  stories: 'stories',
  story: (id: string) => `stories/${id}`,
  tasks: (ownerUid: string) => `tasks/${ownerUid}/list`,
  task: (ownerUid: string, taskId: string) => `tasks/${ownerUid}/list/${taskId}`,
  events: 'events',
  event: (id: string) => `events/${id}`,
  notifs: (ownerUid: string) => `notifs/${ownerUid}/list`,
} as const;

function db() {
  return getFirebaseDb();
}

export async function fsGetDoc<T>(path: string): Promise<T | null> {
  if (!isFirebaseEnabled()) return null;
  const snap = await getDoc(doc(db(), path));
  return snap.exists() ? (snap.data() as T) : null;
}

export async function fsSetDoc<T extends object>(path: string, data: T): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await setDoc(doc(db(), path), data as Record<string, unknown>);
}

export async function fsUpdateDoc<T extends object>(path: string, patch: Partial<T>): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await updateDoc(doc(db(), path), patch as Record<string, unknown>);
}

export async function fsDeleteDoc(path: string): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await deleteDoc(doc(db(), path));
}

/** Abonnement temps reel a un document. Retourne unsubscribe. */
export function fsWatchDoc<T>(
  path: string,
  cb: (data: T | null) => void,
): Unsubscribe {
  if (!isFirebaseEnabled()) {
    cb(null);
    return () => undefined;
  }
  return onSnapshot(doc(db(), path), (snap) => {
    cb(snap.exists() ? (snap.data() as T) : null);
  });
}

/** Abonnement temps reel a une query. */
export function fsWatchQuery<T>(
  collectionPath: string,
  constraints: QueryConstraint[],
  cb: (docs: Array<T & { id: string }>) => void,
): Unsubscribe {
  if (!isFirebaseEnabled()) {
    cb([]);
    return () => undefined;
  }
  const q = query(collection(db(), collectionPath), ...constraints);
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ ...(d.data() as T), id: d.id }));
    cb(items);
  });
}

// Re-export des helpers de query pour simplifier l'import cote appelant
export { where, orderBy, limit };
