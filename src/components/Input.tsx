import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ error, style, ...rest }, ref) {
  return (
    <div>
      <input
        ref={ref}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 14,
          background: 'var(--cm-surface)',
          border: `1px solid ${error ? '#FF4757' : 'var(--cm-line)'}`,
          color: 'var(--cm-title)',
          fontSize: 16,
          fontFamily: 'inherit',
          outline: 'none',
          ...style,
        }}
        {...rest}
      />
      {error && <p style={{ color: '#FF4757', fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  );
});
