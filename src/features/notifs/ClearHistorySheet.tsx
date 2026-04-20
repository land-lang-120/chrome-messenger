/**
 * ClearHistorySheet — affichee au clic sur l'icone poubelle de NotifsScreen.
 * Propose 2 actions a valider par l'utilisateur :
 *  - Supprimer mon historique d'appels
 *  - Supprimer mon historique de taches
 */

import { BottomSheet } from '../../components/BottomSheet';
import { IconHistory } from '../../components/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { getNotifs, setNotifs } from '../../services/localDb';

export interface ClearHistorySheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCleared?: () => void;
}

export function ClearHistorySheet({ open, onClose, onCleared }: ClearHistorySheetProps) {
  const { theme } = useTheme();
  const toast = useToast();

  function clearCalls() {
    const list = getNotifs();
    const kept = list.filter((n) => n.kind !== 'call-missed');
    setNotifs(kept);
    toast.show('Historique d\'appels supprime', 'success');
    onClose();
    onCleared?.();
  }

  function clearTasks() {
    const list = getNotifs();
    const kept = list.filter((n) => n.kind !== 'task-reminder');
    setNotifs(kept);
    toast.show('Historique de taches supprime', 'success');
    onClose();
    onCleared?.();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Supprimer l'historique">
      <p style={{ fontSize: 13, color: 'var(--cm-sub)', marginBottom: 18, textAlign: 'center' }}>
        Cette action est irreversible. Choisis quel historique effacer :
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          onClick={() => {
            if (confirm('Supprimer tout l\'historique d\'appels ?')) clearCalls();
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            color: 'var(--cm-title)',
          }}
        >
          <span aria-hidden style={{ fontSize: 22 }}>📞</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Supprimer mon historique d'appels</div>
            <div style={{ fontSize: 11, color: 'var(--cm-sub)' }}>Tous les appels manques effaces</div>
          </div>
          <span aria-hidden style={{ color: theme.primary }}>›</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm('Supprimer tout l\'historique de taches ?')) clearTasks();
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            color: 'var(--cm-title)',
          }}
        >
          <span aria-hidden style={{ fontSize: 22 }}>📋</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Supprimer mon historique de taches</div>
            <div style={{ fontSize: 11, color: 'var(--cm-sub)' }}>Tous les rappels de taches effaces</div>
          </div>
          <span aria-hidden style={{ color: theme.primary }}>›</span>
        </button>

        <div
          style={{
            marginTop: 6, display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 12,
            background: 'var(--cm-surface-2)', color: 'var(--cm-sub)',
            fontSize: 11,
          }}
        >
          <IconHistory width={14} height={14} />
          Les notifications d'evenements et de systeme ne seront pas touchees.
        </div>
      </div>
    </BottomSheet>
  );
}
