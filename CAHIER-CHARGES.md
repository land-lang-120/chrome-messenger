# CAHIER DES CHARGES — Chrome Messenger

---

## 📇 Fiche d'identité

| Attribut | Valeur |
|---|---|
| **Nom** | Chrome Messenger |
| **Identifiant technique** | `chrome-messenger` |
| **Version cible** | 1.0.0 |
| **Type** | Messagerie instantanée chiffrée E2E |
| **Plateformes** | PWA Web + Android (TWA) + iOS (PWABuilder) |
| **Langues** | fr, en, es, pt, de, it, nl, tr, ru, ar, zh, ja, ko, hi, sw, pl (16) |
| **Décideur produit** | Pino |
| **Dernière mise à jour** | 2026-04-18 |
| **Statut** | 🟡 Pilote migration (JS → TS + Firebase) |

---

## 1. Vision & Pitch

### 1.1 Elevator pitch

> **Chrome Messenger** est la messagerie qui **s'adapte à toi** : chiffrement bout-en-bout de Telegram, simplicité de WhatsApp, et un caméléon qui change de couleur selon ton humeur. Ajoute à cela une todolist intégrée, des jeux solo et sociaux, et la gestion d'événements avec QR code pour inviter tes proches.

### 1.2 Problème résolu

Les messageries actuelles sont fragmentées : WhatsApp pour les chats, Calendar pour les tâches, Facebook Events pour les invitations, Candy Crush pour s'occuper. **Chrome Messenger unifie** ces usages autour d'une expérience cohérente, chiffrée, personnalisable.

### 1.3 Solution

Une app tout-en-un avec :
- **Chats chiffrés E2E** (ECDH P-256 + AES-GCM 256)
- **Todolist** (vue mois + semaine)
- **Jeux** solo et social
- **Statuts** (style WhatsApp)
- **Événements** avec QR code + invitations épinglées
- **Personnalisation extrême** : 8 thèmes, mode sombre, couleur custom (Pro), stickers caméléon

### 1.4 Différenciation

| Fonctionnalité | Chrome Messenger | WhatsApp | Telegram | Signal |
|---|---|---|---|---|
| E2E encryption | ✅ | ✅ | Opt-in | ✅ |
| Todolist intégrée | ✅ | ❌ | ❌ | ❌ |
| Jeux sociaux | ✅ | ❌ | ❌ | ❌ |
| Événements + QR | ✅ | ❌ | ❌ | ❌ |
| Stickers animés custom | ✅ (caméléon) | Limité | ✅ | ❌ |
| Thème qui change couleur partout | ✅ (8 + dark + custom Pro) | ❌ | Partiel | ❌ |

---

## 2. Cibles & personas

### 2.1 Cible principale

- **Démographie** : 18-45 ans, francophone et anglophone, tous CSP
- **Zone** : Afrique francophone (Cameroun, Côte d'Ivoire, Sénégal…) + Europe + diaspora
- **Usage quotidien** : 20-50 interactions/jour
- **Contexte** : mobile-first, réseau mobile parfois limité → PWA offline-capable

### 2.2 Personas

#### Persona 1 : Chris, 28 ans, technicien à Yaoundé
- **Besoins** : rester en contact famille/amis, organiser ses RDV clients
- **Frustrations** : switch entre WhatsApp, Calendar, Maps
- **Ce qu'il attend** : une app unifiée, fiable même sur 3G

#### Persona 2 : Élodie, 34 ans, commerciale à Paris
- **Besoins** : messagerie pro sécurisée, rappels, invitations événements
- **Frustrations** : WhatsApp Business limité, fuites de données
- **Ce qu'il attend** : E2E vérifié, interface premium

#### Persona 3 : Joseph, 22 ans, étudiant à Douala
- **Besoins** : chatter avec potes, s'amuser, gérer devoirs
- **Frustrations** : pub, abonnements chers
- **Ce qu'il attend** : free tier généreux, social jeux, look qui claque

### 2.3 Non-cible

- Entreprises > 100 employés (besoin d'admin avancée — Slack domine)
- Seniors < 60 ans peu à l'aise avec le smartphone (UX trop moderne)

---

## 3. Fonctionnalités

### 3.1 MVP (v1.0) — P0 obligatoires au lancement

| # | Feature | Description | Priorité |
|---|---|---|---|
| F1 | Onboarding phone + OTP | Auth Firebase Phone | 🔴 P0 |
| F2 | Profil (nom, photo, bio) | Édition + stockage | 🔴 P0 |
| F3 | Chat direct chiffré E2E | ECDH + AES-GCM | 🔴 P0 |
| F4 | Liste conversations | Home avec filtres (Tous/Non lus/Groupes/Favoris) | 🔴 P0 |
| F5 | Statuts 24h | Style WhatsApp, cercle thème si non vu | 🔴 P0 |
| F6 | Todolist (mois + semaine) | CRUD + toggle vue | 🔴 P0 |
| F7 | Notifications | Push FCM + in-app | 🔴 P0 |
| F8 | 8 thèmes + dark mode | Caméléon change de couleur | 🔴 P0 |
| F9 | 16 langues | i18n complet + page dédiée | 🔴 P0 |
| F10 | Settings WA/TG-style | Sections complètes | 🔴 P0 |
| F11 | Chiffrement messages | ECDH P-256 + AES-GCM 256 | 🔴 P0 |
| F12 | Search discussions | Par nom + dernier message | 🔴 P0 |

### 3.2 v1.1 (post-lancement, 1-2 mois)

| # | Feature | Description | Priorité |
|---|---|---|---|
| F20 | Groupes (jusqu'à 50) | Chat de groupe | 🟠 P1 |
| F21 | Messages vocaux | Enregistrement + playback | 🟠 P1 |
| F22 | Pièces jointes (photo, video, doc) | Firebase Storage | 🟠 P1 |
| F23 | Réactions emoji | Comme Telegram | 🟠 P1 |
| F24 | Statuts photos/vidéos | Pas seulement couleurs | 🟠 P1 |
| F25 | Appels audio/video WebRTC | Via STUN/TURN | 🟠 P1 |
| F26 | Catégories contacts | Famille/Amis/Collègues/Connaissances/Utilitaires | 🟠 P1 |
| F27 | Événements + QR code | Invitations par catégorie, épinglées | 🟠 P1 |
| F28 | Scanner QR (Tasks) | Scanner les invitations reçues | 🟠 P1 |

### 3.3 v2.0 (3-6 mois)

| # | Feature | Description | Priorité |
|---|---|---|---|
| F30 | Premium Plus & Pro | Monétisation abonnement | 🟡 P2 |
| F31 | Jeux solo Premium (1) | Snake, Tetroid en accès Plus | 🟡 P2 |
| F32 | Jeux sociaux (Morpion, Pierre-Papier-Ciseaux) | Multiplayer temps réel | 🟡 P2 |
| F33 | Stickers caméléon Premium | Animés, à l'effigie | 🟡 P2 |
| F34 | Color picker Pro | Thème couleur 100% custom | 🟡 P2 |
| F35 | Notifications tâches J-1 + J | Rappels locaux | 🟡 P2 |
| F36 | Gestion événements Pro | Photo + lieu + QR + envoi catégories | 🟡 P2 |
| F37 | Sauvegarde cloud chiffrée | Backup Firebase Storage | 🟡 P2 |

### 3.4 v3+ (long terme)

- Web desktop complet (écran large)
- Intégration avec wallets crypto pour envois P2P
- Channels publics style Telegram
- Mini-apps tierces (SDK)

### 3.5 Hors scope (volontairement exclu)

- **Appels HD premium payants** → on les fait tous en qualité standard gratuits
- **Support prioritaire payant** → tout le monde a le même support
- **Intégrations entreprise lourdes** (Slack bots, Teams) → autre produit
- **Blockchain / NFT** → pas la cible

---

## 4. User flows

### 4.1 Flow : Onboarding

```
Splash (1.5s) → Welcome → Phone → OTP → Profil → Home
```

#### 4.1.1 Splash
- Logo caméléon animé + 3 orbes qui flottent
- Durée : 1.5 s (ne doit pas bloquer si app prête avant)
- Transition : fade 500ms

#### 4.1.2 Welcome
- Logo 200px + "Bienvenue sur" + "Chrome Messenger" + subtitle + CTA "Commencer"

#### 4.1.3 Phone
- Header : back + logo 110px
- Title : "Ton numero de telephone"
- Input : +237 6XX XX XX XX (format local détecté)
- CTA : "Envoyer le code"
- **Validation** : min 6 chiffres, affiche toast "Code demo: 123456" (mode dev)

#### 4.1.4 OTP
- 6 cases + auto-advance entre champs
- Resend : visible après 30s
- Erreur : message rouge sous le champ

#### 4.1.5 Profil
- Avatar placeholder + input nom + input bio (optionnel)
- CTA : "Terminer"

#### 4.1.6 Home → flow principal

### 4.2 Flow : Envoyer un message

```
Home → Conv → Chat → Type → Send → (Message envoyé + chiffré)
```

Chaque interaction détaillée avec états (loading, error, success).

### 4.3 Flow : Publier un statut

```
Home → "+" (tuile Ajouter) → Choose bg color + text → Publish → Visible 24h
```

### 4.4 Flow : Créer un événement (Pro)

```
Home → Menu → Événements → "+" → Type → Date → Lieu → Photo → Message → 
Catégories destinataires → Envoyer → QR généré + épinglé chez chaque dest
```

### 4.5 États d'erreur

| Erreur | Cause | Message | Action |
|---|---|---|---|
| Réseau KO | Offline | "Pas de connexion" | Retry auto à reconnexion |
| OTP expiré | >5min | "Code expiré, renvoyer" | Bouton renvoyer |
| OTP invalide | Code faux | "Code incorrect" | Effacer + retry |
| Firebase quota | Dépassé | "Service temporairement indisponible" | Fallback local |
| Décryption KO | Clé perdue | "Ce message ne peut être lu" | Icône cadenas barré |

---

## 5. Architecture technique

### 5.1 Stack

| Couche | Technologie | Version |
|---|---|---|
| **Frontend** | React + TypeScript | 18.2 + 5.4 |
| **Build** | Vite | 5.x |
| **Styling** | CSS-in-JS inline + CSS vars | — |
| **État** | useState/useReducer + Context | natif React |
| **Navigation** | State-based (pas de router lourd) | — |
| **Backend** | Firebase | v10 |
| ↳ Auth | Firebase Auth (Phone) | |
| ↳ DB | Firestore | |
| ↳ Storage | Firebase Storage | |
| ↳ Push | Firebase Cloud Messaging (FCM) | |
| ↳ Functions | Cloud Functions (Node 18) | |
| **Crypto** | Web Crypto API natif | ECDH P-256 + AES-GCM-256 |
| **Tests unit** | Vitest | 1.x |
| **Tests E2E** | Playwright | 1.x |
| **A11y** | axe-core | 4.x |

### 5.2 Architecture client

```
┌──────────────────────────────────────────────┐
│            PWA (service worker)              │
│  ┌────────────────────────────────────────┐  │
│  │  React App                             │  │
│  │  ├── features/                         │  │
│  │  │   ├── chat/                         │  │
│  │  │   ├── todolist/                     │  │
│  │  │   ├── stories/                      │  │
│  │  │   ├── games/                        │  │
│  │  │   ├── events/                       │  │
│  │  │   └── settings/                     │  │
│  │  ├── services/                         │  │
│  │  │   ├── firebase.ts                   │──┼──► Firebase
│  │  │   ├── crypto.ts (WebCrypto)         │  │
│  │  │   └── storage.ts (localStorage)     │  │
│  │  └── i18n/ (16 langues)                │  │
│  └────────────────────────────────────────┘  │
│            cache IndexedDB (offline)         │
└──────────────────────────────────────────────┘
```

### 5.3 Modèle de données Firestore

#### Collection `users/{uid}`

```ts
interface User {
  uid: string;              // Firebase Auth UID
  phone: string;            // E.164 format
  name: string;
  avatar?: string;          // Storage URL
  bio?: string;
  publicKey: string;        // ECDH P-256 pubkey (base64)
  createdAt: Timestamp;
  lastSeen: Timestamp;
  settings: {
    readReceipts: boolean;
    lastSeenVisible: boolean;
    profilePhotoVisible: boolean;
    notifications: boolean;
    fcmTokens: string[];    // pour le push
  };
  blockedUsers: string[];   // UIDs bloqués
  category?: ContactCategory; // pour les contacts d'autres users
}
```

#### Collection `contacts/{ownerUid}/list/{contactUid}`

```ts
interface Contact {
  contactUid: string;       // UID de l'autre user
  name: string;             // nom donné par ownerUid
  category: 'family' | 'friends' | 'acquaintances' | 'colleagues' | 'utilities' | 'other';
  addedAt: Timestamp;
  favorite: boolean;
}
```

#### Collection `conversations/{convId}`

```ts
interface Conversation {
  id: string;
  type: 'direct' | 'group';
  members: string[];        // UIDs
  createdAt: Timestamp;
  lastMessageId?: string;
  lastMessageAt: Timestamp;
  // Groupes
  name?: string;
  avatar?: string;
  admins?: string[];
  // Épinglé
  pinnedEventId?: string;
}
```

#### Sous-collection `conversations/{convId}/messages/{msgId}`

```ts
interface Message {
  id: string;
  senderId: string;
  type: 'text' | 'voice' | 'photo' | 'video' | 'doc' | 'event-invite';
  // Chiffré côté client → serveur ne voit que ciphertext
  cipher: {
    ciphertext: string;     // base64
    iv: string;             // base64
  };
  sentAt: Timestamp;
  deliveredAt?: Timestamp;
  readAt?: { [uid: string]: Timestamp };
  replyToId?: string;
  reactions?: { [uid: string]: string }; // emoji
}
```

#### Collection `stories/{storyId}`

```ts
interface Story {
  id: string;
  ownerId: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;      // +24h
  type: 'color' | 'photo' | 'video';
  bg?: string;               // si color
  text?: string;
  mediaUrl?: string;         // si photo/video
  viewedBy: string[];        // UIDs qui l'ont vu
  allowedCategories?: ContactCategory[]; // cible si pas tout le monde
}
```

#### Collection `tasks/{ownerUid}/list/{taskId}`

```ts
interface Task {
  id: string;
  ownerId: string;
  sharedWith?: string[];     // UIDs si tâche partagée via chat
  title: string;
  type: 'individual' | 'common' | 'daily';
  date: string;              // YYYY-MM-DD
  startTime?: string;        // HH:mm
  endTime?: string;
  location?: string;
  done: boolean;
  reminderEnabled: boolean;
  createdAt: Timestamp;
}
```

#### Collection `events/{eventId}` (Premium Pro)

```ts
interface Event {
  id: string;
  ownerId: string;
  type: 'birthday' | 'funeral' | 'wedding' | 'meeting' | 'party' | 'other';
  title: string;
  message: string;
  photoUrl?: string;
  date: Timestamp;
  location?: {
    label: string;
    lat?: number;
    lng?: number;
  };
  recipients: {
    categories?: ContactCategory[]; // ou
    uids?: string[];               // soit liste explicite
  };
  qrSeed: string;                // pour générer QR code
  createdAt: Timestamp;
}
```

#### Collection `notifs/{ownerUid}/list/{notifId}`

```ts
interface Notification {
  id: string;
  ownerId: string;
  type: 'message' | 'call-missed' | 'task-reminder' | 'event-reminder' | 'event-invitation' | 'birthday';
  title: string;
  body: string;
  data?: Record<string, string>;
  createdAt: Timestamp;
  read: boolean;
}
```

### 5.4 Règles de sécurité Firestore

Voir `firestore.rules`. Résumé :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper : l'user est authentifié
    function isAuth() { return request.auth != null; }
    function isSelf(uid) { return request.auth.uid == uid; }
    function isMember(conv) { return request.auth.uid in conv.members; }

    // Users : chacun son profil, tous peuvent lire
    match /users/{uid} {
      allow read: if isAuth();
      allow create, update: if isSelf(uid);
      allow delete: if false; // jamais par le client
    }

    // Contacts : privés à chaque user
    match /contacts/{ownerUid}/list/{contactUid} {
      allow read, write: if isSelf(ownerUid);
    }

    // Conversations : membres seulement
    match /conversations/{convId} {
      allow read: if isAuth() && isMember(resource.data);
      allow create: if isAuth() && request.auth.uid in request.resource.data.members;
      allow update: if isAuth() && isMember(resource.data);
      allow delete: if false;

      match /messages/{msgId} {
        allow read: if isAuth() && isMember(get(/databases/$(database)/documents/conversations/$(convId)).data);
        allow create: if isAuth()
          && request.resource.data.senderId == request.auth.uid
          && isMember(get(/databases/$(database)/documents/conversations/$(convId)).data);
        allow update: if isAuth()
          && resource.data.senderId == request.auth.uid;
        allow delete: if false;
      }
    }

    // Stories : l'owner écrit, les autres lisent selon allowedCategories
    match /stories/{storyId} {
      allow read: if isAuth();
      allow create: if isAuth() && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if isAuth() && resource.data.ownerId == request.auth.uid;
    }

    // Tasks : privées
    match /tasks/{ownerUid}/list/{taskId} {
      allow read, write: if isSelf(ownerUid);
    }

    // Events : l'owner écrit, les destinataires lisent
    match /events/{eventId} {
      allow read: if isAuth() && (
        resource.data.ownerId == request.auth.uid
        || request.auth.uid in resource.data.recipients.uids
      );
      allow create: if isAuth() && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if isAuth() && resource.data.ownerId == request.auth.uid;
    }

    // Notifs : privées
    match /notifs/{ownerUid}/list/{notifId} {
      allow read, write: if isSelf(ownerUid);
    }
  }
}
```

### 5.5 Cloud Functions

| Function | Trigger | Action |
|---|---|---|
| `onMessageCreated` | Firestore onCreate | Envoyer push FCM + mettre à jour `lastMessageAt` |
| `cleanupExpiredStories` | Scheduled (1/h) | Supprimer stories >24h |
| `sendEventReminder` | Scheduled (daily) | Rappels J-1 + jour J événements |
| `onUserDelete` | Auth onDelete | Anonymiser les données restantes (RGPD) |

---

## 6. Design & UX

### 6.1 Maquettes

Fichiers de référence : `C:/Users/Pino/Desktop/CAMEO/FINAL/Chrome, messenger pro – 76 à 88.png`

### 6.2 Design tokens

```css
:root {
  /* Base palette (thème Menthe par défaut) */
  --primary: #30D79C;
  --primary-dark: #1FAE7C;
  --primary-soft: #D5F8EB;

  /* Couleurs fixes */
  --bg: #FFFFFF;
  --surface: #F8FAFC;
  --surface-2: #EEF2F6;
  --line: #E3E8EE;
  --title: #0F1620;
  --body: #2A2F38;
  --sub: #5B6472;
  --muted: #8B96A6;

  /* Danger/info */
  --danger: #FF4757;
  --warning: #FFB740;
  --info: #4F80FF;

  /* Radius & shadows */
  --r-sm: 8px;
  --r-md: 14px;
  --r-lg: 22px;
  --r-xl: 28px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.10);

  /* Typography */
  --font: 'Manrope', system-ui, sans-serif;
}
```

**8 thèmes** : Menthe (#30D79C), Azur (#4F80FF), Ambre (#FF8A4C), Corail (#FF4F7A), Violet (#A855F7), Lilas (#C895E8), Tournesol (#FFC940), Charbon (#2B2D33).

### 6.3 Composants UI clés

| Composant | Rôle |
|---|---|
| `<ChameleonLogo>` | Logo qui change de couleur avec le thème |
| `<CmHeader>` | Header standard avec slots left/center/right |
| `<CmIconBtn>` | Bouton icône 42x42 avec ripple |
| `<CmBtn>` | Bouton CTA (variants: primary, ghost, danger) |
| `<CmAvatar>` | Avatar rond avec initiales ou photo |
| `<CmBottomNav>` | Navigation bas 4 tabs (Chat/Tasks/Games/Notifs) |
| `<CmInput>` | Champ input stylé |
| `<CmToggle>` | Switch on/off |
| `<CmSheet>` | Bottom sheet modal |
| `<CmToast>` | Notification transitoire |

---

## 7. Sécurité & Confidentialité

### 7.1 Authentification

- **Firebase Auth Phone OTP** (6 chiffres)
- Session : ID token auto-refreshé (1h), refresh token (long-lived)
- Logout : invalide tokens + clear localStorage + unregister FCM

### 7.2 Chiffrement E2E

**À l'inscription** :
1. Générer paire ECDH P-256 localement
2. Uploader la **public key** sur Firestore (dans profil user)
3. Stocker la **private key** dans localStorage (chiffrée par password PIN si appLock activé)

**À chaque conversation** :
1. Récupérer la public key du destinataire
2. Dériver le shared secret ECDH
3. Dériver une clé AES-GCM via HKDF avec contexte = convId
4. Mettre en cache la clé dérivée (LRU)

**Par message** :
1. Générer IV 12 bytes aléatoire
2. `ciphertext = AES-GCM-256(key, iv, plaintext)`
3. Écrire dans Firestore : `{ cipher: { ciphertext, iv } }`
4. Le serveur ne voit **jamais** le plaintext

### 7.3 Permissions

| Permission | Usage | Quand ? |
|---|---|---|
| Caméra | Photo profil / statut / événement | Au clic upload |
| Micro | Messages vocaux (v1.1) | Au clic mic |
| Contacts | Import numéros pour trouver users | Opt-in après onboarding |
| Localisation | Événements avec lieu | Au choix du lieu |
| Notifications | Push FCM | Après 1er message reçu |

### 7.4 RGPD

- **Export des données** : bouton Settings → zip JSON + médias
- **Suppression compte** : bouton Settings → confirmation → Cloud Function `onUserDelete`
- **Conservation** : messages conservés tant que les 2 users existent, puis effacés au delete
- **Politique privacy** : visible dans Settings + avant signup

---

## 8. Tests

### 8.1 Couverture cible

- Unitaires **≥ 70%** globale
- Fonctions sécurité (crypto, auth, règles Firestore) : **100%**
- E2E : tous les flows P0

### 8.2 Flows E2E obligatoires

1. **Onboarding** : welcome → phone → OTP → profil → home
2. **Envoyer message chiffré** : home → conv → typer → envoyer → vérifier ciphertext en DB
3. **Publier statut** : + → couleur + texte → publish → visible 24h
4. **Créer événement** : home → menu → événements → remplir → QR généré
5. **Changer thème** : tap logo → choisir couleur → vérifier partout
6. **Changer langue** : settings → langue → choisir → vérifier traductions
7. **Logout / login** : settings → déco → login → retrouver ses données
8. **Offline** : couper réseau → envoyer message → reconnecter → auto-sync

### 8.3 Tests manuels (devices réels)

- **iPhone 13** (iOS 16+)
- **Samsung A52** (Android 12)
- **Chrome desktop** (macOS/Windows)
- **Firefox desktop**
- **Safari desktop**

### 8.4 Audits automatisés

| Audit | Outil | Cible |
|---|---|---|
| Performance | Lighthouse mobile | ≥ 90 |
| Accessibilité | Lighthouse + axe-core | ≥ 95, 0 critical |
| PWA | Lighthouse | 100 |
| Best Practices | Lighthouse | ≥ 95 |
| Bundle size | webpack-bundle-analyzer | ≤ 200KB gzip |

---

## 9. Déploiement

### 9.1 Environnements

| Env | URL | Firebase Project |
|---|---|---|
| dev | localhost:3007 | `chrome-messenger-dev` |
| staging | chrome-messenger-staging.web.app | `chrome-messenger-staging` |
| prod | chrome-messenger.app ou `land-lang-120.github.io/chrome-messenger/` | `chrome-messenger-prod` |

### 9.2 Pipeline

1. **Push `feature/*`** → GitHub Actions : lint + tests unit
2. **PR vers `dev`** → GitHub Actions : lint + tests unit + build + E2E Playwright
3. **Merge `dev`** → Deploy automatique staging
4. **Tag `v1.x.y` sur `main`** → Deploy prod + GitHub Release

### 9.3 Stores

- **Play Store** : Bubblewrap TWA → AAB signé → upload via Play Console
- **App Store** : PWABuilder → IPA → upload via App Store Connect
- Assets requis : icône 1024×1024, screenshots phone/tablet (5 min chacun), description FR+EN, politique privacy

---

## 10. Métriques & Roadmap

### 10.1 KPI (Firebase Analytics + Crashlytics)

| Métrique | Cible 1er mois | Cible 6 mois |
|---|---|---|
| Téléchargements | 1000 | 50 000 |
| DAU | 100 | 5000 |
| Rétention J7 | 40% | 45% |
| Rétention J30 | 20% | 25% |
| Crash-free users | ≥ 99% | ≥ 99.5% |
| Temps chargement | < 2s | < 1.5s |
| Messages envoyés / DAU | 10 | 30 |

### 10.2 Roadmap

| Version | Date cible | Focus |
|---|---|---|
| **0.9 beta** | 2026-05-15 | MVP bouclé, tests internes |
| **1.0** | 2026-06-01 | Lancement public PWA + Play Store |
| **1.1** | 2026-07 | Groupes + voix + événements + catégories |
| **1.2** | 2026-09 | Premium Plus & Pro, paiements |
| **1.3** | 2026-11 | Jeux sociaux multijoueur |
| **2.0** | 2027 | Web desktop + SDK mini-apps |

---

## 11. Risques & mitigations

| Risque | Impact | Prob. | Mitigation |
|---|---|---|---|
| Firebase bloqué dans un pays (Chine, Russie…) | Moyen | Moyenne | Fallback self-hosted via Appwrite ou Supabase |
| Quota Firebase Free dépassé | Moyen | Faible (lancement) / Haute (succès) | Passer Blaze, monitorer, optimiser reads |
| Attaque MITM sur échange clé publique | Haut | Très faible | QR code de vérification de clé (Signal-style) |
| Perte de clé privée = perte historique | Haut | Faible | Sauvegarde chiffrée optionnelle (Pro) |
| Google Play suspend le compte (false positive) | Haut | Faible | PWA hors stores toujours dispo comme fallback |

---

## 12. Budget

### 12.1 Coûts mensuels (estimation lancement)

| Poste | Coût |
|---|---|
| Firebase Spark (free tier) | 0€ |
| Nom de domaine `.app` | ~15€/an → ~1.25€/mois |
| Play Console (frais unique) | 25€ |
| App Store Developer | 99€/an → 8.25€/mois |
| Icon design freelance | 0€ (fait en interne) |
| **Total / mois** | **~10€** |

### 12.2 Coûts à 50k DAU (scale moyen)

| Poste | Coût |
|---|---|
| Firebase Blaze (estimatif) | ~150€/mois |
| Stores | 8.25€/mois |
| **Total / mois** | **~160€** |

### 12.3 Monétisation

**Modèle Freemium** :

| Plan | Prix | Inclus |
|---|---|---|
| **Free** | 0€ | Chats E2E illimités, statuts illimités, sauvegarde cloud, 3 thèmes, quelques jeux solo |
| **Plus** | 2.99€/mois | 8 thèmes + dark, 1 jeu solo premium, 1 jeu social, notif tâches |
| **Pro** | 6.99€/mois | Tout Plus + color picker + stickers caméléon + notif tâches + événements avec QR |
| **Yearly** | 59.99€/an | Tout Pro, 2 mois offerts, badge |

Paiements via Stripe (Web) ou Google Play Billing / Apple IAP (stores).

---

## 13. Validation

| Rôle | Nom | Date | Statut |
|---|---|---|---|
| Décideur produit | Pino | 2026-04-18 | ✅ Validé (principe) |
| Lead Dev | Claude | 2026-04-18 | ✅ Rédigé |

---

## Annexes

- **A** : Maquettes détaillées → `docs/designs/` (à créer)
- **B** : `firestore.rules` complet → à rédiger en Phase 3
- **C** : Schéma complet de la DB → voir §5.3
- **D** : Pas d'API custom (Firebase SDK uniquement)
- **E** : Glossaire : E2E (End-to-End Encryption), ECDH (Elliptic Curve Diffie-Hellman), AES-GCM (Advanced Encryption Standard — Galois/Counter Mode), FCM (Firebase Cloud Messaging), PWA (Progressive Web App), TWA (Trusted Web Activity), DAU (Daily Active Users), RGPD/GDPR.
