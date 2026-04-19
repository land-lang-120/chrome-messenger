/**
 * StoryViewer — plein écran style WhatsApp/Instagram.
 *
 * Convention (WhatsApp-like) :
 * - Chaque OWNER a son groupe de stories (1 utilisateur = 1 session de visionnage)
 * - Les progress bars en haut = nombre d'ELEMENTS DE CE OWNER (pas total global)
 * - On passe au owner suivant quand on a fini ses stories
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Avatar } from '../../components/Avatar';
import { IconButton } from '../../components/IconButton';
import { IconClose } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { getActiveStories, getContactById, setStories, getStories } from '../../services/localDb';
import type { Story } from '../../types/story';

const STORY_DURATION_MS = 5000; // 5s par element

export interface StoryViewerProps {
  readonly initialStoryId: string;
  readonly onClose: () => void;
}

export function StoryViewer({ initialStoryId, onClose }: StoryViewerProps) {
  const { user } = useAuth();

  // Regroupe les stories actives par propriétaire, triées par ancienneté
  const grouped = useMemo(() => {
    const map = new Map<string, Story[]>();
    getActiveStories().forEach((s) => {
      const arr = map.get(s.ownerId) ?? [];
      arr.push(s);
      map.set(s.ownerId, arr);
    });
    const groups: { ownerId: string; items: Story[] }[] = [];
    map.forEach((items, ownerId) => {
      groups.push({ ownerId, items: [...items].sort((a, b) => a.createdAtMs - b.createdAtMs) });
    });
    return groups;
  }, []);

  // Position initiale dans le grouping
  const initialGroupIdx = Math.max(
    0,
    grouped.findIndex((g) => g.items.some((s) => s.id === initialStoryId)),
  );
  const initialItemIdx = Math.max(
    0,
    (grouped[initialGroupIdx]?.items ?? []).findIndex((s) => s.id === initialStoryId),
  );

  const [groupIdx, setGroupIdx] = useState(initialGroupIdx);
  const [itemIdx, setItemIdx] = useState(initialItemIdx);
  const currentGroup = grouped[groupIdx];
  const items = currentGroup?.items ?? [];
  const current: Story | undefined = items[itemIdx];

  // Pour compat : alias pour la story courante (utile dans les effets)
  const stories = items;
  const idx = itemIdx;
  const startIdx = initialItemIdx;
  void startIdx;
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedRef = useRef<boolean>(false);

  const owner = current ? getContactById(current.ownerId) : undefined;

  const goNext = useCallback(() => {
    // D'abord dans les elements du owner courant
    if (itemIdx < items.length - 1) {
      setItemIdx(itemIdx + 1);
      setProgress(0);
      startTimeRef.current = Date.now();
      return;
    }
    // Sinon on passe au owner suivant
    if (groupIdx < grouped.length - 1) {
      setGroupIdx(groupIdx + 1);
      setItemIdx(0);
      setProgress(0);
      startTimeRef.current = Date.now();
      return;
    }
    onClose();
  }, [itemIdx, items.length, groupIdx, grouped.length, onClose]);

  const goPrev = useCallback(() => {
    if (itemIdx > 0) {
      setItemIdx(itemIdx - 1);
      setProgress(0);
      startTimeRef.current = Date.now();
      return;
    }
    if (groupIdx > 0) {
      setGroupIdx(groupIdx - 1);
      const prev = grouped[groupIdx - 1];
      setItemIdx(prev ? prev.items.length - 1 : 0);
      setProgress(0);
      startTimeRef.current = Date.now();
    }
  }, [itemIdx, groupIdx, grouped]);

  // Mark as viewed
  useEffect(() => {
    if (!current || !user) return;
    const all = getStories();
    const patched = all.map((s) =>
      s.id === current.id && s.viewedByUid[user.uid] === undefined
        ? { ...s, viewedByUid: { ...s.viewedByUid, [user.uid]: Date.now() } }
        : s,
    );
    setStories(patched);
  }, [current, user]);

  // Progress animation — un element = 5 secondes
  useEffect(() => {
    startTimeRef.current = Date.now();
    const tick = () => {
      if (pausedRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(100, (elapsed / STORY_DURATION_MS) * 100);
      setProgress(p);
      if (p >= 100) goNext();
      else rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [itemIdx, groupIdx, goNext]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, goNext, goPrev]);

  if (!current || !owner) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, background: '#000', color: '#FFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}
      >
        Aucun statut
        <button onClick={onClose} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Story viewer"
      style={{
        position: 'fixed', inset: 0, background: current.bg ?? '#000',
        color: current.bg ? '#111' : '#FFF',
        display: 'flex', flexDirection: 'column', zIndex: 1000,
      }}
      onMouseDown={() => { pausedRef.current = true; }}
      onMouseUp={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
    >
      {/* Progress bars */}
      <div style={{ display: 'flex', gap: 4, padding: '10px 12px 0' }}>
        {stories.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 3, borderRadius: 2,
              background: 'rgba(255,255,255,0.3)', overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: i < idx ? '100%' : i === idx ? `${progress}%` : '0%',
                background: '#FFF', transition: 'width 80ms linear',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px' }}>
        <Avatar name={owner.name} size={36} border="#FFF" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>{owner.name}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>
            Il y a {Math.floor((Date.now() - current.createdAtMs) / 3600000)}h
          </div>
        </div>
        <IconButton label="close" onClick={onClose}><IconClose /></IconButton>
      </div>

      {/* Contenu */}
      <div
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 32, fontSize: 28, fontWeight: 800, textAlign: 'center',
        }}
      >
        {current.text ?? '—'}
      </div>

      {/* Zones de tap pour prev/next */}
      <button
        type="button"
        aria-label="prev"
        onClick={goPrev}
        style={{
          position: 'absolute', left: 0, top: 60, bottom: 0, width: '30%',
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}
      />
      <button
        type="button"
        aria-label="next"
        onClick={goNext}
        style={{
          position: 'absolute', right: 0, top: 60, bottom: 0, width: '30%',
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}
      />
    </div>
  );
}
