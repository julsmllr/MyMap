/* ══════════════════════════════════
   SPLASH SEQUENCE
══════════════════════════════════ */
const DETECTED_NET = '192.168.1.0/24';
const DETECTED_IF  = 'Wi-Fi';

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
  // propagate network info
  document.getElementById('sidebarNet').textContent = DETECTED_NET;
  document.getElementById('bannerNet').textContent  = DETECTED_NET;
  document.getElementById('dashNet').textContent    = DETECTED_NET;
  document.getElementById('termNet').value          = DETECTED_NET;
  document.getElementById('termTitle').textContent  = 'mymap — scan ' + DETECTED_NET;

  document.getElementById('splash').classList.add('hidden');
  document.getElementById('app').classList.add('visible');

  // auto-start banner scan after entering
  setTimeout(startBannerScan, 400);
}

/* ══════════════════════════════════
   NAVIGATION
══════════════════════════════════ */
function goto(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  el.classList.add('active');
}

/* ══════════════════════════════════
   VIEW TOGGLE
══════════════════════════════════ */
function setView(v) {
  const g = document.getElementById('gridView');
  const l = document.getElementById('listView');
  const gb = document.getElementById('gridBtn');
  const lb = document.getElementById('listBtn');
  if (v === 'grid') { g.style.display=''; l.style.display='none'; gb.classList.add('active'); lb.classList.remove('active'); }
  else              { g.style.display='none'; l.style.display=''; lb.classList.add('active'); gb.classList.remove('active'); }
}

/* ══════════════════════════════════
   SCAN BANNER
══════════════════════════════════ */
function startBannerScan() {
  const b = document.getElementById('scanBanner');
  const f = document.getElementById('bannerFill');
  b.style.display = 'flex'; b.classList.add('running');
  f.classList.remove('running'); void f.offsetWidth; f.classList.add('running');
  setTimeout(() => { b.style.display='none'; b.classList.remove('running'); }, 9200);
}

/* ══════════════════════════════════
   DETAIL PANEL
══════════════════════════════════ */
const devices = {
  router: { icon:`<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>`, cls:'icon-router', ip:'192.168.1.254', mac:'20:66:cf:5b:7e:91', label:'Freebox Pop', fabricant:'Iliad (Free)', ttl:'64', os:'Linux', ports:[{num:53,svc:'DNS',banner:'Résolution DNS locale',cta:null},{num:80,svc:'HTTP',banner:'nginx',cta:'Ouvrir'},{num:443,svc:'HTTPS',banner:'nginx',cta:'Ouvrir'},{num:445,svc:'SMB',banner:'Partage de fichiers',cta:null},{num:554,svc:'RTSP',banner:'fbxrtspd/1.2 Freebox RTSP',cta:'Voir flux'}] },
  server: { icon:`<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 17.25v.75a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25v-.75m19.5 0A2.25 2.25 0 0019.5 15h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 19.409a2.25 2.25 0 01-1.07-1.916V15"/></svg>`, cls:'icon-server', ip:'192.168.1.66', mac:'40:9f:38:0f:a3:7b', label:'Ubuntu Server', fabricant:'Intel Corp.', ttl:'64', os:'Linux', ports:[{num:22,svc:'SSH',banner:'OpenSSH_9.6p1 Ubuntu-3ubuntu13.16',cta:null}] },
  printer: { icon:`<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"/></svg>`, cls:'icon-printer', ip:'192.168.1.169', mac:'f8:25:51:1d:a6:e0', label:'Imprimante EPSON', fabricant:'Seiko EPSON', ttl:'64', os:'Linux (EPSON)', ports:[{num:80,svc:'HTTP',banner:'EPSON HTTP Server',cta:'Ouvrir'},{num:443,svc:'HTTPS',banner:'EPSON_Linux UPnP/1.0',cta:'Ouvrir'},{num:631,svc:'IPP',banner:'Epson_IPP-Server/2.0.0',cta:null}] },
  pc: { icon:`<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.409A2.25 2.25 0 012.25 5.493V5.25"/></svg>`, cls:'icon-pc', ip:'192.168.1.134', mac:'28:d0:43:8d:61:3c', label:'PC Windows (vous)', fabricant:"Micro-Star Int'l", ttl:'128', os:'Windows', ports:[{num:135,svc:'NetBIOS',banner:'Microsoft RPC',cta:null},{num:445,svc:'SMB',banner:'Partage Windows',cta:null}] }
};

function openDetail(key) {
  const d = devices[key]; if (!d) return;
  document.getElementById('detailHeader').innerHTML = `
    <div class="device-icon ${d.cls}">${d.icon}</div>
    <div class="detail-title"><h2>${d.label}</h2><p>${d.ip}</p></div>
    <button class="close-btn" onclick="closeDetail()"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>`;
  const ports = d.ports.map(p=>`<div class="port-row"><span class="port-num">${p.num}</span><div class="port-info"><div class="port-service">${p.svc}</div><div class="port-banner">${p.banner}</div></div>${p.cta?`<a href="#" class="port-cta">${p.cta}</a>`:''}</div>`).join('');
  document.getElementById('detailBody').innerHTML = `
    <div class="detail-section"><div class="detail-section-title">Informations</div><div class="info-grid">
      <div class="info-cell"><div class="info-cell-label">Adresse IP</div><div class="info-cell-value">${d.ip}</div></div>
      <div class="info-cell"><div class="info-cell-label">OS estimé (TTL=${d.ttl})</div><div class="info-cell-value">${d.os}</div></div>
      <div class="info-cell full"><div class="info-cell-label">Adresse MAC</div><div class="info-cell-value">${d.mac}</div></div>
      <div class="info-cell full"><div class="info-cell-label">Fabricant (OUI)</div><div class="info-cell-value">${d.fabricant}</div></div>
    </div></div>
    <div class="detail-section"><div class="detail-section-title">Ports ouverts (${d.ports.length})</div><div class="port-list">${ports}</div></div>`;
  document.getElementById('overlay').classList.add('open');
  document.getElementById('detailPanel').classList.add('open');
}

function closeDetail() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('detailPanel').classList.remove('open');
}

/* ══════════════════════════════════
   TERMINAL
══════════════════════════════════ */
const scanLines = [
  {t:0,    cls:'term-prompt', txt:'$ sudo python main.py'},
  {t:300,  cls:'term-info',   txt:'[*] Détection du réseau — interface Wi-Fi'},
  {t:700,  cls:'term-info',   txt:'[*] Réseau cible : 192.168.1.0/24'},
  {t:1000, cls:'term-info',   txt:'[*] Lancement du scan ARP (256 paquets)…'},
  {t:1800, cls:'term-found',  txt:'[+] 192.168.1.66    → 40:9f:38:0f:a3:7b'},
  {t:2100, cls:'term-found',  txt:'[+] 192.168.1.79    → dc:00:b0:69:2e:6b'},
  {t:2500, cls:'term-found',  txt:'[+] 192.168.1.134   → 28:d0:43:8d:61:3c'},
  {t:2900, cls:'term-found',  txt:'[+] 192.168.1.138   → be:c7:49:9d:44:ce'},
  {t:3200, cls:'term-found',  txt:'[+] 192.168.1.169   → f8:25:51:1d:a6:e0'},
  {t:3600, cls:'term-found',  txt:'[+] 192.168.1.254   → 20:66:cf:5b:7e:91'},
  {t:4200, cls:'term-info',   txt:'[*] ARP terminé — 13 hôtes trouvés'},
  {t:4500, cls:'term-info',   txt:'[*] Scan SYN ports 1-1024 (threading)…'},
  {t:5200, cls:'term-port',   txt:'    192.168.1.66   :22   SSH  — OpenSSH_9.6p1'},
  {t:5600, cls:'term-port',   txt:'    192.168.1.254  :53   DNS  — résolution locale'},
  {t:6000, cls:'term-port',   txt:'    192.168.1.254  :80   HTTP — nginx'},
  {t:6300, cls:'term-port',   txt:'    192.168.1.169  :80   HTTP — EPSON HTTP Server'},
  {t:6600, cls:'term-port',   txt:'    192.168.1.134  :135  RPC  — Microsoft RPC'},
  {t:6900, cls:'term-port',   txt:'    192.168.1.254  :443  HTTPS — nginx'},
  {t:7200, cls:'term-port',   txt:'    192.168.1.169  :443  HTTPS — EPSON UPnP'},
  {t:7500, cls:'term-port',   txt:'    192.168.1.254  :445  SMB  — partage fichiers'},
  {t:7700, cls:'term-port',   txt:'    192.168.1.134  :445  SMB  — partage Windows'},
  {t:7900, cls:'term-port',   txt:'    192.168.1.254  :554  RTSP — fbxrtspd/1.2'},
  {t:8100, cls:'term-port',   txt:'    192.168.1.169  :631  IPP  — Epson_IPP-Server'},
  {t:8600, cls:'term-found',  txt:'[✓] Scan terminé — 13 hôtes, 11 ports ouverts'},
];

function clearTerminal() {
  document.getElementById('terminal').innerHTML = '<div class="term-line term-muted"># Terminal vidé.</div><div class="term-line term-cursor">&nbsp;</div>';
  document.getElementById('scanPhase').textContent='En attente';
  document.getElementById('scanPct').textContent='0%';
  document.getElementById('scanFill').style.width='0%';
  document.getElementById('hostsFound').textContent='—';
  document.getElementById('portsFound').textContent='—';
}

function runScan() {
  const t=document.getElementById('terminal');
  t.innerHTML='';
  let h=0,p=0;
  const cursor=document.createElement('div');
  cursor.className='term-line term-cursor'; cursor.textContent=' '; t.appendChild(cursor);
  scanLines.forEach((line,i)=>{
    setTimeout(()=>{
      const div=document.createElement('div');
      div.className='term-line '+line.cls; div.textContent=line.txt;
      t.insertBefore(div,cursor); t.scrollTop=t.scrollHeight;
      const pct=Math.round((i+1)/scanLines.length*100);
      document.getElementById('scanFill').style.width=pct+'%';
      document.getElementById('scanPct').textContent=pct+'%';
      if(line.cls==='term-found'&&line.txt.includes('[+]')){h++;document.getElementById('hostsFound').textContent=h;document.getElementById('scanPhase').textContent='Scan ARP';}
      if(line.cls==='term-port'){p++;document.getElementById('portsFound').textContent=p;document.getElementById('scanPhase').textContent='Scan ports';}
      if(i===scanLines.length-1)document.getElementById('scanPhase').textContent='Terminé';
    },line.t);
  });
}
