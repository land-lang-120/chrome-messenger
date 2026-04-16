/* Chrome Messenger — Games screen (Solo + Social, 2 horizontal slides) */

function GamesScreen(props) {
  var useState = React.useState;
  var [themeOpen, setThemeOpen] = useState(false);

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 100 }
  },
    React.createElement(CmHeader, {
      onLogoTap: function(){ setThemeOpen(true); },
      left: React.createElement(CmIconBtn, { onClick: props.onOpenPremium, color: CM.body }, Cmi.gem),
      right: React.createElement(CmIconBtn, { onClick: props.onOpenMenu }, Cmi.menu),
    }),

    /* Solo games section */
    React.createElement("div", {
      style: { padding: "6px 22px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      React.createElement("div", null,
        React.createElement("h2", {
          style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title }
        }, cm("gamesSolo")),
        React.createElement("p", {
          style: { margin: "2px 0 0", fontSize: 12, color: CM.sub }
        }, cm("gamesSoloDesc"))
      ),
      CM_SEED_GAMES.solo.length > 4 && React.createElement("button", {
        onClick: function(){ props.onSeeAll("solo"); },
        style: { background: "transparent", border: "none", color: CM.primary, fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer" }
      }, cm("seeAll"))
    ),
    React.createElement("div", {
      style: { display: "flex", gap: 12, overflowX: "auto", padding: "4px 22px 14px" }
    },
      CM_SEED_GAMES.solo.map(function(g) {
        return React.createElement(GameCard, { key: g.id, game: g, onPlay: function(){ props.onPlayGame(g); } });
      })
    ),

    /* Social games section */
    React.createElement("div", {
      style: { padding: "10px 22px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      React.createElement("div", null,
        React.createElement("h2", {
          style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title }
        }, cm("gamesSocial")),
        React.createElement("p", {
          style: { margin: "2px 0 0", fontSize: 12, color: CM.sub }
        }, cm("gamesSocialDesc"))
      ),
      CM_SEED_GAMES.social.length > 4 && React.createElement("button", {
        onClick: function(){ props.onSeeAll("social"); },
        style: { background: "transparent", border: "none", color: CM.primary, fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer" }
      }, cm("seeAll"))
    ),
    React.createElement("div", {
      style: { display: "flex", gap: 12, overflowX: "auto", padding: "4px 22px 14px" }
    },
      CM_SEED_GAMES.social.map(function(g) {
        return React.createElement(GameCard, { key: g.id, game: g, onPlay: function(){ props.onPlayGame(g); }, social: true });
      })
    ),

    /* Premium banner */
    React.createElement("div", {
      onClick: props.onOpenPremium,
      style: {
        margin: "10px 22px 0", padding: 16, borderRadius: 16,
        background: "linear-gradient(135deg, " + CM.primary + ", " + CM.primaryDark + ")",
        color: CM.onPrimary,
        display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
        boxShadow: CM.shadowGlow,
      }
    },
      React.createElement("div", { style: { fontSize: 34 } }, "💎"),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { fontSize: 14, fontWeight: 800 } }, "Game Pass"),
        React.createElement("div", { style: { fontSize: 12, opacity: 0.92, marginTop: 2 } }, "Debloque tous les jeux sociaux")
      ),
      React.createElement("span", null, Cmi.chevR)
    ),

    themeOpen && React.createElement(CmThemePalette, { onClose: function(){ setThemeOpen(false); }, onChange: props.onThemeChange })
  );
}

function GameCard(props) {
  var g = props.game;
  var locked = props.social && g.kind === "social"; /* mock premium lock */
  return React.createElement("button", {
    onClick: props.onPlay,
    style: {
      flexShrink: 0, width: 150, minHeight: 170,
      background: CM.surface,
      border: "1px solid " + CM.line,
      borderRadius: 18, padding: 14,
      cursor: "pointer", fontFamily: "inherit",
      display: "flex", flexDirection: "column", gap: 8,
      position: "relative", overflow: "hidden",
    }
  },
    React.createElement("div", {
      style: {
        width: 54, height: 54, borderRadius: 14,
        background: g.color + "22", color: g.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
      }
    }, g.emoji),
    React.createElement("div", { style: { flex: 1 } },
      React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: CM.title, textAlign: "left" } }, g.name),
      React.createElement("div", { style: { fontSize: 11, color: CM.sub, textAlign: "left", marginTop: 3, lineHeight: 1.4 } }, g.desc)
    ),
    locked ? React.createElement("div", {
      style: { fontSize: 11, fontWeight: 700, color: CM.primary, display: "flex", alignItems: "center", gap: 4 }
    }, "💎 Premium") :
    React.createElement("div", {
      style: { fontSize: 11, fontWeight: 700, color: g.color, display: "flex", alignItems: "center", gap: 4 }
    },
      React.createElement("span", null, g.kind === "social" ? cm("invite") : cm("play")),
      React.createElement("span", null, "→")
    )
  );
}
