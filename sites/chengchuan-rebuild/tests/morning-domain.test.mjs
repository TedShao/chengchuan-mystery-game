import {test} from 'node:test';
import assert from 'node:assert/strict';
import {transact,replay} from '../src/domain/xuchuan.mjs';
function game(){let events=[],n=0;return {go(type,body={}){events=transact(events,{id:'morning-'+(++n),type,...body}).events;return replay(events)},get state(){return replay(events)},send(purpose,to='xiaoyu',text='请核对本次安排',extra={}){return this.go('SEND',{purpose,to,text,...extra})},ask(to,text){return this.go('CHAT',{to,text}).messages.at(-1).body}};}
test('refusing next-week window does not decline Xu review; imported context only grants delivered facts',()=>{
 const g=game();g.go('START',{continuity:{windowDecision:'declined',sharedCorrected:true,fees:true,intro:true,known:{xiaoyu:['luo']}}});
 assert.equal(g.state.participation,'unassigned');assert.equal(g.state.owner,'xiaoyu');assert.equal(g.state.appointment,'tentative');assert(g.state.known.xiaoyu.includes('luoMay12'));assert(!g.state.known.tang.includes('luoMay12'));assert(g.state.grants.includes('fees'));
 assert.match(g.ask('xiaoyu','我不接手，但他是不是只答应了解一下？'),/下周窗口.*拒绝.*目前只说有时间先了解/);
 assert.match(g.state.messages.find(m=>m.subject.includes('待发回复')).body,/昨天罗青.*今天许川/);
});
test('private source inquiry and repeated schedule questions respect actual recipient knowledge',()=>{
 const g=game();g.go('START');g.send('hold');assert.match(g.ask('zhou','许川几点联系？'),/暂缓/);g.send('verify','shen');g.send('resume');
 assert.equal(g.state.bookingKnown.shen.appointment,'general_confirmed');assert.equal(g.state.bookingKnown.zhou.appointment,'paused');assert(!g.state.known.xiaoyu.includes('verify'));assert(!g.state.known.zhou.includes('verify'));
 for(let i=0;i<3;i++){assert.doesNotMatch(g.ask('zhou','许川几点联系？'),/15:10/);assert.doesNotMatch(g.ask('tang','许川几点联系？'),/15:10/)}
 assert.match(g.ask('xiaoyu','我刚私下问沈念核验资料了，她怎么回的你知道吗？'),/不知道她回了什么/);assert.equal(g.state.appointment,'general_confirmed');
});
test('source follow-up is a distinct response; reading and chat do not make a formal request',()=>{
 const g=game();g.go('START');g.send('admission','zhou');g.go('READ',{ref:'admission'});
 const first=g.ask('zhou','已收和已测试，是核过真实经营情况吗？');const second=g.ask('zhou','不是说你骗人，我问扫描件后来找谁核实的？');
 assert.notEqual(first,second);assert.match(second,/沈念.*原始材料/);assert.equal(g.state.verification,'not_requested');assert.equal(g.state.appointment,'tentative');
});
test('forwarding different original confirmations with same note is not deduplicated; text alone is not a notice',()=>{
 const g=game();g.go('START');g.send('hold');const hold=g.state.messages.find(m=>m.booking==='paused');g.send('resume');const resume=g.state.messages.find(m=>m.booking==='general_confirmed');
 g.send('forward','tang','许川15:10联系');assert.equal(g.state.bookingKnown.tang,undefined);
 g.send('forward','tang','请核对本次安排',{sourceMessage:hold.id});assert.equal(g.state.bookingKnown.tang.appointment,'paused');
 g.send('forward','tang','请核对本次安排',{sourceMessage:resume.id});assert.equal(g.state.bookingKnown.tang.appointment,'general_confirmed');assert.match(g.ask('tang','许川几点联系？'),/转来的.*15:10/);assert.equal(g.state.bookingKnown.zhou.appointment,'paused');
});
test('decline plus pause stays paused through lunch; changed contact advice never reassigns owner',()=>{
 const g=game();g.go('START');g.send('hold');g.send('decline');g.go('LUNCH');assert.equal(g.state.appointment,'paused');assert.equal(g.state.participation,'declined');g.send('resume');assert.equal(g.state.appointment,'general_confirmed');assert.equal(g.state.participation,'declined');assert.equal(g.state.owner,'xiaoyu');
 assert.match(g.ask('xiaoyu','我改口不是接手，现在谁负责？'),/退出这次核对.*我继续处理/);
});

test('new internal notices do not renumber original mail IDs in existing event saves',()=>{
 const g=game();g.go('START');g.send('hold');g.send('resume');assert.equal(g.state.messages.find(m=>m.id==='xu-14').booking,'general_confirmed');g.send('forward','zhou','请核对旧存档中的这封确认',{sourceMessage:'xu-14'});assert.equal(g.state.bookingKnown.zhou.appointment,'general_confirmed');assert.equal(new Set(g.state.messages.map(m=>m.id)).size,g.state.messages.length);
});

test('colloquial retraction acknowledges received claim without leaking it to others',()=>{
 const g=game();g.go('START');g.send('claim','tang','公司是不是收了她两万？');assert.match(g.ask('tang','我改口，不是公司收走了那两万。'),/不再这样判断/);assert.match(g.ask('xiaoyu','我收回刚才公司收走两万的说法。'),/没有收到/);assert.equal(g.state.appointment,'tentative');
});

test('repeat question stays brief but new delivered confirmation replaces the old answer',()=>{
 const g=game();g.go('START');g.send('hold');const first=g.ask('zhou','许川几点联系？');assert.match(first,/暂缓/);assert.match(g.ask('zhou','许川几点联系？'),/还没有新的消息/);g.send('resume');const mail=g.state.messages.find(m=>m.booking==='general_confirmed');g.send('forward','zhou','新确认',{sourceMessage:mail.id});assert.match(g.ask('zhou','许川几点联系？'),/15:10/);
});
