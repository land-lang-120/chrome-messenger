/**
 * EventsScreen — Liste des événements créés + bouton "+" pour en créer un nouveau.
 * Affiche QR code + destinataires pour chaque événement.
 */

import { useMemo, useState } from 'react';

import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconBack, IconPlus } from '../../components/Icons';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getEvents, removeEvent, resolveRecipients } from '../../services/events';
import { generateQrSvg } from './qr';
import { CreateEventSheet } from './CreateEventSheet';
import type { AppEvent, EventKind } from '../../types/event';

const KIND_META: Record<EventKind, { emoji: string; label: string }> = {
  birthday: { emoji: '🎂', label: 'Anniversaire' },
  funeral:  { emoji: '🕊️', label: 'Deuil' },
  wedding:  { emoji: '💍', label: 'Mariage' },
  meeting:  { emoji: '👥', label: 'Reunion' },
  party:    { emoji: '🎉', label: 'Fete' },
  other:    { emoji: '📌', label: 'Autre' },
};

function fmtDateFull(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export interface EventsScreenProps {
  readonly onBack: () => void;
}

export function EventsScreen(props: EventsScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [createOpen, setCreateOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const events = useMemo<AppEvent[]>(() => {
    return [...getEvents()].sort((a, b) => b.dateMs - a.dateMs);

  }, [refresh]);

  function onDelete(id: string) {
    if (confirm('Supprimer cet evenement ?')) {
      removeEvent(id);
      setRefresh((r) => r + 1);
    }
  }

  return (
    <div style={{ paddingBottom: 40, background: 'var(--cm-bg)' }}>
      <Header
        left={<IconButton label={t('back')} onClick={props.onBack}><IconBack /></IconButton>}
        right={<IconButton label="create" onClick={() => setCreateOpen(true)}><IconPlus /></IconButton>}
        title="Evenements"
        hideLogo
      />

      {events.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }} aria-hidden>🎉</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--cm-title)' }}>Aucun evenement</h2>
          <p style={{ fontSize: 14, color: 'var(--cm-sub)', marginTop: 6 }}>
            Cree ton 1er evenement pour inviter tes contacts (anniversaire, mariage, deuil, reunion…)
          </p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            style={{
              marginTop: 16, padding: '12px 24px', borderRadius: 14,
              background: theme.primary, color: '#FFF',
              border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            <IconPlus width={16} height={16} /> Creer un evenement
          </button>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: '0 16px', margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {events.map((ev) => {
            const meta = KIND_META[ev.kind];
            const recipientCount = resolveRecipients(ev).length;
            const qrSvg = generateQrSvg(ev.qrSeed, { size: 96, fg: theme.primaryDark });
            return (
              <li
                key={ev.id}
                style={{
                  padding: 16, borderRadius: 18,
                  background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
                }}
              >
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: theme.primary, fontWeight: 700, marginBottom: 4 }}>
                      {meta.emoji} {meta.label}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--cm-title)', margin: 0 }}>{ev.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--cm-sub)', marginTop: 4 }}>📅 {fmtDateFull(ev.dateMs)}</p>
                    {ev.location && (
                      <p style={{ fontSize: 12, color: 'var(--cm-sub)', marginTop: 2 }}>📍 {ev.location.label}</p>
                    )}
                    <p style={{ fontSize: 12, color: 'var(--cm-sub)', marginTop: 2 }}>👥 {recipientCount} destinataire{recipientCount > 1 ? 's' : ''}</p>
                  </div>
                  <div
                    style={{ flexShrink: 0, width: 96, height: 96, borderRadius: 8, overflow: 'hidden' }}
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                </div>

                {ev.message && (
                  <p style={{ fontSize: 13, color: 'var(--cm-body)', marginTop: 10, fontStyle: 'italic' }}>"{ev.message}"</p>
                )}

                <button
                  type="button"
                  onClick={() => onDelete(ev.id)}
                  style={{
                    marginTop: 10, padding: '6px 12px', borderRadius: 10,
                    background: 'transparent', border: '1px solid #FF4757',
                    color: '#FF4757', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                  }}
                >
                  Supprimer
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <CreateEventSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => setRefresh((r) => r + 1)}
      />
    </div>
  );
}
