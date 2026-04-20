/**
 * main.tsx — point d'entree React.
 *
 * Rend l'App dans #root et cache le splash des que possible.
 * Safety net : si React crash, le splash se cache quand meme apres 3s max.
 */

import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles/global.css';

/** Cache le splash et le retire du DOM. */
function hideSplash(): void {
  const splash = document.getElementById('cm-splash');
  if (!splash) return;
  splash.classList.add('hide');
  window.setTimeout(() => {
    splash.remove();
  }, 500);
}

/** Affiche un ecran d'erreur clair si React crash (au lieu du splash bloquant). */
class RootErrorBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  override state = { err: null as Error | null };

  static getDerivedStateFromError(err: Error) {
    return { err };
  }

  override componentDidCatch(err: Error, info: ErrorInfo): void {
    console.error('[Chrome Messenger] React crashed:', err, info);
    hideSplash();
  }

  override render() {
    if (this.state.err) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            fontFamily: 'Manrope, system-ui, sans-serif',
            background: '#FFFFFF',
            color: '#0F1620',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>😅</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            Oups, un bug est apparu
          </h1>
          <p style={{ fontSize: 14, color: '#5B6472', marginBottom: 20, maxWidth: 320 }}>
            {this.state.err.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              borderRadius: 14,
              background: '#30D79C',
              color: '#FFF',
              border: 'none',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Redemarrer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* =============================================================
   SAFETY NET : cache le splash apres 3s max, quoi qu'il arrive
   ============================================================= */
window.setTimeout(() => {
  hideSplash();
}, 3000);

/* =============================================================
   MONTAGE REACT
   ============================================================= */
const container = document.getElementById('root');
if (!container) {
  // Fallback : si pas de #root, affiche un message dans le body
  document.body.innerHTML =
    '<div style="padding:40px;text-align:center;font-family:sans-serif">Erreur : #root introuvable</div>';
  hideSplash();
} else {
  try {
    createRoot(container).render(
      <StrictMode>
        <RootErrorBoundary>
          <App />
        </RootErrorBoundary>
      </StrictMode>,
    );
    // Cache le splash apres un court delai pour laisser React render
    window.setTimeout(hideSplash, 600);
  } catch (err) {
    console.error('[Chrome Messenger] createRoot failed:', err);
    hideSplash();
    container.innerHTML =
      '<div style="padding:40px;text-align:center;font-family:sans-serif">Erreur au demarrage : ' +
      (err as Error).message +
      '</div>';
  }
}
