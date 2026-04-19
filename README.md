# Chrome Messenger

> Messagerie instantanée chiffrée E2E avec todolist, jeux, statuts, événements.
> Le caméléon qui s'adapte à ton humeur 🦎

![Statut](https://img.shields.io/badge/statut-pilote%20migration-yellow)
![Version](https://img.shields.io/badge/version-1.0.0--dev-blue)
![Tests](https://img.shields.io/badge/tests-in%20progress-orange)

## 📦 Documentation

- 📋 [**Cahier des charges**](CAHIER-CHARGES.md) — spec complète
- 🏗️ [**Architecture**](ARCHITECTURE.md) — décisions techniques
- 🧪 [**Tests**](TESTING.md) — plan de tests
- 📜 [**Changelog**](CHANGELOG.md) — historique versions

## 🚀 Quickstart

```bash
# Installation (après migration TS)
npm install

# Dev
npm run dev              # http://localhost:3007

# Tests
npm run test             # watch
npm run test:ci          # avec coverage
npm run test:e2e         # Playwright
npm run test:a11y        # accessibilité

# Qualité
npm run lint
npm run typecheck
npm run format

# Build prod
npm run build
```

## 🎯 Features principales

- ✅ Chats chiffrés E2E (ECDH P-256 + AES-GCM)
- ✅ 16 langues (chacune dans son propre script)
- ✅ 8 thèmes + dark mode + color picker Pro
- ✅ Todolist (vue mois + semaine)
- ✅ Statuts 24h (style WhatsApp)
- ✅ Jeux solo + sociaux
- ✅ Événements avec QR code (Pro)
- ✅ PWA installable

## 🔗 Liens

- [CAHIER-CHARGES.md](CAHIER-CHARGES.md)
- [Firebase Console](https://console.firebase.google.com/) (à configurer)
- [GitHub repo](https://github.com/land-lang-120/chrome-messenger) (à créer)
- [Production URL](https://chrome-messenger.app) (à déployer)

## 👤 Maintainer

**Pino** — Owner  
**Claude** — Assistant de développement

---

_Cette app fait partie de [UNIVERSAL-TECH](../../README.md)._
