/* Chrome Messenger — Notifications screen (based on design 84, 93) */

function NotifsScreen(props) {
  var useState = React.useState;
  var [filter, setFilter] = useState("all");
  var [themeOpen, setThemeOpen] = useState(false);

  var notifs = cmGetNotifs();
  if (filter !== "all") notifs = notifs.filter(function(n){ return n.kind === filter; });
  /* Split by today / earlier */
  var today = new Date(); today.setHours(0,0,0,0);
  var tod = notifs.filter(function(n){ return n.at >= today.getTime(); });
  var earlier = notifs.filter(function(n){ return n.at < today.getTime(); });

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 100 }
  },
    React.createElement(CmHeader, {
      onLogoTap: function(){ setThemeOpen(true); },
      left: React.createElement(CmIconBtn, {
        onClick: function(){
          if (confirm("Tout effacer ?")) { cmSetNotifs([]); cmToast("Efface", "info"); props.onChanged && props.onChanged(); }
        },
      }, Cmi.trash),
      right: React.createElement(CmIconBtn, { onClick: props.onOpenSettings }, Cmi.settings),
    }),

    React.createElement("h2", {
      style: { margin: "4px 22px 12px", fontSize: 22, fontWeight: 800, color: CM.title }
    }, cm("notifications")),

    /* Filters */
    React.createElement("div", {
      style: { display: "flex", gap: 8, padding: "0 22px 14px", overflowX: "auto" }
    },
      ["all","call","tasks","events","matchs"].map(function(f){
        return React.createElement(CmPill, {
          key: f, active: filter === f,
          onClick: function(){ setFilter(f); },
        }, cm("notif_" + f));
      })
    ),

    /* Today */
    tod.length > 0 && React.createElement("div", null,
      React.createElement("h3", {
        style: { margin: "6px 22px 10px", fontSize: 16, fontWeight: 800, color: CM.title }
      }, cm("notifToday")),
      React.createElement("div", { style: { padding: "0 22px" } },
        tod.map(function(n){ return notifRow(n); })
      )
    ),

    /* Earlier */
    earlier.length > 0 && React.createElement("div", null,
      React.createElement("h3", {
        style: { margin: "18px 22px 10px", fontSize: 16, fontWeight: 800, color: CM.title }
      }, cm("notifEarlier")),
      React.createElement("div", { style: { padding: "0 22px" } },
        earlier.map(function(n){ return notifRow(n); })
      )
    ),

    /* Empty */
    notifs.length === 0 && React.createElement("div", {
      style: { textAlign: "center", padding: 60, color: CM.muted }
    },
      React.createElement("div", { style: { fontSize: 40, marginBottom: 10 } }, "🔕"),
      React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, cm("noNotifs"))
    ),

    themeOpen && React.createElement(CmThemePalette, { onClose: function(){ setThemeOpen(false); }, onChange: props.onThemeChange })
  );
}

function notifRow(n) {
  return React.createElement("div", {
    key: n.id,
    style: {
      padding: 14, borderRadius: 14, marginBottom: 8,
      background: CM.surface, border: "1px solid " + CM.line,
      display: "flex", alignItems: "center", gap: 12,
    }
  },
    React.createElement("div", { style: { flex: 1, minWidth: 0 } },
      React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: CM.title, marginBottom: 3 } }, n.title),
      n.subtitle && React.createElement("div", { style: { fontSize: 12, color: CM.sub } }, n.subtitle)
    ),
    React.createElement("div", { style: { textAlign: "right", fontSize: 11, color: CM.sub } },
      n.place && React.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end", fontWeight: 600 }
      }, Cmi.location, n.place),
      n.time && React.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end", marginTop: 2 }
      }, Cmi.clock, n.time)
    )
  );
}
