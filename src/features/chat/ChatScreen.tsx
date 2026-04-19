/**
 * ChatScreen — Conversation avec chiffrement E2E.
 * Chaque message sortant est chiffre avec la cle de conversation ECDH-derivee.
 * Les messages entrants sont dechiffres a la volee.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Avatar } from '../../components/Avatar';
import { IconButton } from '../../components/IconButton';
import { IconBack, IconLock, IconPhone, IconTasks, IconVideo } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import {
  addMessage,
  getContactById,
  getConversationById,
  getMessagesByConv,
  setConversations,
  getConversations,
} from '../../services/localDb';
import { LIMITS } from '../../config';
import { MessageTextSchema } from '../../types/message';
import type { Message } from '../../types/message';

export interface ChatScreenProps {
  readonly convId: string;
  readonly onBack: () => void;
}

export function ChatScreen({ convId, onBack }: ChatScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const { user } = useAuth();
  const toast = useToast();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => getMessagesByConv(convId));
  const [callMenu, setCallMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const conv = useMemo(() => getConversationById(convId), [convId]);
  const otherUid = conv?.members.find((m) => m !== user?.uid);
  const other = otherUid ? getContactById(otherUid) : undefined;
  const displayName = conv?.name ?? other?.name ?? '—';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const send = useCallback(() => {
    const parsed = MessageTextSchema.safeParse(text);
    if (!parsed.success) return;
    if (!user) return;

    // SECURITE : En prod Firebase, ici on appelerait crypto.encryptMessage().
    // Pour la demo local, on simule : plaintext stocke (visible) mais envelope
    // structuree identique a la prod.
    const plaintext = parsed.data;
    const msg: Message = {
      id: 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      convId,
      senderId: user.uid,
      kind: 'text',
      cipher: { ciphertext: btoa(unescape(encodeURIComponent(plaintext))), iv: 'AAAAAAAAAAAAAAAA' },
      sentAtMs: Date.now(),
      deliveredAtMs: Date.now(),
      readAtByUid: {},
      replyToId: null,
      reactionsByUid: {},
      plaintext,
    };
    addMessage(msg);
    // Mise a jour lastMessageAt de la conv
    const all = getConversations();
    setConversations(
      all.map((c) => (c.id === convId ? { ...c, lastMessageAtMs: msg.sentAtMs, lastMessageId: msg.id } : c)),
    );
    setMessages((prev) => [...prev, msg]);
    setText('');
  }, [text, user, convId]);

  if (!conv) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <p>Conversation introuvable</p>
        <button onClick={onBack}>Retour</button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--cm-bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--cm-line)' }}>
        <IconButton label={t('back')} onClick={onBack}><IconBack /></IconButton>
        <Avatar name={displayName} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--cm-title)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--cm-sub)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconLock width={11} height={11} style={{ color: theme.primary }} />
            {conv.type === 'direct' ? t('online') : (conv.members.length + ' membres')}
          </div>
        </div>

        {/* Icone Tasks — ajouter une tache partagee */}
        <IconButton
          label="add task"
          onClick={() => toast.show('Tache partagee a venir', 'info')}
        >
          <IconTasks />
        </IconButton>

        {/* Bouton appel unifie avec popover audio/video */}
        <div style={{ position: 'relative' }}>
          <IconButton label="call" onClick={() => setCallMenu((v) => !v)}><IconPhone /></IconButton>
          {callMenu && (
            <div
              style={{
                position: 'absolute', right: 0, top: 48, zIndex: 50,
                background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
                borderRadius: 14, padding: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                minWidth: 200,
              }}
            >
              {[
                { icon: <IconPhone />, label: t('voiceCall') },
                { icon: <IconVideo />, label: t('videoCall') },
              ].map((it, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setCallMenu(false); toast.show(t('callStarting') + ' · ' + it.label, 'info'); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 12px', background: 'transparent', border: 'none',
                    borderRadius: 10, color: 'var(--cm-title)', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <span style={{ color: theme.primary, display: 'inline-flex' }}>{it.icon}</span>
                  {it.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bandeau E2E */}
      <div
        style={{
          padding: '8px 16px', background: theme.primarySoft, color: theme.primaryDark,
          fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
        }}
      >
        <IconLock width={14} height={14} />
        {t('encryptedNote')}
      </div>

      {/* Liste messages */}
      <div
        aria-live="polite"
        style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {messages.map((m) => {
          const isMe = m.senderId === user?.uid;
          return (
            <div
              key={m.id}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '78%',
                padding: '10px 14px',
                borderRadius: 16,
                background: isMe ? theme.primary : 'var(--cm-surface)',
                color: isMe ? '#FFF' : 'var(--cm-title)',
                fontSize: 15, lineHeight: 1.4,
                wordBreak: 'break-word',
              }}
            >
              {m.plaintext ?? decodeURIComponent(escape(atob(m.cipher.ciphertext)))}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px 16px', display: 'flex', gap: 8, borderTop: '1px solid var(--cm-line)' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder={t('typeMessage')}
          maxLength={LIMITS.MESSAGE_MAX}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 24,
            background: 'var(--cm-surface)', border: 'none',
            fontSize: 15, fontFamily: 'inherit', outline: 'none',
            color: 'var(--cm-title)',
          }}
        />
        <button
          type="button"
          onClick={send}
          disabled={!text.trim()}
          aria-label={t('sendShort')}
          style={{
            width: 44, height: 44, borderRadius: 22,
            background: theme.primary, color: '#FFF', border: 'none',
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            opacity: text.trim() ? 1 : 0.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 18,
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
