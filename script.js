'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const topLinks = document.querySelectorAll('a[href="#top"]');
const header = document.querySelector('.site-header');
const year = document.getElementById('year');

if (year) year.textContent = String(new Date().getFullYear());

function updateHeader() {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

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
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const portraitStage = document.querySelector('.hero-visual');
const portrait = document.querySelector('.portrait-frame');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('resize', () => {
  if (!portrait) return;
  portrait.style.setProperty('--tilt-x', '0deg');
  portrait.style.setProperty('--tilt-y', '0deg');
});

if (portraitStage && portrait && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  portraitStage.addEventListener('pointermove', (event) => {
    const bounds = portraitStage.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    portrait.style.setProperty('--tilt-x', `${-vertical * 9}deg`);
    portrait.style.setProperty('--tilt-y', `${horizontal * 10}deg`);
  });

  portraitStage.addEventListener('pointerleave', () => {
    portrait.style.setProperty('--tilt-x', '0deg');
    portrait.style.setProperty('--tilt-y', '0deg');
  });
}