document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

const isMobileDevice = window.innerWidth <= 600;

// ── CONTACT MODAL ──
const contactModal = document.getElementById('contact-modal');
const openContactModal  = () => { contactModal.style.display = 'flex'; gtag('event', 'nav_click', { button_name: 'contact' }); };
const closeContactModal = () => { contactModal.style.display = 'none'; };

document.getElementById('contact-btn').addEventListener('click', openContactModal);
document.getElementById('contact-close-btn').addEventListener('click', closeContactModal);
document.getElementById('contact-modal-inner').addEventListener('click', e => e.stopPropagation());
contactModal.addEventListener('click', closeContactModal);

// ── HELPERS ──
const rand = (a, b) => Math.random() * (b - a) + a;
const W = () => window.innerWidth;
const H = () => window.innerHeight;

// ── ELEMENT REFS ──
const rainCanvas       = document.getElementById('hs-rain-canvas');
const flowCanvas       = document.getElementById('hs-flow-canvas');
const windowsCanvas    = document.getElementById('hs-windows-canvas');
const reflectionCanvas = document.getElementById('hs-reflection-canvas');
const objectsCanvas    = document.getElementById('hs-objects-canvas');
const cityBack         = document.getElementById('hs-city-back');
const cityMid          = document.getElementById('hs-city-mid');
const cityFront        = document.getElementById('hs-city-front');
const starsEl          = document.getElementById('hs-stars');
const orbsEl           = document.getElementById('hs-glow-orbs');
const buildingSignsEl  = document.getElementById('hs-building-signs');
const wiresLayer       = document.getElementById('hs-wires-layer');
const neonSvg          = document.getElementById('hs-neon-svg');
const neonTitleWrap    = document.getElementById('hs-neon-title-wrap');
const navSignsEl       = document.getElementById('hs-nav-signs');

// ── STARS ──
for (let i = 0; i < 90; i++) {
  const s = document.createElement('div');
  s.className = 'hs-star';
  const sz = rand(0.5, 2.5);
  s.style.cssText = `width:${sz}px;height:${sz}px;left:${rand(0,100)}%;top:${rand(0,40)}%;animation-delay:${rand(0,4)}s;animation-duration:${rand(3,7)}s;opacity:${rand(0.15,0.6)}`;
  starsEl.appendChild(s);
}

// ── GLOW ORBS ──
;[
  { w:700, h:500, x:'10%', y:'-5%',  c:'#00e5ff18', d:22 },
  { w:500, h:400, x:'70%', y:'15%',  c:'#ff2d9514', d:26 },
  { w:600, h:500, x:'40%', y:'45%',  c:'#b44aff0c', d:30 },
  { w:400, h:350, x:'85%', y:'55%',  c:'#ffb34710', d:24 },
].forEach(o => {
  const d = document.createElement('div');
  d.className = 'hs-glow-orb';
  d.style.cssText = `width:${o.w}px;height:${o.h}px;left:${o.x};top:${o.y};background:radial-gradient(circle,${o.c},transparent 70%);animation-duration:${o.d}s;animation-delay:${rand(-10,0)}s`;
  orbsEl.appendChild(d);
});

// ── CITY SKYLINE ──
let allBuildings = []; // screen-pixel rects for every building, used by initWindows

function genSkyline(svg, count, minH, maxH, accentColor, opMult = 1) {
  if (!svg) return [];
  const w = W();
  const svgH = svg.getBoundingClientRect().height || H() * 0.6;
  const canvasH = H() * 0.58; // matches windowsCanvas height, anchored bottom:0
  svg.setAttribute('viewBox', `0 0 ${w} ${svgH}`);
  let h = '';
  const buildings = [];
  const segW = w / count;
  for (let i = 0; i < count; i++) {
    const bw = segW * rand(0.5, 0.95);
    const bh = rand(minH, maxH) * svgH;
    const bx = i * segW + rand(0, segW - bw);
    const by = svgH - bh;
    // Convert building top to windows-canvas Y coords.
    // Both canvas and SVG are anchored at bottom:0, so building top in canvas = canvasH - bh_screen.
    // bh_screen = bh (since SVG viewBox width==screen width and preserveAspectRatio=none, Y scales as svgH/canvasH...
    // actually easier: building top screen Y = H()-svgH + by = H()-bh; canvas top screen Y = H()-canvasH;
    // canvas Y of building top = (H()-bh) - (H()-canvasH) = canvasH - bh
    buildings.push({ x: bx, y: canvasH - bh, w: bw, h: bh, opMult });
    const r = 8 + rand(0,15), g = 10 + rand(0,18), bl = 30 + rand(0,40);
    const fill = `rgb(${r},${g},${bl})`;
    h += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${fill}"/>`;
    if (Math.random() > 0.5) h += `<rect x="${bx}" y="${by}" width="1.5" height="${bh}" fill="${accentColor}" opacity=".15"/>`;
    if (Math.random() > 0.5) h += `<rect x="${bx+bw-1.5}" y="${by}" width="1.5" height="${bh}" fill="${accentColor}" opacity=".12"/>`;
    h += `<rect x="${bx-2}" y="${by}" width="${bw+4}" height="3" fill="${fill}"/>`;
    if (Math.random() > 0.65) {
      const ax = bx + bw / 2, ah = rand(10, 35);
      h += `<line x1="${ax}" y1="${by}" x2="${ax}" y2="${by-ah}" stroke="#ffffff15" stroke-width="1"/>`;
      h += `<circle cx="${ax}" cy="${by-ah}" r="1.5" fill="#ff2d55" opacity=".6"><animate attributeName="opacity" values=".6;.2;.6" dur="${rand(2,4)}s" repeatCount="indefinite"/></circle>`;
    }
    if (Math.random() > 0.8 && bw > 30) {
      const cx = bx + bw / 2, ry = by - 8;
      h += `<path d="M${cx} ${ry-10} L${bx+bw+10} ${ry+2} L${bx+bw+6} ${ry+5} L${bx-6} ${ry+5} L${bx-10} ${ry+2} Z" fill="${fill}" stroke="${accentColor}" stroke-width=".5" opacity=".5"/>`;
    }
    if (Math.random() > 0.7 && bw > 20) {
      const sy = by + bh * rand(0.1, 0.4);
      h += `<rect x="${bx+3}" y="${sy}" width="${bw-6}" height="2" fill="${accentColor}" opacity=".25" rx="1"><animate attributeName="opacity" values=".25;.1;.25" dur="${rand(3,6)}s" repeatCount="indefinite"/></rect>`;
    }
  }
  svg.innerHTML = h;
  return buildings;
}

function buildCity() {
  allBuildings = [
    ...genSkyline(cityBack,  30, 0.3,  0.92, '#1a2266', 0.2),
    ...genSkyline(cityMid,   22, 0.25, 0.75, '#00e5ff', 0.55),
    ...genSkyline(cityFront, 15, 0.15, 0.55, '#ff2d95', 1.0),
  ];
}
buildCity();

// ── WINDOWS ──
let winCtx = null;
let windowGrid = [];

function initWindows() {
  if (!windowsCanvas) return;
  winCtx = windowsCanvas.getContext('2d');
  windowsCanvas.width = W(); windowsCanvas.height = H() * 0.58;
  windowGrid = [];
  const colors = ['#ffb347','#00e5ff','#ff2d95','#ffffff','#b44aff','#ffe4a0'];
  const canvasH = windowsCanvas.height;

  for (const b of allBuildings) {
    // Clip building rect to canvas bounds
    const top    = Math.max(0, b.y);
    const bottom = Math.min(canvasH, b.y + b.h);
    const left   = Math.max(0, b.x);
    const right  = Math.min(windowsCanvas.width, b.x + b.w);
    if (bottom <= top || right <= left) continue;

    const cellW = 9, cellH = 11;
    const cols = Math.floor((right - left) / cellW);
    const rows = Math.floor((bottom - top) / cellH);
    if (cols < 1 || rows < 1) continue;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.45) continue;
        const wx = left + c * cellW + rand(1, 3);
        const wy = top  + r * cellH + rand(1, 3);
        const topFade = wy / canvasH;
        windowGrid.push({
          x: wx, y: wy, w: rand(2, 4), h: rand(2, 5),
          color: colors[Math.floor(rand(0, colors.length))],
          baseOp: rand(0.04, 0.22) * Math.min(1, topFade + 0.3) * b.opMult,
          speed: rand(0.5, 3), phase: rand(0, Math.PI * 2),
          on: Math.random() > 0.1,
        });
      }
    }
  }
}
initWindows();

function drawWindows(t) {
  if (!winCtx || !windowsCanvas) return;
  winCtx.clearRect(0, 0, windowsCanvas.width, windowsCanvas.height);
  for (const w of windowGrid) {
    if (!w.on) continue;
    const a = Math.max(0, w.baseOp + Math.sin(t * w.speed + w.phase) * 0.12);
    winCtx.fillStyle = w.color;
    winCtx.globalAlpha = a;
    winCtx.fillRect(w.x, w.y, w.w, w.h);
  }
  winCtx.globalAlpha = 1;
}

// ── BUILDING SIGNS ──
;[
  { t:'テキン', c:'#00e5ff', x:'8%',  y:'25%' },
  { t:'未来',   c:'#ff2d95', x:'72%', y:'15%' },
  { t:'東京',   c:'#b44aff', x:'35%', y:'10%' },
  { t:'電',     c:'#ffb347', x:'88%', y:'30%' },
  { t:'夢',     c:'#00e5ff', x:'55%', y:'20%' },
  { t:'街',     c:'#ff2d95', x:'18%', y:'14%' },
  { t:'CODE',   c:'#00e5ff', x:'62%', y:'35%', f:true },
  { t:'OPEN',   c:'#ff2d95', x:'25%', y:'38%', f:true },
  { t:'24H',    c:'#ffb347', x:'45%', y:'32%', f:true },
  { t:'電賞',   c:'#b44aff', x:'78%', y:'22%' },
  { t:'2077',   c:'#00e5ff', x:'4%',  y:'35%', f:true },
  { t:'データ', c:'#00e5ff', x:'92%', y:'18%' },
].forEach((s, i) => {
  const d = document.createElement('div');
  d.className = 'hs-bsign';
  d.textContent = s.t;
  d.style.cssText = `left:${s.x};bottom:${s.y};color:${s.c};border-color:${s.c}99;opacity:.1;text-shadow:0 0 4px ${s.c}22;filter:blur(0.5px);animation-delay:${-i*1.3}s;${s.f ? `font-family:'Orbitron',monospace;font-weight:700;font-size:.7rem;letter-spacing:.15em` : ''}`;
  buildingSignsEl.appendChild(d);
});

// ── WIRES + LANTERNS ──
;[16, 26, 36, 48].forEach(y => {
  const w = document.createElement('div');
  w.className = 'hs-wire';
  w.style.top = y + '%';
  wiresLayer.appendChild(w);
  for (let i = 0; i < 3 + Math.floor(rand(0, 4)); i++) {
    const l = document.createElement('div');
    l.className = 'hs-lantern';
    const colors = ['#ff2d95','#ffb347','#ff6b6b'];
    const c = colors[Math.floor(rand(0, colors.length))];
    l.style.cssText = `left:${10+rand(0,80)}%;top:${y+0.5}%;background:radial-gradient(ellipse,${c}cc,${c}55);box-shadow:0 0 6px ${c}88,0 0 16px ${c}33;animation-delay:${-rand(0,6)}s;animation-duration:${5+rand(0,5)}s`;
    wiresLayer.appendChild(l);
  }
});

// ── RAIN ──
let rainCtx = null;
let rainDrops = [];

function initRain() {
  if (!rainCanvas) return;
  rainCtx = rainCanvas.getContext('2d');
  rainCanvas.width = W(); rainCanvas.height = H();
  rainDrops = [];
  const isMobile = W() <= 600;
  const count = isMobile ? 0 : Math.min(Math.floor(W() / 6), 250);
  for (let i = 0; i < count; i++)
    rainDrops.push({ x:rand(0,W()), y:rand(-H(),H()), len:rand(10,25), speed:rand(8,16), op:rand(0.06,0.18), w:rand(0.3,0.7) });
}
initRain();

function drawRain() {
  if (!rainCtx || !rainCanvas) return;
  rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  rainCtx.strokeStyle = 'rgba(180,225,255,0.32)';
  rainCtx.lineWidth = 0.65;
  rainCtx.beginPath();
  for (const d of rainDrops) {
    rainCtx.moveTo(d.x, d.y);
    rainCtx.lineTo(d.x + 0.4, d.y + d.len);
    d.y += d.speed;
    if (d.y > rainCanvas.height + d.len) { d.y = -d.len; d.x = rand(0, W()); }
  }
  rainCtx.stroke();
}

// ── NEON FLOW STREAMS ──
let flowCtx = null;
let neonStreams = [];

function initNeonFlow() {
  if (!flowCanvas) return;
  flowCtx = flowCanvas.getContext('2d');
  flowCanvas.width = W(); flowCanvas.height = H();
  neonStreams = [];
  const colors = ['#00e5ff','#ff2d95','#b44aff','#7b6fff','#ffb347'];
  for (let i = 0; i < 5; i++) {
    const pts = [];
    const yBase = rand(H() * 0.10, H() * 0.65);
    for (let p = 0; p < 11; p++) pts.push({ x:((p-2)/7)*W(), baseY:yBase+rand(-100,100) });
    neonStreams.push({ pts, color:colors[i%colors.length], width:rand(0.8,2.2), speed:rand(0.15,0.5), opacity:rand(0.06,0.18), phase:rand(0,Math.PI*2) });
  }
}
initNeonFlow();

function drawNeonFlow(t) {
  if (!flowCtx || !flowCanvas) return;
  flowCtx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
  for (const s of neonStreams) {
    const animated = s.pts.map(p => ({ x:p.x, y:p.baseY + Math.sin(t*s.speed + p.x*0.002 + s.phase)*50 }));
    flowCtx.beginPath();
    flowCtx.moveTo(animated[0].x, animated[0].y);
    for (let i = 0; i < animated.length - 1; i++) {
      const cx = (animated[i].x + animated[i+1].x) / 2;
      const cy = (animated[i].y + animated[i+1].y) / 2;
      flowCtx.quadraticCurveTo(animated[i].x, animated[i].y, cx, cy);
    }
    flowCtx.strokeStyle = s.color;
    if (perfTier === 'high') { flowCtx.lineWidth = s.width * 4; flowCtx.globalAlpha = s.opacity * 0.3; flowCtx.stroke(); }
    flowCtx.lineWidth = s.width;     flowCtx.globalAlpha = s.opacity;       flowCtx.stroke();
    flowCtx.lineWidth = s.width*0.3; flowCtx.globalAlpha = s.opacity * 2;   flowCtx.stroke();
  }
  flowCtx.globalAlpha = 1;
}

// ── REFLECTIONS ──
let refCtx = null;

function initReflections() {
  if (!reflectionCanvas) return;
  refCtx = reflectionCanvas.getContext('2d');
  reflectionCanvas.width = W(); reflectionCanvas.height = H() * 0.16;
}
initReflections();

function drawReflections(t) {
  if (!refCtx || !reflectionCanvas) return;
  refCtx.clearRect(0, 0, reflectionCanvas.width, reflectionCanvas.height);
  const colors = ['#00e5ff','#ff2d95','#ffb347','#b44aff'];
  for (let i = 0; i < 20; i++) {
    const x = ((i * 53 + t * 25) % reflectionCanvas.width);
    refCtx.fillStyle = colors[i % colors.length];
    refCtx.globalAlpha = rand(0.015, 0.06);
    refCtx.fillRect(x + Math.sin(t*2+i)*4, 0, rand(1,4), reflectionCanvas.height);
  }
  refCtx.globalAlpha = 1;
}

// ── OBJECTS: TRAM, FLYING CARS, PUDDLES ──
let objCtx = null;
if (objectsCanvas) objCtx = objectsCanvas.getContext('2d');

const tram = { x: -200, speed: 0.6, y: 0 };
let flyingCars = [];

function initObjects() {
  if (!objectsCanvas) return;
  objCtx = objectsCanvas.getContext('2d');
  objectsCanvas.width = W(); objectsCanvas.height = H();
  tram.y = H() * 0.82; tram.x = -200;
  flyingCars = [];
  for (let i = 0; i < 2; i++) {
    flyingCars.push({
      x: rand(-300, W()+300), y: H()*rand(0.12,0.35),
      speed: rand(0.4,1.0) * (Math.random()>0.5?1:-1),
      size: rand(10,16), color: ['#00e5ff','#ff2d95'][i%2],
      bobPhase: rand(0,Math.PI*2), bobSpeed: rand(1,2.5), trail: [],
    });
  }
}
initObjects();

function drawTram(t) {
  if (!objCtx || !objectsCanvas) return;
  const cx = objCtx;
  const x = tram.x, y = tram.y;
  cx.save();
  cx.globalAlpha = 0.85;
  cx.fillStyle = '#0c1445'; cx.fillRect(x, y, 120, 35);
  cx.fillStyle = '#0a1038'; cx.fillRect(x-2, y-3, 124, 6);
  for (let i = 0; i < 5; i++) {
    cx.fillStyle = '#00e5ff'; cx.globalAlpha = 0.3 + Math.sin(t*2+i)*0.1; cx.fillRect(x+8+i*22, y+6, 16, 14);
    cx.globalAlpha = 0.08; cx.fillRect(x+6+i*22, y+4, 20, 18);
  }
  cx.globalAlpha = 0.85; cx.fillStyle = '#1a1f55'; cx.fillRect(x+5, y+35, 110, 4);
  cx.fillStyle = '#00e5ff'; cx.globalAlpha = 0.8;
  cx.beginPath(); cx.arc(x+120, y+20, 3, 0, Math.PI*2); cx.fill();
  cx.globalAlpha = 0.06;
  cx.beginPath(); cx.moveTo(x+123,y+14); cx.lineTo(x+200,y+10); cx.lineTo(x+200,y+30); cx.lineTo(x+123,y+26); cx.fill();
  cx.globalAlpha = 0.15; cx.strokeStyle = '#00e5ff'; cx.lineWidth = 1;
  cx.beginPath(); cx.moveTo(0,y+39); cx.lineTo(W(),y+39); cx.stroke();
  cx.globalAlpha = 0.08;
  cx.beginPath(); cx.moveTo(0,y+41); cx.lineTo(W(),y+41); cx.stroke();
  cx.globalAlpha = isMobileDevice ? 0.05 : 0.4; cx.strokeStyle = '#ffffff'; cx.lineWidth = 1;
  cx.beginPath(); cx.moveTo(x+60,y-3); cx.lineTo(x+55,y-20); cx.lineTo(x+65,y-20); cx.lineTo(x+60,y-3); cx.stroke();
  cx.globalAlpha = 0.1; cx.strokeStyle = '#00e5ff'; cx.lineWidth = 0.8;
  cx.beginPath(); cx.moveTo(0,y-20); cx.lineTo(W(),y-20); cx.stroke();
  cx.globalAlpha = 0.5 + Math.sin(t*3)*0.2; cx.fillStyle = '#00e5ff';
  cx.fillRect(x+2, y+32, 116, 2);
  if (!isMobileDevice && perfTier === 'high') { cx.shadowColor = '#00e5ff'; cx.shadowBlur = 8; }
  cx.fillRect(x+2, y+32, 116, 2); cx.shadowBlur = 0;
  cx.restore();
  tram.x += tram.speed;
  if (tram.x > W()+100) tram.x = -250;
}

function drawFlyingCars(t) {
  if (!objCtx) return;
  const cx = objCtx;
  for (const car of flyingCars) {
    const bob = Math.sin(t*car.bobSpeed + car.bobPhase) * 6;
    const cy = car.y + bob;
    car.trail.push({ x:car.x, y:cy, age:0 });
    if (car.trail.length > 25) car.trail.shift();
    cx.save();
    for (let i = 0; i < car.trail.length; i++) {
      const tp = car.trail[i];
      cx.globalAlpha = (i/car.trail.length)*0.12;
      cx.fillStyle = car.color; cx.fillRect(tp.x-car.size*0.3, tp.y, car.size*0.6, 2); tp.age++;
    }
    cx.globalAlpha = 0.7; cx.fillStyle = '#0c1240';
    cx.beginPath(); cx.ellipse(car.x, cy, car.size, car.size*0.4, 0, 0, Math.PI*2); cx.fill();
    cx.globalAlpha = 0.4; cx.fillStyle = car.color;
    if (!isMobileDevice && perfTier === 'high') { cx.shadowColor = car.color; cx.shadowBlur = 12; }
    cx.beginPath(); cx.ellipse(car.x, cy+car.size*0.3, car.size*0.7, 2, 0, 0, Math.PI*2); cx.fill();
    cx.shadowBlur = 0;
    const dir = car.speed > 0 ? 1 : -1;
    cx.globalAlpha = 0.8; cx.fillStyle = car.color;
    cx.beginPath(); cx.arc(car.x+car.size*dir, cy, 1.5, 0, Math.PI*2); cx.fill();
    cx.fillStyle = '#ff3333'; cx.globalAlpha = 0.6;
    cx.beginPath(); cx.arc(car.x-car.size*dir, cy, 1.2, 0, Math.PI*2); cx.fill();
    cx.restore();
    car.x += car.speed;
    if (car.speed > 0 && car.x > W()+50) car.x = -50;
    if (car.speed < 0 && car.x < -50) car.x = W()+50;
  }
}

function drawPuddles(t) {
  if (!objCtx) return;
  const cx = objCtx;
  const puddles = [
    { x:W()*0.15, y:H()*0.9,  w:80,  h:8, color:'#00e5ff' },
    { x:W()*0.55, y:H()*0.92, w:100, h:6, color:'#ff2d95' },
    { x:W()*0.8,  y:H()*0.88, w:60,  h:7, color:'#b44aff' },
    { x:W()*0.35, y:H()*0.94, w:70,  h:5, color:'#ffb347' },
  ];
  cx.save();
  for (const p of puddles) {
    const shimmer = Math.sin(t*1.5 + p.x*0.01)*0.3 + 0.5;
    cx.globalAlpha = 0.06*shimmer; cx.fillStyle = p.color;
    cx.beginPath(); cx.ellipse(p.x, p.y, p.w, p.h, 0, 0, Math.PI*2); cx.fill();
    cx.globalAlpha = 0.1*shimmer;
    const rippleR = p.w*0.4 + Math.sin(t*2+p.x)*8;
    cx.beginPath(); cx.ellipse(p.x, p.y, rippleR, p.h*0.6, 0, 0, Math.PI*2); cx.fill();
    cx.globalAlpha = 0.2*shimmer;
    cx.fillRect(p.x-1+Math.sin(t*3+p.x)*5, p.y-1, 3, 2);
  }
  cx.restore();
}

// ── NEON SVG TEXT POSITIONING ──
function positionNeonSVG() {
  const h1 = neonTitleWrap && neonTitleWrap.querySelector('.hs-hero-title');
  if (!h1 || !neonSvg) return;
  const rect = h1.getBoundingClientRect();
  const wrapRect = neonTitleWrap.getBoundingClientRect();
  const cx = rect.left - wrapRect.left + rect.width / 2;
  const cy = rect.top - wrapRect.top + rect.height / 2;
  neonSvg.querySelectorAll('.hs-neon-text').forEach(t => {
    t.setAttribute('x', cx);
    t.setAttribute('y', cy);
  });
}
// Fire after fonts are loaded and one layout frame has passed
document.fonts.ready.then(() => requestAnimationFrame(positionNeonSVG));
// Fallback for browsers where fonts.ready resolves before layout updates
setTimeout(positionNeonSVG, 900);
// Re-align on resize / orientation change
window.addEventListener('resize', positionNeonSVG);

// ── NAV ENTRANCE ANIMATION ──
if (navSignsEl) {
  const navBtns = navSignsEl.querySelectorAll('.nav-sign');
  navBtns.forEach((s, i) => {
    setTimeout(() => s.classList.add('visible'), 1200 + i * 150);
  });

  // Random scarce glitch on nav buttons (desktop only)
  if (!isMobileDevice) {
    function scheduleGlitch() {
      const delay = 3000 + Math.random() * 8000;
      setTimeout(() => {
        const btn = navBtns[Math.floor(Math.random() * navBtns.length)];
        if (btn.classList.contains('visible')) {
          btn.classList.add('hs-glitch');
          btn.addEventListener('animationend', () => btn.classList.remove('hs-glitch'), { once: true });
        }
        scheduleGlitch();
      }, delay);
    }
    setTimeout(scheduleGlitch, 4000);
  }
}

// ── FOG ──
const fogCanvas = document.getElementById('hs-fog-canvas');
let fogCtx = null;

function initFog() {
  if (!fogCanvas) return;
  fogCtx = fogCanvas.getContext('2d');
  fogCanvas.width = W();
  fogCanvas.height = fogCanvas.offsetHeight || H() * 0.45;
}
initFog();

const fogBands = [
  { yFrac: 0.40, speed: 0.06, widthFrac: 1.3, alpha: 0.018, r: 140, g: 180, b: 230 },
  { yFrac: 0.56, speed:-0.05, widthFrac: 1.5, alpha: 0.024, r: 160, g: 200, b: 240 },
  { yFrac: 0.70, speed: 0.04, widthFrac: 1.2, alpha: 0.030, r: 120, g: 160, b: 210 },
  { yFrac: 0.82, speed:-0.07, widthFrac: 1.6, alpha: 0.022, r: 170, g: 210, b: 245 },
  { yFrac: 0.92, speed: 0.09, widthFrac: 1.4, alpha: 0.016, r: 100, g: 150, b: 200 },
];

function drawFog(t) {
  if (!fogCtx || !fogCanvas) return;
  fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
  const cH = fogCanvas.height;
  for (const b of fogBands) {
    const y = cH * b.yFrac;
    const drift = Math.sin(t * b.speed + b.yFrac * 4) * W() * 0.06;
    const w = W() * b.widthFrac;
    const x = (W() - w) / 2 + drift;
    const grad = fogCtx.createLinearGradient(x, 0, x + w, 0);
    const c = `${b.r},${b.g},${b.b}`;
    grad.addColorStop(0,   `rgba(${c},0)`);
    grad.addColorStop(0.15,`rgba(${c},${b.alpha})`);
    grad.addColorStop(0.5, `rgba(${c},${b.alpha * 1.6})`);
    grad.addColorStop(0.85,`rgba(${c},${b.alpha})`);
    grad.addColorStop(1,   `rgba(${c},0)`);
    fogCtx.fillStyle = grad;
    fogCtx.fillRect(x, y - 22, w, 48);
  }
}

// ── MOBILE SCENE ──────────────────────────────────────────────────────────────
const mobileCanvas = document.getElementById('hs-mobile-canvas');

if (isMobileDevice && mobileCanvas) {
  const mc = mobileCanvas.getContext('2d');
  mobileCanvas.width  = W();
  mobileCanvas.height = H();

  const VW = W(), VH = H();
  const neonCols = ['#00e5ff','#ff2d95','#b44aff','#33ff88','#ffb347'];

  // Build static buildings — evenly spread across full width
  const mBuildings = [];

  function mBldg(x, y, w, h, col) {
    // fewer windows — 1 per ~18x20 cell, ~30% chance on
    mBuildings.push({ x, y, w, h, col,
      windows: Array.from({ length: Math.floor(w/18) * Math.floor(h/20) }, () => ({
        cx: x + rand(4, w - 4),
        cy: y + rand(4, h - 4),
        color: neonCols[Math.floor(rand(0, neonCols.length))],
        phase: rand(0, Math.PI * 2),
        speed: rand(0.3, 1.8),
        on: Math.random() > 0.7,
      }))
    });
  }

  // Full-width skyline — varied heights, no zone distinction
  for (let i = 0; i < 28; i++) {
    const bw = rand(18, 46);
    const bh = rand(VH * 0.15, VH * 0.72);
    mBldg(rand(i * (VW/28), (i+1) * (VW/28) - bw), VH - bh, bw, bh,
      `rgb(${8+rand(0,12)|0},${10+rand(0,12)|0},${30+rand(0,22)|0})`);
  }

  // Stars
  const mStars = Array.from({ length: 80 }, () => ({
    x: rand(0, VW), y: rand(0, VH * 0.6),
    r: rand(0.4, 1.4), phase: rand(0, Math.PI * 2), speed: rand(0.3, 1.2),
  }));

  function drawMobileScene(t) {
    mc.clearRect(0, 0, VW, VH);

    // Sky gradient — navy matching desktop
    const sky = mc.createLinearGradient(0, 0, 0, VH);
    sky.addColorStop(0,    '#08081f');
    sky.addColorStop(0.35, '#0a0d2e');
    sky.addColorStop(0.65, '#0f1545');
    sky.addColorStop(1,    '#111a52');
    mc.fillStyle = sky;
    mc.fillRect(0, 0, VW, VH);

    // Stars
    for (const s of mStars) {
      const a = 0.4 + Math.sin(t * s.speed + s.phase) * 0.3;
      mc.globalAlpha = a;
      mc.fillStyle = '#ffffff';
      mc.beginPath(); mc.arc(s.x, s.y, s.r, 0, Math.PI * 2); mc.fill();
    }
    mc.globalAlpha = 1;

    // Shift entire city section down
    const cityShift = VH * 0.14;
    mc.save();
    mc.translate(0, cityShift);

    // Horizon neon glow
    const hY = VH * 0.72;
    const hg = mc.createLinearGradient(0, hY - 40, 0, hY + 60);
    hg.addColorStop(0, 'rgba(0,0,0,0)');
    hg.addColorStop(0.4, 'rgba(0,180,255,0.06)');
    hg.addColorStop(0.6, 'rgba(180,74,255,0.08)');
    hg.addColorStop(1, 'rgba(0,0,0,0)');
    mc.fillStyle = hg;
    mc.fillRect(0, hY - 40, VW, 100);

    // Buildings (static fill)
    for (const b of mBuildings) {
      mc.fillStyle = b.col;
      mc.fillRect(b.x, b.y, b.w, b.h);
      // Edge accent lines
      mc.fillStyle = '#00e5ff';
      mc.globalAlpha = 0.06;
      mc.fillRect(b.x, b.y, 1, b.h);
      mc.fillRect(b.x + b.w - 1, b.y, 1, b.h);
      mc.globalAlpha = 1;
    }

    // Neon horizon line
    mc.strokeStyle = '#00e5ff';
    mc.globalAlpha = 0.12 + Math.sin(t * 0.5) * 0.04;
    mc.lineWidth = 1;
    mc.beginPath(); mc.moveTo(0, hY); mc.lineTo(VW, hY); mc.stroke();
    mc.globalAlpha = 1;

    // Animated windows
    for (const b of mBuildings) {
      for (const w of b.windows) {
        if (!w.on) continue;
        const a = 0.08 + Math.sin(t * w.speed + w.phase) * 0.06;
        mc.globalAlpha = Math.max(0, a);
        mc.fillStyle = w.color;
        mc.fillRect(w.cx, w.cy, 3, 3);
      }
    }
    mc.globalAlpha = 1;

    // Ground — fills full bottom so no gap
    const sg = mc.createLinearGradient(0, VH * 0.82, 0, VH);
    sg.addColorStop(0, '#090d22');
    sg.addColorStop(1, '#050314');
    mc.fillStyle = sg;
    mc.fillRect(0, VH * 0.82, VW, VH * 0.18);

    // Subtle street line
    mc.strokeStyle = '#00e5ff';
    mc.globalAlpha = 0.07;
    mc.lineWidth = 1;
    mc.beginPath(); mc.moveTo(0, VH * 0.87); mc.lineTo(VW, VH * 0.87); mc.stroke();
    mc.globalAlpha = 1;

    // Neon puddle reflections — subtle, woven into ground not floating
    const puddles = [
      { x: VW*0.18, c: '#00e5ff' }, { x: VW*0.5, c: '#ff2d95' }, { x: VW*0.78, c: '#b44aff' },
    ];
    for (let i = 0; i < puddles.length; i++) {
      const pa = 0.05 + Math.sin(t * 1.1 + i * 1.8) * 0.025;
      mc.globalAlpha = pa;
      mc.fillStyle = puddles[i].c;
      mc.beginPath(); mc.ellipse(puddles[i].x, VH * 0.885, 28, 4, 0, 0, Math.PI * 2); mc.fill();
    }
    mc.globalAlpha = 1;
    mc.restore(); // end city shift

    // Neon flow waves — 3 gentle lines across upper sky
    const flows = [
      { yBase: VH*0.18, color:'#00e5ff', speed:0.18, amp:28, op:0.10 },
      { yBase: VH*0.28, color:'#ff2d95', speed:0.13, amp:22, op:0.08 },
      { yBase: VH*0.38, color:'#b44aff', speed:0.22, amp:18, op:0.07 },
    ];
    for (const f of flows) {
      mc.beginPath();
      for (let x = 0; x <= VW; x += 4) {
        const y = f.yBase + Math.sin(x * 0.012 + t * f.speed) * f.amp;
        x === 0 ? mc.moveTo(x, y) : mc.lineTo(x, y);
      }
      mc.strokeStyle = f.color;
      mc.lineWidth = 1.2;
      mc.globalAlpha = f.op;
      mc.stroke();
    }
    mc.globalAlpha = 1;
  }

  // Mobile loop — 30fps
  let mLastFrame = 0;
  function mobileLoop(ts) {
    requestAnimationFrame(mobileLoop);
    if (ts - mLastFrame < 33) return;
    mLastFrame = ts;
    drawMobileScene(ts * 0.001);
  }
  requestAnimationFrame(mobileLoop);
}

// ── PERFORMANCE TIER ──────────────────────────────────────────────────────────
// Measured over first 60 rendered frames (~1s). Tiers only activate on devices
// that are actually struggling — fast GPUs stay at 'high' and see no change.
let perfTier = 'high';          // 'high' | 'medium' | 'low'
let fpsMeasureFrames = 0;
let fpsMeasureStart  = 0;
let fpsMeasured      = isMobileDevice; // mobile has its own loop, skip
let lastSlowTime     = 0;
const SLOW_INTERVAL  = 1000 / 30;     // 30fps cap for throttled effects

function applyPerfTier(fps) {
  if      (fps < 30) perfTier = 'low';
  else if (fps < 45) perfTier = 'medium';
  if (perfTier === 'high') return;
  // Pause glow orb drift (barely visible at <5% opacity — zero perceptual loss)
  document.querySelectorAll('.hs-glow-orb').forEach(el => {
    el.style.animationPlayState = 'paused';
  });
  if (perfTier === 'low') {
    // Halve rain drop count
    rainDrops.splice(Math.ceil(rainDrops.length / 2));
  }
}

// ── MAIN LOOP (desktop only) ──────────────────────────────────────────────────
const targetFPS = isMobileDevice ? 30 : 60;
const frameInterval = 1000 / targetFPS;
let lastFrameTime = 0;

function loop(ts) {
  requestAnimationFrame(loop);
  if (ts - lastFrameTime < frameInterval) return;
  lastFrameTime = ts;
  const t = ts * 0.001;
  if (isMobileDevice) return; // mobile uses its own canvas

  // ── FPS measurement (first 60 rendered frames) ──
  if (!fpsMeasured) {
    if (fpsMeasureFrames === 0) fpsMeasureStart = ts;
    fpsMeasureFrames++;
    if (fpsMeasureFrames === 60) {
      applyPerfTier(60000 / (ts - fpsMeasureStart));
      fpsMeasured = true;
    }
  }

  // isSlow gates effects to 30fps on medium/low tiers
  const isSlow = ts - lastSlowTime >= SLOW_INTERVAL;
  if (isSlow) lastSlowTime = ts;

  drawRain();
  if (perfTier === 'high' || isSlow) drawWindows(t);
  drawNeonFlow(t);
  // reflections: 30fps on medium, skipped on low
  if (perfTier === 'high' || (perfTier === 'medium' && isSlow)) drawReflections(t);
  if (objCtx && objectsCanvas) objCtx.clearRect(0, 0, objectsCanvas.width, objectsCanvas.height);
  drawTram(t);
  drawFlyingCars(t);
  drawPuddles(t);
  // fog: 30fps on medium/low
  if (perfTier === 'high' || isSlow) drawFog(t);
}
requestAnimationFrame(loop);

// ── RESIZE ──
window.addEventListener('resize', () => {
  buildCity();
  initWindows();
  initRain();
  initNeonFlow();
  initReflections();
  initObjects();
  initFog();
  positionNeonSVG();
});

// ── PARALLAX ──
document.addEventListener('mousemove', e => {
  const mx = (e.clientX / W() - 0.5) * 2;
  if (cityBack)  cityBack.style.transform  = `translateX(${mx * -8}px)`;
  if (cityMid)   cityMid.style.transform   = `translateX(${mx * -15}px)`;
  if (cityFront) cityFront.style.transform = `translateX(${mx * -25}px)`;
});
