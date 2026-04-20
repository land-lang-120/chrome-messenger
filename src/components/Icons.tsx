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

export function IconChevDown(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconChevUp(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

export function IconTrash(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconHistory(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 8v4l3 2" />
      <path d="M3.05 11a9 9 0 118.95 10" strokeLinecap="round" />
      <path d="M3 5v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArchive(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x={2} y={4} width={20} height={5} rx={1} />
      <path d="M4 9v10a2 2 0 002 2h12a2 2 0 002-2V9" />
      <path d="M10 13h4" strokeLinecap="round" />
    </svg>
  );
}

export function IconFilter(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 5h16M7 12h10M10 19h4" strokeLinecap="round" />
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

/* ---- NAV BAR : icones style Fluent (outline) + versions filled pour actif ---- */

export function IconChat(p: IconProps) {
  // Bulle de chat Messenger-like : arrondie + queue en bas-gauche
  return (
    <svg {...base} {...p}>
      <path d="M12 3C6.5 3 3 6.6 3 11c0 2.3 1 4.4 2.8 5.8L5 21l4.4-2.3c.8.2 1.7.3 2.6.3 5.5 0 9-3.6 9-8S17.5 3 12 3z" />
    </svg>
  );
}

export function IconChatFilled(p: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...p}>
      <path d="M12 3C6.5 3 3 6.6 3 11c0 2.3 1 4.4 2.8 5.8L5 21l4.4-2.3c.8.2 1.7.3 2.6.3 5.5 0 9-3.6 9-8S17.5 3 12 3z" />
    </svg>
  );
}

export function IconTasks(p: IconProps) {
  // Calendrier + case cochee (style tasks app Fluent)
  return (
    <svg {...base} {...p}>
      <rect x={3} y={5} width={18} height={16} rx={2.5} />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M9 15l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTasksFilled(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22} aria-hidden {...p}>
      <path d="M8 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h2.5A2.5 2.5 0 0122 6.5V19a3 3 0 01-3 3H5a3 3 0 01-3-3V6.5A2.5 2.5 0 014.5 4H7V3a1 1 0 011-1zm12 9H4v8a1 1 0 001 1h14a1 1 0 001-1v-8zm-3.3 1.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-1.4 0l-2-2a1 1 0 011.4-1.4L12 15.6l3.7-3.7z" />
    </svg>
  );
}

export function IconGames(p: IconProps) {
  // Manette Xbox-like : dpad a gauche + 4 boutons a droite
  return (
    <svg {...base} {...p}>
      <rect x={2} y={6} width={20} height={12} rx={5} />
      {/* D-pad gauche */}
      <path d="M7 12h4M9 10v4" strokeLinecap="round" />
      {/* 4 boutons droite */}
      <circle cx={17} cy={10} r={1} fill="currentColor" stroke="none" />
      <circle cx={19} cy={12} r={1} fill="currentColor" stroke="none" />
      <circle cx={15} cy={12} r={1} fill="currentColor" stroke="none" />
      <circle cx={17} cy={14} r={1} fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGamesFilled(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22} aria-hidden {...p}>
      <path d="M17 5H7a5 5 0 00-5 5v4a5 5 0 005 5h10a5 5 0 005-5v-4a5 5 0 00-5-5zM9 12.5H8v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h1v-1a1 1 0 112 0v1h1a1 1 0 110 2zm7 2a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm0-4a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm2.5 2a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm-5 0a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" />
    </svg>
  );
}

export function IconBell(p: IconProps) {
  // Cloche Fluent : contours nets + battant en bas
  return (
    <svg {...base} {...p}>
      <path d="M6 8a6 6 0 1112 0c0 6 3 7 3 7H3s3-1 3-7z" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 004 0" strokeLinecap="round" />
    </svg>
  );
}

export function IconBellFilled(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22} aria-hidden {...p}>
      <path d="M12 2a6 6 0 00-6 6v1.1c0 1.3-.4 2.6-1.1 3.7l-1.3 2A2 2 0 005.3 18h4.2a2.5 2.5 0 004.9 0h4.3a2 2 0 001.7-3.2l-1.3-2c-.7-1-1.1-2.3-1.1-3.7V8a6 6 0 00-6-6zm0 18a1.5 1.5 0 01-1.4-1h2.9A1.5 1.5 0 0112 20z" />
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
