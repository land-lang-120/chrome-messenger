import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { LS_KEYS } from '../config';
import { lsGet, lsSet } from '../services/storage';
import { DICTS, LANGS, type DictKey, type LangCode } from '../i18n';

type TFn = (key: DictKey) => string;

interface I18nContextValue {
  readonly lang: LangCode;
  readonly setLang: (code: LangCode) => void;
  readonly t: TFn;
  readonly rtl: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectBrowserLang(): LangCode {
  const nav = navigator.language?.slice(0, 2).toLowerCase() ?? 'fr';
  return (LANGS.find((l) => l.code === nav)?.code ?? 'fr');
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() =>
    lsGet<LangCode>(LS_KEYS.lang, detectBrowserLang()),
  );
  const dict = DICTS[lang] ?? DICTS.fr;
  const rtl = LANGS.find((l) => l.code === lang)?.rtl === true;

  useEffect(() => {
    lsSet(LS_KEYS.lang, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  }, [lang, rtl]);

  const t = useCallback<TFn>((key) => dict[key] ?? DICTS.fr[key] ?? String(key), [dict]);
  const setLang = useCallback((code: LangCode) => setLangState(code), []);

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t, rtl }), [lang, setLang, t, rtl]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n doit etre utilise dans un I18nProvider');
  return ctx;
}
