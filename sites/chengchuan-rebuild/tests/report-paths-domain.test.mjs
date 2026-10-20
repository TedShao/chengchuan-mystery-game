import {test} from 'node:test';import assert from 'node:assert/strict';
await import('../web/report-review.js');await import('../web/report-paths.js');
const R=globalThis.ReportReview,P=globalThis.ReportPaths;
const assessment=(a,r)=>R.evaluate({caseId:'attachment',text:`案例名称：课程资料补发\n工作背景：罗青的课件打不开。\n本人完成的工作：${a}\n结果：${r}\n资料来源：邮件`});
const own='我替换了旧附件，重新发给她。',reply='她回信说可以正常打开了。';
test('Zhou recalls his own chart receipt without overwriting the player uncertainty',()=>{
 const a=R.evaluate({caseId:'chart',text:'案例名称：阶段复盘图表\n工作背景：阶段复盘需要整理本期工作图表。\n本人完成的工作：我整理了复盘图表并交给周衡。\n结果：图表已交，尚未收到负责人确认。\n资料来源：本人图表交付记录'});
 const p=P.advance(null,{version:1,assessment:a,previousReviewed:0});
 assert.equal(p.key,'pending');assert.equal(p.relationship,'working');assert.match(p.line,/图表是我收的/);assert.match(p.line,/待确认留档/);assert.match(p.line,/不替案例文字下结论/);
 const other=P.advance(null,{version:1,assessment:assessment(own,'尚未确认结果。'),previousReviewed:0});assert.doesNotMatch(other.line,/图表是我收的/);
});
test('different reports have continuing paths, not a single correct unlock',()=>{
 const cases=[[own,reply,'own'],[own,'我还没收到结果确认。','pending'],['小雨补发了附件。',reply,'colleague'],['我准备补发附件。',reply,'planned'],[own,'所有问题都解决了。','overclaim']];
 for(const [a,r,key] of cases){const p=P.advance(null,{version:1,assessment:assessment(a,r),previousReviewed:0});assert.equal(p.key,key);assert(P.nodes[key].task);assert.equal(p.relationship,'working');}
});
test('only delivered repeated unsupported claims after a review escalate, with an explicit warning',()=>{
 const a=assessment(own,'所有问题都解决了。');let p;
 for(let version=1;version<=4;version++){p=P.advance(p,{version,assessment:a,previousReviewed:version-1});if(version===3){assert.equal(p.relationship,'warning');assert.match(p.line,/再继续.*暂停/);}}
 assert.equal(p.key,'suspended');assert.equal(p.ignored,3);
 assert.deepEqual(P.advance(p,{version:4,assessment:a,previousReviewed:3}),p);
 const parallel=P.advance(null,{version:1,assessment:a,previousReviewed:0});assert.equal(P.advance(parallel,{version:2,assessment:a,previousReviewed:0}).ignored,0);
});
test('uncertainty, clarification and genuine correction are not penalized',()=>{
 let p=P.advance(null,{version:1,assessment:assessment(own,'所有问题都解决了。')});
 p=P.advance(p,{version:2,assessment:assessment(own,'所有问题都解决了。'),previousReviewed:1});
 p=P.advance(p,{version:3,assessment:assessment(own,'尚未确认后续结果。'),previousReviewed:2});
 assert.equal(p.key,'pending');assert.equal(p.ignored,0);assert.equal(p.relationship,'cautious');
 for(let v=4;v<=10;v++)p=P.advance(p,{version:v,assessment:assessment('我记不清具体做了什么。','不知道。'),previousReviewed:v-1});
 assert.notEqual(p.relationship,'suspended');
});
test('suspension requires a recovery request and then a changed explanation',()=>{
 let p;for(let v=1;v<=4;v++)p=P.advance(p,{version:v,assessment:assessment(own,'所有问题都解决了。'),previousReviewed:v-1});
 p=P.advance(p,{version:5,assessment:assessment(own,reply),previousReviewed:4});assert.equal(p.key,'suspended');
 p.recoveryRequested=true;p.relationship='recovering';p=P.advance(p,{version:6,assessment:assessment(own,reply),previousReviewed:5});assert.equal(p.key,'own');assert.equal(p.relationship,'cautious');
});
