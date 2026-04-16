/* Chrome Messenger — Shared React components */

/* === CHAMELEON LOGO ===
 * Faithful to user's image (1).png — a stylized chameleon curled in a G-shape.
 * Each viewBox unit must match precisely to avoid the "grossier" look.
 *
 * Structure (on 100x100 viewBox for clean coords):
 *   - Body: filled disc, radius 40, centered at (48, 55) — slightly offset left/down
 *   - Top-right NOTCH cut out of body so head protrudes
 *   - Head: small rounded rect at top-right, overlapping the notch
 *   - MAIN eye: white ring with black pupil + highlight in lower-left of body
 *   - HEAD eye: tiny black dot on the head
 *
 * The key visual signature: the head is CLEARLY separate (a distinct rectangle
 * with corners), not a blob. The body is a pure disc with a rectangular bite
 * removed — exactly like the reference image.
 */
/* Uses the user's original PNG directly for pixel-perfect fidelity.
 * Theme color adaptation via CSS hue-rotate: base logo is mint (#30D79C ~ hue 155deg).
 * Each theme has a hueShift pre-computed against mint. */
const CM_LOGO_HUE_SHIFT = {
  mint: 0, blue: 65, orange: -125, coral: -135, purple: 95, lilac: 100,
  yellow: -100, charcoal: 0, dark: 0,
};
const CM_LOGO_SATURATE = {
  mint: 1, blue: 1, orange: 1.2, coral: 1.1, purple: 1, lilac: 0.85,
  yellow: 1.2, charcoal: 0, dark: 1,
};
const CM_LOGO_BRIGHTNESS = {
  mint: 1, blue: 1, orange: 1, coral: 1, purple: 1, lilac: 1,
  yellow: 1, charcoal: 0.35, dark: 1,
};

function ChameleonLogo(props) {
  var size = props.size || 36;
  var hue = CM_LOGO_HUE_SHIFT[CM.themeId] != null ? CM_LOGO_HUE_SHIFT[CM.themeId] : 0;
  var sat = CM_LOGO_SATURATE[CM.themeId] != null ? CM_LOGO_SATURATE[CM.themeId] : 1;
  var bri = CM_LOGO_BRIGHTNESS[CM.themeId] != null ? CM_LOGO_BRIGHTNESS[CM.themeId] : 1;
  return React.createElement("img", {
    src: "icons/logo.png",
    alt: "Chrome Messenger",
    style: Object.assign({
      display: "block",
      width: size + "px", height: size + "px",
      objectFit: "contain",
      background: "transparent",
      filter: "hue-rotate(" + hue + "deg) saturate(" + sat + ") brightness(" + bri + ")",
    }, props.style || {}),
    draggable: false,
  });
}

/* === ICONS === (Lucide-inspired, stroke-based) */
const Cmi = {
  home: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"}),React.createElement("path",{d:"M9 22V12h6v10"})),
  homeFilled: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"currentColor"},React.createElement("path",{d:"M10.29 3.86a2 2 0 012.42 0l7 5.4A2 2 0 0120.5 11V20a2 2 0 01-2 2h-3v-6h-3v6h-3a2 2 0 01-2-2v-9a2 2 0 01.79-1.74z"})),
  chat: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"})),
  tasks: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("rect",{x:3,y:4,width:18,height:18,rx:2}),React.createElement("path",{d:"M16 2v4M8 2v4M3 10h18"})),
  games: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M6 12h4M8 10v4M15 13h.01M18 11h.01M17.32 5H6.68a4 4 0 00-3.978 3.59L2.11 15a3 3 0 005.969.44L8.5 14h7l.421 1.44A3 3 0 0021.89 15l-.59-6.41A4 4 0 0017.32 5z"})),
  bell: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"})),
  menu: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M3 6h18M3 12h18M3 18h18"})),
  back: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M19 12H5M12 19l-7-7 7-7"})),
  close: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M18 6L6 18M6 6l12 12"})),
  search: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:11,cy:11,r:7}),React.createElement("path",{d:"M21 21l-4.35-4.35"})),
  plus: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M12 5v14M5 12h14"})),
  chevR: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M9 18l6-6-6-6"})),
  chevL: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M15 18l-6-6 6-6"})),
  check: React.createElement("svg",{width:16,height:16,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":3,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M20 6L9 17l-5-5"})),
  trash: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"})),
  calendar: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("rect",{x:3,y:4,width:18,height:18,rx:2}),React.createElement("path",{d:"M16 2v4M8 2v4M3 10h18"})),
  send: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"})),
  attach: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"})),
  mic: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"})),
  phone: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.339 1.85.573 2.81.7A2 2 0 0122 16.92z"})),
  video: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("polygon",{points:"23 7 16 12 23 17 23 7"}),React.createElement("rect",{x:1,y:5,width:15,height:14,rx:2})),
  check2: React.createElement("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":3,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M20 6L9 17l-5-5"})),
  checkDouble: React.createElement("svg",{width:16,height:14,viewBox:"0 0 30 22",fill:"none",stroke:"currentColor","stroke-width":3,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M1 13l5 5 10-10M13 13l5 5 10-10"})),
  location: React.createElement("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"}),React.createElement("circle",{cx:12,cy:10,r:3})),
  clock: React.createElement("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:12,cy:12,r:10}),React.createElement("path",{d:"M12 6v6l4 2"})),
  settings: React.createElement("svg",{width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:12,cy:12,r:3}),React.createElement("path",{d:"M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"})),
  moon: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"})),
  sun: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:12,cy:12,r:5}),React.createElement("path",{d:"M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"})),
  heart: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"})),
  gem: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("path",{d:"M6 3h12l4 6-10 13L2 9z"}),React.createElement("path",{d:"M11 3L8 9l4 13 4-13-3-6M2 9h20"})),
  info: React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},React.createElement("circle",{cx:12,cy:12,r:10}),React.createElement("path",{d:"M12 16v-4M12 8h.01"})),
};

/* === AVATAR === (initials on colored circle) */
function CmAvatar(props) {
  var name = props.name || "?";
  var size = props.size || 40;
  var info = cmAvatar(name);
  var border = props.border;
  return React.createElement("div", {
    style: {
      width: size, height: size, borderRadius: "50%",
      background: info.color, color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.4), fontWeight: 700,
      fontFamily: "inherit", flexShrink: 0,
      boxShadow: border ? ("0 0 0 2.5px " + (typeof border === "string" ? border : CM.primary) + ", 0 0 0 4.5px white") : "none",
      userSelect: "none",
    }
  }, info.initials);
}

/* === BUTTON === */
function CmBtn(props) {
  var variant = props.variant || "primary";
  var size = props.size || "md";
  var sizes = {
    sm: { padding: "8px 14px", fontSize: 12, borderRadius: 10 },
    md: { padding: "12px 20px", fontSize: 14, borderRadius: 12 },
    lg: { padding: "15px 26px", fontSize: 15, borderRadius: 14 },
  };
  var variants = {
    primary:   { background: CM.primary, color: CM.onPrimary, border: "none", boxShadow: CM.shadowGlow },
    secondary: { background: CM.surface2, color: CM.title, border: "none" },
    outline:   { background: "transparent", color: CM.primary, border: "1.5px solid " + CM.primary },
    ghost:     { background: "transparent", color: CM.body, border: "none" },
    soft:      { background: CM.primaryFaint, color: CM.primary, border: "none" },
  };
  var base = {
    fontFamily: "inherit", fontWeight: 700,
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.5 : 1,
    transition: "transform 0.12s",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, userSelect: "none",
    width: props.fullWidth ? "100%" : "auto",
  };
  return React.createElement("button", {
    onClick: props.disabled ? null : props.onClick,
    type: props.type || "button",
    style: Object.assign({}, base, sizes[size], variants[variant], props.style || {}),
  }, props.children);
}

/* === FILTER PILL === (like All/Unread/Groups/Favoris in screens) */
function CmPill(props) {
  var active = props.active;
  return React.createElement("button", {
    onClick: props.onClick,
    style: {
      padding: "8px 16px", borderRadius: 100,
      background: active ? CM.primarySoft : (CM.darkMode ? CM.surface2 : CM.surface2),
      color: active ? CM.primaryDark : CM.body,
      border: "none", fontSize: 13, fontWeight: 600,
      cursor: "pointer", fontFamily: "inherit",
      transition: "background 0.15s",
      flexShrink: 0,
    }
  }, props.children);
}

/* === SEARCH BAR === (home style) */
function CmSearch(props) {
  return React.createElement("div", {
    onClick: props.onClick,
    style: {
      display: "flex", alignItems: "center", gap: 10,
      background: CM.surface2, borderRadius: 14,
      padding: "11px 14px", cursor: props.onClick ? "pointer" : "default",
      margin: props.margin || "0 22px",
    }
  },
    React.createElement("span", { style: { color: CM.muted, display: "inline-flex" } }, Cmi.search),
    props.value !== undefined ?
      React.createElement("input", {
        value: props.value,
        onChange: function(e){ props.onChange && props.onChange(e.target.value); },
        placeholder: props.placeholder || cm("search_placeholder"),
        style: {
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontFamily: "inherit", fontSize: 14, color: CM.body,
        }
      }) :
      React.createElement("span", { style: { flex: 1, color: CM.muted, fontSize: 14 } }, props.placeholder || cm("search_placeholder"))
  );
}

/* === TOAST === */
var _cmToastTimer = null;
function cmToast(msg, type) {
  type = type || "info";
  var el = document.getElementById("cm-toast");
  if (!el) { el = document.createElement("div"); el.id = "cm-toast"; document.body.appendChild(el); }
  var bg = type === "error" ? "#FF4757" : CM.primary;
  el.textContent = msg;
  el.style.cssText =
    "position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(0);z-index:9999;" +
    "background:" + bg + ";color:" + CM.onPrimary + ";padding:12px 22px;border-radius:14px;" +
    "font:600 13px 'Plus Jakarta Sans',sans-serif;" +
    "box-shadow:0 8px 24px rgba(0,0,0,0.2);opacity:1;max-width:85%;text-align:center;" +
    "transition:opacity .3s, transform .3s;";
  if (_cmToastTimer) clearTimeout(_cmToastTimer);
  _cmToastTimer = setTimeout(function() {
    if (el) { el.style.opacity = "0"; el.style.transform = "translateX(-50%) translateY(-20px)"; }
  }, 2200);
}

/* === TOP HEADER ===
 * Left slot + centered chameleon logo (tappable → theme palette) + right slot.
 * The logo is the signature element of the app. */
function CmHeader(props) {
  return React.createElement("div", {
    style: {
      height: 64, padding: "0 18px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: CM.bg,
      position: "sticky", top: 0, zIndex: 40,
    }
  },
    /* Left slot */
    React.createElement("div", { style: { width: 42, display: "flex", alignItems: "center", justifyContent: "flex-start" } },
      props.left || null
    ),
    /* Centered chameleon — tap → open theme picker */
    React.createElement("button", {
      onClick: props.onLogoTap,
      style: { background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" },
      "aria-label": cm("theme"),
    },
      React.createElement(ChameleonLogo, { size: 36 }),
      props.title && React.createElement("span", {
        style: { fontSize: 20, fontWeight: 800, color: CM.title }
      }, props.title)
    ),
    /* Right slot */
    React.createElement("div", { style: { width: 42, display: "flex", alignItems: "center", justifyContent: "flex-end" } },
      props.right || null
    )
  );
}

function CmIconBtn(props) {
  return React.createElement("button", {
    onClick: props.onClick,
    style: Object.assign({
      width: 42, height: 42, borderRadius: 12,
      background: "transparent", border: "none",
      color: props.color || CM.body, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "inherit", position: "relative",
    }, props.style || {}),
    "aria-label": props.label,
  }, props.children,
    props.badge && React.createElement("span", {
      style: {
        position: "absolute", top: 6, right: 6,
        width: 8, height: 8, borderRadius: "50%",
        background: CM.primary, border: "2px solid " + CM.bg,
      }
    })
  );
}

/* === BOTTOM NAV === */
function CmBottomNav(props) {
  var items = props.items; /* [{id,label,icon,badge}] */
  var active = props.active;
  return React.createElement("div", {
    style: {
      position: "fixed", bottom: 0, left: 0, right: 0,
      maxWidth: 480, margin: "0 auto",
      background: CM.bg,
      borderTop: "1px solid " + CM.line,
      display: "flex", alignItems: "center", justifyContent: "space-around",
      padding: "8px 0",
      paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
      zIndex: 100,
    }
  },
    items.map(function(it) {
      var isActive = active === it.id;
      return React.createElement("button", {
        key: it.id,
        onClick: function(){ props.onNav(it.id); },
        style: {
          background: "none", border: "none", cursor: "pointer",
          padding: "6px 10px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          fontFamily: "inherit",
          color: isActive ? CM.primary : CM.muted,
          position: "relative",
        }
      },
        /* Active pill background */
        isActive && React.createElement("div", {
          style: {
            position: "absolute", top: 2, width: 44, height: 30, borderRadius: 14,
            background: CM.primarySoft, zIndex: 0,
          }
        }),
        React.createElement("span", { style: { position: "relative", zIndex: 1 } }, it.icon,
          it.badge && React.createElement("span", {
            style: { position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: CM.primary, border: "2px solid " + CM.bg }
          })
        ),
        React.createElement("span", { style: { fontSize: 11, fontWeight: isActive ? 800 : 600, position: "relative", zIndex: 1 } }, it.label)
      );
    })
  );
}

/* === FAB === floating bottom-right (new chat) */
function CmFab(props) {
  return React.createElement("button", {
    onClick: props.onClick,
    style: Object.assign({
      position: "fixed",
      bottom: 90, right: "calc(50% - 240px + 20px)",
      width: 52, height: 52, borderRadius: 16,
      background: CM.primary, color: CM.onPrimary,
      border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: CM.shadowGlow,
      zIndex: 60,
    }, props.style || {})
  }, props.children || Cmi.chat);
}

/* === SHEET (bottom sheet modal) === */
function CmSheet(props) {
  return React.createElement("div", {
    onClick: props.onClose,
    style: {
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "flex-end",
      animation: "cmFadeIn 0.2s",
    }
  },
    React.createElement("div", {
      onClick: function(e){ e.stopPropagation(); },
      style: {
        background: CM.bg, width: "100%", maxWidth: 480, margin: "0 auto",
        borderRadius: "24px 24px 0 0", padding: "22px",
        maxHeight: "85vh", overflowY: "auto",
        animation: "cmSlideUp 0.25s",
      }
    },
      React.createElement("div", { style: { width: 40, height: 4, borderRadius: 4, background: CM.line2, margin: "0 auto 18px" } }),
      props.children
    )
  );
}

/* === THEME PALETTE (tap on chameleon) === */
function CmThemePalette(props) {
  var useState = React.useState;
  var [, force] = useState(0);
  var currentId = CM.themeId;
  var lightThemes = Object.values(CM_THEMES).filter(function(t){ return !t.darkMode; });
  var dark = CM_THEMES.dark;
  return React.createElement(CmSheet, { onClose: props.onClose },
    React.createElement("h3", {
      style: { margin: 0, fontSize: 20, fontWeight: 800, color: CM.title, textAlign: "center" }
    }, cm("themes")),
    React.createElement("p", {
      style: { margin: "6px 0 22px", fontSize: 13, color: CM.sub, textAlign: "center" }
    }, cm("themeDesc")),
    /* Color grid */
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 } },
      lightThemes.map(function(t){
        var active = t.id === currentId;
        return React.createElement("button", {
          key: t.id,
          onClick: function(){ cmApplyTheme(t.id); force(Date.now()); if(props.onChange) props.onChange(t.id); },
          style: {
            background: "transparent", border: "none", cursor: "pointer",
            padding: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            fontFamily: "inherit",
          }
        },
          React.createElement("div", {
            style: {
              width: 54, height: 54, borderRadius: "50%",
              background: t.primary,
              boxShadow: active ? ("0 0 0 3px " + CM.bg + ", 0 0 0 5px " + t.primary) : "0 4px 12px " + hexToRgba(t.primary, 0.35),
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 20,
              transition: "transform 0.15s",
              transform: active ? "scale(1.08)" : "scale(1)",
            }
          }, active ? "✓" : ""),
          React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: CM.sub } }, t.name)
        );
      })
    ),
    /* Dark mode toggle */
    React.createElement("div", {
      style: {
        marginTop: 22, padding: "14px 16px", borderRadius: 14,
        background: CM.surface2,
        display: "flex", alignItems: "center", gap: 12,
      }
    },
      React.createElement("div", { style: { color: CM.body } }, Cmi.moon),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: CM.title } }, cm("darkMode")),
        React.createElement("div", { style: { fontSize: 12, color: CM.sub, marginTop: 2 } }, dark.name)
      ),
      React.createElement("button", {
        onClick: function(){
          cmApplyTheme(CM.darkMode ? "mint" : "dark");
          force(Date.now());
          if (props.onChange) props.onChange(CM.themeId);
        },
        style: {
          width: 46, height: 26, borderRadius: 100,
          background: CM.darkMode ? CM.primary : CM.line2, border: "none",
          position: "relative", cursor: "pointer", padding: 0,
          transition: "background 0.2s",
        }
      },
        React.createElement("div", {
          style: {
            position: "absolute", top: 3,
            left: CM.darkMode ? 23 : 3, width: 20, height: 20, borderRadius: "50%",
            background: "white", transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }
        })
      )
    )
  );
}
