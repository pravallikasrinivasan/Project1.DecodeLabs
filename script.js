/* =========================================================
   AXIOM Architecture — vanilla JS
   No frameworks, no build step.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile navbar toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('primaryNav');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* close mobile menu after choosing a link (smooth scroll handled by CSS scroll-behavior) */
  navLinks.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- sticky navbar shadow on scroll ---------- */
  var navbar = document.getElementById('navbar');
  function updateNavbarShadow() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', updateNavbarShadow, { passive: true });
  updateNavbarShadow();

  /* ---------- back-to-top button ---------- */
  var backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    backToTop.hidden = window.scrollY < 500;
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  updateBackToTop();

  /* ---------- active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinkEls = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.getAttribute('id');
      navLinkEls.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(function (section) { sectionObserver.observe(section); });

  /* ---------- scroll-reveal animation ---------- */
  var revealTargets = document.querySelectorAll(
    '.about-figure, .about-copy, .project-card, .service-card, .contact-copy, .contact-form'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- animated stat counters ---------- */
  var statEls = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    var target = Number(el.dataset.count) || 0;
    var duration = 1200;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var statObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statEls.forEach(function (el) { statObserver.observe(el); });

  /* ---------- contact form (UI only, no backend) ---------- */
  var form = document.getElementById('contactForm');
  var successMsg = document.getElementById('formSuccess');

  var fields = {
    name: { input: document.getElementById('nameInput'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('emailInput'), error: document.getElementById('emailError') },
    message: { input: document.getElementById('messageInput'), error: document.getElementById('messageError') },
  };

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setFieldError(key, message) {
    var field = fields[key];
    field.error.textContent = message || '';
    field.input.closest('.field').classList.toggle('has-error', Boolean(message));
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    successMsg.hidden = true;

    var name = fields.name.input.value.trim();
    var email = fields.email.input.value.trim();
    var message = fields.message.input.value.trim();

    var valid = true;

    if (!name) { setFieldError('name', 'Please enter your name.'); valid = false; }
    else { setFieldError('name', ''); }

    if (!email || !isValidEmail(email)) { setFieldError('email', 'Please enter a valid email address.'); valid = false; }
    else { setFieldError('email', ''); }

    if (!message || message.length < 10) { setFieldError('message', 'Message should be at least 10 characters.'); valid = false; }
    else { setFieldError('message', ''); }

    if (!valid) return;

    successMsg.hidden = false;
    form.reset();
  });

  /* ---------- basic hover/click interactivity on project cards ---------- */
  var projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var title = card.querySelector('h3').textContent;
      card.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(0.98)' }, { transform: 'scale(1)' }],
        { duration: 220, easing: 'ease-out' }
      );
      console.log('Project selected:', title);
    });
  });
})();
