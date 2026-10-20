/* Bounded local report reader. Parses work propositions, not a general-language AI.
   Only visible work records are referenced; unknown phrasing receives clarification, not a truth verdict. */
(function(root){
'use strict';
const labels=['工作背景','本人完成的工作','结果'];
const references={
 attachment:[['mail','luo','课程资料邮件 · 04-06 用户来信',0],['mail','luo','课程资料邮件 · 04-07 林见发件',1],['mail','luo','课程资料邮件 · 04-07 用户回复',2]],
 schedule:[['mail','schedule','课程调整邮件 · 04-19 10:14',0],['mail','schedule','课程调整邮件 · 04-19 11:02',1],['mail','schedule','课程调整邮件 · 最新确认',-1]],
 chart:[['doc','weekly','工作记录 · 05-12 图表工作',-1],['doc','weekly','工作记录 · 05-12 图表工作',-1],['mail','career','周衡来信 · 图表反馈',-1]]
};
const norm=t=>String(t??'').normalize('NFKC').replace(/\s+/g,'').replace(/二十点|晚上八点|晚八点|八点整/g,'20:00').replace(/十九点半|七点半/g,'19:30');
function parse(text){
 const m=/^案例名称[:：]([^\n]*)\n工作背景[:：]([\s\S]*?)\n本人完成的工作[:：]([\s\S]*?)\n结果[:：]([\s\S]*?)\n(?:后续安排[:：][\s\S]*?\n)?资料来源[:：]([\s\S]*)$/.exec(text.trim());
 return m?{title:m[1],fields:m.slice(2,5),source:m[5]}:null;
}
function infer(text){const p=parse(text),t=norm(p?.title||text);return /资料补发|罗青|附件|课件/.test(t)?'attachment':/时间调整|公开课|20:00|19:30|改期/.test(t)?'schedule':/复盘图表|图表整理|图表/.test(t)?'chart':null;}
function clauses(text){
 // An explicit correction replaces only the preceding proposition in this field.
 let t=norm(text);const correction=/(?:我改口|更正(?:一下)?|准确地说|应该说|不对[，,]?|撤回前(?:一句|面的说法)[，,]?)[：:,，]?/g;
 let last=-1,m;while((m=correction.exec(t)))last=m.index+m[0].length;
 if(last>=0)t=t.slice(last);
 // Quotations are retained for attributed results, but cannot count as the player's own action.
 return t.split(/[。！？!?；;\n]/).map(x=>x.trim()).filter(Boolean);
}
const neg=/(?:不是|没有|并未|尚未|未曾|没(?:有)?|不曾|并非|不|未)(?:亲自|实际|负责|进行|给她|给用户|再|重新|替她|把.{0,12})?$/;
function asserted(clause,re){
 const rx=new RegExp(re.source,re.flags.replace('g','')+'g');let m;
 while((m=rx.exec(clause))){const before=clause.slice(Math.max(0,m.index-24),m.index).split(/[，,]|但是|不过/).at(-1);
  if(!neg.test(before)&&!/(?:没有|并未|没|尚未|不曾|未曾|不是).{0,16}$/.test(before)&&!/(?:打算|准备|计划|想要|将会|应该|需要|要去|希望).{0,16}$/.test(before))return true;
 }return false;
}
const vocab={
 file:/附件|课件|文件|资料|那份表|(?:这|那)(?:个|张)表|示例|修订版|修正版|表格|文档/,
 fileProblem:/(?:打|点|开)不开|打开不了|无法(?:打开|读取|下载)|不能(?:打开|读取)|加载失败|损坏|报错|用不了|旧版|版本不对|看不了/,
 fileAction:/补发|重发|重新发送|替换|换(?:成|掉|上)|更新|重新上传|更换|发(?:了|去|送|给|回|一遍)|寄(?:了|给|回)|传(?:了|给|回)/,
 fileResult:/可以(?:正常)?(?:打|读|使|查|查阅)|能(?:正常)?(?:打开|使用|看|读)|打开(?:了|成功)|正常(?:打开|读取|使用)|读出来|看到了|能用了|可打开|不再报错|不再打不开|(?:这回|这次|现在)(?:行了|可以了|没问题了)/,
 schedule:/课程|公开课|课时|课表|授课|开课|上课|老师/,
 change:/改|调|推迟|延后|挪|延期|变更/,
 time:/时间|时刻|19:30|20:00|开始|开课|半小时|半个小时/,
 chart:/图表|统计图|柱状图|折线图|复盘|汇总表|数据图|画成图/,
 chartAction:/整理|制作|做(?:了|好|完|出)|汇总|绘制|画(?:了|出|成)|排版|交(?:了|付|给|出)|提交|发(?:了|送|给)/,
 response:/回(?:信|复|了|我)|说|表示|确认|反馈|告诉|告知|致谢|道(?:了)?谢|感谢|谢谢|看过|收到|验收/,
 receiver:/罗青|罗女士|用户|学员|她|他|小雨|周衡|主管|负责人|对方/,
 pending:/待(?:确认|核实|核对|回复)|还(?:没|未)|尚未|没有(?:收到|拿到|得到|确认)|没(?:收到|得到|拿到)|不清楚|不知道|不能确认|无法确认|需要(?:核实|确认)|未(?:确认|收到)|尚不确定/,
 broad:/恢复.*信任|妥善解决|所有.*(?:解决|处理)|全部.*解决|连续.*(?:解决|处理)|(?:款项|钱|退款).*(?:到账|退回|返还)|(?:到账|退款).*(?:已经|完成)/,
 unrelated:/吃(?:了)?饭|喝(?:了)?酒|睡(?:了)?觉|醒来|打游戏|天气|哈哈|随便填|不知道写什么/
};
function proof(text,caseId,role,context){
 const cs=clauses(text),t=cs.join('。');
 const quote=/[“「"]/.test(text),attributed=/依据|根据|引用|复盘(?:里|中|写)|材料(?:里|中|写)|邮件(?:里|中|写)|负责人(?:说|称)|周衡(?:说|称)/.test(t);
 const object=vocab.file.test(t),topic=vocab.schedule.test(t),chart=vocab.chart.test(t);
 const hasResponse=cs.some(c=>vocab.response.test(c)&&((vocab.receiver.test(c))||/(回信|邮件|反馈)(?:中|里|说|写)/.test(c)||context&&/^(?:后来|之后|当时)?(?:回(?:我|信|复)|说)/.test(c)));
 const pending=cs.some(c=>vocab.pending.test(c));
 const broad=cs.some(c=>asserted(c,vocab.broad)&&!/(?:不代表|不能说明|不等于|不是|并非|不能确认|不认为|没有证据).{0,18}(?:信任|妥善|全部|所有|到账|退款|解决)/.test(c));
 if(!t)return {code:'missing'};
 if(/^(?:附件|补发|回复|打开|课程|通知|图表)(?:[ ,，]+(?:附件|补发|回复|打开|课程|通知|图表)){2,}$/.test(text.trim()))return {code:'clarify'};
 if(vocab.unrelated.test(t)&&!object&&!topic&&!chart&&!hasResponse)return {code:'unrelated'};
 if(role===0){
  if(caseId==='attachment'&&cs.some(c=>vocab.file.test(c)&&vocab.fileProblem.test(c)))return {code:'clear'};
  if(caseId==='schedule'&&topic&&vocab.change.test(t)&&(vocab.time.test(t)||/改期/.test(t)))return {code:'clear'};
  if(caseId==='chart'&&chart&&/整理|需要|复盘|汇总|制作|统计/.test(t))return {code:'clear'};
  if((caseId==='attachment'&&/款项|退款|两万|资金/.test(t)&&!object)||(caseId==='attachment'&&topic&&vocab.change.test(t)&&!object))return {code:'other-scope'};
  return {code:'clarify'};
 }
 if(role===1){
  const re=caseId==='attachment'?vocab.fileAction:caseId==='chart'?vocab.chartAction: /改(?:为|成|到|了)|调(?:整|到|成)|挪(?:到|了)|更新|同步|修改|补发|发(?:了|出|送|给)|通知|加(?:了|上)/;
  // Resolve an omitted object only from a clear preceding background, never the case title.
  const anaphor=context&&/(?:旧的|新的|新版|那份|这份|它|再发|又.{0,5}发|重发|补发)/.test(t);
  const relevant=caseId==='attachment'?(object||anaphor):caseId==='chart'?chart:/页面|课程页|通知|20:00|19:30|时间/.test(t);
  // Require a predicate plus an object/context. Bare lists and other people's quoted work do not count.
  const ownClauses=cs.map(c=>c.replace(/[“「"][^”」"]*[”」"]/g,''));
  const assertion=ownClauses.some(c=>asserted(c,re)&&(/我|本人|林见|把|将|已|了|给|为|成|到|后|再|并|补发|重发|替换|整理|更新|修改|绘制/.test(c)));
  const selfOwned=ownClauses.some(c=>c.split(/[，,]/).some(part=>asserted(part,re)&&/(?:我|本人|林见)(?:负责|检查|把|将|已|重新|补|重|替|更|整|做|发|给|向|在|完成|来)/.test(part)&&!/(?:不是|并非)(?:我|本人|林见)/.test(part)));
  // A recipient after “给” is not the subject performing the work.
  const otherOnly=ownClauses.some(c=>c.split(/[，,]/).some(part=>/^(?:(?:图表|附件|课件|通知|页面)(?:是|由))?(?:后来|随后|然后)?(?:是|由)?(?:小雨|周衡|同事|客服|老师|罗青|罗女士|用户|学员|对方|他|她)(?:把|将|已|重新|负责|替|补|重|更|整|做|发|上传)/.test(part)&&asserted(part,re)))&&!selfOwned;
  if(otherOnly&&assertion)return {code:'other-actor'};
  if(quote&&!assertion)return {code:'quoted-action'};
  if(!assertion&&cs.some(c=>re.test(c)&&/没|未|不曾|并非|不是/.test(c)))return {code:'not-done'};
  if(!assertion&&cs.some(c=>re.test(c)&&/打算|计划|准备|应该|需要/.test(c)))return {code:'planned'};
  if(assertion&&(relevant||(context&&/(?:我|本人)(?:把|将|已|重新|补|重发|换|发|寄|传)/.test(t)))){
   if(caseId==='schedule'&&/(?:改为|改成|改到|更新为|通知.{0,5})19:30/.test(t)&&!/(?:原来|之前|旧|从)19:30.{0,12}20:00/.test(t))return {code:'time-check'};
   return {code:'clear'};
  }
  return {code:'clarify'};
 }
 if(broad)return {code:attributed?'attributed':'scope',broad:true};
 if(caseId==='attachment'){
  const positive=cs.some(c=>asserted(c,vocab.fileResult)||(/收到/.test(c)&&vocab.file.test(c))||/(?:谢谢|感谢|致谢|道(?:了)?谢)/.test(c));
  const negative=cs.some(c=>/仍(?:然)?|还是|依旧/.test(c)&&vocab.fileProblem.test(c));
  if(positive&&negative)return {code:'conflict'};
  if(pending)return {code:'pending'};
  if(negative&&hasResponse)return {code:'time-check-result'};
  if(positive&&hasResponse)return {code:'clear'};
  if(positive)return {code:'response-source'};
 }
 if(caseId==='schedule'){
  if(pending)return {code:'pending'};
  if(hasResponse&&/没(?:有)?问题|无误|正确|没错|一致|对上了|可以|收到|已更新|不再|没改错/.test(t))return {code:'clear'};
  if(/没(?:有)?问题|无误|正常/.test(t))return {code:'response-source'};
 }
 if(caseId==='chart'){
  if(pending)return {code:'pending'};
  if(hasResponse&&/清楚|可用|收到|已交|交付|认可|看过|做得|确认/.test(t))return {code:'clear'};
  if(/交付|已交|完成/.test(t))return {code:'response-source'};
 }
 return {code:'clarify'};
}
function explain(code,i){
 const common={missing:'这一栏还没有正文。',unrelated:'这一栏写的是日常生活，尚未说明所选工作中的情况。','other-scope':'这一栏转到了另一件事项；请说明它与本次工作是什么关系，或换成你确实参与的工作。','other-actor':'写出了其他人的动作，但还没说明你本人承担了哪一步。','quoted-action':'引用材料中的动作不等于本人经办；请区分原文和自己的实际工作。','not-done':'你否认做过这一步。可以保留这个说明，但还需要写出自己实际做过的部分，或另选工作。',planned:'这里写的是计划或打算，尚未说明已经发生的操作。','time-check':'这里的调整时间需要与通知要求核对；请区分旧时间和本次生效时间。','time-check-result':'回复描述与这段历史往来的时点需要核对；如果引用较晚的回复，请说明日期和出处。',conflict:'同一栏同时保留了相反的结果，却没有区分时点或明确撤回哪种说法。',scope:'结果超出了前面所述工作。请说明这一判断来自谁、哪份材料；也可以写明自己尚未确认的范围。',attributed:'已区分引用结论及来源；引用已记录，不等于结果经过独立核实。',pending:'已明确结果尚待确认，可以保留；不必编造成功反馈。','response-source':'写出了结果，但还缺是谁、通过什么回复确认的；如没有确认，可直接说明。'};
 if(common[code])return common[code];
 if(code==='clear')return ['已说清所选工作发生的情况。','已说清你本人完成的具体动作。','已说清反馈者与当时的回应。'][i];
 return ['还不能确定需要处理的是什么问题。请写清对象和遇到的情况。','还不能确定你的实际操作。请写清做了什么、处理或交给了什么对象。','还不能确定当时收到什么回应。请说明反馈者和内容，或明确尚未收到确认。'][i];
}
function evaluate({text,caseId}={}){
 const p=parse(text||'');caseId=caseId||infer(text||'');if(!references[caseId])return null;
 const fields=p?.fields||Array(3).fill(String(text||'').replace(/^.*(?:资料来源|案例名称)[:：].*$/gm,''));
 const background=proof(fields[0],caseId,0,false);
 const checks=fields.map((value,i)=>{const result=i===0?background:proof(value,caseId,i,background.code==='clear');const code=result.code,okay=['clear','pending','attributed'].includes(code);return {index:i,label:labels[i],code,status:okay?'ok':code==='missing'?'missing':code==='clarify'?'uncertain':'needs-detail',reason:explain(code,i),source:references[caseId][i],excerpt:value.slice(0,180),broad:!!result.broad};});
 const needs=checks.filter(x=>x.status!=='ok').map(x=>x.index),usable=!needs.length;
 const hasContent=fields.some(t=>t.trim());
 const kind=!hasContent?'empty':checks[2].broad?'broad':!usable?'unclear':checks[2].code==='pending'?'limited':{attachment:'own',schedule:'ordinary',chart:'routine'}[caseId];
 return {readerVersion:1,caseId,structured:!!p,fields:checks,needs,usable,kind};
}
function message(review){const good=review.fields.filter(f=>f.status==='ok').map(f=>f.label),bad=review.fields.filter(f=>f.status!=='ok');return (bad.length?`稿件已收到。${good.length?'“'+good.join('、')+'”已说清，保留即可。':''}需要补充的是“${bad.map(f=>f.label).join('、')}”。`:'这份个人工作案例的经过和表述已说清，可以使用。')+'\n\n'+review.fields.map(f=>`【${f.label}】${f.reason}${f.status==='ok'?'':'\n可查：'+f.source[2]+'。'}`).join('\n\n')+'\n\n这是对本次已发稿的反馈；改本机草稿不会更新我收到的版本。';}
root.ReportReview={evaluate,parse,infer,message,labels,references};
})(globalThis);
