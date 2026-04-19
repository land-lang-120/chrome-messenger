import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { LS_KEYS } from '../config';
import { lsGet, lsSet } from '../services/storage';
import {
  THEMES,
  THEME_DARK_SURFACES,
  THEME_LIGHT_SURFACES,
  type Theme,
  type ThemeId,
} from '../types/theme';

interface ThemeContextValue {
  readonly theme: Theme;
  readonly themeId: ThemeId;
  readonly setThemeId: (id: ThemeId) => void;
  readonly darkMode: boolean;
  readonly setDarkMode: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

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

  const theme = useMemo<Theme>(() => {
    if (darkMode) return { ...THEMES.dark, primary: THEMES[effectiveId(themeId)].primary };
    return THEMES[effectiveId(themeId)];
  }, [themeId, darkMode]);

  useEffect(() => {
    applyCssVars(theme);
    lsSet(LS_KEYS.theme, themeId);
    lsSet(`${LS_KEYS.theme}_dark`, darkMode);
  }, [theme, themeId, darkMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themeId, setThemeId, darkMode, setDarkMode }),
    [theme, themeId, darkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Garantit qu'on a toujours un ThemeId valide dans THEMES (custom redirige vers mint pour v1).
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
