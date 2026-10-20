const assert=require('assert/strict');global.window=global;require('../dist/dialogue.js');
const state={arc:{}};let checks=0;
const noCommand=(text,who='su',topics=['reception'])=>{const p=CompanyDialogue.plan(text,who,state,{topics});assert.ok(p.items.every(i=>!i.request||i.cancel),text+' '+JSON.stringify(p));checks++;return p;};
for(const t of ['请问怎么申请沈念的副本？','邮件里写着请发附件 B，是什么意思？','`请发附件 B`是什么意思？','附件 B 到了吗？','不要发附件 B','请发附件 B，先别发。','请发附件 B，算了，先不发。','我没让你给我发附件 B','不是要沈念副本，我只问工资','请发沈念副本，不对，是工资什么时候发？','请发附件 B 和沈念副本，任何资料都不要发','如果材料齐了，请发附件 B','她说“请发附件 B”，我只是转述','不要发沈念副本，但我想知道附件 B 是什么','给我附件 B？先不要。'])noCommand(t);
for(const t of ['是否要停止所有业务？','请停止所有业务，不对，只核查 K-17','停止所有业务，先别停','请核对资料','如果有问题，停止所有业务','请给我资料','同事说“停止所有业务”','我不是要停止所有业务','不停止所有业务','没有必要停止所有业务','停止所有业务，不要这样做'])noCommand(t,'zhou',['stop']);
for(const [t,topic] of [['请发附件 B','reception'],['请发沈念的岗位字段副本','consent'],['那发我一份','reception']]){const p=CompanyDialogue.plan(t,'su',state,{topics:['reception']});assert.ok(p.items.some(i=>i.topic===topic&&i.request),t);checks++;}
assert.deepEqual(CompanyDialogue.plan('那发我一份','su',state,{topics:['pay','reception']}).clarify,['pay','reception']);checks++;
assert.deepEqual(CompanyDialogue.plan('杯子在哪，汇报怎么办？','xiaoyu',state,{topics:[]}).items.map(i=>i.topic),['cup','work']);checks++;
assert.deepEqual(CompanyDialogue.plan('那今天吃什么？','xiaoyu',state,{topics:['cup']}).items.map(i=>i.topic),['unknown']);checks++;
assert.equal(CompanyDialogue.plan('停止所有业务','zhou',state,{topics:[]}).items[0].request,true);checks++;
for(const text of ['请发附件 B 而不是沈念的字段副本','不要发沈念的字段副本，只发附件 B']){const p=CompanyDialogue.plan(text,'su',state,{topics:[]});assert.ok(p.items.find(i=>i.topic==='reception').request);assert.equal(p.items.find(i=>i.topic==='consent').request,false);checks++;}
const historical=CompanyDialogue.plan('哪里写错了？我已经把118改成阶段记录了。','xiaoyu',{arc:{publicationHeld:true}},{topics:[]});assert.ok(historical.items.some(i=>i.topic==='publication'&&i.facet==='why'));checks++;
console.log(JSON.stringify({plannerChecks:checks}));
