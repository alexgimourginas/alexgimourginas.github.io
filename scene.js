document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

// ── CONTACT MODAL ──
const contactModal = document.getElementById('contact-modal');
const openContactModal  = () => { contactModal.style.display = 'flex'; };
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
function genSkyline(svg, count, minH, maxH, accentColor) {
  if (!svg) return;
  const w = W();
  const svgH = svg.getBoundingClientRect().height || H() * 0.6;
  svg.setAttribute('viewBox', `0 0 ${w} ${svgH}`);
  let h = '';
  const segW = w / count;
  for (let i = 0; i < count; i++) {
    const bw = segW * rand(0.5, 0.95);
    const bh = rand(minH, maxH) * svgH;
    const bx = i * segW + rand(0, segW - bw);
    const by = svgH - bh;
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
}

function buildCity() {
  genSkyline(cityBack,  30, 0.3,  0.92, '#1a2266');
  genSkyline(cityMid,   22, 0.25, 0.75, '#00e5ff');
  genSkyline(cityFront, 15, 0.15, 0.55, '#ff2d95');
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
  const cols = Math.floor(W() / 10);
  const rows = Math.floor(windowsCanvas.height / 11);
  const colors = ['#ffb347','#00e5ff','#ff2d95','#ffffff','#b44aff','#ffe4a0'];
  const colHeights = [];
  const buildingWidth = Math.floor(rand(3, 6));
  let currentH = rand(0.3, 0.7);
  for (let c = 0; c <= cols; c++) {
    if (c % buildingWidth === 0) currentH = rand(0.15, 0.75);
    colHeights[c] = currentH;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.4) {
        const wx = c * 10 + rand(0, 4);
        const wy = r * 11 + rand(0, 4);
        const topFade = wy / windowsCanvas.height;
        const roofLine = colHeights[c] * windowsCanvas.height * 0.45;
        if (wy < roofLine && Math.random() > 0.15) continue;
        const density = topFade * topFade * 0.55 + 0.4;
        if (Math.random() > density) continue;
        windowGrid.push({
          x: wx, y: wy, w: rand(2,5), h: rand(2,6),
          color: colors[Math.floor(rand(0, colors.length))],
          baseOp: rand(0.03, 0.25) * Math.min(1, topFade + 0.3),
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
  d.style.cssText = `left:${s.x};bottom:${s.y};color:${s.c};border-color:${s.c}22;opacity:.18;text-shadow:0 0 6px ${s.c}55,0 0 14px ${s.c}22;box-shadow:0 0 4px ${s.c}1a,inset 0 0 4px ${s.c}08;animation-delay:${-i*1.3}s;${s.f ? `font-family:'Orbitron',monospace;font-weight:700;font-size:.7rem;letter-spacing:.15em` : ''}`;
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
  const count = Math.min(Math.floor(W() / 6), 250);
  for (let i = 0; i < count; i++)
    rainDrops.push({ x:rand(0,W()), y:rand(-H(),H()), len:rand(10,25), speed:rand(8,16), op:rand(0.06,0.18), w:rand(0.3,0.7) });
}
initRain();

function drawRain() {
  if (!rainCtx || !rainCanvas) return;
  rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  rainCtx.strokeStyle = 'rgba(0,229,255,0.12)';
  rainCtx.lineWidth = 0.5;
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
    flowCtx.lineWidth = s.width * 4; flowCtx.globalAlpha = s.opacity * 0.3; flowCtx.stroke();
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
  cx.globalAlpha = 0.4; cx.strokeStyle = '#ffffff'; cx.lineWidth = 1;
  cx.beginPath(); cx.moveTo(x+60,y-3); cx.lineTo(x+55,y-20); cx.lineTo(x+65,y-20); cx.lineTo(x+60,y-3); cx.stroke();
  cx.globalAlpha = 0.1; cx.strokeStyle = '#00e5ff'; cx.lineWidth = 0.8;
  cx.beginPath(); cx.moveTo(0,y-20); cx.lineTo(W(),y-20); cx.stroke();
  cx.globalAlpha = 0.5 + Math.sin(t*3)*0.2; cx.fillStyle = '#00e5ff';
  cx.fillRect(x+2, y+32, 116, 2);
  cx.shadowColor = '#00e5ff'; cx.shadowBlur = 8; cx.fillRect(x+2, y+32, 116, 2); cx.shadowBlur = 0;
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
    cx.shadowColor = car.color; cx.shadowBlur = 12;
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
setTimeout(positionNeonSVG, 700);

// ── NAV ENTRANCE ANIMATION ──
if (navSignsEl) {
  navSignsEl.querySelectorAll('.nav-sign').forEach((s, i) => {
    setTimeout(() => s.classList.add('visible'), 1200 + i * 150);
  });
}

// ── MAIN LOOP ──
function loop(ts) {
  const t = ts * 0.001;
  drawRain();
  drawWindows(t);
  drawNeonFlow(t);
  drawReflections(t);
  if (objCtx && objectsCanvas) objCtx.clearRect(0, 0, objectsCanvas.width, objectsCanvas.height);
  drawTram(t);
  drawFlyingCars(t);
  drawPuddles(t);
  requestAnimationFrame(loop);
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
  positionNeonSVG();
});

// ── PARALLAX ──
document.addEventListener('mousemove', e => {
  const mx = (e.clientX / W() - 0.5) * 2;
  if (cityBack)  cityBack.style.transform  = `translateX(${mx * -8}px)`;
  if (cityMid)   cityMid.style.transform   = `translateX(${mx * -15}px)`;
  if (cityFront) cityFront.style.transform = `translateX(${mx * -25}px)`;
});
