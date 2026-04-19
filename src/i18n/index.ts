import { fr, type Dict, type DictKey } from './fr';
import { en } from './en';

export type LangCode = 'fr' | 'en' | 'es' | 'pt' | 'de' | 'it' | 'nl' | 'tr' | 'ru' | 'ar' | 'zh' | 'ja' | 'ko' | 'hi' | 'sw' | 'pl';

export interface LangMeta {
  readonly code: LangCode;
  readonly name: string;
  readonly nameFr: string;
  readonly flag: string;
  readonly rtl?: boolean;
}

export const LANGS: readonly LangMeta[] = [
  { code: 'fr', name: 'Francais',   nameFr: 'Francais',    flag: '🇫🇷' },
  { code: 'en', name: 'English',    nameFr: 'Anglais',     flag: '🇬🇧' },
  { code: 'es', name: 'Espanol',    nameFr: 'Espagnol',    flag: '🇪🇸' },
  { code: 'pt', name: 'Portugues',  nameFr: 'Portugais',   flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch',    nameFr: 'Allemand',    flag: '🇩🇪' },
  { code: 'it', name: 'Italiano',   nameFr: 'Italien',     flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', nameFr: 'Neerlandais', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkce',     nameFr: 'Turc',        flag: '🇹🇷' },
  { code: 'ru', name: 'Russkiy',    nameFr: 'Russe',       flag: '🇷🇺' },
  { code: 'ar', name: 'Arabi',      nameFr: 'Arabe',       flag: '🇸🇦', rtl: true },
  { code: 'zh', name: 'Zhongwen',   nameFr: 'Chinois',     flag: '🇨🇳' },
  { code: 'ja', name: 'Nihongo',    nameFr: 'Japonais',    flag: '🇯🇵' },
  { code: 'ko', name: 'Hangugeo',   nameFr: 'Coreen',      flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi',      nameFr: 'Hindi',       flag: '🇮🇳' },
  { code: 'sw', name: 'Kiswahili',  nameFr: 'Swahili',     flag: '🇰🇪' },
  { code: 'pl', name: 'Polski',     nameFr: 'Polonais',    flag: '🇵🇱' },
];

/** Dictionnaires par langue. Fallback sur FR si manquant. */
export const DICTS: Readonly<Record<LangCode, Dict>> = {
  fr,
  en,
  // Les langues non encore traduites pointent sur EN (meilleur que FR si user etranger)
  es: en, pt: en, de: en, it: en, nl: en, tr: en, ru: en,
  ar: en, zh: en, ja: en, ko: en, hi: en, sw: en, pl: en,
};

export type { Dict, DictKey };
