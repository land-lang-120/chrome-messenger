/**
 * Tests unitaires CRITIQUES — crypto service.
 * Couverture cible : 100 %.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateUserKeypair,
  importPrivateKey,
  importPublicKey,
  deriveConversationKey,
  encryptMessage,
  decryptMessage,
  convKeyCache,
  generateSalt,
  deriveAppLockKey,
} from './crypto';

describe('crypto.generateUserKeypair', () => {
  it('genere une paire ECDH P-256 valide', async () => {
    const kp = await generateUserKeypair();
    expect(kp.privateKeyJwk.kty).toBe('EC');
    expect(kp.privateKeyJwk.crv).toBe('P-256');
    expect(kp.publicKeyJwk.kty).toBe('EC');
    expect(kp.publicKeyJwk.crv).toBe('P-256');
    expect(kp.privateKeyJwk.d).toBeDefined(); // scalar prive
    expect(kp.publicKeyJwk.d).toBeUndefined(); // jamais sur la publique
  });
});

describe('crypto ECDH symetrie', () => {
  it('Alice et Bob derivent la meme cle de conversation', async () => {
    const alice = await generateUserKeypair();
    const bob = await generateUserKeypair();

    const aliceKey = await deriveConversationKey(
      await importPrivateKey(alice.privateKeyJwk),
      await importPublicKey(bob.publicKeyJwk),
    );
    const bobKey = await deriveConversationKey(
      await importPrivateKey(bob.privateKeyJwk),
      await importPublicKey(alice.publicKeyJwk),
    );

    // Test indirect de symetrie : chiffrer avec l'une, dechiffrer avec l'autre
    const envelope = await encryptMessage(aliceKey, 'Salut Bob !');
    const decoded = await decryptMessage(bobKey, envelope);
    expect(decoded).toBe('Salut Bob !');
  });
});

describe('crypto IV unique', () => {
  it('chaque chiffrement produit un IV different (pas de reuse)', async () => {
    const kp = await generateUserKeypair();
    const key = await deriveConversationKey(
      await importPrivateKey(kp.privateKeyJwk),
      await importPublicKey(kp.publicKeyJwk),
    );

    const e1 = await encryptMessage(key, 'msg');
    const e2 = await encryptMessage(key, 'msg');
    expect(e1.iv).not.toBe(e2.iv);
    expect(e1.ciphertext).not.toBe(e2.ciphertext);
  });
});

describe('crypto AEAD integrity', () => {
  it('dechiffrement echoue si ciphertext altere', async () => {
    const kp = await generateUserKeypair();
    const key = await deriveConversationKey(
      await importPrivateKey(kp.privateKeyJwk),
      await importPublicKey(kp.publicKeyJwk),
    );
    const env = await encryptMessage(key, 'sensible');
    const tampered = { ...env, ciphertext: env.ciphertext.slice(0, -4) + 'AAAA' };
    await expect(decryptMessage(key, tampered)).rejects.toThrow();
  });

  it('dechiffrement echoue si IV altere', async () => {
    const kp = await generateUserKeypair();
    const key = await deriveConversationKey(
      await importPrivateKey(kp.privateKeyJwk),
      await importPublicKey(kp.publicKeyJwk),
    );
    const env = await encryptMessage(key, 'sensible');
    const tampered = { ...env, iv: Buffer.from(new Uint8Array(12).fill(0)).toString('base64') };
    await expect(decryptMessage(key, tampered)).rejects.toThrow();
  });
});

describe('convKeyCache LRU', () => {
  beforeEach(() => convKeyCache.clear());

  it('evince la cle la plus ancienne apres limite', async () => {
    const kp = await generateUserKeypair();
    const key = await deriveConversationKey(
      await importPrivateKey(kp.privateKeyJwk),
      await importPublicKey(kp.publicKeyJwk),
    );
    // Si la limite est 50, on en ajoute 51 pour forcer l'eviction
    for (let i = 0; i < 51; i++) {
      convKeyCache.set(`conv-${i}`, key);
    }
    expect(convKeyCache.get('conv-0')).toBeUndefined();
    expect(convKeyCache.get('conv-50')).toBeDefined();
  });
});

describe('appLock derivation PBKDF2', () => {
  it('genere un salt de 16 bytes', () => {
    const s = generateSalt();
    expect(s.byteLength).toBe(16);
    expect(s).toBeInstanceOf(ArrayBuffer);
  });

  it('derive une cle AES a partir d\'un PIN + salt', async () => {
    const salt = generateSalt();
    const key = await deriveAppLockKey('1234', salt);
    expect(key).toBeDefined();
    expect(key.algorithm.name).toBe('AES-GCM');
  });

  it('meme PIN + meme salt = meme cle (chiffrer / dechiffrer round-trip)', async () => {
    const salt = generateSalt();
    const k1 = await deriveAppLockKey('monpin', salt);
    const k2 = await deriveAppLockKey('monpin', salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k1, new TextEncoder().encode('test'));
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, k2, cipher);
    expect(new TextDecoder().decode(plain)).toBe('test');
  });
});
