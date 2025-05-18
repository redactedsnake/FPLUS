(function () {
  console.log("✅ Flowlab+ loaded with overlay & resource manager");

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
      <div class="flp-submenu-item" id="submenu-overlay-toggle">Overlay Image</div>
      <div class="flp-submenu-content" id="submenu-simkeys-content">
        <h4>Add Key Simulation</h4>
        <input id="custom-label" placeholder="Button Label" />
        <input id="custom-action" placeholder="Key to press (e.g. a)" />
        <button id="add-custom-button">Add Button</button>
        <div id="custom-buttons" style="margin-top:10px;"></div>
      </div>
      <div class="flp-submenu-content" id="submenu-overlay-content">
        <h4>Image Overlay</h4>
        <button id="upload-image">Upload Image</button>
        <input type="range" id="overlay-opacity" min="0" max="1" step="0.01" value="1">
        <button id="toggle-lock">🔓 Unlock</button>
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
        <h4>Image Library</h4>
        <div id="resource-gallery"></div>
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

  const createOverlay = (dataUrl) => {
    const overlay = document.createElement("img");
    overlay.src = dataUrl;
    overlay.className = "flp-image-overlay";
    overlay.style.opacity = document.getElementById("overlay-opacity").value;
    overlay.draggable = false;
    overlay.style.position = "fixed";
    overlay.style.top = "100px";
    overlay.style.left = "100px";
    overlay.style.width = "200px";
    overlay.style.zIndex = "9998";

    document.body.appendChild(overlay);

    let isDragging = false, startX, startY;

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
      const startX = e.clientX;
      const onMouseMove = (moveEvent) => {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        overlay.style.width = `${Math.max(50, newWidth)}px`;
      };
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    // Rotation button
    const rotateBtn = document.createElement("button");
    rotateBtn.className = "flp-overlay-btn";
    rotateBtn.textContent = "⟳";
    let rotation = 0;
    rotateBtn.onclick = () => {
      rotation = (rotation + 15) % 360;
      overlay.style.transform = `rotate(${rotation}deg)`;
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "flp-overlay-btn";
    deleteBtn.textContent = "✖";
    deleteBtn.onclick = () => overlay.remove();

    document.body.appendChild(rotateBtn);
    document.body.appendChild(deleteBtn);

    const updateBtnPosition = () => {
      const rect = overlay.getBoundingClientRect();
      rotateBtn.style.position = deleteBtn.style.position = "fixed";
      rotateBtn.style.left = `${rect.left}px`;
      rotateBtn.style.top = `${rect.top - 30}px`;
      deleteBtn.style.left = `${rect.left + 30}px`;
      deleteBtn.style.top = `${rect.top - 30}px`;
    };

    updateBtnPosition();
    new ResizeObserver(updateBtnPosition).observe(overlay);
    document.addEventListener("mousemove", updateBtnPosition);
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
        const images = JSON.parse(localStorage.getItem("flp-resources") || "[]");
        if (!images.includes(ev.target.result)) {
          images.push(ev.target.result);
          localStorage.setItem("flp-resources", JSON.stringify(images));
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const loadResources = () => {
    const gallery = document.getElementById("resource-gallery");
    gallery.innerHTML = "";
    const items = JSON.parse(localStorage.getItem("flp-resources") || "[]");
    items.forEach(dataUrl => {
      const thumb = document.createElement("img");
      thumb.src = dataUrl;
      thumb.style.maxWidth = "100%";
      thumb.style.cursor = "pointer";
      thumb.style.marginBottom = "6px";
      thumb.onclick = () => createOverlay(dataUrl);
      gallery.appendChild(thumb);
    });
  };

  // Init buttons
  document.getElementById("theme-toggle").onclick = () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  };

  document.getElementById("import-font").onclick = () => {
    const url = document.getElementById("font-url").value.trim();
    if (url) loadFont("CustomFont", url);
  };

  document.getElementById("font-select").onchange = (e) => loadFont(e.target.value);

  document.getElementById("flp-tools-btn").onclick = () => toggleDropdown("flp-dropdown-tools");
  document.getElementById("flp-themes-btn").onclick = () => toggleDropdown("flp-dropdown-themes");
  document.getElementById("flp-resources-btn").onclick = () => {
    toggleDropdown("flp-dropdown-resources");
    loadResources();
  };

  document.getElementById("submenu-simkeys-toggle").onclick = () => {
    const box = document.getElementById("submenu-simkeys-content");
    box.style.display = box.style.display === "block" ? "none" : "block";
  };
  document.getElementById("submenu-overlay-toggle").onclick = () => {
    const box = document.getElementById("submenu-overlay-content");
    box.style.display = box.style.display === "block" ? "none" : "block";
  };

  document.getElementById("flp-logo").onclick = () => {
    const modal = document.getElementById("flp-credits-modal");
    modal.style.display = "flex";
    modal.onclick = () => modal.style.display = "none";
  };

  // Apply settings
  applyTheme(localStorage.getItem("flp-theme") || "dark");
  const font = localStorage.getItem("flp-font");
  loadFont(font || "Rubik", localStorage.getItem("flp-font-url"));

})();
