/**
 * CreateGroupSheet — crée une conversation de groupe à partir d'un sous-ensemble de contacts.
 */

import { useMemo, useState } from 'react';

import { Avatar } from '../../components/Avatar';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { getContacts, getConversations, setConversations } from '../../services/localDb';
import type { Conversation } from '../../types/conversation';

export interface CreateGroupSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreated?: (convId: string) => void;
}

export function CreateGroupSheet({ open, onClose, onCreated }: CreateGroupSheetProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const toast = useToast();
  const [name, setName] = useState('');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const contacts = useMemo(() => {
    const all = getContacts();
    if (!q) return all;
    const lower = q.toLowerCase();
    return all.filter((c) => c.name.toLowerCase().includes(lower));
  }, [q]);

  function toggle(uid: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  }

  function reset() {
    setName('');
    setQ('');
    setSelected(new Set());
  }

  function create() {
    if (!user) return;
    if (!name.trim()) { toast.show('Nom du groupe requis', 'warning'); return; }
    if (selected.size < 2) { toast.show('Selectionne au moins 2 membres', 'warning'); return; }

    const conv: Conversation = {
      id: 'conv_grp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type: 'group',
      members: [user.uid, ...Array.from(selected)],
      createdAtMs: Date.now(),
      lastMessageId: null,
      lastMessageAtMs: Date.now(),
      name: name.trim(),
      admins: [user.uid],
    };
    setConversations([...getConversations(), conv]);
    toast.show('Groupe cree', 'success');
    reset();
    onClose();
    onCreated?.(conv.id);
  }

  return (
    <BottomSheet open={open} onClose={() => { reset(); onClose(); }} title="Nouveau groupe">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du groupe (ex: Lando Family)"
          maxLength={40}
          autoFocus
        />

        <div>
          <div style={{ fontSize: 11, color: 'var(--cm-sub)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
            Membres {selected.size > 0 && `(${selected.size})`}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un contact"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 12,
              background: 'var(--cm-surface-2)', border: 'none',
              color: 'var(--cm-title)', fontSize: 14, fontFamily: 'inherit', outline: 'none',
              marginBottom: 10,
            }}
          />

          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {contacts.map((c) => {
              const checked = selected.has(c.contactUid);
              return (
                <button
                  key={c.contactUid}
                  type="button"
                  onClick={() => toggle(c.contactUid)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 12,
                    background: checked ? theme.primarySoft : 'transparent',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    marginBottom: 4,
                  }}
                >
                  <Avatar name={c.name} size={36} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--cm-title)' }}>{c.name}</span>
                  <span
                    aria-hidden
                    style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: checked ? theme.primary : 'transparent',
                      border: `2px solid ${checked ? theme.primary : 'var(--cm-line)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#FFF', fontSize: 12, fontWeight: 800,
                    }}
                  >
                    {checked ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={create}>
          Creer le groupe
        </Button>
      </div>
    </BottomSheet>
  );
}
