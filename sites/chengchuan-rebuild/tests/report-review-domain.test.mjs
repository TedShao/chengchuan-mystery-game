import {test} from 'node:test';import assert from 'node:assert/strict';
await import('../web/report-review.js');const R=globalThis.ReportReview;
const titles={attachment:'课程资料补发',schedule:'公开课时间调整',chart:'阶段复盘图表'};
const make=(fields,c='attachment')=>`案例名称：${titles[c]}\n工作背景：${fields[0]}\n本人完成的工作：${fields[1]}\n结果：${fields[2]}\n资料来源：原始邮件`;
const base=['罗青反馈课程附件打不开。','我替换了页面上的旧文件，并把修订版发给她。','她回信说可以正常打开，还表示感谢。'];
const read=(fields,c='attachment')=>R.evaluate({text:make(fields,c),caseId:c});
test('unrelated writing and topic word lists never pass from title or source metadata',()=>{
 for(const text of ['我吃了饭喝了酒，睡了觉。最后醒来觉得很累。','哈哈哈哈','附件 补发 回复 打开']){const r=read([text,text,text]);assert.equal(r.usable,false);assert(r.needs.length>=2);}
 assert.equal(read(['','','']).kind,'empty');
});
test('different natural expressions preserve actor action object and response',()=>{
 const variants=[base,['学员说手机和店里的电脑都用不了课件。','我将旧附件换成修正版，再用邮件寄给她。','罗女士告诉我现在能用了，谢谢我们。'],['那份资料一直加载失败，所以需要处理。','把挂在页面上的文件更换后，重新发送给用户。','学员在回信里说现在能读出来了。'],['罗青说示例无法读取。','我重新上传了文件。','用户反馈附件已经打开了。']];
 for(const fields of variants)assert.equal(read(fields).usable,true,JSON.stringify(read(fields)));
});
test('only the incomplete fields need rewriting',()=>{
 assert.deepEqual(read([base[0],'做完了。','还行。']).needs,[1,2]);
 assert.deepEqual(read([base[0],base[1],'处理好了。']).needs,[2]);
 assert.deepEqual(read([base[0],base[1],'尚未收到用户对文件是否可读的确认。']).needs,[]);
});
test('negation, planned work, other actors and quotes do not become personal achievements',()=>{
 for(const text of ['我没有补发附件。','不是我补发，是小雨补发的。','我准备补发附件。','我打算把附件发给她。','我没有把附件重新发给她。','小雨替换了附件，并发给罗青。','她重新上传了附件。','邮件写着“补发了修订版附件”。','邮件写着“我补发了附件”。'])assert(read([base[0],text,base[2]]).needs.includes(1),text);
});
test('explicit correction supersedes the old claim; unresolved contradictory results ask for dates',()=>{
 const changed=read([base[0],base[1],'她回复还是打不开。更正一下：她回信说可以正常打开了。']);assert.equal(changed.usable,true);
 const conflict=read([base[0],base[1],'她说可以打开了。她说还是打不开。']);assert.equal(conflict.fields[2].code,'conflict');
 assert.equal(read([base[0],base[1],'她说不能打开了。']).usable,false);
});
test('unsupported broad claims need attribution without revealing the mystery truth',()=>{
 const r=read([base[0],base[1],'我们恢复了她的信任，所有问题都解决了。']);assert.equal(r.kind,'broad');assert.deepEqual(r.needs,[2]);
 const quoted=read([base[0],base[1],'根据共享复盘，负责人称“恢复了用户信任”。']);assert.equal(quoted.fields[2].code,'attributed');
 const limited=read([base[0],base[1],'不能确认所有问题都解决了，后续款项还需要核实。']);assert.equal(limited.kind,'limited');
});
test('schedule uses adjustment context and result source, not a bare time keyword',()=>{
 const fields=['公开课推迟半个小时。','我把网页改成晚上八点，并给报名用户发了通知。','小雨看过后说页面和通知无误。'];assert.equal(read(fields,'schedule').usable,true);
 const r=read([fields[0],'我将课程时间改为19:30。',fields[2]],'schedule');assert.equal(r.fields[1].code,'time-check');
 assert.equal(read(['20:00','20:00','20:00'],'schedule').usable,false);
});
test('chart distinguishes own delivery and approval, with explicit pending results allowed',()=>{
 const fields=['本期复盘需要整理统计图。','我整理了图表，发给周衡。','周衡回信说整理得清楚。'];assert.equal(read(fields,'chart').usable,true);
 assert.equal(read([fields[0],fields[1],'尚未收到负责人对文字部分的确认。'],'chart').usable,true);
});

test('free prose and field labels describe the same work without requiring exact template wording',()=>{
 const r=R.evaluate({text:'罗青说课程资料打不开。我把旧文件换成修订版，再重新发给她。她在回信中说可以正常使用了。',caseId:'attachment'});assert.equal(r.structured,false);assert.equal(r.usable,true);
});

test('spoken wording and omitted subjects resolve from the written background, not the title',()=>{
 const variants=[
 ['她说下载的那个表死活点不开，手机电脑都试过。','把旧的换掉，新的又给她发了一遍。','她回我说这回行了，还道了谢。'],
 ['罗青下载的课件报错。','换成新版，再发给她。','回我说这次没问题了。'],
 ['下载的那个表打不开。','我又发了一遍。','说现在能用了。'],
 ['用户说资料点不开。','我不是只转给别人，是把旧的换掉又发给她。','一开始说不行，后来回信说现在能打开了。']
 ];
 for(const v of variants)assert.equal(read(v).usable,true,JSON.stringify(read(v)));
 assert.equal(read(['有点问题。','换了新的。','说行了。']).usable,false);
 assert.equal(read([base[0],'我还没把旧的换掉。',base[2]]).usable,false);
 assert.equal(read([base[0],base[1],'她问现在能打开了吗？']).usable,false);
});

test('spoken schedule and chart descriptions preserve meaning without copying records',()=>{
 assert.equal(read(['老师把那节课往后挪了半小时。','页面调到晚八点，通知也重新发了。','小雨回我说两边都对上了。'],'schedule').usable,true);
 assert.equal(read(['复盘要用几张统计图。','把数字画成图，弄好交给周衡了。','他说看着挺清楚的。'],'chart').usable,true);
});
