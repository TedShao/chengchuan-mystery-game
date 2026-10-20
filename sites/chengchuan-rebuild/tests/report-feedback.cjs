const {chromium}=require(require('path').join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const assert=require('assert/strict'),fs=require('fs');
(async()=>{
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[],passed=[];
fs.mkdirSync('qa/report-feedback',{recursive:true});
const ctx=await b.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),p=await ctx.newPage();p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));
const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('chengchuan-rebuild-v1')));
const home=async()=>{await p.click('#dock [data-open="start"]');};
const enter=async()=>{await p.click('[data-prologue="skip"]');await p.click('[data-action="start"]');if(await p.locator('.shift-orientation').count()){await require('./opening-helper.cjs').complete(p);await p.click('[data-lesson="begin"]');}};
const fill=async values=>{for(let i=0;i<values.length;i++)await p.locator('[data-shift-field="'+i+'"]').fill(values[i]);};
const send=async()=>{await p.click('[data-shift-preview]');await p.click('[data-action="submit-report"]');await p.locator('#modal-root [data-open="mail"]').waitFor();await p.click('#modal-root [data-open="mail"]');};
await p.goto('http://127.0.0.1:5174');await enter();await p.click('[data-lesson="pause"]');await p.click('[data-case-id="attachment"]');await p.click('[data-shift="free-mode"]');
const nonsense='我吃了饭喝了酒，睡了觉。最后醒来觉得很累。';await fill([nonsense,nonsense,nonsense]);await send();
let s=await state();assert.deepEqual(s.workdays.reviews[1].assessment.needs,[0,1,2]);assert.equal(s.workdays.reviews[1].usable,false);
let mail=p.locator('[data-window="mail"]');assert.equal(await mail.locator('.review-row.needs').count(),3);await p.screenshot({path:'qa/report-feedback/01-nonsense.png'});
await mail.locator('[data-review-edit="0"]').click();await fill(['罗青反映手机和店里的电脑都用不了课件。','做完了。','还行。']);await send();s=await state();assert.deepEqual(s.workdays.reviews[2].assessment.needs,[1,2]);assert.equal(await mail.locator('.review-row.okay').count(),1);
await mail.locator('[data-review-edit="1"]').click();assert.equal(await p.locator('[data-shift-field="0"]').inputValue(),'罗青反映手机和店里的电脑都用不了课件。');
await p.locator('[data-field-review="1"] [data-review-source]').click();await p.locator('.review-source-return').waitFor();assert.match(await p.locator('.review-source-focus').innerText(),/04-07 09:24/);await p.screenshot({path:'qa/report-feedback/02-source.png'});await p.click('.review-source-return [data-review-return]');
await p.locator('[data-shift-field="1"]').fill('我将旧附件换成修正版，再用邮件寄给她。');await p.locator('[data-review-check="1"]').click();assert.match(await p.locator('[data-field-review="1"]').innerText(),/可保留/);assert.equal((await state()).case.reportVersion,2);assert.equal((await state()).workdays.reviews[2].usable,false);
await p.locator('[data-shift-field="2"]').fill('尚未收到用户对文件是否可读的确认。');await p.locator('[data-review-check="2"]').click();await p.screenshot({path:'qa/report-feedback/03-local-check.png'});await send();s=await state();assert.equal(s.workdays.reviews[3].usable,true);assert.equal(s.case.report.kind,'limited');assert(s.submissions[0].text.includes(nonsense));
passed.push('乱填逐栏反馈；部分写对保留；材料定位到实际发件；本机检查不通知周衡；重发后才收到新反馈');
await home();await p.locator('[data-shift-field="2"]').fill('她回复还是打不开。更正一下：她回信说现在能读出来了。');assert.equal((await state()).case.reportVersion,3);await send();s=await state();assert.equal(s.workdays.reviews[4].usable,true);assert.equal(s.case.report.kind,'own');
await home();await p.locator('[data-shift-field="1"]').fill('不是我补发，是小雨补发的。');await send();assert((await state()).workdays.reviews[5].assessment.needs.includes(1));assert.match(await mail.locator('.review-row.needs').innerText(),/本人|否认/);
passed.push('改口使用新陈述；否定本人经办不会因包含“补发”而通过；各版快照保留');
// The new lesson should locate only the failed action field, not force a rewrite of the good background.
await home();await p.click('#shift-guide-toggle');if(await p.locator('[data-lesson="begin"]').count())await p.locator('[data-lesson="begin"]').click();await p.click('.shift-after-actions [data-open="mail"]');await p.locator('[data-window="mail"] [data-review-edit="1"]').click();await p.locator('#first-lesson[data-step$="-1"]').waitFor();assert.match(await p.locator('.lesson-copy').innerText(),/本人|否认/);await p.click('[data-lesson="pause"]');
// A legacy review without assessment is rendered from the delivered snapshot, not current unsent text.
s=await state();delete s.case.report.assessment;delete s.submissions[4].assessment;delete s.workdays.reviews[5].assessment;
await p.evaluate(s=>localStorage.setItem('chengchuan-rebuild-v1',JSON.stringify(s)),s);await p.reload();await enter();await p.click('.shift-after-actions [data-open="mail"]');assert.equal(await mail.locator('.review-row.needs').count(),1);assert.equal((await state()).case.reportVersion,5);
passed.push('教学定位实际待改栏；旧存档可显示逐栏建议，不重发、不覆盖原稿');
await p.setViewportSize({width:390,height:844});await p.screenshot({path:'qa/report-feedback/04-mobile.png'});assert(await mail.locator('.report-review').evaluate(el=>el.getBoundingClientRect().right<=innerWidth));
assert.deepEqual(errors,[]);console.log(JSON.stringify({passed,errors},null,2));fs.writeFileSync('qa/report-feedback/results.json',JSON.stringify({passed,errors},null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
