import { useState } from 'react';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconBack, IconCheck, IconGem } from '../../components/Icons';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';

interface Plan {
  readonly id: 'free' | 'plus' | 'pro' | 'yearly';
  readonly name: string;
  readonly price: number;
  readonly period: string;
  readonly features: readonly string[];
  readonly highlight?: boolean;
}

const PLANS: readonly Plan[] = [
  { id: 'free',   name: 'Free',   price: 0,     period: '',       features: ['3 themes de base','Chats illimites','Statuts illimites','Sauvegarde cloud','Quelques jeux solo'] },
  { id: 'plus',   name: 'Plus',   price: 2.99,  period: '/mois',  highlight: true, features: ['Les 8 themes + mode sombre','Statuts illimites + Sauvegarde cloud','1 jeu solo premium + 1 jeu social','Notifications pour les taches'] },
  { id: 'pro',    name: 'Pro',    price: 6.99,  period: '/mois',  features: ['Tout dans Plus','Tous les jeux solo + sociaux','Palette couleur personnalisee','Stickers cameleon premium','Notifications taches + rappels','Gestion d\'evenements (QR, J-1 & J)'] },
  { id: 'yearly', name: 'Yearly', price: 59.99, period: '/an',    features: ['Tout dans Pro','2 mois offerts','Badge Chrome Pro','Acces anticipe aux nouveautes'] },
];

export interface PremiumScreenProps {
  readonly onBack: () => void;
  readonly onThemeTap: () => void;
}

export function PremiumScreen(props: PremiumScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const toast = useToast();
  const [selected, setSelected] = useState<Plan['id']>('plus');

  return (
    <div style={{ paddingBottom: 40, background: 'var(--cm-bg)' }}>
      <Header left={<IconButton label={t('back')} onClick={props.onBack}><IconBack /></IconButton>} onLogoTap={props.onThemeTap} />

      <section style={{ padding: '8px 16px 24px', textAlign: 'center' }}>
        <IconGem width={56} height={56} style={{ color: theme.primary, margin: '0 auto' }} />
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--cm-title)', margin: '12px 0 6px' }}>{t('premium')}</h1>
        <p style={{ color: 'var(--cm-sub)', fontSize: 14 }}>Debloque les themes, les jeux et bien plus.</p>
      </section>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PLANS.map((p) => {
          const active = selected === p.id;
          return (
            <article
              key={p.id}
              onClick={() => setSelected(p.id)}
              role="button"
              tabIndex={0}
              style={{
                padding: 18, borderRadius: 18,
                background: active ? theme.primarySoft : 'var(--cm-surface)',
                border: `2px solid ${active ? theme.primary : 'var(--cm-line)'}`,
                cursor: 'pointer', position: 'relative',
              }}
            >
              {p.highlight && (
                <span
                  style={{
                    position: 'absolute', top: -10, right: 16,
                    padding: '4px 10px', borderRadius: 999,
                    background: theme.primary, color: '#FFF',
                    fontSize: 11, fontWeight: 800,
                  }}
                >
                  POPULAIRE
                </span>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--cm-title)' }}>{p.name}</h2>
                <div style={{ fontSize: 22, fontWeight: 800, color: active ? theme.primaryDark : 'var(--cm-title)' }}>
                  {p.price === 0 ? 'Gratuit' : `${p.price}€`}<span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cm-sub)' }}>{p.period}</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--cm-body)' }}>
                    <IconCheck width={16} height={16} style={{ color: theme.primary, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => toast.show('Paiement a venir (Stripe / In-app purchases)', 'info')}
        >
          {selected === 'free' ? t('currentPlan') : t('subscribe')}
        </Button>
      </div>
    </div>
  );
}
