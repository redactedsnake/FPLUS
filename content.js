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
      <p>Coming soon: behavior search, backups, shortcuts...</p>
      <div style="margin-top:10px;">
        <strong>🎮 Simulate Gamepad:</strong><br>
        <button id="btn-a">Press A</button>
        <button id="btn-b">Press B</button>
        <button id="btn-start">Start</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // Toggle popup
  const toggle = document.getElementById('flowlab-plus-toggle');
  const popup = document.getElementById('flowlab-plus-popup');
  toggle.onclick = () => {
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
  };

  // Gamepad input simulation
  document.getElementById("btn-a").onclick = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
  };

  document.getElementById("btn-b").onclick = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }));
  };

  document.getElementById("btn-start").onclick = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
  };
})();
