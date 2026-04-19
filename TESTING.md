# TESTING — Chrome Messenger

> Plan de tests complet : unit, E2E, accessibilité, performance.
> Cible : **zéro bug majeur** au lancement.

---

## 1. Stack de test

| Couche | Outil | Config |
|---|---|---|
| Unitaires | **Vitest** | `vitest.config.ts` |
| Composants React | **@testing-library/react** + jsdom | |
| Mocks Firebase | **firebase-mock** ou `@firebase/rules-unit-testing` | |
| E2E | **Playwright** | `playwright.config.ts` |
| Accessibilité | **@axe-core/playwright** | |
| Performance | **Lighthouse CI** | |
| Bundle | **rollup-plugin-visualizer** | |

---

## 2. Couverture cible

| Domaine | Cible | Critique ? |
|---|---|---|
| Global | ≥ 70 % | ✅ |
| `services/crypto.ts` | **100 %** | 🔴 Critique |
| `services/firebase/auth.ts` | **100 %** | 🔴 Critique |
| `services/firebase/firestore.ts` | ≥ 90 % | 🟠 |
| Hooks custom | ≥ 80 % | 🟠 |
| Composants UI simples | ≥ 50 % | 🟡 |
| Features | ≥ 75 % | 🟠 |

---

## 3. Plan de tests unitaires

### 3.1 Crypto (`services/crypto.test.ts`)

- [ ] `generateUserKeypair()` retourne une paire valide
- [ ] `deriveConvKey()` produit la même clé pour les 2 parties (symétrie ECDH)
- [ ] `encryptMessage()` retourne ciphertext + IV différents à chaque appel (IV aléatoire)
- [ ] `decryptMessage()` récupère le plaintext exact
- [ ] `decryptMessage()` échoue si IV altéré
- [ ] `decryptMessage()` échoue si ciphertext altéré (AES-GCM authenticated)
- [ ] Cache LRU expulse la clé la plus ancienne après 50
- [ ] Import/export de clé JWK fonctionne

### 3.2 Firebase Auth (`services/firebase/auth.test.ts`)

- [ ] `sendOtp(phone)` appelle `signInWithPhoneNumber`
- [ ] `verifyOtp(code)` retourne user si code valide
- [ ] `verifyOtp(wrongCode)` throw `AuthError`
- [ ] `logout()` clear tokens + localStorage + unregister FCM
- [ ] Refresh token auto après expiration

### 3.3 Storage (`services/storage.test.ts`)

- [ ] `cmGet(key, default)` retourne default si absent
- [ ] `cmSet(key, value)` persiste dans localStorage
- [ ] Serialize/deserialize objects complexes
- [ ] Gestion quota full (graceful fail)

### 3.4 Hooks (`hooks/*.test.ts`)

- [ ] `useAuth` : login/logout/current user
- [ ] `useTheme` : switch thème + persistance
- [ ] `useI18n` : `t()` retourne traduction + fallback fr
- [ ] `useMessages(convId)` : subscribe onSnapshot + cleanup on unmount

### 3.5 Utils (`utils/*.test.ts`)

- [ ] `formatDate()` : "Aujourd'", "Hier", jour semaine, date complète
- [ ] `validators.phone()` : accepte +237, rejette <6
- [ ] `validators.code()` : exactement 6 chiffres

### 3.6 Composants clés

- [ ] `<Button>` : onClick, disabled, loading
- [ ] `<Input>` : onChange, placeholder, error state
- [ ] `<Avatar>` : fallback initiales si pas d'URL
- [ ] `<ChameleonLogo>` : change de couleur selon theme prop

### 3.7 Features

- [ ] `useOnboarding` : state machine welcome → phone → otp → profile → home
- [ ] `useChat` : send/receive/edit/delete
- [ ] `useStories` : publier statut, expiration auto 24h
- [ ] `useTasks` : CRUD + filtre par date
- [ ] `useEvents` : créer + envoyer à catégories

---

## 4. Plan de tests E2E (Playwright)

### 4.1 Setup

```ts
// playwright.config.ts
export default defineConfig({
  use: { baseURL: 'http://localhost:3007' },
  webServer: { command: 'npm run preview', port: 3007 },
  projects: [
    { name: 'chromium', use: devices['iPhone 13'] },
    { name: 'webkit', use: devices['iPhone 13'] },
    { name: 'desktop-chrome', use: devices['Desktop Chrome'] },
  ],
});
```

### 4.2 Scénarios

#### E2E-1 : Onboarding complet
```
1. Ouvrir app → voir splash → welcome
2. Cliquer "Commencer"
3. Entrer numéro "+237 655 123 456"
4. Cliquer "Envoyer le code"
5. Récupérer code dans toast (mode test)
6. Entrer code → cliquer "Vérifier"
7. Entrer nom "Pino" → cliquer "Terminer"
8. Vérifier : redirige sur Home, affiche nom dans profil
```

#### E2E-2 : Envoyer message chiffré
```
1. Être loggé (état pré-seed)
2. Cliquer sur conversation "Joseph Lando"
3. Taper "Salut" dans l'input
4. Cliquer envoyer
5. Vérifier :
   - Message visible avec bulle mint
   - DB Firestore contient `{ cipher: { ciphertext, iv } }` (pas de plaintext)
   - Timestamp correct
```

#### E2E-3 : Publier statut
```
1. Cliquer tuile "Ajouter" dans Statuts
2. Choisir couleur de fond
3. Taper "Belle journée"
4. Cliquer "Publier"
5. Vérifier : tuile apparaît avec cercle thème mint
6. Attendre 24h (time mock) → vérifier disparition
```

#### E2E-4 : Créer événement avec QR
```
1. Menu → Événements → "+"
2. Type : Anniversaire
3. Date : demain 18h
4. Lieu : "Douala"
5. Photo : upload
6. Message : "Venez nombreux !"
7. Destinataires : cocher "Famille" + "Amis"
8. Valider
9. Vérifier :
   - QR code généré (SVG)
   - Invitation épinglée dans conversation des destinataires
   - Notification rappel J-1 planifiée
```

#### E2E-5 : Changer thème
```
1. Home → tap chameleon logo
2. Sélectionner "Corail"
3. Vérifier partout :
   - Logo devient rose
   - Pill "Tous" (filtre) devient rose doux
   - FAB chat rose
   - Badge notifs rose
4. Activer "Mode sombre"
5. Vérifier : fond sombre, textes clairs
```

#### E2E-6 : Changer langue
```
1. Settings → Langue
2. Voir liste 16 langues en natif
3. Sélectionner "中文"
4. Vérifier : UI entièrement traduite (titres, boutons, nav)
5. Retour FR → vérifier reversion
```

#### E2E-7 : Offline + sync
```
1. Être loggé, envoyer message → OK online
2. Couper réseau (context.setOffline(true))
3. Taper nouveau message → envoyer
4. Vérifier : UI montre "En attente"
5. Reconnecter
6. Vérifier : message envoyé, UI met à jour
```

#### E2E-8 : Logout + login
```
1. Settings → Déconnexion
2. Confirmer
3. Vérifier : redirige onboarding
4. Refaire login avec même numéro
5. Vérifier : retrouve profil + conversations (sync cloud)
```

#### E2E-9 : Permissions refusées
```
1. Refuser permission caméra
2. Essayer upload photo profil
3. Vérifier : message clair "Autorise la caméra dans les paramètres"
```

#### E2E-10 : Suppression compte (RGPD)
```
1. Settings → Compte → Supprimer
2. Confirmation + password
3. Vérifier :
   - Firebase Auth user deleted
   - Firestore user doc supprimé (Cloud Function)
   - localStorage cleared
   - Redirige onboarding
```

---

## 5. Tests d'accessibilité

### 5.1 Pages à auditer avec axe-core

- [ ] Welcome
- [ ] Phone / OTP / Profile
- [ ] Home
- [ ] Chat (direct + groupe)
- [ ] Todolist (month + week)
- [ ] Games
- [ ] Notifs
- [ ] Settings
- [ ] Language picker
- [ ] Premium
- [ ] Events

### 5.2 Règles WCAG 2.1 AA

- **Contraste** : ≥ 4.5:1 texte normal, ≥ 3:1 gros texte
- **Tap target** : ≥ 44×44 px
- **Focus visible** : outline 2px minimum
- **Labels** : tous les inputs + boutons-icônes
- **Heading order** : h1 → h2 → h3 sans saut
- **Alt text** : sur toutes les images

### 5.3 Test manuel clavier

Chaque écran doit être navigable **au clavier seul** :
- `Tab` / `Shift+Tab` : ordre logique
- `Enter` : active le bouton focus
- `Escape` : ferme modales/sheets
- Pas de piège à focus (focus trap dans modales)

### 5.4 Test manuel lecteur d'écran

- **VoiceOver** (iOS) : tous les éléments annoncés
- **TalkBack** (Android) : tous les éléments annoncés
- **NVDA** (Windows) : navigation complète

---

## 6. Tests de performance

### 6.1 Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
- uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      http://localhost:3007
      http://localhost:3007/#/chat
      http://localhost:3007/#/tasks
    configPath: ./lighthouserc.json
```

### 6.2 Seuils (`lighthouserc.json`)

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["warn", { "minScore": 0.9 }],
        "categories:pwa": ["error", { "minScore": 1.0 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "interactive": ["error", { "maxNumericValue": 3000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

### 6.3 Bundle size

```bash
npm run build && npm run analyze
```

Limites :
- Bundle initial : ≤ 200 KB gzip
- Total : ≤ 500 KB gzip

Si dépassé → revue des imports + lazy loading supplémentaire.

---

## 7. Tests sur devices physiques

### 7.1 Matrice

| Device | OS | Navigateur | Priorité |
|---|---|---|---|
| iPhone 13 | iOS 16 | Safari | 🔴 P0 |
| Samsung A52 | Android 12 | Chrome | 🔴 P0 |
| iPhone SE 2020 | iOS 16 | Safari | 🟠 P1 (petit écran) |
| Pixel 6 | Android 13 | Chrome | 🟠 P1 |
| iPad | iPadOS | Safari | 🟡 P2 |
| MacBook | macOS | Chrome/Safari | 🟡 P2 |
| Windows | Win 11 | Chrome/Firefox | 🟡 P2 |

### 7.2 Checklist par device

- [ ] Install PWA
- [ ] Onboarding OK (caméra photo profil)
- [ ] Notifications push reçues
- [ ] Scroll fluide 60fps
- [ ] Clavier virtuel ne casse pas la layout
- [ ] Safe area (notch iPhone) respectée
- [ ] Gestes back (swipe) OK
- [ ] Mode sombre respecté
- [ ] Pas de freeze lors d'actions lourdes (upload photo)
- [ ] Batterie : pas de drain anormal

---

## 8. CI/CD

### 8.1 GitHub Actions (exemple)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:ci
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: treosh/lighthouse-ci-action@v10
```

### 8.2 Pre-commit hook (Husky + lint-staged)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write", "vitest related --run"]
  }
}
```

---

## 9. Gestion des bugs découverts

### 9.1 Workflow

1. Bug découvert → issue GitHub avec template
2. Labels : `bug`, `P0|P1|P2`, `module:<nom>`
3. Reproduire → ajouter un test qui échoue (TDD reverse)
4. Fixer
5. Test passe → PR
6. Review → merge
7. Issue closed

### 9.2 Severity

| Sev | Description | Release |
|---|---|---|
| **S1** | Crash, perte de données, faille sécurité | Hotfix immédiat |
| **S2** | Feature majeure KO, mais workaround existe | Patch sous 7j |
| **S3** | Bug mineur, UX affectée | Prochaine minor |
| **S4** | Cosmétique | Backlog |

---

## 10. Checklist pré-release

À valider **tous** avant tout déploiement prod :

- [ ] `npm run test:ci` passe (coverage ≥ 70%)
- [ ] `npm run test:e2e` passe (tous les 10 scénarios)
- [ ] `npm run test:a11y` : 0 critical
- [ ] Lighthouse ≥ cibles
- [ ] Bundle size ≤ budget
- [ ] Tests manuels sur 3 devices physiques
- [ ] `CHANGELOG.md` mis à jour
- [ ] Version bumpée dans `package.json`
- [ ] Tag git `v1.x.y`
- [ ] Règles Firestore déployées
- [ ] Env vars prod OK
- [ ] Monitoring Crashlytics actif
- [ ] Screenshot stores mis à jour si UI changée
- [ ] Revue par Pino (décideur produit)

---

## 11. Test data & mocks

### 11.1 Emulateur Firebase

En dev et CI :

```bash
firebase emulators:start --only auth,firestore,storage,functions
```

### 11.2 Seeds

`src/tests/seed.ts` : génère users, conversations, messages pour scénarios répétables.

### 11.3 Time mock

Pour tester l'expiration des statuts 24h :

```ts
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-04-18T10:00:00Z'));
// créer story
vi.advanceTimersByTime(24 * 3600 * 1000 + 1);
// vérifier expiration
```

---

## 12. Rapports & suivi

- `coverage/index.html` après `npm run test:ci`
- `playwright-report/index.html` après E2E
- Badge CI dans README (vert si passe)
- Dashboard Firebase Crashlytics (prod)
- Dashboard Firebase Analytics (prod)

---

_Tests = filet de sécurité. Plus c'est couvert, plus on dort tranquille après mise en prod._
