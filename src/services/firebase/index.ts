/**
 * Firebase — initialisation + export des instances typees.
 *
 * SECURITE : la config publique est OK dans le bundle client,
 * la protection reelle vient des Firestore rules et App Check.
 *
 * En dev, pointe sur les emulateurs si VITE_ENABLE_EMULATORS=true.
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';

import { env } from '../../env';
import { FEATURES, IS_PROD } from '../../config';

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

/**
 * Initialise Firebase. Idempotent.
 * Retourne null si la config n'est pas fournie (mode dev pur localStorage).
 */
export function initFirebase(): FirebaseApp | null {
  if (_app) return _app;
  if (!env.firebase.apiKey) {
    if (IS_PROD) throw new Error('Firebase config missing in prod.');
    console.warn('[firebase] Config absente — mode local only (localStorage).');
    return null;
  }

  _app = initializeApp({
    apiKey: env.firebase.apiKey,
    authDomain: env.firebase.authDomain,
    projectId: env.firebase.projectId,
    storageBucket: env.firebase.storageBucket,
    messagingSenderId: env.firebase.messagingSenderId,
    appId: env.firebase.appId,
  });

  _auth = getAuth(_app);
  _db = getFirestore(_app);
  _storage = getStorage(_app);

  if (FEATURES.USE_EMULATORS && !IS_PROD) {
    try {
      connectAuthEmulator(_auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(_db, 'localhost', 8080);
      connectStorageEmulator(_storage, 'localhost', 9199);
      console.info('[firebase] Connecte aux emulateurs.');
    } catch (err) {
      console.warn('[firebase] Connexion emulateurs echouee:', err);
    }
  }

  // Offline-first : cache IndexedDB
  enableIndexedDbPersistence(_db).catch((err: unknown) => {
    const error = err as { code?: string };
    if (error.code === 'failed-precondition') {
      console.warn('[firebase] Multi-tab ouvert : persistance desactivee dans cet onglet.');
    } else if (error.code === 'unimplemented') {
      console.warn('[firebase] Navigateur sans support IndexedDB.');
    }
  });

  return _app;
}

export function getFirebaseApp(): FirebaseApp {
  if (!_app) throw new Error('Firebase non initialise. Appeler initFirebase() d\'abord.');
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) throw new Error('Firebase Auth non initialise.');
  return _auth;
}

export function getFirebaseDb(): Firestore {
  if (!_db) throw new Error('Firestore non initialise.');
  return _db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) throw new Error('Firebase Storage non initialise.');
  return _storage;
}

/** True si Firebase est utilisable (config fournie). Sinon on tombe sur localStorage. */
export function isFirebaseEnabled(): boolean {
  return _app !== null;
}
