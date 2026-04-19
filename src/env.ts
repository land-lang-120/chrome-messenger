/**
 * Variables d'environnement typees + validation au demarrage.
 * Empeche l'app de demarrer si une var critique manque en prod.
 */

import { IS_PROD } from './config';

export interface AppEnv {
  readonly firebase: {
    readonly apiKey: string;
    readonly authDomain: string;
    readonly projectId: string;
    readonly storageBucket: string;
    readonly messagingSenderId: string;
    readonly appId: string;
    readonly vapidKey: string | null;
  };
}

function req(key: string, value: string | undefined, required: boolean): string {
  if (!value) {
    if (required) {
      throw new Error(`[env] Variable VITE_${key} manquante (requise en prod).`);
    }
    return '';
  }
  return value;
}

export const env: AppEnv = {
  firebase: {
    apiKey: req('FB_API_KEY', import.meta.env.VITE_FB_API_KEY, IS_PROD),
    authDomain: req('FB_AUTH_DOMAIN', import.meta.env.VITE_FB_AUTH_DOMAIN, IS_PROD),
    projectId: req('FB_PROJECT_ID', import.meta.env.VITE_FB_PROJECT_ID, IS_PROD),
    storageBucket: req('FB_STORAGE_BUCKET', import.meta.env.VITE_FB_STORAGE_BUCKET, IS_PROD),
    messagingSenderId: req('FB_MESSAGING_ID', import.meta.env.VITE_FB_MESSAGING_ID, IS_PROD),
    appId: req('FB_APP_ID', import.meta.env.VITE_FB_APP_ID, IS_PROD),
    vapidKey: import.meta.env.VITE_FB_VAPID || null,
  },
};
