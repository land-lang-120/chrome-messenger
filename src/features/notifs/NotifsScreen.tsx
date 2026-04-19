import { useMemo, useState } from 'react';

import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconClose, IconMenu } from '../../components/Icons';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getNotifs, setNotifs } from '../../services/localDb';
import type { Notification, NotificationKind } from '../../types/notification';

type Filter = 'all' | 'call-missed' | 'task-reminder' | 'event-reminder';

function matchFilter(kind: NotificationKind, f: Filter): boolean {
  if (f === 'all') return true;
  return kind === f;
}

export interface NotifsScreenProps {
  readonly onThemeTap: () => void;
  readonly onOpenSettings: () => void;
}

export function NotifsScreen(props: NotifsScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const [items, setItems] = useState<Notification[]>(() => getNotifs());

  const filtered = useMemo(() => items.filter((n) => matchFilter(n.kind, filter)), [items, filter]);

  function clearAll() {
    setNotifs([]);
    setItems([]);
  }

  const pills: readonly { id: Filter; label: string }[] = [
    { id: 'all', label: t('notifAll') },
    { id: 'call-missed', label: t('notifCalls') },
    { id: 'task-reminder', label: t('notifTasks') },
    { id: 'event-reminder', label: t('notifEvents') },
  ];

  return (
    <div style={{ paddingBottom: 20, background: 'var(--cm-bg)' }}>
      <Header
        left={<IconButton label="clear" onClick={clearAll}><IconClose /></IconButton>}
        right={<IconButton label="menu" onClick={props.onOpenSettings}><IconMenu /></IconButton>}
        onLogoTap={props.onThemeTap}
      />

      <section style={{ padding: '0 16px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--cm-title)' }}>{t('notifications')}</h2>
        <div className="cm-scroll-x" style={{ display: 'flex', gap: 8, padding: '12px 0' }}>
          {pills.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setFilter(p.id)}
              style={{
                flexShrink: 0,
                padding: '8px 16px', borderRadius: 999,
                background: filter === p.id ? theme.primarySoft : 'var(--cm-surface)',
                color: filter === p.id ? theme.primaryDark : 'var(--cm-title)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--cm-title)', marginTop: 14, marginBottom: 10 }}>{t('today')}</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 && <li style={{ color: 'var(--cm-muted)', textAlign: 'center', padding: 40 }}>—</li>}
          {filtered.map((n) => (
            <li
              key={n.id}
              style={{
                padding: 14, borderRadius: 16,
                background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--cm-title)' }}>{n.title}</div>
              <div style={{ fontSize: 13, color: 'var(--cm-sub)' }}>{n.body}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
