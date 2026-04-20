/**
 * TodoScreen — Todolist avec vue Mois (design 78) et Semaine (design 79).
 */

import { useMemo, useState } from 'react';

import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconChevDown, IconChevUp, IconMenu, IconPlus } from '../../components/Icons';
import { getContactById, getTasksByDate } from '../../services/localDb';
import { useAuth } from '../../contexts/AuthContext';
import { AddTaskSheet } from './AddTaskSheet';
import { TaskOptionsSheet } from './TaskOptionsSheet';
import { useToast } from '../../contexts/ToastContext';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';

type Mode = 'month' | 'week';

function isoDate(d: Date): string { return d.toISOString().slice(0, 10); }

function daysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const last = new Date(year, month + 1, 0);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

function weekDates(ref: Date): Date[] {
  const d = new Date(ref);
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1; // L=0, D=6
  d.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(d);
    nd.setDate(d.getDate() + i);
    return nd;
  });
}

export interface TodoScreenProps {
  readonly onThemeTap: () => void;
  readonly onOpenSettings: () => void;
  readonly onOpenQrScanner: () => void;
  readonly onOpenEvents: () => void;
}

export function TodoScreen(props: TodoScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const { user } = useAuth();
  // Vue par defaut : week (calendrier compact). Toggle vers month via fleche bas.
  const [mode, setMode] = useState<Mode>('week');
  const [selected, setSelected] = useState<Date>(new Date());
  const [addOpen, setAddOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();

  const tasks = useMemo(
    () => getTasksByDate(isoDate(selected)).filter((t) => !t.done),

    [selected, refreshKey],
  );

  const monthLabel = useMemo(() => {
    return selected.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }, [selected]);

  const prevMonth = () => {
    const d = new Date(selected);
    d.setMonth(d.getMonth() - 1);
    setSelected(d);
  };
  const nextMonth = () => {
    const d = new Date(selected);
    d.setMonth(d.getMonth() + 1);
    setSelected(d);
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = isoDate(new Date());

  return (
    <div style={{ paddingBottom: 20, background: 'var(--cm-bg)' }}>
      <Header
        left={
          // Fleche bas en mode week (pour ouvrir le mois), haut en mode month (pour reduire)
          <IconButton
            label={mode === 'week' ? 'Voir le mois' : 'Reduire'}
            onClick={() => setMode((m) => (m === 'month' ? 'week' : 'month'))}
          >
            {mode === 'week' ? <IconChevDown /> : <IconChevUp />}
          </IconButton>
        }
        right={
          <IconButton label="Options Tasks" onClick={() => setOptionsOpen(true)}>
            <IconMenu />
          </IconButton>
        }
        onLogoTap={props.onThemeTap}
      />

      <TaskOptionsSheet
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        onOpenHistory={() => toast.show('Taches terminees a venir', 'info')}
        onOpenTrash={() => toast.show('Corbeille a venir', 'info')}
      />

      {/* Nav mois */}
      <div
        style={{
          margin: '4px 16px 16px', padding: 14,
          background: 'var(--cm-surface)', borderRadius: 18,
          display: mode === 'month' ? 'block' : 'flex',
          alignItems: 'center', gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 12px' }}>
          <button type="button" onClick={prevMonth} style={arrowStyle()}>‹</button>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--cm-title)', margin: 0, textTransform: 'capitalize' }}>{monthLabel}</h2>
          <button type="button" onClick={nextMonth} style={arrowStyle()}>›</button>
        </div>

        {mode === 'month' && (() => {
          const days = daysInMonth(selected.getFullYear(), selected.getMonth());
          // Padding debut de mois
          const firstDay = days[0]!.getDay() === 0 ? 6 : days[0]!.getDay() - 1;
          const cells: (Date | null)[] = [...Array(firstDay).fill(null), ...days];
          return (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', fontSize: 11, color: 'var(--cm-sub)', fontWeight: 600, textAlign: 'center', marginBottom: 6 }}>
                {daysOfWeek.map((d, i) => (
                  <div key={d} style={{ color: i === 6 ? theme.primary : 'var(--cm-sub)' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center' }}>
                {cells.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const iso = isoDate(d);
                  const isToday = iso === today;
                  const isSelected = iso === isoDate(selected);
                  const isSunday = d.getDay() === 0;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelected(new Date(d))}
                      style={{
                        aspectRatio: '1 / 1',
                        border: 'none',
                        background: isToday ? 'transparent' : 'transparent',
                        color: isSunday ? theme.primary : 'var(--cm-title)',
                        fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        borderRadius: '50%',
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 32, height: 32, borderRadius: '50%',
                          background: isSelected ? theme.primary : (isToday ? theme.primarySoft : 'transparent'),
                          color: isSelected ? '#FFF' : undefined,
                          border: isToday && !isSelected ? `1.5px solid ${theme.primary}` : undefined,
                        }}
                      >
                        {d.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {mode === 'week' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', marginTop: 6 }}>
            {weekDates(selected).map((d) => {
              const iso = isoDate(d);
              const isSelected = iso === isoDate(selected);
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(new Date(d))}
                  style={{
                    padding: '10px 4px',
                    border: 'none',
                    background: isSelected ? 'var(--cm-surface-2)' : 'transparent',
                    borderRadius: 12,
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  }}
                >
                  <span style={{ fontSize: 11, color: 'var(--cm-sub)', fontWeight: 600 }}>{daysOfWeek[(d.getDay() + 6) % 7]}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--cm-title)' }}>{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Acces rapides Events + QR Scanner */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={props.onOpenEvents}
          style={{
            flex: 1, padding: '12px 14px', borderRadius: 14,
            background: theme.primarySoft, border: 'none',
            color: theme.primaryDark, fontWeight: 700, fontSize: 13,
            fontFamily: 'inherit', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span aria-hidden>🎉</span> Evenements
        </button>
        <button
          type="button"
          onClick={props.onOpenQrScanner}
          style={{
            flex: 1, padding: '12px 14px', borderRadius: 14,
            background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
            color: 'var(--cm-title)', fontWeight: 700, fontSize: 13,
            fontFamily: 'inherit', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span aria-hidden>📷</span> Scanner QR
        </button>
      </div>

      {/* Taches du jour */}
      <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--cm-title)' }}>{t('todoTitle')}</h2>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 14,
            background: theme.primarySoft, border: 'none',
            color: theme.primaryDark, fontWeight: 700, fontSize: 13,
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          {t('addTask')} <IconPlus width={14} height={14} />
        </button>
      </div>

      {/* Pills */}
      <div className="cm-scroll-x" style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
        {[t('taskAll'), t('taskIndividual'), t('taskCommon'), t('taskDaily')].map((label, i) => (
          <span
            key={label}
            style={{
              flexShrink: 0,
              padding: '8px 16px', borderRadius: 999,
              background: i === 0 ? theme.primarySoft : 'var(--cm-surface)',
              color: i === 0 ? theme.primaryDark : 'var(--cm-title)',
              fontSize: 13, fontWeight: 600,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Sheet : ajouter une tache */}
      <AddTaskSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        initialDate={isoDate(selected)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />

      {/* Liste taches */}
      <ul style={{ listStyle: 'none', padding: '0 16px', margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tasks.length === 0 && <li style={{ color: 'var(--cm-muted)', textAlign: 'center', padding: 40 }}>—</li>}
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              padding: 14, borderRadius: 16,
              background: 'var(--cm-surface)',
              border: '1px solid var(--cm-line)',
              display: 'flex', justifyContent: 'space-between', gap: 14,
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--cm-title)' }}>{task.title}</div>
              {/* Nom de la personne assignee (Moi si sharedWith vide, sinon le contact) */}
              <div style={{ fontSize: 12, color: 'var(--cm-sub)', marginTop: 2 }}>
                {task.sharedWith.length === 0
                  ? `avec ${user?.name ?? 'Moi'}`
                  : task.sharedWith.map((uid) => getContactById(uid)?.name ?? uid).map((name) => `avec ${name}`).join(', ')
                }
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--cm-sub)' }}>
              {task.location && <div>📍 {task.location}</div>}
              {task.startTime && <div>🕒 {task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function arrowStyle(): React.CSSProperties {
  return {
    width: 32, height: 32, borderRadius: 10,
    background: 'transparent', border: 'none',
    cursor: 'pointer', color: 'var(--cm-title)',
    fontSize: 22, fontWeight: 800, fontFamily: 'inherit',
  };
}
