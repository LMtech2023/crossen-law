(function () {
  'use strict';

  const NAV_BREAKPOINT = 1200;
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');
  const navOverlay = document.getElementById('nav-overlay');
  const chromeElements = document.querySelectorAll('[data-chrome]');
  const navLinks = siteNav ? siteNav.querySelectorAll('.header__nav-link') : [];

  function isMobileNav() {
    return window.innerWidth <= NAV_BREAKPOINT;
  }

  function setSiteChromeHeight() {
    let total = 0;
    chromeElements.forEach(function (el) {
      total += el.offsetHeight;
    });
    document.documentElement.style.setProperty('--site-chrome-height', total + 'px');
  }

  function openMenu() {
    if (!menuToggle || !siteNav || !navOverlay) return;
    menuToggle.classList.add('header__menu-toggle--open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    siteNav.classList.add('header__nav--open');
    siteNav.setAttribute('aria-hidden', 'false');
    navOverlay.classList.add('header__overlay--visible');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    if (!menuToggle || !siteNav || !navOverlay) return;
    menuToggle.classList.remove('header__menu-toggle--open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    siteNav.classList.remove('header__nav--open');
    if (isMobileNav()) {
      siteNav.setAttribute('aria-hidden', 'true');
    } else {
      siteNav.removeAttribute('aria-hidden');
    }
    navOverlay.classList.remove('header__overlay--visible');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
  }

  function syncNavAria() {
    if (!siteNav) return;
    if (!isMobileNav()) {
      siteNav.removeAttribute('aria-hidden');
      return;
    }
    if (!siteNav.classList.contains('header__nav--open')) {
      siteNav.setAttribute('aria-hidden', 'true');
    }
  }

  function toggleMenu() {
    if (menuToggle.classList.contains('header__menu-toggle--open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    setSiteChromeHeight();
    if (!isMobileNav()) {
      closeMenu();
    }
    syncNavAria();
  });

  if (typeof ResizeObserver !== 'undefined') {
    const chromeObserver = new ResizeObserver(setSiteChromeHeight);
    chromeElements.forEach(function (el) {
      chromeObserver.observe(el);
    });
  }

  window.addEventListener('load', function () {
    setSiteChromeHeight();
    syncNavAria();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setSiteChromeHeight);
  } else {
    setSiteChromeHeight();
  }

  syncNavAria();
})();
