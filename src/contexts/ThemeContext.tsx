import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { LS_KEYS } from '../config';
import { lsGet, lsSet } from '../services/storage';
import {
  THEMES,
  THEME_DARK_SURFACES,
  THEME_LIGHT_SURFACES,
  type Theme,
  type ThemeColors,
  type ThemeId,
} from '../types/theme';

interface ThemeContextValue {
  readonly theme: Theme;
  readonly themeId: ThemeId;
  readonly setThemeId: (id: ThemeId) => void;
  readonly darkMode: boolean;
  readonly setDarkMode: (v: boolean) => void;
  /** Active la palette personnalisée Pro (primary/primaryDark/primarySoft). */
  readonly setCustomTheme: (colors: ThemeColors) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const CUSTOM_KEY = `${LS_KEYS.theme}_custom`;

/** Applique les CSS custom properties au root DOM pour propager partout. */
function applyCssVars(theme: Theme): void {
  const root = document.documentElement;
  const surfaces = theme.isDark ? THEME_DARK_SURFACES : THEME_LIGHT_SURFACES;
  root.style.setProperty('--cm-primary', theme.primary);
  root.style.setProperty('--cm-primary-dark', theme.primaryDark);
  root.style.setProperty('--cm-primary-soft', theme.primarySoft);
  root.style.setProperty('--cm-bg', surfaces.bg);
  root.style.setProperty('--cm-surface', surfaces.surface);
  root.style.setProperty('--cm-surface-2', surfaces.surface2);
  root.style.setProperty('--cm-line', surfaces.line);
  root.style.setProperty('--cm-title', surfaces.title);
  root.style.setProperty('--cm-body', surfaces.body);
  root.style.setProperty('--cm-sub', surfaces.sub);
  root.style.setProperty('--cm-muted', surfaces.muted);
  document.body.style.background = surfaces.bg;
  document.body.style.color = surfaces.body;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => lsGet<ThemeId>(LS_KEYS.theme, 'mint'));
  const [darkMode, setDarkMode] = useState<boolean>(() => lsGet<boolean>(`${LS_KEYS.theme}_dark`, false));
  const [custom, setCustom] = useState<ThemeColors | null>(() => lsGet<ThemeColors | null>(CUSTOM_KEY, null));

  // Charbon : désactive le dark mode (indiscernable)
  const effectiveDarkMode = themeId === 'charcoal' ? false : darkMode;

  const theme = useMemo<Theme>(() => {
    // Priorité : custom > dark override > preset
    if (themeId === 'custom' && custom) {
      return {
        id: 'custom',
        name: 'Personnalise',
        primary: custom.primary,
        primaryDark: custom.primaryDark,
        primarySoft: custom.primarySoft,
        isDark: effectiveDarkMode,
      };
    }
    const base = THEMES[effectiveId(themeId)];
    if (effectiveDarkMode) return { ...THEMES.dark, primary: base.primary, primaryDark: base.primaryDark, primarySoft: base.primarySoft };
    return base;
  }, [themeId, effectiveDarkMode, custom]);

  useEffect(() => {
    applyCssVars(theme);
    lsSet(LS_KEYS.theme, themeId);
    lsSet(`${LS_KEYS.theme}_dark`, effectiveDarkMode);
  }, [theme, themeId, effectiveDarkMode]);

  const setCustomTheme = useCallback((colors: ThemeColors) => {
    setCustom(colors);
    lsSet(CUSTOM_KEY, colors);
    setThemeId('custom');
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themeId, setThemeId, darkMode: effectiveDarkMode, setDarkMode, setCustomTheme }),
    [theme, themeId, effectiveDarkMode, setCustomTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Garantit qu'on a toujours un ThemeId valide dans THEMES (fallback vers mint).
 */
function effectiveId(id: ThemeId): Exclude<ThemeId, 'custom'> {
  if (id === 'custom') return 'mint';
  return id;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit etre utilise dans un ThemeProvider');
  return ctx;
}
