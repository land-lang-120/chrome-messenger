import { BottomSheet } from '../../components/BottomSheet';
import { IconCheck } from '../../components/Icons';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { THEMES, type ThemeId } from '../../types/theme';
import { ColorPickerSlider } from './ColorPickerSlider';
import { isPro } from '../../services/premium';

export interface ThemePickerSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

const CHOOSABLE: readonly ThemeId[] = ['mint', 'blue', 'orange', 'coral', 'purple', 'lilac', 'yellow', 'charcoal'];

export function ThemePickerSheet({ open, onClose }: ThemePickerSheetProps) {
  const { t } = useI18n();
  const { themeId, setThemeId, darkMode, setDarkMode } = useTheme();

  return (
    <BottomSheet open={open} onClose={onClose} title={t('themesTitle')}>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--cm-sub)', marginBottom: 18 }}>{t('themesSub')}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {CHOOSABLE.map((id) => {
          const th = THEMES[id as Exclude<ThemeId, 'custom'>];
          const active = themeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setThemeId(id)}
              aria-label={th.name}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                padding: 6,
              }}
            >
              <div
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: th.primary,
                  border: active ? `3px solid ${th.primary}` : 'none',
                  boxShadow: active ? '0 0 0 3px var(--cm-bg), 0 0 0 5px ' + th.primary : undefined,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {active && <IconCheck width={22} height={22} style={{ color: '#FFF' }} />}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cm-title)' }}>{th.name}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 22, padding: '14px 16px', borderRadius: 16,
          background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <span aria-hidden style={{ fontSize: 20 }}>🌙</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cm-title)' }}>{t('darkMode')}</div>
          <div style={{ fontSize: 12, color: 'var(--cm-sub)' }}>{t('darkModeSub')}</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={darkMode}
          onClick={() => setDarkMode(!darkMode)}
          style={{
            width: 48, height: 28, borderRadius: 14,
            background: darkMode ? 'var(--cm-primary)' : 'var(--cm-line)',
            border: 'none', cursor: 'pointer',
            position: 'relative', transition: 'background 0.15s',
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute', top: 3,
              left: darkMode ? 23 : 3,
              width: 22, height: 22, borderRadius: '50%',
              background: '#FFF', transition: 'left 0.15s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
        </button>
      </div>

      {/* Slider couleur personnalisee (Pro) */}
      <div style={{ marginTop: 18 }}>
        <ColorPickerSlider isPro={isPro()} />
      </div>
    </BottomSheet>
  );
}
