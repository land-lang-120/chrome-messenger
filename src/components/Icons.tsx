/**
 * Icones — style Fluent (outline + certaines filled).
 * Toutes en 24x24, currentColor pour adaptation theme.
 */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function IconBack(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function IconClose(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconMenu(p: IconProps) {
  // Hamburger : 3 barres, milieu plus long, exterieures centrees
  return (
    <svg {...base} fill="currentColor" stroke="none" {...p} aria-label="menu">
      <rect x={4.5} y={5} width={15} height={2} rx={1} />
      <rect x={3} y={11} width={18} height={2} rx={1} />
      <rect x={4.5} y={17} width={15} height={2} rx={1} />
    </svg>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx={11} cy={11} r={7} />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconChat(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

export function IconChatFilled(p: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...p}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

export function IconTasks(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x={3} y={4} width={18} height={18} rx={2} />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  );
}

export function IconGames(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6 12h4M8 10v4" />
      <path d="M15 13.5h.01M18 11.5h.01" />
      <rect x={2} y={6} width={20} height={12} rx={4} />
    </svg>
  );
}

export function IconBell(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

export function IconGem(p: IconProps) {
  // Diamond avec facettes + 3 sparkles
  return (
    <svg {...base} strokeWidth={1.8} {...p}>
      <path d="M6 4h12l3 5-9 11L3 9z" />
      <path d="M3 9h18M8 4l-3 5 7 11M16 4l3 5-7 11M8 4l4 5 4-5" />
      <path d="M20 1.5l.5 1M22.3 3l-1 .4M20.5 5l-.7-.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlus(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconPhone(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.98.37 1.94.72 2.84a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.24-1.24a2 2 0 012.11-.45c.9.35 1.86.59 2.84.72A2 2 0 0122 16.92z" />
    </svg>
  );
}

export function IconVideo(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x={1} y={5} width={15} height={14} rx={2} />
    </svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function IconLock(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x={3} y={11} width={18} height={11} rx={2} />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
