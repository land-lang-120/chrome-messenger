import { useState } from 'react';

import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconBack, IconCheck } from '../../components/Icons';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LANGS } from '../../i18n';

export interface LanguageScreenProps {
  readonly onBack: () => void;
}

export function LanguageScreen({ onBack }: LanguageScreenProps) {
  const { lang, setLang, t } = useI18n();
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const q = search.toLowerCase();
  const filtered = LANGS.filter(
    (l) =>
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.nameFr.toLowerCase().includes(q) ||
      l.code.includes(q),
  );

  return (
    <div style={{ paddingBottom: 40, background: 'var(--cm-bg)' }}>
      <Header left={<IconButton label={t('back')} onClick={onBack}><IconBack /></IconButton>} title={t('language')} hideLogo />

      <div style={{ padding: '0 16px 12px' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search')}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 14,
            background: 'var(--cm-surface-2)', border: 'none',
            color: 'var(--cm-title)', fontSize: 14, fontFamily: 'inherit', outline: 'none',
          }}
        />
      </div>

      <ul style={{ listStyle: 'none', padding: '0 16px', margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map((l) => {
          const active = l.code === lang;
          return (
            <li key={l.code}>
              <button
                type="button"
                onClick={() => setLang(l.code)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 14,
                  background: active ? theme.primarySoft : 'var(--cm-surface)',
                  border: `1px solid ${active ? theme.primary : 'var(--cm-line)'}`,
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                }}
                aria-current={active ? 'true' : undefined}
              >
                <span style={{ fontSize: 22 }} aria-hidden>{l.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: active ? theme.primaryDark : 'var(--cm-title)' }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--cm-sub)' }}>{l.nameFr}</div>
                </div>
                {active && <IconCheck width={18} height={18} style={{ color: theme.primary }} />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
