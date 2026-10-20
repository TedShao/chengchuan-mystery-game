const {chromium}=require('/Users/liuaiting/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('assert/strict'),fs=require('fs');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),c=await b.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),p=await c.newPage();p.setDefaultTimeout(7000);
 const log=[],errors=[];p.on('pageerror',e=>errors.push(e.message));const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('chengchuan-rebuild-v1')));
 const read=async(label,selector)=>{const text=await p.locator(selector).last().innerText();log.push({label,text});console.log(label+'\n'+text);};
 const ask=async text=>{await p.fill('#chat-input',text);await p.press('#chat-input','Enter');await p.waitForTimeout(650);await read(text,'.chat-message:not(.self) .chat-bubble');};
 await p.goto('http://127.0.0.1:5174');await p.click('[data-prologue="skip"]');await p.click('[data-action="start"]');await require('./opening-helper.cjs').complete(p);await p.click('[data-lesson="pause"]');if(await p.locator('[data-shift="guide-off"]').count())await p.click('[data-shift="guide-off"]');
 await p.click('[data-case-id="schedule"]');for(let i=0;i<3;i++)await p.selectOption('[data-shift-choice="'+i+'"]','0');await p.click('[data-shift-preview]');await p.click('[data-action="submit-report"]');await p.click('#modal-root [data-open="mail"]');await read('改课首稿后的周衡回信','[data-window="mail"] .mail-content');
 // Deliberately skip the invitation body; use the actual participation notice to find the training page.
 await p.click('[data-action="mail-select"][data-id="report-participation-1"]');await read('只读参与通知','[data-window="mail"] .mail-content');await p.locator('[data-window="mail"] [data-detail="training.chengchuan.example"]').click();await read('第一次见到培训页','[data-window="browser"] .web-viewport');await p.screenshot({path:'qa/discovery-training.png'});
 assert.match(await p.locator('.training-context').innerText(),/待本人答复/);assert.equal(await p.locator('.training-context [data-detail="original"]').count(),1);assert.equal(await p.locator('.training-context [data-detail="feedback"]').count(),1);
 await p.locator('.training-context [data-detail="original"]').click();await p.fill('[data-input="sheet-filter"]','罗青');await read('漏看回访，先只扫状态列','[data-window="sheet"] .sheet-table');
 const before=await state();await p.click('#dock [data-open="chat"]');await p.click('[data-action="chat-select"][data-id="xiaoyu"]');
 await ask('三条都是已处理，那她是不是后来又来找茬？');
 for(const q of ['我交的是改课通知，为什么要我看罗青？','这页要我讲什么？','我不讲，只看看。这句恢复信任是谁确认的？','谢谢那句是不是你编的？','不是说你编造。我问这句谢谢是什么时候的？'])await ask(q);
 assert.match(log.find(x=>x.label==='我交的是改课通知，为什么要我看罗青？').text,/4 月 7 日补发/);assert.match(log.find(x=>x.label==='这页要我讲什么？').text,/查附件和回信/);assert.match(log.find(x=>x.label==='我不讲，只看看。这句恢复信任是谁确认的？').text,/周衡审过/);assert.doesNotMatch(log.find(x=>x.label==='我不讲，只看看。这句恢复信任是谁确认的？').text,/私人稿件|为何质疑/);assert.match(log.at(-1).text,/收回/);
 // Ask via the reference the colleague supplies, not the case's hidden truth.
 await p.locator('[data-window="chat"] .chat-messages [data-detail="luo"]').last().click();await p.locator('[data-window="mail"] details summary').click();await read('先看到新信，再展开历史','[data-window="mail"] .app-content');await p.screenshot({path:'qa/discovery-mail.png'});
 await p.click('#dock [data-open="chat"]');await ask('她后来给我发信说两万还没到，你已经看过了吗？');assert(!(await state()).case.known.xiaoyu.includes('luo'));
 await ask('我先前理解错了。谢谢是补附件那回，后来那笔钱不能凭这句话确认，对吗？');
 assert.match(log.at(-1).text,/两次事项/);await ask('谢谢是补附件那回，后来那笔钱不能凭这句话确认，对吗？');assert.doesNotMatch(log.at(-1).text,/这封新信我还没看到/);
 const after=await state();assert.equal(after.case.shared,before.case.shared);assert.equal(after.case.followup,before.case.followup);assert.equal(after.workdays.presenter,before.workdays.presenter);assert.equal(after.submissions.length,1);assert.equal(after.case.sentQueries,false);
 await p.click('#dock [data-open="browser"]');await p.click('[data-work="decline-presenter"]');assert.equal((await state()).workdays.presenter,'declined');assert.match(await p.locator('.training-context').innerText(),/林见不主讲/);await p.screenshot({path:'qa/discovery-declined.png'});await p.click('#dock [data-open="chat"]');await ask('这页要我讲什么？');assert.match(log.at(-1).text,/不主讲/);assert.equal((await state()).case.shared,'0511');assert.equal((await state()).case.followup,'xiaoyu');
 assert.equal(errors.length,0);fs.writeFileSync('tests/fixtures/discovery-handoff.json',JSON.stringify({log,errors,state:after},null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
