// == Flowlab+ Enhanced content.js with Chatbot and all tools ==
(function () {
  if (document.getElementById("flowlab-plus-toolbar")) return;

  // ---- Utilities ----
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

  // ---- Toolbar ----
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
  `;
  document.body.appendChild(toolbar);

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

  // ---- Chatbot Functions ----
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

  // ---- Chatbot Events ----
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

  // ---- Theme & Font ----
  applyTheme(localStorage.getItem("flp-theme") || "dark");
  const font = localStorage.getItem("flp-font");
  loadFont(font || "Rubik", localStorage.getItem("flp-font-url"));
})();
