/** Avatar rond — photo si dispo, sinon initiales sur couleur deterministe du nom. */

export interface AvatarProps {
  readonly name: string;
  readonly src?: string | null;
  readonly size?: number;
  readonly border?: string;
  readonly ring?: string | null;
  readonly style?: React.CSSProperties;
}

const PALETTE = [
  '#FF6B6B', '#FF8A4C', '#FFB740', '#30D79C', '#4F80FF',
  '#A855F7', '#EC4899', '#14B8A6', '#F59E0B', '#8B5CF6',
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return (parts[0]?.[0] ?? '?').toUpperCase();
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

export function Avatar({ name, src, size = 40, border, ring, style }: AvatarProps) {
  const bg = PALETTE[hashName(name) % PALETTE.length];
  const fs = Math.floor(size * 0.42);

  const inner = src ? (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ display: 'block', width: size, height: size, objectFit: 'cover', borderRadius: '50%' }}
    />
  ) : (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg, color: '#FFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: fs, fontWeight: 700, lineHeight: 1,
      }}
    >
      {initials(name)}
    </div>
  );

  if (ring) {
    return (
      <div style={{ padding: 2, background: ring, borderRadius: '50%', boxShadow: border ? `0 0 0 2px ${border}` : undefined, ...style }}>
        {inner}
      </div>
    );
  }
  return <div style={{ border: border ? `2px solid ${border}` : undefined, borderRadius: '50%', ...style }}>{inner}</div>;
}
