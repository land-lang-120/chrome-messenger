/* Chrome Messenger — Story viewer + creator */

function StoryViewer(props) {
  var useState = React.useState;
  var useEffect = React.useEffect;
  var [progress, setProgress] = useState(0);
  var stories = cmGetStories();
  var [idx, setIdx] = useState(stories.findIndex(function(s){ return s.id === props.storyId; }));
  var contacts = cmGetContacts();

  useEffect(function(){
    /* Auto-advance every 5s */
    var startedAt = Date.now();
    var rafId;
    function tick() {
      var elapsed = Date.now() - startedAt;
      var p = Math.min(1, elapsed / 5000);
      setProgress(p);
      if (p >= 1) {
        if (idx < stories.length - 1) { setIdx(idx + 1); }
        else { props.onClose(); }
      } else {
        rafId = requestAnimationFrame(tick);
      }
    }
    rafId = requestAnimationFrame(tick);
    /* Mark as viewed */
    var cur = stories[idx];
    if (cur) cmMarkStoryViewed(cur.id);
    return function(){ cancelAnimationFrame(rafId); };
  }, [idx]);

  var story = stories[idx];
  if (!story) return null;
  var owner = cmContactById(contacts, story.ownerId);

  return React.createElement("div", {
    onClick: function(){ if (idx < stories.length - 1) setIdx(idx + 1); else props.onClose(); },
    style: {
      position: "fixed", inset: 0, zIndex: 1000,
      background: story.bg || CM.primarySoft,
      display: "flex", flexDirection: "column",
      color: "white",
    }
  },
    /* Progress bars */
    React.createElement("div", {
      style: { display: "flex", gap: 3, padding: "10px 14px" }
    },
      stories.map(function(_, i) {
        return React.createElement("div", {
          key: i,
          style: { flex: 1, height: 3, borderRadius: 3, background: "rgba(255,255,255,0.35)", overflow: "hidden" }
        },
          React.createElement("div", {
            style: {
              width: (i < idx ? 100 : i > idx ? 0 : progress*100) + "%",
              height: "100%", background: "white", transition: "width 0.1s linear",
            }
          })
        );
      })
    ),
    /* Owner header */
    React.createElement("div", {
      style: { padding: "6px 14px", display: "flex", alignItems: "center", gap: 10 }
    },
      owner && React.createElement(CmAvatar, { name: owner.name, size: 36 }),
      React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "#1A1F2A" } }, owner ? owner.name : "Unknown"),
        React.createElement("div", { style: { fontSize: 11, color: "rgba(0,0,0,0.55)" } }, cmFmtTime(story.createdAt))
      ),
      React.createElement("button", {
        onClick: function(e){ e.stopPropagation(); props.onClose(); },
        style: { background: "rgba(0,0,0,0.15)", border: "none", color: "#1A1F2A", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }
      }, Cmi.close)
    ),
    /* Content */
    React.createElement("div", {
      style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 30 }
    },
      React.createElement("div", {
        style: { fontSize: 28, fontWeight: 800, color: "#1A1F2A", textAlign: "center", lineHeight: 1.3, textShadow: "0 2px 10px rgba(255,255,255,0.4)" }
      }, story.text || "")
    ),
    /* Reply */
    React.createElement("div", {
      onClick: function(e){ e.stopPropagation(); },
      style: { padding: "14px 14px calc(14px + env(safe-area-inset-bottom))", background: "rgba(0,0,0,0.15)" }
    },
      React.createElement("input", {
        placeholder: cm("replyToStory"),
        style: {
          width: "100%", padding: "12px 16px", borderRadius: 24,
          border: "none", outline: "none",
          background: "rgba(255,255,255,0.9)", color: "#1A1F2A",
          fontFamily: "inherit", fontSize: 14,
          boxSizing: "border-box",
        }
      })
    )
  );
}

/* Story creator — pick a color + text */
function StoryCreator(props) {
  var useState = React.useState;
  var [text, setText] = useState("");
  var [bg, setBg] = useState("#C2F2E0");
  var bgOptions = [
    "#C2F2E0","#C8D9FF","#FFD4BB","#FFC6D3","#E1C8FB","#EAD4F5","#FFE8A0","#F1F3F6"
  ];

  function publish() {
    cmAddStory({ ownerId: "me", kind: "colors", bg: bg, text: text.trim(), viewed: false });
    cmToast("Status publie !", "info");
    props.onDone();
  }

  return React.createElement("div", {
    style: {
      position: "fixed", inset: 0, zIndex: 900,
      background: bg, display: "flex", flexDirection: "column",
    }
  },
    /* Top bar */
    React.createElement("div", {
      style: { padding: "14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      React.createElement("button", {
        onClick: props.onClose,
        style: { background: "rgba(0,0,0,0.1)", border: "none", color: "#1A1F2A", width: 38, height: 38, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
      }, Cmi.close),
      React.createElement(CmBtn, { variant: "primary", size: "md", onClick: publish, disabled: !text.trim() }, "Publier")
    ),
    React.createElement("div", {
      style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 30 }
    },
      React.createElement("textarea", {
        value: text,
        onChange: function(e){ setText(e.target.value); },
        placeholder: "Tapote ici...",
        maxLength: 200,
        style: {
          width: "100%", minHeight: 120,
          background: "transparent", border: "none", outline: "none",
          textAlign: "center", color: "#1A1F2A",
          fontSize: 28, fontWeight: 800,
          fontFamily: "inherit", resize: "none",
        },
        autoFocus: true,
      })
    ),
    /* Color picker */
    React.createElement("div", {
      style: { padding: "14px 14px calc(14px + env(safe-area-inset-bottom))", display: "flex", gap: 10, overflowX: "auto" }
    },
      bgOptions.map(function(c) {
        return React.createElement("button", {
          key: c,
          onClick: function(){ setBg(c); },
          style: {
            width: 40, height: 40, borderRadius: "50%",
            background: c, border: "none", cursor: "pointer", flexShrink: 0,
            boxShadow: bg === c ? "0 0 0 3px rgba(0,0,0,0.4)" : "0 2px 6px rgba(0,0,0,0.1)",
          }
        });
      })
    )
  );
}
