(function () {
  const panel = document.createElement('div');
  panel.id = 'flowlab-plus-panel';
  panel.innerHTML = `
    <button id="flowlab-plus-toggle">⚙️ Flowlab+</button>
    <div id="flowlab-plus-popup" style="display:none;">
      <h3>Flowlab+ Tools</h3>
      <p>Coming soon: behavior search, backups, shortcuts...</p>
    </div>
  `;
  document.body.appendChild(panel);

  const toggle = document.getElementById('flowlab-plus-toggle');
  const popup = document.getElementById('flowlab-plus-popup');
  toggle.onclick = () => {
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
  };
})();
