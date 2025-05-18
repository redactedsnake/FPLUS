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
      <button class="flp-menu-btn" id="flp-chatbot-btn">AI Chatbot</button>
      <div id="flp-logo">Flowlab+</div>
    </div>
  `;
  document.body.appendChild(toolbar);

  const toggleChatbot = () => {
    const chatbotWindow = document.getElementById("flp-chatbot-window");
    if (chatbotWindow.style.display === "none" || !chatbotWindow.style.display) {
      chatbotWindow.style.display = "block";
      document.getElementById("chat-input").focus();
    } else {
      chatbotWindow.style.display = "none";
    }
  };

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

  // Handle closing the chatbot
  document.getElementById("close-chatbot").onclick = () => toggleChatbot();

  // Handle user message input
  document.getElementById("send-message").onclick = () => {
    const input = document.getElementById("chat-input").value.trim();
    if (input) {
      appendChatMessage("You: " + input);
      getChatbotResponse(input);
      document.getElementById("chat-input").value = "";
    }
  };

  // Add the user's chat message to the chat window
  const appendChatMessage = (message) => {
    const output = document.getElementById("chat-output");
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    output.appendChild(messageDiv);
    output.scrollTop = output.scrollHeight;
  };

  // Generate the chatbot's response
  const getChatbotResponse = (input) => {
    let response = "I'm sorry, I don't understand that. Please check the [Flowlab Forums](https://forum.flowlab.io/).";

    // Predefined answers based on common queries
    if (input.toLowerCase().includes("help")) {
      response = "What do you need help with today? You can also check the [Flowlab Tutorials](https://flowlab.io/tutorials/).";
    } else if (input.toLowerCase().includes("new game")) {
      response = "To create a new game, go to the 'My Games' tab and click 'Create New Game'. Here's a tutorial: [Create Game Tutorial](https://flowlab.io/tutorials/creating-a-game).";
    } else if (input.toLowerCase().includes("behaviors")) {
      response = "Behaviors are the building blocks for creating logic in Flowlab. You can view examples and tutorials on behaviors here: [Behavior Examples](https://flowlab.io/examples/).";
    }

    appendChatMessage("Flowlab+ Chatbot: " + response);
  };

  // Open the chatbot window when clicking the button
  document.getElementById("flp-chatbot-btn").onclick = () => toggleChatbot();

  // Apply theme and font settings
  applyTheme(localStorage.getItem("flp-theme") || "dark");
  const font = localStorage.getItem("flp-font");
  loadFont(font || "Rubik", localStorage.getItem("flp-font-url"));
})();
