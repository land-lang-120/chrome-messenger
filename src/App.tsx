/**
 * App — providers + router state-based.
 * 5 onglets principaux + ecrans de detail empiles (chat, settings, language, premium, contacts, events, qr-scanner, story-viewer).
 */

import { useEffect, useState } from 'react';

import { BottomNav, type BottomNavItem } from './components/BottomNav';
import { IconBell, IconChat, IconChatFilled, IconGames, IconTasks } from './components/Icons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider, useI18n } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { ChatScreen } from './features/chat/ChatScreen';
import { ContactsScreen } from './features/contacts/ContactsScreen';
import { EventsScreen } from './features/events/EventsScreen';
import { GamesScreen } from './features/games/GamesScreen';
import { HomeScreen } from './features/home/HomeScreen';
import { NotifsScreen } from './features/notifs/NotifsScreen';
import { OnboardingScreen } from './features/onboarding/OnboardingScreen';
import { PremiumScreen } from './features/premium/PremiumScreen';
import { QrScannerScreen } from './features/qr-scanner/QrScannerScreen';
import { DndScreen } from './features/settings/DndScreen';
import { EditProfileScreen } from './features/settings/EditProfileScreen';
import { LanguageScreen } from './features/settings/LanguageScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { AddStorySheet } from './features/stories/AddStorySheet';
import { StoryViewer } from './features/stories/StoryViewer';
import { ThemePickerSheet } from './features/theme-picker/ThemePickerSheet';
import { TodoScreen } from './features/todolist/TodoScreen';
import { initFirebase } from './services/firebase';
import { getConversations, seedIfNeeded, setConversations, unreadNotifsCount } from './services/localDb';
import { isPro, startTrialIfEligible } from './services/premium';

initFirebase();

type Tab = 'chat' | 'tasks' | 'games' | 'notifs';

type View =
  | { kind: 'tab' }
  | { kind: 'chat'; convId: string }
  | { kind: 'settings' }
  | { kind: 'language' }
  | { kind: 'premium' }
  | { kind: 'contacts' }
  | { kind: 'events' }
  | { kind: 'qr-scanner' }
  | { kind: 'story'; storyId: string }
  | { kind: 'edit-profile' }
  | { kind: 'dnd' };

function AppShell() {
  const { t } = useI18n();
  const { onboarded, user } = useAuth();
  const [tab, setTab] = useState<Tab>('chat');
  const [view, setView] = useState<View>({ kind: 'tab' });
  const [themeOpen, setThemeOpen] = useState(false);
  const [addStoryOpen, setAddStoryOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user) {
      seedIfNeeded(user.uid);
      // Active l'essai gratuit Pro de 30j si jamais démarré (1er lancement après install)
      startTrialIfEligible();
    }
  }, [user]);

  if (!onboarded || !user) {
    return <OnboardingScreen />;
  }

  const goTab = (id: string) => {
    setTab(id as Tab);
    setView({ kind: 'tab' });
  };

  /** Ouvre (ou crée) une conversation avec un contact donné et navigue dedans. */
  const openConvWithContact = (contactUid: string) => {
    const all = getConversations();
    let conv = all.find(
      (c) => c.type === 'direct' && c.members.length === 2 && c.members.includes(contactUid) && c.members.includes(user.uid),
    );
    if (!conv) {
      conv = {
        id: 'conv_' + contactUid + '_' + Date.now(),
        type: 'direct',
        members: [user.uid, contactUid],
        createdAtMs: Date.now(),
        lastMessageId: null,
        lastMessageAtMs: Date.now(),
      };
      setConversations([...all, conv]);
    }
    setView({ kind: 'chat', convId: conv.id });
  };

  // Vues "plein écran" (pas de nav bar)
  if (view.kind === 'chat') {
    return <ChatScreen convId={view.convId} onBack={() => setView({ kind: 'tab' })} />;
  }
  if (view.kind === 'story') {
    return <StoryViewer initialStoryId={view.storyId} onClose={() => setView({ kind: 'tab' })} />;
  }
  if (view.kind === 'qr-scanner') {
    return <QrScannerScreen onBack={() => setView({ kind: 'tab' })} />;
  }
  if (view.kind === 'settings') {
    return (
      <>
        <SettingsScreen
          onBack={() => setView({ kind: 'tab' })}
          onLangOpen={() => setView({ kind: 'language' })}
          onThemeTap={() => setThemeOpen(true)}
          onContactsOpen={() => setView({ kind: 'contacts' })}
          onEventsOpen={() => setView({ kind: 'events' })}
          onEditProfileOpen={() => setView({ kind: 'edit-profile' })}
          onDndOpen={() => setView({ kind: 'dnd' })}
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
  if (view.kind === 'contacts') {
    return (
      <ContactsScreen
        onBack={() => setView({ kind: 'tab' })}
        onOpenConversation={openConvWithContact}
      />
    );
  }
  if (view.kind === 'events') {
    return <EventsScreen onBack={() => setView({ kind: 'tab' })} />;
  }
  if (view.kind === 'edit-profile') {
    return <EditProfileScreen onBack={() => setView({ kind: 'settings' })} />;
  }
  if (view.kind === 'dnd') {
    return <DndScreen onBack={() => setView({ kind: 'settings' })} isPro={isPro()} />;
  }

  // Vues onglet principales (avec nav bar)
  let content: React.ReactNode;
  switch (tab) {
    case 'chat':
      content = (
        <HomeScreen
          key={refreshKey}
          onOpenConversation={(convId) => setView({ kind: 'chat', convId })}
          onOpenPremium={() => setView({ kind: 'premium' })}
          onOpenSettings={() => setView({ kind: 'settings' })}
          onOpenStory={(storyId) => setView({ kind: 'story', storyId })}
          onThemeTap={() => setThemeOpen(true)}
          onAddStory={() => setAddStoryOpen(true)}
          onStartChat={() => setView({ kind: 'contacts' })}
        />
      );
      break;
    case 'tasks':
      content = (
        <TodoScreen
          onThemeTap={() => setThemeOpen(true)}
          onOpenSettings={() => setView({ kind: 'settings' })}
          onOpenQrScanner={() => setView({ kind: 'qr-scanner' })}
          onOpenEvents={() => setView({ kind: 'events' })}
        />
      );
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
      <AddStorySheet
        open={addStoryOpen}
        onClose={() => setAddStoryOpen(false)}
        onPublished={() => setRefreshKey((k) => k + 1)}
      />
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
