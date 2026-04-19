/** 6 categories pour filtrer contacts + cibler invitations evenements. */
export type ContactCategory =
  | 'family'
  | 'friends'
  | 'acquaintances'
  | 'colleagues'
  | 'utilities'
  | 'other';

export const CONTACT_CATEGORIES: readonly ContactCategory[] = [
  'family',
  'friends',
  'acquaintances',
  'colleagues',
  'utilities',
  'other',
] as const;

export interface Contact {
  readonly contactUid: string;
  readonly name: string; // nom donne par l'owner
  readonly category: ContactCategory;
  readonly favorite: boolean;
  readonly addedAtMs: number;
}
