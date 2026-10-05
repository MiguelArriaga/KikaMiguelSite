(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var countdownTimer;

  /* ------------------------------------------------------------------
   * Apply theme tokens from config.js onto CSS variables
   * ------------------------------------------------------------------ */
  function applyTheme() {
    var root = document.documentElement.style;
    var colors = (cfg.theme && cfg.theme.colors) || {};
    var pair = ((cfg.theme && cfg.theme.fontPair) || "Playfair Display|Work Sans").split("|");
    var bodoniWeights = {"Bodoni MT Bold": "700", "Bodoni MT Black": "900"};
    var invitationFont = Object.prototype.hasOwnProperty.call(bodoniWeights, pair[0]);
    var displayFamily = invitationFont ? "Bodoni Moda" : pair[0];
    var headingWeight = invitationFont ? bodoniWeights[pair[0]] : pair[0] === "Playfair Display" ? "700" : "400";
    var fonts = { display: "'" + displayFamily + "', serif", body: "'" + pair[1] + "', sans-serif" };
    var fontLink = document.getElementById("themeFonts");
    if (!fontLink) { fontLink = document.createElement("link"); fontLink.id = "themeFonts"; fontLink.rel = "stylesheet"; document.head.appendChild(fontLink); }
    fontLink.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(displayFamily) + (invitationFont ? ":opsz,wght@6..96,400..900" : headingWeight === "700" ? ":wght@400;700" : ":wght@400") + "&family=" + encodeURIComponent(pair[1]) + ":wght@400;500;600&display=swap";

    if (colors.ink) root.setProperty("--color-ink", colors.ink);
    if (colors.paper) root.setProperty("--color-paper", colors.paper);
    if (colors.paperAlt) root.setProperty("--color-paper-alt", colors.paperAlt);
    if (colors.accent) root.setProperty("--color-accent", colors.accent);
    if (colors.accent2) root.setProperty("--color-accent-2", colors.accent2);

    if (fonts.display) root.setProperty("--font-display", fonts.display);
    root.setProperty("--font-heading", invitationFont ? "'" + pair[0] + "', 'Bodoni Moda', serif" : fonts.display);
    root.setProperty("--font-heading-weight", headingWeight);
    if (fonts.body) root.setProperty("--font-body", fonts.body);
  }

  /* ------------------------------------------------------------------
   * Hide sections toggled off in config.js
   * ------------------------------------------------------------------ */
  function applySectionToggles() {
    var sections = cfg.sections || {};
    document.querySelectorAll("[data-section]").forEach(function (el) {
      var key = el.getAttribute("data-section");
      if (Object.prototype.hasOwnProperty.call(sections, key) && !sections[key]) {
        el.hidden = true;
      } else { el.hidden = false; }
    });
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      link.hidden = !!(target && target.hidden);
      if (link.parentElement.tagName === "LI") link.parentElement.hidden = link.hidden;
    });
  }

  /* ------------------------------------------------------------------
   * Mobile nav toggle
   * ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initSectionNavigation() {
    var nav = document.querySelector('.nav');
    var anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
    var sections = Array.from(document.querySelectorAll('header[id], section[id]'));
    var offset = 0;
    function measure() {
      offset = nav.getBoundingClientRect().height + 24;
      document.documentElement.style.setProperty('--nav-offset', offset + 'px');
    }
    measure();
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(nav);
    else window.addEventListener('resize', measure);
    anchors.forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        var target = document.getElementById(link.hash.slice(1));
        if (!target || target.hidden) return;
        event.preventDefault();
        document.getElementById('navLinks').classList.remove('open');
        document.getElementById('navToggle').setAttribute('aria-expanded', 'false');
        measure();
        target.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
        history.pushState(null, '', link.hash);
        target.setAttribute('tabindex', '-1');
        target.focus({preventScroll:true});
      });
    });
    var scheduled = false;
    function updateActive() {
      scheduled = false;
      var active = sections.filter(function (section) { return !section.hidden && section.getBoundingClientRect().top <= offset + 32; }).pop();
      anchors.forEach(function (link) {
        if (active && link.hash === '#' + active.id) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', function () {
      if (!scheduled) { scheduled = true; requestAnimationFrame(updateActive); }
    }, {passive:true});
    updateActive();
  }

  /* ------------------------------------------------------------------
   * Countdown to the wedding date/time
   * ------------------------------------------------------------------ */
  function initCountdown() {
    clearInterval(countdownTimer);
    var target = cfg.weddingDateTime ? new Date(cfg.weddingDateTime) : null;
    if (!target || isNaN(target.getTime())) return;

    var elDays = document.getElementById("cd-days");
    var elHours = document.getElementById("cd-hours");
    var elMins = document.getElementById("cd-mins");
    var elSecs = document.getElementById("cd-secs");
    if (!elDays) return;

    function tick() {
      var diff = target.getTime() - Date.now();
      if (diff <= 0) {
        elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = "0";
        clearInterval(countdownTimer);
        return;
      }
      var s = Math.floor(diff / 1000);
      var days = Math.floor(s / 86400);
      var hours = Math.floor((s % 86400) / 3600);
      var mins = Math.floor((s % 3600) / 60);
      var secs = s % 60;

      elDays.textContent = String(days);
      elHours.textContent = String(hours).padStart(2, "0");
      elMins.textContent = String(mins).padStart(2, "0");
      elSecs.textContent = String(secs).padStart(2, "0");
    }

    countdownTimer = setInterval(tick, 1000);
    tick();
  }

  function initCopyIban() {
    var button = document.getElementById('copyIban');
    var iban = document.getElementById('bankIban');
    var status = document.getElementById('copyIbanStatus');
    if (!button || !iban || !status) return;
    var label = button.querySelector('[data-content="bank.copy"]');
    var copied = button.querySelector('[data-content="bank.copied"]');
    var success = status.querySelector('[data-content="bank.copySuccess"]');
    var failure = status.querySelector('[data-content="bank.copyError"]');
    var resetTimer;
    var copying = false;
    function feedback(state) {
      button.toggleAttribute('data-copied', state === 'success');
      label.hidden = state === 'success';
      copied.hidden = state !== 'success';
      success.hidden = state !== 'success';
      failure.hidden = state !== 'error';
    }
    button.hidden = false;
    button.addEventListener('click', async function () {
      if (copying) return;
      copying = true;
      clearTimeout(resetTimer);
      button.setAttribute('aria-busy', 'true');
      feedback('');
      try {
        await navigator.clipboard.writeText(iban.textContent.replace(/\s+/g, ''));
        feedback('success');
        resetTimer = setTimeout(function () {
          feedback('');
        }, 4000);
      } catch (error) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(iban);
        selection.removeAllRanges();
        selection.addRange(range);
        feedback('error');
      } finally {
        copying = false;
        button.removeAttribute('aria-busy');
      }
    });
  }

  /* ------------------------------------------------------------------
   * FAQ accordion
   * ------------------------------------------------------------------ */
  function initFAQ() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var btn = item.querySelector(".faq-question");
      btn.addEventListener("click", function () {
        var isOpen = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
        btn.querySelector(".faq-icon").textContent = isOpen ? "–" : "+";
      });
    });
  }

  /* ------------------------------------------------------------------
   * Scroll-reveal for elements marked .reveal
   * ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    items.forEach(function (el) { observer.observe(el); });
  }

  function applyContent() {
    document.querySelectorAll("[data-content]").forEach(function (el) {
      var value = (cfg.content || {})[el.dataset.content];
      if (typeof value === "string") el.textContent = value;
    });
    document.querySelectorAll("img[data-content-alt]").forEach(function (img) {
      var value = (cfg.content || {})[img.dataset.contentAlt];
      if (typeof value === "string") img.alt = value;
    });
    var date = new Date(cfg.weddingDateTime);
    if (!isNaN(date.getTime())) {
      var label = date.toLocaleDateString('pt-PT', {timeZone:'Europe/Lisbon', day:'numeric', month:'long', year:'numeric'});
      var time = date.toLocaleTimeString('pt-PT', {timeZone:'Europe/Lisbon', hour:'2-digit', minute:'2-digit'});
      var dates = {date:label, clock:time, time:label + ' · ' + time, place:label + ' · Lisboa', reception:label + ' · a seguir à missa'};
      document.querySelectorAll('[data-date]').forEach(function (el) { el.textContent = dates[el.dataset.date]; });
      document.title = cfg.content['couple.name'] + ' — ' + label;
    }
  }

  function initLightbox() {
    var dialog = document.getElementById("lightbox");
    var img = document.getElementById("lightboxImage");
    var caption = document.getElementById("lightboxCaption");
    var title = document.getElementById("lightboxTitle");
    var counter = document.getElementById("lightboxCounter");
    var prev = document.getElementById("lightboxPrev");
    var next = document.getElementById("lightboxNext");
    var stage = dialog.querySelector(".lightbox-stage");
    var links = Array.from(document.querySelectorAll("[data-lightbox]"));
    var group = [];
    var active = 0;
    var opener;
    var touchStart;
    function show(index) {
      active = (index + group.length) % group.length;
      var link = group[active];
      var section = link.closest("[data-section]");
      var moment = link.closest(".story-moment");
      var momentTitle = moment && moment.querySelector("h3 span:last-child");
      var honeymoon = link.closest(".honeymoon");
      var heading = honeymoon ? honeymoon.querySelector("h3") : section.querySelector("h2");
      title.textContent = heading.textContent + (momentTitle ? " - " + momentTitle.textContent : "");
      img.src = link.href;
      img.alt = link.querySelector("img").alt;
      var figure = link.closest("figure");
      var label = figure && figure.querySelector("figcaption");
      caption.textContent = label ? label.textContent : img.alt;
      counter.textContent = (active + 1) + " / " + group.length;
      // Cache the adjacent originals so the next photo opens promptly.
      if (group.length > 1) {
        [active - 1, active + 1].forEach(function (neighbor) {
          var preload = new Image();
          preload.src = group[(neighbor + group.length) % group.length].href;
        });
      }
    }
    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (!dialog.showModal) return;
        event.preventDefault();
        opener = link;
        var section = link.closest("[data-section]");
        group = links.filter(function (item) { return item.closest("[data-section]") === section; });
        prev.hidden = next.hidden = group.length < 2;
        show(group.indexOf(link));
        document.documentElement.classList.add("gallery-open");
        dialog.showModal();
      });
    });
    document.getElementById("lightboxClose").addEventListener("click", function () { dialog.close(); });
    prev.addEventListener("click", function () { show(active - 1); });
    next.addEventListener("click", function () { show(active + 1); });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { event.preventDefault(); show(active - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); show(active + 1); }
    });
    dialog.addEventListener("click", function (event) {
      var rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    stage.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "touch") touchStart = {x: event.clientX, y: event.clientY};
    });
    stage.addEventListener("pointerup", function (event) {
      if (!touchStart || event.pointerType !== "touch") return;
      var dx = event.clientX - touchStart.x;
      var dy = event.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(active + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener("pointercancel", function () { touchStart = null; });
    dialog.addEventListener("close", function () {
      touchStart = null;
      document.documentElement.classList.remove("gallery-open");
      opener.focus({preventScroll: true});
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyContent();
    initCopyIban();
    initLightbox();
    applyTheme();
    applySectionToggles();
    initNav();
    initSectionNavigation();
    initCountdown();
    initFAQ();
    initReveal();
  });
})();
