import type { ReactNode } from 'react';

export interface BottomNavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: ReactNode;
  readonly iconActive?: ReactNode;
  readonly badge?: boolean;
}

export interface BottomNavProps {
  readonly items: readonly BottomNavItem[];
  readonly active: string;
  readonly onChange: (id: string) => void;
}

export function BottomNav({ items, active, onChange }: BottomNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      style={{
        flexShrink: 0,
        background: 'var(--cm-bg)',
        borderTop: '1px solid var(--cm-line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
      }}
    >
      {items.map((it) => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={isActive}
            aria-label={it.label}
            onClick={() => onChange(it.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'inherit',
              color: isActive ? 'var(--cm-primary)' : 'var(--cm-muted)',
              position: 'relative',
            }}
          >
            {isActive && (
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 2,
                  width: 44,
                  height: 30,
                  borderRadius: 14,
                  background: 'var(--cm-primary-soft)',
                  zIndex: 0,
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex' }}>
              {isActive && it.iconActive ? it.iconActive : it.icon}
              {it.badge && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: -4, right: -4,
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--cm-primary)',
                    border: '2px solid var(--cm-bg)',
                  }}
                />
              )}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, position: 'relative', zIndex: 1 }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
