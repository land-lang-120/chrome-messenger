/**
 * Events service — CRUD + queries pour la feature événements (Premium Pro).
 */

import { lsGet, lsSet } from './storage';
import { getContacts } from './localDb';
import type { AppEvent } from '../types/event';
import type { ContactCategory } from '../types/contact';

const KEY = 'cm_events';

export function getEvents(): AppEvent[] {
  return lsGet<AppEvent[]>(KEY, []);
}

export function setEvents(v: AppEvent[]): void {
  lsSet(KEY, v);
}

export function addEvent(ev: AppEvent): void {
  setEvents([...getEvents(), ev]);
}

export function removeEvent(id: string): void {
  setEvents(getEvents().filter((e) => e.id !== id));
}

/** Retourne tous les UIDs destinataires d'un événement (résolution catégories). */
export function resolveRecipients(ev: AppEvent): string[] {
  const uids = new Set<string>();
  if (ev.recipients.uids) ev.recipients.uids.forEach((u) => uids.add(u));
  if (ev.recipients.categories) {
    const cats = new Set<ContactCategory>(ev.recipients.categories);
    getContacts().forEach((c) => {
      if (cats.has(c.category)) uids.add(c.contactUid);
    });
  }
  return Array.from(uids);
}

/** Événements à venir ou du jour (visible dans le header de conversation). */
export function getActiveEventsFor(contactUid: string): AppEvent[] {
  const now = Date.now();
  return getEvents().filter((ev) => {
    if (ev.dateMs < now - 24 * 3600 * 1000) return false; // passe (>24h apres)
    const recs = resolveRecipients(ev);
    return recs.includes(contactUid);
  });
}

/** Événements à rappeler (J-1 ou J). Appelé par le scheduler (Cloud Function v2). */
export function getEventsToRemind(): AppEvent[] {
  const now = Date.now();
  const oneDay = 24 * 3600 * 1000;
  return getEvents().filter((ev) => {
    const delta = ev.dateMs - now;
    return (delta >= 0 && delta < oneDay) || (delta >= oneDay && delta < 2 * oneDay);
  });
}
