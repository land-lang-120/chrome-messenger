/* Chrome Messenger — Todolist screen (month + week toggle)
 * Fidelity: design 78 (month view) vs 79 (week view).
 */

function TodolistScreen(props) {
  var useState = React.useState;
  var [mode, setMode] = useState("month"); /* month | week */
  var [selectedDate, setSelectedDate] = useState(function(){ var d = new Date(); d.setHours(0,0,0,0); return d.getTime(); });
  var [addOpen, setAddOpen] = useState(false);
  var [filter, setFilter] = useState("all");
  var [themeOpen, setThemeOpen] = useState(false);

  var selDate = new Date(selectedDate);
  var tasks = cmTasksForDate(selectedDate);
  var daysWithTasks = cmDaysWithTasks();

  if (filter !== "all") tasks = tasks.filter(function(t){ return t.type === filter; });

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 100 }
  },
    React.createElement(CmHeader, {
      onLogoTap: function(){ setThemeOpen(true); },
      left: React.createElement(CmIconBtn, {
        onClick: function(){ setMode(mode === "month" ? "week" : "month"); },
        label: "toggle view",
      }, mode === "month" ? Cmi.calendar : Cmi.info),
      right: React.createElement(CmIconBtn, { onClick: props.onOpenMenu }, Cmi.menu),
    }),

    /* Calendar view */
    mode === "month" ?
      React.createElement(MonthView, {
        selectedDate: selectedDate,
        daysWithTasks: daysWithTasks,
        onSelect: function(ms){ setSelectedDate(ms); },
      }) :
      React.createElement(WeekStrip, {
        selectedDate: selectedDate,
        daysWithTasks: daysWithTasks,
        onSelect: function(ms){ setSelectedDate(ms); },
      }),

    /* Today's tasks section */
    React.createElement("div", {
      style: { padding: "18px 22px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }
    },
      React.createElement("h3", {
        style: { margin: 0, fontSize: 18, fontWeight: 800, color: CM.title }
      }, cm("todayTasks")),
      React.createElement("button", {
        onClick: function(){ setAddOpen(true); },
        style: {
          background: CM.surface, border: "1px solid " + CM.line, color: CM.body,
          padding: "8px 14px", borderRadius: 100, cursor: "pointer",
          fontFamily: "inherit", fontWeight: 600, fontSize: 13,
          display: "inline-flex", alignItems: "center", gap: 4,
        }
      }, cm("add"), Cmi.plus)
    ),

    /* Filters */
    React.createElement("div", {
      style: { display: "flex", gap: 8, padding: "12px 22px 4px", overflowX: "auto" }
    },
      [{id:"all",label:cm("filter_all")}, {id:"individual",label:cm("task_individual")}, {id:"commun",label:cm("task_commun")}, {id:"daily",label:cm("task_daily")}].map(function(f){
        return React.createElement(CmPill, {
          key: f.id, active: filter === f.id,
          onClick: function(){ setFilter(f.id); },
        }, f.label);
      })
    ),

    /* Task rows */
    React.createElement("div", { style: { padding: "10px 22px 0" } },
      tasks.length === 0 && React.createElement("div", {
        style: { textAlign: "center", padding: 40, color: CM.muted, fontSize: 14 }
      },
        React.createElement("div", { style: { fontSize: 34, marginBottom: 8 } }, "🌿"),
        cm("noTasks")
      ),
      tasks.map(function(t) {
        return React.createElement("div", {
          key: t.id,
          style: {
            padding: 14, borderRadius: 14, marginBottom: 8,
            background: CM.surface,
            border: "1px solid " + CM.line,
            display: "flex", alignItems: "center", gap: 12,
          }
        },
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: CM.title, marginBottom: 3 } }, t.title),
            React.createElement("div", { style: { fontSize: 12, color: CM.sub } },
              t.with ? ("with " + t.with) : ""
            )
          ),
          React.createElement("div", { style: { textAlign: "right", fontSize: 11, color: CM.sub } },
            t.place && React.createElement("div", {
              style: { display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", fontWeight: 600 }
            }, Cmi.location, t.place),
            React.createElement("div", {
              style: { display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 2 }
            }, Cmi.clock, cmFmtTime(t.startAt) + " - " + cmFmtTime(t.endAt))
          )
        );
      })
    ),

    /* Add task sheet */
    addOpen && React.createElement(AddTaskSheet, {
      defaultDate: selectedDate,
      onClose: function(){ setAddOpen(false); },
      onSaved: function(){ setAddOpen(false); },
    }),

    /* Theme palette */
    themeOpen && React.createElement(CmThemePalette, { onClose: function(){ setThemeOpen(false); }, onChange: props.onThemeChange })
  );
}

/* Month view — design 78 */
function MonthView(props) {
  var useState = React.useState;
  var [monthOffset, setMonthOffset] = useState(0);
  var sel = new Date(props.selectedDate);
  var first = new Date(sel.getFullYear(), sel.getMonth() + monthOffset, 1);
  var year = first.getFullYear();
  var monthIdx = first.getMonth();
  var monthName = first.toLocaleDateString(cmLocale(), { month: "long" });

  /* Monday-start week layout */
  var firstDay = new Date(year, monthIdx, 1);
  var firstWeekday = (firstDay.getDay() + 6) % 7; /* 0=Mon */
  var daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  var cells = [];
  for (var i = 0; i < firstWeekday; i++) cells.push(null);
  for (var d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIdx, d).getTime());

  var today = new Date(); today.setHours(0,0,0,0);
  var todayMs = today.getTime();

  return React.createElement("div", { style: { padding: "0 14px" } },
    React.createElement("div", {
      style: { padding: "8px 22px", margin: "10px 0", borderRadius: 16, background: CM.surface, border: "1px solid " + CM.line }
    },
      /* Month header */
      React.createElement("div", {
        style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0 14px" }
      },
        React.createElement("button", { onClick: function(){ setMonthOffset(monthOffset - 1); }, style: navBtnStyle() }, Cmi.chevL),
        React.createElement("h3", {
          style: { margin: 0, fontSize: 16, fontWeight: 800, color: CM.title, textTransform: "capitalize" }
        }, monthName + " " + year),
        React.createElement("button", { onClick: function(){ setMonthOffset(monthOffset + 1); }, style: navBtnStyle() }, Cmi.chevR)
      ),
      /* Weekday header */
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, paddingBottom: 6 }
      },
        ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(function(w){
          return React.createElement("div", {
            key: w,
            style: { fontSize: 11, fontWeight: 700, color: w === "Sun" ? CM.primary : CM.sub, textAlign: "center" }
          }, w);
        })
      ),
      /* Days grid */
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }
      },
        cells.map(function(ms, i) {
          if (ms === null) return React.createElement("div", { key: "e"+i, style: { height: 38 } });
          var isSel = ms === props.selectedDate;
          var isToday = ms === todayMs;
          var hasTask = !!props.daysWithTasks[ms];
          var isSunday = (i % 7) === 6;
          var dayNum = new Date(ms).getDate();
          return React.createElement("button", {
            key: ms,
            onClick: function(){ props.onSelect(ms); },
            style: {
              height: 38, border: "none", background: "transparent",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              color: isSel ? CM.primaryDark : (isToday ? CM.title : (isSunday ? CM.primary : CM.body)),
              cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }
          },
            React.createElement("div", {
              style: {
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isSel ? CM.primarySoft : (isToday && !isSel ? CM.surface2 : (hasTask ? CM.primarySoft : "transparent")),
                border: isSel ? ("1.5px solid " + CM.primary) : "none",
              }
            }, dayNum)
          );
        })
      )
    )
  );
}

/* Week strip — design 79 */
function WeekStrip(props) {
  var sel = new Date(props.selectedDate);
  var weekStart = new Date(sel); weekStart.setDate(sel.getDate() - ((sel.getDay() + 6) % 7));
  weekStart.setHours(0,0,0,0);
  var days = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
    days.push(d);
  }
  var monthName = sel.toLocaleDateString(cmLocale(), { month: "long", year: "numeric" });

  return React.createElement("div", { style: { padding: "0 14px" } },
    React.createElement("div", {
      style: { padding: "14px 14px", margin: "10px 0" }
    },
      React.createElement("div", {
        style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }
      },
        React.createElement("button", {
          onClick: function(){ var d = new Date(props.selectedDate); d.setDate(d.getDate()-7); props.onSelect(d.getTime()); },
          style: navBtnStyle(),
        }, Cmi.chevL),
        React.createElement("h3", {
          style: { margin: 0, fontSize: 16, fontWeight: 800, color: CM.title, textTransform: "capitalize" }
        }, monthName),
        React.createElement("button", {
          onClick: function(){ var d = new Date(props.selectedDate); d.setDate(d.getDate()+7); props.onSelect(d.getTime()); },
          style: navBtnStyle(),
        }, Cmi.chevR)
      ),
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }
      },
        days.map(function(d) {
          var ms = d.getTime();
          var isSel = ms === props.selectedDate;
          return React.createElement("button", {
            key: ms,
            onClick: function(){ props.onSelect(ms); },
            style: {
              background: isSel ? CM.surface2 : "transparent",
              border: "none", cursor: "pointer",
              padding: "10px 4px", borderRadius: 12,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              fontFamily: "inherit",
            }
          },
            React.createElement("div", {
              style: { fontSize: 12, fontWeight: 600, color: isSel ? CM.title : CM.sub, textTransform: "capitalize" }
            }, cmShortDay(d)),
            React.createElement("div", {
              style: { fontSize: 14, fontWeight: 800, color: isSel ? CM.title : CM.body }
            }, d.getDate())
          );
        })
      )
    )
  );
}

function navBtnStyle() {
  return {
    width: 32, height: 32, borderRadius: "50%",
    background: CM.surface2, border: "none", color: CM.body,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit",
  };
}

/* Add task sheet */
function AddTaskSheet(props) {
  var useState = React.useState;
  var [title, setTitle] = useState("");
  var [withWho, setWithWho] = useState("");
  var [place, setPlace] = useState("");
  var [type, setType] = useState("individual");
  var [time, setTime] = useState("10:00");
  var [duration, setDuration] = useState(30);

  function save() {
    if (!title.trim()) { cmToast("Titre requis", "error"); return; }
    var base = new Date(props.defaultDate);
    var [h,m] = time.split(":").map(Number);
    base.setHours(h || 10, m || 0, 0, 0);
    cmAddTask({
      title: title.trim(),
      with: withWho.trim(),
      place: place.trim(),
      type: type,
      startAt: base.getTime(),
      endAt: base.getTime() + (duration || 30) * 60000,
      done: false,
    });
    props.onSaved();
  }

  return React.createElement(CmSheet, { onClose: props.onClose },
    React.createElement("h3", {
      style: { margin: "0 0 18px", fontSize: 18, fontWeight: 800, color: CM.title }
    }, cm("addTask")),
    React.createElement("label", { style: labelStyle() }, cm("taskName")),
    React.createElement("input", {
      value: title, onChange: function(e){ setTitle(e.target.value); },
      placeholder: "Homework, RDV...", style: sheetInputStyle(), autoFocus: true,
    }),
    React.createElement("label", { style: labelStyle() }, cm("taskWith")),
    React.createElement("input", {
      value: withWho, onChange: function(e){ setWithWho(e.target.value); },
      placeholder: "Fred Larson", style: sheetInputStyle(),
    }),
    React.createElement("label", { style: labelStyle() }, cm("taskLocation")),
    React.createElement("input", {
      value: place, onChange: function(e){ setPlace(e.target.value); },
      placeholder: "Bafoussam", style: sheetInputStyle(),
    }),
    React.createElement("div", { style: { display: "flex", gap: 10 } },
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("label", { style: labelStyle() }, cm("taskStart")),
        React.createElement("input", {
          type: "time", value: time, onChange: function(e){ setTime(e.target.value); },
          style: sheetInputStyle(),
        })
      ),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("label", { style: labelStyle() }, "Duree (min)"),
        React.createElement("input", {
          type: "number", value: duration, onChange: function(e){ setDuration(parseInt(e.target.value)||30); },
          style: sheetInputStyle(),
        })
      )
    ),
    React.createElement("label", { style: labelStyle() }, cm("taskType")),
    React.createElement("div", { style: { display: "flex", gap: 8 } },
      ["individual","commun","daily"].map(function(t){
        return React.createElement(CmPill, {
          key: t, active: type === t, onClick: function(){ setType(t); },
        }, cm("task_" + t));
      })
    ),
    React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 22 } },
      React.createElement(CmBtn, { variant: "ghost", fullWidth: true, onClick: props.onClose }, cm("cancel")),
      React.createElement(CmBtn, { variant: "primary", fullWidth: true, onClick: save }, cm("save"))
    )
  );
}

function labelStyle() {
  return { display: "block", fontSize: 11, fontWeight: 700, color: CM.sub, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 14, marginBottom: 6 };
}
function sheetInputStyle() {
  return {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1px solid " + CM.line, background: CM.surface2,
    fontFamily: "inherit", fontSize: 14, color: CM.body,
    outline: "none", boxSizing: "border-box",
  };
}
