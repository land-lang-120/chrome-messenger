# ARCHITECTURE — Chrome Messenger

> Décisions techniques détaillées, justifiées, avec schémas.
> Référence vivante : à mettre à jour à chaque décision d'architecture majeure.

---

## 1. Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    UTILISATEUR                          │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS / WebSocket
┌──────────────────────────▼──────────────────────────────┐
│              PWA (Service Worker + Manifest)            │
│  ┌───────────────────────────────────────────────────┐  │
│  │              React 18 + TypeScript                │  │
│  │                                                   │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌───────────┐  │  │
│  │  │  Features  │  │   Hooks     │  │Components │  │  │
│  │  │  (domain)  │  │  (logic)    │  │   (UI)    │  │  │
│  │  └─────┬──────┘  └──────┬──────┘  └─────┬─────┘  │  │
│  │        │                │                │        │  │
│  │        └────────────────┴────────────────┘        │  │
│  │                          │                        │  │
│  │  ┌───────────────────────▼────────────────────┐   │  │
│  │  │              Services Layer                │   │  │
│  │  │  ┌──────────┐ ┌─────────┐ ┌────────────┐   │   │  │
│  │  │  │ Firebase │ │ Crypto  │ │  Storage   │   │   │  │
│  │  │  │ (auth,   │ │ (ECDH + │ │ (localSt,  │   │   │  │
│  │  │  │  DB,     │ │ AES-GCM)│ │  IndexedDB)│   │   │  │
│  │  │  │  FCM)    │ │         │ │            │   │   │  │
│  │  │  └──────────┘ └─────────┘ └────────────┘   │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌────────────────┐ ┌────────────────┐ ┌──────────────┐
│ Firebase Auth  │ │   Firestore    │ │   Storage    │
│  (Phone OTP)   │ │  (messages     │ │  (médias)    │
│                │ │   chiffrés,    │ │              │
│                │ │   metadata)    │ │              │
└────────────────┘ └────────┬───────┘ └──────────────┘
                            │ onCreate triggers
                            ▼
                   ┌──────────────────┐
                   │ Cloud Functions  │
                   │  - sendPush      │
                   │  - cleanStories  │
                   │  - eventReminder │
                   └──────┬───────────┘
                          ▼
                   ┌──────────────┐
                   │ FCM (push)   │
                   └──────────────┘
```

---

## 2. Arborescence `src/` (après migration TypeScript)

```
src/
├── main.tsx                       # Entrée React, mount #root
├── App.tsx                        # Router + providers
├── config.ts                      # Constantes + feature flags
├── env.ts                         # Variables d'env (typées)
│
├── types/
│   ├── index.ts                   # Exports groupés
│   ├── user.ts
│   ├── message.ts
│   ├── conversation.ts
│   ├── story.ts
│   ├── task.ts
│   ├── event.ts
│   └── notification.ts
│
├── components/                    # UI réutilisable (dumb)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Avatar/
│   ├── Header/
│   ├── IconButton/
│   ├── BottomNav/
│   ├── Input/
│   ├── Toggle/
│   ├── BottomSheet/
│   ├── Toast/
│   ├── ChameleonLogo/
│   └── icons/
│       ├── Icons.tsx              # Bibliothèque Fluent-style
│       └── types.ts
│
├── features/                      # Feature modules (domain)
│   ├── onboarding/
│   │   ├── OnboardingScreen.tsx
│   │   ├── WelcomeStep.tsx
│   │   ├── PhoneStep.tsx
│   │   ├── OtpStep.tsx
│   │   ├── ProfileStep.tsx
│   │   └── useOnboarding.ts
│   ├── chat/
│   │   ├── ChatScreen.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   ├── useChat.ts
│   │   ├── useMessages.ts
│   │   └── chat.api.ts
│   ├── home/
│   │   ├── HomeScreen.tsx
│   │   ├── StatusesSection.tsx
│   │   ├── DiscussionsSection.tsx
│   │   └── useHome.ts
│   ├── todolist/
│   │   ├── TodoScreen.tsx
│   │   ├── MonthView.tsx
│   │   ├── WeekView.tsx
│   │   ├── TaskCard.tsx
│   │   ├── AddTaskSheet.tsx
│   │   └── useTasks.ts
│   ├── games/
│   │   ├── GamesScreen.tsx
│   │   └── GameCard.tsx
│   ├── notifs/
│   │   ├── NotifsScreen.tsx
│   │   └── useNotifs.ts
│   ├── stories/
│   │   ├── StoryViewer.tsx
│   │   ├── AddStorySheet.tsx
│   │   └── useStories.ts
│   ├── events/
│   │   ├── EventsScreen.tsx
│   │   ├── CreateEventSheet.tsx
│   │   ├── EventQrCode.tsx
│   │   ├── QrScannerScreen.tsx
│   │   └── useEvents.ts
│   ├── premium/
│   │   ├── PremiumScreen.tsx
│   │   ├── PlanCard.tsx
│   │   └── usePremium.ts
│   ├── settings/
│   │   ├── SettingsScreen.tsx
│   │   ├── LanguageScreen.tsx
│   │   ├── EditProfileScreen.tsx
│   │   ├── BlockedContactsScreen.tsx
│   │   └── useSettings.ts
│   └── contacts/
│       ├── ContactsScreen.tsx
│       ├── AddContactSheet.tsx
│       └── useContacts.ts
│
├── hooks/                         # Hooks partagés entre features
│   ├── useAuth.ts
│   ├── useTheme.ts
│   ├── useI18n.ts
│   ├── useLocalStorage.ts
│   ├── useNetwork.ts
│   └── useToast.ts
│
├── services/                      # Intégrations externes
│   ├── firebase/
│   │   ├── index.ts               # init Firebase App
│   │   ├── auth.ts                # Phone OTP, sessions
│   │   ├── firestore.ts           # CRUD typé
│   │   ├── storage.ts             # Upload/download médias
│   │   ├── messaging.ts           # FCM push
│   │   └── functions.ts           # Appels Cloud Functions
│   ├── crypto.ts                  # ECDH + AES-GCM
│   ├── storage.ts                 # localStorage + IndexedDB
│   └── analytics.ts               # Events Firebase Analytics
│
├── contexts/
│   ├── AuthContext.tsx            # user courant + login/logout
│   ├── ThemeContext.tsx           # thème actif + switch
│   └── I18nContext.tsx            # langue + t()
│
├── i18n/
│   ├── index.ts
│   ├── fr.ts
│   ├── en.ts
│   ├── es.ts
│   └── ... (16 fichiers)
│
├── utils/                         # Fonctions pures
│   ├── date.ts
│   ├── format.ts
│   ├── validators.ts
│   └── array.ts
│
├── styles/
│   ├── global.css
│   ├── tokens.css                 # Design tokens CSS vars
│   └── themes.css                 # 8 thèmes + dark mode
│
└── assets/
    ├── logo-chameleon.svg
    └── icons/
```

---

## 3. Flux de données

### 3.1 Envoi d'un message

```
User tape texte → MessageInput (local state)
           ↓ submit
useMessages.send(convId, text)
           ↓
crypto.encrypt(convId, text) → { ciphertext, iv }
           ↓
firestore.addMessage(convId, {
  senderId: currentUser.uid,
  cipher: { ciphertext, iv },
  sentAt: serverTimestamp()
})
           ↓
Firestore onSnapshot → MessageList rerender
           ↓
Cloud Function onMessageCreated → FCM push vers destinataire
```

### 3.2 Réception d'un message

```
Firestore onSnapshot (toujours actif sur conv active)
           ↓
useMessages.messages[] (hook state)
           ↓
crypto.decrypt(convId, cipher) → text (lazy, cache LRU)
           ↓
MessageBubble rendered with text
```

### 3.3 Offline

```
Firebase SDK → persistence IndexedDB activée
           ↓
En offline : lecture depuis IndexedDB cache
           ↓
Écritures mises en queue (Firestore SDK auto)
           ↓
Reconnexion : sync auto
```

---

## 4. Choix techniques justifiés

### 4.1 Pourquoi pas Redux ?

- **Complexité** : Redux ajoute beaucoup de boilerplate pour peu de gain
- **État de l'app** : majoritairement local à chaque écran + temps réel Firestore
- **Alternatives suffisantes** : Context + hooks custom pour l'état global léger (theme, auth)
- **Si besoin futur** : Zustand (8kb, API minimaliste) > Redux

### 4.2 Pourquoi pas de routeur (react-router) ?

- **Navigation mobile-first** : pas de vraie URL navigation (PWA fullscreen)
- **État `view` simple** : 8-10 écrans max, state-based suffit
- **Poids** : évite 10kb de router
- **Si besoin desktop** : envisager TanStack Router en v2

### 4.3 Pourquoi CSS-in-JS inline + CSS vars ?

- **Zéro dépendance** (pas de styled-components / emotion)
- **Tree-shaking parfait** : aucun CSS inutilisé
- **Thèmes dynamiques** : CSS vars changent instantanément
- **Lisibilité** : style colocalisé avec le composant
- **Trade-off** : un peu plus verbeux, mais accepté

### 4.4 Pourquoi Vite plutôt que Webpack/CRA ?

- **Dev server instantané** (ESM natif)
- **Build ultra-rapide** (Rollup)
- **TypeScript support natif** (via esbuild)
- **Support PWA officiel** (`vite-plugin-pwa`)

### 4.5 Pourquoi ECDH P-256 + AES-GCM ?

- **ECDH P-256** : courbe elliptique standard, supportée par Web Crypto API natif (pas de lib)
- **AES-GCM 256** : authenticated encryption, rapide, standard
- **Alternative Signal Protocol** : plus robuste (Double Ratchet) mais nécessite bibliothèque (libsignal-protocol-javascript), complexité accrue → v2 envisagée

### 4.6 Pourquoi Firebase plutôt que backend custom ?

- **Time to market** : 0 serveur à gérer
- **Free tier** généreux (50k MAU, 1GB DB, 10GB Storage)
- **Offline-first** : IndexedDB automatique
- **Push natif** : FCM gratuit et fiable
- **Évolutif** : Cloud Functions scalent automatiquement
- **Migration AWS si scale** : abstraction `services/firebase` permet swap

---

## 5. État & stores

### 5.1 État local (useState)

Composants isolés (formulaires, toggles UI).

### 5.2 État feature (useReducer)

Logique complexe (chat state avec pending/sending/failed).

```ts
type ChatState = {
  messages: Message[];
  status: 'idle' | 'loading' | 'error';
  error?: string;
};

type ChatAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; messages: Message[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SEND_OPTIMISTIC'; message: Message }
  | { type: 'SEND_SUCCESS'; id: string }
  | { type: 'SEND_FAILED'; id: string };
```

### 5.3 État global (Context)

| Context | Contenu | Persistance |
|---|---|---|
| `AuthContext` | `user`, `isAuth`, `login()`, `logout()` | Firebase Auth |
| `ThemeContext` | `theme`, `setTheme()`, `darkMode` | localStorage |
| `I18nContext` | `lang`, `setLang()`, `t()` | localStorage |

### 5.4 État temps réel (Firestore onSnapshot)

Pas de store manuel : les composants s'abonnent directement via hooks (`useMessages`, `useConversations`).

---

## 6. Gestion des erreurs

### 6.1 Stratégie

- **Erreurs typées** : classes custom (`AuthError`, `CryptoError`, `NetworkError`)
- **Error Boundary** React pour crashes UI
- **Logs** : Firebase Crashlytics + console.error en dev
- **Affichage user** : toasts non bloquants + retry

### 6.2 Exemple

```ts
try {
  await sendMessage(convId, text);
} catch (err) {
  if (err instanceof NetworkError) {
    toast.show('Pas de connexion, envoi en attente…', 'warning');
    queueOfflineMessage(text);
  } else if (err instanceof CryptoError) {
    toast.show('Erreur de chiffrement', 'error');
    analytics.logError('crypto_fail', { err });
  } else {
    toast.show('Erreur inconnue', 'error');
    crashlytics.record(err);
  }
}
```

---

## 7. Performance

### 7.1 Optimisations appliquées

| Optimisation | Où | Pourquoi |
|---|---|---|
| Code splitting | `React.lazy` sur écrans secondaires | Réduire bundle initial |
| `React.memo` | `MessageBubble`, `ChatListItem` | Éviter re-renders dans listes longues |
| Virtualisation | `MessageList` (> 100 msgs) | Perf scroll |
| Pagination messages | 50 derniers + infinite scroll | Limiter reads Firestore |
| LRU cache clés | `cryptoKeyCache` max 50 conv | RAM bornée |
| `loading="lazy"` | Images profils, médias | Data mobile |
| Service Worker | Cache stale-while-revalidate | Chargement instant après 1ère visite |

### 7.2 Budgets

- Bundle JS initial : **≤ 200 KB gzip**
- Bundle total : **≤ 500 KB gzip**
- FCP : **≤ 1.5 s** en 3G slow
- TTI : **≤ 3 s** en 3G slow

---

## 8. Sécurité — détails d'implémentation

### 8.1 Génération de clé (inscription)

```ts
async function generateUserKeypair(): Promise<{ publicKeyJwk: JsonWebKey; privateKeyJwk: JsonWebKey }> {
  const keypair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keypair.publicKey);
  const privateKeyJwk = await crypto.subtle.exportKey('jwk', keypair.privateKey);
  return { publicKeyJwk, privateKeyJwk };
}
```

### 8.2 Dérivation clé de conversation

```ts
async function deriveConvKey(myPrivateKey: CryptoKey, theirPublicKey: CryptoKey, convId: string): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: 'ECDH', public: theirPublicKey },
    myPrivateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}
```

### 8.3 Règles Firestore

Voir `firestore.rules` (produit en Phase 3). Principes :
- `isAuth()` sur tous les reads
- `isSelf(uid)` sur writes de profil/contacts/tasks
- `isMember(conversation)` sur reads/writes de messages
- Jamais `allow … if true`

### 8.4 Audit de sécurité

À faire en Phase 3 (checklist) :
- [ ] Pas de `dangerouslySetInnerHTML`
- [ ] Pas d'`eval()` / `Function()`
- [ ] Validation schéma Firestore (pas juste client)
- [ ] CSP dans index.html
- [ ] HTTPS only
- [ ] Pas de secret côté client
- [ ] Password minimum 8 chars si PIN appLock
- [ ] Rate limiting OTP (Firebase natif)

---

## 9. Accessibilité

### 9.1 Checklist de base

- `lang="fr"` sur `<html>`, dynamique selon i18n
- `role` + `aria-label` sur tous les boutons-icônes
- Focus visible (outline 2px couleur thème)
- Taille tap ≥ 44×44
- Contraste texte vérifié avec axe-core
- Navigation clavier : `Tab` entre champs, `Enter` submit, `Escape` close modal

### 9.2 Lecteurs d'écran

- Messages annoncés via `aria-live="polite"` sur `MessageList`
- Toasts via `aria-live="assertive"`
- Statuts en ligne/hors ligne annoncés

---

## 10. Internationalisation

### 10.1 Structure

```ts
// i18n/fr.ts
export const fr = {
  welcome: 'Bienvenue',
  appName: 'Chrome Messenger',
  // ...
} as const;

// i18n/en.ts — types dérivés de fr
type Dict = typeof fr;
export const en: Dict = { /* ... */ };
```

### 10.2 Hook

```ts
function useI18n() {
  const { lang } = useContext(I18nContext);
  const dict = DICTS[lang];
  const t = useCallback((key: keyof Dict) => dict[key] ?? fr[key] ?? key, [dict]);
  return { t, lang };
}
```

### 10.3 RTL (arabe)

- `dir="rtl"` sur `<html>` si `lang === 'ar'`
- Layout flex reverse pour les bulles de chat
- Icônes back/forward miroirisées

---

## 11. PWA

### 11.1 Manifest (`manifest.json`)

```json
{
  "name": "Chrome Messenger",
  "short_name": "Chrome",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#30D79C",
  "background_color": "#FFFFFF",
  "icons": [
    { "src": "icons/icon-192.svg", "sizes": "192x192", "type": "image/svg+xml" },
    { "src": "icons/icon-512.svg", "sizes": "512x512", "type": "image/svg+xml" }
  ]
}
```

### 11.2 Service Worker

Stratégies :
- **Assets statiques** (JS/CSS/icons) : `cache-first`
- **API Firebase** : `network-only` (jamais cacher)
- **Images médias** : `stale-while-revalidate`
- **Offline fallback** : page de "mode hors ligne" si navigation impossible

---

## 12. Décisions à réévaluer

Liste vivante des points à revoir périodiquement :

- [ ] **Signal Protocol** (Double Ratchet) vs ECDH simple — trade-off sécurité/complexité
- [ ] **Redux / Zustand** si l'état global grossit trop
- [ ] **react-router** si besoin URL desktop
- [ ] **AWS Amplify** quand Firebase devient trop cher
- [ ] **Server-Sent Events** si WebSocket Firestore onSnapshot consomme trop

---

## 13. Historique des décisions

| Date | Décision | Justification |
|---|---|---|
| 2026-04-17 | React 18 CDN + JS pur | MVP rapide, pas de build |
| 2026-04-18 | Migration TypeScript + Vite | Qualité long terme, refacto safe |
| 2026-04-18 | Firebase confirmé | Free tier, offline-first |
| 2026-04-18 | React local (vendor/) | Preview fiable sans CDN |
| 2026-04-18 | Fluent-style icons + Manrope font | Fidélité design 87 |

---

_Architecture vivante : à mettre à jour dès qu'une décision significative est prise._
