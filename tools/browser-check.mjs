import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const previewRoot=path.resolve('.preview');
const profile=path.join(previewRoot,'chrome-'+Date.now());
if(path.dirname(profile)!==previewRoot) throw new Error('Unexpected browser profile path');
fs.mkdirSync(profile,{recursive:true});
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
let ws;
let closeBrowser;
const keepAlive=setInterval(()=>{},1000);
try {
  const active=path.join(profile,'DevToolsActivePort');
  for(let n=0;n<200&&!fs.existsSync(active);n++) await pause(100);
  const port=fs.readFileSync(active,'utf8').split('\n')[0];
  const targets=await (await fetch('http://127.0.0.1:'+port+'/json')).json();
  ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
  let next=0;const pending=new Map();const exceptions=[];
  ws.onclose=e=>console.error('CDP closed',e.code,e.reason);
  ws.onerror=e=>console.error('CDP socket error',e.message);
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown') exceptions.push(m.params.exceptionDetails.text)};
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++next;const timeout=setTimeout(()=>reject(new Error('CDP timed out: '+method)),10000);pending.set(id,{resolve:r=>{clearTimeout(timeout);resolve(r)},reject:e=>{clearTimeout(timeout);reject(e)}});ws.send(JSON.stringify({id,method,params}))});
  closeBrowser=()=>send('Browser.close');
  const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value};
  await send('Runtime.enable');await send('Page.enable');
  await send('Page.navigate',{url:'http://127.0.0.1:8000/'});
  for(let n=0;n<100;n++){if(await evaluate('!!document.getElementById("lightbox") && document.readyState === "complete"'))break;await pause(100)}
  assert.equal(await evaluate('document.querySelectorAll("[data-lightbox]").length'),16);
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll("section[data-section]")).map(el=>el.id)'),['detalhes','historia','presentes','contacto','faq'],'page section order');
  assert.deepEqual(await evaluate('Array.from(document.querySelectorAll("#navLinks a")).map(el=>el.hash)'),['#detalhes','#historia','#presentes','#contacto','#faq'],'menu follows section order');
  assert.equal(await evaluate('document.body.innerText.includes("RSVP")'),false);
  assert.equal(await evaluate('document.body.innerText.includes("Patagónia")'),true);
  assert.match(await evaluate('document.getElementById("cd-days").textContent'),/^\d+$/);
  assert.equal(await evaluate('document.getElementById("closingVideo").paused'),true,'closing video stays idle off-screen');
  assert.equal(await evaluate('document.getElementById("closingVideo").readyState'),0,'closing video is not fetched before reaching it');
  // Exercise copying without changing the computer's clipboard.
  await evaluate(`(() => {
    window.testClipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText:async value => {window.testCopiedIban = value;}}});
    document.getElementById('copyIban').focus();
  })()`);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
  await pause(50);
  assert.equal(await evaluate('window.testCopiedIban'),await evaluate('window.SITE_CONFIG.content["bank.iban"].replace(/\\s+/g, "")'),'copy the configured IBAN without spaces');
  assert.equal(await evaluate(`document.querySelector('[data-content="bank.copySuccess"]').hidden`),false);
  assert.equal(await evaluate('document.getElementById("copyIban").hasAttribute("data-copied")'),true,'check icon confirms copying');
  assert.equal(await evaluate('document.activeElement.id'),'copyIban','keyboard focus stays on copy button');
  await pause(4100);
  assert.equal(await evaluate(`document.querySelector('[data-content="bank.copy"]').hidden`),false,'copy label resets');
  assert.equal(await evaluate('document.getElementById("copyIban").hasAttribute("data-copied")'),false,'copy icon resets');
  await evaluate(`Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText:async () => {throw new Error('Clipboard blocked');}}}); document.getElementById('copyIban').click()`);
  await pause(50);
  assert.equal(await evaluate(`document.querySelector('[data-content="bank.copyError"]').hidden`),false);
  assert.equal(await evaluate(`document.querySelector('[data-content="bank.copySuccess"]').hidden`),true,'no false success after clipboard rejection');
  assert.equal(await evaluate('window.getSelection().toString()'),await evaluate('document.getElementById("bankIban").textContent'),'select IBAN for manual copying');
  await evaluate(`Object.defineProperty(navigator, 'clipboard', {configurable:true, value:undefined}); document.getElementById('copyIban').click()`);
  await pause(50);
  assert.equal(await evaluate(`document.querySelector('[data-content="bank.copyError"]').hidden`),false,'fallback without Clipboard API');
  assert.equal(await evaluate('document.getElementById("copyIban").hasAttribute("aria-busy")'),false);
  await evaluate(`if(window.testClipboardDescriptor) Object.defineProperty(navigator, 'clipboard', window.testClipboardDescriptor); else delete navigator.clipboard; window.getSelection().removeAllRanges()`);
  // The house and honeymoon panels have independent galleries.
  await evaluate('document.querySelector(".house-gallery [data-lightbox]").click()');
  assert.equal(await evaluate('document.getElementById("lightboxCounter").textContent'),'1 / 3');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".lightbox-stage")).backgroundColor'),await evaluate('getComputedStyle(document.body).backgroundColor'),'house gallery matches the page background');
  assert.equal(await evaluate('document.getElementById("lightboxTitle").textContent'),await evaluate('window.SITE_CONFIG.content["house.title"]'));
  for (let n=0;n<3;n++) {
    await evaluate('document.getElementById("lightboxNext").click()');
    assert.equal(await evaluate('getComputedStyle(document.getElementById("lightboxImage")).mixBlendMode'),'normal','transparent gift images keep their original colours');
  }
  assert.equal(await evaluate('document.getElementById("lightboxCounter").textContent'),'1 / 3','wrap within house photos');
  await evaluate('document.getElementById("lightboxClose").click()');
  await pause(150);
  assert.equal(await evaluate('document.activeElement === document.querySelector(".house-gallery [data-lightbox]")'),true,'house gallery returns focus');
  await evaluate('document.querySelector(".honeymoon-gallery [data-lightbox]").click()');
  assert.equal(await evaluate('document.getElementById("lightbox").classList.contains("house-lightbox")'),false,'honeymoon retains its dark gallery');
  assert.equal(await evaluate('document.getElementById("lightbox").open'),true);
  assert.equal(await evaluate('document.getElementById("lightboxCounter").textContent'),'1 / 2');
  assert.equal(await evaluate('getComputedStyle(document.documentElement).overflow'),'hidden');
  const first=await evaluate('document.getElementById("lightboxImage").src');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});
  assert.notEqual(await evaluate('document.getElementById("lightboxImage").src'),first);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});
  assert.equal(await evaluate('document.getElementById("lightboxImage").src'),first,'wrap within honeymoon photos');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});
  await pause(150);
  assert.equal(await evaluate('document.getElementById("lightbox").open'),false);
  assert.equal(await evaluate('document.activeElement === document.querySelector(".honeymoon-gallery [data-lightbox]")'),true,'focus returns to opener');
  assert.notEqual(await evaluate('getComputedStyle(document.documentElement).overflow'),'hidden');
  await evaluate('document.querySelectorAll(".faq-question")[3].click()');
  assert.equal(await evaluate('document.querySelectorAll(".faq-question")[3].getAttribute("aria-expanded")'),'true');
  for (const width of [320,375,640,768,1280]) {
    const height=width===320?568:width===375?667:800;
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<640});
    await pause(150);
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'),true,'horizontal overflow at '+width);
    assert.equal(await evaluate('(()=>{const r=document.getElementById("closingVideo").getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&Math.abs(r.width/r.height-16/9)<0.02})()'),true,'closing video retains its full frame at '+width);
    assert.equal(await evaluate('(()=>{const r=document.getElementById("copyIban").getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.width>=24&&r.width<=32&&r.height>=24&&r.height<=32})()'),true,'compact copy icon fits at '+width);
    assert.equal(await evaluate('Array.from(document.querySelectorAll(".hero-link")).every(el=>{const r=el.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth})'),true,'hero links clipped at '+width);
    if(width===375){await evaluate('document.getElementById("navToggle").click()');assert.equal(await evaluate('document.getElementById("navToggle").getAttribute("aria-expanded")'),'true');}
    if(width>=640) assert.equal(await evaluate('getComputedStyle(document.getElementById("navLinks")).position'),'static');
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');
    await pause(250);
    await evaluate('document.fonts.ready.then(()=>window.scrollTo({top:0,behavior:"instant"}))');
    assert.equal(await evaluate('document.querySelector(".hero-links").getBoundingClientRect().bottom <= innerHeight'),true,'navigation below first screen at '+width);
    await evaluate('Promise.all(Array.from(document.querySelectorAll(".story-photo img")).map(img=>{img.loading="eager";return img.decode()}))');
    assert.equal(await evaluate('Array.from(document.querySelectorAll(".story-photo img")).every(img=>{const r=img.getBoundingClientRect();return r.width>0&&r.height>0&&Math.abs(r.width/r.height-img.naturalWidth/img.naturalHeight)<.01})'),true,'story photos keep original proportions at '+width);
    assert.equal(await evaluate('Array.from(document.querySelectorAll(".story-photo")).every(photo=>{const r=photo.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth})'),true,'story collage fits at '+width);
    await evaluate('document.querySelector(".moment-gallery [data-lightbox]").click()');
    assert.equal(await evaluate('document.getElementById("lightboxCounter").textContent'),'1 / 10');
    assert.equal(await evaluate('document.getElementById("lightboxCaption").textContent'),await evaluate('document.querySelector(".moment-gallery img").alt'),'story viewer retains full caption');
    assert.equal(await evaluate('(()=>{const d=document.getElementById("lightbox"),r=d.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&d.scrollHeight<=d.clientHeight})()'),true,'viewer fits viewport at '+width);
    await evaluate('document.getElementById("lightboxNext").click()');
    assert.equal(await evaluate('document.getElementById("lightboxCounter").textContent'),'2 / 10');
    assert.equal(await evaluate('document.getElementById("lightboxTitle").textContent'),'A Nossa História - O Início');
    assert.equal(await evaluate('document.getElementById("lightboxCaption").textContent'),await evaluate('window.SITE_CONFIG.content["story.photo.firstDate"]'));
    await evaluate('document.getElementById("lightboxClose").click()');
    const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    fs.writeFileSync(path.resolve('.preview/site-'+width+'.png'),Buffer.from(screenshot.data,'base64'));
    for (const id of ['detalhes','historia','presentes','faq']) {
      await evaluate(`document.querySelector('.hero-link[href="#${id}"]').click()`);
      let aligned=false;
      for(let n=0;n<40;n++) {
        await pause(50);
        aligned=await evaluate(`(()=>{const top=document.getElementById('${id}').getBoundingClientRect().top;const nav=document.querySelector('.nav').getBoundingClientRect().bottom;return top>=nav+20&&top<=nav+28})()`);
        if(aligned)break;
      }
      assert.equal(aligned,true,'section scroll offset: '+id+' at '+width);
      assert.equal(await evaluate('location.hash'),'#'+id);
    }
  }
  await evaluate('document.querySelector(".venue-map").click()');
  assert.equal(await evaluate('document.getElementById("lightboxCounter").textContent'),'1 / 1');
  assert.equal(await evaluate('document.getElementById("lightboxPrev").hidden && document.getElementById("lightboxNext").hidden'),true,'map has no unrelated photo navigation');
  await evaluate('document.getElementById("lightboxClose").click()');
  await send('Emulation.clearDeviceMetricsOverride');
  // Let the gallery close event and viewport reflow finish before scrolling.
  await pause(300);
  // The silent rendered boomerang autoplays only while visible; guests can pause it.
  const video='document.getElementById("closingVideo")';
  const scrollVideo=()=>evaluate(video+'.scrollIntoView({behavior:"instant",block:"center"})');
  const waitForPlayback=async()=>{
    for(let n=0;n<100;n++) {
      if(await evaluate(video+'.readyState >= 2 && !'+video+'.paused')) return;
      await pause(100);
    }
    throw new Error('Closing video did not start playing: '+JSON.stringify(await evaluate('(()=>{const v='+video+';return {paused:v.paused,readyState:v.readyState,error:v.error&&v.error.message,source:v.currentSrc,hidden:document.hidden,reducedMotion:matchMedia("(prefers-reduced-motion: reduce)").matches,rect:v.getBoundingClientRect().toJSON(),width:innerWidth,height:innerHeight}})()')));
  };
  assert.equal(await evaluate(video+'.muted && '+video+'.loop && '+video+'.playsInline && !'+video+'.controls'),true,'silent inline loop without visible controls');
  await scrollVideo();
  await waitForPlayback();
  assert.equal(await evaluate(video+'.videoWidth'),1920,'retain full-HD resolution');
  assert.equal(await evaluate(video+'.videoHeight'),1080);
  assert.ok(Math.abs(await evaluate(video+'.duration')-200/30)<0.05,'forward/reverse clip duration');
  const videoTime=await evaluate(video+'.currentTime');
  await pause(300);
  assert.notEqual(await evaluate(video+'.currentTime'),videoTime,'video advances');
  await evaluate(video+'.click()');
  assert.equal(await evaluate(video+'.paused'),true,'tap pauses');
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');
  await pause(150);
  await scrollVideo();
  await pause(150);
  assert.equal(await evaluate(video+'.paused'),true,'manual pause persists after scrolling away and back');
  await evaluate(video+'.focus()');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await waitForPlayback();
  assert.equal(await evaluate(video+'.getAttribute("aria-label")'),await evaluate('window.SITE_CONFIG.content["closing.videoPause"]'),'accessible pause label');
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');
  await pause(150);
  assert.equal(await evaluate(video+'.paused'),true,'pause off-screen');
  await scrollVideo();
  await waitForPlayback();
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await pause(150);
  assert.equal(await evaluate(video+'.paused'),true,'respect a changed reduced-motion preference');
  await evaluate('window.browserCheckReloadPending = true');
  await send('Page.reload');
  // A reload can initially report the old document as complete.
  for(let n=0;n<100;n++){if(await evaluate('!window.browserCheckReloadPending && document.readyState === "complete"'))break;await pause(100)}
  assert.equal(await evaluate('!window.browserCheckReloadPending && document.readyState === "complete"'),true,'reloaded page is ready');
  await scrollVideo();
  await pause(150);
  assert.equal(await evaluate(video+'.paused && '+video+'.currentTime === 0 && '+video+'.readyState === 0'),true,'reduced-motion guests see the poster without autoplay or video download');
  assert.equal(await evaluate(video+'.poster.endsWith("HavingFun-poster.webp")'),true);
  await evaluate(video+'.click()');
  await waitForPlayback();
  await evaluate(video+'.click()');
  await send('Emulation.setEmulatedMedia',{features:[]});
  assert.deepEqual(exceptions,[]);
  console.log('PASS: browser layout at 5 widths; closing video autoplay/tap/keyboard/off-screen/reduced-motion; IBAN copy/keyboard/reset/failure fallback, countdown, photos, lightbox keyboard/Escape, FAQ, mobile menu; no runtime exceptions.');
} finally {
  if(closeBrowser) await closeBrowser().catch(()=>{});
  if(ws)ws.close();
  chrome.kill();
  await pause(500);
  try {
    fs.rmSync(profile,{recursive:true,force:true,maxRetries:20,retryDelay:200});
    for(const width of [320,375,640,768,1280]) fs.rmSync(path.join(previewRoot,'site-'+width+'.png'),{force:true});
  } finally {clearInterval(keepAlive);}
}
