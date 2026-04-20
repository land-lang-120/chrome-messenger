/**
 * TaskOptionsSheet — menu contextuel de la partie Tasks.
 *
 * Declenche par le bouton "menu" (icone hamburger) dans le header TodoScreen.
 * Ouvre les options liees aux taches (pas le menu global de l'app) :
 *  - Taches terminees (historique)
 *  - Corbeille (taches supprimees)
 *  - Filtrer par jour / semaine / mois
 *  - Marquer toutes comme terminees
 *  - Exporter mes taches
 *  - Aide tasks
 */

import { BottomSheet } from '../../components/BottomSheet';
import { IconArchive, IconFilter, IconHistory, IconTrash } from '../../components/Icons';
import { useToast } from '../../contexts/ToastContext';

export interface TaskOptionsSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onOpenHistory?: () => void;
  readonly onOpenTrash?: () => void;
}

export function TaskOptionsSheet({ open, onClose, onOpenHistory, onOpenTrash }: TaskOptionsSheetProps) {
  const toast = useToast();

  const items: { icon: React.ReactNode; label: string; sub?: string; onClick: () => void }[] = [
    {
      icon: <IconHistory />,
      label: 'Taches terminees',
      sub: 'Historique des taches completees',
      onClick: () => { onClose(); onOpenHistory?.(); },
    },
    {
      icon: <IconTrash />,
      label: 'Corbeille',
      sub: 'Taches supprimees (recuperables 30 jours)',
      onClick: () => { onClose(); onOpenTrash?.(); },
    },
    {
      icon: <IconFilter />,
      label: 'Filtres avances',
      sub: 'Par lieu, duree, priorite',
      onClick: () => { toast.show('Filtres avances a venir', 'info'); onClose(); },
    },
    {
      icon: <IconArchive />,
      label: 'Exporter mes taches',
      sub: 'Sauvegarde au format JSON',
      onClick: () => { toast.show('Export a venir', 'info'); onClose(); },
    },
  ];

  return (
    <BottomSheet open={open} onClose={onClose} title="Options Tasks">
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
