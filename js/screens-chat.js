/* Chrome Messenger — Chat conversation screen */

function ChatScreen(props) {
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var [input, setInput] = useState("");
  var [, forceRender] = useState(0);
  var scrollRef = useRef(null);
  var inputRef = useRef(null);

  var conv = cmFindConversation(props.convId);
  if (!conv) return null;
  var contacts = cmGetContacts();
  var other = conv.type === "direct" ? cmContactById(contacts, conv.contactId) : null;
  var title = conv.type === "group" ? conv.name : (other ? other.name : "Inconnu");

  var messages = cmGetMessages(conv.id);

  useEffect(function(){
    /* Decrypt all messages of this conversation on open (lazy, per-conv) */
    cmDecryptConversation(conv.id).then(function(){
      /* Mark incoming as read */
      var msgs = cmGetMessages(conv.id);
      var changed = false;
      msgs.forEach(function(m){ if (m.authorId !== "me" && m.readByMe === false) { m.readByMe = true; changed = true; } });
      if (changed) cmSetMessages(conv.id, msgs);
      /* Prune old messages (keep hot 200) */
      cmPruneOldMessages(conv.id);
      forceRender(Date.now());
      setTimeout(function(){
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 20);
    });
  }, [conv.id]);

  async function send() {
    var text = input.trim();
    if (!text) return;
    await cmAddEncryptedMessage(conv.id, text, "me");
    /* Decrypt the one we just stored for display */
    var msgs = cmGetMessages(conv.id);
    var last = msgs[msgs.length - 1];
    last._text = text; /* shortcut: we already have plaintext */
    setInput("");
    forceRender(Date.now());
    setTimeout(function(){
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 20);
    /* Simulated encrypted auto-reply after 1.5s */
    if (conv.type === "direct" && other) {
      setTimeout(async function(){
        var replies = ["Ah ouais ?", "Je vois.", "D'accord 👍", "Cool !", "On en parle plus tard"];
        var r = replies[Math.floor(Math.random() * replies.length)];
        /* Encrypt incoming message with the same shared key (as if server relayed) */
        var payload = await cmEncryptMessage(conv.id, r);
        cmAddMessage(conv.id, {
          authorId: other.id, at: Date.now(), readByMe: false, cipher: payload,
          _text: r, /* already have plaintext */
        });
        forceRender(Date.now());
        setTimeout(function(){
          if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 20);
      }, 1500);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  /* Group messages by day for day dividers */
  var groupedByDay = [];
  var lastDay = null;
  messages.forEach(function(m){
    var d = new Date(m.at); d.setHours(0,0,0,0);
    var key = d.getTime();
    if (key !== lastDay) {
      groupedByDay.push({ day: key, msgs: [m] });
      lastDay = key;
    } else {
      groupedByDay[groupedByDay.length-1].msgs.push(m);
    }
  });

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, display: "flex", flexDirection: "column" }
  },
    /* Chat header */
    React.createElement("div", {
      style: {
        height: 64, padding: "0 14px",
        display: "flex", alignItems: "center", gap: 10,
        background: CM.bg,
        borderBottom: "1px solid " + CM.line,
        position: "sticky", top: 0, zIndex: 40,
      }
    },
      React.createElement(CmIconBtn, { onClick: props.onBack }, Cmi.back),
      React.createElement(CmAvatar, { name: title, size: 40 }),
      React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        React.createElement("div", {
          style: { fontSize: 15, fontWeight: 700, color: CM.title, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
        }, title),
        React.createElement("div", { style: { fontSize: 11, color: CM.sub, display: "flex", alignItems: "center", gap: 4 } },
          React.createElement("span", { style: { color: CM.primary } }, "🔒"),
          conv.type === "direct" && other ? cm("online") : (conv.memberIds || []).length + " membres"
        )
      ),
      React.createElement(CmIconBtn, { label: "call" }, Cmi.phone),
      React.createElement(CmIconBtn, { label: "video" }, Cmi.video)
    ),

    /* Messages scroll area */
    React.createElement("div", {
      ref: scrollRef,
      style: {
        flex: 1, overflowY: "auto",
        background: CM.bg2,
        padding: "14px 12px",
      }
    },
      groupedByDay.map(function(group, gi) {
        return React.createElement(React.Fragment, { key: gi },
          React.createElement("div", {
            style: { textAlign: "center", margin: "14px 0 10px" }
          },
            React.createElement("span", {
              style: {
                background: CM.surface, color: CM.sub,
                fontSize: 11, fontWeight: 600,
                padding: "5px 12px", borderRadius: 100,
              }
            }, cmFmtDayLabel(group.day))
          ),
          group.msgs.map(function(m) {
            var mine = m.authorId === "me";
            return React.createElement("div", {
              key: m.id,
              style: {
                display: "flex", justifyContent: mine ? "flex-end" : "flex-start",
                marginBottom: 4, padding: "0 4px",
              }
            },
              React.createElement("div", {
                style: {
                  maxWidth: "78%",
                  padding: "8px 12px", borderRadius: 16,
                  background: mine ? CM.primary : CM.surface,
                  color: mine ? CM.onPrimary : CM.body,
                  borderBottomRightRadius: mine ? 4 : 16,
                  borderBottomLeftRadius: mine ? 16 : 4,
                  fontSize: 14, lineHeight: 1.35,
                  boxShadow: CM.shadow,
                  wordBreak: "break-word",
                }
              },
                React.createElement("div", null, cmMsgText(m)),
                React.createElement("div", {
                  style: {
                    fontSize: 10, color: mine ? "rgba(255,255,255,0.8)" : CM.muted,
                    marginTop: 4, display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end",
                  }
                },
                  cmFmtTime(m.at),
                  mine && React.createElement("span", {
                    style: { display: "inline-flex" }
                  }, Cmi.checkDouble)
                )
              )
            );
          })
        );
      })
    ),

    /* Input */
    React.createElement("div", {
      style: {
        padding: "10px 12px",
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
        background: CM.bg,
        borderTop: "1px solid " + CM.line,
        display: "flex", alignItems: "center", gap: 8,
      }
    },
      React.createElement(CmIconBtn, { label: "attach" }, Cmi.attach),
      React.createElement("input", {
        ref: inputRef,
        value: input,
        onChange: function(e){ setInput(e.target.value); },
        onKeyDown: handleKeyDown,
        placeholder: cm("typeMessage"),
        style: {
          flex: 1, padding: "12px 16px", borderRadius: 24,
          background: CM.surface2,
          border: "none", outline: "none",
          fontFamily: "inherit", fontSize: 14, color: CM.body,
        }
      }),
      input.trim() ?
        React.createElement(CmIconBtn, {
          onClick: send,
          color: CM.onPrimary,
          style: { background: CM.primary, boxShadow: CM.shadowGlow }
        }, Cmi.send) :
        React.createElement(CmIconBtn, { label: "voice" }, Cmi.mic)
    )
  );
}
