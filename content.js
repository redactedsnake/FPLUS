(function () {
  console.log("✅ Flowlab+ submenu UI script running!");

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
      <div id="flp-logo">Flowlab+</div>
    </div>

    <div id="flp-dropdown-tools" class="flp-dropdown">
      <div class="flp-submenu-item" id="submenu-simkeys">
        Simulate Keys ▶
        <div class="flp-submenu-content" id="submenu-simkeys-content">
          <h4>Add Key Simulation</h4>
          <input id="custom-label" placeholder="Button Label" />
          <input id="custom-action" placeholder="Key to press (e.g. a)" />
          <button id="add-custom-button">Add Button</button>
          <div id="custom-buttons" style="margin-top:10px;"></div>
        </div>
      </div>
    </div>

    <div id="flp-dropdown-themes" class="flp-dropdown">
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
  `;
  document.body.appendChild(toolbar);

  const toggleDropdown = (idToToggle) => {
    document.querySelectorAll(".flp-dropdown").forEach((el) => {
      el.style.display = el.id === idToToggle && el.style.display === "none" ? "block" : "none";
      if (el.id !== idToToggle) el.style.display = "none";
    });
  };

  document.getElementById("flp-tools-btn").onclick = () => toggleDropdown("flp-dropdown-tools");
  document.getElementById("flp-themes-btn").onclick = () => toggleDropdown("flp-dropdown-themes");

  const pressKey = (key) => {
    const keyCode = key.toUpperCase().charCodeAt(0);
    const down = new KeyboardEvent("keydown", { key, code: key.toUpperCase(), keyCode, which: keyCode, bubbles: true });
    const up = new KeyboardEvent("keyup", { key, code: key.toUpperCase(), keyCode, which: keyCode, bubbles: true });
    document.activeElement.dispatchEvent(down);
    setTimeout(() => document.activeElement.dispatchEvent(up), 50);
  };

  const saveButtons = () => {
    const buttons = Array.from(document.querySelectorAll("#custom-buttons button")).map(btn => ({
      label: btn.textContent,
      key: btn.dataset.key
    }));
    localStorage.setItem("flowlabPlusButtons", JSON.stringify(buttons));
  };

  const addCustomButton = (label, key, save = true) => {
    const newBtn = document.createElement("button");
    newBtn.textContent = label;
    newBtn.dataset.key = key;
    newBtn.className = "flp-action-button";
    newBtn.onclick = () => pressKey(key);
    document.getElementById("custom-buttons").appendChild(newBtn);
    if (save) saveButtons();
  };

  document.getElementById("add-custom-button").onclick = () => {
    const label = document.getElementById("custom-label").value.trim();
    const key = document.getElementById("custom-action").value.trim();
    if (!label || !key) return alert("Both fields are required!");
    addCustomButton(label, key);
    document.getElementById("custom-label").value = "";
    document.getElementById("custom-action").value = "";
  };

  document.getElementById("font-select").onchange = (e) => {
    loadFont(e.target.value);
  };

  document.getElementById("import-font").onclick = () => {
    const url = document.getElementById("font-url").value.trim();
    if (!url) return alert("Enter a valid Google Fonts URL.");
    loadFont("CustomFont", url);
  };

  document.getElementById("theme-toggle").onclick = () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  };

  // Load saved state
  const saved = localStorage.getItem("flowlabPlusButtons");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      parsed.forEach(({ label, key }) => addCustomButton(label, key, false));
    } catch (e) {
      console.warn("⚠️ Failed to parse saved buttons:", e);
    }
  }

  applyTheme(localStorage.getItem("flp-theme") || "dark");

  const savedFont = localStorage.getItem("flp-font");
  const savedFontUrl = localStorage.getItem("flp-font-url");
  if (savedFont) {
    loadFont(savedFont, savedFontUrl || null);
    const select = document.getElementById("font-select");
    if (select && FONT_OPTIONS[savedFont]) select.value = savedFont;
  } else {
    loadFont("Rubik");
  }
})();
