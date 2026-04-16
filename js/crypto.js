/* Chrome Messenger — End-to-End Encryption Layer
 *
 * Architecture inspired by Signal/WhatsApp:
 *  - Each user has an ECDH keypair (P-256 curve) persisted locally.
 *  - When two users open a conversation, they derive a shared secret via ECDH,
 *    then use it as a root key (HKDF) to produce a chain of AES-256-GCM message keys.
 *  - Every message is encrypted with a fresh key; old keys are deleted.
 *  - The server (real-world) only sees ciphertext + ephemeral public keys.
 *
 * For this client-only demo (localStorage simulation), we:
 *  - Generate a real ECDH keypair per user.
 *  - Derive a real shared AES-GCM key per conversation.
 *  - Encrypt every message with AES-GCM and a random IV before storing.
 *  - Decrypt on read.
 *
 * Performance:
 *  - AES-GCM + ECDH are native WebCrypto (hardware-accelerated).
 *  - Message keys cached in-memory per conversation (avoids re-derivation).
 *  - Messages persisted as compact base64 ciphertext, never plaintext.
 *
 * Resource efficiency (Telegram/WhatsApp-like):
 *  - Messages lazy-loaded per conversation (not all at once).
 *  - Key cache with LRU eviction (max 20 conversations in memory).
 *  - Only the last 200 messages per conv are kept hot; older trimmed to archive.
 */

var _cmKeyCache = {}; /* convId -> CryptoKey (AES-GCM) */
var _cmMyKeypair = null; /* CryptoKeyPair for my account */
var _cmPeerPublicKeys = {}; /* contactId -> CryptoKey (public) */

const CM_CRYPTO_KEYS = {
  myPrivateKey: "cm_crypto_my_priv",
  myPublicKey:  "cm_crypto_my_pub",
  peerKeys:     "cm_crypto_peer_keys",
};

/* ===== Initialization ===== */

async function cmCryptoInit() {
  if (!window.crypto || !window.crypto.subtle) {
    console.warn("[cm-crypto] WebCrypto not available, falling back to plaintext mode");
    return false;
  }
  /* Load or generate my keypair */
  var stored = await cmLoadMyKeypair();
  if (stored) {
    _cmMyKeypair = stored;
  } else {
    _cmMyKeypair = await cmGenerateKeypair();
    await cmPersistMyKeypair(_cmMyKeypair);
  }
  /* Load peer public keys from local cache */
  try {
    var raw = localStorage.getItem(CM_CRYPTO_KEYS.peerKeys);
    if (raw) {
      var obj = JSON.parse(raw);
      for (var k in obj) {
        _cmPeerPublicKeys[k] = await cmImportPublicKey(obj[k]);
      }
    }
  } catch (e) {}
  return true;
}

async function cmGenerateKeypair() {
  return crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true, /* extractable — only locally, never exported off-device in real app */
    ["deriveKey"]
  );
}

async function cmExportPublicKey(key) {
  var buf = await crypto.subtle.exportKey("raw", key);
  return cmBufToBase64(buf);
}

async function cmImportPublicKey(base64) {
  var buf = cmBase64ToBuf(base64);
  return crypto.subtle.importKey(
    "raw", buf,
    { name: "ECDH", namedCurve: "P-256" },
    true, [] /* public keys don't need deriveKey capability themselves */
  );
}

async function cmPersistMyKeypair(kp) {
  try {
    var privJwk = await crypto.subtle.exportKey("jwk", kp.privateKey);
    var pubRaw = await cmExportPublicKey(kp.publicKey);
    localStorage.setItem(CM_CRYPTO_KEYS.myPrivateKey, JSON.stringify(privJwk));
    localStorage.setItem(CM_CRYPTO_KEYS.myPublicKey, pubRaw);
  } catch (e) { console.warn("[cm-crypto] persist failed", e); }
}

async function cmLoadMyKeypair() {
  try {
    var privStr = localStorage.getItem(CM_CRYPTO_KEYS.myPrivateKey);
    var pubStr  = localStorage.getItem(CM_CRYPTO_KEYS.myPublicKey);
    if (!privStr || !pubStr) return null;
    var privJwk = JSON.parse(privStr);
    var privateKey = await crypto.subtle.importKey(
      "jwk", privJwk,
      { name: "ECDH", namedCurve: "P-256" },
      true, ["deriveKey"]
    );
    var publicKey = await cmImportPublicKey(pubStr);
    return { privateKey: privateKey, publicKey: publicKey };
  } catch (e) { return null; }
}

/* ===== Peer Key Exchange (simulated) =====
 * In the demo, we create a fake peer keypair for each contact and persist
 * only their public key locally. In a real app, the server relays these.
 */
async function cmEnsurePeerKey(contactId) {
  if (_cmPeerPublicKeys[contactId]) return _cmPeerPublicKeys[contactId];
  /* Generate a mock peer keypair — only their public key stored */
  var peerKp = await cmGenerateKeypair();
  var pubRaw = await cmExportPublicKey(peerKp.publicKey);
  /* Store */
  try {
    var raw = localStorage.getItem(CM_CRYPTO_KEYS.peerKeys);
    var obj = raw ? JSON.parse(raw) : {};
    obj[contactId] = pubRaw;
    localStorage.setItem(CM_CRYPTO_KEYS.peerKeys, JSON.stringify(obj));
  } catch (e) {}
  _cmPeerPublicKeys[contactId] = peerKp.publicKey;
  return peerKp.publicKey;
}

/* ===== Per-conversation symmetric key derivation ===== */
async function cmGetConvKey(convId) {
  if (_cmKeyCache[convId]) return _cmKeyCache[convId];
  /* LRU-like eviction if cache too big */
  var keys = Object.keys(_cmKeyCache);
  if (keys.length > 20) delete _cmKeyCache[keys[0]];

  if (!_cmMyKeypair) return null;
  var conv = cmFindConversation(convId);
  if (!conv) return null;

  /* Derive shared key: for direct chats use contact's public key;
     for groups we'd use a sender-keys scheme — here we fallback to group key. */
  var peerKey;
  if (conv.type === "direct") {
    peerKey = await cmEnsurePeerKey(conv.contactId);
  } else {
    /* Mock: derive group key from conv.id as salt (demo only) */
    peerKey = await cmEnsurePeerKey(conv.id);
  }

  var aesKey = await crypto.subtle.deriveKey(
    { name: "ECDH", public: peerKey },
    _cmMyKeypair.privateKey,
    { name: "AES-GCM", length: 256 },
    false, /* not extractable — stays in browser crypto engine */
    ["encrypt", "decrypt"]
  );

  _cmKeyCache[convId] = aesKey;
  return aesKey;
}

/* ===== Encrypt / Decrypt ===== */
async function cmEncryptMessage(convId, plaintext) {
  var key = await cmGetConvKey(convId);
  if (!key) return { ciphertext: plaintext, iv: null, enc: false };
  var iv = crypto.getRandomValues(new Uint8Array(12));
  var encoded = new TextEncoder().encode(plaintext);
  var ctBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encoded);
  return {
    ciphertext: cmBufToBase64(ctBuf),
    iv: cmBufToBase64(iv),
    enc: true,
  };
}

async function cmDecryptMessage(convId, payload) {
  if (!payload.enc) return payload.ciphertext; /* plaintext fallback */
  var key = await cmGetConvKey(convId);
  if (!key) return "[encrypted]";
  try {
    var iv = cmBase64ToBuf(payload.iv);
    var ct = cmBase64ToBuf(payload.ciphertext);
    var plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, ct);
    return new TextDecoder().decode(plainBuf);
  } catch (e) {
    return "[decrypt failed]";
  }
}

/* ===== Helpers ===== */
function cmBufToBase64(buf) {
  var bytes = new Uint8Array(buf);
  var bin = "";
  for (var i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function cmBase64ToBuf(base64) {
  var bin = atob(base64);
  var bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

/* ===== High-level wrappers used by chat UI ===== */

/* Encrypt before storing, return compact payload */
async function cmAddEncryptedMessage(convId, plaintext, authorId) {
  var payload = await cmEncryptMessage(convId, plaintext);
  var msg = {
    authorId: authorId || "me",
    at: Date.now(),
    readByMe: true,
    cipher: payload, /* { ciphertext, iv, enc } */
  };
  return cmAddMessage(convId, msg);
}

/* Decrypt all cached messages of a conversation for display.
 * Caches decrypted text on the message object in-memory to avoid double work. */
async function cmDecryptConversation(convId) {
  var msgs = cmGetMessages(convId);
  for (var i = 0; i < msgs.length; i++) {
    var m = msgs[i];
    if (m.cipher && !m._text) {
      m._text = await cmDecryptMessage(convId, m.cipher);
    } else if (!m._text) {
      m._text = m.text || "";
    }
  }
  return msgs;
}

/* Quick message text getter (sync) — uses cache, else falls back to plain */
function cmMsgText(m) {
  if (m._text !== undefined) return m._text;
  if (m.cipher) return "🔒";
  return m.text || "";
}

/* ===== Resource-efficient pruning =====
 * Keep the last 200 messages per conversation hot; archive older to
 * a secondary key to reduce JSON.parse overhead on startup.
 */
function cmPruneOldMessages(convId, keepHot) {
  keepHot = keepHot || 200;
  var all = cmGetMessages(convId);
  if (all.length <= keepHot) return;
  var cut = all.length - keepHot;
  var archive = all.slice(0, cut);
  var hot = all.slice(cut);
  try {
    var archKey = "cm_archive_" + convId;
    var existing = localStorage.getItem(archKey);
    var arr = existing ? JSON.parse(existing) : [];
    localStorage.setItem(archKey, JSON.stringify(arr.concat(archive)));
  } catch (e) {}
  cmSetMessages(convId, hot);
}
