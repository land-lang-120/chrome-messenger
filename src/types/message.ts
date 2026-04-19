import { z } from 'zod';

export type MessageKind = 'text' | 'voice' | 'photo' | 'video' | 'doc' | 'event-invite';

/** Enveloppe chiffree envoyee au serveur. Le serveur n'a PAS la cle. */
export interface CipherEnvelope {
  readonly ciphertext: string; // base64
  readonly iv: string; // base64, 12 bytes
}

export interface Message {
  readonly id: string;
  readonly convId: string;
  readonly senderId: string;
  readonly kind: MessageKind;
  readonly cipher: CipherEnvelope;
  readonly sentAtMs: number;
  readonly deliveredAtMs: number | null;
  readonly readAtByUid: Readonly<Record<string, number>>;
  readonly replyToId: string | null;
  readonly reactionsByUid: Readonly<Record<string, string>>; // emoji
  /** Rendu apres decryption cote client (non stocke serveur). */
  readonly plaintext?: string;
}

/** Validation du texte avant chiffrement. */
export const MessageTextSchema = z.string().trim().min(1).max(4000);

export const CipherEnvelopeSchema = z.object({
  ciphertext: z.string().min(1),
  iv: z.string().length(16), // base64 de 12 bytes = 16 chars
});
