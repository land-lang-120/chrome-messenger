# SECURITY — Chrome Messenger

> Document vivant listant **toutes les mesures de sécurité** appliquées.
> Tout ajout/modification de feature doit passer cette checklist.

---

## 1. Modèle de menace

### 1.1 Attaquants considérés

| Acteur | Capacité | Vecteur |
|---|---|---|
| **Utilisateur curieux** | Faible | Accès physique à un appareil déverrouillé |
| **Opérateur réseau** | Moyen | Interception TLS (man-in-the-middle réseau) |
| **Employé Firebase** | Moyen | Accès à Firestore côté serveur |
| **Attaquant distant** | Élevé | Vuln XSS, injection, faille Firestore rules |
| **État / justice** | Variable | Requête légale à Google |

### 1.2 Données sensibles

| Donnée | Sensibilité | Protection |
|---|---|---|
| **Contenu des messages** | 🔴 Critique | E2E ECDH+AES-GCM, jamais déchiffré côté serveur |
| **Clés privées** | 🔴 Critique | Client uniquement, chiffrées par PIN optionnel |
| **Métadonnées conv** (membres, timestamps) | 🟠 Moyenne | Firestore rules par membres |
| **Numéro de téléphone** | 🟠 Moyenne | Auth Firebase, visible aux contacts ajoutés |
| **Photos profil** | 🟡 Basse | Firebase Storage, règles publiques si visibleProfil=true |

---

## 2. Chiffrement bout-en-bout (E2E)

### 2.1 Primitives cryptographiques

- **Échange de clé** : ECDH sur courbe P-256 (NIST)
- **Chiffrement** : AES-GCM 256 bits (authenticated, IV 96 bits aléatoire)
- **Dérivation** : clé ECDH brute utilisée directement pour AES (simplification v1; HKDF prévu v2)
- **RNG** : `crypto.getRandomValues()` (Web Crypto API natif)

### 2.2 Flux

**Inscription** :
1. `crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' })`
2. Export public key → JWK → upload dans Firestore `users/{uid}.publicKey`
3. Stocker private key en localStorage (chiffrée par PIN si appLock activé)

**Conversation** :
1. Fetch public key destinataire
2. `crypto.subtle.deriveKey(ECDH)` → clé AES-GCM
3. Cache LRU en RAM (max 50)

**Par message** :
1. IV = `crypto.getRandomValues(Uint8Array(12))` (nouveau par message !)
2. `crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)`
3. Stocker `{ ciphertext: b64, iv: b64 }` dans Firestore
4. **Jamais** de plaintext envoyé au serveur

### 2.3 Vérifications à faire en prod

- [ ] Test unitaire : IV différent à chaque appel
- [ ] Test unitaire : altérer ciphertext → décryption échoue (AEAD tag invalide)
- [ ] Test E2E : inspecter Firestore → aucun plaintext visible
- [ ] Test manuel : verifier que `publicKey` seule est upload, pas `privateKey`

### 2.4 Améliorations v2

- **Double Ratchet (Signal Protocol)** pour forward secrecy
- **Vérification de clé** : QR code "safety number" entre contacts
- **Key rotation** : rotation des clés tous les 30j
- **Historique chiffré par clé archivée** pour continuité post-rotation

---

## 3. Authentification

### 3.1 Firebase Auth Phone OTP

- 6 chiffres aléatoires, validité 5 min
- Rate limiting natif Firebase : max 5 tentatives / heure / numéro
- Numéro au format E.164 validé client + Firebase

### 3.2 Session

- ID token JWT refresh auto (1h validité)
- Refresh token long-lived
- **Logout** : révocation côté serveur + clear localStorage + unregister FCM

### 3.3 App lock (optionnel mais recommandé)

- PIN 4-6 chiffres
- Hash PBKDF2 (100k iter, salt aléatoire) stocké en localStorage
- Déverrouillage à chaque ouverture app
- Biométrie (WebAuthn) en v1.1

---

## 4. Firestore Security Rules

### 4.1 Principes

- `allow read, write: if false` par défaut (deny-all)
- `isAuth()` sur tous les reads non publics
- `isSelf(uid)` sur writes de profil
- `isMember(conv)` sur writes de messages
- Jamais de `if true` ou `if request.resource.data != null`

### 4.2 Règles critiques

Voir [`firestore.rules`](./firestore.rules) (à créer en Phase 3).

Exemples de pièges à éviter :
- ❌ `allow update: if resource.data.senderId == request.auth.uid` — permet d'éditer tous les champs !
- ✅ `allow update: if resource.data.senderId == request.auth.uid && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['readAt'])` — limite aux champs autorisés

### 4.3 Tests des règles

```bash
firebase emulators:exec --only firestore "npm run test:rules"
```

Tests : `firestore.rules.test.ts` (coverage 100%).

---

## 5. Protection XSS / Injection

### 5.1 React

- ✅ React échappe le HTML par défaut dans `{expression}`
- ❌ **Interdit** `dangerouslySetInnerHTML` (règle ESLint)
- ✅ URL sanitization : rejeter `javascript:`, `data:` pour les `<a href>`

### 5.2 CSP

Dans `index.html` :

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self' https://www.gstatic.com;
           style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
           font-src 'self' https://fonts.gstatic.com;
           img-src 'self' data: https://firebasestorage.googleapis.com;
           connect-src 'self' https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com;
           frame-ancestors 'none';
           form-action 'none';
           base-uri 'self';
           object-src 'none';"
/>
```

### 5.3 Validation des inputs

- Schémas Zod côté client (format phone, longueur max, chars autorisés)
- Re-validation dans Firestore rules (double garde)
- Limites :
  - Nom : ≤ 40 chars
  - Bio : ≤ 200 chars
  - Message : ≤ 4000 chars
  - Fichier : ≤ 10 MB

---

## 6. Stockage des secrets

### 6.1 Client

| Secret | Emplacement | Chiffré ? |
|---|---|---|
| Private key ECDH | localStorage | Par PIN si appLock |
| Firebase config | env vars (public) | Non (publique) |
| Token FCM | Firestore | Non |
| Cache messages déchiffrés | RAM uniquement | N/A (éphémère) |

### 6.2 Serveur (Firebase)

- Firestore : **jamais** de plaintext, **jamais** de clé privée
- Storage : médias uploadés par user (chiffrage futur v1.2)
- Cloud Functions : env via `firebase functions:config:set` (chiffré au repos)

### 6.3 Git

- `.env.local` dans `.gitignore` (✅ vérifié)
- `.env.example` committé (pas de vraies valeurs)
- Pas de clé API dans le code source

---

## 7. Réseau

- **HTTPS obligatoire** (TLS 1.2+)
- Service Worker cache `NetworkOnly` pour Firestore
- Pas de WebSocket vers domaine tiers
- Firebase SDK utilise `wss://`

---

## 8. Permissions

Demandées uniquement quand nécessaires (principe du moindre privilège) :

| Permission | Demandée quand | Fallback si refusée |
|---|---|---|
| Notifications | Après 1er message reçu | App fonctionne, pas de push |
| Caméra | Au clic "upload photo" | Upload depuis galerie |
| Microphone | Au clic mic (voice msg) | Feature désactivée |
| Contacts | Opt-in dans Settings | Recherche par numéro manuelle |
| Localisation | Au choix du lieu événement | Saisie texte manuelle |

---

## 9. Déconnexion / RGPD

### 9.1 Export des données

Bouton Settings → Export :
- JSON zippé contenant : profil, contacts, conversations (déchiffrées côté client), tâches, événements
- Export streamé pour gros volumes

### 9.2 Suppression du compte

Bouton Settings → Supprimer :
- Confirmation PIN / OTP
- Cloud Function `onUserDelete` :
  - Supprime `users/{uid}`
  - Supprime `contacts/{uid}`
  - Supprime `tasks/{uid}`
  - Supprime `notifs/{uid}`
  - Marque les messages de l'user comme "deleted user" dans les conversations communes
  - Révoque tous les tokens FCM
- Firebase Auth user delete

### 9.3 Oubli involontaire

- Suppression auto des stories après 24h (Cloud Function scheduled)
- Suppression auto de la corbeille Firestore après 30j (Cloud Function scheduled)

---

## 10. Audit & monitoring

### 10.1 Automatique

- **Firebase Crashlytics** : crashes client
- **Firebase Analytics** : events (sans données perso)
- **Firebase App Check** : anti-abuse (v1.1)
- **Dependency audit** : `npm audit` + Dependabot hebdo

### 10.2 Manuel (pré-release)

Checklist à passer avant tout déploiement :

- [ ] `npm audit` : 0 vuln High/Critical
- [ ] ESLint security plugin : 0 warning
- [ ] Firestore rules : 100% couverture tests
- [ ] CSP vérifié dans Network tab
- [ ] Pas de `console.log` leaking data
- [ ] Pas de secret en clair dans le code
- [ ] TLS uniquement (Lighthouse)
- [ ] Headers de sécurité : `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`

---

## 11. Incident response

### 11.1 En cas de fuite suspectée

1. Désactiver temporairement Firestore rules (`if false` global)
2. Notifier utilisateurs via bannière dans l'app
3. Audit logs Firebase
4. Rotation des clés API
5. Post-mortem public sur le site

### 11.2 Bug bounty

Email dédié : security@chrome-messenger.app (à créer)  
Reward : à définir (ex: 100-1000€ selon severity).

---

## 12. Historique des audits

| Date | Auditeur | Type | Résultat |
|---|---|---|---|
| 2026-04-18 | Claude (self) | Revue initiale | Cf cahier de charges, migration TS en cours |
| — | — | Audit externe | À planifier avant 1.0 public |

---

_Document vivant — à mettre à jour à chaque ajout de feature touchant données sensibles, auth, ou crypto._
