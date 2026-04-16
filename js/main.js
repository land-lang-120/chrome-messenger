/* Chrome Messenger — entry point */

(function() {
  /* Apply saved theme immediately, before React mounts */
  var savedTheme = localStorage.getItem(CM_KEYS.theme) || "mint";
  cmApplyTheme(savedTheme);

  var root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
})();
