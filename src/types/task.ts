export type TaskKind = 'individual' | 'common' | 'daily';

export interface Task {
  readonly id: string;
  readonly ownerId: string;
  /** Si la tache est partagee via une conversation. */
  readonly sharedWith: readonly string[];
  readonly title: string;
  readonly kind: TaskKind;
  readonly date: string; // YYYY-MM-DD
  readonly startTime: string | null; // HH:mm
  readonly endTime: string | null;
  readonly location: string | null;
  readonly done: boolean;
  readonly reminderEnabled: boolean;
  readonly createdAtMs: number;
}
