/* Isolated opening surface. Drafts use the same real files and delivery commands as Office. */
window.installFirstShift = function(api) {
  'use strict';
  const {state:s,apps,docs,D,esc,openApp,refreshApp,save,submitDialog,receipt,toast,remember,closeModal}=api;
  const $=(q)=>document.querySelector(q);
  let lesson;
  const f=s.firstShift??={selected:null,drafts:{},choosing:false,guide:true};
  f.orientation??={step:0,done:false};
  if(f.orientation.version!==2)f.orientation={version:2,step:0,done:!!s.case.report};
  const cases=[
    {id:'attachment',date:'04.07',name:'课程资料补发',detail:'罗青打不开课件。你检查了页面，并重新发送附件。',app:'mail',source:'luo',sourceTitle:'课程资料邮件往来'},
    {id:'schedule',date:'04.19',name:'公开课时间调整',detail:'老师临时调整授课时间。你负责更新课程页和通知。',app:'mail',source:'schedule',sourceTitle:'课程时间调整确认'},
    {id:'chart',date:'05.12',name:'阶段复盘图表',detail:'你整理了项目图表；案例文字由负责人确认。',app:'doc',source:'weekly',sourceTitle:'本人图表交付记录'}
  ];
  const headings=['工作背景','本人完成的工作','结果'];
  // These are draft statements, not automatic facts or narrative decisions.
  const choicesByCase={
    attachment:[
      [['课件无法打开','罗青反馈下载的课程附件打不开。'],['课程时间需要调整','公开课时间调整，需要通知报名用户。'],['尚未核对情况','我还没有核对这次需要处理的具体问题。']],
      [['替换旧附件，并重新发送','我替换了页面上的旧附件，把修订版重新发给罗青。'],['请同事代为处理','我把问题转告同事，由小雨补发附件。'],['准备补发，尚未操作','我准备补发课程附件，目前还没有操作。']],
      [['收到可正常打开的回复','罗青回信说附件可以正常打开，并表示感谢。'],['发出后，没有再确认','附件已发出，后续是否可用尚待确认。'],['根据发送成功判断可以使用','邮件发送成功，所以我认为附件已经可以使用。']]
    ],
    schedule:[
      [['公开课临时调整时间','老师调整了公开课时间，需要同步页面与通知。'],['学员无法打开资料','用户反馈课程附件打不开。'],['尚未核对调整要求','我还没有确认这次要调整哪一项内容。']],
      [['更新到 20:00，并补发通知','我将课程页更新为20:00，向报名用户补发通知。'],['改回 19:30，并通知用户','我把课程时间改为19:30，并发送通知。'],['准备更新，尚未发送通知','我准备更新课程页，还没有发送通知。']],
      [['小雨核对了页面和通知','小雨回复课程页与补发通知都没有问题。'],['已修改，等待复核','页面和通知已经修改，尚未收到复核确认。'],['自行判断课程已正常结束','我认为课程已经顺利结束。']]
    ],
    chart:[
      [['阶段复盘需要整理图表','阶段复盘需要整理本期工作图表。'],['需要重新发送课件','用户反馈课程资料打不开，需要补发。'],['还没核对具体任务','我尚未核对这次图表工作的要求。']],
      [['整理图表，交给周衡','我整理了复盘图表并交给周衡。'],['由同事整理，我没有参与','图表是同事整理的，我没有参与制作。'],['计划制作，尚未交付','我准备制作图表，目前还没有交付。']],
      [['周衡反馈图表清楚','周衡回信说图表整理得清楚。'],['图表已交，结果待确认','图表已交，尚未收到负责人确认。'],['由图表推断所有服务已解决','我认为所有用户问题都已解决。']]
    ]
  };
  const inputSelector=i=>f.inputMode==='free'?'[data-shift-field="'+i+'"]':'[data-shift-choice="'+i+'"]';
  const fieldHelp=['发生了什么，需要你处理什么？','用自己的话写出实际做过的动作。','当时收到什么回应？不知道的部分可以留待确认。'];
  const selected=()=>cases.find(c=>c.id===f.selected);
  const docId=()=>f.drafts[f.selected];
  const body=()=>s.docs[docId()]??'';
  function parse(text){
    const match=/^案例名称：([^\n]*)\n工作背景：([\s\S]*?)\n本人完成的工作：([\s\S]*?)\n结果：([\s\S]*?)\n资料来源：([\s\S]*)$/.exec(text);
    return match?match.slice(2,5):null;
  }
  const filled=()=>{const a=parse(body());return a?a.filter(t=>t.trim()).length:(body().trim()?1:0);};
  const currentSent=()=>!!(s.case.report&&s.case.report.docId===docId()&&s.case.report.text===body());
  function stage(){
    if(!f.selected)return s.case.report?'delivered':'choose';
    if(currentSent())return s.workdays.reviews[s.case.reportVersion]?.status==='reviewed'?'replied':'delivered';
    if(!filled())return 'write';
    return 'draft';
  }
  const button=(action,label,attrs='')=>`<button class="shift-button" data-shift="${action}" ${attrs}>${label}</button>`;
  const route=(app,id,label)=>`<button class="shift-link" data-open="${app}" data-detail="${id}">${label} ↗</button>`;
  const opening=window.createOpeningScene({state:f.orientation,esc,route,button,schedule:D.mails.find(m=>m.id==='schedule')});
  function stepbar(){
    if(!f.orientation.done)return '<p class="small muted">工位回顾 → 选择个人经历 → 实际发送 → 按回信继续</p>';
    const step=stage(),n=['choose','write','draft'].includes(step)?(step==='choose'?0:1):step==='delivered'?2:3;
    return `<ol class="shift-steps" aria-label="工作进度">${['选择一件工作','整理个人稿','确认送达','收到回复'].map((t,i)=>`<li class="${i<n?'done':i===n?'current':''}" ${i===n?'aria-current="step"':''}><span>${i<n?'✓':i+1}</span>${t}</li>`).join('')}</ol>`;
  }
  function guide(){
    if(!f.guide||!f.orientation.done)return '';
    const messages={choose:['先决定写哪件事','下方三条都是你做过的工作。点“用这件事写”，会打开原材料和一份属于你的草稿。'],write:['现在写第一句','先对照原材料，再在“工作背景、本人完成的工作、结果”三栏选择叙述；也可切换自由改写。先整理一项就能预览初稿。'],draft:['草稿已保存，还没有发出','看看原材料，补上你想说明的内容。点“预览并发送”，核对收件人和正文，再确认发送。'],delivered:['已经送达','回执保留周衡收到的那一版。继续编辑不会改掉已发内容；你可以查看回信或继续使用电脑。'],replied:['读一读周衡的具体意见','个人汇报和之后的培训安排是两件事。回信、培训邮件和你自己的草稿都还在。']};
    const [title,text]=messages[stage()];
    return `<aside class="shift-guide"><span class="shift-guide-icon">i</span><div><strong>${title}</strong><p>${text}</p></div><button data-shift="guide-off" aria-label="关闭操作指引">×</button></aside>`;
  }
  function orientation(){return opening.render();}
  function pathPanel(review){if(!review?.path)return '';const p=review.path;return `<section class="shift-training-note report-path"><strong>${esc(p.title)}</strong><p>${esc(p.task)}</p>${p.key==='pending'&&p.caseId==='chart'?route('mail','career','查看周衡 5 月 12 日的原信'):''}${route('browser','report.chengchuan.example','查看这次安排，选择如何回应')}${route('mail','training','先看看培训材料')}<small>可以按这条分支继续，也可改口重交。选框与预览不会触发关系变化。</small></section>`;}
  function choices(){if(!f.orientation.done)return orientation();return `<section class="shift-choose"><div class="shift-section-title"><h2>从自己的工作记录开始</h2>${route('doc','weekly','完整工作记录')}${button('orient-replay','回看岗位与工作来由')}</div><p>选一件你愿意汇报的事。每一件都有原材料，可以随时换，已有草稿会保留。</p><div class="shift-cases">${cases.map(c=>`<article><time>${c.date}</time><h3>${c.name}</h3><p>${c.detail}</p><div>${button('choose','用这件事写 →',`data-case-id="${c.id}"`)}${route(c.app,c.source,'先看材料')}</div></article>`).join('')}</div></section>`;}
  function source(c){
    const m=c.app==='mail'?D.mails.find(m=>m.id===c.source):null;
    return `<section class="shift-source"><div class="shift-pane-title"><span>原始材料 · 只读</span>${route(c.app,c.source,'在'+(m?'邮箱':'文字')+'打开')}</div>${m?`<header><small>${esc(m.from)} · ${esc(m.time)}</small><h3>${esc(m.subject)}</h3></header><div class="shift-prose">${esc(m.body)}</div>${m.history?`<div class="shift-history"><h4>本线程的历史往来 · ${m.history.length} 封</h4>${m.history.map(([time,who,text])=>`<article><small>${esc(time)}</small><b>${esc(who)}</b><p>${esc(text)}</p></article>`).join('')}</div>`:''}`:`<header><small>项目共享文件</small><h3>${esc(docs[c.source]?.title)}</h3></header><div class="shift-prose">${esc(docs[c.source]?.body)}</div>`}</section>`;
  }
  function fields(){
    const values=parse(body());
    if(!values)return `<label class="shift-field"><span>文档正文</span><small>保留你在文字软件中的自由正文，不自动改成选项。</small><textarea class="shift-free" data-shift-free aria-label="文档正文">${esc(body())}</textarea></label>`;
    const free=f.inputMode==='free';
    return `<div class="shift-input-mode"><span>${free?'自由填写':'选择叙述，整理个人稿'}</span>${button(free?'choice-mode':'free-mode',free?'改用下拉选择':'想自己写？自由改写')}<small>选择只保存到草稿；没有合适选项时可以自行改写。</small></div>`+headings.map((title,i)=>{
      const options=choicesByCase[f.selected][i],match=options.findIndex(x=>x[1]===values[i]),custom=!!values[i]&&match<0;
      return `<section class="shift-field"><label for="shift-field-${i}">${i+1}. ${title}</label><small>${fieldHelp[i]}</small>${free?`<textarea id="shift-field-${i}" data-shift-field="${i}" aria-label="${title}" placeholder="写下你的理解……">${esc(values[i])}</textarea>`:`<select id="shift-field-${i}" data-shift-choice="${i}" aria-label="${title}"><option value="" ${!values[i]?'selected':''}>请选择你的叙述…</option>${custom?'<option value="custom" selected>保留当前自写内容</option>':''}${options.map(([label],j)=>`<option value="${j}" ${j===match?'selected':''}>${esc(label)}</option>`).join('')}</select><p class="shift-choice-preview" data-choice-preview="${i}">${esc(values[i]||'选择后，这里显示将写入正文的完整内容。')}</p>`}${fieldReview(i)}</section>`;
    }).join('');
  }
  function statusText(){
    if(currentSent())return `第 ${s.case.reportVersion} 版已送达 · ${s.workdays.reviews[s.case.reportVersion]?.status==='reviewed'?'周衡已回复':'等待周衡阅读'}`;
    return s.case.report?.docId===docId()?'修改已保存到本机 · 周衡仍持有上次发送的版本':'草稿已保存到本机 · 尚未发送';
  }
  function editor(){const c=selected();return `<nav class="shift-edit-nav" aria-label="材料与草稿">${button('focus-source','查看原材料')}${button('focus-draft','填写个人稿')}${button('focus-send','发送与回执')}</nav><div class="shift-editor-head"><div><small>我的文件 / 工作案例</small><h2>${esc(c.name)}</h2></div>${button('switch','换一件工作')}</div><div class="shift-editor"><div>${source(c)}</div><section class="shift-writing"><div class="shift-pane-title"><span>个人稿 · ${f.inputMode==='free'||!parse(body())?'自由填写':'下拉选择，可改写'}</span>${route('doc',docId(),'在文字中排版')}</div><div class="shift-fields">${fields()}</div><div class="shift-draft-meter" aria-live="polite"></div></section></div><footer class="shift-sendbar"><div><strong data-shift-save>${statusText()}</strong><small>发送的是这份文件；阅读材料、聊天和保存都不会替你发送。</small></div><div>${s.case.report?button('receipt','查看发送回执'):''}${button('preview',currentSent()?'查看已发内容':'预览并发送 →','data-shift-preview')}</div></footer>`;}
  function aftermath(){const r=s.case.report,review=s.workdays.reviews[s.case.reportVersion];if(!r)return '';return `<section class="shift-aftermath"><div class="shift-section-title"><h2>${review?.status==='reviewed'?'周衡的回复':'已送达 · 等待周衡阅读'}</h2><span>第 ${s.case.reportVersion} 版</span></div><p>${esc((review?.assessment?review.text.split('\n\n')[0]:review?.text)||'已发送的快照保留在回执里。可以继续查看其他邮件。')}</p>${pathPanel(review)}${review?.path?'<details class="optional-review"><summary>查看逐栏核对建议（可选）</summary>':''}${reviewPanel(reportAssessment(),s.case.reportVersion)}${review?.path?'</details>':''}${!review?.path&&review?.usable&&s.workdays.day===1?`<aside class="shift-training-note"><strong>小雨早上的培训来信还在</strong><p>明天展示的共享案例里有你经办的工作。个人稿已经通过，展示材料仍按培训页上的版本；可以先看看，也可以向小雨说明你能讲到哪里。</p>${route('mail','training','读小雨的原邮件')}${route('browser','training.chengchuan.example','看看明天会展示什么')}</aside>`:''}<div class="shift-after-actions">${review?.status==='reviewed'?route('mail','review-'+s.case.reportVersion,'打开回信'):'<span class="small muted">等待回信…</span>'}${route('mail','training','何小雨的培训邮件')}${route('browser','work.chengchuan.example','查看交接与分工')}</div><small>同事只能收到你实际发送的内容。你可以继续追问，也可以先处理自己的其他工作。</small></section>`;}
  function reportAssessment(version=s.case.reportVersion){
    if(s.workdays.reviews[version]?.status!=='reviewed')return null;
    const sub=s.submissions.find(x=>x.version===version),report=version===s.case.reportVersion?s.case.report:null;
    if(sub?.assessment||report?.assessment)return sub?.assessment||report.assessment;
    const text=sub?.text||report?.text;if(!text)return null;
    const id=sub?.docId||report?.docId,caseId=docs[id]?.caseId||Object.entries(f.drafts).find(([,v])=>v===id)?.[0];
    return (caseId||window.ReportReview.parse(text))?window.ReportReview.evaluate({text,caseId}):null;
  }
  function reviewPanel(a,version){if(!a)return '';return `<section class="report-review" data-review-panel="${version}"><h3>第 ${version} 版 · 逐栏反馈</h3><p>以下对应已发稿件。保留已说清的部分；修改本机草稿后，需要重新确认发送。</p>${a.fields.map(x=>`<article class="review-row ${x.status==='ok'?'okay':'needs'}"><strong>${x.status==='ok'?'✓':'○'} ${x.label}<small>${x.status==='ok'?'已说清':x.code==='clarify'?'需要说明':'待补充'}</small></strong><p>${esc(x.reason)}</p>${x.status!=='ok'?`<div class="review-actions"><button data-review-edit="${x.index}" data-review-version="${version}">修改这一栏</button><button data-review-source="${x.index}" data-review-version="${version}">查材料：${esc(x.source[2])} ↗</button></div>`:''}</article>`).join('')}</section>`;}
  function revisionAssessment(){return f.revision?.docId===docId()?reportAssessment(f.revision.version):null;}
  function fieldReview(i){const a=revisionAssessment();if(!a)return '';const local=f.localCheck?.text===body()?f.localCheck.assessment:null,x=(local||a).fields[i];const changed=parse(s.submissions.find(v=>v.version===f.revision.version)?.text||s.case.report?.text||'')?.[i]!==parse(body())?.[i];return `<span class="field-review ${x.status==='ok'?'okay':'needs'}" data-field-review="${i}"><strong>${x.status==='ok'?'✓ 可保留':'○ '+(local?'本机检查':'已发稿反馈')}</strong><span>${esc(x.reason)}</span>${changed&&!local?'<em>这栏已修改，尚未重新发送。</em>':''}<span class="review-actions"><button type="button" data-review-source="${i}" data-review-version="${f.revision.version}">查对应材料 ↗</button><button type="button" data-review-check="${i}">检查修改</button></span></span>`;}
  function beginRevision(index,version=s.case.reportVersion){
    const a=reportAssessment(version),sub=s.submissions.find(x=>x.version===version),id=sub?.docId||(version===s.case.reportVersion?s.case.report?.docId:null)||f.drafts[a?.caseId];if(!a||!id)return;
    f.selected=a.caseId;f.drafts[a.caseId]=id;f.choosing=false;f.revision={version,docId:id,index};f.localCheck=null;
    f.lesson??={begun:true,done:false,sources:{},fields:{}};f.lesson.sources??={};f.lesson.fields??={};f.lesson.fields[id]=a.fields.map(x=>x.status==='ok');f.lesson.fields[id][index]=false;f.lesson.focusField=index;f.lesson.revisingVersion=s.case.reportVersion;f.lesson.sources[a.caseId]=true;
    s.workdays.lastDraft={format:'doc',id};closeModal();openApp('start');save();
    const input=$(inputSelector(index)+',[data-shift-free]');input?.scrollIntoView({block:'center'});input?.focus({preventScroll:true});
  }
  function showReviewSource(index,version){const a=reportAssessment(version);if(!a)return;if(!f.revision||f.revision.version!==version)beginRevision(index,version);const [app,id,,part]=a.fields[index].source;
    closeModal();openApp(app,id);const win=$('[data-window="'+app+'"]');if(!win)return;
    const detail=win.querySelector('.app-content details');if(detail)detail.open=true;
    const target=part>=0?win.querySelectorAll('.thread-history')[part]:win.querySelector(app==='mail'?'.mail-content':'.document-paper');
    win.querySelectorAll('.review-source-focus').forEach(el=>el.classList.remove('review-source-focus'));target?.classList.add('review-source-focus');target?.scrollIntoView({block:'center'});
    const bar=document.createElement('section');bar.className='review-source-return';bar.innerHTML=`<strong>正在核对：${a.fields[index].label}</strong><span>${esc(a.fields[index].source[2])}</span><button data-review-return="${index}" data-review-version="${version}">回到这一栏继续写</button>`;
    win.querySelector('.app-body').prepend(bar);f.reviewSource={index,version};save();
  }
  const oldMail=apps.mail.render;apps.mail.render=()=>{const html=oldMail(),version=/^review-(\d+)$/.exec(s.selectedMail)?.[1];if(!version||s.mailFolder==='sent')return html;const t=document.createElement('template');t.innerHTML=html;const prose=t.content.querySelector('.mail-content'),assessment=reportAssessment(Number(version));const review=s.workdays.reviews[Number(version)];if(prose&&assessment)prose.textContent=review?.path?review.path.line:window.ReportReview.message(assessment).split('\n\n')[0];prose?.insertAdjacentHTML('afterend',pathPanel(review)+(review?.path?'<details class="optional-review" open><summary>查看逐栏核对建议（可选）</summary>':'')+reviewPanel(assessment,Number(version))+(review?.path?'</details>':''));return t.innerHTML;};
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-review-edit],[data-review-source],[data-review-return],[data-review-check]');if(!b)return;e.preventDefault();
    const version=Number(b.dataset.reviewVersion||s.case.reportVersion);
    if(b.hasAttribute('data-review-edit'))beginRevision(Number(b.dataset.reviewEdit),version);
    if(b.hasAttribute('data-review-source'))showReviewSource(Number(b.dataset.reviewSource),version);
    if(b.hasAttribute('data-review-return')){const i=Number(b.dataset.reviewReturn);if(f.revision?.version===version){closeModal();openApp('start');const input=$(inputSelector(i)+',[data-shift-free]');input?.focus();}else beginRevision(i,version);f.reviewSource=null;save();}
    if(b.hasAttribute('data-review-check')){f.localCheck={text:body(),assessment:window.ReportReview.evaluate({text:body(),caseId:f.selected})};refreshApp('start');save();const el=$('[data-field-review="'+b.dataset.reviewCheck+'"]');el?.scrollIntoView({block:'center'});}
  });
  function morningLetters(){
    const messages=s.xuView?.messages||[],letter=messages.find(m=>m.from==='xu'),invite=messages.find(m=>m.from==='xiaoyu'&&m.to.includes('lin')&&/待发回复/.test(m.subject));
    if(!letter)return '';
    const status={tentative:'候选时段，尚未确认',awaiting_user:'联系形式待确认',paused:'先等文字说明，联系暂缓',general_confirmed:'15:10 普通介绍已确认'}[s.xuView.appointment]||'往来继续留档';
    return `<section class="shift-brief"><span class="shift-avatar">信</span><div><small>课程服务邮箱 · 许川来信</small><h2>“后面具体跟哪家公司联系？”</h2><p>${esc(letter.body)}</p><p>${esc(status)} · 经办：何小雨。${s.workdays.business?.decision==='declined'?'你已拒绝下周窗口安排。':''}</p><div class="shift-morning-links">${route('mail',letter.id,'读许川原信')}${invite?route('mail',invite.id,'小雨为什么把这封留给我'):''}${route('browser','desk.chengchuan.example','查看实际往来与联系记录')}</div></div></section>`;
  }
  function render(){if(s.workdays.day===2&&f.orientation.replaying)return `<div class="shift-shell">${orientation()}<p>当前工作已保留。${button('orient-skip','结束回顾，回到当前工作')}</p></div>`;return `<div class="shift-shell"><header class="shift-heading"><div><span class="shift-eyebrow">PERSONAL DESK / 林见</span><h1>${s.workdays.day===2?'回到工作台':'早上好，先回到你的工位。'}</h1><p>入职第 ${s.workdays.day===2?'48':'47'} 天 · 运营支持组</p></div><span class="shift-time">${s.workdays.day===2?'05 / 16':'05 / 15'}<small>本机 · 独立重构版</small></span></header>${s.workdays.day===1?`<div data-shift-steps>${stepbar()}</div><div data-shift-guide>${guide()}</div>${f.orientation.done?`<section class="shift-brief"><span class="shift-avatar">${f.orientation.done?'周':'见'}</span><div><small>${f.orientation.done?'周衡 · 09:05 · 发给林见':'工位便笺 · 林见'}</small><p>${!f.orientation.done?'周衡今天要看一件我亲手做过的事。先翻翻工作记录，想起当时是谁来找我、我做了什么，再决定写哪件。':'今天选一件亲手做过的事整理汇报。说明你确认的经过；分工或结果还不清楚，也可以直接告诉我。'}</p>${route('mail','assignment','打开任务原邮件')}${button('orient-replay','回看人物与工作背景')}</div></section>`:''}${!f.orientation.done?orientation():!selected()||f.choosing?choices():editor()}${aftermath()}`:`${morningLetters()}<section class="shift-brief"><div><h2>昨天的文件和往来都已保留</h2><p>从实际收到的邮件或当前联系安排继续。</p>${route('mail','','打开邮箱')}${route('browser','desk.chengchuan.example','项目往来')}${route('oa','','我的待办')}${button('orient-replay','回看人物与工作背景')}</div></section><details class="shift-history"><summary>昨天的汇报回复与培训安排（留档）</summary>${aftermath()}</details>`}<footer class="shift-free-nav"><span>这是你的电脑，可以随时离开工作台。</span>${route('files','','工作文件')}${route('chat','xiaoyu','川聊')}${route('break','','茶水间')}</footer></div>`;}
  apps.start={name:'我的工作台',color:'#465c83',subtitle:'个人工作与实际回执',render};
  function createDraft(c){
    if(f.drafts[c.id]&&docs[f.drafts[c.id]])return;
    const id='personal-'+crypto.randomUUID();
    const text=`案例名称：${c.name}\n工作背景：\n本人完成的工作：\n结果：\n资料来源：${c.sourceTitle}`;
    docs[id]={title:'林见_工作案例_'+c.name,tag:'我的个人稿',editable:true,caseId:c.id,body:text,links:[[c.app,c.source,c.sourceTitle]]};
    s.customDocs[id]=docs[id];s.docs[id]=text;f.drafts[c.id]=id;
  }
  function updateLive(){
    const root=$('[data-window="start"]');if(!root)return;
    root.querySelectorAll('[data-field-review]').forEach(el=>{const html=fieldReview(Number(el.dataset.fieldReview));if(html&&el.outerHTML!==html)el.outerHTML=html;});
    const meter=root.querySelector('.shift-draft-meter');if(meter)meter.textContent=parse(body())?`已填写 ${filled()} / 3 项 · 填写进度不代表已发送；收到反馈后可以按栏修改。`:'自由正文已保存，发送前请核对预览。';
    const saveLabel=root.querySelector('[data-shift-save]');if(saveLabel)saveLabel.textContent=statusText();
    const preview=root.querySelector('[data-shift-preview]');if(preview){preview.disabled=filled()===0;preview.textContent=currentSent()?'查看已发内容':'预览并发送 →';}
    const steps=root.querySelector('[data-shift-steps]');if(steps)steps.innerHTML=stepbar();
    const g=root.querySelector('[data-shift-guide]');const markup=guide();if(g&&g.innerHTML!==markup)g.innerHTML=markup;
    $('#shift-guide-toggle')?.setAttribute('aria-pressed',String(f.guide));lesson?.sync();
  }
  let queued=false,lastExternal='';
  function sync(){if(queued)return;queued=true;queueMicrotask(()=>{
    queued=false;
    if(f.revision&&s.case.report?.docId===f.revision.docId&&s.case.reportVersion>f.revision.version&&s.workdays.reviews[s.case.reportVersion]?.status==='reviewed'){
      f.revision.version=s.case.reportVersion;f.localCheck=null;save();
    }
    const sig=JSON.stringify([s.case.reportVersion,s.workdays.reviews,s.workdays.day,body()]);
    if(sig!==lastExternal){lastExternal=sig;const active=document.activeElement;
      if(!active?.matches('[data-shift-field],[data-shift-choice],[data-shift-free]'))refreshApp('start');
    }
    updateLive();
  });}
  document.addEventListener('workspace-sync',sync);
  document.addEventListener('click',e=>{const b=e.target.closest('[data-shift]');if(!b)return;
    const action=b.dataset.shift;
    if(action==='free-mode'||action==='choice-mode'){f.inputMode=action==='free-mode'?'free':'choice';refreshApp('start');}
    if(opening.act(action,b)){if(action==='orient-replay'){f.orientation.returnChoosing=!!f.choosing;f.choosing=true;}if(f.orientation.done&&'returnChoosing' in f.orientation){f.choosing=f.orientation.returnChoosing;delete f.orientation.returnChoosing;}refreshApp('start');if(['orient-next','orient-prev','orient-replay'].includes(action))$('.shift-orientation')?.scrollIntoView({block:'start'});if(['orient-job','orient-company','orient-person'].includes(action)){$('[data-shift="'+action+'"]'+(b.dataset.person?'[data-person="'+b.dataset.person+'"]':''))?.focus({preventScroll:true});$('.opening-response')?.scrollIntoView({block:'nearest'});}}
    if(action==='guide-off')f.guide=false;
    if(action==='guide-toggle'){f.guide=!f.guide;if(f.guide&&f.lesson?.done)lesson.restart();}
    if(action==='switch'){f.choosing=true;refreshApp('start');}
    if(action==='choose'){
      const c=cases.find(c=>c.id===b.dataset.caseId);if(!c)return;
      createDraft(c);remember(c.source);f.selected=c.id;f.choosing=false;s.workdays.lastDraft={format:'doc',id:docId()};
      refreshApp('start');$('[data-window="start"] .shift-editor-head')?.scrollIntoView({block:'start',behavior:'smooth'});
      toast('已创建个人稿',c.name+' · 原始材料在左侧，你的正文在右侧。');
    }
    if(action==='preview'){if(currentSent())receipt();else if(filled())submitDialog('doc',docId(),'start');else toast('还没有正文','先在任意一项写下自己的工作。');}
    if(action==='receipt')receipt();
    if(action==='focus-source')$('.shift-source')?.scrollIntoView({block:'start',behavior:'smooth'});
    if(action==='focus-draft'){const input=$('[data-shift-field],[data-shift-choice],[data-shift-free]');input?.scrollIntoView({block:'center',behavior:'smooth'});input?.focus({preventScroll:true});}
    if(action==='focus-send')$('.shift-sendbar')?.scrollIntoView({block:'center',behavior:'smooth'});
    save();updateLive();
  });
  document.addEventListener('change',e=>{
    const el=e.target;if(el.hasAttribute('data-opening-time')){f.orientation.time=el.value;f.orientation.practiceIssue=false;const preview=$('[data-opening-preview]');if(preview)preview.textContent=el.value;save();return;}if(!el.hasAttribute('data-shift-choice')||el.value==='custom')return;
    const values=parse(body());if(!values)return;const i=Number(el.dataset.shiftChoice);
    values[i]=el.value===''?'':choicesByCase[f.selected][i][Number(el.value)][1];
    const c=selected();s.docs[docId()]=`案例名称：${c.name}\n工作背景：${values[0]}\n本人完成的工作：${values[1]}\n结果：${values[2]}\n资料来源：${c.sourceTitle}`;
    f.localCheck=null;const preview=$('[data-choice-preview="'+i+'"]');if(preview)preview.textContent=values[i]||'选择后，这里显示将写入正文的完整内容。';
    s.workdays.lastDraft={format:'doc',id:docId()};save();updateLive();
  });
  document.addEventListener('input',e=>{const el=e.target;
    if(el.hasAttribute('data-shift-field')){
      const values=parse(body());if(!values)return;values[Number(el.dataset.shiftField)]=el.value;
      const c=selected();s.docs[docId()]=`案例名称：${c.name}\n工作背景：${values[0]}\n本人完成的工作：${values[1]}\n结果：${values[2]}\n资料来源：${c.sourceTitle}`;
    }else if(el.hasAttribute('data-shift-free'))s.docs[docId()]=el.value;else return;
    s.workdays.lastDraft={format:'doc',id:docId()};save();updateLive();
  });
  const toggle=document.createElement('button');toggle.id='shift-guide-toggle';toggle.dataset.shift='guide-toggle';toggle.textContent='操作指引';toggle.setAttribute('aria-pressed',String(f.guide));$('#help-btn').before(toggle);
  // The task email remains concise; operational guidance belongs to the UI, not an NPC monologue.
  D.mails.find(m=>m.id==='assignment').body='林见，今天从入职以来选一件你亲手做过的工作，整理一页 Word 或 PPT，16:00 前发我。\n\n讲清当时的情况、你做了什么、收到什么回应。不用写整个项目。不确定的结果可以先说明，我看完回你。\n\n工作记录在附件里。小雨明天的培训另外确认，不用先替她改共享复盘。';
  D.mails.find(m=>m.id==='assignment').links.unshift(['start','','打开我的工作台']);
  lesson=window.installFirstLesson({state:s,form:f,selected,docId,body,parse,openApp,save,closeModal,reportAssessment,beginRevision,showReviewSource});
  return {sync,enter(){openApp('start');sync();},snapshot(){return {lesson:lesson.snapshot(),orientation:{...f.orientation},selected:f.selected,stage:stage(),guide:f.guide,filled:filled(),docId:docId()};}};
};
