(function () {
  // Ensure toolbar is not duplicated
  if (document.getElementById("flowlab-plus-toolbar")) return;

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

  // Create and add the toolbar
  const toolbar = document.createElement("div");
  toolbar.id = "flowlab-plus-toolbar";
  toolbar.innerHTML = `
    <div class="flp-nav">
      <button class="flp-menu-btn" id="flp-tools-btn">Tools</button>
      <button class="flp-menu-btn" id="flp-themes-btn">Themes</button>
      <button class="flp-menu-btn" id="flp-resources-btn">Resources</button>
      <button class="flp-menu-btn" id="flp-chatbot-btn">AI Chatbot</button>
      <div id="flp-logo">Flowlab+</div>
    </div>

    <div id="flp-dropdown-tools" class="flp-dropdown">
      <div class="flp-submenu-item" id="submenu-simkeys-toggle">Simulate Keys</div>
      <div class="flp-submenu-content" id="submenu-simkeys-content" style="display: none">
        <h4>Add Key Simulation</h4>
        <input id="custom-label" placeholder="Button Label" />
        <input id="custom-action" placeholder="Key to press (e.g. a)" />
        <button id="add-custom-button">Add Button</button>
        <div id="custom-buttons" style="margin-top:10px;"></div>
      </div>

      <div class="flp-submenu-item" id="submenu-overlay-toggle">Overlay Image</div>
      <div class="flp-submenu-content" id="submenu-overlay-content" style="display: none">
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
      el.style.display = el.id === id && el.style.display !== "block" ? "block" : "none";
      if (el.id !== id) el.style.display = "none";
    });
  };

  // Set up event listeners for buttons
  document.getElementById("flp-tools-btn").onclick = () => toggleDropdown("flp-dropdown-tools");
  document.getElementById("flp-themes-btn").onclick = () => toggleDropdown("flp-dropdown-themes");
  document.getElementById("flp-resources-btn").onclick = () => {
    toggleDropdown("flp-dropdown-resources");
    const gallery = document.getElementById("resource-gallery");
    if (gallery) {
      const resources = JSON.parse(localStorage.getItem("flp-resources") || "[]");
      gallery.innerHTML = "";
      resources.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.style.maxWidth = "64px";
        img.style.margin = "4px";
        gallery.appendChild(img);
      });
    }
  };

  // Chatbot functionality
  document.getElementById("flp-chatbot-btn").onclick = () => {
    const chatbotWindow = document.getElementById("flp-chatbot-window");
    chatbotWindow.style.display = chatbotWindow.style.display === "none" ? "block" : "none";
    const saved = localStorage.getItem("flp-chat-history");
    document.getElementById("chat-output").innerHTML = saved || "";
    if (!saved) appendChatMessage("What do you need help with today?", "bot");
  };

  const appendChatMessage = (text, sender = "user") => {
    const div = document.createElement("div");
    div.className = `chat-msg ${sender}`;
    div.textContent = text;
    document.getElementById("chat-output").appendChild(div);
    document.getElementById("chat-output").scrollTop = 99999;
  };

  // Handle sending messages
  document.getElementById("send-message").onclick = () => {
    const input = document.getElementById("chat-input").value.trim();
    if (!input) return;
    appendChatMessage("You: " + input);
    document.getElementById("chat-input").value = "";
    getChatbotResponse(input);
  };

  async function getChatbotResponse(input) {
    appendChatMessage("Flowlab+ Chatbot: Thinking...", "bot");
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: `You are an assistant for Flowlab.io, an online game creation platform. Answer the following question specifically related to Flowlab. If you don't know the answer, suggest Flowlab forums, tutorials, or examples. Question: "${input}"`
        })
      });
      const data = await response.json();
      const output = data?.[0]?.generated_text || `Sorry, I couldn't find an answer specific to Flowlab. Please check the [Flowlab Forums](https://forum.flowlab.io/) or the [Flowlab Tutorials](https://flowlab.io/tutorials).`;
      const last = document.querySelector("#chat-output .chat-msg.bot:last-child");
      if (last && last.textContent.includes("Thinking...")) last.remove();
      appendChatMessage("Flowlab+ Chatbot: " + output, "bot");
      localStorage.setItem("flp-chat-history", document.getElementById("chat-output").innerHTML);
    } catch (e) {
      appendChatMessage("Flowlab+ Chatbot: Something went wrong. Try again later.", "bot");
    }
  }

  // Initial theme and font settings
  applyTheme(localStorage.getItem("flp-theme") || "dark");
  const font = localStorage.getItem("flp-font");
  loadFont(font || "Rubik", localStorage.getItem("flp-font-url"));
})();
