/**
 * Firebase Auth — Phone OTP.
 * Abstrait les appels Firebase pour simplifier les tests + permettre un swap backend plus tard.
 */

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  type ConfirmationResult,
  type User as FirebaseUser,
} from 'firebase/auth';

import { getFirebaseAuth, isFirebaseEnabled } from './index';
import { PhoneSchema } from '../../types/user';

export class AuthError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

let _confirmation: ConfirmationResult | null = null;

/** Validation + envoi OTP. Retourne l'ID de la confirmation a utiliser pour verifier. */
export async function sendOtp(phone: string, recaptchaContainerId = 'recaptcha-container'): Promise<void> {
  const parsed = PhoneSchema.safeParse(phone);
  if (!parsed.success) {
    throw new AuthError(parsed.error.errors[0]?.message ?? 'Numero invalide', 'auth/invalid-phone');
  }
  if (!isFirebaseEnabled()) {
    // Mode dev local : pas de vrai SMS, le code sera "123456"
    console.info('[auth] Dev mode — OTP simule : 123456');
    return;
  }

  const auth = getFirebaseAuth();
  const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, { size: 'invisible' });
  try {
    _confirmation = await signInWithPhoneNumber(auth, parsed.data, verifier);
  } catch (err) {
    const error = err as { code?: string; message?: string };
    throw new AuthError(error.message ?? 'Echec envoi OTP', error.code);
  }
}

/** Verifie le code OTP. Retourne l'user Firebase (ou un mock en dev local). */
export async function verifyOtp(code: string): Promise<FirebaseUser | { uid: string; phoneNumber: string }> {
  if (!/^\d{6}$/.test(code)) {
    throw new AuthError('Code invalide (6 chiffres attendus)', 'auth/invalid-code');
  }
  if (!isFirebaseEnabled()) {
    if (code !== '123456') throw new AuthError('Code incorrect', 'auth/code-mismatch');
    return { uid: 'dev-user', phoneNumber: '+00000000000' };
  }
  if (!_confirmation) throw new AuthError('Aucune confirmation en attente', 'auth/no-confirmation');
  try {
    const result = await _confirmation.confirm(code);
    _confirmation = null;
    return result.user;
  } catch (err) {
    const error = err as { code?: string; message?: string };
    throw new AuthError(error.message ?? 'Code incorrect', error.code);
  }
}

export async function logout(): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await signOut(getFirebaseAuth());
}

/** Observer l'etat d'authentification. Retourne une fonction de cleanup. */
export function onAuthChange(cb: (user: FirebaseUser | null) => void): () => void {
  if (!isFirebaseEnabled()) {
    cb(null);
    return () => undefined;
  }
  return onAuthStateChanged(getFirebaseAuth(), cb);
}
