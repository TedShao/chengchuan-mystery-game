/* Narrative transitions consume delivered snapshots. Never called by reading or editing. */
(function(root){
'use strict';
const nodes={
 own:{title:'准备讲自己的工作',line:'这段工作可以由你说明。我把你列为明天的备选讲解人；是否主讲、是否引用个人稿，仍由你另外答复。先看看小雨准备展示的版本。',task:'核对培训引用，决定是否讲解',route:'training'},
 pending:{title:'保留未确认，先核对原回复',line:'你把结果留成待确认，我不要求你补成成功案例。今天先以核对记录的身份参与：可以向经办人核对当时的回复，也可以保留待确认，先看培训材料。',task:'向经办人询问，或带着未确认继续',route:'verify'},
 colleague:{title:'先核清经办分工',line:'你说这一步由同事处理，和原记录中的经办人对不上。我不会替你改成“本人完成”。你可以把这段说法发给经办人核对；在澄清前，这个案例暂不由你讲解，先旁听材料准备。',task:'向同事核对你实际发出的分工说法',route:'verify'},
 planned:{title:'先回看已经发生的工作',line:'你写的是准备做的事。今天不安排你讲这段经历；先旁听培训准备，对照自己的工作记录。如果确实记不清，可以保持这份说明，不必为了交稿编成完成。',task:'旁听材料准备，回看旧记录',route:'observe'},
 overclaim:{title:'结论较大，保留为待核候选',line:'你把结果说得比较完整，我先留作候选，不据此确认用户问题已经解决。明天若要引用这段结论，需要你说明依据。也可以暂不授权引用，先和小雨核对展示材料。',task:'核对候选案例的引用范围',route:'training'},
 mismatch:{title:'安排一次通知核对',line:'你写出的时间和原通知要求不一致。今天先别替其他人发新的通知，先核对这次归档的课程页。原稿保留；你可以说明是记错、执行有偏差，或暂时无法确认。',task:'向小雨核对归档通知',route:'verify'},
 observe:{title:'转为旁听与材料核对',line:'这份内容暂时不足以作个人经历，但今天不必卡在反复填表上。你先旁听小雨准备培训，看看她如何描述你经手的工作；要不要补稿，等你核对后再决定。',task:'先看培训待用稿，不强制重交',route:'observe'},
 suspended:{title:'暂停本次汇报与讲解安排',line:'我已经具体指出过相同的问题，你仍连续把它作为新稿发来。我现在无法信任这份汇报，暂停你的讲解与个人稿引用。你可以明确申请补充核对；若保持现状结束本章，这次转正考核将暂缓。',task:'申请补充核对，或接受本章的考核后果',route:'suspended'}
};
function classify(assessment){
 const fields=assessment?.fields||[],codes=fields.map(x=>x.code);
 if(codes.includes('unrelated'))return 'observe';
 if(codes.includes('scope')||codes.includes('attributed')||fields.some(x=>x.code==='response-source'&&/所以|认为|判断/.test(x.excerpt)))return 'overclaim';
 if(codes.includes('other-actor'))return 'colleague';
 if(codes.includes('planned')||codes.includes('not-done'))return 'planned';
 if(codes.some(x=>x.startsWith('time-check')))return 'mismatch';
 if(assessment?.usable)return codes.includes('pending')?'pending':'own';
 return 'observe';
}
function advance(previous,event){
 const p=structuredClone(previous||{version:0,history:[],ignored:0,issues:[],relationship:'neutral'});
 if(event.version<=p.version)return p;
 const fields=event.assessment?.fields||[],issues=fields.filter(x=>['unrelated','scope','time-check','time-check-result','conflict'].includes(x.code)||x.code==='response-source'&&/所以|认为|判断/.test(x.excerpt)).map(x=>x.index+':'+x.code);
 const repeated=issues.length>0&&p.issues?.length>0&&p.issues.every(x=>issues.includes(x))&&event.previousReviewed===p.version;
 p.ignored=repeated?(p.ignored||0)+1:0;
 const repaired=p.relationship==='strained'||p.relationship==='warning'||p.relationship==='recovering';
 let key=classify(event.assessment);
 if(p.relationship==='suspended'&&!p.recoveryRequested||p.ignored>=3)key='suspended';
 p.relationship=key==='suspended'?'suspended':p.ignored>=2?'warning':p.ignored>=1?'strained':repaired?'cautious':'working';
 const node=nodes[key];let line=node.line;
 if(key==='pending'&&event.assessment?.caseId==='chart')line='图表是我收的，5 月 12 日那封“下阶段的工作方向”开头回过你：图表整理得清楚。你可能没把那封信当作交付反馈，可以回去对一下。这里只确认图表，不替案例文字下结论。今天这份先按你写的待确认留档；你可以核对后补稿，也可以先看小雨准备的培训材料。';
 if(p.ignored===1&&key!=='suspended')line='上次指出的同一问题仍在。我需要你回应具体内容，而不是只换一种说法再交。\n\n'+line;
 if(p.ignored===2&&key!=='suspended')line='这是第三次收到同样的未核实内容。再继续这样提交，我会暂停汇报并交人事记录为转正待复核。你可以先不交，去核对或说明记不清。\n\n'+line;
 if(repaired&&['own','pending'].includes(key))line='这次你调整了说明，我会按新版继续核对。之前的往来仍留档，信任需要靠后续工作恢复。\n\n'+line;
 p.version=event.version;p.key=key;p.title=node.title;p.task=node.task;p.route=node.route;p.line=line;p.caseId=event.assessment?.caseId;p.issues=issues;p.recoveryRequested=false;
 p.history.push({version:p.version,key,relationship:p.relationship,ignored:p.ignored});
 return p;
}
root.ReportPaths={nodes,classify,advance};
})(globalThis);
