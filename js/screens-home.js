/* Chrome Messenger — Home screen (Stories + Discussions + filters) */

function HomeScreen(props) {
  var useState = React.useState;
  var [filter, setFilter] = useState("all");
  var [searchQ, setSearchQ] = useState("");
  var [searchOpen, setSearchOpen] = useState(false);
  var [themeOpen, setThemeOpen] = useState(false);

  var contacts = cmGetContacts();
  var conversations = cmGetConversations();
  var stories = cmGetStories();

  /* Filter conversations */
  var rows = conversations.map(function(c) {
    var other = c.type === "direct" ? cmContactById(contacts, c.contactId) : null;
    var lastMsg = cmLastMessage(c.id);
    var msgs = cmGetMessages(c.id);
    var unread = msgs.filter(function(m){ return m.authorId !== "me" && m.readByMe === false; }).length;
    var name = c.type === "group" ? c.name : (other ? other.name : "Inconnu");
    return { conv: c, other: other, lastMsg: lastMsg, unread: unread, name: name };
  });

  if (filter === "unread") rows = rows.filter(function(r){ return r.unread > 0; });
  if (filter === "groups") rows = rows.filter(function(r){ return r.conv.type === "group"; });
  if (filter === "favoris") rows = rows.filter(function(r){ return r.other && r.other.favorite; });
  if (searchQ) {
    var q = searchQ.toLowerCase();
    rows = rows.filter(function(r){ return r.name.toLowerCase().indexOf(q) !== -1; });
  }

  /* Sort by lastMsgAt desc, pinned first */
  rows.sort(function(a,b){
    if (a.conv.pinned !== b.conv.pinned) return a.conv.pinned ? -1 : 1;
    return (b.conv.lastMsgAt || 0) - (a.conv.lastMsgAt || 0);
  });

  return React.createElement("div", { style: { paddingBottom: 100, minHeight: "100vh", background: CM.bg } },
    React.createElement(CmHeader, {
      onLogoTap: function(){ setThemeOpen(true); },
      left: React.createElement(CmIconBtn, { onClick: props.onOpenPremium, label: "premium", color: CM.body }, Cmi.gem),
      right: React.createElement(CmIconBtn, { onClick: props.onOpenMenu, label: "menu" }, Cmi.menu),
    }),

    /* Stories */
    React.createElement("div", { style: { padding: "6px 22px 14px" } },
      React.createElement("h2", {
        style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title, marginBottom: 14 }
      }, cm("stories")),
      React.createElement("div", {
        style: { display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }
      },
        /* Add story tile */
        React.createElement("div", {
          onClick: props.onAddStory,
          style: {
            flexShrink: 0, width: 100, height: 130, borderRadius: 16,
            background: CM.surface2,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 6, cursor: "pointer",
          }
        },
          React.createElement("div", {
            style: { width: 34, height: 34, borderRadius: "50%", border: "1.5px solid " + CM.line2, display: "flex", alignItems: "center", justifyContent: "center", color: CM.body }
          }, Cmi.plus),
          React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: CM.body, textAlign: "center", lineHeight: 1.2 } }, cm("addColors"))
        ),
        /* Other stories */
        stories.map(function(s) {
          var owner = cmContactById(contacts, s.ownerId);
          if (!owner) return null;
          return React.createElement("div", {
            key: s.id,
            onClick: function(){ props.onViewStory(s.id); },
            style: { flexShrink: 0, width: 100, cursor: "pointer" }
          },
            React.createElement("div", {
              style: {
                width: 100, height: 130, borderRadius: 16,
                background: s.bg || CM.primarySoft,
                boxShadow: s.viewed ? "none" : ("0 0 0 2.5px " + CM.primary + ", 0 0 0 4.5px " + CM.bg),
                display: "flex", alignItems: "flex-end", justifyContent: "center",
                padding: 10, position: "relative", overflow: "hidden",
              }
            },
              React.createElement("div", { style: { position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)" } },
                React.createElement(CmAvatar, { name: owner.name, size: 32, border: CM.bg })
              )
            ),
            React.createElement("div", { style: { marginTop: 20, fontSize: 11, fontWeight: 600, color: CM.body, textAlign: "center", lineHeight: 1.2 } },
              owner.name.split(" ")[0]
            )
          );
        })
      )
    ),

    /* Chat section header */
    React.createElement("div", { style: { padding: "8px 22px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" } },
      React.createElement("h2", {
        style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title }
      }, cm("discussions")),
      searchOpen && React.createElement(CmIconBtn, { onClick: function(){ setSearchOpen(false); setSearchQ(""); }, label: "close" }, Cmi.close)
    ),

    /* Search */
    React.createElement(CmSearch, searchOpen ? {
      value: searchQ,
      onChange: setSearchQ,
      placeholder: cm("search_placeholder"),
    } : {
      onClick: function(){ setSearchOpen(true); },
    }),

    /* Filters */
    React.createElement("div", {
      style: { display: "flex", gap: 8, padding: "14px 22px 4px", overflowX: "auto" }
    },
      ["all","unread","groups","favoris"].map(function(id) {
        return React.createElement(CmPill, {
          key: id, active: filter === id,
          onClick: function(){ setFilter(id); },
        }, cm("filter_" + id));
      })
    ),

    /* Conversations list */
    React.createElement("div", { style: { padding: "6px 22px 0" } },
      rows.length === 0 && React.createElement("div", {
        style: { textAlign: "center", padding: 40, color: CM.muted, fontSize: 14 }
      }, cm("comingSoon") || "Aucune conversation"),
      rows.map(function(r) {
        return React.createElement("div", {
          key: r.conv.id,
          onClick: function(){ props.onOpenChat(r.conv.id); },
          style: {
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 0", cursor: "pointer",
            borderBottom: "1px solid " + CM.line,
          }
        },
          React.createElement(CmAvatar, { name: r.name, size: 44 }),
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", {
              style: { display: "flex", alignItems: "center", gap: 6 }
            },
              r.conv.pinned && React.createElement("span", { style: { fontSize: 11 } }, "📌"),
              React.createElement("div", {
                style: { fontSize: 15, fontWeight: r.unread ? 800 : 700, color: CM.title, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
              }, r.name)
            ),
            React.createElement("div", {
              style: {
                fontSize: 13, color: r.unread ? CM.body : CM.sub,
                fontWeight: r.unread ? 600 : 500,
                marginTop: 2, display: "flex", alignItems: "center", gap: 4,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }
            },
              r.lastMsg && r.lastMsg.authorId === "me" && React.createElement("span", {
                style: { color: CM.primary, display: "inline-flex" }
              }, Cmi.checkDouble),
              React.createElement("span", null, r.lastMsg ? cmMsgText(r.lastMsg) : "...")
            )
          ),
          React.createElement("div", { style: { textAlign: "right", flexShrink: 0, minWidth: 44 } },
            React.createElement("div", {
              style: { fontSize: 11, color: r.unread ? CM.primary : CM.muted, fontWeight: 600 }
            }, r.lastMsg ? cmFmtDayLabel(r.lastMsg.at).substring(0,8) : ""),
            r.unread > 0 && React.createElement("div", {
              style: {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 20, height: 20, borderRadius: 10, padding: "0 6px",
                background: CM.primary, color: CM.onPrimary,
                fontSize: 11, fontWeight: 800, marginTop: 4,
              }
            }, r.unread)
          )
        );
      })
    ),

    /* FAB */
    React.createElement(CmFab, { onClick: props.onNewChat }),

    /* Theme palette sheet */
    themeOpen && React.createElement(CmThemePalette, {
      onClose: function(){ setThemeOpen(false); },
      onChange: function(){ if (props.onThemeChange) props.onThemeChange(); },
    })
  );
}
