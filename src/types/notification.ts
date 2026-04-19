export type NotificationKind =
  | 'message'
  | 'call-missed'
  | 'task-reminder'
  | 'event-reminder'
  | 'event-invitation'
  | 'birthday'
  | 'system';

export interface Notification {
  readonly id: string;
  readonly ownerId: string;
  readonly kind: NotificationKind;
  readonly title: string;
  readonly body: string;
  readonly data: Readonly<Record<string, string>>;
  readonly createdAtMs: number;
  readonly read: boolean;
}
