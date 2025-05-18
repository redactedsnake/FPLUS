// == Flowlab+ Full Toolbar with Chatbot and Working Dropdowns ==
(function () {
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

    <div id="flp-dropdown-tools" class="flp-dropdown" style="display: none">
      <div class="flp-submenu-item">Simulate Keys (coming soon)</div>
      <div class="flp-submenu-item">Overlay Image (coming soon)</div>
    </div>

    <div id="flp-dropdown-themes" class="flp-dropdown" style="display: none">
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

    <div id="flp-dropdown-resources" class="flp-dropdown" style="display: none">
      <div class="flp-dropdown-content">
        <h4>Resources</h4>
        <div id="resource-gallery">Coming soon</div>
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

  document.getElementById("flp-tools-btn").onclick = () => toggleDropdown("flp-dropdown-tools");
  document.getElementById("flp-themes-btn").onclick = () => toggleDropdown("flp-dropdown-themes");
  document.getElementById("flp-resources-btn").onclick = () => toggleDropdown("flp-dropdown-resources");

  // ---- Chatbot Window ----
  const chatbotWindow = document.createElement("div");
  chatbotWindow.id = "flp-chatbot-window";
  chatbotWindow.style.display = "none";
  chatbotWindow.innerHTML = `
    <div id="chatbot-header">
      <span>Flowlab+ Chatbot</span>
      <button id="close-chatbot">X</button>
    </div>
    <div id="chatbot-body">
      <div id="chat-output"></div>
      <input type="text" id="chat-input" placeholder="Ask me anything about Flowlab..." />
      <button id="send-message">Send</button>
    </div>
  `;
  document.body.appendChild(chatbotWindow);

  const appendChatMessage = (text, sender = "user") => {
    const div = document.createElement("div");
    div.className = `chat-msg ${sender}`;
    div.textContent = text;
    document.getElementById("chat-output").appendChild(div);
    document.getElementById("chat-output").scrollTop = 99999;
  };

  const getChatbotResponse = (input) => {
    input = input.toLowerCase();
    let response =
      "I'm not sure, but you can find help in the Flowlab Forums: https://forum.flowlab.io";
    if (input.includes("help"))
      response = "What do you need help with today? Try checking https://flowlab.io/tutorials";
    else if (input.includes("new game"))
      response = "To make a new game, go to your Dashboard and click 'Create New Game'.";
    else if (input.includes("behaviors"))
      response = "Check out Flowlab's Behavior Examples: https://flowlab.io/examples";

    appendChatMessage(response, "bot");
    saveChat();
  };

  const saveChat = () => {
    localStorage.setItem("flp-chat-history", document.getElementById("chat-output").innerHTML);
  };

  const restoreChat = () => {
    const saved = localStorage.getItem("flp-chat-history");
    if (saved) document.getElementById("chat-output").innerHTML = saved;
    else appendChatMessage("What do you need help with today?", "bot");
  };

  document.getElementById("flp-chatbot-btn").onclick = () => {
    chatbotWindow.style.display = chatbotWindow.style.display === "none" ? "block" : "none";
    restoreChat();
  };

  document.getElementById("close-chatbot").onclick = () => {
    chatbotWindow.style.display = "none";
  };

  document.getElementById("send-message").onclick = () => {
    const input = document.getElementById("chat-input").value.trim();
    if (!input) return;
    appendChatMessage("You: " + input);
    document.getElementById("chat-input").value = "";
    getChatbotResponse(input);
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
