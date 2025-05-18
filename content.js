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
    </div>
  `;
  document.body.appendChild(panel);

  // Toggle popup
  const toggle = document.getElementById('flowlab-plus-toggle');
  const popup = document.getElementById('flowlab-plus-popup');
  toggle.onclick = () => {
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
  };
})();
