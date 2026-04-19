/**
 * CreateEventSheet — formulaire pour créer un évènement.
 * Fournit : type, titre, message, date/heure, lieu, photo URL, destinataires par catégorie.
 */

import { useState } from 'react';

import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { addEvent } from '../../services/events';
import { CONTACT_CATEGORIES, type ContactCategory } from '../../types/contact';
import type { AppEvent, EventKind } from '../../types/event';

const KIND_OPTIONS: readonly { id: EventKind; label: string; emoji: string }[] = [
  { id: 'birthday', label: 'Anniversaire', emoji: '🎂' },
  { id: 'funeral',  label: 'Deuil',        emoji: '🕊️' },
  { id: 'wedding',  label: 'Mariage',      emoji: '💍' },
  { id: 'meeting',  label: 'Reunion',      emoji: '👥' },
  { id: 'party',    label: 'Fete',         emoji: '🎉' },
  { id: 'other',    label: 'Autre',        emoji: '📌' },
];

const CAT_LABELS: Record<ContactCategory, { emoji: string; label: string }> = {
  family:        { emoji: '👨‍👩‍👧‍👦', label: 'Famille' },
  friends:       { emoji: '🤝',            label: 'Amis' },
  acquaintances: { emoji: '👋',            label: 'Connaissances' },
  colleagues:    { emoji: '💼',            label: 'Collegues' },
  utilities:     { emoji: '🔧',            label: 'Utilitaires' },
  other:         { emoji: '📌',            label: 'Autre' },
};

export interface CreateEventSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreated?: () => void;
}

export function CreateEventSheet({ open, onClose, onCreated }: CreateEventSheetProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const toast = useToast();

  const [kind, setKind] = useState<EventKind>('birthday');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState(''); // YYYY-MM-DD
  const [time, setTime] = useState(''); // HH:mm
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedCats, setSelectedCats] = useState<Set<ContactCategory>>(new Set(['family', 'friends']));
  const [sendToAll, setSendToAll] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function reset() {
    setKind('birthday'); setTitle(''); setMessage('');
    setDate(''); setTime(''); setLocation(''); setPhotoUrl('');
    setSelectedCats(new Set(['family', 'friends']));
    setSendToAll(false);
    setErr(null);
  }

  function toggleCat(c: ContactCategory) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function submit() {
    if (!user) return;
    if (!title.trim()) { setErr('Titre requis'); return; }
    if (!date) { setErr('Date requise'); return; }
    const dateMs = new Date(`${date}T${time || '12:00'}:00`).getTime();
    if (isNaN(dateMs) || dateMs < Date.now() - 60000) { setErr('Date doit etre dans le futur'); return; }
    const cats = sendToAll ? CONTACT_CATEGORIES : Array.from(selectedCats);
    if (cats.length === 0) { setErr('Choisis au moins une categorie'); return; }

    const ev: AppEvent = {
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      ownerId: user.uid,
      kind,
      title: title.trim(),
      message: message.trim(),
      photoUrl: photoUrl.trim() || null,
      dateMs,
      location: location.trim() ? { label: location.trim(), lat: null, lng: null } : null,
      recipients: { categories: cats, uids: null },
      qrSeed: `${user.uid}:${Date.now()}:${Math.random()}`,
      createdAtMs: Date.now(),
    };
    addEvent(ev);
    toast.show('Evenement cree et envoye aux destinataires', 'success');
    reset();
    onClose();
    onCreated?.();
  }

  return (
    <BottomSheet open={open} onClose={() => { reset(); onClose(); }} title="Nouvel evenement">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Type */}
        <div>
          <Label>Type</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {KIND_OPTIONS.map((k) => {
              const active = kind === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  style={{
                    padding: 10, borderRadius: 12,
                    background: active ? theme.primarySoft : 'var(--cm-surface)',
                    border: active ? `2px solid ${theme.primary}` : '1px solid var(--cm-line)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}
                >
                  <span style={{ fontSize: 20 }} aria-hidden>{k.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: active ? theme.primaryDark : 'var(--cm-title)' }}>{k.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre (ex: Anniversaire Morgan)" maxLength={60} />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message d'invitation…"
          maxLength={500}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 14,
            background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
            fontSize: 15, fontFamily: 'inherit', outline: 'none',
            color: 'var(--cm-title)', resize: 'none', minHeight: 70,
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>

        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lieu (ex: Douala)" />
        <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="URL photo (optionnel)" />

        {/* Destinataires */}
        <div>
          <Label>Destinataires</Label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'var(--cm-surface)', cursor: 'pointer', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={sendToAll}
              onChange={(e) => setSendToAll(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: theme.primary }}
            />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--cm-title)' }}>👥 Tout le monde</span>
          </label>
          {!sendToAll && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {CONTACT_CATEGORIES.map((c) => {
                const active = selectedCats.has(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCat(c)}
                    style={{
                      padding: '10px 12px', borderRadius: 12,
                      background: active ? theme.primarySoft : 'var(--cm-surface)',
                      border: active ? `2px solid ${theme.primary}` : '1px solid var(--cm-line)',
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <span aria-hidden>{CAT_LABELS[c].emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: active ? theme.primaryDark : 'var(--cm-title)' }}>{CAT_LABELS[c].label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {err && <p style={{ color: '#FF4757', fontSize: 13, textAlign: 'center' }}>{err}</p>}

        <Button variant="primary" size="lg" fullWidth onClick={submit}>Creer et envoyer</Button>
      </div>
    </BottomSheet>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: 'var(--cm-sub)', fontWeight: 700, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>{children}</div>;
}
