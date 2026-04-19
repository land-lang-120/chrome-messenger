import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { LS_KEYS } from '../config';
import { lsGet, lsSet, lsRemove } from '../services/storage';
import { onAuthChange } from '../services/firebase/auth';
import { isFirebaseEnabled } from '../services/firebase';
import type { User, UserSettings } from '../types/user';
import { DEFAULT_USER_SETTINGS } from '../types/user';

interface AuthContextValue {
  readonly user: User | null;
  readonly onboarded: boolean;
  readonly setOnboarded: (v: boolean) => void;
  readonly setUser: (u: User | null) => void;
  readonly updateSettings: (patch: Partial<UserSettings>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => lsGet<User | null>(LS_KEYS.profile, null));
  const [onboarded, setOnboardedState] = useState<boolean>(() => lsGet<boolean>(LS_KEYS.onboarded, false));

  /**
   * Sync etat Firebase Auth — uniquement si Firebase est reellement connecte.
   * En mode dev local (sans config Firebase), on reste sur l'etat localStorage
   * pour ne pas effacer les donnees a chaque mount.
   */
  useEffect(() => {
    if (!isFirebaseEnabled()) return;
    const unsub = onAuthChange((fbUser) => {
      if (!fbUser && onboarded) {
        setUserState(null);
        setOnboardedState(false);
        lsRemove(LS_KEYS.profile);
        lsRemove(LS_KEYS.onboarded);
      }
    });
    return unsub;
  }, [onboarded]);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) lsSet(LS_KEYS.profile, u);
    else lsRemove(LS_KEYS.profile);
  };

  const setOnboarded = (v: boolean) => {
    setOnboardedState(v);
    lsSet(LS_KEYS.onboarded, v);
  };

  const updateSettings = (patch: Partial<UserSettings>) => {
    setUserState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, settings: { ...DEFAULT_USER_SETTINGS, ...prev.settings, ...patch } };
      lsSet(LS_KEYS.profile, next);
      return next;
    });
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, onboarded, setOnboarded, setUser, updateSettings }),
    [user, onboarded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit etre utilise dans un AuthProvider');
  return ctx;
}
