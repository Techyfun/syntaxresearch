(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  /* ---------- Fade-in on load ---------- */
  function reveal() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if (document.readyState === 'complete') {
    reveal();
  } else {
    window.addEventListener('load', reveal);
    // Fallback in case a large image delays the load event
    setTimeout(reveal, 1200);
  }

  /* ---------- Login popup ---------- */
  var pop = document.getElementById('login-pop');
  if (!pop) return;

  var closeBtn = pop.querySelector('.close-login');
  var form = pop.querySelector('.login-form');
  var errorEl = pop.querySelector('.form-error');
  var lastFocus = null;

  function openLogin() {
    lastFocus = document.activeElement;
    pop.hidden = false;
    // next frame so the transition runs
    requestAnimationFrame(function () {
      pop.classList.add('is-open');
    });
    var first = pop.querySelector('input');
    if (first) first.focus();
  }

  function closeLogin() {
    pop.classList.remove('is-open');
    setTimeout(function () {
      pop.hidden = true;
    }, 250);
    if (location.hash === '#login') {
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function checkHash() {
    if (location.hash === '#login') openLogin();
  }

  closeBtn.addEventListener('click', closeLogin);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !pop.hidden) closeLogin();
  });

  document.addEventListener('click', function (e) {
    if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('a[href="#login"]')) {
      closeLogin();
    }
  });

  window.addEventListener('hashchange', checkHash);
  checkHash();

  /* Basic client-side validation (wire the form action to your backend) */
  form.addEventListener('submit', function (e) {
    var user = form.elements.log.value.trim();
    var pass = form.elements.pwd.value;

    if (!user || !pass) {
      e.preventDefault();
      errorEl.textContent = 'Please enter your username/email and password.';
      errorEl.hidden = false;
      (user ? form.elements.pwd : form.elements.log).focus();
      return;
    }

    errorEl.hidden = true;
    if (form.getAttribute('action') === '#') {
      e.preventDefault();
      errorEl.textContent = 'Login is not connected yet. Set the form action to your authentication endpoint.';
      errorEl.hidden = false;
    }
  });
})();
