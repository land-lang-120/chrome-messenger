import { type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  readonly children: ReactNode;
  readonly label: string;
}

export function IconButton({ children, label, style, ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      style={{
        width: 42,
        height: 42,
        minWidth: 42,
        minHeight: 42,
        borderRadius: 12,
        background: 'var(--cm-surface-2)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--cm-title)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
