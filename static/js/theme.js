(function () {
  const STORAGE_KEY = "theme:selected";
  const DEFAULT_THEME = "woodland";

  const themes = {
    woodland: {
      name: "Woodland (기본)",
      pageTop: "#d5ddbc",
      pageBottom: "#bcc79f",
      panel: "#e6ecd2",
      panel2: "#fbfcef",
      text: "#435235",
      muted: "#5a6947",
      line: "#a8b287",
      lineDark: "#66754b",
      accent: "#60773f",
      accent2: "#82985e",
      chip: "#dce4c2",
    },
    ocean: {
      name: "Ocean",
      pageTop: "#b8d4e8",
      pageBottom: "#a0c4e0",
      panel: "#cce5f7",
      panel2: "#f0f7ff",
      text: "#1a3a52",
      muted: "#2d5a7a",
      line: "#7fa8c4",
      lineDark: "#4d7ba8",
      accent: "#1d6ba8",
      accent2: "#2980b9",
      chip: "#dbe9f5",
    },
    sunset: {
      name: "Sunset",
      pageTop: "#f5d5a8",
      pageBottom: "#f0c894",
      panel: "#fbe6c7",
      panel2: "#fffcf0",
      text: "#5c3d1f",
      muted: "#7a5a3a",
      line: "#deb887",
      lineDark: "#c9976b",
      accent: "#d97706",
      accent2: "#f59e0b",
      chip: "#fde8c7",
    },
    grape: {
      name: "Grape",
      pageTop: "#d4b5e0",
      pageBottom: "#c9a0d8",
      panel: "#e6d4f0",
      panel2: "#f5f0fc",
      text: "#42254e",
      muted: "#5d3f6b",
      line: "#b598c7",
      lineDark: "#9370a8",
      accent: "#7c3aed",
      accent2: "#a855f7",
      chip: "#e9d5ff",
    },
    mint: {
      name: "Mint",
      pageTop: "#b8e0d0",
      pageBottom: "#a0d8c7",
      panel: "#cce9e0",
      panel2: "#f0fdf9",
      text: "#1a4d42",
      muted: "#2d6f64",
      line: "#7fb5a6",
      lineDark: "#4d9985",
      accent: "#059669",
      accent2: "#10b981",
      chip: "#d1fae5",
    },
    charcoal: {
      name: "Charcoal",
      pageTop: "#c5c5c5",
      pageBottom: "#b0b0b0",
      panel: "#e0e0e0",
      panel2: "#f5f5f5",
      text: "#2a2a2a",
      muted: "#555555",
      line: "#999999",
      lineDark: "#666666",
      accent: "#333333",
      accent2: "#555555",
      chip: "#d9d9d9",
    },
    crimson: {
      name: "Crimson",
      pageTop: "#e4b3b8",
      pageBottom: "#d9939c",
      panel: "#efd0d4",
      panel2: "#fff2f3",
      text: "#4f1f27",
      muted: "#6d303b",
      line: "#bf7e88",
      lineDark: "#8f4a55",
      accent: "#a62334",
      accent2: "#c63749",
      chip: "#f4dde0",
    },
  };

  function getSavedTheme() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    } catch (error) {
      return DEFAULT_THEME;
    }
  }

  function saveTheme(themeName) {
    try {
      window.localStorage.setItem(STORAGE_KEY, themeName);
    } catch (error) {
      return;
    }
  }

  function applyTheme(themeName) {
    if (!themes[themeName]) {
      themeName = DEFAULT_THEME;
    }

    const theme = themes[themeName];
    const root = document.documentElement;

    root.style.setProperty("--page-top", theme.pageTop);
    root.style.setProperty("--page-bottom", theme.pageBottom);
    root.style.setProperty("--panel", theme.panel);
    root.style.setProperty("--panel-2", theme.panel2);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--muted", theme.muted);
    root.style.setProperty("--line", theme.line);
    root.style.setProperty("--line-dark", theme.lineDark);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-2", theme.accent2);
    root.style.setProperty("--chip", theme.chip);

    root.setAttribute("data-theme", themeName);
    saveTheme(themeName);
    updateThemeButtons(themeName);
  }

  function updateThemeButtons(themeName) {
    const buttons = document.querySelectorAll("[data-theme-btn]");
    buttons.forEach(function (button) {
      const isSelected = button.getAttribute("data-theme-btn") === themeName;
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
  }

  function initTheme() {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    initThemeUI();
  }

  function initThemeUI() {
    const themeMenuBtn = document.getElementById("theme-menu-btn");
    const themeMenu = document.getElementById("theme-menu");
    const themeMenuClose = document.getElementById("theme-menu-close");
    const themeOptions = document.querySelector(".theme-options");

    if (!themeMenuBtn || !themeMenu || !themeOptions) {
      return;
    }

    // Populate theme options
    Object.keys(themes).forEach(function (key) {
      const theme = themes[key];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theme-option-btn";
      button.setAttribute("data-theme-btn", key);
      button.textContent = theme.name;
      button.title = theme.name;

      button.addEventListener("click", function () {
        applyTheme(key);
      });

      themeOptions.appendChild(button);
    });

    // Menu toggle
    themeMenuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      themeMenu.hidden = !themeMenu.hidden;
      themeMenuBtn.setAttribute("aria-expanded", !themeMenu.hidden);
    });

    if (themeMenuClose) {
      themeMenuClose.addEventListener("click", function (e) {
        e.stopPropagation();
        themeMenu.hidden = true;
        themeMenuBtn.setAttribute("aria-expanded", "false");
        themeMenuBtn.focus();
      });
    }

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !themeMenu.hidden &&
        !themeMenu.contains(e.target) &&
        !themeMenuBtn.contains(e.target)
      ) {
        themeMenu.hidden = true;
        themeMenuBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Update buttons on init
    updateThemeButtons(getSavedTheme());
  }

  window.Theme = {
    themes: themes,
    getThemes: function () {
      return Object.keys(themes).map(function (key) {
        return {
          id: key,
          name: themes[key].name,
        };
      });
    },
    setTheme: function (themeName) {
      applyTheme(themeName);
    },
    getCurrentTheme: function () {
      return getSavedTheme();
    },
  };

  // Initialize on DOM ready
  if (
    document.readyState === "loading" ||
    document.readyState === "interactive"
  ) {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();
