/**
 * App — providers + router state-based.
 * 5 onglets principaux + ecrans de detail empiles.
 */

import { useEffect, useState } from 'react';

import { BottomNav, type BottomNavItem } from './components/BottomNav';
import { IconBell, IconChat, IconChatFilled, IconGames, IconTasks } from './components/Icons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider, useI18n } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { ChatScreen } from './features/chat/ChatScreen';
import { GamesScreen } from './features/games/GamesScreen';
import { HomeScreen } from './features/home/HomeScreen';
import { NotifsScreen } from './features/notifs/NotifsScreen';
import { OnboardingScreen } from './features/onboarding/OnboardingScreen';
import { PremiumScreen } from './features/premium/PremiumScreen';
import { LanguageScreen } from './features/settings/LanguageScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { ThemePickerSheet } from './features/theme-picker/ThemePickerSheet';
import { TodoScreen } from './features/todolist/TodoScreen';
import { initFirebase } from './services/firebase';
import { seedIfNeeded, unreadNotifsCount } from './services/localDb';

initFirebase();

type Tab = 'chat' | 'tasks' | 'games' | 'notifs';

type View =
  | { kind: 'tab' }
  | { kind: 'chat'; convId: string }
  | { kind: 'settings' }
  | { kind: 'language' }
  | { kind: 'premium' };

function AppShell() {
  const { t } = useI18n();
  const { onboarded, user } = useAuth();
  const [tab, setTab] = useState<Tab>('chat');
  const [view, setView] = useState<View>({ kind: 'tab' });
  const [themeOpen, setThemeOpen] = useState(false);

  useEffect(() => {
    if (user) seedIfNeeded(user.uid);
  }, [user]);

  if (!onboarded || !user) {
    return <OnboardingScreen />;
  }

  const goTab = (id: string) => {
    setTab(id as Tab);
    setView({ kind: 'tab' });
  };

  let content: React.ReactNode;
  if (view.kind === 'chat') {
    return <ChatScreen convId={view.convId} onBack={() => setView({ kind: 'tab' })} />;
  }
  if (view.kind === 'settings') {
    return (
      <>
        <SettingsScreen
          onBack={() => setView({ kind: 'tab' })}
          onLangOpen={() => setView({ kind: 'language' })}
          onThemeTap={() => setThemeOpen(true)}
        />
        <ThemePickerSheet open={themeOpen} onClose={() => setThemeOpen(false)} />
      </>
    );
  }
  if (view.kind === 'language') {
    return <LanguageScreen onBack={() => setView({ kind: 'settings' })} />;
  }
  if (view.kind === 'premium') {
    return (
      <>
        <PremiumScreen onBack={() => setView({ kind: 'tab' })} onThemeTap={() => setThemeOpen(true)} />
        <ThemePickerSheet open={themeOpen} onClose={() => setThemeOpen(false)} />
      </>
    );
  }

  switch (tab) {
    case 'chat':
      content = (
        <HomeScreen
          onOpenConversation={(convId) => setView({ kind: 'chat', convId })}
          onOpenPremium={() => setView({ kind: 'premium' })}
          onOpenSettings={() => setView({ kind: 'settings' })}
          onOpenStory={() => { /* placeholder story viewer */ }}
          onThemeTap={() => setThemeOpen(true)}
          onAddStory={() => { /* placeholder */ }}
          onStartChat={() => { /* placeholder */ }}
        />
      );
      break;
    case 'tasks':
      content = <TodoScreen onThemeTap={() => setThemeOpen(true)} onOpenSettings={() => setView({ kind: 'settings' })} />;
      break;
    case 'games':
      content = <GamesScreen onOpenPremium={() => setView({ kind: 'premium' })} onOpenSettings={() => setView({ kind: 'settings' })} onThemeTap={() => setThemeOpen(true)} />;
      break;
    case 'notifs':
      content = <NotifsScreen onThemeTap={() => setThemeOpen(true)} onOpenSettings={() => setView({ kind: 'settings' })} />;
      break;
  }

  const navItems: readonly BottomNavItem[] = [
    { id: 'chat',   label: t('navChat'),   icon: <IconChat />,  iconActive: <IconChatFilled /> },
    { id: 'tasks',  label: t('navTasks'),  icon: <IconTasks /> },
    { id: 'games',  label: t('navGames'),  icon: <IconGames /> },
    { id: 'notifs', label: t('navNotifs'), icon: <IconBell />, badge: unreadNotifsCount() > 0 },
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>{content}</div>
      <BottomNav items={navItems} active={tab} onChange={goTab} />
      <ThemePickerSheet open={themeOpen} onClose={() => setThemeOpen(false)} />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
