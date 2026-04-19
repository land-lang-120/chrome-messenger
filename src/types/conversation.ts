export type ConversationType = 'direct' | 'group';

export interface Conversation {
  readonly id: string;
  readonly type: ConversationType;
  readonly members: readonly string[]; // UIDs
  readonly createdAtMs: number;
  readonly lastMessageId: string | null;
  readonly lastMessageAtMs: number;
  /** Pour groupes uniquement */
  readonly name?: string;
  readonly avatar?: string | null;
  readonly admins?: readonly string[];
  /** Evenement epingle en tete de conversation. */
  readonly pinnedEventId?: string | null;
  /** Epingle localement par l'user courant. */
  readonly pinned?: boolean;
  readonly archived?: boolean;
  readonly muted?: boolean;
}
