/**
 * main.tsx — point d'entree Vite.
 * Monte React sur #root et cache le splash.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles/global.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Element #root introuvable dans le DOM.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Hide splash apres un court delai (laisse le temps a React de monter)
window.setTimeout(() => {
  const splash = document.getElementById('cm-splash');
  if (splash) {
    splash.classList.add('hide');
    window.setTimeout(() => splash.remove(), 600);
  }
}, 800);
