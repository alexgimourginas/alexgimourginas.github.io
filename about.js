// ═══════════════════════════════════════════════════════
// ABOUT — NEON DINER
// Loading sequence → camera pan → document reveal
// ═══════════════════════════════════════════════════════

// ── Boot lines ──────────────────────────────────────────
const BOOT_LINES = [
  { label: 'AMBIENT.RAIN',        status: 'INIT',    color: '#22dd88' },
  { label: 'NEON.GRID',           status: 'SYNC',    color: '#22dd88' },
  { label: 'BOOTH.ENVIRON',       status: 'BOOT',    color: '#22dd88' },
  { label: 'CITIZEN.FILE [AG-001]', status: 'DECRYPT', color: '#00e5ff' },
  { label: 'DINER.SYSTEMS',       status: 'ONLINE',  color: '#ff2d95' },
];

// Timing (ms) when each line appears, and its progress bar target (%)
const LINE_TIMES    = [120, 320, 540, 760, 940];
const LINE_PROGRESS = [18,  40,  62,  84,  100];

// ── Main init ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  const loader  = document.getElementById('ab-loader');
  const term    = document.getElementById('ab-ld-term');
  const bar     = document.getElementById('ab-ld-bar');
  const pctEl   = document.getElementById('ab-ld-pct');
  const scene   = document.querySelector('.ab-scene');
  const doc     = document.getElementById('ab-doc');

  // ── Blinking cursor ─────────────────────────────────
  const cursor = document.createElement('span');
  cursor.className = 'ab-ld-cursor';
  term.appendChild(cursor);

  // ── Append a boot line ──────────────────────────────
  function addLine(i) {
    cursor.remove();

    const line = document.createElement('div');
    line.className = 'ab-ld-line';

    const labelEl  = document.createElement('span');
    labelEl.className = 'ab-ld-label';
    labelEl.textContent = BOOT_LINES[i].label;

    const dotsEl = document.createElement('span');
    dotsEl.className = 'ab-ld-dots';

    const statusEl = document.createElement('span');
    statusEl.className = 'ab-ld-status';
    statusEl.style.color = BOOT_LINES[i].color;
    statusEl.textContent = BOOT_LINES[i].status;

    line.appendChild(labelEl);
    line.appendChild(dotsEl);
    line.appendChild(statusEl);
    term.appendChild(line);

    // Update progress bar
    bar.style.width = LINE_PROGRESS[i] + '%';
    pctEl.textContent = LINE_PROGRESS[i] + '%';

    // Re-add cursor (except after last line)
    if (i < BOOT_LINES.length - 1) {
      term.appendChild(cursor);
    }
  }

  // ── Schedule each boot line ──────────────────────────
  LINE_TIMES.forEach((t, i) => {
    setTimeout(() => addLine(i), t);
  });

  // ── After all lines: flash → fade → reveal ───────────
  const allDone = LINE_TIMES[LINE_TIMES.length - 1] + 180;

  setTimeout(() => {
    // Brief colour flash (diner "powering on")
    loader.style.background = '#001c14';
    setTimeout(() => {
      loader.style.background = '#000012';
      setTimeout(() => {
        loader.style.background = '#000';

        // Fade out the loader
        setTimeout(() => {
          loader.classList.add('ab-ld-out');

          // After fade completes: hide loader, start camera pan
          setTimeout(() => {
            loader.style.display = 'none';

            // Double rAF ensures the transition fires reliably
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                scene.classList.add('ab-settled');
              });
            });

            // After camera settles (~2.3s), reveal the document
            setTimeout(() => {
              doc.classList.add('ab-doc-on');
            }, 2400);

          }, 560); // matches CSS transition: 0.55s
        }, 220);

      }, 110);
    }, 90);
  }, allDone);

  // ── Rain canvas ─────────────────────────────────────
  initRain();
});


// ═══════════════════════════════════════════════════════
// RAIN CANVAS
// ═══════════════════════════════════════════════════════
const NEON_COLORS = ['#00e5ff', '#b44aff', '#ff2d95'];

function initRain() {
  const canvas = document.getElementById('ab-rain');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let drops = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function makeDrops() {
    drops = [];
    const count = Math.max(25, Math.floor(canvas.width * canvas.height / 1800));
    for (let i = 0; i < count; i++) {
      drops.push(spawn(true));
    }
  }

  function spawn(scatter = false) {
    const isNeon = Math.random() < 0.10;
    return {
      x:     Math.random() * canvas.width,
      y:     scatter ? Math.random() * canvas.height : -20,
      len:   7 + Math.random() * 20,
      spd:   1.5 + Math.random() * 3.5,
      alpha: 0.06 + Math.random() * 0.28,
      width: isNeon ? 1 : 0.65,
      color: isNeon
        ? NEON_COLORS[Math.floor(Math.random() * 3)]
        : `hsl(225,28%,${52 + Math.random() * 28}%)`,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of drops) {
      ctx.save();
      ctx.globalAlpha = d.alpha;
      ctx.strokeStyle  = d.color;
      ctx.lineWidth    = d.width;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 0.6, d.y + d.len);
      ctx.stroke();
      ctx.restore();

      d.y += d.spd;
      if (d.y > canvas.height + d.len) {
        Object.assign(d, spawn());
      }
    }

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    makeDrops();
    draw();
  });

  resize();
  makeDrops();
  draw();
}
