'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const topLinks = document.querySelectorAll('a[href="#top"]');
const header = document.querySelector('.site-header');
const year = document.getElementById('year');
const themeButton = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-toggle-label');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const progressBar = document.querySelector('.scroll-progress span');
const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');

if (year) year.textContent = String(new Date().getFullYear());

function updateHeader() {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
}

function updateScrollProgress() {
  if (!progressBar) return;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

updateHeader();
updateScrollProgress();
window.addEventListener('scroll', () => {
  updateHeader();
  updateScrollProgress();
}, { passive: true });

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const useLightTheme = document.body.dataset.theme !== 'light';
    document.body.dataset.theme = useLightTheme ? 'light' : 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${useLightTheme ? 'dark' : 'light'} theme`);
    if (themeLabel) themeLabel.textContent = `${useLightTheme ? 'Dark' : 'Light'} theme`;
    if (themeMeta) themeMeta.setAttribute('content', useLightTheme ? '#f7f5ff' : '#10121f');
  });
}

topLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  });
});

function closeMenu() {
  if (!menuButton || !navLinks) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navLinks.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    navLinks.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  });

  navItems.forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) closeMenu();
  });
}

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        const counter = entry.target.matches('[data-count]') ? entry.target : entry.target.querySelector('[data-count]');
        if (counter) animateCounter(counter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

function animateCounter(element) {
  const target = Number(element.dataset.count);
  if (!Number.isFinite(target)) return;
  const numberNode = element.firstChild;
  if (!numberNode || numberNode.nodeType !== Node.TEXT_NODE) return;
  if (reducedMotion) {
    numberNode.textContent = String(target);
    return;
  }
  const startTime = performance.now();
  const duration = 1050;
  const animate = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - (1 - progress) ** 3;
    numberNode.textContent = String(Math.round(target * eased));
    if (progress < 1) window.requestAnimationFrame(animate);
  };
  window.requestAnimationFrame(animate);
}

if ('IntersectionObserver' in window && sectionLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        if (active) link.classList.add('is-active');
        else link.classList.remove('is-active');
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sectionLinks.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) sectionObserver.observe(section);
  });
}

const portraitStage = document.querySelector('.hero-visual');
const portrait = document.querySelector('.portrait-frame');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('resize', () => {
  updateScrollProgress();
  if (!portrait) return;
  portrait.style.setProperty('--tilt-x', '0deg');
  portrait.style.setProperty('--tilt-y', '0deg');
});

if (portraitStage && portrait && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  portraitStage.addEventListener('pointermove', (event) => {
    const bounds = portraitStage.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    portraitStage.style.setProperty('--glow-x', `${(horizontal + 0.5) * 100}%`);
    portraitStage.style.setProperty('--glow-y', `${(vertical + 0.5) * 100}%`);
    portrait.style.setProperty('--tilt-x', `${-vertical * 9}deg`);
    portrait.style.setProperty('--tilt-y', `${horizontal * 10}deg`);
  });

  portraitStage.addEventListener('pointerleave', () => {
    portraitStage.style.setProperty('--glow-x', '50%');
    portraitStage.style.setProperty('--glow-y', '48%');
    portrait.style.setProperty('--tilt-x', '0deg');
    portrait.style.setProperty('--tilt-y', '0deg');
  });
}