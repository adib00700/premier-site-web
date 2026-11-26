/* ==========================================================================
   Keloar — Animations et interactions (JavaScript vanilla, sans dépendance)
   Sommaire :
    1. Utilitaires            8. Parallaxe des images
    2. Thème clair/sombre      9. Texte « manifeste » au défilement
    3. Intro (loader)         10. Méthode en défilement horizontal
    4. En-tête & menu         11. Curseur, aperçu des services, boutons magnétiques
    5. Découpage des titres   12. Compteurs
    6. Révélations au scroll  13. FAQ
    7. Boucle de défilement   14. Formulaire de soumission
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Utilitaires ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignoré */ } }
  };
  var session = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignoré */ } }
  };
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- 2. Thème clair / sombre ---------- */
  var themeBtn = $('.theme-toggle');
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncTheme() {
    if (!themeBtn) return;
    root.setAttribute('data-theme', isDark() ? 'dark' : 'light');
    themeBtn.setAttribute('aria-label', isDark() ? 'Passer en mode clair' : 'Passer en mode sombre');
  }
  if (themeBtn) {
    syncTheme();
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('theme', next);
      syncTheme();
    });
  }

  /* ---------- 3. Intro (loader) ----------
     Complète la première fois dans la session, très courte ensuite. */
  var loader = $('.loader');
  var introDone = new Promise(function (resolve) {
    if (!loader || reduce) { if (loader) loader.classList.add('is-done'); root.classList.add('is-loaded'); resolve(); return; }
    var seen = session.get('keloar-intro');
    var minTime = seen ? 250 : 1500;
    var start = Date.now();
    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var timeout = new Promise(function (r) { setTimeout(r, 2500); });
    Promise.race([fontsReady, timeout]).then(function () {
      setTimeout(function () {
        root.classList.add('is-loaded');
        session.set('keloar-intro', '1');
        setTimeout(resolve, 350);
        setTimeout(function () { loader.classList.add('is-done'); }, 1400);
      }, Math.max(0, minTime - (Date.now() - start)));
    });
  });

  /* ---------- 4. En-tête & menu ---------- */
  var header = $('.site-header');
  var burger = $('.nav-burger');
  var menu = $('#nav-menu');
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('is-open', open);
    if (header) header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    var use = $('use', burger);
    if (use) use.setAttribute('href', open ? '#i-x' : '#i-menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); }
    });
  }
  var backToTop = $('.back-to-top');
  if (backToTop) backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- 5. Découpage des titres en mots ----------
     Chaque mot est enveloppé pour glisser depuis le bas. Les balises
     internes (ex. <em>) sont conservées. */
  function splitWords(el) {
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'word';
            var inner = document.createElement('span'); inner.className = 'word-in';
            inner.style.setProperty('--i', i++);
            inner.textContent = part;
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    }
    walk(el);
  }
  $$('[data-split]').forEach(splitWords);

  // Manifeste : mots séparés pour l'effet « s'allume au défilement »
  var manifesto = $('.manifesto-text');
  var manifestoWords = [];
  if (manifesto) {
    manifesto.innerHTML = manifesto.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="mw">' + w + '</span>';
    }).join(' ');
    manifestoWords = $$('.mw', manifesto);
  }

  // Grand logo du pied de page : lettre par lettre
  $$('.footer-word').forEach(function (el) {
    var txt = el.textContent.trim();
    el.innerHTML = txt.split('').map(function (c, n) { return '<span style="--i:' + n + '">' + c + '</span>'; }).join('');
  });

  /* ---------- 6. Révélations au défilement ---------- */
  var revealTargets = $$('[data-split], [data-reveal], [data-reveal-img], .footer-word');
  introDone.then(function () {
    if (!('IntersectionObserver' in window) || reduce) {
      revealTargets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    // Une image masquée par clip-path est vue comme invisible par le navigateur :
    // on observe alors son parent, et on révèle l'image quand le parent apparaît.
    var map = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        (map.get(entry.target) || []).forEach(function (el) { el.classList.add('is-in'); });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(function (el) {
      var watch = el.hasAttribute('data-reveal-img') ? el.parentElement : el;
      if (!map.has(watch)) { map.set(watch, []); io.observe(watch); }
      map.get(watch).push(el);
    });
  });

  /* ---------- 7. Boucle de défilement (une seule, optimisée) ---------- */
  var progressBar = $('.progress');
  var parallaxEls = reduce ? [] : $$('[data-speed]');
  var process = $('.process');
  var processTrack = process ? $('.process-track', process) : null;
  var processBar = process ? $('.process-bar span', process) : null;
  var galleryRows = reduce ? [] : $$('.gallery-row');
  var lastY = window.scrollY;
  var ticking = false;
  var horizontal = false;

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;

    if (progressBar) progressBar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (header) {
      header.classList.toggle('is-scrolled', y > 20);
      var menuOpen = menu && menu.classList.contains('is-open');
      header.classList.toggle('is-hidden', !menuOpen && y > 400 && y > lastY + 2);
      if (y < lastY - 2) header.classList.remove('is-hidden');
    }
    if (backToTop) backToTop.classList.toggle('is-visible', y > 900);

    /* 8. Parallaxe : l'image glisse doucement dans son cadre */
    parallaxEls.forEach(function (el) {
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      var speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
      var offset = (box.top + box.height / 2 - vh / 2) * -speed;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(1.18)';
    });

    /* Galerie : les deux rangées glissent en sens inverse */
    galleryRows.forEach(function (row) {
      var g = row.parentElement.getBoundingClientRect();
      if (g.bottom < 0 || g.top > vh) return;
      var gp = clamp((vh - g.top) / (vh + g.height), 0, 1);
      var dir = parseFloat(row.getAttribute('data-dir')) || 1;
      row.style.transform = 'translate3d(' + (dir * gp * window.innerWidth * 0.22).toFixed(1) + 'px,0,0)';
    });

    /* 9. Manifeste : les mots s'allument au fil de la lecture */
    if (manifestoWords.length && !reduce) {
      var r = manifesto.getBoundingClientRect();
      var p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      var on = Math.round(p * manifestoWords.length);
      manifestoWords.forEach(function (w, n) { w.classList.toggle('is-on', n < on); });
    }

    /* 10. Méthode : défilement horizontal */
    if (horizontal && processTrack) {
      var pr = process.getBoundingClientRect();
      var dist = process.offsetHeight - vh;
      var pp = clamp(-pr.top / dist, 0, 1);
      var travel = processTravel();
      processTrack.style.transform = 'translate3d(' + (-pp * travel).toFixed(1) + 'px,0,0)';
      if (processBar) processBar.style.transform = 'scaleX(' + pp + ')';
    }

    lastY = y;
    ticking = false;
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', requestTick, { passive: true });

  // Distance horizontale à parcourir : largeur des étapes moins la largeur utile du conteneur
  function processTravel() {
    var box = processTrack.parentElement, cs = getComputedStyle(box);
    var inner = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    return Math.max(0, processTrack.scrollWidth - inner);
  }
  function setupProcess() {
    if (!process || !processTrack) return;
    var want = !reduce && window.innerWidth >= 1024;
    horizontal = want;
    process.classList.toggle('is-horizontal', want);
    if (want) {
      process.style.height = (window.innerHeight + processTravel()) + 'px';
    } else {
      process.style.height = '';
      processTrack.style.transform = '';
    }
  }
  setupProcess();
  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { setupProcess(); onScroll(); }, 150); });
  window.addEventListener('load', function () { setupProcess(); onScroll(); });
  onScroll();

  /* ---------- 11. Curseur, aperçu des services, boutons magnétiques ---------- */
  if (finePointer && !reduce) {
    var cursor = document.createElement('div');
    cursor.className = 'cursor'; cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
    var mx = -100, my = -100, cx = -100, cy = -100;
    var preview = $('.svc-preview');
    var px = 0, py = 0;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.classList.add('is-visible');
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cursor.classList.remove('is-visible'); });
    $$('a, button, .svc, input, select, textarea, label').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
    });
    (function loop() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      if (preview) {
        px += (mx - px) * 0.1; py += (my - py) * 0.1;
        preview.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
      }
      requestAnimationFrame(loop);
    })();

    // Aperçu photo qui suit la souris sur la liste des services
    if (preview) {
      var imgs = $$('img', preview);
      $$('.svc').forEach(function (item, n) {
        item.addEventListener('mouseenter', function () {
          preview.classList.add('is-visible');
          imgs.forEach(function (im, k) { im.classList.toggle('is-active', k === n); });
        });
      });
      var list = $('.svc-list');
      if (list) list.addEventListener('mouseleave', function () { preview.classList.remove('is-visible'); });
    }

    // Boutons magnétiques
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var b = el.getBoundingClientRect();
        var dx = e.clientX - (b.left + b.width / 2);
        var dy = e.clientY - (b.top + b.height / 2);
        el.style.transform = 'translate(' + dx * 0.25 + 'px,' + dy * 0.35 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .8s cubic-bezier(.19,1,.22,1), color .5s, border-color .5s';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 800);
      });
    });
  }

  /* ---------- 12. Compteurs ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target, target = parseInt(el.getAttribute('data-count'), 10), t0 = null;
        (function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1800, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
          if (p < 1) requestAnimationFrame(tick);
        })(performance.now());
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = '0'; co.observe(el); });
  }

  /* ---------- 13. FAQ ---------- */
  $$('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var open = !item.classList.contains('is-open');
      $$('.faq-item.is-open').forEach(function (o) { o.classList.remove('is-open'); $('.faq-question', o).setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('is-open', open);
      q.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- 14. Formulaire de soumission ---------- */
  var form = $('#quote-form');
  if (form) {
    var typeSelect = $('#type', form);
    var msg = $('#message', form);
    var labels = { essentiel: 'Essentiel', pro: 'Pro', ecommerce: 'E-commerce' };
    function preselect(formule) {
      if (!formule || !labels[formule]) return;
      if (typeSelect) typeSelect.value = formule === 'ecommerce' ? 'ecommerce' : 'vitrine';
      if (msg && !msg.value) msg.value = 'Bonjour, je suis intéressé(e) par le forfait ' + labels[formule] + '. ';
    }
    // Depuis les boutons des forfaits (#contact) ou un lien ?formule=pro
    preselect(new URLSearchParams(window.location.search).get('formule'));
    $$('[data-formule]').forEach(function (b) {
      b.addEventListener('click', function () { preselect(b.getAttribute('data-formule')); });
    });

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var phoneRe = /^(?:\+|00)?[0-9\s.\-()]{9,20}$/;
    function validate(input) {
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
      input.addEventListener('blur', function () { if (input.value || input.type === 'checkbox') validate(input); });
      ['input', 'change'].forEach(function (ev) {
        input.addEventListener(ev, function () { if (input.getAttribute('aria-invalid') === 'true') validate(input); });
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstError = null;
      fields.forEach(function (input) { if (!validate(input) && !firstError) firstError = input; });
      if (firstError) { firstError.focus(); return; }
      if ($('#site_web', form).value) return; // robot
      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      var label = $('.btn-label', btn);
      if (label) label.textContent = 'Envoi en cours…';
      var done = function () {
        form.hidden = true;
        var ok = $('#form-success');
        ok.classList.add('is-visible');
        ok.focus();
      };
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) { setTimeout(done, 600); return; } // mode démo
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () {
          btn.disabled = false;
          if (label) label.textContent = 'Envoyer ma demande';
          alert('Désolé, l\'envoi a échoué. Réessayez ou écrivez-nous à info@keloar.com.');
        });
    });
  }
})();
