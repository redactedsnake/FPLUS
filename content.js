(function () {
  console.log("✅ Flowlab+ fully loaded");

  if (document.getElementById("flowlab-plus-toolbar")) return;

  const FONT_OPTIONS = {
    Rubik: "Rubik, sans-serif",
    Inter: "Inter, sans-serif",
    Segoe: "Segoe UI, sans-serif"
  };

  const loadFont = (fontName, customURL = null) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = customURL || `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`;
    document.head.appendChild(link);

    document.documentElement.style.setProperty("--flp-font", FONT_OPTIONS[fontName] || fontName);
    localStorage.setItem("flp-font", fontName);
    if (customURL) localStorage.setItem("flp-font-url", customURL);
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

    <div id="flp-dropdown-tools" class="flp-dropdown" style="display:none;">
      <div class="flp-submenu-item" id="submenu-simkeys-toggle">Simulate Keys</div>
      <div class="flp-submenu-content" id="submenu-simkeys-content">
        <h4>Add Key Simulation</h4>
        <input id="custom-label" placeholder="Button Label" />
        <input id="custom-action" placeholder="Key to press (e.g. a)" />
        <button id="add-custom-button">Add Button</button>
        <div id="custom-buttons" style="margin-top:10px;"></div>
      </div>
    </div>

    <div id="flp-dropdown-themes" class="flp-dropdown" style="display:none;">
      <div class="flp-dropdown-content">
        <h4>Theme</h4>
        <button id="theme-toggle">Toggle Light/Dark</button>
        <h4 style="margin-top:10px;">Font</h4>
        <select id="font-select">
          <option value="Rubik">Rubik</option>
          <option value="Inter">Inter</option>
          <option value="Segoe">Segoe</option>
        </select>
        <input id="font-url" placeholder="Custom Google Font URL" />
        <button id="import-font">Import Font</button>
      </div>
    </div>

    <div id="flp-dropdown-resources" class="flp-dropdown" style="display:none;">
      <div class="flp-dropdown-content">
        <h4>Image Overlay</h4>
        <button id="upload-image">Upload Image</button>
        <input type="range" id="overlay-opacity" min="0" max="1" step="0.01" value="1">
        <button id="toggle-lock">🔓 Unlock</button>
      </div>
    </div>

    <div id="flp-credits-modal" class="flp-modal" style="display:none;">
      <div class="flp-modal-content">
        <h2>Flowlab+</h2>
        <p>Created by Sandbox4Studios</p>
        <p>2025</p>
      </div>
    </div>
  `;
  document.body.appendChild(toolbar);
