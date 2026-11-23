const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const {content} = require('../content/site.json');
const code = fs.readFileSync('js/gift-form.js', 'utf8');
function setup(fetch, {name = 'Test', gift = 'Test'} = {}) {
  const button = {disabled:false};
  const status = {textContent:''};
  const fallback = {hidden:false};
  const language = {lang:'pt-PT'};
  const listeners = {};
  const form = {hidden:true, dataset:{endpoint:'https://example.test/exec'},
    reportValidity:()=>true, querySelector:()=>button,
    setAttribute(){},removeAttribute(){},reset(){this.resetCalled=true},
    addEventListener(_,handler){this.submit=handler}};
  const context = {
    window: {fetch, AbortController, siteLocale: {text: key => content[key][language.lang]}},
    fetch, URLSearchParams, AbortController, setTimeout, clearTimeout,
    FormData: class { constructor() { return [['name', name], ['gift', gift], ['message', ''], ['website', '']]; } },
    document: {
      documentElement: language,
      getElementById: id => ({customGiftForm: form, giftStatus: status, giftFormFallback: fallback}[id]),
      addEventListener: (event, handler) => { listeners[event] = handler; }
    }
  };
  vm.runInNewContext(code,context);
  const setLanguage = lang => { language.lang = lang; listeners['site-languagechange'](); };
  return {form,button,status,fallback,setLanguage};
}
const event = {preventDefault(){}};
test('confirmed save resets inputs and announces success',async()=>{
  const ui=setup(async()=>({ok:true,json:async()=>({ok:true})}));
  assert.equal(ui.form.hidden,false); assert.equal(ui.fallback.hidden,true);
  await ui.form.submit(event);
  assert.equal(ui.form.resetCalled,true); assert.match(ui.status.textContent,/registada/);
  assert.equal(ui.button.disabled,false);
});
test('server rejection preserves inputs',async()=>{
  const ui=setup(async()=>({ok:true,json:async()=>({ok:false})}));
  await ui.form.submit(event);
  assert.equal(ui.form.resetCalled,undefined); assert.match(ui.status.textContent,/Não foi possível guardar/);
});
test('network or unreadable response preserves data and never claims success',async()=>{
  for(const fetch of [async()=>{throw Error('network')},async()=>({ok:false}),async()=>({ok:true,json:async()=>{throw Error('invalid JSON')}})]){
    const ui=setup(fetch); await ui.form.submit(event);
    assert.equal(ui.form.resetCalled,undefined); assert.match(ui.status.textContent,/pode ter sido guardada/);
  }
});
test('repeated submit while pending sends only one request',async()=>{
  let calls=0, resolve;
  const ui=setup(()=>{calls++;return new Promise(r=>resolve=r)});
  const first=ui.form.submit(event); await ui.form.submit(event);
  assert.equal(calls,1); assert.equal(ui.button.disabled,true);
  resolve({ok:true,json:async()=>({ok:true})}); await first;
});

test('switching language updates pending feedback and the response that follows', async () => {
  let resolve;
  const ui = setup((_url, {body}) => {
    assert.deepEqual([...body.keys()], ['name', 'gift', 'message', 'website']);
    return new Promise(done => { resolve = done; });
  });
  const submission = ui.form.submit(event);
  assert.equal(ui.status.textContent, 'A enviar…');
  ui.setLanguage('en-GB');
  assert.equal(ui.status.textContent, 'Sending…');
  assert.equal(ui.button.disabled, true);
  resolve({ok:true, json:async () => ({ok:true})});
  await submission;
  assert.match(ui.status.textContent, /received your response/);
  assert.equal(ui.form.resetCalled, true);
  ui.setLanguage('pt-PT');
  assert.match(ui.status.textContent, /registada/);
});

test('English validation, rejection, and uncertain submission explain what happened', async () => {
  const blank = setup(() => assert.fail('blank input should never be submitted'), {name:' '});
  blank.setLanguage('en-GB');
  await blank.form.submit(event);
  assert.equal(blank.status.textContent, 'Please enter your name and gift.');

  const rejected = setup(async () => ({ok:true, json:async () => ({ok:false})}));
  rejected.setLanguage('en-GB');
  await rejected.form.submit(event);
  assert.match(rejected.status.textContent, /check the fields/);
  assert.equal(rejected.form.resetCalled, undefined);

  const uncertain = setup(async () => { throw Error('network'); });
  uncertain.setLanguage('en-GB');
  await uncertain.form.submit(event);
  assert.match(uncertain.status.textContent, /may have been saved/);
  assert.equal(uncertain.form.resetCalled, undefined);
});

test('Google Forms fallback stays visible when the custom form cannot initialize', () => {
  const ui = setup(undefined);
  assert.equal(ui.form.hidden, true);
  assert.equal(ui.fallback.hidden, false);
});
