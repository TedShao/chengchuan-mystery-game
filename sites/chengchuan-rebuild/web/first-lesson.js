/* Operation tutorial only. Its checkpoints never deliver messages or change story decisions. */
window.installFirstLesson=function(api){
'use strict';
const {state:s,form:f,selected,docId,body,parse,openApp,save,closeModal,reportAssessment,beginRevision,showReviewSource}=api;
const $=q=>document.querySelector(q);
const t=f.lesson??={begun:false,done:false,sources:{},fields:{}};
t.sources??={};t.fields??={};
const root=document.createElement('div');root.id='first-lesson';root.hidden=true;
root.innerHTML='<div class="lesson-spot" aria-hidden="true"></div><div class="lesson-pointer" aria-hidden="true">↙<i></i></div><section class="lesson-card" role="region" aria-label="第一章操作教学"><div class="lesson-copy" aria-live="polite"></div><div class="lesson-actions"></div></section>';
document.body.append(root);
const spot=root.querySelector('.lesson-spot'),pointer=root.querySelector('.lesson-pointer'),card=root.querySelector('.lesson-card');
let scheduled=false,lastId='',lastMarkup='',current=null,placed=null;
const active=app=>$(`[data-window="${app}"].active:not(.minimized)`);
const fieldNames=['工作背景','本人完成的工作','结果'];
function checkpoint(){
 const c=selected(),report=s.case.report;
 if(!t.begun)return {id:'welcome',n:0,title:'接下来，走一遍真正的交稿。',text:'人物和工作来由已回顾完。现在选一件经历、查原件、整理并发送给周衡。刚才的课程改期也可以选；这一轮发送才会影响今天的安排。',action:'begin',label:'开始带我操作',target:'.shift-brief'};
 if(!f.orientation?.done&&!report)return {id:'orientation-'+(f.orientation?.step||0),n:0,title:'先了解工作，再作判断。',text:'读完这一段可以打开原件看看，再点“继续了解”。回来后会保留回顾进度，不会重新发邮件。',target:'.shift-orientation [data-shift="orient-next"]'};
 if(report&&(t.revisingVersion!==s.case.reportVersion||$('#modal-root [data-report-receipt]'))){
  const reviewed=s.workdays.reviews[s.case.reportVersion]?.status==='reviewed';
  if(active('mail')&&s.selectedMail==='review-'+s.case.reportVersion){
   const assessment=reportAssessment(),usable=assessment?.usable??s.workdays.reviews[s.case.reportVersion]?.usable;const needs=assessment?.needs||[];
   const path=s.workdays.reviews[s.case.reportVersion]?.path||{title:'已有汇报与原回信保留，你可以继续查看培训材料'};if(path)return {id:'reply',n:8,title:'你的说明带来了新的安排。',text:path.title+'。第一次交稿已经完成，不必选成唯一答案才能继续。可以查看这次安排，也能按核对建议改口。',action:'finish-route',label:'完成操作教学，查看本次安排',target:'[data-window="mail"] .mail-content',complete:true};
   return {id:'reply',n:8,title:'这才是收件人的反馈。',text:usable?'你已经走完一次真正的交稿。之后修改正文仍只是本机草稿，要再次确认发送，对方才会收到新版。接下来可以读小雨的培训来信。':assessment?'需要补充：'+needs.map(i=>fieldNames[i]).join('、')+'。逐栏反馈会说明原因，并提供对应材料入口。已经说清的栏目可以保留。':'周衡收到了，但还需要补充具体工作。返回修改后，再预览发送修订版。',action:usable?'finish-training':'revise',label:usable?'完成教学，打开培训来信':'定位第一处待补充',target:assessment&&!usable?'[data-window="mail"] .report-review':'[data-window="mail"] .mail-content',complete:true};
  }
  if($('#modal-root [data-report-receipt]'))return {id:'receipt',n:7,title:'已送达，看看周衡怎么回。',text:reviewed?'这是刚才发送的内容快照。点击“周衡的反馈”打开实际回信，不要把保存提示当作提交结果。':'回执已经生成，周衡正在阅读。等待回复时不会重发；读完后，这里的反馈入口会亮起。',target:reviewed?'#modal-root [data-open="mail"]':'#modal-root [data-report-receipt]',wait:!reviewed};
  return {id:'open-reply',n:7,title:reviewed?'周衡回信了。':'稿件已送达。',text:reviewed?'打开回信，看看对方实际收到什么、是否还需要补充。':'已发送的版本已经留档，正在等待周衡阅读。',target:reviewed?'[data-window="start"] .shift-after-actions [data-open="mail"]':'[data-window="start"] .shift-aftermath',wait:!reviewed};
 }
 if(!c||f.choosing)return {id:'choose',n:1,title:'点一件你亲手做过的工作。',text:'三件都能作为个人稿。点击任意“用这件事写”，会建立一份新草稿；“先看材料”可以先浏览，之后仍能回来选择。',target:'.shift-cases [data-shift="choose"]',multi:true};
 if(!t.sources[c.id]){
  const inSource=c.app==='mail'?active('mail')&&s.selectedMail===c.source:active('doc')&&s.doc===c.source;
  if(inSource){
   const detail=$('[data-window="mail"] .app-content details');
   if(c.app==='mail'&&detail&&!detail.open)return {id:'history-'+c.id,n:2,title:'旧邮件收在这条线程下面。',text:'点击“历史邮件”展开往来。每封邮件有自己的日期和发件人；你可以向下滚动读完，教学不会替你挑结论。',target:'[data-window="mail"] .app-content details summary'};
   return {id:'read-'+c.id,n:2,title:'先读原件，再写自己的话。',text:'你正在看完整材料。可以滚动查看日期、前后回复和附件。读完后回到个人稿，按自己理解填写。',target:c.app==='mail'?'[data-window="mail"] .app-content':'[data-window="doc"] .document-paper',action:'source-done',label:'我看过了，回到个人稿'};
  }
  return {id:'source-'+c.id,n:2,title:'先打开这件工作的原始材料。',text:'点击箭头指向的入口，去邮箱或文字软件看完整原件。工作台只是方便并排阅读，原来的文件和往来仍然可以自由打开。',target:'.shift-source .shift-pane-title [data-open]'};
 }
 if(f.reviewSource&&f.revision){const x=reportAssessment(f.reviewSource.version)?.fields[f.reviewSource.index];if(x&&active(x.source[0]))return {id:'revision-source',n:2,title:'核对这一栏对应的原材料。',text:x.source[2]+'。请自己比较日期、经办人和表述范围；原文不会自动写入你的稿件。',target:'.review-source-return',action:'revision-back',label:'回到这一栏继续写'};}
 const values=parse(body()),checks=t.fields[docId()]??=[];
 if(values){
  const i=t.focusField!==undefined&&(!values[t.focusField]?.trim()||!checks[t.focusField])?t.focusField:values.findIndex((v,i)=>!v.trim()||!checks[i]);
  if(i!==-1){const issue=f.revision?.docId===docId()?reportAssessment(f.revision.version)?.fields[i]:null;return {id:'field-'+docId()+'-'+i,n:3+i,field:i,title:['先整理：发生了什么？','接着整理：你实际做了什么？','最后整理：当时得到什么回应？'][i],text:issue&&issue.status!=='ok'?issue.reason+' 可查：'+issue.source[2]+'。改完可以点栏目下的“检查修改”，只检查本机草稿。':['在亮起的栏目选择或写出这件事的背景。选择后会显示完整正文；没有合适选项可切换自由改写。','选择或写出你本人实际做过的动作，不需要概括整个项目。确认后点“这一项整理好了”。','选择或写出当时能确认的回应，也可以保留待确认。教学不替你判断内容是否准确。'][i],target:(f.inputMode==='free'?'[data-shift-field="':'[data-shift-choice="')+i+'"]',action:'field-done',label:'这一项整理好了 →',disabled:!values[i].trim(),issue:!!issue};}
 }else if(!body().trim())return {id:'free',n:3,title:'在你的正文里写下这件工作。',text:'自由正文仍然是个人草稿。先写下自己的经历，再预览发送。',target:'[data-shift-free]'};
 if($('#modal-root [data-action="submit-report"]'))return {id:'confirm',n:6,title:'预览还没发送，最后由你确认。',text:'先核对收件人是周衡、正文是你想发的版本。确认无误，点击亮起的发送按钮；想修改可以返回编辑。',target:'#modal-root [data-action="submit-report"]'};
 return {id:'preview',n:6,title:'草稿已保存，现在看发送预览。',text:'点“预览并发送”。下一页会展示实际正文和收件人，不会一点击就发出。',target:'[data-shift-preview]'};
}
function markup(step,away){
 const progress=Math.min(100,Math.round(step.n/8*100));
 return `<header><span>第一章 · 操作教学 ${step.n?step.n+' / 8':''}</span><button data-lesson="pause" aria-label="暂停动态教学">稍后再学 ×</button></header><div class="lesson-progress"><i style="width:${progress}%"></i></div><h2>${away?'你可以自由探索，教学在这里等你。':step.title}</h2><p>${away?'当前教学位置已保留。想接着走时，回到工作台；不会自动发送或改动你的稿件。':step.text}</p>`;
}
function visibleTarget(step){
 let el=$(step.target);
 if(!el||!el.getClientRects().length)return null;
 const win=el.closest('[data-window]');
 if(win&&!win.classList.contains('active'))return null;
 if($('#modal-root .modal')&&!el.closest('#modal-root'))return null;
 return el;
}
function paint(){
 scheduled=false;
 const showing=s.started&&s.workdays.day===1&&f.orientation?.done&&f.guide&&!t.done&&!document.body.classList.contains('prologue-open');
 root.hidden=!showing;document.body.classList.toggle('lesson-active',showing);
 if(!showing){placed=null;lastId='';return;}
 const step=checkpoint();current=step;
 // Unrelated dialogs retain their own focus and instructions; the lesson resumes after closing.
 if($('#modal-root .modal')&&!$('#modal-root [data-action="submit-report"],#modal-root [data-report-receipt]')){root.hidden=true;document.body.classList.remove('lesson-active');return;}
 const target=visibleTarget(step),away=!target;
 const html=markup(step,away);
 if(html!==lastMarkup){root.querySelector('.lesson-copy').innerHTML=html;lastMarkup=html;card.classList.remove('lesson-arrive');void card.offsetWidth;card.classList.add('lesson-arrive');}
 const actions=away?'<button class="lesson-primary" data-lesson="return">返回当前教学</button>':`${step.action?`<button class="lesson-primary" data-lesson="${step.action}" ${step.disabled?'disabled':''}>${step.label}</button>`:''}${step.complete?'<button data-lesson="finish">结束教学，自由探索</button>':''}<small>${step.wait?'等待实际回复…':step.action?'操作后才会进入下一步':'请操作亮起的真实控件 ↑'}</small>`;
 const footer=root.querySelector('.lesson-actions');if(footer.innerHTML!==actions)footer.innerHTML=actions;
 root.dataset.step=step.id;
 const changed=step.id!==lastId;
 if(changed){lastId=step.id;
  if(target){target.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});if(step.field!==undefined)target.focus({preventScroll:true});}
 }
 place(target,step,changed);
}
function place(target,step,allowScroll=false){
 const mobile=innerWidth<750,margin=mobile?12:20,cardWidth=Math.min(350,innerWidth-2*margin);
 card.style.width=cardWidth+'px';card.style.left=(innerWidth-cardWidth-margin)+'px';card.style.top='auto';card.style.bottom=(mobile?86:20)+'px';
 spot.hidden=!target;pointer.hidden=!target||step.wait;
 if(!target){placed=null;return;}
 let r=target.getBoundingClientRect(),height=card.getBoundingClientRect().height;
 // Keep the coach beside the real control when possible; otherwise reserve space above it.
 if(step.multi&&!mobile){card.style.top=Math.max(60,r.top-height-30)+'px';card.style.bottom='auto';}
 else if(!mobile&&r.left-cardWidth-margin>100){card.style.left=(r.left-cardWidth-20)+'px';card.style.top=Math.max(60,Math.min(r.top,innerHeight-height-20))+'px';card.style.bottom='auto';}
 else if(!mobile&&r.right+cardWidth+margin<innerWidth){card.style.left=(r.right+20)+'px';card.style.top=Math.max(60,Math.min(r.top,innerHeight-height-20))+'px';card.style.bottom='auto';}
 else {
  let cr=card.getBoundingClientRect();
  if(r.bottom>cr.top-20&&r.top<cr.bottom&&r.right>cr.left&&r.left<cr.right){
   const scroller=target.closest('.app-content,.office-workarea,.app-body,.modal');
   if(allowScroll&&scroller&&scroller!==target){const delta=r.bottom-(cr.top-24);if(delta>0)scroller.scrollTop+=delta;r=target.getBoundingClientRect();}
   if(!mobile&&r.bottom>cr.top-12){card.style.top='60px';card.style.bottom='auto';}
  }
 }
 // Clip the focus hole to the visible app or modal instead of highlighting off-screen content.
 const clip=target.closest('.app-content,.office-workarea,.app-body,.modal')?.getBoundingClientRect();
 const x=Math.max(8,r.left-7),y=Math.max(52,clip?.top??0,r.top-7);
 const right=Math.min(innerWidth-8,r.right+7),bottom=Math.min(innerHeight-(mobile?77:8),clip?.bottom??innerHeight,r.bottom+7);
 if(right<=x||bottom<=y){spot.hidden=true;pointer.hidden=true;placed=null;return;}
 Object.assign(spot.style,{left:x+'px',top:y+'px',width:(right-x)+'px',height:(bottom-y)+'px'});
 let px=step.multi?x+30:Math.min(right-16,x+28),py=Math.max(y+8,Math.min(bottom-12,y+16));
 Object.assign(pointer.style,{left:px+'px',top:py+'px'});
 placed={x,y,width:right-x,height:bottom-y};
}
function sync(){if(scheduled)return;scheduled=true;requestAnimationFrame(paint);}
function resume(){
 const step=checkpoint();
 if(step.id.startsWith('history-')||step.id.startsWith('read-')){const c=selected();openApp(c.app,c.source);}else{closeModal();openApp('start');}
 sync();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-lesson]');if(!b){sync();return;}
 const action=b.dataset.lesson;
 if(action==='pause')f.guide=false;
 if(action==='begin')t.begun=true;
 if(action==='return')resume();
 if(action==='source-done'){const c=selected();if(c)t.sources[c.id]=true;openApp('start');}
 if(action==='field-done'&&current?.field!==undefined){const values=parse(body()),i=current.field;if(values?.[i]?.trim()){(t.fields[docId()]??=[])[i]=true;delete t.focusField;}}
 if(action==='revise'){const a=reportAssessment();if(a)beginRevision(a.needs[0]??0);else{t.fields[docId()]=[];t.revisingVersion=s.case.reportVersion;closeModal();openApp('start');}}
 if(action==='revision-back'){const index=f.reviewSource.index;f.reviewSource=null;openApp('start');document.querySelector('[data-shift-field="'+index+'"],[data-shift-choice="'+index+'"]')?.focus();}
 if(action==='finish-route'){t.done=true;f.guide=false;openApp('browser','report.chengchuan.example');}
 if(action==='finish'||action==='finish-training'){t.done=true;f.guide=false;if(action==='finish-training')openApp('mail','training');}
 save();sync();
});
// Revise mode uses the same writing steps while preserving the delivered report.

// Events update the overlay; CSS alone animates the pointer and pulse.
document.addEventListener('input',sync);document.addEventListener('focusout',sync);document.addEventListener('toggle',sync,true);
document.addEventListener('scroll',()=>{if(!root.hidden&&current)place(visibleTarget(current),current);},true);
window.addEventListener('resize',sync);
const observer=new MutationObserver(sync);observer.observe($('#windows'),{childList:true,subtree:true});observer.observe($('#modal-root'),{childList:true,subtree:true});
return {sync,restart(){t.done=false;t.begun=true;f.guide=true;sync();},snapshot:()=>({step:root.hidden?null:current?.id,active:!root.hidden,done:t.done,focus:placed})};
};
