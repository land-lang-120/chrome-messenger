import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

/**
 * Vite config — Chrome Messenger.
 *
 * Security notes :
 * - CSP headers sont appliques dans index.html (balise meta)
 * - `sourcemap: true` en prod est acceptable : les bundles sont minifies et la CSP empeche l'exec
 * - Les variables d'env commencant par VITE_ sont exposees au client (jamais de secrets !)
 */
// Base du site :
// - Build Capacitor (APK natif) → '/' (fichiers embarques en local dans l'APK)
// - Build GitHub Pages prod → '/chrome-messenger/' (sous-chemin du user-site)
// - Vite dev-server → '/'
// Selection via VITE_BUILD_TARGET=capacitor.
const BASE =
  process.env.VITE_BUILD_TARGET === 'capacitor'
    ? './'
    : process.env.VITE_APP_ENV === 'prod'
      ? '/chrome-messenger/'
      : '/';

// En mode Capacitor, on desactive le service worker : il est inutile
// (tout est deja local dans l'APK) ET peut planter en intercepant les
// requetes vers le scheme natif https://localhost.
const IS_CAPACITOR = process.env.VITE_BUILD_TARGET === 'capacitor';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    ...(IS_CAPACITOR ? [] : [VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.svg'],
      manifest: {
        name: 'Chrome Messenger',
        short_name: 'Chrome',
        description: 'Messagerie chiffree E2E avec todolist, jeux et statuts',
        theme_color: '#30D79C',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            // Ne JAMAIS cacher les requetes Firestore (securite + frais cache)
            urlPattern: /^https:\/\/firestore\.googleapis\.com/,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    })]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@i18n': path.resolve(__dirname, './src/i18n'),
    },
  },
  server: {
    port: 3007,
    host: true,
    strictPort: true,
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Firebase pour reduire le bundle initial
          'firebase-auth': ['firebase/auth'],
          'firebase-firestore': ['firebase/firestore'],
          'firebase-storage': ['firebase/storage'],
          'firebase-messaging': ['firebase/messaging'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.d.ts', 'src/main.tsx'],
    },
  },
});
