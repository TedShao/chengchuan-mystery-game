const {chromium}=require('/Users/liuaiting/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const assert=require('assert/strict'),fs=require('fs');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[],results=[];
 for(const [width,height,motion] of [[1440,900,'reduce'],[1024,700,'reduce'],[390,844,'reduce'],[1440,900,'no-preference'],[390,844,'no-preference']]){
  const c=await b.newContext({viewport:{width,height},reducedMotion:motion}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('chengchuan-rebuild-v1')));
  await p.goto('http://127.0.0.1:5174');await p.click('[data-prologue="skip"]');await p.click('[data-action="start"]');await p.click('[data-shift="orient-next"]');const initial=await state();let previous='';
  for(const q of ['job','company','job','company','company']){
   await p.click('[data-shift="orient-'+q+'"]');const answer=await p.locator('#opening-answer').innerText();assert.match(answer,q==='job'?/先接页面、附件和通知/:/澄川是你的雇主/);assert.equal(await p.locator('.opening-questions [aria-pressed="true"]').count(),1);assert.equal(await p.locator('[data-shift="orient-'+q+'"]').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('.opening-dialogue').count(),1);
   await p.waitForTimeout(400);
   const bounds=await p.locator('#opening-answer').evaluate(el=>{const a=el.getBoundingClientRect(),w=el.closest('.app-body').getBoundingClientRect();return {top:a.top,bottom:a.bottom,viewTop:w.top,viewBottom:Math.min(w.bottom,innerHeight)}});assert(bounds.top>=bounds.viewTop-2&&bounds.bottom<=bounds.viewBottom+2,JSON.stringify(bounds));if(previous&&q!==previous)results.push({width,motion,q,answer});previous=q;
   const colors=await p.locator('.opening-questions button').evaluateAll(buttons=>buttons.map(b=>getComputedStyle(b).backgroundColor));assert.notEqual(colors[0],colors[1]);
   await p.screenshot({path:`qa/opening-questions-${width}-${motion}-${q}.png`});
  }
  for(const [id,name] of [['tang','唐婧'],['tang','唐婧'],['xiaoyu','何小雨'],['zhou','周衡']]){
   await p.click(`[data-person="${id}"]`);assert.equal(await p.locator('.opening-questions [aria-pressed="true"]').count(),0);assert.equal(await p.locator('.opening-team [aria-pressed="true"]').count(),1);assert.equal(await p.locator(`[data-person="${id}"]`).getAttribute('aria-pressed'),'true');assert.match(await p.locator('#opening-answer').innerText(),new RegExp('认识'+name));assert.equal(await p.locator('#opening-answer .opening-dialogue strong').innerText(),name);assert.equal(await p.locator('.opening-dialogue').count(),1);
  }
  await p.locator('[data-shift="orient-company"]').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('[data-person="xiaoyu"]').getAttribute('aria-pressed'),'true');assert.match(await p.locator('#opening-answer').innerText(),/澄川是你的雇主/);
  await p.keyboard.press('Enter');assert.equal(await p.locator('.opening-dialogue').count(),1);
  await p.locator('[data-shift="orient-job"]').focus();await p.keyboard.press('Space');assert.match(await p.locator('#opening-answer').innerText(),/先接页面/);
  await p.click('[data-shift="orient-next"]');await p.click('[data-shift="orient-prev"]');assert.equal(await p.locator('[data-shift="orient-job"]').getAttribute('aria-pressed'),'true');assert.match(await p.locator('#opening-answer').innerText(),/先接页面/);
  await p.screenshot({path:'qa/opening-questions-'+width+'.png'});await p.click('[data-person="zhou"]');assert.equal(await p.locator('.opening-questions [aria-pressed="true"]').count(),0);assert.match(await p.locator('#opening-answer').innerText(),/认识周衡/);await p.click('[data-shift="orient-job"]');assert.equal(await p.locator('[data-person="xiaoyu"]').getAttribute('aria-pressed'),'true');await p.reload();await p.click('[data-prologue="skip"]');await p.click('[data-action="start"]');assert.match(await p.locator('#opening-answer').innerText(),/先接页面/);assert.equal(await p.locator('[data-shift="orient-job"]').getAttribute('aria-pressed'),'true');const final=await state();for(const key of ['sentMails','submissions','extraMails','docs','case'])assert.deepEqual(final[key],initial[key]);assert.equal(final.firstShift.orientation.step,1);await c.close();
 }
 assert.equal(errors.length,0);fs.writeFileSync('qa/opening-questions-result.json',JSON.stringify({results,errors},null,2));await b.close();console.log('Question switching, selected state, visible answer, repeat/person/keyboard/back/reload passed at three sizes with normal and reduced motion');
})().catch(e=>{console.error(e);process.exit(1)});
