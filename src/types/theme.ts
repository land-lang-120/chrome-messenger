export type ThemeId =
  | 'mint'
  | 'blue'
  | 'orange'
  | 'coral'
  | 'purple'
  | 'lilac'
  | 'yellow'
  | 'charcoal'
  | 'custom'
  | 'dark';

export interface ThemeColors {
  readonly primary: string;
  readonly primaryDark: string;
  readonly primarySoft: string;
}

export interface Theme extends ThemeColors {
  readonly id: ThemeId;
  readonly name: string;
  readonly isDark: boolean;
}

export const THEME_LIGHT_SURFACES = {
  bg: '#FFFFFF',
  surface: '#F8FAFC',
  surface2: '#EEF2F6',
  line: '#E3E8EE',
  title: '#0F1620',
  body: '#2A2F38',
  sub: '#5B6472',
  muted: '#8B96A6',
} as const;

export const THEME_DARK_SURFACES = {
  bg: '#0A0E14',
  surface: '#111723',
  surface2: '#1A2230',
  line: '#222A36',
  title: '#F1F5F9',
  body: '#D6DCE3',
  sub: '#8B96A6',
  muted: '#5B6472',
} as const;

export const THEMES: Readonly<Record<Exclude<ThemeId, 'custom'>, Theme>> = {
  mint: {
    id: 'mint',
    name: 'Menthe',
    primary: '#30D79C',
    primaryDark: '#1FAE7C',
    primarySoft: '#D5F8EB',
    isDark: false,
  },
  blue: {
    id: 'blue',
    name: 'Azur',
    primary: '#4F80FF',
    primaryDark: '#3B64CC',
    primarySoft: '#DDE8FF',
    isDark: false,
  },
  orange: {
    id: 'orange',
    name: 'Ambre',
    primary: '#FF8A4C',
    primaryDark: '#CC6E3D',
    primarySoft: '#FFE4D0',
    isDark: false,
  },
  coral: {
    id: 'coral',
    name: 'Corail',
    primary: '#FF4F7A',
    primaryDark: '#CC3E61',
    primarySoft: '#FFD7E0',
    isDark: false,
  },
  purple: {
    id: 'purple',
    name: 'Violet',
    primary: '#A855F7',
    primaryDark: '#8644C4',
    primarySoft: '#EDDAFB',
    isDark: false,
  },
  lilac: {
    id: 'lilac',
    name: 'Lilas',
    primary: '#C895E8',
    primaryDark: '#A075BA',
    primarySoft: '#F2E3FA',
    isDark: false,
  },
  yellow: {
    id: 'yellow',
    name: 'Tournesol',
    primary: '#FFC940',
    primaryDark: '#CCA033',
    primarySoft: '#FFF0C2',
    isDark: false,
  },
  charcoal: {
    id: 'charcoal',
    name: 'Charbon',
    primary: '#2B2D33',
    primaryDark: '#1A1C20',
    primarySoft: '#DDE0E5',
    isDark: false,
  },
  dark: {
    id: 'dark',
    name: 'Sombre',
    primary: '#30D79C',
    primaryDark: '#1FAE7C',
    primarySoft: '#1F3D2E',
    isDark: true,
  },
};
