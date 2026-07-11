let network = "";
let detectedInterface = "";

window.addEventListener("load", async () => {
  const res = await fetch("api/network");
  const data = await res.json();
  network = data.network;
  detectedInterface = data.interface;
  
  doneIcon("step1");
  splashStep('step1', 'step-done', detectedInterface + ' (' + data.ip + ')', 'found', false);
  splashStep('step2', 'step-running', 'Calcul en cours…', '', true);

  setTimeout(() => {
    
    document.getElementById("step2-val").textContent = network;
    doneIcon("step2");
    splashStep('step2', 'step-done', network, 'found', false);
    document.getElementById("splashCta").classList.add("visible");
    document.getElementById("netPill").classList.add("visible");
    document.getElementById("netDisplay").textContent = network;
    document.getElementById("ifDisplay").textContent = detectedInterface;
}, 1000);


})

function splashStep(id, cls, val, valCls, spinVisible) {
  const icon = document.getElementById(id + '-icon');
  const v    = document.getElementById(id + '-val');
  const s    = document.getElementById(id + '-spin');
  icon.className = 'splash-step-icon ' + cls;
  if (val)  { v.textContent = val; v.className = 'splash-step-value' + (valCls ? ' ' + valCls : ''); }
  if (s)    s.style.opacity = spinVisible ? '1' : '0';
}

function doneIcon(id) {
  document.getElementById(id + '-icon').innerHTML = `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
    </svg>`;
}


function enterApp() {
  document.getElementById('sidebarNet').textContent = network;
  document.getElementById('bannerNet').textContent  = network;
  document.getElementById('dashNet').textContent    = network;
  document.getElementById('termNet').value          = network;
  document.getElementById('termTitle').textContent  = 'mymap — scan ' + network;

  document.getElementById('splash').classList.add('hidden');
  document.getElementById('app').classList.add('visible');

}