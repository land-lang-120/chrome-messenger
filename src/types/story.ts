import type { ContactCategory } from './contact';

export type StoryKind = 'color' | 'photo' | 'video';

export interface Story {
  readonly id: string;
  readonly ownerId: string;
  readonly createdAtMs: number;
  readonly expiresAtMs: number; // +24h par defaut
  readonly kind: StoryKind;
  readonly bg: string | null; // si kind === 'color'
  readonly text: string | null;
  readonly mediaUrl: string | null; // si photo/video (Firebase Storage URL)
  readonly viewedByUid: Readonly<Record<string, number>>; // uid → timestamp vu
  /** Restriction : uniquement ces categories. null = tout le monde. */
  readonly allowedCategories: readonly ContactCategory[] | null;
}
