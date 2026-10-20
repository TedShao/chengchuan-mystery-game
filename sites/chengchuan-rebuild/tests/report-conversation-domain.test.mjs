import {test} from 'node:test';import assert from 'node:assert/strict';
globalThis.window=globalThis;await import('../web/report-review.js');await import('../web/report-paths.js');await import('../web/report-conversation.js');await import('../web/coworker-dialogue.js');
function state(){return {workdays:{reportPath:{version:2,key:'pending',line:'新版保留待确认。',relationship:'cautious'},reportAssignment:'candidate',presenter:'declined'},chatMemory:{xiaoyu:{participation:{assignment:'candidate',version:2},reportExcerpt:'图表是同事整理的。',reportExcerptVersion:1}},submissions:[{version:2,assessment:{fields:[{}, {excerpt:'我整理了图表。'}]}}],case:{report:{kind:'limited'},reportVersion:2,shared:'0511',trainingSource:'shared',grants:[],known:{xiaoyu:[]},followup:'xiaoyu'}};}
test('object-first coworker attribution cannot be credited as player work',()=>{
 const a=ReportReview.evaluate({caseId:'chart',text:'案例名称：图表整理\n工作背景：阶段复盘需要整理图表。\n本人完成的工作：图表是同事整理的，我没有参与制作。\n结果：图表已交，尚未收到确认。\n资料来源：记录'});
 assert.equal(a.fields[1].code,'other-actor');assert.equal(ReportPaths.classify(a),'colleague');
});
test('participation clarification and retraction never silently change delivered state',()=>{
 const s=state(),before=JSON.stringify([s.workdays,s.case,s.submissions]);
 const r=reportConversation('zhou','不是不愿意做，是我没记清楚谁做的。',s);assert.match(r.text,/第 2 版/);
 const role=reportConversation('xiaoyu','我现在不是旁听了吗，怎么还要看这份？',s);assert.match(role.text,/之前由我主持/);assert.doesNotMatch(role.text,/pending|未确认结果|我整理了图表/);
 assert.match(reportConversation('xiaoyu','为什么？',s).text,/培训会照着/);assert.match(reportConversation('xiaoyu','那找谁核对？',s).text,/工作记录/);assert.equal(JSON.stringify([s.workdays,s.case,s.submissions]),before);
});
test('different follow-ups answer received version, role and excerpt separately',()=>{
 const s=state();assert.match(reportConversation('xiaoyu','图表是谁做的？',s).text,/没有代做/);
 assert.match(reportConversation('zhou','你现在收到的是哪一版？',s).text,/第 2 版/);
 assert.match(reportConversation('xiaoyu','你收到新版了吗？',s).text,/没有收到.*新版私人稿/);
 const first=reportConversation('xiaoyu','那我现在只能旁听吗？',s),again=reportConversation('xiaoyu','那我现在只能旁听吗？',s);assert.notEqual(first.text,again.text);assert.match(again.text,/参与安排没有再变/);
});
test('customer service and fee questions do not turn into private report replies',()=>{
 const s=state(),ask=t=>replyAsColleague('xiaoyu',t,{state:s,known:()=>false,careerLabel:()=>''});
 assert.match(ask('这份写的顺利解决，是谁确认的？').text,/周衡审过/);
 const service=ask('没懂，罗青到底找我们做什么？');assert.match(service.text,/课程用户/);assert.doesNotMatch(service.text,/个人汇报/);
 const fee=ask('先别讲转正，我问公司到底收她什么钱？');assert.match(fee.text,/订单或凭据/);assert.doesNotMatch(fee.text,/刚才那条|个人汇报|款项那条我转/);
});
test('training relevance and public case authorship do not disclose private reports or alter assignments',()=>{
 const s=state(),before=JSON.stringify([s.case,s.workdays,s.submissions]);
 const ask=t=>reportConversation('xiaoyu',t,s)||replyAsColleague('xiaoyu',t,{state:s,known:()=>false,careerLabel:()=>''});
 assert.match(ask('我交的是改课通知，为什么要我看罗青？').text,/4 月 7 日补发/);
 assert.match(ask('这页要我讲什么？').text,/附件检查和回信/);
 const r=ask('我不讲，只看看。这句恢复信任是谁确认的？');assert.match(r.text,/周衡审过/);assert.doesNotMatch(r.text,/私人稿件|为何质疑/);
 assert.equal(JSON.stringify([s.case,s.workdays,s.submissions]),before);
});
test('retracting fabrication accusation acknowledges the change and hypothesis follows question scope',()=>{
 const s=state(),ask=t=>replyAsColleague('xiaoyu',t,{state:s,known:()=>false,careerLabel:()=>''});
 ask('谢谢那句是不是你编的？');assert.equal(s.chatMemory.xiaoyu.accused,true);
 const retract=ask('不是说你编造。我问这句谢谢是什么时候的？');assert.match(retract.text,/收回/);assert.match(retract.text,/4 月 7 日/);assert.equal(s.chatMemory.xiaoyu.accused,false);
 const check=ask('谢谢是补附件那回，后来那笔钱不能凭这句话确认，对吗？');assert.match(check.text,/两次事项/);assert.doesNotMatch(check.text,/新信|5 月 12|两万/);
 assert.notEqual(check.text,ask('谢谢是补附件那回，后来那笔钱不能凭这句话确认，对吗？').text);
});
