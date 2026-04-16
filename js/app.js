/* Chrome Messenger — Main App orchestrator */

function App() {
  var useState = React.useState;
  var useEffect = React.useEffect;
  var [onboarded, setOnboarded] = useState(cmIsOnboarded());
  var [view, setView] = useState("chat"); /* chat (home) | tasks | games | notifs */
  var [params, setParams] = useState({});
  var [, forceRender] = useState(0);

  useEffect(function(){
    /* Initialize crypto (non-blocking for UI) */
    cmCryptoInit().catch(function(e){ console.warn("[crypto] init failed", e); });
  }, []);

  function nav(v, p) {
    setView(v);
    setParams(p || {});
    window.scrollTo(0, 0);
  }

  if (!onboarded) {
    return React.createElement(OnboardingFlow, {
      onDone: function(){ setOnboarded(true); setView("chat"); }
    });
  }

  var handlers = {
    onOpenChat: function(id){ nav("conversation", { convId: id }); },
    onBack: function(){ nav("chat"); },
    onNewChat: function(){ cmToast(cm("newChat") + " (demo)", "info"); },
    onAddStory: function(){ nav("storyCreate"); },
    onViewStory: function(id){ nav("storyView", { storyId: id }); },
    onOpenPremium: function(){ nav("premium"); },
    onOpenMenu: function(){ nav("settings"); },
    onOpenSettings: function(){ nav("settings"); },
    onEditProfile: function(){ cmToast(cm("editProfile") + " (demo)", "info"); },
    onThemeChange: function(){ forceRender(Date.now()); },
    onLangChange: function(){ forceRender(Date.now()); },
    onChanged: function(){ forceRender(Date.now()); },
    onSeeAll: function(cat){ cmToast(cm("seeAll") + ": " + cat, "info"); },
    onPlayGame: function(g){
      if (g.kind === "external" && g.href) { window.open(g.href, "_blank"); return; }
      cmToast("🎮 " + g.name + " — " + cm("comingSoon"), "info");
    },
    onThemeOpen: function(){ forceRender(Date.now()); cmToast("Tape sur le cameleon !", "info"); },
  };

  var screen;
  if (view === "chat") {
    screen = React.createElement(HomeScreen, Object.assign({}, handlers, {
      onThemeChange: handlers.onThemeChange,
    }));
  } else if (view === "tasks") {
    screen = React.createElement(TodolistScreen, handlers);
  } else if (view === "games") {
    screen = React.createElement(GamesScreen, handlers);
  } else if (view === "notifs") {
    screen = React.createElement(NotifsScreen, handlers);
  } else if (view === "conversation") {
    screen = React.createElement(ChatScreen, Object.assign({}, handlers, { convId: params.convId }));
  } else if (view === "premium") {
    screen = React.createElement(PremiumScreen, handlers);
  } else if (view === "settings") {
    screen = React.createElement(SettingsScreen, handlers);
  } else if (view === "storyView") {
    screen = React.createElement(StoryViewer, Object.assign({}, handlers, {
      storyId: params.storyId,
      onClose: function(){ nav("chat"); },
    }));
  } else if (view === "storyCreate") {
    screen = React.createElement(StoryCreator, Object.assign({}, handlers, {
      onClose: function(){ nav("chat"); },
      onDone: function(){ nav("chat"); },
    }));
  } else {
    screen = React.createElement("div", null, "404");
  }

  /* Hide bottom nav during fullscreen views */
  var hideNav = view === "conversation" || view === "storyView" || view === "storyCreate" || view === "premium" || view === "settings";

  var navItems = [
    { id: "chat",   label: cm("navChat"),   icon: view === "chat"   ? Cmi.chat  : Cmi.chat },
    { id: "tasks",  label: cm("navTasks"),  icon: Cmi.tasks, badge: false },
    { id: "games",  label: cm("navGames"),  icon: Cmi.games },
    { id: "notifs", label: cm("navNotifs"), icon: Cmi.bell, badge: cmUnreadNotifsCount() > 0 },
  ];

  return React.createElement("div", {
    style: { maxWidth: 480, margin: "0 auto", minHeight: "100vh", position: "relative" }
  },
    screen,
    !hideNav && React.createElement(CmBottomNav, {
      items: navItems, active: view, onNav: nav,
    })
  );
}
