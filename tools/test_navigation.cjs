const test = require('node:test');
const assert = require('node:assert/strict');
const init = require('../js/navigation.js');

function fixture(hash = '', sections = {}) {
  const events = {};
  const make = (id, section) => ({
    id, dataset: {section}, hidden: false, attributes: {},
    classList: {add() {}, remove() {}},
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    focus() { this.focused = true; },
    querySelector() { return this.heading; },
    addEventListener(name, handler) { this[name] = handler; }
  });
  const views = [make('topo', 'hero'), make('detalhes', 'details'),
    make('historia', 'story'), make('presentes', 'gifts'),
    make('contacto', 'contact'), make('faq', 'faq')];
  views.slice(1).forEach(view => { view.heading = make(); view.heading.textContent = view.id; });
  const links = views.map(view => { const link = make(); link.hash = '#' + view.id; return link; });
  const video = make();
  const navLinks = make();
  const navToggle = make();
  const dialog = {open: false, close() {
    this.visibleWhenClosed = views.filter(view => !view.hidden).map(view => view.id);
    this.open = false;
  }};
  const doc = {
    title: 'Home', documentElement: {style: {setProperty() {}}, classList: {add() {}, toggle() {}}},
    querySelectorAll(selector) { return selector === '[data-section]' ? views : links; },
    querySelector(selector) { return selector === '.closing-video' ? video : {getBoundingClientRect: () => ({height: 80})}; },
    getElementById(id) { return id === 'lightbox' ? dialog : id === 'navLinks' ? navLinks : navToggle; },
    dispatchEvent(event) { this.lastEvent = event.type; }
  };
  const win = {
    location: {hash}, history: {pushState(_state, _title, url) { win.location.hash = url; win.pushes++; }},
    pushes: 0, scrollTo() {}, Event: class { constructor(type) { this.type = type; } },
    addEventListener(name, handler) { events[name] = handler; }
  };
  init({window: win, document: doc, config: {sections}});
  function click(id, extra = {}) {
    let prevented = false;
    links.find(link => link.hash === '#' + id).click({button: 0, preventDefault() { prevented = true; }, ...extra});
    return prevented;
  }
  return {views, links, video, doc, win, events, click, dialog};
}

test('home shows hero, Onde, Contacto and video; topic click shows only that topic', () => {
  const f = fixture();
  assert.deepEqual(f.views.filter(v => !v.hidden).map(v => v.id), ['topo', 'detalhes', 'contacto']);
  assert.equal(f.video.hidden, false);
  assert.equal(f.click('presentes'), true);
  assert.deepEqual(f.views.filter(v => !v.hidden).map(v => v.id), ['presentes']);
  assert.equal(f.video.hidden, true);
  assert.equal(f.win.location.hash, '#presentes');
  assert.equal(f.views[3].heading.focused, true);
  assert.equal(f.links[3].attributes['aria-current'], 'page');
  assert.equal(f.doc.lastEvent, 'topicchange');
  f.click('topo');
  assert.equal(f.video.hidden, false);
  assert.equal(f.doc.title, 'Home');
});

test('direct links, Back/Forward and hash changes select the correct view', () => {
  const f = fixture('#historia');
  assert.equal(f.views[2].hidden, false);
  f.click('faq');
  f.win.location.hash = '#historia'; f.events.popstate();
  assert.equal(f.views[2].hidden, false);
  f.win.location.hash = '#faq'; f.events.popstate();
  assert.equal(f.views[5].hidden, false);
  f.win.location.hash = '#contacto'; f.events.hashchange();
  assert.equal(f.views[4].hidden, false);
  assert.equal(f.win.pushes, 1);
});

test('unknown and disabled topics fall back to home; modified clicks keep native behavior', () => {
  for (const hash of ['#unknown', '#historia']) {
    const f = fixture(hash, {story: false});
    assert.equal(f.views[0].hidden, false);
    assert.equal(f.views[2].hidden, true);
    assert.equal(f.click('historia'), false);
    assert.equal(f.click('presentes', {ctrlKey: true}), false);
    assert.equal(f.win.pushes, 0);
  }
});

test('history navigation closes an open gallery before hiding its topic', () => {
  const f = fixture('#historia');
  f.dialog.open = true;
  f.win.location.hash = '#presentes'; f.events.popstate();
  assert.equal(f.dialog.open, false);
  assert.deepEqual(f.dialog.visibleWhenClosed, ['historia']);
  assert.equal(f.views[3].hidden, false);
});

test('home still respects configured-off Onde and Contacto sections', () => {
  const f = fixture('', {details: false, contact: false});
  assert.deepEqual(f.views.filter(view => !view.hidden).map(view => view.id), ['topo']);
  assert.equal(f.video.hidden, false);
});

test('every topic is exclusive and revisiting a view preserves its existing elements', () => {
  const f = fixture();
  const originalViews = [...f.views];
  for (const id of ['detalhes', 'historia', 'presentes', 'contacto', 'faq', 'topo', 'presentes']) {
    assert.equal(f.click(id), true);
    assert.deepEqual(f.views.filter(view => !view.hidden).map(view => view.id),
      id === 'topo' ? ['topo', 'detalhes', 'contacto'] : [id]);
    assert.equal(f.video.hidden, id !== 'topo');
    assert.deepEqual(f.views, originalViews);
    assert.equal(f.links.filter(link => link.attributes['aria-current'] === 'page').length, 1);
  }
  const pushes = f.win.pushes;
  f.click('presentes');
  assert.equal(f.win.pushes, pushes, 'reselecting a topic must not add duplicate history');
  assert.equal(f.click('faq', {button: 1}), false);
  assert.equal(f.click('faq', {defaultPrevented: true}), false);
});
