/* Chrome Messenger — Premium / Subscriptions screen
 * Accessed via the diamond icon in the header.
 * Unlocks: extra themes, game pass (premium games), extra storage, etc.
 */

const CM_PLANS = [
  { id: "free",    name: "Free",    price: 0,    period: "",        highlight: false, features: [
      "3 themes de base", "Chats illimites", "Statuts 24h", "Quelques jeux solo",
  ]},
  { id: "plus",    name: "Plus",    price: 2.99, period: "/mois",   highlight: true,  features: [
      "Les 8 themes + dark mode", "Tous les jeux solo + 5 jeux sociaux", "Statuts illimites", "Sauvegarde cloud",
  ]},
  { id: "pro",     name: "Pro",     price: 6.99, period: "/mois",   highlight: false, features: [
      "Tout dans Plus", "Tous les jeux sociaux", "Appels HD illimites", "Stickers premium + effets", "Support prioritaire",
  ]},
  { id: "yearly",  name: "Yearly",  price: 59.99,period: "/an",     highlight: false, features: [
      "Tout dans Pro", "2 mois offerts", "Badge Chrome Pro", "Acces anticipe aux nouvelles features",
  ]},
];

function PremiumScreen(props) {
  var useState = React.useState;
  var [selected, setSelected] = useState("plus");

  return React.createElement("div", {
    style: { minHeight: "100vh", background: CM.bg, paddingBottom: 120 }
  },
    /* Header */
    React.createElement(CmHeader, {
      left: React.createElement(CmIconBtn, { onClick: props.onBack }, Cmi.back),
      onLogoTap: props.onThemeOpen,
    }),

    /* Hero */
    React.createElement("div", {
      style: {
        margin: "8px 22px 22px",
        padding: "26px 22px",
        borderRadius: 20,
        background: "linear-gradient(135deg, " + CM.primary + ", " + CM.primaryDark + ")",
        color: CM.onPrimary,
        textAlign: "center",
        boxShadow: CM.shadowGlow,
      }
    },
      React.createElement("div", { style: { fontSize: 40, marginBottom: 8 } }, "💎"),
      React.createElement("h2", {
        style: { margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-0.3px" }
      }, "Chrome Premium"),
      React.createElement("p", {
        style: { margin: "8px 0 0", fontSize: 13, opacity: 0.92 }
      }, "Debloque les themes, les jeux et bien plus.")
    ),

    /* Plans */
    React.createElement("div", { style: { padding: "0 22px", display: "flex", flexDirection: "column", gap: 12 } },
      CM_PLANS.map(function(plan) {
        var active = selected === plan.id;
        return React.createElement("div", {
          key: plan.id,
          onClick: function(){ setSelected(plan.id); },
          style: {
            position: "relative",
            padding: 18, borderRadius: 16, cursor: "pointer",
            background: active ? CM.primaryFaint : CM.surface,
            border: "2px solid " + (active ? CM.primary : CM.line),
            transition: "all 0.15s",
          }
        },
          plan.highlight && React.createElement("div", {
            style: {
              position: "absolute", top: -10, right: 16,
              padding: "3px 10px", borderRadius: 100,
              background: CM.primary, color: CM.onPrimary,
              fontSize: 10, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
            }
          }, "Populaire"),
          React.createElement("div", {
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }
          },
            React.createElement("div", null,
              React.createElement("div", { style: { fontSize: 16, fontWeight: 800, color: CM.title } }, plan.name),
              plan.price > 0 && React.createElement("div", { style: { marginTop: 4 } },
                React.createElement("span", { style: { fontSize: 22, fontWeight: 800, color: CM.title } }, plan.price.toFixed(2) + " €"),
                React.createElement("span", { style: { fontSize: 13, color: CM.sub, marginLeft: 4 } }, plan.period)
              ),
              plan.price === 0 && React.createElement("div", { style: { fontSize: 14, color: CM.sub, marginTop: 4 } }, "Toujours gratuit")
            ),
            active && React.createElement("div", {
              style: {
                width: 30, height: 30, borderRadius: "50%",
                background: CM.primary, color: CM.onPrimary,
                display: "flex", alignItems: "center", justifyContent: "center",
              }
            }, Cmi.check)
          ),
          React.createElement("ul", { style: { margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 } },
            plan.features.map(function(f, i) {
              return React.createElement("li", {
                key: i,
                style: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: CM.body }
              },
                React.createElement("span", { style: { color: CM.primary, display: "inline-flex", marginTop: 2 } }, Cmi.check2),
                f
              );
            })
          )
        );
      })
    ),

    /* Game Pass highlight */
    React.createElement("div", {
      style: {
        margin: "22px 22px 0", padding: 18, borderRadius: 16,
        background: CM.surface2, display: "flex", alignItems: "center", gap: 14,
      }
    },
      React.createElement("div", { style: { fontSize: 34 } }, "🎮"),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: CM.title } }, "Game Pass inclus"),
        React.createElement("div", { style: { fontSize: 12, color: CM.sub, marginTop: 2 } }, "Morpion, Quiz, Dessin et plus, a jouer avec tes contacts.")
      )
    ),

    /* CTA */
    React.createElement("div", {
      style: {
        position: "fixed", bottom: 0, left: 0, right: 0,
        maxWidth: 480, margin: "0 auto",
        padding: "16px 22px", background: CM.bg,
        borderTop: "1px solid " + CM.line,
        paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
      }
    },
      React.createElement(CmBtn, {
        variant: "primary", size: "lg", fullWidth: true,
        onClick: function(){ cmToast("Paiement simule — " + CM_PLANS.find(function(p){return p.id===selected;}).name + " active !", "info"); },
      }, selected === "free" ? "Continuer gratuitement" : "💎 Passer a " + CM_PLANS.find(function(p){return p.id===selected;}).name)
    )
  );
}
