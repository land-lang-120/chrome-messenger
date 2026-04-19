/**
 * AddContactSheet — formulaire pour ajouter un contact avec catégorie obligatoire.
 */

import { useState } from 'react';

import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../contexts/ToastContext';
import { getContacts, setContacts } from '../../services/localDb';
import type { Contact, ContactCategory } from '../../types/contact';
import { useTheme } from '../../contexts/ThemeContext';

const CATEGORY_OPTIONS: readonly { id: ContactCategory; label: string; emoji: string }[] = [
  { id: 'family',        label: 'Famille',       emoji: '👨‍👩‍👧‍👦' },
  { id: 'friends',       label: 'Amis',          emoji: '🤝' },
  { id: 'acquaintances', label: 'Connaissances', emoji: '👋' },
  { id: 'colleagues',    label: 'Collegues',     emoji: '💼' },
  { id: 'utilities',     label: 'Utilitaires',   emoji: '🔧' },
  { id: 'other',         label: 'Autre',         emoji: '📌' },
];

export interface AddContactSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onAdded?: () => void;
}

export function AddContactSheet({ open, onClose, onAdded }: AddContactSheetProps) {
  const toast = useToast();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<ContactCategory>('friends');
  const [favorite, setFavorite] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function reset() {
    setName('');
    setPhone('');
    setCategory('friends');
    setFavorite(false);
    setErr(null);
  }

  function submit() {
    if (!name.trim()) { setErr('Nom requis'); return; }
    if (!phone.trim() || phone.length < 6) { setErr('Numero invalide'); return; }
    const newContact: Contact = {
      contactUid: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      category,
      favorite,
      addedAtMs: Date.now(),
    };
    setContacts([...getContacts(), newContact]);
    toast.show('Contact ajoute', 'success');
    reset();
    onClose();
    onAdded?.();
  }

  return (
    <BottomSheet open={open} onClose={() => { reset(); onClose(); }} title="Nouveau contact">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" maxLength={40} autoFocus />
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 6XX XX XX XX" />

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
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--cm-title)' }}>⭐ Ajouter aux favoris</span>
        </label>

        {err && <p style={{ color: '#FF4757', fontSize: 13, textAlign: 'center' }}>{err}</p>}

        <Button variant="primary" size="lg" fullWidth onClick={submit}>Ajouter</Button>
      </div>
    </BottomSheet>
  );
}
