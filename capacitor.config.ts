import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor config — Chrome Messenger.
 *
 * webDir : dossier du bundle web a embarquer dans l'APK (100% offline).
 * Chaque fichier JS/CSS/HTML est bundle dans l'APK natif, donc l'app
 * fonctionne SANS connexion ET SANS dependance a Chrome installe.
 *
 * android.allowMixedContent : false pour securite (HTTPS only).
 * android.captureInput : true pour gerer le clavier correctement.
 */
const config: CapacitorConfig = {
  appId: 'com.clonexstudio.chromemessenger',
  appName: 'Chrome Messenger',
  webDir: 'dist',
  backgroundColor: '#30D79C',
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    buildOptions: {
      keystorePath: 'android.keystore',
      keystoreAlias: 'android',
    },
  },
  ios: {
    backgroundColor: '#30D79C',
    contentInset: 'automatic',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: '#30D79C',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  server: {
    // En dev: live reload depuis vite dev-server
    // En prod: lit depuis webDir embarque dans l'APK
    androidScheme: 'https',
  },
};

export default config;
