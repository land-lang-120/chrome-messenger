import type { ContactCategory } from './contact';

export type EventKind = 'birthday' | 'funeral' | 'wedding' | 'meeting' | 'party' | 'other';

export interface AppEvent {
  readonly id: string;
  readonly ownerId: string;
  readonly kind: EventKind;
  readonly title: string;
  readonly message: string;
  readonly photoUrl: string | null;
  readonly dateMs: number;
  readonly location: EventLocation | null;
  readonly recipients: EventRecipients;
  /** Graine deterministe pour generer le QR code. */
  readonly qrSeed: string;
  readonly createdAtMs: number;
}

export interface EventLocation {
  readonly label: string;
  readonly lat: number | null;
  readonly lng: number | null;
}

export interface EventRecipients {
  /** Si defini, envoie a tous les contacts des categories listees. */
  readonly categories: readonly ContactCategory[] | null;
  /** Sinon, liste explicite d'UIDs. */
  readonly uids: readonly string[] | null;
}
