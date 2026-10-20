/* Small alternative opening. Source reading never delivers information.
   Only a confirmed outgoing reply changes recipients or correspondence. */
(()=>{'use strict';
const KEY='chengchuan-rebuild-v1',D=window.CaseData,$=q=>document.querySelector(q);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initial=()=>({version:1,started:false,app:'mail',mail:'draft',file:'summary',person:'xiaoyu',clips:[],read:[],readMail:[],historyOpen:false,sends:[],known:{xiaoyu:[],zhou:[],tang:[]},questions:{},conversation:[],selected:[],pending:null,followup:false,note:'',coffee:0,sort:false,filter:'',board:'',draftText:'',slide:0});
let s;try{s=JSON.parse(localStorage.getItem(KEY))?.openingTrial;}catch{}if(s?.version!==1)s=initial();
s.read??=[];s.readMail??=[];s.questions??={};
function reviewState(){return s.review??={draft:{quote:false,pending:false,count:3},rounds:[],events:[],selected:null};}
let storageIssue=false;
const save=()=>{try{const base=JSON.parse(localStorage.getItem(KEY)||'{}');base.openingTrial=s;localStorage.setItem(KEY,JSON.stringify(base));storageIssue=false;}catch{storageIssue=true;}};
const original=D.mails.find(m=>m.id==='luo');
const sources={
 thanks:{title:'4 月 7 日 · 罗青的回信',app:'mail',detail:'archive',quote:original.history[2][2]},
 recent:{title:'5 月 12 日 · 罗青的新信',app:'mail',detail:'recent',quote:original.body},
 summary:{title:'5 月 11 日 · 共享复盘',app:'files',detail:'summary',quote:D.summary},
 transfer:{title:'服务表 · C-0509-12',app:'sheet',detail:'current',quote:'05-09｜申请转回款项，询问进度\n状态：已处理\n处理记录：05-10 转平台，接收确认\n用户回访：—'},
 scope:{title:'项目目录 · 知禾国内服务',app:'files',detail:'scope',quote:'委托方：知禾在线服务有限公司\n承接方：澄川网络科技有限公司\n基础服务：课程页面、通知、资料支持。\n持续协作：介绍平台联系人、登记及转交用户问题。\n国内经办：何小雨；项目对接：沈念；业务确认：陆承。\n项目侧归档：境外项目服务。'}
};
const people={xiaoyu:{name:'何小雨',role:'隔壁工位 · 用户运营'},zhou:{name:'周衡',role:'项目主管'},tang:{name:'唐婧',role:'财务协作'}};
const btn=(id,text,attrs='')=>`<button data-do="${id}" ${attrs}>${text}</button>`;
const open=(app,detail,label)=>btn('open',label,`data-app="${app}" data-detail="${detail}"`);
const clip=id=>btn('clip',s.clips.includes(id)?'已放到便签 ✓':'摘录到便签',`data-id="${id}" ${s.clips.includes(id)?'disabled':''}`);
const latest=()=>s.sends.at(-1);
function mark(id){if(!s.read.includes(id))s.read.push(id);}
function show(app,detail){
 s.app=app;if(app==='mail'&&detail)s.mail=detail;if(app==='files'&&detail)s.file=detail;if(app==='chat'&&detail){s.person=detail;s.recalled=false;}
 if(detail==='archive'){s.historyOpen=true;if(app==='mail')mark('recent');}
 const key=app==='mail'?(s.mail==='archive'?'thanks':s.mail==='recent'?'recent':null):app==='files'?s.file:app==='sheet'?'transfer':null;
 if(sources[key]||key==='training')mark(key);if(app==='mail'&&!s.readMail.includes(s.mail))s.readMail.push(s.mail);
 save();render();window.scrollTo(0,0);
}
function sentOutside(){return s.sends.some(x=>x.delivered);}
function correctedCase(){return s.sends.some(x=>x.choice==='retract'||(x.choice==='narrow'&&s.known.xiaoyu.includes('thanks')));}
function sourceReply(){return '罗女士您好，4 月 7 日补发的课程附件已确认可以打开。您询问的转回进度，我们还没有收到结果，正在向项目联系人询问。';}
function internalPending(){return !!s.internalMail||s.sends.some(x=>['decline','paid','ask','narrow','retract','scopeAsk'].includes(x.choice));}
function paper(title,meta,body,extra=''){return `<article class="paper"><div class="paper-meta">${esc(meta)}</div><h2>${esc(title)}</h2><div class="prose">${esc(body)}</div>${extra}</article>`;}
function start(){return `<section class="arrival"><span class="overline">星期一 / 入职第 47 天</span><h1>那句谢谢</h1><p>你叫林见，在澄川做课程运营。<br>待业三个月后，这是唯一录用你的公司。</p><p>今天要交转正汇报。<br>你刚坐下，小雨就把一封邮件推了过来。</p>${btn('start','打开小雨的邮件 →','class="primary"')}<small>虚构故事 · 约十分钟的开场试做<br>没有倒计时。原办公存档保留。</small><a href="./">返回原工作空间</a></section>`;}
function draft(){const last=latest();return paper('罗青这封，帮我看一句','何小雨 → 林见 · 05-15 09:07',
'罗青又打来问上周那件事。我正回她，引用了你补课件的经过。\n你看这段能不能用？下午的转正稿先不急。',
`<div class="attachment"><span>${s.sends.length?'最初拟稿 · '+(sentOutside()?'曾发出，后续往来保留':'仍未发出'):'待发给罗青 · 尚未发送'}</span><p>罗女士您好，您前期反馈的问题均已处理。课程资料由林见补发，您随后回复：<q>谢谢你们，来回麻烦了。</q></p><p>后续如有问题，请继续联系课程客服。</p><small>澄川 · 知禾课程服务</small></div><p class="margin-note">小雨附了引用来源：${open('files','summary','阶段复盘_0511.docx')}</p><div class="reply-actions">${btn('choose','可以，照这版回','data-choice="approve"')}${btn('choose','先别发，我翻一下原邮件','data-choice="hold"')}${btn('choose','我不确认这封回复','data-choice="decline"')}</div>${last?`<p class="receipt">你上次回复：${esc(last.label)}。${open('mail','receipt','查看往来')}</p>`:''}<details class="procedure"><summary>我在这里要做什么？</summary><p>小雨在等你是否认可这段回复。可以先看她附的文档，也可以去邮箱找旧信。底栏能切换软件；便签里可以带着摘录回复。没有限时。</p></details>`);}
function mailbox(){
 const items=[['draft','何小雨 · 09:07','罗青这封，帮我看一句'],['recent','罗青 · 周五 19:42','Re: 4 月 6 日课程资料打不开']];
 for(const r of s.sends){items.unshift(['receipt:'+r.id,r.from,'Re: '+r.label]);if(r.customer)items.unshift(['customer:'+r.id,'罗青 · 新回复','Re: 您的服务事项']);}
 for(const r of reviewState().events)items.unshift(['review:'+r.id,r.from,r.title]);
 if(internalPending())items.unshift(['next','周衡 · 抄送林见','下午交知禾的版本']);
 const current=s.mail==='receipt'?'receipt:'+latest()?.id:s.mail;
 const unread=items.filter(([id])=>(id==='next'||id.startsWith('customer:')||id.startsWith('review:'))&&!s.readMail.includes(id));
 let content=s.mail==='draft'?draft():s.mail==='recent'||s.mail==='archive'?paper(original.subject,'罗青 → 林见 · 05-12 19:42 · 无抄送',original.body,
 `${clip('recent')}${reviewState().rounds.length?open('mail','review:'+reviewState().rounds.at(-1).event,'回到最近的审阅回复'):''}<div class="history-toggle">${btn('history',s.historyOpen?'收起之前的 3 封往来':'展开之前的 3 封往来 ↓','aria-expanded="'+s.historyOpen+'"')}</div>${s.historyOpen?original.history.map(([date,who,text],i)=>paper(date,who,text,i===2?clip('thanks'):'')).join(''):''}`):s.mail==='next'?nextMail():s.mail.startsWith('review:')?reviewMail():s.mail.startsWith('customer:')?customerMail():receipt();
 return `<div class="split"><nav class="list">${items.map(([id,from,title])=>btn('open',`<small>${esc(from)}${unread.some(x=>x[0]===id)?' · 未读':''}</small><strong>${esc(title)}</strong>`,`data-app="mail" data-detail="${id}" class="${current===id?'selected':''}"`)).join('')}</nav><section class="reading">${unread.length?`<aside class="incoming" aria-live="polite">${unread.map(([id,from,title])=>open('mail',id,esc(from+'：'+title))).join('')}</aside>`:''}${content}</section></div>`;
}
function customerMail(){const r=s.sends.find(x=>x.id===Number(s.mail.slice(9)));return paper('Re: 您的服务事项','罗青 → 课程服务邮箱；何小雨转发给林见',r?.customer||'这封往来已留档。',`${open('mail','recent','查找之前的来信')}${open('mail','receipt:'+r?.id,'小雨当时发了什么')}${open('notes','','打开便签')}`);}
const options={
 approve:{label:'可以，照这版回',text:'这段可以，照这版回复。',to:'何小雨'},
 hold:{label:'先别发，我翻一下原邮件',text:'先留着，等我翻一下那封邮件。',to:'何小雨'},
 decline:{label:'我不确认这封回复',text:'课件是我补的，其他部分我不确认。这封先别用我做确认人。',to:'何小雨'},
 narrow:{label:'这句谢谢只是在说课件',text:'这句谢谢说的是课件能打开，不能用来确认后面的事情都处理了。',to:'何小雨'},
 paid:{label:'表上已处理，我理解是款项也处理了',text:'我看到表上写已处理，理解这笔款项也已经处理了。',to:'何小雨'},
 ask:{label:'请周衡说明“均已处理”指什么',text:'这封要回给罗青的邮件里，“前期反馈的问题均已处理”是指哪些事？',to:'周衡'},
 scopeAsk:{label:'给客户的改了，这份复盘也改吗？',text:'给罗青的回复已经分开写了。下午交知禾的复盘仍是“均已处理”和那句谢谢，这份是否也更新？',to:'周衡'},
 retract:{label:'收回刚才的同意，请补一封更正',text:'刚才同意得太快。我收回“均已处理”的确认，请补一封说明；之前那封不要删。',to:'何小雨'}
};
function choose(id){if(!options[id])return;s.pending=id;render();document.querySelector('[role="dialog"] button')?.focus();}
function send(){
 const id=s.pending;if(!options[id])return;const opt=options[id],attached=[...s.selected].filter(x=>s.clips.includes(x));
 const signature=JSON.stringify([id,[...attached].sort()]);
 if(latest()?.signature===signature){s.pending=null;s.mail='receipt:'+latest().id;s.app='mail';save();render();return;}
 const alreadySent=sentOutside(),corrected=correctedCase(),alreadyCorrected=s.sends.some(x=>x.delivered&&['narrow','retract'].includes(x.choice)),who=['ask','scopeAsk'].includes(id)?'zhou':'xiaoyu';
 const had=[...s.known[who]];s.known[who]=[...new Set([...had,...attached])];
 const has=x=>s.known[who].includes(x);let body='',delivered=false,customer='',outgoing='';
 if(id==='approve'){
  if(corrected){body='你刚让我收窄，现在又用原话？我先不发。你要改回哪一句，咱们得说清楚。';}
  else {body='好，我发了。她回了以后我转你。';delivered=true;outgoing='罗女士您好，您前期反馈的问题均已处理。课程资料由林见补发，您随后回复：“谢谢你们，来回麻烦了。”后续如有问题，请继续联系课程客服。';customer='林先生，您说处理好了，是哪一件？\n那两万我没收到。能不能给我一个能回答这件事的人？';}
 }
 if(id==='approve'&&alreadySent&&!corrected){body='那封已经发过了。她还在等具体答复，不能再回一遍同样的话。';delivered=false;customer='';outgoing='';}
 if(id==='hold')body=(alreadySent?'前一封已经发了。我先不接着回，等你。':'行，我先留着。')+'\n这段是从周衡审过的复盘拿的。你找到旧邮件，转我一下。';
 if(id==='decline')body=(alreadySent?'前一封已经发过了。后面不再算你确认。':'好，先不发。')+'\n我把这封退给周衡。她每次打来都找课程客服，接电话的还是我，总得有句话能回她。';
 if(id==='paid')body='那格是我填的。沈念回“收到”以后，我把转交这项关了。\n到账没有人告诉我。'+(alreadySent?'前一封我得再补个说明。':'这封先别发，我去问周衡。');
 if(id==='narrow'){
  if(has('thanks')){
   body=(had.includes('thanks')?'那封 4 月 7 日的信我留着。':'看到了，是 4 月 7 日，在回附件。')+'\n'+(alreadySent?'我补发一封，把两件事分开。':'我按这版回她，只确认课件。');
   if(attached.includes('recent')&&!had.includes('recent'))body+='\n周五这封刚看到，我也留在记录里。';
   body+='\n我把这次改动抄给周衡。';delivered=true;outgoing=sourceReply();
   customer='课件我早就能打开了。\n我现在还找你们，是因为平台的人也是你们给我介绍的。';
   if(alreadyCorrected){body='4 月 7 日的信我留着。'+(attached.includes('recent')&&!had.includes('recent')?'周五这封也收到了。':'')+'\n更正那封已经发过了，先不重发。她现在等的是谁能答复款项。';delivered=false;customer='';outgoing='';}
  }else body='你说的是哪封？我手上只有复盘里这一句。\n把旧信转我。我先不发。';
 }
 if(id==='ask')body='“已处理”记的是我们这边做完了。小雨转给沈念，对方也接了。\n'+(has('recent')?(had.includes('recent')?'她那封信我看过了。对客别用这句。':'你附的信看到了。那对客别用这句。'):'回给她之前，课件那段你们再对一下。');
 if(id==='scopeAsk'){
  body=has('thanks')?'旧信我看到了。这句确实是说课件。\n':'你说的旧信我还没收到。\n';
  body+='先别覆盖周四的存档。你改一份副本给我，哪句要换标出来。数量按工作簿。';
 }
 if(id==='retract'){
  body=alreadySent?'前一封已经发出去了。我补一封，不能当它没发过。更正也抄给周衡。':'还没发，来得及。我把那句收回。';
  if(alreadyCorrected)body='更正那封已经发过了，我没有删原来的信。她现在等的是具体负责人的回复。';
  if(alreadySent&&!alreadyCorrected){delivered=true;outgoing=sourceReply();customer='我知道课件补过了。你们介绍我找平台，现在又让我去找他们。\n我该找谁？';}
 }
 const entry={id:s.sends.length+1,choice:id,label:opt.label,subject:id==='scopeAsk'?'下午交知禾的版本':'罗青的待发回复',to:opt.to,from:opt.to,body,attached,signature,delivered,customer,outgoing};
 s.sends.push(entry);ensureInternal();s.pending=null;s.app='mail';s.mail='receipt:'+entry.id;s.readMail.push(s.mail);s.selected=[];save();render();window.scrollTo(0,0);
}
function receipt(){const r=s.mail.startsWith('receipt:')?s.sends.find(x=>x.id===Number(s.mail.slice(8))):latest();if(!r)return draft();return paper('Re: '+r.subject,r.from+' → 林见',r.body,
 `${r.choice==='scopeAsk'?open('files','revision','在副本上标出修改'):''}${r.outgoing?`<div class="attachment"><span>课程服务邮箱 → 罗青 · 已发送</span><p>${esc(r.outgoing)}</p></div>`:''}<details class="sent-copy"><summary>我发出的那封</summary><p>${esc(options[r.choice]?.text||r.label)}</p><p>收件人：${esc(r.to)}<br>附送：${r.attached.map(x=>esc(sources[x].title)).join('、')||'没有附送原件'}</p></details><div class="reply-actions">${open('notes','','打开便签')}${open('chat','xiaoyu','找小雨')}${sentOutside()&&!correctedCase()?btn('choose','更正已发给罗青的说法','data-choice="retract"'):''}</div>`);}
function ensureInternal(){
 if(!internalPending()||s.internalMail)return;
 s.internalMail={body:(correctedCase()?'给罗青那封按刚才说的拆开写。':'罗青那封先对一下，别替平台答应日期。')+'\n\n下午交知禾的复盘先用周四那版，我已经审过了。材料在下面，别传成你们各自的工作副本。'};
}
function nextMail(){return paper('下午交知禾的版本','周衡 → 何小雨；抄送林见 · 回复内部核对',s.internalMail?.body||'此往来尚未发出。',
 `<div class="attachment"><span>本次附件 / 周四归档</span><p>阶段复盘_0511.docx</p>${open('files','summary','打开附件')}</div>${open('files','packet','查看本次交付夹')}${open('chat','zhou','回复周衡')}`);}
// A revision is a proposal, not a delivery. Review replies, dispatched files and
// recipient knowledge are saved snapshots. Merely viewing never advances them.
function reviewedText(v){
 return (v.quote?'已补发课程资料，并完成后续咨询介绍、问题转交。\n\n用户反馈：“谢谢你们，来回麻烦了。”（04-07，仅指课程附件已能打开）':D.summary.split('\n\n').slice(1,3).join('\n\n'))+
 '\n\n事项范围：04-06—05-10\n本组处理：'+v.count+' 项'+(v.pending?'\n\n待跟进：罗青 5 月 12 日来信称，申请转回的两万元仍未到账，请负责人员回复。此为用户来信内容，尚无处理结果。':'');
}
function chosenVersion(){const r=reviewState();return r.rounds.find(x=>x.id===r.selected)||null;}
function dispatches(){return reviewState().events.filter(x=>x.delivery);}
function hasRecent(){return s.read.includes('recent');}
function addReviewEvent(from,title,body,extra={}){const r=reviewState(),e={id:r.events.length+1,from,title,body,...extra};r.events.push(e);return e;}
function reviewNav(){return `<nav class="list">${[['summary','周四归档'],['revision','修订副本'],['packet','本次交付夹'],['ledger','本案计量附表'],...(dispatches().length?[['training','新人培训 · 当前待用页']]:[])].map(([id,t])=>btn('open',t,`data-app="files" data-detail="${id}" class="${s.file===id?'selected':''}" ${s.file===id?'aria-current="page"':''}`)).join('')}</nav>`;}
function reviewWorkspace(){
 const r=reviewState(),d=r.draft,selected=chosenVersion(),v=selected?.approved||{quote:false,pending:false,count:3};
 let content='';
 if(s.file==='revision')content=`<span class="overline">本机副本 · 尚未提交</span><h2>罗青服务案例 · 修订</h2><p class="muted">选中要改的段落，右侧预览。发给周衡后才会收到审阅；不会直接换掉共享文件。</p><div class="revision-grid"><fieldset class="revision-controls"><legend>修改内容</legend>${s.read.includes('thanks')?`<label><input type="checkbox" data-revision="quote" ${d.quote?'checked':''}> 只保留我补课件的结果，不写“恢复用户信任”</label>`:`<p>这句谢谢的上下文还没找到。</p>${open('mail','archive','查看引用邮件')}`}${hasRecent()?`<label><input type="checkbox" data-revision="pending" ${d.pending?'checked':''}> 把她周五还没收到款项这件事也写进去</label>`:open('mail','recent','查看最近来信')}<details class="count-adjustment"><summary>另外核对处理数量</summary><label>本组处理数量<select data-revision="count" aria-label="本组处理数量"><option value="3" ${d.count===3?'selected':''}>保留 3 项</option><option value="2" ${d.count===2?'selected':''}>去掉款项询问这项，改为 2 项</option></select></label>${open('sheet','current','核对服务记录')}</details><small>原件可在发送预览里勾选附上。</small></fieldset><article class="revision-preview"><span class="overline">副本预览</span><div class="prose">${esc(reviewedText(d))}</div></article></div><div class="reply-actions">${btn('review-preview','发给周衡审阅','data-action="submit" class="primary"')}${open('files','packet','查看交付夹')}</div>${r.rounds.length?`<h3>审阅记录</h3>${r.rounds.map(x=>open('mail','review:'+x.event,'第 '+x.id+' 次 · '+x.result)).join('')}`:''}`;
 if(s.file==='ledger')content=paper('本案计量附表','ZH-05 / U-0427 · 月度核量草表',
 '委托项目：知禾国内服务\n结算对象：知禾在线服务有限公司\n\n课程资料支持　1 项｜04-07 补发附件\n后续服务介绍　1 项｜04-17 已介绍平台业务联系\n问题转交　　　1 项｜05-10 项目侧确认接收\n合计　　　　　3 项\n\n核量附件：服务事项工作簿\n案例展示附件：罗青服务案例\n待核：案例展示表述，由周衡确认。',`${open('files','scope','查看委托项目目录')}${open('sheet','current','核对计量来源')}${open('files','packet','返回交付夹')}`);
 if(s.file==='packet'){
  const sent=dispatches(),last=sent.at(-1);
  content=`<span class="overline">知禾项目 · 协作交付</span><h2>${last?'交付记录与补充':'待交付的两份附件'}</h2>${last?'<p class="muted">下方为当前选定稿；已发出的原样附件保存在页面末尾的交付记录中。</p>':''}<p class="muted">收件：沈念（知禾项目侧） · 抄送：何小雨、唐婧、周衡</p><div class="attachment"><span>附件 1 / 核量</span><p>本案处理数量：3 项</p>${open('files','ledger','打开计量附表')}</div><div class="attachment"><span>附件 2 / 案例 · ${selected?'第 '+selected.id+' 次审定副本':'周四归档版'}</span><div class="prose">${esc(reviewedText(v))}</div></div>${selected?.proposed.pending&&!v.pending?'<p class="review-mark">审阅批注：待跟进段另存内部记录，本次附件未包含。</p>':''}<div class="reply-actions">${open('files','revision','修改副本')}${!last?btn('review-preview','按夹内版本交出','data-action="release"'):''}${hasRecent()&&!last?.hasPending?btn('review-preview',last?'补送周五来信中的未结事项':'随件附一页未结事项','data-action="include"'):''}${!last?btn('review-preview','退回周衡，我不经办交付','data-action="decline"'):''}</div>${sent.length?`<h3>实际交付 · ${sent.length} 次</h3>${sent.map(e=>open('mail','review:'+e.id,e.title+' / '+e.sender)).join('')}<p class="muted">记录保留发出时的附件。修改副本不会撤回旧附件。</p>`:'<p class="muted">查看交付夹不会发信。确认发送后才有项目回执。</p>'}`;
 }
 return `<div class="split">${reviewNav()}<section class="reading">${content}</section></div>`;
}
function reviewPreview(action){
 if(!internalPending())return;
 if(['release','decline'].includes(action)&&dispatches().length)return;
 if(action==='include'&&(!hasRecent()||dispatches().at(-1)?.hasPending))return;
 s.pending='review-'+action;save();render();document.querySelector('[role="dialog"] button')?.focus();
}
function reviewConfirm(){
 const a=s.pending.slice(7),d=reviewState().draft,v=chosenVersion()?.approved||{quote:false,pending:false,count:3};
 const title={submit:'发送修订副本',release:'交出夹内版本',include:dispatches().length?'补送未结事项':'交付并附未结事项',decline:'退回经办'}[a];
 const to=a==='submit'||a==='decline'?'周衡':'沈念；抄送何小雨、唐婧、周衡';
 return `<div class="confirm-shade"><section role="dialog" aria-modal="true" aria-labelledby="send-title"><span class="overline">收件人：${to}</span><h2 id="send-title">${title}</h2>${a==='decline'?'<p>我不作为这份材料的确认人，请你接手交付。</p><p class="muted">这是退回经办，并未要求撤下案例。</p>':`<details open><summary>即将送出的内容</summary><div class="prose">${esc(reviewedText(a==='submit'?d:{...v,pending:a==='include'}))}</div></details>`}${a==='submit'?`<fieldset class="send-sources"><legend>随副本附送原文</legend>${s.clips.map(id=>`<label><input type="checkbox" data-attach="${id}" ${s.selected.includes(id)?'checked':''}>${esc(sources[id].title)}</label>`).join('')||'<p>尚无摘录，可取消后到邮件摘录。</p>'}</fieldset>`:a==='include'?'<p class="muted">附送上面所示的来信摘要，不转发你便签中的其他原件。</p>':''}<div>${btn('send',a==='decline'?'确认退回':'确认发送','class="primary"')}${btn('cancel','再想一下')}</div></section></div>`;
}
function reviewSend(){
 const r=reviewState(),a=s.pending.slice(7),d={...r.draft};let event;
 if(a==='submit'){
  const attached=s.selected.filter(id=>s.clips.includes(id));
  s.known.zhou=[...new Set([...s.known.zhou,...attached])];
  const signature=JSON.stringify([d,[...s.known.zhou].sort()]),same=r.rounds.at(-1)?.signature===signature?r.rounds.at(-1):null;
  if(same){s.selected=[];s.pending=null;show('mail','review:'+same.event);return;}
  const quote=d.quote&&s.known.zhou.includes('thanks');
  const pendingSource=s.known.zhou.includes('recent');
  const approved={quote,pending:false,count:3};
  const lines=[];
  if(d.quote)lines.push(quote?'课件那段，同意。‘恢复用户信任’删掉，就写那次附件能打开。':'你说的那封旧信没带上，补给我。先别动原来的引用。');
  if(d.count===2)lines.push('数量还是 3。05-10 的接收记录在，转交这项发生过，不能删。');
  if(d.pending)lines.push(pendingSource?'周五的信看到了。这段我留在内部记录，案例里先不放。':'她周五那封原信补我一份。这行先留在你副本里，我还没看到原文。');
  if(!d.quote&&!d.pending&&d.count===3)lines.push('这一份和周四的内容相同，交付夹先用原版。');
  lines.push('我选的稿在交付夹里。');
  event=addReviewEvent('周衡','修订副本 · 第 '+(r.rounds.length+1)+' 次审阅',lines.join('\n\n'),{kind:'review',proposed:reviewedText(d),approved:reviewedText(approved),attached:[...attached]});
  const round={id:r.rounds.length+1,event:event.id,signature,proposed:d,approved,result:d.pending?'部分采用':quote?'引用已更新':'保留待核'};r.rounds.push(round);r.selected=round.id;
  s.selected=[];
 }else{
  if(!['release','include','decline'].includes(a))return;
  if((a==='include'&&(!hasRecent()||dispatches().at(-1)?.hasPending))||(a!=='include'&&dispatches().length)){s.pending=null;save();render();return;}
  const v={...(chosenVersion()?.approved||{quote:false,pending:false,count:3})},include=a==='include',sender=a==='decline'?'周衡':'林见',supplement=dispatches().length>0;
  const outgoing=reviewedText({...v,pending:include});
  event=addReviewEvent('沈念 · 知禾项目侧',supplement?'Re: 罗青案例补充':a==='decline'?'Re: 周衡交来的案例':'Re: 罗青案例已收',
   include?'未结事项收到了。罗青这页先不放进后续服务介绍材料，转交记录照收。\n有回复再补。':'附件收到，罗青这页已加入后续服务介绍材料。\n课程组介绍平台联系时，引用这个版本。',
   {kind:'delivery',delivery:true,sender,hasPending:include,version:{...v},outgoing,recipients:['沈念','何小雨','唐婧','周衡'],use:include?'暂不引用':'可供介绍时引用',count:3,attached:include?['来信摘要（非原件）']:[],supplement});
  // The people on the delivery receive only this packet, not the player's private archive.
  r.notice={hasPending:include,sender,use:event.use};
  addReviewEvent('何小雨',include?'罗青那页先撤了':'收到案例交付抄送',include?'培训待用稿里这页我撤了。\n电话还是我接。她问什么时候能收到钱，我手上还是只有‘已经转过去了’。':a==='decline'?'周衡自己发过来了。培训待用稿已经换上。\n我把页面放这儿，你补课件那段还在。':'培训待用稿换好了。\n你那句课件回信，放在‘课程之后还有人管吗’下面。我把页面放这儿。',{kind:'colleague'});
  if(include){
   addReviewEvent('唐婧','本案核量保留，案例暂停引用','补充我看到了。转交的 1 项仍计，本组还是 3 项。\n案例展示先停，这两处不用一起删。',{kind:'colleague'});
   addReviewEvent('周衡','Re: 罗青案例补充',supplement?'沈念收到了。原来那版不再拿去介绍，我来解释两次附件的差别。':'你把待跟进一起带过去了。我来回沈念，小雨先别用这页。',{kind:'colleague'});
  }
 }
 s.selected=[];s.pending=null;s.app='mail';s.mail='review:'+event.id;s.readMail.push(s.mail);save();render();window.scrollTo(0,0);
}
function reviewRecovery(e){
 const round=reviewState().rounds.find(x=>x.event===e.id);if(!round)return '';
 const needsOld=round.proposed.quote&&!s.known.zhou.includes('thanks'),needsNew=round.proposed.pending&&!s.known.zhou.includes('recent');
 return (needsOld?open('mail','archive','找出那封致谢原信'):'')+(needsNew?open('mail','recent','找出周五来信'):'')+
 ((needsOld||needsNew)?btn('review-resupply','用这份副本补送原件',`data-event="${e.id}"`):'');
}
function trainingPage(){
 const deliveries=dispatches(),last=deliveries.at(-1),previous=[...deliveries].reverse().find(x=>!x.hasPending);
 if(!last)return `<section class="reading"><h2>还没有交付的培训附件</h2>${open('files','packet','返回交付夹')}</section>`;
 const active=!last.hasPending,version=previous||last;
 const card=`<article class="training-card"><span class="overline">案例卡 · 罗青 / U-0427</span><h2>“课程之后，还有人管吗？”</h2><p class="training-prompt">学员问起后续联系时，可参考本例。</p><blockquote>谢谢你们，来回麻烦了。</blockquote>${version.outgoing.includes('仅指课程附件')?'<p class="quote-scope">04-07 · 仅指课程附件已能打开</p>':''}<div class="prose">${esc(version.outgoing.split('\n\n')[0])}</div><p class="muted">引用：阶段复盘 · 课程资料支持 / 林见</p>${open('mail','archive','在我的邮箱里找这句反馈')}<details class="speaker-notes"><summary>讲师备注</summary><p>先说明课程团队仍可联系；需要项目处理的，由课程组帮助接上联系人。</p><p>不要在课程群里代答平台操作细节，交项目侧回复。</p>${open('files','scope','项目侧联系人')}</details></article>`;
 return `<div class="split">${reviewNav()}<section class="reading training-page"><span class="overline">新人培训 / 第二部分 · 后续服务介绍</span><h2>培训待用稿</h2><p class="muted">整理：何小雨 · 审阅：周衡 · 本次交付：${esc(version.sender)}</p>${active?card:`<article class="training-empty"><span>本页暂不使用</span><h3>罗青案例已移出待用稿</h3><p>讲师备注：这一页先跳过，等待项目回复。</p></article>${previous?`<details class="retired-card"><summary>查看撤下前的页面（归档）</summary>${card}</details>`:'<p class="muted">本次来件附有未结事项，案例没有进入待用稿。</p>'}`}<div class="reply-actions">${open('chat','xiaoyu',active?'问小雨这一页怎么讲':'问小雨罗青那边怎样了')}${open('chat','zhou','问周衡这页的用途')}${hasRecent()&&!last.hasPending?btn('review-preview','把周五来信中的未结事项一并告知收件人','data-action="include"'):''}${open('mail','review:'+last.id,'看这次交付回执')}</div></section></div>`;
}

function reviewMail(){
 const e=reviewState().events.find(x=>'review:'+x.id===s.mail);if(!e)return draft();
 return paper(e.title,e.from+' → 林见'+(e.delivery?'；抄送同交付名单':''),e.body,
 `${e.kind==='review'?`<div class="revision-grid"><article class="revision-preview"><h3>你的副本</h3><div class="prose">${esc(e.proposed)}</div></article><article class="revision-preview"><h3>选入交付夹的版本</h3><div class="prose">${esc(e.approved)}</div></article></div><p class="muted">此次给周衡的原件：${e.attached.map(id=>esc(sources[id].title)).join('、')||'无'}</p>`:''}${e.delivery?`<div class="delivery-status"><strong>项目材料库 / 罗青案例 · 回执时状态</strong><p>${esc(e.use)} · 本案核量 ${e.count} 项</p>${dispatches().at(-1)?.id!==e.id?`<p class="muted">之后有补充：${open('mail','review:'+dispatches().at(-1).id,'查看最新回执')}</p>`:''}</div><details class="sent-copy"><summary>查看实际交出的附件与收件范围</summary><p>发送：${esc(e.sender)} → ${e.recipients.join('、')}</p><div class="prose">${esc(e.outgoing)}</div><p>另附：${e.attached.join('、')||'无'}</p></details>`:''}<div class="reply-actions">${e.delivery||e.from==='何小雨'?open('files','training','打开培训待用页'):''}${e.kind==='review'?reviewRecovery(e):''}${open('files','packet','打开交付夹')}${e.kind==='review'?open('files','revision','调整副本'):''}${open('chat',e.from==='何小雨'?'xiaoyu':e.from==='唐婧'?'tang':'zhou','找'+(e.from==='何小雨'?'小雨':e.from==='唐婧'?'唐婧':'周衡'))}</div>`);
}

function files(){if(s.file==='training')return trainingPage();if(['revision','packet','ledger'].includes(s.file))return reviewWorkspace();const file=s.file;let content=file==='scope'?sources.scope.quote:file==='summary'?D.summary.replace(/^罗青服务案例\n\n/,''):file==='scratch'?s.draftText: D.docs.lesson.body;return `<div class="split"><nav class="list">${[['summary','阶段复盘_0511'],...(internalPending()?[['packet','本次交付夹']]:[]),...(dispatches().length?[['training','新人培训 · 当前待用页']]:[]),['scope','知禾项目目录'],['lesson','家庭收支记录示例'],['scratch','我的草稿']].map(([id,t])=>btn('open',t,`data-app="files" data-detail="${id}" class="${file===id?'selected':''}"`)).join('')}</nav><section class="reading"><div class="ribbon">文件　 开始　 插入　 审阅 <span>${file==='scratch'?'本机草稿':'共享原件 · 只读'}</span></div>${file==='scratch'?`<h2>我的草稿</h2><textarea aria-label="我的草稿" data-input="draftText" placeholder="想写什么都可以。">${esc(s.draftText)}</textarea><p class="muted">自动保存在本机</p>`:paper(file==='summary'?'罗青服务案例':file==='scope'?'知禾项目 · 国内服务':'课程附件',file==='summary'?'整理：何小雨 / 审核：周衡 / 05-11':'共享目录',content,(sources[file]?clip(file):'')+(file==='summary'&&internalPending()&&correctedCase()?`<div class="version-note">${chosenVersion()?.approved.quote?'这是 05-11 归档原件；交付夹已选用修订副本。':'当前共享版本：05-11 · 本次交付仍选用此版。'}${open('files','revision','另存副本，标出修改')}${chosenVersion()?open('files','packet','查看当前选用的版本'):btn('choose','这份复盘也改吗？','data-choice="scopeAsk"')}</div>`:''))}${open('mail','draft','回到小雨的待发回复')}</section></div>`;}
function sheet(){let rows=[...D.rows];if(s.filter)rows=rows.filter(x=>Object.values(x).join(' ').includes(s.filter));if(s.sort)rows.reverse();return `<section class="sheet"><div class="ribbon">文件　 开始　 插入　 数据</div><header><h2>服务事项工作簿</h2><label>筛选 <input data-input="filter" value="${esc(s.filter)}" placeholder="姓名或事项编号"></label>${btn('sort','按日期 '+(s.sort?'↓':'↑'))}</header><div class="table-scroll"><table><thead><tr>${['编号','姓名','日期','状态','处理记录','回访'].map(t=>'<th>'+t+'</th>').join('')}</tr></thead><tbody>${rows.map(r=>`<tr><td>${r.id}</td><td>${r.name}</td><td>${r.date}</td><td>${r.status}</td><td>${r.record}</td><td>${r.feedback}</td></tr>`).join('')}</tbody></table></div><p class="muted">运营支持组 / 截至 5 月 11 日</p>${rows.some(r=>r.id==='C-0509-12')?clip('transfer'):''}${open('mail','draft','回到待发回复')}</section>`;}
const questions={
 xiaoyu:[['source','复盘那段也是你写的吗？'],['handled','表上这一项，你什么时候关的？'],['received','我刚转你的，你看到了吗？'],['handoff','我只做过课件，这件事你还会跟吗？'],['use','现在介绍平台，还会用罗青这页吗？'],['stillWaiting','她现在打来，你能告诉她什么？']],
 zhou:[['purpose','这页为什么放在介绍平台那一节？'],['unanswered','介绍材料停了，她的问题就有人回了吗？'],['scope','这些后续联系，也算我们的活？'],['wording','给客户也用“均已处理”？'],['stop','她还在等钱，介绍就照常做？'],['versions','给客户的改了，复盘为什么不换？'],['reviewed','我写的待跟进，最后放在哪儿？']],
 tang:[['payer','咱们的免费课，靠什么挣钱？'],['money','罗青那笔钱，你这里能查到吗？'],['company','目录里这个知禾，是课程公司？'],['counted','案例暂停了，数量也要减吗？']]
};
function visibleQuestions(who){return questions[who].filter(([id])=>{
 if(id==='purpose')return s.read.includes('training');
 if(id==='stillWaiting')return s.read.includes('training')&&(hasRecent()||reviewState().notice?.hasPending);
 if(id==='unanswered')return s.read.includes('training')&&reviewState().notice?.hasPending;
 if(id==='use')return !!reviewState().notice;
 if(id==='reviewed')return reviewState().rounds.some(x=>x.proposed.pending);
 if(id==='counted')return reviewState().notice?.hasPending;
 if(id==='handled')return s.read.includes('transfer');
 if(id==='received')return s.known.xiaoyu.length>0||!!reviewState().notice;
 if(id==='money')return s.read.includes('recent')||s.readMail.some(x=>x.startsWith('customer:'));
 if(id==='stop')return (s.read.includes('recent')||s.readMail.some(x=>x.startsWith('customer:')))&&(s.read.includes('transfer')||s.read.includes('scope')||s.sends.some(x=>x.customer?.includes('介绍')&&s.readMail.includes('customer:'+x.id)));
 if(id==='company')return s.read.includes('scope');
 if(id==='scope')return s.read.includes('scope')||s.read.includes('transfer')||s.readMail.includes('next');
 if(id==='versions')return !chosenVersion()?.approved.quote&&correctedCase()&&s.read.includes('summary')&&s.readMail.includes('next');
 return true;
});}
function talk(topic){
 const who=s.person;if(!visibleQuestions(who).some(x=>x[0]===topic))return;
 const seen=s.questions[who+':'+topic]||0,has=id=>s.known[who].includes(id);let line='';
 if(who==='xiaoyu')line=topic==='source'?(seen?'我写完给周衡，他改完才放进共享目录。':'初稿是我写的，周衡改过。我今天直接用了他审过的那段。'):topic==='handled'?(seen?'收到那两个字以后关的。再往后的结果没人回我。':'沈念回“收到”，我就把转交这项关了。她还在问，我也只能接着问沈念。'):topic==='received'?(has('recent')?'周五那封也看到了。她之前是打电话，这封我刚拿到。':'旧的材料看到了。她后来单独找你的那封，你没转过来吧？'):(seen?'我跟。你找到旧信转我，电话我来接。':'我跟，不让你接电话。可她一直问我，我也不能每次只说“转过去了”。');
 if(who==='zhou')line=topic==='versions'?(reviewState().rounds.length?'我在副本上回了批注。交付夹里是我选的版本。':has('thanks')?'旧信看过了。你在副本上标一下，别直接覆盖归档。':'可以改副本，把引用的旧信带上。我看你改哪句。'):topic==='scope'?(seen?'范围在项目目录。我批的是这部分工作。':'介绍联系人、登记问题、转给项目侧，这些也在委托里。不是只做课程。'):topic==='wording'?(has('recent')?'看了你发的那封信，别整段搬给她。课件和她现在问的事分开回。':seen?'她现在具体问什么？原信转我。':'内部记我们做完的事。对客不能整段照搬，先看她现在问什么。'):(has('recent')?'信看到了，她这笔还在等陆承。其他人的介绍先照常。':'我这边只有转交记录。她有新的回复，转我一下。');
 if(who==='tang')line=topic==='payer'?(seen?'付服务费的是项目方。你要看名称，目录里有合同项目栏。':'项目方付服务费啊。我们替他们维护课程，也做介绍、转交。你在课上没收过钱吧？'):topic==='money'?'我查的是公司收到的服务费。她个人的钱去了哪里，我这儿没有流水。':(seen?'合同项目栏是这样登记的。平台后台我没看过。':'是委托咱们做这个项目的公司。目录里列了全名，按境外项目服务归档；我拿它核服务费。');
 if(who==='xiaoyu'&&topic==='received'&&reviewState().notice)line=has('recent')?'原信和交付抄送都收到了。':reviewState().notice.hasPending?'抄送里的来信摘要看到了，原邮件没收到。我先按摘要去问沈念。':(has('thanks')?'旧的致谢信我留着，交付抄送也收到了。周五那封原信还没给我。':'交付抄送收到了。我手里只有附件那版，没有周五的原信。');
 if(topic==='use')line=reviewState().notice.hasPending?'那页已经撤了。可是她刚才问我多久能收到钱，这个我还是答不上来。':reviewState().notice.sender==='周衡'?'周衡交的那版还在待用稿里，署的是他的名。你只退了经办，我没收到停用的通知。':'还在待用稿里，刚才的交付抄送我收到了。你是觉得这页不能用来介绍？';
 if(topic==='reviewed')line=dispatches().at(-1)?.hasPending?'你已经带给沈念了。案例先撤，我来回他。':s.known.zhou.includes('recent')?'你的信和批注我留在内部记录了。交付夹是我选的稿，没带那一段。':'目前只有你副本里的转述。原信发我，别让后面的人再来问是哪天的事。';
 if(topic==='stillWaiting')line=reviewState().notice?.hasPending?'我能说那页不用了。她问钱，我只能给她沈念的联系，让她再等等。她就是不想再等，才打给我。':'我只能说已经转给沈念。她让我别再给联系人，让能处理的人回她。我也没等到那边的结果。';
 if(topic==='purpose')line=reviewState().notice?.hasPending?'那页停用了。我没说她的钱解决了，款项结果等项目侧回。':dispatches().at(-1)?.outgoing?.includes('仅指课程附件')?'你改的课件范围我保留了。新人要知道后面有人接，先用这页。':'这页是我选的。新人被问到课程后面谁接，就按这里讲。';
 if(topic==='unanswered')line='沈念接了，后面是陆承。我能撤的是这页，款项的日期不能替他答应。';
 if(topic==='counted')line='数量不用动，接收记录还在。停的是拿她做案例，不是抹掉我们转交过的事。';
 const prior=s.conversation.find(x=>x.who===who&&x.topic===topic);s.recalled=prior?.line===line;s.questions[who+':'+topic]=s.recalled?seen:seen+1;s.conversation=s.conversation.filter(x=>x.who!==who||x.topic!==topic);s.conversation.push({who,topic,q:questions[who].find(x=>x[0]===topic)[1],line});save();render();
}
function chat(){const who=s.person,p=people[who],line=s.conversation.filter(x=>x.who===who).at(-1);return `<div class="split"><nav class="list">${Object.entries(people).map(([id,p])=>btn('open',`<strong>${p.name}</strong><small>${p.role}</small>`,`data-app="chat" data-detail="${id}" class="${who===id?'selected':''}"`)).join('')}</nav><section class="reading chat"><h2>${p.name}</h2><p class="muted">${p.role}</p><div class="chat-space" aria-live="polite">${line?`${s.recalled?'<p class="muted chat-recalled">这条问过了 · 上次的回复</p>':''}<p class="bubble self">${esc(line.q)}</p><p class="bubble">${esc(line.line)}</p>`:`<p class="muted">${who==='xiaoyu'?'她捂住电话听筒，转过椅子。':who==='zhou'?'周衡的头像亮着。':'唐婧正在核上个月的单子。'}</p>`}</div><div class="question-list">${visibleQuestions(who).map(([id,t])=>btn('talk',t,`data-topic="${id}" aria-pressed="${line?.topic===id}"`)).join('')}</div>${who==='xiaoyu'?open('files','summary','看共享复盘'):line&&['payer','company','scope','versions'].includes(line.topic)?open('files','scope','打开项目目录'):''}${who==='zhou'&&line?.topic==='versions'?open('files','revision','打开修订副本'):''}${who==='zhou'&&line&&['versions','wording'].includes(line.topic)?btn('choose',line.topic==='versions'?'附上原信，追问复盘版本':'附上原件，问这封对客回复',`data-choice="${line.topic==='versions'?'scopeAsk':'ask'}"`):''}${['use','purpose','stillWaiting','unanswered'].includes(line?.topic)?open('files','training','看培训中的实际页面'):''}${['use','reviewed','counted','purpose'].includes(line?.topic)?open('files','packet','查看实际交付与补充'):''}${line?.topic==='unanswered'?open('files','scope','查项目对接人'):''}${open('notes','','打开便签')}</section></div>`;}
function notes(){return `<section class="reading notebook"><span class="overline">我的便签 · ${s.clips.length} 份摘录</span><h2>我留下的原文</h2>${!s.clips.length?`<p>还没有摘录。读邮件或文件时，可以把原文留在这里。</p>${open('mail','recent','翻我的邮箱')}${open('sheet','current','看服务记录')}`:''}<div class="clip-grid">${s.clips.map(id=>`<article class="clip"><label><input type="checkbox" data-attach="${id}" ${s.selected.includes(id)?'checked':''}> 随下一封回复附送</label><h3>${esc(sources[id].title)}</h3><p>${esc(sources[id].quote)}</p>${open(sources[id].app,sources[id].detail,'回看原件')}</article>`).join('')}</div><label class="note-label">随手记<textarea data-input="note" aria-label="随手记" placeholder="还不确定的，也可以先记下来。">${esc(s.note)}</textarea></label><h3>想好了再回。</h3><div class="reply-actions">${s.clips.includes('thanks')?btn('choose','这句谢谢只是在说课件','data-choice="narrow"'):''}${s.clips.includes('transfer')?btn('choose','表上已处理，我理解是款项也处理了','data-choice="paid"'):''}${btn('choose','请周衡说明“均已处理”指什么','data-choice="ask"')}${btn('choose','我不确认这封回复','data-choice="decline"')}${sentOutside()&&!correctedCase()?btn('choose','收回刚才的同意，请补一封更正','data-choice="retract"'):''}</div></section>`;}
function breakroom(){return `<section class="reading breakroom"><span class="overline">茶水间</span><h2>咖啡机又缺水了。</h2><p>${s.coffee?'杯子烫手。小雨的电话还没讲完。':'水槽边的绿色杯子里，泡着一枝绿萝。'}</p>${btn('coffee','接水，冲一杯咖啡 ☕')}<p>今天第 ${s.coffee} 杯</p><label>白板<textarea data-input="board" aria-label="茶水间白板" placeholder="请不要再用我的杯子浇花。——小雨">${esc(s.board)}</textarea></label>${open('mail','draft','回到那封邮件')}</section>`;}
function slides(){return `<section class="reading"><div class="ribbon">文件　 开始　 插入　 放映</div><h2>空白演示文稿</h2><div class="slide-paper" contenteditable="true" role="textbox" aria-label="演示文稿" data-input="slideText">${esc(s.slideText||'我的转正汇报')}</div><p class="muted">留到下午再写也来得及。</p></section>`;}
function confirm(){if(s.pending?.startsWith('review-'))return reviewConfirm();const o=options[s.pending];return `<div class="confirm-shade"><section role="dialog" aria-modal="true" aria-labelledby="send-title"><span class="overline">即将发送 → ${o.to}</span><h2 id="send-title">${o.label}</h2><p>${esc(o.text)}</p>${s.clips.length?`<fieldset class="send-sources"><legend>随信附送原文</legend>${s.clips.map(id=>`<label><input type="checkbox" data-attach="${id}" ${s.selected.includes(id)?'checked':''}> ${esc(sources[id].title)}</label>`).join('')}</fieldset>`:'<p class="muted">未附原件</p>'}${s.pending==='approve'?'<p>这是请小雨使用最初那版回复。</p>':''}<div>${btn('send','发送','class="primary"')}${btn('cancel','再想一下')}</div></section></div>`;}
const apps=[['mail','✉','邮件'],['chat','◌','川聊'],['files','▤','文档'],['sheet','▦','表格'],['slides','▣','演示'],['notes','▱','便签'],['break','☕','摸鱼']];
function render(){document.title='那句谢谢 · 澄川';$('#episode').innerHTML=!s.started?start():`<header class="topbar"><strong>川 <span>澄川 / 知禾运营组</span></strong><span>林见 · 星期一 09:${s.readMail.includes('next')?'26':s.sends.length?'18':'07'}</span><a href="./">原工作空间 ↗</a></header><main class="desk"><div class="desk-label"><span>CHENGCHUAN / 06F</span><p>离转正还有两周。</p></div><section class="app-window"><header class="windowbar"><span class="window-dots">● ● ●</span><strong>${apps.find(x=>x[0]===s.app)?.[2]||'邮件'}</strong><span>${s.app==='mail'?'课程服务 / 我的邮箱':'林见的电脑'}</span></header><div class="app-view">${s.app==='mail'?mailbox():s.app==='files'?files():s.app==='sheet'?sheet():s.app==='chat'?chat():s.app==='notes'?notes():s.app==='slides'?slides():breakroom()}</div></section></main><footer class="taskbar"><nav aria-label="软件">${apps.map(([id,icon,name])=>btn('open',`<span>${icon}</span>${name}${id==='notes'&&s.clips.length?' · '+s.clips.length:''}`,`data-app="${id}" aria-pressed="${s.app===id}"`)).join('')}</nav><div><small>${storageIssue?'未能保存，请勿关闭页面':'已保存 · 开场试做'}</small>${btn('restart','重玩')}</div></footer>${s.pending?confirm():''}`;}
$('#episode').addEventListener('click',e=>{const b=e.target.closest('[data-do]');if(!b)return;const a=b.dataset.do;if(a==='start'){s.started=true;mark('draft');}if(a==='open'){show(b.dataset.app,b.dataset.detail);return;}if(a==='clip'){if(!s.clips.includes(b.dataset.id))s.clips.push(b.dataset.id);}if(a==='history'){s.historyOpen=!s.historyOpen;if(s.historyOpen)mark('thanks');}if(a==='choose'){choose(b.dataset.choice);return;}if(a==='cancel')s.pending=null;if(a==='send'){if(s.pending?.startsWith('review-')){reviewSend();return;}send();return;}if(a==='review-resupply'){const round=reviewState().rounds.find(x=>x.event===Number(b.dataset.event));if(round){reviewState().draft={...round.proposed};reviewPreview('submit');}return;}if(a==='review-preview'){reviewPreview(b.dataset.action);return;}if(a==='talk'){talk(b.dataset.topic);return;}if(a==='next'){s.mail='next';s.readMail.push('next');}if(a==='sort')s.sort=!s.sort;if(a==='coffee')s.coffee++;if(a==='restart'){if(!confirmRestart())return;s=initial();}save();render();if(s.pending)document.querySelector('[role="dialog"] button')?.focus();});
function confirmRestart(){return window.confirm('重玩“那句谢谢”？只清除此开场的进度，原办公存档保留。');}
$('#episode').addEventListener('change',e=>{if(e.target.dataset.revision){const k=e.target.dataset.revision;reviewState().draft[k]=k==='count'?Number(e.target.value):e.target.checked;save();render();document.querySelector('[data-revision="'+k+'"]')?.focus();return;}if(e.target.dataset.attach){const id=e.target.dataset.attach;s.selected=e.target.checked?[...new Set([...s.selected,id])]:s.selected.filter(x=>x!==id);save();}});
$('#episode').addEventListener('input',e=>{const key=e.target.dataset.input;if(!key)return;s[key]=e.target.isContentEditable?e.target.textContent:e.target.value;save();if(key==='filter'){const pos=e.target.selectionStart;render();const f=$('[data-input="filter"]');f.focus();f.setSelectionRange(pos,pos);}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&s.pending){s.pending=null;save();render();}if(e.key==='Tab'&&s.pending){const bs=[...document.querySelectorAll('[role="dialog"] button,[role="dialog"] input,[role="dialog"] select')],i=bs.indexOf(document.activeElement);e.preventDefault();bs[(i+(e.shiftKey?-1:1)+bs.length)%bs.length].focus();}});
window.render_game_to_text=()=>JSON.stringify({mode:'opening-trial',app:s.app,mail:s.mail,clips:s.clips,selected:s.selected,known:s.known,lastReply:latest(),pending:s.pending,internalMail:s.internalMail,review:reviewState(),read:s.read,readMail:s.readMail,started:s.started});window.advanceTime=()=>Promise.resolve();ensureInternal();render();
})();
