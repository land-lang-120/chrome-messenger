/**
 * ============================================================
 * CRYPTO SERVICE — Chiffrement E2E (ECDH P-256 + AES-GCM 256)
 * ============================================================
 *
 * SECURITE CRITIQUE - 100% couverture de tests requise.
 *
 * Primitives :
 * - Echange de cle : ECDH sur courbe P-256 (NIST)
 * - Chiffrement : AES-GCM 256 bits (authenticated, IV 96 bits aleatoire par msg)
 * - RNG : crypto.getRandomValues() (Web Crypto API natif, CSPRNG)
 *
 * Garanties :
 * - La cle privee NE quitte JAMAIS le client.
 * - Chaque message a un IV unique et aleatoire (pas de reuse).
 * - AES-GCM fournit authentification (AEAD) : tampering detecte.
 * - Le serveur ne voit que { ciphertext, iv }, jamais le plaintext.
 *
 * Limitations v1 :
 * - Pas de forward secrecy (Double Ratchet prevu v2).
 * - Pas de verification de cle (QR "safety number" prevu v2).
 * - Derivation directe de la cle ECDH (HKDF avec salt prevu v2).
 */

import { LIMITS } from '../config';
import type { CipherEnvelope } from '../types/message';

/* =============================================================
   HELPERS — encoding
   ============================================================= */

function bufToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    s += String.fromCharCode(bytes[i]!);
  }
  return btoa(s);
}

function base64ToBuf(b64: string): ArrayBuffer {
  const s = atob(b64);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    bytes[i] = s.charCodeAt(i);
  }
  return bytes.buffer;
}

/* =============================================================
   GENERATION DE CLES
   ============================================================= */

export interface UserKeypair {
  readonly privateKeyJwk: JsonWebKey;
  readonly publicKeyJwk: JsonWebKey;
}

/**
 * Genere une nouvelle paire ECDH P-256.
 *
 * La cle privee est `extractable: true` pour permettre l'export JWK
 * (stockage chiffre cote client). ELLE NE DOIT JAMAIS ETRE UPLOADEE.
 */
export async function generateUserKeypair(): Promise<UserKeypair> {
  const keypair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    /* extractable */ true,
    ['deriveKey'],
  );
  const privateKeyJwk = await crypto.subtle.exportKey('jwk', keypair.privateKey);
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keypair.publicKey);
  return { privateKeyJwk, publicKeyJwk };
}

/** Re-importe une cle privee ECDH depuis JWK. */
export async function importPrivateKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    /* extractable */ false, // une fois importee, non-extractable pour securite
    ['deriveKey'],
  );
}

/** Re-importe une cle publique ECDH depuis JWK. */
export async function importPublicKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    /* extractable */ true,
    [], // pas d'usage direct, juste pour deriveKey ensuite
  );
}

/* =============================================================
   DERIVATION DE CLE DE CONVERSATION
   ============================================================= */

/**
 * Derive une cle AES-GCM partagee entre deux utilisateurs via ECDH.
 * Symetrique : Alice et Bob obtiennent la meme cle.
 */
export async function deriveConversationKey(
  myPrivateKey: CryptoKey,
  theirPublicKey: CryptoKey,
): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: 'ECDH', public: theirPublicKey },
    myPrivateKey,
    { name: 'AES-GCM', length: 256 },
    /* extractable */ false,
    ['encrypt', 'decrypt'],
  );
}

/* =============================================================
   CHIFFREMENT / DECHIFFREMENT
   ============================================================= */

/**
 * Chiffre un message texte avec AES-GCM 256.
 * IV aleatoire 12 bytes genere a chaque appel (CRITIQUE : pas de reuse).
 */
export async function encryptMessage(
  convKey: CryptoKey,
  plaintext: string,
): Promise<CipherEnvelope> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    convKey,
    encoded,
  );
  return {
    ciphertext: bufToBase64(ciphertextBuf),
    iv: bufToBase64(iv.buffer),
  };
}

/**
 * Dechiffre un message. Echoue si le tag AEAD est invalide (message altere).
 *
 * @throws DOMException si ciphertext ou IV corrompus.
 */
export async function decryptMessage(
  convKey: CryptoKey,
  envelope: CipherEnvelope,
): Promise<string> {
  const iv = new Uint8Array(base64ToBuf(envelope.iv));
  const ciphertext = base64ToBuf(envelope.ciphertext);
  const plainBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    convKey,
    ciphertext,
  );
  return new TextDecoder().decode(plainBuf);
}

/* =============================================================
   CACHE LRU DES CLES DE CONVERSATION
   ============================================================= */

/**
 * LRU simple pour eviter de re-deriver la cle a chaque message.
 * Capacite : LIMITS.CRYPTO_KEY_CACHE_SIZE.
 * Eviction : la plus ancienne acces sortie en premier.
 */
class ConvKeyCache {
  private readonly map = new Map<string, CryptoKey>();

  get(convId: string): CryptoKey | undefined {
    const key = this.map.get(convId);
    if (key) {
      // Re-insert pour rafraichir LRU
      this.map.delete(convId);
      this.map.set(convId, key);
    }
    return key;
  }

  set(convId: string, key: CryptoKey): void {
    if (this.map.has(convId)) this.map.delete(convId);
    this.map.set(convId, key);
    if (this.map.size > LIMITS.CRYPTO_KEY_CACHE_SIZE) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
  }

  clear(): void {
    this.map.clear();
  }
}

export const convKeyCache = new ConvKeyCache();

/* =============================================================
   APP LOCK (PIN) — chiffrement local de la cle privee
   ============================================================= */

/**
 * Derive une cle AES-256 depuis un PIN utilisateur via PBKDF2 (100k iterations).
 * Utilise pour chiffrer la private key ECDH dans localStorage.
 */
export async function deriveAppLockKey(pin: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const pinKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    pinKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Genere un salt aleatoire (16 bytes) pour PBKDF2. */
export function generateSalt(): ArrayBuffer {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return buf.buffer;
}
