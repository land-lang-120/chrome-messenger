/**
 * DndScreen — configuration "Ne pas déranger" (Pro).
 * Plage horaire + jours + option bouton urgence.
 */

import { useEffect, useState } from 'react';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconBack, IconGem } from '../../components/Icons';
import { Input } from '../../components/Input';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { getDnd, setDnd, type DndConfig } from '../../services/dnd';

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export interface DndScreenProps {
  readonly onBack: () => void;
  readonly isPro?: boolean;
}

export function DndScreen({ onBack, isPro = false }: DndScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const toast = useToast();

  const [cfg, setCfg] = useState<DndConfig>(() => getDnd());

  useEffect(() => { setCfg(getDnd()); }, []);

  function save() {
    setDnd(cfg);
    toast.show(cfg.enabled ? 'Ne pas deranger active' : 'Ne pas deranger desactive', 'success');
    onBack();
  }

  function toggleDay(d: number) {
    const set = new Set(cfg.days);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    setCfg({ ...cfg, days: Array.from(set).sort() });
  }

  return (
    <div style={{ paddingBottom: 40, background: 'var(--cm-bg)', minHeight: '100vh' }}>
      <Header
        left={<IconButton label={t('back')} onClick={onBack}><IconBack /></IconButton>}
        title="Ne pas deranger"
        hideLogo
      />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!isPro && (
          <div
            style={{
              padding: 16, borderRadius: 18,
              background: theme.primarySoft, color: theme.primaryDark,
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <IconGem width={24} height={24} />
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>
              Fonctionnalite Pro — active toute la puissance de Chrome Messenger
            </div>
          </div>
        )}

        <div style={{ padding: 16, borderRadius: 18, background: 'var(--cm-surface)', border: '1px solid var(--cm-line)' }}>
          <p style={{ fontSize: 13, color: 'var(--cm-sub)', marginBottom: 14 }}>
            Bloque les messages et appels entrants pendant une plage horaire. Les expediteurs voient que tu n'es pas disponible.
          </p>

          {/* Toggle principal */}
          <Row label="Activer Ne pas deranger" value={cfg.enabled} onChange={(v) => setCfg({ ...cfg, enabled: v })} theme={theme} />

          {/* Horaires */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            <div>
              <Label>De</Label>
              <Input type="time" value={cfg.startTime} onChange={(e) => setCfg({ ...cfg, startTime: e.target.value })} />
            </div>
            <div>
              <Label>A</Label>
              <Input type="time" value={cfg.endTime} onChange={(e) => setCfg({ ...cfg, endTime: e.target.value })} />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <Label>Jours actifs</Label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {DAYS_FR.map((d, i) => {
                const active = cfg.days.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 10,
                      background: active ? theme.primary : 'var(--cm-surface-2)',
                      color: active ? '#FFF' : 'var(--cm-sub)',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bouton urgence */}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--cm-line)' }}>
            <Row
              label="Autoriser Message urgent"
              value={cfg.allowUrgent}
              onChange={(v) => setCfg({ ...cfg, allowUrgent: v })}
              theme={theme}
            />
            <p style={{ fontSize: 12, color: 'var(--cm-muted)', marginTop: 8, lineHeight: 1.4 }}>
              Tes contacts pourront envoyer UNE seule notification urgente / 24h pour attirer ton attention sans delivrer leur message.
            </p>
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={save}>Enregistrer</Button>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: 'var(--cm-sub)', fontWeight: 700, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>
      {children}
    </div>
  );
}

function Row({ label, value, onChange, theme }: { label: string; value: boolean; onChange: (v: boolean) => void; theme: { primary: string } }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
      }}
    >
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--cm-title)' }}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 26, borderRadius: 13,
          background: value ? theme.primary : 'var(--cm-line)',
          border: 'none', cursor: 'pointer',
          position: 'relative', transition: 'background 0.15s',
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute', top: 3,
            left: value ? 21 : 3,
            width: 20, height: 20, borderRadius: '50%',
            background: '#FFF',
            transition: 'left 0.15s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  );
}
