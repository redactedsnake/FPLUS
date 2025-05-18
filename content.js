(function () {
  if (document.getElementById("flowlab-plus-toolbar")) return;

  let activeOverlay = null;
  let rotation = 0;

  const FONT_OPTIONS = {
    Rubik: "Rubik, sans-serif",
    Inter: "Inter, sans-serif",
    Segoe: "Segoe UI", sans-serif
  };

  const loadFont = (font, url) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url || `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}&display=swap`;
    document.head.appendChild(link);
    document.documentElement.style.setProperty("--flp-font", FONT_OPTIONS[font] || font);
    localStorage.setItem("flp-font", font);
    if (url) localStorage.setItem("flp-font-url", url);
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("flp-theme", theme);
  };

  const toolbar = document.createElement("div");
  toolbar.id = "flowlab-plus-toolbar";
  toolbar.innerHTML = `
    <div class="flp-nav">
      <button class="flp-menu-btn" id="flp-tools-btn">Tools</button>
      <button class="flp-menu-btn" id="flp-themes-btn">Themes</button>
      <button class="flp-menu-btn" id="flp-resources-btn">Resources</button>
      <div id="flp-logo">Flowlab+</div>
    </div>

    <div id="flp-dropdown-tools" class="flp-dropdown">
      <div class="flp-submenu-item" id="submenu-simkeys-toggle">Simulate Keys</div>
      <div class="flp-submenu-item" id="submenu-overlay-toggle">Overlay Image</div>

      <div class="flp-submenu-content" id="submenu-simkeys-content">
        <h4>Add Key Simulation</h4>
        <input id="custom-label" placeholder="Button Label" />
        <input id="custom-action" placeholder="Key to press (e.g. a)" />
        <button id="add-custom-button">Add Button</button>
        <div id="custom-buttons"></div>
      </div>

      <div class="flp-submenu-content" id="submenu-overlay-content">
        <h4>Overlay Image</h4>
        <button id="upload-image">Upload Image</button>
        <label>🔍 Size</label>
        <input type="range" id="overlay-size" min="50" max="800" value="200">
        <button id="reset-size">Reset Size</button>
        <label>🟡 Opacity</label>
        <input type="range" id="overlay-opacity" min="0" max="1" step="0.01" value
