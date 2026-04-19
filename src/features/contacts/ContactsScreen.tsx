/**
 * ContactsScreen — Liste des contacts + filtre par catégorie + bouton "Ajouter".
 * Categories : Famille / Amis / Connaissances / Collegues / Utilitaires / Autre.
 */

import { useMemo, useState } from 'react';

import { Avatar } from '../../components/Avatar';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconBack, IconPlus, IconSearch } from '../../components/Icons';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getContacts } from '../../services/localDb';
import { CONTACT_CATEGORIES, type ContactCategory } from '../../types/contact';
import { AddContactSheet } from './AddContactSheet';
import { CreateGroupSheet } from './CreateGroupSheet';
import { EditContactSheet } from './EditContactSheet';
import type { Contact } from '../../types/contact';

type Filter = ContactCategory | 'all' | 'favorites';

const CATEGORY_LABELS: Record<ContactCategory, string> = {
  family: 'Famille',
  friends: 'Amis',
  acquaintances: 'Connaissances',
  colleagues: 'Collegues',
  utilities: 'Utilitaires',
  other: 'Autre',
};

const CATEGORY_EMOJIS: Record<ContactCategory, string> = {
  family: '👨‍👩‍👧‍👦',
  friends: '🤝',
  acquaintances: '👋',
  colleagues: '💼',
  utilities: '🔧',
  other: '📌',
};

export interface ContactsScreenProps {
  readonly onBack: () => void;
  readonly onOpenConversation: (contactUid: string) => void;
  readonly onOpenConvById?: (convId: string) => void;
}

export function ContactsScreen(props: ContactsScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [refresh, setRefresh] = useState(0);

  const contacts = useMemo(() => {
    let list = getContacts();
    if (filter === 'favorites') list = list.filter((c) => c.favorite);
    else if (filter !== 'all') list = list.filter((c) => c.category === filter);
    if (q) {
      const lower = q.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(lower));
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));

  }, [filter, q, refresh]);

  const filters: readonly { id: Filter; label: string; icon: string }[] = [
    { id: 'all', label: 'Tous', icon: '👥' },
    { id: 'favorites', label: 'Favoris', icon: '⭐' },
    ...CONTACT_CATEGORIES.map((c) => ({ id: c as Filter, label: CATEGORY_LABELS[c], icon: CATEGORY_EMOJIS[c] })),
  ];

  return (
    <div style={{ paddingBottom: 40, background: 'var(--cm-bg)' }}>
      <Header
        left={<IconButton label={t('back')} onClick={props.onBack}><IconBack /></IconButton>}
        right={<IconButton label="add" onClick={() => setAddOpen(true)}><IconPlus /></IconButton>}
        title="Contacts"
        hideLogo
      />

      {/* Raccourci Creer un groupe */}
      <div style={{ padding: '0 16px 12px' }}>
        <button
          type="button"
          onClick={() => setGroupOpen(true)}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 14,
            background: theme.primarySoft, color: theme.primaryDark,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
          }}
        >
          <span aria-hidden>👥</span> Creer un groupe
        </button>
      </div>

      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--cm-surface)', borderRadius: 16, padding: '10px 14px' }}>
          <IconSearch width={18} height={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search')}
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 15, fontFamily: 'inherit', color: 'var(--cm-title)' }}
          />
        </div>
      </div>

      <div className="cm-scroll-x" style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            style={{
              flexShrink: 0,
              padding: '8px 14px', borderRadius: 999,
              background: filter === f.id ? theme.primarySoft : 'var(--cm-surface)',
              color: filter === f.id ? theme.primaryDark : 'var(--cm-title)',
              border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <span aria-hidden>{f.icon}</span> {f.label}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: '0 16px', margin: 0, display: 'flex', flexDirection: 'column' }}>
        {contacts.length === 0 && (
          <li style={{ color: 'var(--cm-muted)', textAlign: 'center', padding: 40 }}>Aucun contact</li>
        )}
        {contacts.map((c) => (
          <li
            key={c.contactUid}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0', borderBottom: '1px solid var(--cm-line)',
            }}
          >
            <button
              type="button"
              onClick={() => props.onOpenConversation(c.contactUid)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                flex: 1, minWidth: 0,
                border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                padding: 0,
              }}
            >
              <Avatar name={c.name} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cm-title)' }}>
                  {c.name} {c.favorite && <span aria-label="favorite">⭐</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--cm-sub)' }}>
                  {CATEGORY_EMOJIS[c.category]} {CATEGORY_LABELS[c.category]}
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setEditing(c)}
              aria-label="Modifier"
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--cm-surface)', border: 'none',
                cursor: 'pointer', fontSize: 14, color: 'var(--cm-sub)',
              }}
            >
              ✎
            </button>
          </li>
        ))}
      </ul>

      <EditContactSheet
        open={editing !== null}
        contact={editing}
        onClose={() => setEditing(null)}
        onUpdated={() => setRefresh((r) => r + 1)}
      />

      <CreateGroupSheet
        open={groupOpen}
        onClose={() => setGroupOpen(false)}
        onCreated={(convId) => { props.onOpenConvById?.(convId); }}
      />

      <AddContactSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={() => setRefresh((r) => r + 1)}
      />
    </div>
  );
}
