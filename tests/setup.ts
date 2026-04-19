import '@testing-library/jest-dom/vitest';
import { webcrypto } from 'node:crypto';

// Polyfill crypto.subtle si absent (certaines versions de happy-dom)
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: false,
  });
}
