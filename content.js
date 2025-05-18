(function () {
  if (document.getElementById("flowlab-plus-toolbar")) return;

  let activeOverlay = null;
  let activeRotation = 0;

  const FONT_OPTIONS = {
    Rubik: "Rubik, sans-serif",
    Inter: "Inter, sans-serif",
    Segoe: "Segoe UI, sans-serif"
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
        <div id="custom-buttons" style="margin-top:10px;"></div>
      </div>

      <div class="flp-submenu-content" id="submenu-overlay-content">
        <h4>Overlay Image</h4>
        <button id="upload-image">Upload Image</button>
        <label>🔍 Size</label>
        <input type="range" id="overlay-size" min="50" max="800" value="200">
        <button id="reset-size">Reset Size</button>
        <label>🟡 Opacity</label>
        <input type="range" id="overlay-opacity" min="0" max="1" step="0.01" value="1">
        <button id="reset-opacity">Reset Opacity</button>
        <button id="reset-rotation">Reset Rotation</button>
        <button id="toggle-lock">🔓 Unlock</button>
      </div>
    </div>

    <div id="flp-dropdown-themes" class="flp-dropdown">
      <div class="flp-dropdown-content">
        <h4>Theme</h4>
        <button id="theme-toggle">Toggle Light/Dark</button>
        <h4>Font</h4>
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
        <h4>Resources</h4>
        <div id="resource-gallery"></div>
      </div>
    </div>
  `;
  document.body.appendChild(toolbar);

  const toggleDropdown = (id) => {
    document.querySelectorAll(".flp-dropdown").forEach(el => {
      el.style.display = el.id === id && el.style.display === "none" ? "block" : "none";
      if (el.id !== id) el.style.display = "none";
    });
  };

  const createOverlay = (dataUrl) => {
    const img = document.createElement("img");
    img.src = dataUrl;
    img.className = "flp-image-overlay";
    img.style.width = "200px";
    img.style.opacity = "1";
    img.style.transform = "rotate(0deg)";
    img.style.position = "fixed";
    img.style.top = "100px";
    img.style.left = "100px";
    document.body.appendChild(img);
    activeOverlay = img;
    activeRotation = 0;

    let isDragging = false, startX, startY;

    img.addEventListener("mousedown", (e) => {
      if (img.classList.contains("locked")) return;
      isDragging = true;
      startX = e.clientX - img.offsetLeft;
      startY = e.clientY - img.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        img.style.left = `${e.clientX - startX}px`;
        img.style.top = `${e.clientY - startY}px`;
      }
    });

    document.addEventListener("mouseup", () => isDragging = false);

    const resize = document.createElement("div");
    resize.className = "flp-resize-handle";
    img.appendChild(resize);

    resize.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      const startWidth = img.offsetWidth;
      const startX = e.clientX;

      const onMove = (move) => {
        const newWidth = startWidth + (move.clientX - startX);
        img.style.width = `${Math.max(50, newWidth)}px`;
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  };

  const loadGallery = () => {
    const gallery = document.getElementById("resource-gallery");
    gallery.innerHTML = "";
    const resources = JSON.parse(localStorage.getItem("flp-resources") || "[]");

    resources.forEach((url) => {
      const thumb = document.createElement("img");
      thumb.src = url;
      thumb.className = "flp-thumb";
      thumb.onclick = () => createOverlay(url);
      gallery.appendChild(thumb);
    });
  };

  // Overlay controls
  document.getElementById("upload-image").onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = ev.target.result;
        createOverlay(data);
        const saved = JSON.parse(localStorage.getItem("flp-resources") || "[]");
        if (!saved.includes(data)) {
          saved.push(data);
          localStorage.setItem("flp-resources", JSON.stringify(saved));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    };
    input.click();
  };

  document.getElementById("overlay-opacity").oninput = (e) => {
    if (activeOverlay) activeOverlay.style.opacity = e.target.value;
  };

  document.getElementById("overlay-size").oninput = (e) => {
    if (activeOverlay) activeOverlay.style.width = `${e.target.value}px`;
  };

  document.getElementById("toggle-lock").onclick = () => {
    if (!activeOverlay) return;
    activeOverlay.classList.toggle("locked");
    document.getElementById("toggle-lock").textContent =
      activeOverlay.classList.contains("locked") ? "🔒 Locked" : "🔓 Unlock";
  };

  // Reset buttons
  document.getElementById("reset-size").onclick = () => {
    if (activeOverlay) activeOverlay.style.width = "200px";
  };
  document.getElementById("reset-opacity").onclick = () => {
    if (activeOverlay) activeOverlay.style.opacity = "1";
  };
  document.getElementById("reset-rotation").onclick = () => {
    if (activeOverlay) {
      activeRotation = 0;
      activeOverlay.style.transform = "rotate(0deg)";
    }
  };

  // Dropdowns
  document.getElementById("flp-tools-btn").onclick = () => toggleDropdown("flp-dropdown-tools");
  document.getElementById("flp-themes-btn").onclick = () => toggleDropdown("flp-dropdown-themes");
  document.getElementById("flp-resources-btn").onclick = () => {
    toggleDropdown("flp-dropdown-resources");
    loadGallery();
  };
  document.getElementById("submenu-overlay-toggle").onclick = () => {
    const el = document.getElementById("submenu-overlay-content");
    el.style.display = el.style.display === "block" ? "none" : "block";
  };

  document.getElementById("theme-toggle").onclick = () => {
    const mode = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(mode === "dark" ? "light" : "dark");
  };
  document.getElementById("font-select").onchange = (e) => loadFont(e.target.value);
  document.getElementById("import-font").onclick = () => {
    const url = document.getElementById("font-url").value.trim();
    if (url) loadFont("CustomFont", url);
  };

  applyTheme(localStorage.getItem("flp-theme") || "dark");
  const font = localStorage.getItem("flp-font");
  loadFont(font || "Rubik", localStorage.getItem("flp-font-url"));
})();
