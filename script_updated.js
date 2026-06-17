/* ═══════════════════════════════════════════════════
   TANISH ROHIL — v3 script.js
   Matrix rain · Glitch · Skill bars · Live stats
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── THEME ── */
  const root = document.documentElement;
  const saved = localStorage.getItem('tr-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  syncIcon(saved);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('tr-theme', next);
    syncIcon(next);
    initMatrix(); // reinit with correct opacity
  });

  function syncIcon(t) {
    document.getElementById('themeIcon').className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  /* ── MATRIX RAIN ── */
  function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, cols, drops;

    const CHARS = 'アウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01アbcdef';

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cols  = Math.floor(W / 18);
      drops = Array.from({length: cols}, () => Math.floor(Math.random() * -H / 14));
    }
    resize();
    window.addEventListener('resize', resize, {passive:true});

    const isDark = () => root.getAttribute('data-theme') !== 'light';

    function draw() {
      ctx.fillStyle = isDark() ? 'rgba(8,11,16,0.04)' : 'rgba(240,244,248,0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = '13px JetBrains Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y  = drops[i] * 14;
        const x  = i * 18;

        // brightest char at tip
        ctx.fillStyle = isDark() ? '#aaffcc' : '#00aa44';
        ctx.fillText(ch, x, y);

        // trail fades
        if (y > 14) {
          ctx.fillStyle = isDark() ? '#00ff66' : '#008833';
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - 14);
        }

        if (y > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  initMatrix();

  /* ── TYPEWRITER ── */
  const phrases = [
    'Welcome to my world',
    'sudo apt-get install leadership',
  ];
  let pi = 0, ci = 0, del = false;
  const tw = document.getElementById('typewriter');
  if (tw) {
    function typeLoop() {
      const p = phrases[pi];
      if (del) {
        tw.textContent = p.substring(0, ci--);
        if (ci < 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 350); return; }
      } else {
        tw.textContent = p.substring(0, ++ci);
        if (ci === p.length) { del = true; setTimeout(typeLoop, 2000); return; }
      }
      setTimeout(typeLoop, del ? 38 : 72);
    }
    setTimeout(typeLoop, 800);
  }

  /* ── LIVE STATS (uptime counter) ── */
  const startTime = Date.now();
  function updateLive() {
    const el = document.getElementById('uptime');
    if (!el) return;
    const s = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(s / 60), sec = s % 60;
    el.textContent = `${m}m ${sec}s`;
  }
  setInterval(updateLive, 1000);
  updateLive();

  /* ── NAVBAR ── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
    highlightNav();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ── ACTIVE NAV ── */
  const sections = [...document.querySelectorAll('section[id]')];
  function highlightNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── SCROLL TOP ── */
  document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── REVEAL ON SCROLL ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── STAT COUNTERS ── */
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target || el.textContent, 10);
      if (isNaN(target)) return;
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const id = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count;
        if (count >= target) clearInterval(id);
      }, 35);
      statObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));

  /* ── SKILL BARS ── */
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill = e.target;
      const pct  = fill.dataset.pct || '80';
      setTimeout(() => {
        fill.style.width = pct + '%';
        fill.classList.add('animated');
      }, 200);
      barObs.unobserve(fill);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bar-fill').forEach(el => barObs.observe(el));

  /* ── GALLERY LIGHTBOX ── */
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const wrap = document.createElement('div');
      wrap.style.cssText = [
        'position:fixed;inset:0;z-index:9999',
        'background:rgba(0,0,0,0.94)',
        'display:flex;align-items:center;justify-content:center',
        'cursor:zoom-out',
        'animation:lbFade 0.2s ease',
      ].join(';');

      const style = document.createElement('style');
      style.textContent = '@keyframes lbFade{from{opacity:0}to{opacity:1}}';
      document.head.appendChild(style);

      const pic = document.createElement('img');
      pic.src = img.src;
      pic.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:8px;object-fit:contain;border:1px solid rgba(0,255,102,0.3);box-shadow:0 0 60px rgba(0,255,102,0.1)';

      const close = document.createElement('button');
      close.textContent = '×';
      close.style.cssText = 'position:absolute;top:20px;right:24px;background:none;border:none;color:#00ff66;font-size:2rem;cursor:pointer;line-height:1;font-family:monospace';

      wrap.appendChild(pic);
      wrap.appendChild(close);
      document.body.appendChild(wrap);

      const dismiss = () => { wrap.remove(); style.remove(); };
      close.addEventListener('click', dismiss);
      wrap.addEventListener('click', e => { if (e.target === wrap) dismiss(); });
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', esc); }
      });
    });
  });

  /* ── CURSOR TRAIL (desktop only) ── */
  if (window.matchMedia('(pointer:fine)').matches) {
    const trail = [];
    const MAX   = 20;
    let mx = -300, my = -300;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    const cvs = document.createElement('canvas');
    cvs.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;';
    document.body.appendChild(cvs);
    const ctx2 = cvs.getContext('2d');
    let W2 = cvs.width = innerWidth, H2 = cvs.height = innerHeight;
    window.addEventListener('resize', () => { W2 = cvs.width = innerWidth; H2 = cvs.height = innerHeight; });

    function trailLoop() {
      ctx2.clearRect(0, 0, W2, H2);
      trail.unshift({ x: mx, y: my });
      if (trail.length > MAX) trail.pop();

      trail.forEach((p, i) => {
        const alpha = (1 - i / MAX) * 0.5;
        const size  = Math.max(0.5, 3 - i * 0.12);
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx2.fillStyle = `rgba(0,255,102,${alpha})`;
        ctx2.fill();
      });
      requestAnimationFrame(trailLoop);
    }
    trailLoop();
  }

  /* ── GLITCH RANDOM TRIGGER ── */
  // extra random glitch burst on hero name
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    setInterval(() => {
      if (Math.random() > 0.7) {
        heroName.style.textShadow = '2px 0 #00a2ff, -2px 0 #ff3860';
        setTimeout(() => { heroName.style.textShadow = ''; }, 80);
        setTimeout(() => {
          heroName.style.textShadow = '-2px 0 #00a2ff, 2px 0 #ff3860';
          setTimeout(() => { heroName.style.textShadow = ''; }, 60);
        }, 120);
      }
    }, 3000);
  }

})();
