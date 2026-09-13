(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};

  /* ------------------------------------------------------------------
   * Apply theme tokens from config.js onto CSS variables
   * ------------------------------------------------------------------ */
  function applyTheme() {
    var root = document.documentElement.style;
    var colors = (cfg.theme && cfg.theme.colors) || {};
    var fonts = (cfg.theme && cfg.theme.fonts) || {};

    if (colors.ink) root.setProperty("--color-ink", colors.ink);
    if (colors.paper) root.setProperty("--color-paper", colors.paper);
    if (colors.paperAlt) root.setProperty("--color-paper-alt", colors.paperAlt);
    if (colors.accent) root.setProperty("--color-accent", colors.accent);
    if (colors.accent2) root.setProperty("--color-accent-2", colors.accent2);

    if (fonts.display) root.setProperty("--font-display", fonts.display);
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
        el.style.display = "none";
      }
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

  /* ------------------------------------------------------------------
   * Countdown to the wedding date/time
   * ------------------------------------------------------------------ */
  function initCountdown() {
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
        clearInterval(timer);
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

    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------
   * RSVP: deadline gate + submission to the Google Apps Script endpoint
   * ------------------------------------------------------------------ */
  function initRSVP() {
    var form = document.getElementById("rsvpForm");
    var closedBox = document.getElementById("rsvpClosed");
    var intro = document.getElementById("rsvp-intro");
    if (!form) return;

    var deadline = cfg.rsvpDeadline ? new Date(cfg.rsvpDeadline) : null;
    var deadlineText = document.getElementById("rsvp-deadline-text");
    if (deadline && deadlineText) {
      deadlineText.textContent = deadline.toLocaleDateString("pt-PT", {
        day: "numeric", month: "long", year: "numeric"
      });
    }

    if (deadline && Date.now() > deadline.getTime()) {
      form.hidden = true;
      if (intro) intro.hidden = true;
      closedBox.hidden = false;
      return;
    }

    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var note = document.getElementById("rsvpNote");
      var submitBtn = document.getElementById("rsvpSubmit");
      var endpoint = cfg.rsvpEndpoint;

      var payload = {
        nome: form.nome.value.trim(),
        presenca: form.presenca.value,
        restricoes: form.restricoes.value.trim(),
        enviadoEm: new Date().toISOString()
      };

      if (!endpoint || endpoint.indexOf("PASTE_YOUR") === 0) {
        note.textContent = "O formulário ainda não está ligado a um destino (falta configurar rsvpEndpoint em config.js).";
        note.className = "form-note error";
        return;
      }

      submitBtn.disabled = true;
      note.textContent = "A enviar...";
      note.className = "form-note";

      // Apps Script Web Apps don't return a readable response under
      // "no-cors" mode, so we can't confirm success from the response body.
      // We treat "the request didn't throw" as success — a real network
      // failure (offline, blocked, wrong URL) still surfaces in the catch.
      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      })
        .then(function () {
          note.textContent = "Obrigado! A vossa confirmação foi recebida.";
          note.className = "form-note success";
          form.reset();
        })
        .catch(function () {
          note.textContent = "Não foi possível enviar agora. Por favor tentem novamente, ou contactem-nos diretamente.";
          note.className = "form-note error";
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
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

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme();
    applySectionToggles();
    initNav();
    initCountdown();
    initRSVP();
    initFAQ();
    initReveal();
  });
})();
