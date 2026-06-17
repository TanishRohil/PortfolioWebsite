/* ═══════════════════════════════════════════════════
   MBA PORTFOLIO — TANISH ROHIL
   script.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────
   UTILITY
────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ──────────────────────────────────
   THEME TOGGLE
────────────────────────────────── */
(function initTheme() {
  const html        = document.documentElement;
  const btn         = $('#themeToggle');
  const icon        = $('#themeIcon');
  const stored      = localStorage.getItem('portfolio-theme');
  const preferred   = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const theme       = stored || preferred;

  html.setAttribute('data-theme', theme);
  updateIcon(theme);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  function updateIcon(t) {
    icon.className = t === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
})();

/* ──────────────────────────────────
   NAVBAR — scroll behaviour
────────────────────────────────── */
(function initNavbar() {
  const navbar = $('#navbar');
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    lastY = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ──────────────────────────────────
   HAMBURGER MENU
────────────────────────────────── */
(function initHamburger() {
  const ham       = $('#hamburger');
  const navLinks  = $('#navLinks');

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

/* ──────────────────────────────────
   SCROLL-TO-TOP BUTTON
────────────────────────────────── */
(function initScrollTop() {
  const btn = $('#scrollTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ──────────────────────────────────
   REVEAL ON SCROLL (IntersectionObserver)
────────────────────────────────── */
(function initReveal() {
  const els = $$('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────
   SKILL BARS — animate on enter
────────────────────────────────── */
(function initSkillBars() {
  const bars = $$('.fill');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          bars.forEach(bar => {
            const w = bar.getAttribute('data-width');
            // Small stagger for sequential feel
            setTimeout(() => {
              bar.style.width = w + '%';
            }, 100);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const skillsSection = $('#skills');
  if (skillsSection) observer.observe(skillsSection);
})();

/* ──────────────────────────────────
   SMOOTH SCROLL for anchor links
────────────────────────────────── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ──────────────────────────────────
   ACTIVE NAV LINK (scroll spy)
────────────────────────────────── */
(function initScrollSpy() {
  const sections = $$('section[id]');
  const links    = $$('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ──────────────────────────────────
   CONTACT FORM — simple client-side
────────────────────────────────── */
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.disabled = true;
    btn.style.background = '#2a9d5c';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();

/* ──────────────────────────────────
   GALLERY — lightbox effect
────────────────────────────────── */
(function initGallery() {
  const items = $$('.gallery-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img  = item.querySelector('img');
      const cap  = item.querySelector('.gallery-overlay span');
      openLightbox(img.src, cap ? cap.textContent : '');
    });
  });

  function openLightbox(src, caption) {
    // Remove any existing lightbox
    const existing = $('#lightbox');
    if (existing) existing.remove();

    const box = document.createElement('div');
    box.id = 'lightbox';
    box.innerHTML = `
      <div class="lb-backdrop"></div>
      <div class="lb-inner">
        <button class="lb-close" aria-label="Close"><i class="fas fa-times"></i></button>
        <img src="${src}" alt="${caption}" />
        ${caption ? `<p class="lb-caption">${caption}</p>` : ''}
      </div>
    `;
    document.body.appendChild(box);

    // Inject styles once
    if (!$('#lb-styles')) {
      const style = document.createElement('style');
      style.id = 'lb-styles';
      style.textContent = `
        #lightbox { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .lb-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.88); cursor: pointer; }
        .lb-inner { position: relative; max-width: 90vw; max-height: 90vh; z-index: 1; }
        .lb-inner img { max-width: 100%; max-height: 80vh; border-radius: 8px; display: block; }
        .lb-close { position: absolute; top: -16px; right: -16px; width: 36px; height: 36px; border-radius: 50%; background: var(--accent); color: #0A1628; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; z-index: 2; }
        .lb-caption { color: #fff; text-align: center; margin-top: 12px; font-size: 0.85rem; }
      `;
      document.head.appendChild(style);
    }

    // Animate in
    requestAnimationFrame(() => {
      box.style.opacity = '0';
      requestAnimationFrame(() => {
        box.style.transition = 'opacity 0.3s ease';
        box.style.opacity = '1';
      });
    });

    const close = () => {
      box.style.opacity = '0';
      setTimeout(() => box.remove(), 300);
    };

    box.querySelector('.lb-backdrop').addEventListener('click', close);
    box.querySelector('.lb-close').addEventListener('click', close);
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  }
})();

/* ──────────────────────────────────
   HERO PARALLAX (subtle)
────────────────────────────────── */
(function initParallax() {
  const heroBg = $('.hero-bg-pattern');
  if (!heroBg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
})();

/* ──────────────────────────────────
   HERO PHOTO HOVER — touch support
────────────────────────────────── */
(function initHeroPhotoTouch() {
  const wrapper = $('.hero-photo-wrapper');
  if (!wrapper) return;

  // On mobile, tap to toggle
  let toggled = false;
  wrapper.addEventListener('click', () => {
    toggled = !toggled;
    wrapper.classList.toggle('tapped', toggled);
  });
})();

/* ──────────────────────────────────
   COUNTER ANIMATION (stat cards)
────────────────────────────────── */
(function initCounters() {
  const statNums = $$('.stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw);
      if (isNaN(num)) return;
      const suffix = raw.replace(String(num), '');
      let start = 0;
      const duration = 1200;
      const step = duration / num;
      const timer = setInterval(() => {
        start++;
        el.textContent = start + suffix;
        if (start >= num) clearInterval(timer);
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────
   TYPED TAGLINE (hero)
────────────────────────────────── */
(function initTyped() {
  const el = $('.hero-tagline');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const phrases = [
    'Where Curiosity Meets Conviction',
    'Engineer. Strategist. Leader.',
    'Building What Matters.',
    'Driven by Purpose, Guided by People.'
  ];

  let pi = 0, ci = 0, deleting = false;
  el.textContent = '';

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 75);
  }

  // Start after a small delay to let page settle
  setTimeout(tick, 800);
})();

/* ──────────────────────────────────
   NAV LINK ACTIVE STYLE INJECTION
────────────────────────────────── */
(function injectActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--accent); background: var(--accent-dim); }`;
  document.head.appendChild(style);
})();

/* ──────────────────────────────────
   HERO PHOTO — tapped class support
────────────────────────────────── */
(function injectHeroTapStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .hero-photo-wrapper.tapped .hero-monogram { opacity: 0 !important; }
    .hero-photo-wrapper.tapped .hero-photo-frame { opacity: 1 !important; }
  `;
  document.head.appendChild(style);
})();

console.log('%c✨ Portfolio by Tanish Rohil', 'color:#C9A84C;font-family:serif;font-size:1.1rem;font-style:italic;');
