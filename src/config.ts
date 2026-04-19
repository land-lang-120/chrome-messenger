/**
 * Configuration globale de l'application.
 * Constantes + feature flags. Valeurs sensibles dans `.env.local`.
 */

export const CM_APP_VERSION = '1.0.0-pilot' as const;

/**
 * Environnement d'execution — lu depuis les variables Vite.
 * @see .env.example pour la liste complete des vars.
 */
export const APP_ENV = (import.meta.env.VITE_APP_ENV ?? 'dev') as 'dev' | 'staging' | 'prod';

export const IS_DEV = APP_ENV === 'dev';
export const IS_PROD = APP_ENV === 'prod';

/** Feature flags. Permettent d'activer/desactiver sans redeployer. */
export const FEATURES = {
  USE_EMULATORS: import.meta.env.VITE_ENABLE_EMULATORS === 'true',
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  CRASHLYTICS: import.meta.env.VITE_ENABLE_CRASHLYTICS === 'true',
} as const;

/** Limites de l'app (securite + UX). */
export const LIMITS = {
  NAME_MAX: 40,
  BIO_MAX: 200,
  MESSAGE_MAX: 4000,
  FILE_MAX_BYTES: 10 * 1024 * 1024, // 10 MB
  STORY_DURATION_MS: 24 * 60 * 60 * 1000, // 24 h
  OTP_DIGITS: 6,
  OTP_TTL_MS: 5 * 60 * 1000, // 5 min
  CRYPTO_KEY_CACHE_SIZE: 50,
  MESSAGES_PAGE_SIZE: 50,
} as const;

/** Cles localStorage prefixees pour eviter collisions avec d'autres apps. */
export const LS_KEYS = {
  profile: 'cm_profile',
  settings: 'cm_settings',
  theme: 'cm_theme',
  lang: 'cm_lang',
  onboarded: 'cm_onboarded',
  privateKey: 'cm_crypto_priv',
  publicKey: 'cm_crypto_pub',
  appLockHash: 'cm_app_lock_hash',
  appLockSalt: 'cm_app_lock_salt',
} as const;
