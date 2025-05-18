(function () {
  // Debugging log to confirm the script is running
  console.log("✅ Flowlab+ content script running!");

  // Prevent duplicate injections
  if (document.getElementById("flowlab-plus-panel")) return;

  // Create the UI panel
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

  // Toggle popup
  const toggle = document.getElementById('flowlab-plus-toggle');
  const popup = document.getElementById('flowlab-plus-popup');
  toggle.onclick = () => {
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
  };

  // Add custom button logic
  document.getElementById("add-custom-button").onclick = () => {
    const label = document.getElementById("custom-label").value.trim();
    const key = document.getElementById("custom-action").value.trim();

    if (!label || !key) return alert("Both fields are required!");

    const newBtn = document.createElement("button");
    newBtn.textContent = label;
    newBtn.style.marginTop = "5px";
    newBtn.style.display = "block";
    newBtn.style.padding = "6px 10px";
    newBtn.style.marginBottom = "5px";
    newBtn.onclick = () => {
      const evt = new KeyboardEvent("keydown", {
        key: key,
        code: key.toUpperCase(),
        keyCode: key.toUpperCase().charCodeAt(0),
        which: key.toUpperCase().charCodeAt(0),
        bubbles: true,
      });
      document.activeElement.dispatchEvent(evt);
      console.log(`🔘 Simulated keypress: ${key}`);
    };

    document.getElementById("custom-buttons").appendChild(newBtn);
  };
})();
