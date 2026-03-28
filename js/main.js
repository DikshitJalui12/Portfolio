/* ===== HUD CURSOR & DRAG TRAIL ===== */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
let isDragging = false;

// Track mouse and create trail on drag
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';

  if (isDragging) {
    createTrailDot(mx, my);
  }
});

// Detect Dragging
document.addEventListener('mousedown', () => isDragging = true);
document.addEventListener('mouseup', () => isDragging = false);

// Smooth Follow for Ring
function lerp() {
  rx += (mx - rx) * 0.55;
  ry += (my - ry) * 0.55;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(lerp);
}
lerp();

// Generate Neon Trail
function createTrailDot(x, y) {
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = x + 'px';
  dot.style.top = y + 'px';
  document.body.appendChild(dot);

  // Trigger animation next frame
  requestAnimationFrame(() => {
    dot.style.opacity = '0';
    dot.style.transform = 'translate(-50%, -50%) scale(0.1)';
  });

  // Cleanup DOM
  setTimeout(() => dot.remove(), 400);
}

// Hover effects for links
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) rotate(-30deg) scale(1.5)';
    ring.style.width = '60px';
    ring.style.height = '60px';
    ring.style.borderColor = 'var(--accent3)'; // Changes to Pink on hover
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) rotate(-0deg) scale(1)';
    ring.style.width = '40px';
    ring.style.height = '40px';
    ring.style.borderColor = 'var(--accent)';
  });
});
/* ===== 3D CYBER WAVE BACKGROUND (HERO) ===== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;
let time = 0;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize(); 
window.addEventListener('resize', resize);

const cols = 55;        
const rows = 40;        
const spacing = 45;     

function drawWave() {
  ctx.fillStyle = 'rgba(2, 4, 8, 0.4)';
  ctx.fillRect(0, 0, W, H);

  const points = [];

  for (let z = 0; z < rows; z++) {
    points[z] = [];
    for (let x = 0; x < cols; x++) {
      const px = (x - cols / 2) * spacing;
      const pz = z * spacing;

      const dist = Math.sqrt(px * px + pz * pz);
      const py = Math.sin(dist * 0.01 - time * 0.02) * 70
               + Math.sin(px * 0.02 + time * 0.015) * 40
               + Math.cos(pz * 0.02 + time * 0.01) * 40;

      const fov = 600;
      const zOffset = pz + 250; 
      const scale = fov / zOffset;

      const screenX = W / 2 + px * scale;
      const screenY = H / 2 + (py + 100) * scale + (H * 0.15); 

      points[z][x] = { x: screenX, y: screenY, py: py, scale: scale, zOffset: zOffset };
    }
  }

  for (let z = 0; z < rows; z++) {
    for (let x = 0; x < cols; x++) {
      const p = points[z][x];
      if (p.zOffset <= 0) continue;

      const alpha = Math.max(0, Math.min(1, 1 - (z / (rows - 5))));
      const hue = 220 + p.py * 1.5; 
      const color = `hsla(${hue}, 100%, 60%, ${alpha})`;
      const lineColor = `hsla(${hue}, 100%, 60%, ${alpha * 0.25})`;
      const strokeWidth = Math.max(0.5, 1.5 * p.scale);

      if (x > 0) {
        const prevX = points[z][x - 1];
        ctx.beginPath(); ctx.moveTo(prevX.x, prevX.y); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = lineColor; ctx.lineWidth = strokeWidth; ctx.stroke();
      }
      if (z > 0) {
        const prevZ = points[z - 1][x];
        ctx.beginPath(); ctx.moveTo(prevZ.x, prevZ.y); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = lineColor; ctx.lineWidth = strokeWidth; ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, 2.5 * p.scale), 0, Math.PI * 3);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
  time += 0.8; 
  requestAnimationFrame(drawWave);
}
drawWave();

/* ===== ISOMETRIC CUBES BACKGROUND (REMAINING PAGE) ===== */
const isoCanvas = document.getElementById('iso-canvas');
const isoCtx = isoCanvas.getContext('2d');
let iw, ih;
let isoTime = 0;

function resizeIso() {
  iw = isoCanvas.width = window.innerWidth;
  ih = isoCanvas.height = window.innerHeight;
}
resizeIso(); window.addEventListener('resize', resizeIso);

const tileW = 50;
const tileH = 30.55; 

function drawCubes() {
  isoCtx.clearRect(0, 0, iw, ih);
  
  const colsIso = Math.ceil(iw / tileW) + 8;
  const rowsIso = Math.ceil(ih / (tileH * 1.5)) + 2; 
  
  const offsetX = (isoTime * 12) % tileW;
  const offsetY = (isoTime * 18) % (tileH * 3);

  for (let y = -2; y < rowsIso; y++) {
    for (let x = -2; x < colsIso; x++) {
      const plotX = x * tileW + (y % 2 ? tileW / 2 : 0) - offsetX;
      const plotY = y * (tileH * 1.5) - offsetY;
      
      const noise = Math.sin(x * 0.3 + y * 0.4 + isoTime * 0.8) + Math.cos(x * 0.2 - y * 0.1 + isoTime * 0.5);
      
      if (noise > -52.0) {
         const alpha = Math.min(0.3, (noise - 0.5) * 0.4); 
         const hue = 220 + noise * 40; 
         
         isoCtx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha})`;
         isoCtx.beginPath();
         isoCtx.moveTo(plotX, plotY);
         isoCtx.lineTo(plotX + tileW/2, plotY - tileH/2);
         isoCtx.lineTo(plotX + tileW, plotY);
         isoCtx.lineTo(plotX + tileW/2, plotY + tileH/2);
         isoCtx.fill();
         
         isoCtx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
         isoCtx.beginPath();
         isoCtx.moveTo(plotX, plotY);
         isoCtx.lineTo(plotX + tileW/2, plotY + tileH/2);
         isoCtx.lineTo(plotX + tileW/2, plotY + tileH*1.5);
         isoCtx.lineTo(plotX, plotY + tileH);
         isoCtx.fill();
         
         isoCtx.fillStyle = `hsla(${hue}, 100%, 30%, ${alpha})`;
         isoCtx.beginPath();
         isoCtx.moveTo(plotX + tileW, plotY);
         isoCtx.lineTo(plotX + tileW/2, plotY + tileH/2);
         isoCtx.lineTo(plotX + tileW/2, plotY + tileH*1.5);
         isoCtx.lineTo(plotX + tileW, plotY + tileH);
         isoCtx.fill();
         
         isoCtx.strokeStyle = `hsla(${hue}, 100%, 80%, ${alpha * 2.5})`;
         isoCtx.lineWidth = 0.5;
         isoCtx.stroke();
      }
    }
  }
  isoTime += 0.025;
  requestAnimationFrame(drawCubes);
}
drawCubes();

/* ===== SCROLL PROGRESS ===== */
const progressBar = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', ()=>{
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
  progressBar.style.width = (scrollY / maxScroll) * 100 + '%';
  backToTop.classList.toggle('visible', scrollY > 400);
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Cross-fade logic
  if(scrollY > 300) {
    // Fade out 3D Wave Canvas
    canvas.style.opacity = Math.max(0, 1 - (scrollY - 300) / 600);
    // Fade in Isometric Canvas
    isoCanvas.style.opacity = Math.min(1, (scrollY - 300) / 400);
  } else {
    canvas.style.opacity = 1;
    isoCanvas.style.opacity = 0;
  }
});

/* ===== SCROLL FADE-IN ===== */
const obs = new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting) e.target.classList.add('visible');
}),{threshold:0.1});
document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));

/* ===== SKILL BAR ANIMATION ===== */
const skillObs = new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){
    e.target.querySelectorAll('.skill-fill').forEach(fill=>{
      const w = fill.dataset.width;
      setTimeout(()=>{ fill.style.width = w + '%'; }, 100);
    });
  }
}),{threshold:0.2});
document.querySelectorAll('.skills-grid').forEach(el=>skillObs.observe(el));

/* ===== ACTIVE NAV INDICATOR ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(a=>a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if(active) active.classList.add('active');
    }
  });
},{threshold:0.4});
sections.forEach(s=>navObs.observe(s));

/* ===== RESUME MODAL ===== */
function openResume(){
  document.getElementById('resume-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeResume(){
  const overlay = document.getElementById('resume-overlay');
  overlay.style.animation = 'none';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s';
  setTimeout(()=>{
    overlay.classList.remove('open');
    overlay.style.opacity = '';
    overlay.style.transition = '';
    document.body.style.overflow = '';
  }, 300);
}
document.getElementById('resume-overlay').addEventListener('click', function(e){
  if(e.target === this) closeResume();
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeResume(); });

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target, suffix=''){
  let start=0, duration=1500;
  const step = timestamp=>{
    if(!start) start=timestamp;
    const progress = Math.min((timestamp-start)/duration, 1);
    const eased = 1-Math.pow(1-progress,3);
    el.textContent = (eased*target).toFixed(target%1!==0?2:0)+suffix;
    if(progress<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statObs = new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){
    const nums = e.target.querySelectorAll('.stat-num');
    nums[0] && animateCounter(nums[0], 9.03);
    nums[1] && animateCounter(nums[1], 4, '+');
    nums[2] && animateCounter(nums[2], 100, '+');
    statObs.unobserve(e.target);
  }
}),{threshold:0.5});
const statsEl = document.querySelector('.hero-stats');
if(statsEl) statObs.observe(statsEl);

/* ===== SYNTHESIZED TECH UI SOUNDS ===== */
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playTechSound(waveType, frequency) {
  // Initialize on first click to bypass browser auto-play blocks
  if (!audioCtx) { audioCtx = new AudioContext(); }
  if (audioCtx.state === 'suspended') { audioCtx.resume(); }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = waveType; // 'sine', 'square', 'sawtooth', 'triangle'
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  // LOUDER VOLUME SETTING (0.4 instead of 0.1)
  gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
  // Fades out to near-silence over 0.3 seconds to create the "blip" effect
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

  /* ===== LIVE CODING STATS FETCHER ===== */
async function fetchLiveCodingStats() {
  // --- IMPORTANT: REPLACE THESE WITH YOUR EXACT USERNAMES ---
  const usernames = {
    leetcode: 'Dikshit_Jalui_12', 
    codechef: 'dikshitjalui12',
    gfg: 'dikshitj0i8o', 
    hackerrank: 'dikshitjalui03' // <-- HACKERRANK ADDED HERE
  };

  // 1. Fetch LeetCode Data (Using a highly stable open-source wrapper)
  try {
    const lcResponse = await fetch(`https://leetcode-stats-api.herokuapp.com/${usernames.leetcode}`);
    const lcData = await lcResponse.json();
    if (lcData.status === "success") {
      document.getElementById('lc-stat').innerText = lcData.totalSolved;
    } else {
      document.getElementById('lc-stat').innerText = "Err";
    }
  } catch (error) {
    document.getElementById('lc-stat').innerText = "N/A";
  }

  // 2. Fetch CodeChef Data
  try {
    const ccResponse = await fetch(`https://codechef-api.vercel.app/handle/${usernames.codechef}`);
    const ccData = await ccResponse.json();
    if (ccData.success) {
      document.getElementById('cc-stat').innerText = ccData.stars;
    } else {
      document.getElementById('cc-stat').innerText = "Err";
    }
  } catch (error) {
    document.getElementById('cc-stat').innerText = "N/A";
  }

  // 3. Fetch HackerRank Data 
  try {
    // Note: Free HackerRank APIs are often community-hosted and can be blocked by CORS.
    // If it fails, it will safely drop to the 'catch' block below.
    const hrResponse = await fetch(`https://hackerrank-api.vercel.app/api/user/${usernames.hackerrank}`);
    if (hrResponse.ok) {
      const hrData = await hrResponse.json();
      // Assuming the API returns a 'badges' or similar count. Adjust if necessary.
      document.getElementById('hr-stat').innerText = hrData.badges || "5★"; 
    } else {
      throw new Error("HR API blocked or unavailable");
    }
  } catch (error) {
    // Fallback hardcoded value if the API blocks the request
    document.getElementById('hr-stat').innerText = "5★"; // Manually update this if the API is down
  }

  // 4. GeeksforGeeks Data (No stable public API available)
  // Fallback hardcoded value:
  document.getElementById('gfg-stat').innerText = "400"; // Manually update your GFG score here
}

// Run the fetcher immediately when the page loads
fetchLiveCodingStats();
