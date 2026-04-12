(function () {
  function getStorageKey() {
    return "viewMode:" + window.location.pathname;
  }

  function getSavedMode() {
    try {
      return window.localStorage.getItem(getStorageKey()) || "";
    } catch (error) {
      return "";
    }
  }

  function saveMode(mode) {
    try {
      window.localStorage.setItem(getStorageKey(), mode);
    } catch (error) {
      return;
    }
  }

  function setViewMode(mode) {
    var root = document.body;
    if (!root) {
      return;
    }

    root.classList.remove("view-mode-card", "view-mode-list");
    root.classList.add(mode === "list" ? "view-mode-list" : "view-mode-card");

    var buttons = document.querySelectorAll(".js-view-btn");
    buttons.forEach(function (button) {
      var selected = button.getAttribute("data-view") === mode;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function init() {
    var grids = document.querySelectorAll(".js-view-grid");
    var buttons = document.querySelectorAll(".js-view-btn");
    if (!grids.length || !buttons.length) {
      return;
    }

    var savedMode = getSavedMode();
    var mode = savedMode === "list" ? "list" : "card";
    setViewMode(mode);

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var selected = button.getAttribute("data-view") === "list" ? "list" : "card";
        setViewMode(selected);
        saveMode(selected);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
