/**
 * EditContactSheet — édition d'un contact existant (nom, catégorie, favori) + suppression.
 */

import { useEffect, useState } from 'react';

import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { getContacts, setContacts } from '../../services/localDb';
import type { Contact, ContactCategory } from '../../types/contact';

const CATEGORY_OPTIONS: readonly { id: ContactCategory; label: string; emoji: string }[] = [
  { id: 'family',        label: 'Famille',       emoji: '👨‍👩‍👧‍👦' },
  { id: 'friends',       label: 'Amis',          emoji: '🤝' },
  { id: 'acquaintances', label: 'Connaissances', emoji: '👋' },
  { id: 'colleagues',    label: 'Collegues',     emoji: '💼' },
  { id: 'utilities',     label: 'Utilitaires',   emoji: '🔧' },
  { id: 'other',         label: 'Autre',         emoji: '📌' },
];

export interface EditContactSheetProps {
  readonly open: boolean;
  readonly contact: Contact | null;
  readonly onClose: () => void;
  readonly onUpdated?: () => void;
}

export function EditContactSheet({ open, contact, onClose, onUpdated }: EditContactSheetProps) {
  const toast = useToast();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ContactCategory>('friends');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setCategory(contact.category);
      setFavorite(contact.favorite);
    }
  }, [contact]);

  if (!contact) return null;

  function save() {
    if (!contact) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    const patched = getContacts().map((c) =>
      c.contactUid === contact.contactUid ? { ...c, name: trimmed, category, favorite } : c,
    );
    setContacts(patched);
    toast.show('Contact mis a jour', 'success');
    onClose();
    onUpdated?.();
  }

  function remove() {
    if (!contact) return;
    if (!confirm(`Supprimer ${contact.name} ?`)) return;
    const filtered = getContacts().filter((c) => c.contactUid !== contact.contactUid);
    setContacts(filtered);
    toast.show('Contact supprime', 'info');
    onClose();
    onUpdated?.();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Modifier le contact">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" maxLength={40} autoFocus />

        <div>
          <div style={{ fontSize: 12, color: 'var(--cm-sub)', fontWeight: 700, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Categorie</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {CATEGORY_OPTIONS.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  style={{
                    padding: '10px 6px', borderRadius: 12,
                    background: active ? theme.primarySoft : 'var(--cm-surface)',
                    border: active ? `2px solid ${theme.primary}` : '1px solid var(--cm-line)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}
                >
                  <span style={{ fontSize: 22 }} aria-hidden>{c.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: active ? theme.primaryDark : 'var(--cm-title)' }}>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'var(--cm-surface)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
            style={{ width: 20, height: 20, accentColor: theme.primary }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--cm-title)' }}>⭐ Favori</span>
        </label>

        <Button variant="primary" size="lg" fullWidth onClick={save}>Enregistrer</Button>

        <button
          type="button"
          onClick={remove}
          style={{
            padding: 12, borderRadius: 14,
            background: 'transparent', border: '1px solid #FF4757',
            color: '#FF4757', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
          }}
        >
          Supprimer ce contact
        </button>
      </div>
    </BottomSheet>
  );
}
