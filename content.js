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
    <div id="flp-dropdown-tools" class="flp-dropdown">
      <div class="flp-submenu-item" id="submenu-simkeys-toggle">Simulate Keys</div>
      <div class="flp-submenu-content" id="submenu-simkeys-content">
        <h4>Add Key Simulation</h4>
        <input id="custom-label" placeholder="Button Label" />
        <input id="custom-action" placeholder="Key to press (e.g. a)" />
        <button id="add-custom-button">Add Button</button>
        <div id="custom-buttons" style="margin-top:10px;"></div>
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
    <div id="flp-dropdown-resources" class="flp-dropdown">
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

  const toggleDropdown = (idToToggle) => {
    document.querySelectorAll(".flp-dropdown").forEach((el) => {
      el.style.display = el.id === idToToggle && el.style.display === "none" ? "block" : "none";
      if (el.id !== idToToggle) el.style.display = "none";
    });
  };

  const pressKey = (key) => {
    const code = key.toUpperCase();
    const keyCode = code.charCodeAt(0);
    const down = new KeyboardEvent("keydown", { key, code, keyCode, which: keyCode, bubbles: true });
    const up = new KeyboardEvent("keyup", { key, code, keyCode, which: keyCode, bubbles: true });
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

  const createOverlay = (dataUrl) => {
    const overlay = document.createElement("img");
    overlay.src = dataUrl;
    overlay.className = "flp-image-overlay";
    overlay.draggable = false;
    document.body.appendChild(overlay);

    let isDragging = false, startX, startY;
    overlay.style.position = "fixed";
    overlay.style.top = "100px";
    overlay.style.left = "100px";
    overlay.style.width = "200px";

    overlay.addEventListener("mousedown", (e) => {
      if (overlay.classList.contains("locked")) return;
      isDragging = true;
      startX = e.clientX - overlay.offsetLeft;
      startY = e.clientY - overlay.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        overlay.style.left = `${e.clientX - startX}px`;
        overlay.style.top = `${e.clientY - startY}px`;
      }
    });

    document.addEventListener("mouseup", () => isDragging = false);

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "flp-resize-handle";
    overlay.appendChild(resizeHandle);

    resizeHandle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      const startWidth = overlay.offsetWidth;
      const startHeight = overlay.offsetHeight;
      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (moveEvent) => {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        overlay.style.width = `${Math.max(50, newWidth)}px`;
        overlay.style.height = "auto";
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    document.getElementById("overlay-opacity").oninput = (e) => {
      overlay.style.opacity = e.target.value;
    };

    document.getElementById("toggle-lock").onclick = () => {
      overlay.classList.toggle("locked");
      const lockBtn = document.getElementById("toggle-lock");
      lockBtn.textContent = overlay.classList.contains("locked") ? "🔒 Locked" : "🔓 Unlock";
    };
  };

  // Event handlers
  document.getElementById("add-custom-button").onclick = () => {
    const label = document.getElementById("custom-label").value.trim();
    const key = document.getElementById("custom-action").value.trim();
    if (!label || !key) return alert("Both fields are required!");
    addCustomButton(label, key);
    document.getElementById("custom-label").value = "";
    document.getElementById("custom-action").value = "";
  };

  document.getElementById("upload-image").onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        createOverlay(ev.target.result);
        localStorage.setItem("flp-last-overlay", ev.target.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  document.getElementById("theme-toggle").onclick = () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  };

  document.getElementById("font-select").onchange = (e) => loadFont(e.target.value);
  document.getElementById("import-font").onclick = () => {
    const url = document.getElementById("font-url").value.trim();
    if (!url) return alert("Enter a valid Google Fonts URL.");
    loadFont("CustomFont", url);
  };

  // Tab buttons
  document.getElementById("flp-tools-btn").onclick = () => toggleDropdown("flp-dropdown-tools");
  document.getElementById("flp-themes-btn").onclick = () => toggleDropdown("flp-dropdown-themes");
  document.getElementById("flp-resources-btn").onclick = () => toggleDropdown("flp-dropdown-resources");

  document.getElementById("submenu-simkeys-toggle").onclick = () => {
    const box = document.getElementById("submenu-simkeys-content");
    box.style.display = box.style.display === "block" ? "none" : "block";
  };

  document.getElementById("flp-logo").onclick = () => {
    const modal = document.getElementById("flp-credits-modal");
    modal.style.display = "flex";
    modal.onclick = () => modal.style.display = "none";
  };

  // Load from storage
  const saved = localStorage.getItem("flowlabPlusButtons");
  if (saved) {
    try {
      JSON.parse(saved).forEach(({ label, key }) => addCustomButton(label, key, false));
    } catch {}
  }

  applyTheme(localStorage.getItem("flp-theme") || "dark");
  const savedFont = localStorage.getItem("flp-font");
  const savedFontUrl = localStorage.getItem("flp-font-url");
  if (savedFont) loadFont(savedFont, savedFontUrl || null);
  else loadFont("Rubik");

  const savedOverlay = localStorage.getItem("flp-last-overlay");
  if (savedOverlay) createOverlay(savedOverlay);
})();
