/**
 * HomeScreen — Statuts + Discussions (design 87).
 */

import { useMemo, useState } from 'react';

import { Avatar } from '../../components/Avatar';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconGem, IconMenu, IconSearch, IconPlus, IconChatFilled, IconCheck } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getActiveStories, getContactById, getConversations, getLastMessage } from '../../services/localDb';
import type { Conversation } from '../../types/conversation';

type Filter = 'all' | 'unread' | 'groups' | 'favorites';

export interface HomeScreenProps {
  readonly onOpenConversation: (convId: string) => void;
  readonly onOpenPremium: () => void;
  readonly onOpenSettings: () => void;
  readonly onOpenStory: (storyId: string) => void;
  readonly onThemeTap: () => void;
  readonly onAddStory: () => void;
  readonly onStartChat: () => void;
}

function fmtDate(ms: number, t: (k: 'today' | 'yesterday') => string): string {
  const d = new Date(ms);
  const now = new Date();
  const oneDay = 86400000;
  if (now.toDateString() === d.toDateString()) return t('today');
  if (new Date(now.getTime() - oneDay).toDateString() === d.toDateString()) return t('yesterday');
  return d.toLocaleDateString(undefined, { weekday: 'long' }).toLowerCase();
}

export function HomeScreen(props: HomeScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>('all');
  const [searchQ, setSearchQ] = useState('');

  const stories = useMemo(() => getActiveStories(), []);

  const conversations = useMemo<Conversation[]>(() => {
    const all = getConversations();
    let filtered = all;
    if (filter === 'groups') filtered = all.filter((c) => c.type === 'group');
    if (filter === 'favorites') filtered = all.filter((c) => c.pinned);
    if (searchQ) {
      const q = searchQ.toLowerCase();
      filtered = filtered.filter((c) => {
        if (c.name && c.name.toLowerCase().includes(q)) return true;
        const other = c.members.find((m) => m !== user?.uid);
        if (other) {
          const contact = getContactById(other);
          if (contact?.name.toLowerCase().includes(q)) return true;
        }
        return false;
      });
    }
    return filtered.sort((a, b) => b.lastMessageAtMs - a.lastMessageAtMs);
  }, [filter, searchQ, user?.uid]);

  const filters: readonly { id: Filter; label: string }[] = [
    { id: 'all', label: t('filterAll') },
    { id: 'unread', label: t('filterUnread') },
    { id: 'groups', label: t('filterGroups') },
    { id: 'favorites', label: t('filterFavorites') },
  ];

  return (
    <div style={{ paddingBottom: 20, background: 'var(--cm-bg)' }}>
      <Header
        left={<IconButton label="premium" onClick={props.onOpenPremium}><IconGem /></IconButton>}
        right={<IconButton label="menu" onClick={props.onOpenSettings}><IconMenu /></IconButton>}
        onLogoTap={props.onThemeTap}
      />

      {/* Statuts */}
      <section style={{ padding: '4px 0 0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--cm-title)', margin: '0 16px 8px' }}>{t('stories')}</h2>
        {/* Zone scrollable qui atteint le bord de l'ecran pour ne pas masquer la derniere tuile */}
        <div className="cm-scroll-x" style={{ display: 'flex', gap: 10, padding: '0 16px 0' }}>
          {/* Tuile Ajouter */}
          <button
            type="button"
            onClick={props.onAddStory}
            style={{
              flexShrink: 0, width: 72, height: 96, borderRadius: 14,
              background: 'var(--cm-surface-2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 6, border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid var(--cm-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cm-body)' }}>
              <IconPlus width={18} height={18} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-body)', textAlign: 'center' }}>{t('addColors')}</span>
          </button>

          {stories.map((s) => {
            const owner = getContactById(s.ownerId);
            if (!owner) return null;
            const seen = user?.uid ? s.viewedByUid[user.uid] !== undefined : false;
            const parts = owner.name.split(' ');
            return (
              <div
                key={s.id}
                onClick={() => props.onOpenStory(s.id)}
                role="button"
                tabIndex={0}
                style={{ flexShrink: 0, width: 72, cursor: 'pointer', paddingBottom: 4 }}
              >
                <div
                  style={{
                    width: 72, height: 96, borderRadius: 14,
                    background: s.bg ?? theme.primarySoft,
                    position: 'relative', overflow: 'visible',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
                      padding: 2,
                      background: seen ? 'transparent' : theme.primary,
                      borderRadius: '50%',
                    }}
                  >
                    <Avatar name={owner.name} size={32} border="#FFF" />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 18, textAlign: 'center', lineHeight: 1.2,
                    color: 'var(--cm-title)', fontSize: 12, fontWeight: 700,
                    width: 72, maxWidth: 72,
                  }}
                >
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{parts[0]}</div>
                  {parts.slice(1).length > 0 && (
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {parts.slice(1).join(' ')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Discussions */}
      <section style={{ padding: '0 16px 4px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--cm-title)', margin: '0 0 8px' }}>{t('discussions')}</h2>

        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--cm-surface)', borderRadius: 16, padding: '10px 14px',
          }}
        >
          <IconSearch width={18} height={18} />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder={t('search')}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              outline: 'none', color: 'var(--cm-title)', fontSize: 15,
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div className="cm-scroll-x" style={{ display: 'flex', gap: 8, padding: '12px 0 4px' }}>
          {filters.map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                style={{
                  flexShrink: 0,
                  padding: '8px 16px', borderRadius: 999,
                  background: isActive ? theme.primarySoft : 'var(--cm-surface)',
                  color: isActive ? theme.primaryDark : 'var(--cm-title)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Liste conversations */}
      <section style={{ padding: '0 16px' }}>
        {conversations.length === 0 ? (
          <p style={{ color: 'var(--cm-muted)', textAlign: 'center', padding: 40 }}>{t('noDiscussions')}</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {conversations.map((c) => {
              const otherUid = c.members.find((m) => m !== user?.uid);
              const other = otherUid ? getContactById(otherUid) : undefined;
              const displayName = c.name ?? other?.name ?? '—';
              const lastMsg = getLastMessage(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => props.onOpenConversation(c.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%',
                      padding: '12px 0', border: 'none', background: 'transparent',
                      borderBottom: '1px solid var(--cm-line)',
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    }}
                  >
                    <Avatar name={displayName} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          fontSize: 14, fontWeight: 800, color: 'var(--cm-title)',
                        }}
                      >
                        {c.pinned && <span style={{ fontSize: 11 }} aria-hidden>📌</span>}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--cm-sub)', marginTop: 2 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lastMsg?.plaintext ?? '—'}
                        </span>
                        {lastMsg?.senderId === user?.uid && <IconCheck width={12} height={12} style={{ color: 'var(--cm-muted)' }} />}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--cm-muted)', fontWeight: 600 }}>
                      {fmtDate(c.lastMessageAtMs, (k) => t(k))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* FAB chat flottant. Positionne au-dessus de la nav bar
          (nav ~74px + marge 16px = bottom 90px) + safe-area */}
      <button
        type="button"
        aria-label="New chat"
        onClick={props.onStartChat}
        style={{
          position: 'fixed', right: 18,
          bottom: 'calc(96px + env(safe-area-inset-bottom))',
          width: 54, height: 54, borderRadius: 18,
          background: theme.primary, color: '#FFF',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          zIndex: 80,
        }}
      >
        <IconChatFilled width={24} height={24} />
      </button>
    </div>
  );
}
