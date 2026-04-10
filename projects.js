// ══════════════════════════════════════════════════════════════════════════════
// PROJECTS — TERRACE VIEW v4
// ══════════════════════════════════════════════════════════════════════════════

document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

// ── PROJECT DATA ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    num:   '01',
    title: 'LoanLens',
    desc:  'A full-stack debt payoff strategizer built in 24 hours at the SHU 2026 Hackathon, where we placed. Users enter their loan info and get a personalized dashboard with payoff timelines, a what-if payment simulator, and an AI advisor that knows their actual numbers and gives real repayment strategy advice.',
    tech:  ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Anthropic API', 'Vercel'],
    color: '#ff3355',
    kanji: '連',
    live:  'https://loan-lens-ashy.vercel.app/',
    code:  'https://github.com/alexgimourginas/LoanLens',
  },
  {
    num:   '02',
    title: 'PirateShield',
    desc:  'A multi-layer cybersecurity system built for New Jersey K-12 schools, designed to monitor identity, device, network, and access behavior over time. Includes a 3-layer hybrid risk scoring model combining rule-based detection, autoencoder-based anomaly analysis, and temporal event correlation. Currently targeting publication at ICICS 2026 (Springer LNCS).',
    tech:  ['Python', 'TypeScript', 'Node.js'],
    color: '#ff69b4',
    kanji: '守',
    live:  '#',
    code:  'https://github.com/poncema4/PirateShield',
  },
  {
    num:   '03',
    title: 'Pokemon Battle Simulator',
    desc:  'A 3-player multiplayer Pokemon battle simulator where players connect to a central server, draft teams, and battle in a turn-based GUI system. Features a custom-built chatbot assistant that answers gameplay questions in real time, backed by a local database and hand-crafted query handling, no APIs.',
    tech:  ['Python', 'Tkinter', 'SQLite3', 'TCP Sockets'],
    color: '#33cc77',
    kanji: '戦',
    live:  '#',
    code:  'https://github.com/alexgimourginas/Pokemon-Battle-Simulator',
  },
  {
    num:   '04',
    title: 'Transport Monitor Simulator',
    desc:  'A backend system simulating real-time public transit coordination across buses, trains, and ride shares. Vehicles connect as networked clients to a central control server that handles live rerouting, delay reporting, and fault tolerance using both TCP and UDP. Applies Command, Observer, and Singleton design patterns throughout.',
    tech:  ['Python', 'TCP/UDP Sockets', 'SQLite3', 'Threading'],
    color: '#2299ff',
    kanji: '運',
    live:  '#',
    code:  'https://github.com/alexgimourginas/Transport-Monitor-Simulator',
  },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
const rand = (a, b) => Math.random() * (b - a) + a;
const W = () => window.innerWidth;
const H = () => window.innerHeight;

// ── INJECT PROJECT CARDS ────────────────────────────────────────────────────
const projectsEl = document.getElementById('pj-projects');

PROJECTS.forEach((p) => {
  const c = p.color;
  const dim = c + '44', dim2 = c + '22', inset = c + '0a';
  const tags = p.tech.map(t => `<span class="pj-tag">${t}</span>`).join('');

  const el = document.createElement('div');
  el.className = 'pj-card';
  const primaryUrl = p.live !== '#' ? p.live : (p.code !== '#' ? p.code : null);
  if (primaryUrl) {
    el.addEventListener('click', e => {
      if (e.target.closest('.pj-btn')) return;
      window.open(primaryUrl, '_blank', 'noopener,noreferrer');
    });
  }
  el.style.cssText = `--cc:${c};--cc-dim:${dim};--cc-dim2:${dim2};--cc-in:${inset}`;

  el.innerHTML = `
    <div class="pj-card-kanji">${p.kanji}</div>
    <div class="pj-card-num">${p.num} /</div>
    <div class="pj-card-title">${p.title}</div>
    <div class="pj-card-desc">${p.desc}</div>
    <div class="pj-card-footer">
      <div class="pj-card-tags">${tags}</div>
      <div class="pj-card-btns">
        ${p.live !== '#' ? `<a class="pj-btn" href="${p.live}" target="_blank" rel="noopener noreferrer">LIVE ↗</a>` : ''}
        ${p.code !== '#' ? `<a class="pj-btn" href="${p.code}" target="_blank" rel="noopener noreferrer">CODE ↗</a>` : ''}
      </div>
    </div>
  `;
  projectsEl.appendChild(el);
});

// ── DENSE BACKGROUND CITY — 3 depth layers ──────────────────────────────────
const bgCity = document.getElementById('pj-bg-city');
const neonCols = ['#00e5ff','#ff2d95','#b44aff','#33ff88','#ffb347','#7b6fff','#ff6b6b'];

const layers = [
  // FAR — short, narrow, dimmest
  { cls: 'pj-bg-far', count: 22, wMin: 1.2, wMax: 3, hMin: 20, hMax: 55,
    rMin: 10, rMax: 20, gMin: 10, gMax: 18, bMin: 35, bMax: 58 },
  // MID — medium
  { cls: 'pj-bg-mid', count: 20, wMin: 1.8, wMax: 4, hMin: 35, hMax: 72,
    rMin: 14, rMax: 26, gMin: 12, gMax: 22, bMin: 48, bMax: 78 },
  // NEAR — tallest, widest, most visible
  { cls: 'pj-bg-near', count: 16, wMin: 2.5, wMax: 5.5, hMin: 45, hMax: 88,
    rMin: 20, rMax: 36, gMin: 16, gMax: 28, bMin: 62, bMax: 95 },
];

layers.forEach(layer => {
  for (let i = 0; i < layer.count; i++) {
    const bldg = document.createElement('div');
    bldg.className = 'pj-bgb ' + layer.cls;
    const w = rand(layer.wMin, layer.wMax);
    const h = rand(layer.hMin, layer.hMax);
    const left = rand(0, 98);
    const r = layer.rMin + rand(0, layer.rMax - layer.rMin);
    const g = layer.gMin + rand(0, layer.gMax - layer.gMin);
    const bl = layer.bMin + rand(0, layer.bMax - layer.bMin);
    bldg.style.cssText = `left:${left}%;width:${w}%;height:${h}%;background:rgb(${r},${g},${bl})`;

    // Neon edge highlight on ~50% of buildings
    if (Math.random() > 0.5) {
      const edge = document.createElement('div');
      const ec = neonCols[Math.floor(rand(0, neonCols.length))];
      const side = Math.random() > 0.5 ? 'pj-bgb-edge-l' : 'pj-bgb-edge-r';
      edge.className = 'pj-bgb-edge ' + side;
      edge.style.cssText = `--ec:${ec}; opacity: ${rand(0.22, 0.50)}`;
      bldg.appendChild(edge);
    }

    // Horizontal neon band on ~35%
    if (Math.random() > 0.65) {
      const band = document.createElement('div');
      band.className = 'pj-bgb-band';
      const bc = neonCols[Math.floor(rand(0, neonCols.length))];
      band.style.cssText = `top:${rand(8, 40)}%;--bc2:${bc}`;
      bldg.appendChild(band);
    }

    // Vertical neon stripe on ~30%
    if (Math.random() > 0.7) {
      const stripe = document.createElement('div');
      stripe.className = 'pj-bgb-stripe';
      stripe.style.setProperty('--sc', neonCols[Math.floor(rand(0, neonCols.length))]);
      bldg.appendChild(stripe);
    }

    // Accent light on ~30%
    if (Math.random() > 0.7) {
      const light = document.createElement('div');
      light.className = 'pj-bgb-light';
      const lc = neonCols[Math.floor(rand(0, neonCols.length))];
      light.style.cssText = `top:${rand(5, 30)}%;background:${lc}30`;
      bldg.appendChild(light);
    }

    // Windows on ~50%
    if (Math.random() > 0.5) {
      const winCount = Math.floor(rand(2, 7));
      for (let j = 0; j < winCount; j++) {
        const win = document.createElement('div');
        win.className = 'pj-bgb-win';
        const wc = neonCols[Math.floor(rand(0, neonCols.length))];
        win.style.cssText = `left:${rand(10, 70)}%;top:${rand(8, 80)}%;opacity:${rand(0.22, 0.55)};--wc:${wc}`;
        bldg.appendChild(win);
      }
    }

    bgCity.appendChild(bldg);
  }
});

// ── STARS ────────────────────────────────────────────────────────────────────
const starsEl = document.getElementById('pj-stars');
for (let i = 0; i < 50; i++) {
  const s = document.createElement('div');
  s.className = 'pj-star';
  const sz = rand(0.5, 2);
  s.style.cssText = `width:${sz}px;height:${sz}px;left:${rand(0,100)}%;top:${rand(0,30)}%;` +
    `--td:${rand(3,7)}s;--to:${rand(0.2,0.6)};animation-delay:${rand(-5,0)}s`;
  starsEl.appendChild(s);
}

// ── FLOATING PARTICLES ──────────────────────────────────────────────────────
const particlesEl = document.getElementById('pj-particles');
const moteCols = ['#00e5ff','#ff2d95','#b44aff','#33ff88','#ffb347','#ffffff'];
for (let i = 0; i < 30; i++) {
  const m = document.createElement('div');
  m.className = 'pj-mote';
  const sz = rand(1.5, 4);
  const c = moteCols[Math.floor(rand(0, moteCols.length))];
  const side = Math.random() > 0.5 ? rand(2, 28) : rand(72, 98);
  m.style.cssText = `width:${sz}px;height:${sz}px;left:${side}%;bottom:${rand(10,50)}%;` +
    `background:${c};box-shadow:0 0 ${sz*2}px ${c}44;` +
    `--fd:${rand(8,18)}s;--fo:${rand(0.08,0.22)};--drift:${rand(-30,30)}px;` +
    `animation-delay:${rand(-15,0)}s`;
  particlesEl.appendChild(m);
}

// ── TRAM — smooth elliptical orbit ──────────────────────────────────────────
const tramEl = document.querySelector('.pj-tram');
const tramSystem = document.querySelector('.pj-tram-system');
const TRAM_SPEED = 0.0006;

function tramLoop(ts) {
  if (!tramEl || !tramSystem) return requestAnimationFrame(tramLoop);
  const angle = (ts * TRAM_SPEED) % (Math.PI * 2);

  // Rail is inset:0 of tram-system, so radii = half of tram-system's own size
  const w = tramSystem.offsetWidth;
  const h = tramSystem.offsetHeight;
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;

  const x = cx + Math.cos(angle) * rx;
  const y = cy + Math.sin(angle) * ry;

  // Face direction of travel
  const dx = -Math.sin(angle) * rx;
  const dy = Math.cos(angle) * ry;
  const rot = Math.atan2(dy, dx) * (180 / Math.PI);

  tramEl.style.transform = `translate(${x - 15}px, ${y - 7}px) rotate(${rot}deg)`;
  requestAnimationFrame(tramLoop);
}
requestAnimationFrame(tramLoop);

// ── RAILING POSTS ───────────────────────────────────────────────────────────
const railingPosts = document.getElementById('pj-railing-posts');
if (railingPosts) {
  const count = Math.floor(W() / 50);
  for (let i = 0; i < count; i++) {
    const post = document.createElement('div');
    post.className = 'pj-railing-post';
    post.style.left = (i / (count - 1)) * 100 + '%';
    railingPosts.appendChild(post);
  }
}

// ── TRAM INTRO ──────────────────────────────────────────────────────────────
const introEl = document.getElementById('pj-intro');
const introCanvas = document.getElementById('pj-intro-canvas');
let introCtx = null, introStreaks = [], introStart = null, introActive = true;

if (introCanvas) {
  introCtx = introCanvas.getContext('2d');
  introCanvas.width = W(); introCanvas.height = H();
  const cols = ['#b44aff','#ff2d95','#00e5ff','#ffb347','#33ff88','#ffffff'];
  for (let i = 0; i < 120; i++) {
    introStreaks.push({
      x: rand(-W() * 0.5, W() * 1.5), y: rand(0, H()),
      w: rand(80, W() * 0.5), h: rand(1, 4),
      speed: rand(40, 100),
      color: cols[Math.floor(rand(0, cols.length))],
      opacity: rand(0.05, 0.35),
    });
  }
}

function runIntro(ts) {
  if (!introActive || !introCtx) return;
  if (!introStart) introStart = ts;
  const elapsed = ts - introStart;

  if (elapsed >= 900) {
    introActive = false;
    introEl.style.display = 'none';
    document.querySelector('.pj-scene').classList.add('pj-scene-in');
    return;
  }

  const decel = elapsed < 200 ? 1 : Math.max(0, 1 - (elapsed - 200) / 150);

  if (elapsed >= 350) {
    const dL = introEl.querySelector('.pj-door-l');
    const dR = introEl.querySelector('.pj-door-r');
    if (dL && !dL.classList.contains('open')) {
      dL.classList.add('open'); dR.classList.add('open');
      document.querySelector('.pj-scene').classList.add('pj-scene-in');
    }
  }
  if (elapsed >= 550) {
    introEl.style.opacity = String(1 - (elapsed - 550) / 350);
  }

  // Fade canvas out once streaks stop (decel=0), over ~200ms
  const canvasFade = decel > 0 ? 1 : Math.max(0, 1 - (elapsed - 350) / 200);
  introCanvas.style.opacity = canvasFade;

  // Full opaque clear — trail comes from streak width, not transparency
  introCtx.fillStyle = '#040618';
  introCtx.fillRect(0, 0, introCanvas.width, introCanvas.height);
  for (const s of introStreaks) {
    introCtx.fillStyle = s.color;
    introCtx.globalAlpha = s.opacity * (0.3 + decel * 0.7);
    introCtx.fillRect(s.x, s.y, s.w * (0.25 + decel * 0.75), s.h);
    s.x -= s.speed * decel;
    if (s.x + s.w < -80) { s.x = W() + rand(0, 200); s.y = rand(0, H()); }
  }
  introCtx.globalAlpha = 1;
  requestAnimationFrame(runIntro);
}
requestAnimationFrame(runIntro);

function skipIntro() {
  introActive = false;
  introEl.style.transition = 'opacity 0.25s';
  introEl.style.opacity = '0';
  document.querySelector('.pj-scene').classList.add('pj-scene-in');
  setTimeout(() => { introEl.style.display = 'none'; }, 260);
}
introEl.addEventListener('click', skipIntro);
document.addEventListener('keydown', skipIntro, { once: true });

// ── PARALLAX ────────────────────────────────────────────────────────────────
const valleyL = document.querySelector('.pj-valley-left');
const valleyR = document.querySelector('.pj-valley-right');
const focal   = document.querySelector('.pj-focal');

document.addEventListener('mousemove', e => {
  const mx = (e.clientX / W() - 0.5) * 2;
  const my = (e.clientY / H() - 0.5) * 2;
  if (valleyL) valleyL.style.transform = `translateX(${mx * -3}px) translateY(${my * -1.5}px)`;
  if (valleyR) valleyR.style.transform = `translateX(${mx * 3}px) translateY(${my * -1.5}px)`;
  if (focal)   focal.style.transform   = `translateX(calc(-50% + ${mx * -1.5}px)) translateY(${my * -1}px)`;
  if (bgCity)  bgCity.style.transform   = `translateX(${mx * -1}px)`;
});

// ── AIRCRAFT EASTER EGG — hover to slow, click to shoot down ──────────────
document.querySelectorAll('.pj-aircraft').forEach(ac => {
  ac.addEventListener('mouseenter', () => {
    if (ac.classList.contains('pj-ac-hit')) return;
    ac.getAnimations().forEach(a => { a.playbackRate = 0.3; });
  });
  ac.addEventListener('mouseleave', () => {
    if (ac.classList.contains('pj-ac-hit')) return;
    ac.getAnimations().forEach(a => { a.playbackRate = 1; });
  });
  ac.addEventListener('click', () => {
    if (ac.classList.contains('pj-ac-hit')) return;

    // Grab position BEFORE killing the animation
    const rect = ac.getBoundingClientRect();
    const sceneRect = document.querySelector('.pj-scene').getBoundingClientRect();
    const x = rect.left - sceneRect.left;
    const y = rect.top - sceneRect.top;

    // Now freeze in place
    ac.style.left = x + 'px';
    ac.style.top = y + 'px';
    ac.style.transform = 'none';
    ac.style.opacity = '1';
    ac.classList.add('pj-ac-hit');

    // Tumble & fall
    let vy = 0, vr = 0, cy = 0, rot = 0, smokeTimer = 0, fallStart = null;
    const spin = (Math.random() > 0.5 ? 1 : -1) * rand(3, 6);
    const drift = rand(-1.5, 1.5);

    function fall(ts) {
      if (!fallStart) fallStart = ts;
      const elapsed = ts - fallStart;
      // Ease in: ramp gravity from 0.02 to 0.35 over ~400ms
      const grav = elapsed < 400 ? 0.02 + 0.33 * (elapsed / 400) : 0.35;
      const spinMul = elapsed < 400 ? elapsed / 400 : 1;

      vy += grav;
      vr += spin * 0.02 * spinMul;
      cy += vy;
      rot += (vr + spin) * spinMul;
      smokeTimer++;

      ac.style.transform = `translateY(${cy}px) translateX(${drift * smokeTimer}px) rotate(${rot}deg)`;
      ac.style.opacity = String(Math.max(0, 1 - cy / (H() * 0.8)));

      // Smoke puffs every few frames
      if (smokeTimer % 4 === 0) {
        const puff = document.createElement('div');
        puff.className = 'pj-ac-smoke';
        const sz = rand(6, 14);
        puff.style.cssText = `width:${sz}px;height:${sz}px;left:${x + drift * smokeTimer + rand(-5,5)}px;top:${y + cy + rand(-3,3)}px;`;
        document.querySelector('.pj-scene').appendChild(puff);
        setTimeout(() => puff.remove(), 1200);
      }

      if (cy < H()) {
        requestAnimationFrame(fall);
      } else {
        // Reset after a delay so it flies again
        setTimeout(() => {
          ac.classList.remove('pj-ac-hit');
          ac.style.left = '';
          ac.style.top = '';
          ac.style.transform = '';
          ac.style.opacity = '';
        }, 4000);
      }
    }
    requestAnimationFrame(fall);
  });
});
