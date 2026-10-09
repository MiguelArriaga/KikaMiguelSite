/* Topic views preserve ordinary hash links and native browser history. */
(function (root) {
  "use strict";
  function initTopicNavigation(env) {
    var win = env.window;
    var doc = env.document;
    var config = env.config || {};
    var views = Array.from(doc.querySelectorAll('[data-section]'));
    var anchors = Array.from(doc.querySelectorAll('a[href^="#"]'));
    var video = doc.querySelector('.closing-video');
    var nav = doc.querySelector('.nav');
    var baseTitle = doc.title;
    function enabled(view) {
      return view && (config.sections || {})[view.dataset.section] !== false;
    }
    function resolve() {
      var id = win.location.hash.slice(1) || 'topo';
      return views.find(function (view) { return view.id === id && enabled(view); }) ||
        views.find(function (view) { return view.id === 'topo'; });
    }
    function measure() {
      doc.documentElement.style.setProperty('--nav-offset', nav.getBoundingClientRect().height + 24 + 'px');
    }
    function show(focus) {
      var active = resolve();
      var dialog = doc.getElementById('lightbox');
      if (dialog && dialog.open) dialog.close();
      var home = active.id === 'topo';
      doc.documentElement.classList.toggle('home-view', home);
      views.forEach(function (view) {
        var onHome = home && ['topo', 'detalhes', 'contacto'].includes(view.id);
        view.hidden = !(view === active || onHome) || !enabled(view);
      });
      video.hidden = active.id !== 'topo';
      anchors.forEach(function (link) {
        if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      var heading = active.querySelector('h2');
      doc.title = heading ? heading.textContent + ' — Kika e Miguel' : baseTitle;
      doc.getElementById('navLinks').classList.remove('open');
      doc.getElementById('navToggle').setAttribute('aria-expanded', 'false');
      measure();
      win.scrollTo({top: 0, behavior: 'instant'});
      if (focus) {
        var target = heading || active;
        target.setAttribute('tabindex', '-1');
        target.focus({preventScroll: true});
      }
      doc.dispatchEvent(new win.Event('topicchange'));
    }
    anchors.forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        var target = views.find(function (view) { return '#' + view.id === link.hash; });
        if (!enabled(target)) return;
        event.preventDefault();
        if (win.location.hash !== link.hash) win.history.pushState(null, '', link.hash);
        show(true);
      });
    });
    win.addEventListener('popstate', function () { show(true); });
    win.addEventListener('hashchange', function () { show(true); });
    win.addEventListener('resize', measure);
    if ('ResizeObserver' in win) new win.ResizeObserver(measure).observe(nav);
    doc.documentElement.classList.add('topic-views');
    show(false);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = initTopicNavigation;
  else root.initTopicNavigation = initTopicNavigation;
})(typeof window !== 'undefined' ? window : this);
