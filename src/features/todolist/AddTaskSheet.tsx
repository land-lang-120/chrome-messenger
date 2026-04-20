/**
 * AddTaskSheet — ajouter une tache au TodoList.
 *
 * Chaque tache est associee a une personne : "Moi" par defaut OU un contact
 * selectionne. Le nom de cette personne s'affiche en dessous du titre sur la
 * liste des taches.
 *
 * Peut etre pre-ouvert avec un contactUid via prop initialAssigneeUid
 * (utilise depuis le header du chat pour affilier une tache au contact courant).
 */

import { useEffect, useMemo, useState } from 'react';

import { Avatar } from '../../components/Avatar';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { getContacts, getTasks, setTasks } from '../../services/localDb';
import type { Task, TaskKind } from '../../types/task';

export interface AddTaskSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly initialAssigneeUid?: string;
  readonly initialDate?: string; // YYYY-MM-DD
  readonly onCreated?: () => void;
}

type AssigneeChoice = { uid: string; name: string; isMe: boolean };

export function AddTaskSheet({ open, onClose, initialAssigneeUid, initialDate, onCreated }: AddTaskSheetProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<TaskKind>('individual');
  const [date, setDate] = useState<string>(initialDate ?? new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [assigneeUid, setAssigneeUid] = useState<string>(initialAssigneeUid ?? 'me');

  // Regle auto : si la tache est avec Moi -> Individuelle, sinon Commune.
  // (on n'ecrase pas si l'user a explicitement choisi Quotidien)
  useEffect(() => {
    setKind((prev) => (prev === 'daily' ? 'daily' : assigneeUid === 'me' ? 'individual' : 'common'));
  }, [assigneeUid]);

  // Contacts : "Moi" + tous les contacts
  const choices = useMemo<AssigneeChoice[]>(() => {
    const contacts = getContacts();
    return [
      { uid: 'me', name: user?.name ? `Moi (${user.name})` : 'Moi', isMe: true },
      ...contacts.map((c) => ({ uid: c.contactUid, name: c.name, isMe: false })),
    ];
  }, [user?.name]);

  // Re-init a chaque ouverture
  useEffect(() => {
    if (open) {
      setAssigneeUid(initialAssigneeUid ?? 'me');
      setDate(initialDate ?? new Date().toISOString().slice(0, 10));
    }
  }, [open, initialAssigneeUid, initialDate]);

  function reset() {
    setTitle('');
    setKind('individual');
    setStartTime('');
    setEndTime('');
    setLocation('');
  }

  function submit() {
    if (!title.trim()) { toast.show('Titre requis', 'warning'); return; }
    if (!user) return;

    const task: Task = {
      id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      ownerId: user.uid,
      sharedWith: assigneeUid === 'me' ? [] : [assigneeUid],
      title: title.trim(),
      kind,
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      location: location.trim() || null,
      done: false,
      reminderEnabled: true,
      createdAtMs: Date.now(),
    };
    setTasks([...getTasks(), task]);

    const assignee = choices.find((c) => c.uid === assigneeUid);
    toast.show('Tache ajoutee' + (assignee ? ` (${assignee.name})` : ''), 'success');
    reset();
    onClose();
    onCreated?.();
  }

  return (
    <BottomSheet open={open} onClose={() => { reset(); onClose(); }} title="Nouvelle tache">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre (ex: Homework, RDV...)"
          maxLength={60}
          autoFocus
        />

        {/* Assignee : Moi + contacts */}
        <div>
          <Label>Avec qui ?</Label>
          <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {choices.map((c) => {
              const active = assigneeUid === c.uid;
              return (
                <button
                  key={c.uid}
                  type="button"
                  onClick={() => setAssigneeUid(c.uid)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12,
                    background: active ? theme.primarySoft : 'var(--cm-surface)',
                    border: active ? `2px solid ${theme.primary}` : '1px solid var(--cm-line)',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <Avatar name={c.name} size={32} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: active ? theme.primaryDark : 'var(--cm-title)' }}>
                    {c.name}
                  </span>
                  {c.isMe && (
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: theme.primary, color: '#FFF', fontWeight: 700 }}>
                      MOI
                    </span>
                  )}
                  {active && (
                    <span aria-hidden style={{ color: theme.primary, fontSize: 18 }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Type */}
        <div>
          <Label>Type</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { id: 'individual' as const, label: 'Individuel' },
              { id: 'common' as const, label: 'Commun' },
              { id: 'daily' as const, label: 'Quotidien' },
            ]).map((k) => {
              const active = kind === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 12,
                    background: active ? theme.primary : 'var(--cm-surface)',
                    color: active ? '#FFF' : 'var(--cm-title)',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
                  }}
                >
                  {k.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date + horaires */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Debut</Label>
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div>
            <Label>Fin</Label>
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lieu (optionnel)" />

        <Button variant="primary" size="lg" fullWidth onClick={submit}>
          Ajouter la tache
        </Button>
      </div>
    </BottomSheet>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: 'var(--cm-sub)', fontWeight: 700, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>
      {children}
    </div>
  );
}
