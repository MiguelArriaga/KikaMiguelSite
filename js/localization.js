(function () {
  "use strict";

  const config = window.SITE_CONFIG;
  const toggle = document.getElementById("languageToggle");
  const defaultLocale = "pt-PT";
  const englishLocale = "en-GB";
  const storageKey = "kika-miguel-language";
  let locale = defaultLocale;

  function text(key) {
    return config?.translations?.[locale]?.[key] ?? config?.content?.[key];
  }

  function date(key) {
    return config?.dateLabels?.[locale]?.[key];
  }

  function apply() {
    document.documentElement.lang = locale;
    document.querySelectorAll("[data-content]").forEach(element => {
      const value = text(element.dataset.content);
      if (typeof value === "string" && element.textContent !== value) element.textContent = value;
    });
    const bindings = {
      "data-content-alt": "alt",
      "data-content-aria-label": "aria-label",
      "data-content-title": "title",
      "data-content-meta": "content"
    };
    for (const [binding, attribute] of Object.entries(bindings)) {
      document.querySelectorAll("[" + binding + "]").forEach(element => {
        const value = text(element.getAttribute(binding));
        if (typeof value === "string") element.setAttribute(attribute, value);
      });
    }
    document.querySelectorAll("[data-date]").forEach(element => {
      const value = date(element.dataset.date);
      if (typeof value === "string" && element.textContent !== value) element.textContent = value;
    });
    const isEnglish = locale === englishLocale;
    toggle.querySelector("img").src = isEnglish ? "pictures/flags/portugal.png" : "pictures/flags/uk.png";
  }

  window.siteLocale = {text, date};
  if (!toggle || !config?.translations?.[englishLocale]) return;
  try {
    if (window.localStorage.getItem(storageKey) === englishLocale) locale = englishLocale;
  } catch {
    // The switch still works for the current page if storage is blocked.
  }
  apply();
  toggle.hidden = false;

  toggle.addEventListener("click", function () {
    const {scrollX, scrollY} = window;
    locale = locale === englishLocale ? defaultLocale : englishLocale;
    try {
      window.localStorage.setItem(storageKey, locale);
    } catch {
      // Keep the selection in memory until this page is closed.
    }
    apply();
    document.dispatchEvent(new Event("site-languagechange"));
    window.scrollTo({left: scrollX, top: scrollY, behavior: "instant"});
  });
})();
