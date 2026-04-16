/* Chrome Messenger — Settings / Drawer */

function SettingsScreen(props) {
  var useState = React.useState;
  var [, force] = useState(0);
  var profile = cmGetProfile();
  var settings = cmGetSettings();

  function toggle(k) {
    settings[k] = !settings[k];
    cmSetSettings(settings);
    force(Date.now());
  }

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 60 }
  },
    React.createElement(CmHeader, {
      onLogoTap: props.onThemeOpen,
      left: React.createElement(CmIconBtn, { onClick: props.onBack }, Cmi.back),
    }),

    /* Profile card */
    React.createElement("div", {
      onClick: props.onEditProfile,
      style: {
        margin: "6px 22px 22px",
        padding: "18px",
        borderRadius: 18,
        background: CM.surface,
        border: "1px solid " + CM.line,
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer",
      }
    },
      React.createElement(CmAvatar, { name: profile.name || "?", size: 60 }),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: CM.title } }, profile.name || "—"),
        React.createElement("div", { style: { fontSize: 13, color: CM.sub, marginTop: 3 } }, profile.phone || "—"),
        profile.bio && React.createElement("div", { style: { fontSize: 12, color: CM.muted, marginTop: 3 } }, profile.bio)
      ),
      React.createElement("span", { style: { color: CM.muted } }, Cmi.chevR)
    ),

    /* Theme / Language / Toggles */
    React.createElement("div", { style: { padding: "0 22px" } },
      sectionHeading(cm("theme")),
      row(Cmi.heart, cm("themes"), CM.themeName, props.onThemeOpen),
      sectionHeading(cm("language")),
      React.createElement("div", {
        style: { background: CM.surface, border: "1px solid " + CM.line, borderRadius: 14, padding: 6 }
      },
        React.createElement("div", {
          style: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 4 }
        },
          CM_LANGS.map(function(lang) {
            var active = _cmLang === lang.code;
            return React.createElement("button", {
              key: lang.code,
              onClick: function(){ cmSetLang(lang.code); force(Date.now()); props.onLangChange && props.onLangChange(); },
              style: {
                padding: "10px 12px", borderRadius: 10,
                background: active ? CM.primarySoft : "transparent",
                border: "none", color: active ? CM.primaryDark : CM.body,
                fontFamily: "inherit", fontWeight: active ? 800 : 600, fontSize: 12,
                cursor: "pointer", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start",
              }
            },
              React.createElement("span", null, lang.flag),
              React.createElement("span", null, lang.name)
            );
          })
        )
      ),

      sectionHeading(cm("notifications_s")),
      toggleRow("🔔", cm("notifications_s"), !!settings.notifications, function(){ toggle("notifications"); }),
      toggleRow("🔊", "Sons", !!settings.sound, function(){ toggle("sound"); }),
      toggleRow("⌨️", "Entree pour envoyer", !!settings.enterToSend, function(){ toggle("enterToSend"); }),
      toggleRow("👁️", "Confirmations de lecture", !!settings.readReceipts, function(){ toggle("readReceipts"); }),

      sectionHeading(cm("about")),
      row(Cmi.info, "Version", CM_VERSION),

      React.createElement("button", {
        onClick: function(){
          if (confirm(cm("resetConfirm"))) { cmResetAll(); location.reload(); }
        },
        style: {
          marginTop: 16, width: "100%", padding: "14px",
          background: "transparent", border: "1px solid #FF4757",
          color: "#FF4757", borderRadius: 14,
          fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
        }
      }, cm("resetData"))
    )
  );
}

function sectionHeading(text) {
  return React.createElement("h3", {
    style: { margin: "18px 4px 10px", fontSize: 11, fontWeight: 700, color: CM.muted, textTransform: "uppercase", letterSpacing: "0.08em" }
  }, text);
}

function row(icon, label, value, onClick) {
  return React.createElement("div", {
    onClick: onClick,
    style: {
      padding: "12px 14px", borderRadius: 12,
      background: CM.surface, border: "1px solid " + CM.line,
      display: "flex", alignItems: "center", gap: 12,
      cursor: onClick ? "pointer" : "default", marginBottom: 6,
    }
  },
    icon && React.createElement("span", { style: { color: CM.body } }, icon),
    React.createElement("span", { style: { flex: 1, fontSize: 14, fontWeight: 600, color: CM.body } }, label),
    value && React.createElement("span", { style: { fontSize: 13, color: CM.sub } }, value),
    onClick && React.createElement("span", { style: { color: CM.muted } }, Cmi.chevR)
  );
}

function toggleRow(icon, label, on, onToggle) {
  return React.createElement("div", {
    onClick: onToggle,
    style: {
      padding: "12px 14px", borderRadius: 12,
      background: CM.surface, border: "1px solid " + CM.line,
      display: "flex", alignItems: "center", gap: 12,
      cursor: "pointer", marginBottom: 6,
    }
  },
    React.createElement("span", { style: { fontSize: 16 } }, icon),
    React.createElement("span", { style: { flex: 1, fontSize: 14, fontWeight: 600, color: CM.body } }, label),
    React.createElement("div", {
      style: {
        width: 40, height: 22, borderRadius: 100,
        background: on ? CM.primary : CM.line2, position: "relative", transition: "background 0.2s",
      }
    },
      React.createElement("div", {
        style: {
          position: "absolute", top: 3, left: on ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "white",
          transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
        }
      })
    )
  );
}
