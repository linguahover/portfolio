/* ============================================================
   ABU HANZALA — Portfolio JS
   Handles: cursor, loader, particles, nav, reveal, typewriter,
   counters, skill bars, tabs, mobile menu, form
   ============================================================ */

/* -------- Loader -------- */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hide'), 700);
});

/* -------- Year -------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* -------- Custom Cursor -------- */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});
function animateRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateRing);
}
animateRing();

const hoverEls = document.querySelectorAll('a, button, .research-card, .project-card, .pub-item, .review-item, .stat-badge, .skill-tags-cloud span, .interest-list li, .contact-item, .education-card, .timeline-card, .skill-group');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* -------- Particles -------- */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

const particles = [];
const PARTICLE_COUNT = window.innerWidth < 720 ? 30 : 60;
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.8 + 0.5,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    color: Math.random() > 0.7 ? '107,25,25' : '15,30,53',
    alpha: Math.random() * 0.4 + 0.15
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
    ctx.fill();

    // connect nearby
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(15, 30, 53, ${0.08 * (1 - dist/130)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* -------- Navbar Scroll & Progress -------- */
const navbar = document.getElementById('navbar');
const navProgress = document.getElementById('navProgress');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);

  const total = document.documentElement.scrollHeight - window.innerHeight;
  navProgress.style.width = `${(y / total) * 100}%`;

  let current = '';
  sections.forEach(sec => {
    if (y >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
});

/* -------- Mobile Menu -------- */
const menuToggle = document.getElementById('menuToggle');
const navLinksList = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinksList.classList.toggle('open');
});
navLinks.forEach(l => l.addEventListener('click', () => {
  menuToggle.classList.remove('active');
  navLinksList.classList.remove('open');
}));

/* -------- Reveal on Scroll -------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* -------- Typewriter -------- */
const twEl = document.getElementById('typewriter');
const phrases = [
  'Deep Learning Researcher',
  'Medical Image Analysis',
  'CNN · GNN · Vision Transformers',
  'Explainable & Trustworthy AI',
  'Ph.D. Aspirant'
];
let pIdx = 0, cIdx = 0, deleting = false;
function typeLoop() {
  const cur = phrases[pIdx];
  if (deleting) {
    twEl.textContent = cur.substring(0, cIdx--);
    if (cIdx < 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(typeLoop, 350); return; }
    setTimeout(typeLoop, 35);
  } else {
    twEl.textContent = cur.substring(0, cIdx++);
    if (cIdx > cur.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    setTimeout(typeLoop, 75);
  }
}
setTimeout(typeLoop, 800);

/* -------- Counter Animation -------- */
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });
counters.forEach(c => counterObserver.observe(c));

/* -------- Skill Bar Fill -------- */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      setTimeout(() => { el.style.width = el.dataset.fill + '%'; }, 200);
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(s => skillObserver.observe(s));

/* -------- Publication Tabs -------- */
const pubTabs = document.querySelectorAll('.pub-tab');
const pubContents = document.querySelectorAll('.pub-content');
pubTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    pubTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    pubContents.forEach(c => {
      c.classList.toggle('hidden', c.dataset.content !== target);
    });
    // re-run reveal on newly visible items
    document.querySelectorAll(`[data-content="${target}"] .reveal`).forEach(el => {
      el.classList.remove('visible');
      requestAnimationFrame(() => el.classList.add('visible'));
    });
  });
});

/* -------- Contact Form (demo, no backend) -------- */
function handleSubmit(e) {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  status.textContent = 'Opening your email client…';

  // Compose mailto (client-side only, no backend)
  const to = 'abu15-4022@diu.edu.bd';
  const body = encodeURIComponent(`Hello Abu,\n\n${message}\n\n— ${name}\n${email}`);
  const sub = encodeURIComponent(subject || 'Portfolio contact');
  window.location.href = `mailto:${to}?subject=${sub}&body=${body}`;

  setTimeout(() => {
    status.textContent = '✓ Message drafted in your email client.';
    e.target.reset();
  }, 500);
  return false;
}
window.handleSubmit = handleSubmit;

/* -------- Parallax on Hero Shapes -------- */
const shapes = document.querySelectorAll('.floating-shape');
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  shapes.forEach((s, i) => {
    const factor = (i + 1) * 0.4;
    s.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});
