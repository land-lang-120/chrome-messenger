import { type ReactNode, useEffect } from 'react';

export interface BottomSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly children?: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="close"
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          border: 'none', cursor: 'pointer',
        }}
      />
      <div
        style={{
          position: 'relative',
          background: 'var(--cm-bg)',
          width: '100%',
          maxWidth: 480,
          borderRadius: '24px 24px 0 0',
          padding: '20px 16px calc(24px + env(safe-area-inset-bottom))',
          maxHeight: '80vh',
          overflowY: 'auto',
          animation: 'cm-sheet-in 0.25s ease-out',
        }}
      >
        <div
          style={{
            width: 40, height: 4, borderRadius: 2,
            background: 'var(--cm-line)',
            margin: '0 auto 16px',
          }}
        />
        {title && (
          <h2 style={{ textAlign: 'center', fontSize: 18, fontWeight: 800, color: 'var(--cm-title)', margin: '0 0 8px' }}>
            {title}
          </h2>
        )}
        {children}
      </div>
      <style>{`
        @keyframes cm-sheet-in {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
