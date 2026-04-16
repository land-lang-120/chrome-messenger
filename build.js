/* Chrome Messenger — Build script */

const fs = require("fs");
const path = require("path");

const FILES = [
  "js/config.js",
  "js/i18n.js",
  "js/data/seed.js",
  "js/storage.js",
  "js/crypto.js",
  "js/components.js",
  "js/screens-onboarding.js",
  "js/screens-home.js",
  "js/screens-chat.js",
  "js/screens-todolist.js",
  "js/screens-games.js",
  "js/screens-notifs.js",
  "js/screens-story.js",
  "js/screens-premium.js",
  "js/screens-settings.js",
  "js/app.js",
  "js/main.js",
];

let bundle = "/* Chrome Messenger — Bundled " + new Date().toISOString() + " */\n\n";

FILES.forEach(function(f) {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) { console.warn("[build] Missing:", f); return; }
  bundle += "\n/* ══════ " + f + " ══════ */\n";
  bundle += fs.readFileSync(p, "utf8");
  bundle += "\n";
});

fs.writeFileSync(path.join(__dirname, "bundle.js"), bundle);
console.log("[build] Wrote bundle.js (" + (bundle.length / 1024).toFixed(1) + " KB, " + FILES.length + " files)");
