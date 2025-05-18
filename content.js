(function () {
  console.log("✅ Flowlab+ content script running!");

  if (document.getElementById("flowlab-plus-panel")) return;

  const panel = document.createElement('div');
  panel.id = 'flowlab-plus-panel';
  panel.innerHTML = `
    <button id="flowlab-plus-toggle">⚙️ Flowlab+</button>
    <div id="flowlab-plus-popup">
      <h3>Flowlab+ Tools</h3>
      <p>Create custom buttons that simulate keypresses:</p>
      <input id="custom-label" placeholder="Button Label" />
      <input id="custom-action" placeholder="Key to press (e.g. a)" />
      <button id="add-custom-button">Add Button</button>
      <div id="custom-buttons" style="margin-top: 10px;"></div>
    </div>
  `;
  document.body.appendChild(panel);

  const toggle = document.getElementById('flowlab-plus-toggle');
  const popup = document.getElementById('flowlab-plus-popup');
  toggle.onclick = () => {
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
  };

  const pressKey = (key) => {
    const keyCode = key.toUpperCase().charCodeAt(0);

    const down = new KeyboardEvent("keydown", {
      key,
      code: key.toUpperCase(),
      keyCode,
      which: keyCode,
      bubbles: true,
    });

    const up = new KeyboardEvent("keyup", {
      key,
      code: key.toUpperCase(),
      keyCode,
      which: keyCode,
      bubbles: true,
    });

    document.activeElement.dispatchEvent(down);
    console.log(`🔘 keydown: ${key}`);

    setTimeout(() => {
      document.activeElement.dispatchEvent(up);
      console.log(`🔘 keyup: ${key}`);
    }, 50);
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
    newBtn.style.marginTop = "5px";
    newBtn.style.display = "block";
    newBtn.style.padding = "6px 10px";
    newBtn.style.marginBottom = "5px";
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

  // 🔁 Load saved buttons on startup
  const saved = localStorage.getItem("flowlabPlusButtons");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      parsed.forEach(({ label, key }) => addCustomButton(label, key, false));
    } catch (e) {
      console.warn("⚠️ Failed to parse saved buttons:", e);
    }
  }
})();
