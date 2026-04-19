import { z } from 'zod';

/**
 * Profil utilisateur (public) — stocke dans Firestore `users/{uid}`.
 * La private key N'est JAMAIS ici. Seulement la publicKey.
 */
export interface User {
  readonly uid: string;
  readonly phone: string; // format E.164, ex: +237655123456
  readonly name: string;
  readonly avatar: string | null; // URL Firebase Storage
  readonly bio: string;
  readonly publicKey: string; // ECDH P-256 JWK serialise base64
  readonly createdAtMs: number;
  readonly lastSeenMs: number;
  readonly settings: UserSettings;
}

export interface UserSettings {
  readonly readReceipts: boolean;
  readonly lastSeenVisible: boolean;
  readonly profilePhotoVisible: boolean;
  readonly notifications: boolean;
  readonly sound: boolean;
  readonly vibration: boolean;
  readonly taskReminders: boolean;
  readonly eventReminders: boolean;
  readonly enterToSend: boolean;
  readonly autoDownload: boolean;
  readonly cloudBackup: boolean;
  readonly appLock: boolean;
  readonly fcmTokens: readonly string[];
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  readReceipts: true,
  lastSeenVisible: true,
  profilePhotoVisible: true,
  notifications: true,
  sound: true,
  vibration: true,
  taskReminders: true,
  eventReminders: true,
  enterToSend: true,
  autoDownload: true,
  cloudBackup: false,
  appLock: false,
  fcmTokens: [],
};

/** Validation Zod pour les inputs serveur/client. */
export const PhoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{6,14}$/, 'Numero de telephone invalide');

export const NameSchema = z.string().trim().min(1).max(40);
export const BioSchema = z.string().trim().max(200);

export const UserProfileInputSchema = z.object({
  name: NameSchema,
  bio: BioSchema.optional(),
  avatar: z.string().url().nullable().optional(),
});

export type UserProfileInput = z.infer<typeof UserProfileInputSchema>;
