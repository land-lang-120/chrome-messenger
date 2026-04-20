/**
 * NotifsOptionsSheet — menu contextuel de la partie Notifications.
 *
 * Declenche par le bouton "menu" dans le header NotifsScreen.
 * Options liees aux notifications (pas le menu global) :
 *  - Marquer toutes comme lues
 *  - Activer/desactiver les sons
 *  - Heures silencieuses (DND)
 *  - Parametres de notifications (types a recevoir)
 *  - Archiver toutes
 */

import { BottomSheet } from '../../components/BottomSheet';
import { IconArchive, IconFilter, IconHistory, IconLock } from '../../components/Icons';
import { useToast } from '../../contexts/ToastContext';
import { getNotifs, setNotifs } from '../../services/localDb';

export interface NotifsOptionsSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onOpenDnd?: () => void;
  readonly onRefresh?: () => void;
}

export function NotifsOptionsSheet({ open, onClose, onOpenDnd, onRefresh }: NotifsOptionsSheetProps) {
  const toast = useToast();

  function markAllRead() {
    const list = getNotifs();
    setNotifs(list.map((n) => ({ ...n, read: true })));
    toast.show('Toutes marquees comme lues', 'success');
    onClose();
    onRefresh?.();
  }

  function archiveAll() {
    // Pour v1 : on considere archiver = supprimer de la vue (pas vraiment archiver)
    toast.show('Archive a venir (v1.1)', 'info');
    onClose();
  }

  const items: { icon: React.ReactNode; label: string; sub?: string; onClick: () => void }[] = [
    {
      icon: <IconHistory />,
      label: 'Marquer toutes comme lues',
      onClick: markAllRead,
    },
    {
      icon: <IconLock />,
      label: 'Ne pas deranger',
      sub: 'Heures silencieuses (Pro)',
      onClick: () => { onClose(); onOpenDnd?.(); },
    },
    {
      icon: <IconFilter />,
      label: 'Types de notifications',
      sub: 'Messages, appels, taches, evenements',
      onClick: () => { toast.show('Reglages par type a venir', 'info'); onClose(); },
    },
    {
      icon: <IconArchive />,
      label: 'Archiver toutes',
      onClick: archiveAll,
    },
  ];

  return (
    <BottomSheet open={open} onClose={onClose} title="Options Notifications">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it) => (
          <button
            key={it.label}
            type="button"
            onClick={it.onClick}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%', padding: '14px 14px', borderRadius: 14,
              background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              color: 'var(--cm-title)',
            }}
          >
            <span style={{ color: 'var(--cm-primary)', display: 'inline-flex' }}>{it.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{it.label}</div>
              {it.sub && <div style={{ fontSize: 12, color: 'var(--cm-sub)' }}>{it.sub}</div>}
            </div>
            <span aria-hidden style={{ color: 'var(--cm-muted)' }}>›</span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
