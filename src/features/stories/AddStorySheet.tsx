/**
 * AddStorySheet — bottom sheet pour publier un nouveau statut couleur.
 * MVP: couleur + texte. v1.1: photos/videos.
 */

import { useState } from 'react';

import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { LIMITS } from '../../config';
import { getStories, setStories } from '../../services/localDb';
import type { Story } from '../../types/story';

const COLORS: readonly string[] = ['#FFE8A0', '#C8D9FF', '#FFC6D3', '#D5F8EB', '#E8D8FF', '#FFD4B0', '#CFE9FF', '#F5E6B8'];

export interface AddStorySheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onPublished?: () => void;
}

export function AddStorySheet({ open, onClose, onPublished }: AddStorySheetProps) {
  const { user } = useAuth();
  const toast = useToast();
  const [bg, setBg] = useState<string>(COLORS[0] ?? '#FFE8A0');
  const [text, setText] = useState('');

  function publish() {
    if (!user) return;
    const story: Story = {
      id: 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      ownerId: user.uid,
      createdAtMs: Date.now(),
      expiresAtMs: Date.now() + LIMITS.STORY_DURATION_MS,
      kind: 'color',
      bg,
      text: text.trim() || null,
      mediaUrl: null,
      viewedByUid: {},
      allowedCategories: null,
    };
    setStories([...getStories(), story]);
    toast.show('Statut publie !', 'success');
    setText('');
    setBg(COLORS[0] ?? '#FFE8A0');
    onClose();
    onPublished?.();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Nouveau statut">
      {/* Preview */}
      <div
        style={{
          height: 180, borderRadius: 18, marginBottom: 18,
          background: bg, color: '#111',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, textAlign: 'center', fontSize: 18, fontWeight: 700,
        }}
      >
        {text.trim() || 'Ton statut…'}
      </div>

      {/* Color picker */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14, justifyContent: 'center' }}>
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setBg(c)}
            aria-label={`Color ${c}`}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: c,
              border: bg === c ? '3px solid var(--cm-title)' : '2px solid var(--cm-line)',
              cursor: 'pointer', padding: 0,
            }}
          />
        ))}
      </div>

      {/* Texte */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ecris quelque chose…"
        maxLength={140}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 14,
          background: 'var(--cm-surface-2)', border: 'none',
          fontSize: 15, fontFamily: 'inherit', outline: 'none',
          color: 'var(--cm-title)', resize: 'none', minHeight: 70,
          marginBottom: 14,
        }}
      />
      <div style={{ fontSize: 11, color: 'var(--cm-muted)', textAlign: 'right', marginBottom: 14 }}>
        {text.length}/140
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={publish}>
        Publier
      </Button>
    </BottomSheet>
  );
}
