import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  readonly variant?: Variant;
  readonly size?: Size;
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
  readonly children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();
  const sz = { sm: 10, md: 14, lg: 16 }[size];
  const fs = { sm: 13, md: 15, lg: 16 }[size];

  const variantStyle: Record<Variant, React.CSSProperties> = {
    primary: {
      background: theme.primary,
      color: '#FFF',
      border: 'none',
    },
    ghost: {
      background: 'transparent',
      color: theme.primary,
      border: `1px solid ${theme.primary}`,
    },
    danger: {
      background: 'transparent',
      color: '#FF4757',
      border: '1px solid #FF4757',
    },
  };

  const isDisabled = disabled ?? loading;

  return (
    <button
      disabled={isDisabled}
      style={{
        padding: `${sz}px 20px`,
        fontSize: fs,
        fontWeight: 700,
        borderRadius: 16,
        width: fullWidth ? '100%' : undefined,
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.15s',
        fontFamily: 'inherit',
        ...variantStyle[variant],
        ...style,
      }}
      {...rest}
    >
      {loading ? '…' : children}
    </button>
  );
}
