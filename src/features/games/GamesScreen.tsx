import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconGem, IconMenu } from '../../components/Icons';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';

interface GameCard { readonly id: string; readonly name: string; readonly desc: string; readonly emoji: string; readonly social?: boolean; readonly premium?: boolean; }

const SOLO: readonly GameCard[] = [
  { id: 'snake',   name: 'Snake',   desc: 'Labyrinthes neon infinis.', emoji: '🐍' },
  { id: 'tetroid', name: 'Tetroid', desc: 'Tetris nouvelle gen.',      emoji: '🟧' },
  { id: 'block',   name: 'Block',   desc: 'Puzzle explosif.',          emoji: '🧱', premium: true },
];

const SOCIAL: readonly GameCard[] = [
  { id: 'morpion',  name: 'Morpion',       desc: 'Defie un contact.',     emoji: '⭕', social: true, premium: true },
  { id: 'rps',      name: 'Pierre Papier', desc: 'Pierre-feuille-ciseaux.', emoji: '✂️', social: true, premium: true },
  { id: 'ddl',      name: 'Devine',        desc: 'Devine le mot.',        emoji: '🔤', social: true, premium: true },
];

export interface GamesScreenProps {
  readonly onOpenPremium: () => void;
  readonly onOpenSettings: () => void;
  readonly onThemeTap: () => void;
}

export function GamesScreen(props: GamesScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();

  return (
    <div style={{ paddingBottom: 20, background: 'var(--cm-bg)' }}>
      <Header
        left={<IconButton label="premium" onClick={props.onOpenPremium}><IconGem /></IconButton>}
        right={<IconButton label="menu" onClick={props.onOpenSettings}><IconMenu /></IconButton>}
        onLogoTap={props.onThemeTap}
      />

      <Section title={t('gamesForYou')} subtitle={t('gamesForYouSub')} items={SOLO} />
      <Section title={t('gamesSocial')} subtitle={t('gamesSocialSub')} items={SOCIAL} />

      <button
        type="button"
        onClick={props.onOpenPremium}
        style={{
          margin: '12px 16px', padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          width: 'calc(100% - 44px)', borderRadius: 20,
          background: theme.primary, color: '#FFF',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontFamily: 'inherit',
        }}
      >
        <IconGem width={32} height={32} />
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{t('gamePass')}</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>{t('gamePassSub')}</div>
        </div>
        <span style={{ fontSize: 20 }}>›</span>
      </button>
    </div>
  );
}

function Section({ title, subtitle, items }: { title: string; subtitle: string; items: readonly GameCard[] }) {
  const { t } = useI18n();
  const { theme } = useTheme();
  return (
    <section style={{ padding: '8px 16px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--cm-title)', margin: 0 }}>{title}</h2>
          <p style={{ fontSize: 13, color: 'var(--cm-sub)', margin: 0 }}>{subtitle}</p>
        </div>
        <button type="button" style={{ background: 'transparent', border: 'none', color: theme.primary, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          {t('seeAll')}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {items.map((g) => (
          <article
            key={g.id}
            style={{
              padding: 14, borderRadius: 18,
              background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{g.emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--cm-title)' }}>{g.name}</div>
            <div style={{ fontSize: 12, color: 'var(--cm-sub)', marginBottom: 8 }}>{g.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: g.premium ? theme.primary : theme.primary, fontSize: 13, fontWeight: 700 }}>
              {g.premium ? <><IconGem width={14} height={14} /> {t('premium')}</> : <>{t('play')} →</>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
