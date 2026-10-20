const {chromium}=require(require('path').join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const assert=require('assert/strict'),fs=require('fs');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),ctx=await b.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),p=await ctx.newPage();p.setDefaultTimeout(8000);const errors=[],passed=[];p.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('qa/report-choice',{recursive:true});
 const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('chengchuan-rebuild-v1')));
 const home=()=>p.click('#dock [data-open="start"]');
 const choose=async values=>{for(let i=0;i<3;i++)await p.selectOption('[data-shift-choice="'+i+'"]',String(values[i]));};
 const send=async()=>{await p.click('[data-shift-preview]');await p.click('[data-action="submit-report"]');await p.locator('#modal-root [data-open="mail"]').waitFor();await p.click('#modal-root [data-open="mail"]');};
 await p.goto('http://127.0.0.1:5174');await p.click('[data-prologue="skip"]');await p.click('[data-action="start"]');await require('./opening-helper.cjs').complete(p);await p.click('[data-lesson="begin"]');await p.click('[data-case-id="attachment"]');await p.click('.shift-source [data-open="mail"]');await p.click('[data-window="mail"] details summary');await p.click('[data-lesson="source-done"]');
 assert.equal(await p.locator('[data-shift-choice]').count(),3);assert.equal(await p.locator('[data-shift-field]').count(),0);assert(await p.locator('[data-lesson="field-done"]').isDisabled());
 for(const [i,v] of ['0','1','2'].entries()){await p.selectOption('[data-shift-choice="'+i+'"]',v);assert.equal((await state()).submissions.length,0);await p.click('[data-lesson="field-done"]');}
 await p.screenshot({path:'qa/report-choice/01-draft.png'});await send();let s=await state();assert.deepEqual(s.workdays.reviews[1].assessment.needs,[1,2]);
 await p.click('[data-window="mail"] [data-review-edit="1"]');await p.locator('#first-lesson[data-step$="-1"]').waitFor();assert.equal(await p.inputValue('[data-shift-choice="0"]'),'0');await p.selectOption('[data-shift-choice="1"]','0');await p.click('[data-lesson="field-done"]');await p.selectOption('[data-shift-choice="2"]','0');await p.click('[data-lesson="field-done"]');await send();assert.equal((await state()).workdays.reviews[2].usable,true);await p.click('[data-lesson="finish-route"]');assert.match(await p.locator('[data-window="browser"]').innerText(),/后续安排/);
 passed.push('下拉默认空白；教学逐栏操作；错误经办人与无来源结果退回；只改待补充栏目；实际重发后通过');
 await home();await p.locator('[data-window="start"] .shift-training-note.report-path').scrollIntoViewIfNeeded();await p.screenshot({path:'qa/report-choice/02-next-thread.png'});assert.match(await p.locator('[data-window="start"] .shift-training-note.report-path').innerText(),/安排|讲解/);
 assert(!(await p.locator('[data-field-review="1"]').innerText()).includes('其他人的动作'));const sent=(await state()).case.report.text;await p.selectOption('[data-shift-choice="2"]','1');assert.equal((await state()).case.report.text,sent);await p.click('[data-shift-preview]');await p.keyboard.press('Escape');assert.equal((await state()).case.reportVersion,2);
 await p.click('[data-shift="free-mode"]');await p.fill('[data-shift-field="2"]','她回我说这回行了，还道了谢。');await p.click('[data-shift="choice-mode"]');assert.equal(await p.inputValue('[data-shift-choice="2"]'),'custom');assert.match(await p.locator('[data-choice-preview="2"]').innerText(),/道了谢/);
 await p.reload();await p.click('[data-prologue="skip"]');await p.click('[data-action="start"]');assert.equal(await p.inputValue('[data-shift-choice="2"]'),'custom');assert.equal((await state()).case.reportVersion,2);
 passed.push('改选与改口只修改本机；取消预览不发送；自由文字与选项互换及刷新均保留正文');
 await p.setViewportSize({width:390,height:844});await p.locator('[data-shift-choice="1"]').scrollIntoViewIfNeeded();await p.screenshot({path:'qa/report-choice/03-mobile.png'});assert(await p.locator('[data-shift-choice="1"]').evaluate(el=>el.getBoundingClientRect().right<=innerWidth));
 await p.setViewportSize({width:1440,height:1000});
 for(const c of ['schedule','chart']){await p.click('[data-shift="switch"]');await p.click('[data-case-id="'+c+'"]');await choose([0,0,0]);await send();s=await state();assert.equal(s.workdays.reviews[s.case.reportVersion].usable,true,c);await home();}
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed,errors},null,2));fs.writeFileSync('qa/report-choice/results.json',JSON.stringify({passed,errors},null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
