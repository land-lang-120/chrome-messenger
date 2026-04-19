import type { ReactNode } from 'react';
import { ChameleonLogo } from './ChameleonLogo';

export interface HeaderProps {
  readonly left?: ReactNode;
  readonly right?: ReactNode;
  readonly title?: string;
  readonly onLogoTap?: () => void;
  readonly hideLogo?: boolean;
}

export function Header({ left, right, title, onLogoTap, hideLogo }: HeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px 8px',
        gap: 12,
      }}
    >
      <div style={{ width: 42, display: 'flex', alignItems: 'center' }}>{left}</div>
      {!hideLogo && (
        <button
          type="button"
          onClick={onLogoTap}
          aria-label="theme"
          style={{
            background: 'transparent', border: 'none', cursor: onLogoTap ? 'pointer' : 'default',
            padding: 4, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit',
          }}
        >
          <ChameleonLogo size={88} />
          {title && <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--cm-title)' }}>{title}</span>}
        </button>
      )}
      {hideLogo && title && (
        <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--cm-title)', margin: 0 }}>{title}</h1>
      )}
      <div style={{ width: 42, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}
