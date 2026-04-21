# 📊 chrome-messenger — Suivi

> Voir aussi : [CAHIER-CHARGES.md](CAHIER-CHARGES.md) (spec complète)
> Mis à jour : **2026-04-21**

| | |
|---|---|
| **Stack** | React 18 + TypeScript + Vite + Capacitor 8 |
| **Statut** | 🟡 Beta |
| **Plateformes** | Web (PWA) + Android APK natif (Capacitor) |
| **Repo** | github.com/land-lang-120/chrome-messenger |

---

## ✅ Fait

- Migration JavaScript → TypeScript + React 18 + Vite
- Architecture par features (`src/features/{chat,home,todolist,...}`)
- Onboarding complet (Welcome 3 lignes, Phone +237, OTP code 123456 visible, Profil avec auto-capitalize + bio 80 chars max)
- Home : Statuts (stories) + Discussions, FAB chat au-dessus nav bar, espace Statuts/Discussions resserré
- Tasks : vue semaine par défaut, toggle chevron haut/bas vers vue mois, AddTaskSheet avec « Moi » + tous contacts, nom assigné affiché sous chaque tâche, TaskOptionsSheet (corbeille/historique)
- Navigation : 5 onglets bottom nav avec icônes Fluent (outline + filled actif)
- Thèmes : 8 thèmes + dark mode + custom color picker (Pro)
- Caméléon logo qui auto-cache son fond blanc en dark mode
- E2E encryption : ECDH P-256 + AES-GCM 256, clés privées jamais envoyées
- i18n 16 langues, font Manrope
- Safe-area insets sur le body (status bar = vraie limite)
- Capacitor Android : adaptive icon (foreground caméléon + background mint généré via `scripts/gen-icon-sources.cjs`)
- GitHub Actions APK build (paths `src/**`, `public/**`, `index.html`, `vite.config.ts`)
- Mode local activé quand Firebase non configuré (plus de throw au boot)

## 🔄 En cours

- Polissage UI fine (espacements Statuts/Discussions, derniers détails design)
- Nouveau build APK déclenché par dernier commit (commit `ee7bab3`)

## 📋 À faire

1. Vérifier que le nouvel APK lance bien et contient toutes les corrections récentes
2. Configurer Firebase prod (Auth Phone + Firestore + Storage + FCM)
3. Implémenter complètement le flux premium in-app purchase (TODO dans `services/premium.ts`)
4. Cloud Functions Firebase (notifs push, cleanup messages expirés)
5. Coverage Playwright sur tous les flows P0 (onboarding, envoi message, ajout tâche)
6. Lighthouse ≥ 90 perf / ≥ 95 a11y
7. Build iOS via PWABuilder ou Capacitor iOS
8. Soumission Play Store (assets store dans `docs/store-assets/` à compléter)
9. Switch prefix téléphone +237 → sélecteur de pays
10. Cleanup TODOs restants dans `services/premium.ts`
