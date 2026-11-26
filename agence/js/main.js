/* ==========================================================================
   Studio Lumen — Scripts du site (JavaScript vanilla, sans dépendance)
   Sommaire :
   1. Utilitaires          6. Filtres des réalisations
   2. Thème clair/sombre   7. Carrousel des témoignages
   3. En-tête & menu       8. FAQ (accordéon)
   4. Apparition au scroll 9. Formulaire de devis
   5. Compteurs animés     10. Cookies (RGPD) & carte Google Maps
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Utilitaires ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Le stockage local peut être indisponible (navigation privée) : on protège chaque accès.
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignoré */ } },
    remove: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignoré */ } }
  };

  // Année du copyright
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- 2. Thème clair / sombre ---------- */
  var root = document.documentElement;
  var themeBtn = $('.theme-toggle');

  function currentTheme() {
    var forced = root.getAttribute('data-theme');
    if (forced) return forced;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncThemeButton() {
    if (!themeBtn) return;
    var dark = currentTheme() === 'dark';
    // Le CSS n'affiche l'icône soleil qu'avec data-theme="dark" : on l'explicite.
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Passer en mode clair' : 'Passer en mode sombre');
  }
  if (themeBtn) {
    syncThemeButton();
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('theme', next);
      syncThemeButton();
    });
  }

  /* ---------- 3. En-tête fixe & menu burger ---------- */
  var header = $('.site-header');
  var burger = $('.nav-burger');
  var menu = $('#nav-menu');
  var backToTop = $('.back-to-top');

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (backToTop) backToTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    var use = $('use', burger);
    if (use) use.setAttribute('href', open ? '#i-x' : '#i-menu');
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    // Ferme le menu après un clic sur un lien ou avec la touche Échap
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); }
    });
  }

  /* ---------- 4. Apparition au défilement ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 5. Compteurs animés (chiffres clés) ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var start = null;
        var duration = 1400;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        }
        el.textContent = '0';
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- 6. Filtres des réalisations ---------- */
  var filterBtns = $$('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      $$('.project').forEach(function (p) {
        var show = filter === 'tous' || p.getAttribute('data-category') === filter;
        p.classList.toggle('is-hidden', !show);
        if (show) p.classList.add('is-visible');
      });
    });
  });

  /* ---------- 7. Carrousel des témoignages ---------- */
  $$('[data-carousel]').forEach(function (carousel) {
    var track = $('.carousel-track', carousel);
    var slides = $$('.testimonial', carousel);
    var dotsWrap = $('.dots', carousel);
    var index = 0;
    var timer = null;

    var dots = slides.map(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'dot';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Afficher l\'avis ' + (i + 1));
      d.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(d);
      return d;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (s, n) { s.setAttribute('aria-hidden', String(n !== index)); });
      dots.forEach(function (d, n) { d.setAttribute('aria-selected', String(n === index)); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { go(index + 1); }, 6000);
    }

    $('[data-prev]', carousel).addEventListener('click', function () { go(index - 1); restart(); });
    $('[data-next]', carousel).addEventListener('click', function () { go(index + 1); restart(); });
    // Pause au survol et au focus clavier
    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', restart);
    carousel.addEventListener('focusin', function () { clearInterval(timer); });
    carousel.addEventListener('focusout', restart);
    // Glisser du doigt sur mobile
    var startX = null;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });

    go(0);
    restart();
  });

  /* ---------- 8. FAQ (accordéon) ---------- */
  $$('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var open = !item.classList.contains('is-open');
      // Une seule question ouverte à la fois
      $$('.faq-item.is-open').forEach(function (other) {
        other.classList.remove('is-open');
        $('.faq-question', other).setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', open);
      q.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- 9. Formulaire de devis ---------- */
  var form = $('#quote-form');
  if (form) {
    // Pré-sélection depuis la page Tarifs (contact.html?formule=pro)
    var params = new URLSearchParams(window.location.search);
    var formule = params.get('formule');
    var typeSelect = $('#type', form);
    var msg = $('#message', form);
    if (formule && typeSelect) {
      typeSelect.value = formule === 'ecommerce' ? 'ecommerce' : 'vitrine';
      var labels = { essentiel: 'Essentiel', pro: 'Pro', ecommerce: 'E-commerce' };
      if (labels[formule] && msg && !msg.value) msg.value = 'Bonjour, je suis intéressé(e) par la formule ' + labels[formule] + '. ';
    }

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var phoneRe = /^(?:\+|00)?[0-9\s.\-()]{9,20}$/;

    function validateField(input) {
      var wrap = input.closest('.field') || input.closest('.consent');
      var value = input.type === 'checkbox' ? input.checked : input.value.trim();
      var ok = true;
      if (input.required && !value) ok = false;
      else if (input.type === 'email' && value && !emailRe.test(value)) ok = false;
      else if (input.getAttribute('data-validate') === 'phone' && value && !phoneRe.test(value)) ok = false;
      else if (input.minLength > 0 && value && value.length < input.minLength) ok = false;
      if (wrap) wrap.classList.toggle('has-error', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      return ok;
    }

    var fields = $$('input:not([name="site_web"]), select, textarea', form);
    fields.forEach(function (input) {
      // Validation en direct, une fois que l'utilisateur a quitté le champ
      input.addEventListener('blur', function () { if (input.value || input.type === 'checkbox') validateField(input); });
      input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') validateField(input); });
      input.addEventListener('change', function () { if (input.getAttribute('aria-invalid') === 'true') validateField(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstError = null;
      fields.forEach(function (input) { if (!validateField(input) && !firstError) firstError = input; });
      if (firstError) { firstError.focus(); return; }
      if ($('#site_web', form).value) return; // robot détecté

      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';

      var endpoint = form.getAttribute('data-endpoint');
      var done = function () {
        form.hidden = true;
        var ok = $('#form-success');
        ok.classList.add('is-visible');
        ok.focus();
      };
      if (!endpoint) { setTimeout(done, 600); return; } // mode démo

      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Envoyer ma demande';
          alert('Désolé, l\'envoi a échoué. Réessayez ou écrivez-nous à bonjour@studio-lumen.fr.');
        });
    });
  }

  /* ---------- 10. Cookies (RGPD) & carte Google Maps ---------- */
  var banner = $('#cookie-banner');
  var CONSENT_KEY = 'cookie-consent';
  var SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;

  function getConsent() {
    try {
      var c = JSON.parse(store.get(CONSENT_KEY));
      if (c && Date.now() - c.date < SIX_MONTHS) return c.value;
    } catch (e) { /* ignoré */ }
    return null;
  }
  function setConsent(value) {
    store.set(CONSENT_KEY, JSON.stringify({ value: value, date: Date.now() }));
    hideBanner();
    if (value === 'accept') { loadMap(); loadAnalytics(); }
  }
  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('is-visible'); });
  }
  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('is-visible');
    setTimeout(function () { banner.hidden = true; }, 400);
  }

  function loadMap() {
    var map = $('#map');
    if (!map || map.querySelector('iframe')) return;
    var iframe = document.createElement('iframe');
    iframe.src = map.getAttribute('data-src');
    iframe.title = 'Plan d\'accès à l\'agence Studio Lumen';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    map.innerHTML = '';
    map.appendChild(iframe);
  }

  // Emplacement pour votre outil de mesure d'audience (ex. Plausible, Matomo, Google Analytics).
  // Il n'est chargé qu'après acceptation des cookies.
  function loadAnalytics() { /* Ajoutez ici le script de votre outil de statistiques. */ }

  if (banner) {
    $$('[data-cookie]', banner).forEach(function (b) {
      b.addEventListener('click', function () { setConsent(b.getAttribute('data-cookie')); });
    });
  }
  $$('[data-cookie-settings]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); store.remove(CONSENT_KEY); showBanner(); });
  });
  var loadMapBtn = $('[data-load-map]');
  if (loadMapBtn) loadMapBtn.addEventListener('click', loadMap);

  var consent = getConsent();
  if (consent === null) setTimeout(showBanner, 800);
  else if (consent === 'accept') { loadMap(); loadAnalytics(); }
})();
