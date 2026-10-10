const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync('js/gift-form.js', 'utf8');
function setup(fetch) {
  const button = {disabled:false};
  const status = {textContent:''};
  const frame = {hidden:false};
  const fallback = {hidden:false};
  const form = {hidden:true, dataset:{endpoint:'https://example.test/exec'},
    reportValidity:()=>true, querySelector:()=>button,
    setAttribute(){},removeAttribute(){},reset(){this.resetCalled=true},
    addEventListener(_,handler){this.submit=handler}};
  const context = {window:{fetch,AbortController}, fetch, URLSearchParams, AbortController,
    setTimeout, clearTimeout, FormData:class {constructor(){return [['name','Test'],['gift','Test'],['message',''],['website','']]}},
    document:{getElementById:id=>({customGiftForm:form,giftStatus:status,giftFormFrame:frame}[id]),querySelector:()=>fallback}};
  vm.runInNewContext(code,context);
  return {form,button,status,frame,fallback};
}
const event = {preventDefault(){}};
test('confirmed save resets inputs and announces success',async()=>{
  const ui=setup(async()=>({ok:true,json:async()=>({ok:true})}));
  assert.equal(ui.frame.hidden,true); assert.equal(ui.fallback.hidden,true);
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
