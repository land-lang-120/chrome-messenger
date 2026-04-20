/**
 * Variables d'environnement typees.
 * On NE throw JAMAIS au top-level : si Firebase n'est pas configure,
 * l'app fonctionne en mode local (localStorage uniquement) avec un warn.
 */

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

function safe(value: string | undefined): string {
  return value ?? '';
}

export const env: AppEnv = {
  firebase: {
    apiKey: safe(import.meta.env.VITE_FB_API_KEY),
    authDomain: safe(import.meta.env.VITE_FB_AUTH_DOMAIN),
    projectId: safe(import.meta.env.VITE_FB_PROJECT_ID),
    storageBucket: safe(import.meta.env.VITE_FB_STORAGE_BUCKET),
    messagingSenderId: safe(import.meta.env.VITE_FB_MESSAGING_ID),
    appId: safe(import.meta.env.VITE_FB_APP_ID),
    vapidKey: import.meta.env.VITE_FB_VAPID || null,
  },
};

/** True si Firebase est configure (sinon on reste en mode local). */
export const IS_FIREBASE_CONFIGURED = env.firebase.apiKey !== '';

if (!IS_FIREBASE_CONFIGURED) {
  console.warn('[env] Firebase non configure — mode local (localStorage) active.');
}
