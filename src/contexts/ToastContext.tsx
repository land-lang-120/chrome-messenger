import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type ToastKind = 'info' | 'success' | 'warning' | 'error';

interface ToastItem {
  readonly id: number;
  readonly msg: string;
  readonly kind: ToastKind;
}

interface ToastContextValue {
  readonly show: (msg: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((msg: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: 90,
          left: 0, right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
          zIndex: 1000,
          padding: '0 16px',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              maxWidth: 380,
              padding: '12px 18px',
              background: kindBg(t.kind),
              color: '#FFF',
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              pointerEvents: 'auto',
            }}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function kindBg(k: ToastKind): string {
  switch (k) {
    case 'success': return '#1FAE7C';
    case 'warning': return '#FFB740';
    case 'error':   return '#FF4757';
    default:        return '#2B2D33';
  }
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast doit etre utilise dans un ToastProvider');
  return ctx;
}
