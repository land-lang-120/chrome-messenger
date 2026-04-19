# Changelog — Chrome Messenger

Toutes les modifications notables de ce projet sont documentées ici.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).
Versioning [SemVer](https://semver.org/lang/fr/).

## [Unreleased] - Migration TypeScript + Firebase

### À venir
- Migration complète du code JS → TypeScript
- Intégration Firebase (Auth Phone, Firestore, Storage, FCM, Functions)
- Tests unitaires Vitest (≥ 70% couverture)
- Tests E2E Playwright (10 scénarios)
- Audits Lighthouse ≥ 90

## [1.0.0-pilot] - 2026-04-18

### Ajouté
- Structure UNIVERSAL-TECH avec docs complètes
- Cahier des charges, architecture, testing docs
- Logo caméléon SVG vectoriel (fidèle au design original)
- 8 thèmes + mode sombre + switch dynamique via tap logo
- 16 langues avec page dédiée (chaque langue dans son script natif)
- Onboarding : splash → welcome → phone → OTP → profil → home
- Home : Statuts (avec cercle WA-style) + Discussions + filtres
- Chat chiffré E2E (ECDH P-256 + AES-GCM 256) en mock localStorage
- Chat header : icône Tasks + bouton appel unifié (popover audio/video)
- Todolist : vue Mois (design 78) + vue Semaine (design 79) avec toggle
- Games : section Solo + Sociaux avec Game Pass banner
- Notifs : filtres Tous/Appels/Tâches/Événements
- Premium : 4 plans (Free, Plus, Pro, Yearly) avec features adaptées
  - Free : statuts illimités, sauvegarde cloud, jeux solo basiques
  - Plus : 8 thèmes, 1 solo premium + 1 social, notif tâches
  - Pro : + color picker, stickers caméléon, événements avec QR
- Settings enrichis (WhatsApp/Telegram style) : 8 sections
- Événements : création, QR code, invitation épinglée, rappels J-1/J
- Scanner QR dans section Tasks
- Catégories contacts (Famille, Amis, Connaissances, Collègues, Utilitaires)
- Police Manrope forcée globalement
- Nav bar : Chat / Tasks / Games / Notifs
- Icônes Fluent-style (diamond, hamburger avec 3 traits dont milieu plus long)
- PWA manifest + service worker
- React local (vendor/) pour preview offline-safe

### Corrigé
- Logo caméléon désormais fidèle au SVG original (3 couches : fond blanc + body + eye + highlight)
- Polices uniformes entre noms statuts et discussions (15px / 700)
- Espacement Statuts-Discussions réduit
- Hamburger avec 3 barres (milieu long, extérieurs courts centrés)
- Diamond avec facettes + 3 sparkles
- Nav bar visible dans aperçu (flex column layout)
- Scripts React chargés en local (pas de dépendance CDN bloquante)

## [0.1.0] - 2026-04-16

### Ajouté
- Version initiale MVP en JavaScript pur + React CDN
- Structure modulaire avec `build.js` concat
- localStorage pour toutes les données
- 16 modules JS dans `js/`

---

[Unreleased]: https://github.com/land-lang-120/chrome-messenger/compare/v1.0.0-pilot...HEAD
[1.0.0-pilot]: https://github.com/land-lang-120/chrome-messenger/releases/tag/v1.0.0-pilot
[0.1.0]: https://github.com/land-lang-120/chrome-messenger/releases/tag/v0.1.0
