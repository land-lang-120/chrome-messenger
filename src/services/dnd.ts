/**
 * DND (Do Not Disturb) — Ne pas déranger. Feature Premium Pro.
 *
 * Permet de bloquer messages + appels pendant une plage horaire quotidienne.
 * Sous-option : autoriser les autres à envoyer UN "message urgent" qui produit
 * 1 seule notification pour signaler l'importance (sans livrer le texte).
 */

import { lsGet, lsSet } from './storage';

export interface DndConfig {
  readonly enabled: boolean;
  /** Heure de début (HH:mm) */
  readonly startTime: string;
  /** Heure de fin (HH:mm, peut déborder sur le jour suivant si < start) */
  readonly endTime: string;
  /** Autoriser le bouton "Message urgent" (1 notif max/jour) */
  readonly allowUrgent: boolean;
  /** Heures en DND : true = tous les jours, sinon jours de la semaine (0=dim..6=sam) */
  readonly days: readonly number[];
  /** Timestamp du dernier msg urgent reçu par l'owner (pour rate-limit 1/jour). */
  readonly lastUrgentAtMs: number;
}

export const DEFAULT_DND: DndConfig = {
  enabled: false,
  startTime: '22:00',
  endTime: '08:00',
  allowUrgent: true,
  days: [0, 1, 2, 3, 4, 5, 6],
  lastUrgentAtMs: 0,
};

const KEY = 'cm_dnd';

export function getDnd(): DndConfig {
  return lsGet<DndConfig>(KEY, DEFAULT_DND);
}

export function setDnd(cfg: DndConfig): void {
  lsSet(KEY, cfg);
}

/** Convertit HH:mm -> minutes depuis 00:00 */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map((n) => Number.parseInt(n, 10));
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Retourne true si on est actuellement dans la plage DND configurée. */
export function isDndActive(cfg: DndConfig = getDnd(), now: Date = new Date()): boolean {
  if (!cfg.enabled) return false;
  const day = now.getDay();
  if (!cfg.days.includes(day)) return false;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(cfg.startTime);
  const end = toMinutes(cfg.endTime);
  if (start === end) return false;
  if (start < end) return nowMin >= start && nowMin < end;
  // Plage qui franchit minuit (ex: 22:00 → 08:00)
  return nowMin >= start || nowMin < end;
}

/** Tente d'envoyer une notification urgente. Rate-limit 1 / 24h. */
export function canSendUrgent(cfg: DndConfig = getDnd()): boolean {
  if (!cfg.allowUrgent) return false;
  const ago = Date.now() - cfg.lastUrgentAtMs;
  return ago > 24 * 3600 * 1000;
}

export function markUrgentSent(): void {
  setDnd({ ...getDnd(), lastUrgentAtMs: Date.now() });
}
