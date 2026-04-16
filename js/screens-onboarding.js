/* Chrome Messenger — Onboarding (welcome, phone, OTP, profile setup) */

function OnboardingFlow(props) {
  var useState = React.useState;
  var [step, setStep] = useState("welcome"); /* welcome | phone | otp | profile */
  var [phone, setPhone] = useState("");
  var [code, setCode] = useState("");
  var [name, setName] = useState("");
  var [sentCode, setSentCode] = useState("");
  var [err, setErr] = useState("");

  function sendCode() {
    if (!phone || phone.length < 6) { setErr("Numero invalide"); return; }
    /* Simulate SMS — real 6-digit code */
    var generated = String(100000 + Math.floor(Math.random() * 900000));
    setSentCode(generated);
    setErr("");
    setStep("otp");
    /* Show the code in a toast for demo purposes (no real SMS) */
    cmToast("Code demo: " + generated, "info");
  }

  function verify() {
    if (code === sentCode) {
      setErr("");
      setStep("profile");
    } else {
      setErr("Code incorrect");
    }
  }

  function finish() {
    if (!name.trim()) { setErr("Ton nom est requis"); return; }
    cmSetProfile({
      id: "me", name: name.trim(), phone: phone,
      avatar: null, bio: "", createdAt: Date.now(),
    });
    cmSetOnboarded(true);
    cmSeedIfNeeded();
    props.onDone();
  }

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, display: "flex", flexDirection: "column" }
  },
    step === "welcome" && React.createElement("div", {
      style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }
    },
      React.createElement("div", { style: { marginBottom: 28 } },
        React.createElement(ChameleonLogo, { size: 120 })
      ),
      React.createElement("h1", {
        style: { fontSize: 16, fontWeight: 600, color: CM.sub, margin: "0 0 6px" }
      }, cm("welcome")),
      React.createElement("h2", {
        style: { fontSize: 32, fontWeight: 800, color: CM.title, margin: "0 0 12px", letterSpacing: "-0.5px" }
      }, cm("appName")),
      React.createElement("p", {
        style: { fontSize: 15, color: CM.sub, margin: "0 0 40px", maxWidth: 320, lineHeight: 1.5 }
      }, cm("welcomeSub")),
      React.createElement(CmBtn, { variant: "primary", size: "lg", fullWidth: true, onClick: function(){ setStep("phone"); }, style: { maxWidth: 320 } },
        cm("getStarted")
      )
    ),

    step === "phone" && React.createElement("div", {
      style: { flex: 1, padding: 24, display: "flex", flexDirection: "column" }
    },
      React.createElement("button", {
        onClick: function(){ setStep("welcome"); },
        style: iconBtnStyle()
      }, Cmi.back),
      React.createElement("div", { style: { marginTop: 20, marginBottom: 32, textAlign: "center" } },
        React.createElement(ChameleonLogo, { size: 64 })
      ),
      React.createElement("h2", { style: { fontSize: 24, fontWeight: 800, color: CM.title, marginBottom: 8 } }, cm("enterPhone")),
      React.createElement("p", { style: { fontSize: 14, color: CM.sub, marginBottom: 28 } }, cm("phoneDesc")),
      React.createElement("input", {
        type: "tel", value: phone,
        onChange: function(e){ setPhone(e.target.value); },
        placeholder: cm("phonePlaceholder"),
        style: inputStyle(),
        autoFocus: true,
      }),
      err && React.createElement("p", { style: errStyle() }, err),
      React.createElement("div", { style: { flex: 1 } }),
      React.createElement(CmBtn, { variant: "primary", size: "lg", fullWidth: true, onClick: sendCode }, cm("sendCode"))
    ),

    step === "otp" && React.createElement("div", {
      style: { flex: 1, padding: 24, display: "flex", flexDirection: "column" }
    },
      React.createElement("button", {
        onClick: function(){ setStep("phone"); },
        style: iconBtnStyle()
      }, Cmi.back),
      React.createElement("div", { style: { marginTop: 20, marginBottom: 32, textAlign: "center" } },
        React.createElement(ChameleonLogo, { size: 64 })
      ),
      React.createElement("h2", { style: { fontSize: 24, fontWeight: 800, color: CM.title, marginBottom: 8 } }, cm("enterCode")),
      React.createElement("p", { style: { fontSize: 14, color: CM.sub, marginBottom: 28 } }, cm("codeDesc") + " (" + phone + ")"),
      React.createElement("input", {
        type: "tel", value: code,
        onChange: function(e){ setCode(e.target.value.replace(/\D/g,"").substring(0,6)); },
        placeholder: "• • • • • •",
        maxLength: 6,
        style: Object.assign({}, inputStyle(), { letterSpacing: "0.5em", textAlign: "center", fontSize: 24, fontWeight: 700 }),
        autoFocus: true,
      }),
      err && React.createElement("p", { style: errStyle() }, err),
      React.createElement("button", {
        onClick: sendCode,
        style: {
          background: "transparent", border: "none", color: CM.primary, fontFamily: "inherit",
          fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "10px 0",
        }
      }, cm("codeNotReceived")),
      React.createElement("div", { style: { flex: 1 } }),
      React.createElement(CmBtn, {
        variant: "primary", size: "lg", fullWidth: true,
        disabled: code.length !== 6, onClick: verify
      }, cm("verify"))
    ),

    step === "profile" && React.createElement("div", {
      style: { flex: 1, padding: 24, display: "flex", flexDirection: "column" }
    },
      React.createElement("div", { style: { marginTop: 20, marginBottom: 32, textAlign: "center" } },
        React.createElement(ChameleonLogo, { size: 64 })
      ),
      React.createElement("h2", { style: { fontSize: 24, fontWeight: 800, color: CM.title, marginBottom: 8 } }, cm("profileSetup")),
      React.createElement("p", { style: { fontSize: 14, color: CM.sub, marginBottom: 28 } }, cm("profileDesc")),

      /* Avatar placeholder */
      React.createElement("div", {
        style: {
          width: 100, height: 100, borderRadius: "50%",
          background: CM.primarySoft, color: CM.primaryDark,
          fontSize: 40, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px", boxShadow: CM.shadow,
        }
      }, name ? name.trim().split(" ").map(function(w){return w[0]||"";}).slice(0,2).join("").toUpperCase() : "👤"),

      React.createElement("input", {
        value: name,
        onChange: function(e){ setName(e.target.value); },
        placeholder: cm("yourName"),
        style: inputStyle(),
        maxLength: 40,
        autoFocus: true,
      }),
      err && React.createElement("p", { style: errStyle() }, err),
      React.createElement("div", { style: { flex: 1 } }),
      React.createElement(CmBtn, {
        variant: "primary", size: "lg", fullWidth: true,
        disabled: !name.trim(), onClick: finish
      }, cm("finish"))
    )
  );
}

function inputStyle() {
  return {
    width: "100%", padding: "14px 16px", borderRadius: 14,
    border: "1.5px solid " + CM.line, background: CM.surface,
    fontFamily: "inherit", fontSize: 15, color: CM.body,
    outline: "none", boxSizing: "border-box",
  };
}
function iconBtnStyle() {
  return {
    width: 42, height: 42, borderRadius: 12,
    background: CM.surface2, border: "none", color: CM.body,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit",
  };
}
function errStyle() {
  return { color: "#FF4757", fontSize: 13, fontWeight: 600, marginTop: 8 };
}
