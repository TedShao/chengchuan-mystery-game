import {replay,actions,documents,canShare,DOCS,PEOPLE,VERSION,endingText} from './domain/engine.mjs';
import {createTransport,UI_KEY,SAVE_KEY} from './transport.js';
import {icon} from './icons.js';
const transport=await createTransport();
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const baseUI={started:false,intro:0,app:'chat',thread:'xiaoyu',doc:'notice',viewed:[],pins:[],guide:true,large:false,browser:'home',history:['home'],historyIndex:0,note:'',editor:'word',word:'',bold:false,rows:[['项目','金额'],['房租','1800'],['日常支出','1200'],['工资（税前）','5000']],slides:[{title:'本周记录',body:'',color:'cream'}],slide:0,coffee:0,docScroll:{},chatScroll:{}};
let u={...baseUI},s=replay(transport.events),pending=[],sharing=null,dialog=null,toast='',busy=false;
try{const saved=JSON.parse(localStorage.getItem(UI_KEY)||'null');if(saved?.version===VERSION)u={...baseUI,...saved.ui};}catch{}
pending=Array.isArray(u.draft)?u.draft.filter(id=>actions(s,u.thread).some(a=>a.id===id)):[];
sharing=u.shareDraft&&(!u.shareDraft.doc||documents(s).includes(u.shareDraft.doc))?u.shareDraft:null;
let storageNotice=transport.storageError;
const saveUI=()=>{u.draft=[...pending];u.shareDraft=sharing;try{localStorage.setItem(UI_KEY,JSON.stringify({version:VERSION,ui:u}));}catch{storageNotice='界面设置未保存，请导出进度后检查浏览器存储。';}};
let toastTimer,returnFocus=false,lastAction='';
function flash(text){toast=text;$('#announcement').textContent=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast='';$('.toast')?.remove();},5500);}
function btn(label,attr='',cls=''){return `<button ${attr} class="${cls}">${label}</button>`;}
const navItems=[['chat','chat','通讯'],['mail','mail','邮箱'],['files','files','文件'],['browser','browser','浏览器'],['oa','org','内网'],['notes','notes','便签'],['office','files','办公'],['break','coffee','休息']];
function avatar(p){const a=PEOPLE[p];return `<span class="avatar ${a.color}">${esc(a.initial)}</span>`;}
function appTitle(){return navItems.find(x=>x[0]===u.app)?.[2]||'设置';}
function guide(){
 if(!u.guide)return '';
 let text='点击左边的何小雨，打开她刚发来的消息。';
 if(u.thread==='xiaoyu'&&u.app==='chat')text=s.contacts.includes('father')?'联系人里已留下回拨入口。你可以切换软件，回来后对话还在。':'她在问是否转接电话。选一个回复，会先出现发送预览。';
 if(pending.length)text='预览是草稿。确认收件人和内容后，点击发送才会让对方收到。';
 if(u.app==='files'||u.app==='mail')text='附件可在文件中打开。右上角可放到桌边并排看；阅读不会自动转交。';
 if(u.app==='notes')text='这里的笔记只留在你的电脑里，不会发给同事。';
 return `<aside class="coach"><span class="coach-dot"></span><p>${text}</p>${btn('关闭指引','data-do="guide"','text-button')}</aside>`;
}
function render(){
 document.documentElement.classList.toggle('large',u.large);
 if(!u.started){renderIntro();return;}
 if(s.ending){renderEnding();return;}
 const contactCount=s.messages.filter(m=>m.from!=='you'&&!u.viewed.includes(m.id)).length;
 $('#app').innerHTML=`<div class="desktop"><header class="system-bar"><a class="wordmark" href="#" data-do="home"><img src="./mark.svg" alt="澄川">澄川 <span>WORKSPACE</span></a><span class="system-middle">林见的工作电脑</span><div class="system-right"><span class="live-dot"></span>${storageNotice?'存储需处理':'本机已保存'}${btn(icon('settings'),'data-do="settings" aria-label="设置与存档"','icon-button')}<time>${s.messages.at(-1)?.stamp||'09:08'}</time></div></header><div class="desk-layout"><nav class="dock" aria-label="工作软件">${navItems.map(([id,i,label])=>btn(`${icon(i)}<span>${label}</span>${id==='chat'&&contactCount?'<i class="unread-dot"></i>':''}`,`data-app="${id}" aria-current="${u.app===id?'page':'false'}"`,u.app===id?'active':'')).join('')}<div class="dock-bottom">CC<br><small>07</small></div></nav><main class="workspace"><div class="workspace-heading"><div><span class="eyebrow">澄川人力资源服务 / 第七周</span><h1>${appTitle()}</h1></div><div class="identity"><span>林见</span><small>招聘助理 · 国内招聘组</small></div></div>${storageNotice?`<p role="alert" class="error">${esc(storageNotice)}</p>`:''}${guide()}<section class="app-window">${panel()}</section><footer class="desk-footer"><span>所有通信与网页均为游戏内模拟</span><div>${btn('操作帮助','data-do="help"','text-button')}${btn('结束这次调查','data-do="end"','text-button')}</div></footer></main>${u.pins.length?pinPanel():''}</div>${toast?`<div class="toast" role="status">${esc(toast)}${btn('×','data-do="dismissToast" aria-label="关闭通知"','text-button')}</div>`:''}${modal()}</div>`;
 if(u.app==='chat'){const log=$('.messages'),saved=u.chatScroll?.[u.thread];if(log)log.scrollTop=saved&&!saved.atEnd?saved.top:log.scrollHeight;}
 if(u.app==='files'&&$('.file-content'))$('.file-content').scrollTop=u.docScroll?.[u.doc]||0;
 if(dialog||sharing||pending.length){
  document.querySelectorAll('.system-bar,.desk-layout').forEach(el=>{el.inert=true;});
  queueMicrotask(()=>[...document.querySelectorAll('.modal button,.modal select,.modal summary')].find(el=>el.getClientRects().length)?.focus());
 }else if(returnFocus){returnFocus=false;queueMicrotask(()=>{const target=document.querySelector(`[data-action="${lastAction}"]`);(target?.getClientRects().length?target:$('.dock .active'))?.focus();});}
}
function renderIntro(){
 const pages=[['第七周','你叫林见，做过两年电商售后。\n失业三个月后，你进了澄川。','这份招聘助理的工作，至少能按时发工资。'],['一份熟悉的工作','公司主要给本地电商招客服。\n你回复咨询、约面试，把合同问题转给招聘顾问。','前阵子，你也问过那份海外客服岗位。'],['周三 · 09:08','电脑刚打开。\n何小雨说，前台有个电话找你。','找的是前阵子接待陈平的人。']];
 const [tag,title,sub]=pages[u.intro]||pages[0];
 $('#app').innerHTML=`<main class="prologue"><div class="prologue-top"><span>澄川 / 一个工作日</span>${btn('跳过序幕，进入工作台','data-do="start"','text-button')}</div><div class="intro-copy" key="${u.intro}"><span class="eyebrow">${tag}</span><h1>${esc(title).replaceAll('\n','<br>')}</h1><p>${sub}</p><div class="intro-actions">${u.intro<2?btn('继续 '+icon('arrow'),'data-do="introNext"','light-button'):btn('打开工作电脑 '+icon('arrow'),'id="start-btn" data-do="start"','light-button')}</div></div><footer><span>回来以后再联系</span><span>0${u.intro+1} / 03</span></footer></main>`;
}
function panel(){switch(u.app){case'chat':return chatPanel();case'mail':return mailPanel();case'files':return filesPanel();case'browser':return browserPanel();case'oa':return oaPanel();case'notes':return notesPanel();case'office':return officePanel();case'break':return breakPanel();default:return settingsPanel();}}
function chatPanel(){
 if(!s.contacts.includes(u.thread))u.thread='xiaoyu';
 const p=PEOPLE[u.thread],msgs=s.messages.filter(m=>m.thread===u.thread),opts=actions(s,u.thread);
 const contactOrder=[u.thread,...s.contacts.filter(id=>id!==u.thread).sort((a,b)=>s.messages.findLastIndex(m=>m.thread===b)-s.messages.findLastIndex(m=>m.thread===a))];
 return `<div class="chat-grid"><aside class="contacts"><div class="list-heading">工作联系人 <small>${s.contacts.length}</small></div>${contactOrder.map(id=>{const person=PEOPLE[id],list=s.messages.filter(m=>m.thread===id),last=list.at(-1),unread=list.some(m=>m.from!=='you'&&!u.viewed.includes(m.id));return btn(`${avatar(id)}<span><strong>${person.name}</strong><small>${esc(last?.text.slice(0,24)||person.role)}</small></span>${unread?'<i class="unread-dot"></i>':''}`,`data-person="${id}" aria-pressed="${u.thread===id}"`,'contact '+(u.thread===id?'selected':''));}).join('')}</aside><div class="conversation"><header class="conversation-head">${avatar(u.thread)}<div><h2>${p.name}</h2><small>${p.role}</small></div>${u.thread==='xiaoyu'?btn(icon('mail')+' 我发出的通知','data-open="notice"','subtle'):''}</header><div class="messages" aria-label="对话记录">${msgs.length?'<div class="day-divider">今天</div>':''}${msgs.map(m=>`<article class="message ${m.from==='you'?'outgoing':''}"><span class="message-meta">${m.from==='you'?'我':PEOPLE[m.from]?.name||p.name} · ${m.stamp}</span><p>${esc(m.text).replaceAll('\n','<br>')}</p></article>`).join('')}${!msgs.length?'<div class="empty"><h3>还没有新的对话</h3><p>从下面选择你想问的事。发送前可以修改或取消。</p></div>':''}</div><div class="reply-area"><div class="reply-heading"><span>回复 / 询问</span><small>先选内容，再确认发送</small></div><div class="topics">${opts.slice(0,6).map(a=>topic(a)).join('')}</div>${opts.length>6?`<details class="more-topics"><summary>其他问题与决定（${opts.length-6}）</summary><div class="topics">${opts.slice(6).map(a=>topic(a)).join('')}</div></details>`:''}<div class="reply-tools">${btn(icon('mail')+' 转交材料',`data-share-to="${u.thread}"`,'text-button')}${u.thread==='meng'?btn('我之前问过的岗位','data-open="inquiry"','text-button'):''}${u.thread==='zhao'&&documents(s).includes('zhaoAccount')?btn('打开赵提供的材料','data-open="zhaoAccount"','text-button'):''}${u.thread==='father'&&documents(s).includes('family')?btn('打开家属消息','data-open="family"','text-button'):''}${u.thread==='zhao'&&documents(s).includes('zhaoRecords')?btn('打开两次反馈','data-open="zhaoRecords"','text-button'):''}</div></div></div></div>`;
}
function topic(a){return btn(`${esc(a.label)}${a.answered?'<small>已谈过</small>':''}`,`data-action="${a.id}"`,'topic');}
function docHTML(id,compact=false){const d=DOCS[id];if(!d||!documents(s).includes(id))return '<p>你尚未收到这份材料。</p>';return `<article class="document ${compact?'compact':''}"><span class="eyebrow">${esc(d.kind)}</span><h2>${esc(d.title)}</h2><p class="doc-meta">${esc(d.from)}<br>${esc(d.date)}</p><div class="document-body">${d.body.map(p=>`<p>${esc(p).replaceAll('\n','<br>')}</p>`).join('')}</div>${d.links.map(link=>btn(icon('files')+' '+esc(DOCS[link].title),`data-open="${link}"`,'attachment')).join('')}</article>`;}
function filesPanel(){if(!documents(s).includes(u.doc))u.doc='notice';return `<div class="file-grid"><aside class="file-list"><div class="list-heading">我的工作文件</div>${documents(s).map(d=>btn(`${icon('files')}<span><strong>${DOCS[d].title}</strong><small>${DOCS[d].kind}</small></span>`,`data-open="${d}"`,u.doc===d?'selected':'')).join('')}</aside><div class="file-content"><div class="file-toolbar"><span>${s.read.includes(u.doc)?'已打开 · 原件只读':'尚未打开'}</span><div>${btn(icon('pin')+' 放到桌边',`data-pin="${u.doc}"`,'subtle')}${btn(icon('send')+' 转交',`data-share="${u.doc}"`,'subtle')}</div></div>${docHTML(u.doc)}</div></div>`;}
function mailPanel(){return `<div class="mail-layout"><div class="section-toolbar"><h2>收发记录</h2><span>lin.jian · 澄川</span></div><div class="mail-group"><h3>已发送 · 面试安排</h3>${btn(`<span class="mail-icon">${icon('mail')}</span><span><strong>陈平 · 中文电商客服面试通知</strong><small>发送于 17 天前 · 附职位说明、在岗介绍</small></span><span class="mail-arrow">打开 ${icon('arrow')}</span>`,'data-open="notice"','mail-row')}${btn(`<span class="mail-icon">${icon('calendar')}</span><span><strong>本周国内客服招聘</strong><small>何小雨 · 日常安排</small></span>`,'data-open="domestic"','mail-row')}</div><div class="mail-group"><h3>本次转交 · 实际送达</h3>${s.receipts.length?s.receipts.map(r=>`<article class="receipt">${icon('check')}<div><strong>${DOCS[r.doc].title}</strong><p>只发送给：${PEOPLE[r.to].name} · 内容：许可内摘录</p>${btn('查看原件',`data-open="${r.doc}"`,'text-button')}${btn('查看会话',`data-person="${r.to}"`,'text-button')}</div><span>已送达 #${r.seq}</span></article>`).join(''):'<p class="muted">还没有转交材料。打开附件、放到桌边、写便签都不会发送。</p>'}</div></div>`;}
function browserPanel(){const pages={home:['chengchuan.example','澄川人力资源服务'],jobs:['chengchuan.example/jobs','招聘职位'],staff:['intranet.chengchuan/org','公司内网'],help:['help.example/report','外部求助 · 模拟入口']};const pg=pages[u.browser]||pages.home;return `<div class="browser"><div class="browser-bar">${btn(icon('back'),'data-do="browserBack" aria-label="浏览器后退" '+(u.historyIndex<=0?'disabled':''),'icon-button')}<form id="address-form"><label class="address">${icon('browser')}<input name="address" aria-label="模拟浏览器地址" value="${pg[0]}"></label></form>${btn('主页','data-page="home"','subtle')}</div><nav class="bookmarks">${btn('澄川首页','data-page="home"')}${btn('招聘职位','data-page="jobs"')}${btn('公司内网','data-page="staff"')}${btn('外部求助','data-page="help"')}</nav><div class="webpage">${u.browser==='home'?`<header class="company-nav"><strong>澄川<span>人力资源服务</span></strong>${btn('职位列表 '+icon('arrow'),'data-page="jobs"','text-button')}</header><div class="company-hero"><span>连接合适的人，与合适的工作。</span><h2>把工作，<br>落在生活里。</h2><p>本地电商客服招聘 · 面试安排 · 入职回访</p><div class="company-art" aria-hidden="true"><i></i><i></i><i></i></div></div><div class="company-columns"><section><h3>企业招聘</h3><p>了解团队的排班与用人需求，协助筛选和安排面试。企业按约定支付招聘服务费。</p></section><section><h3>求职服务</h3><p>对接岗位、基础咨询与入职回访。劳动关系与薪资由实际用人单位按约定处理。</p></section></div>`:u.browser==='jobs'?`<span class="eyebrow">澄川 / 招聘职位</span><h2>正在招聘</h2><div class="job-card"><span>海外项目 · 中文客服</span><h3>¥22,000 <small>/ 月固定 · 税前</small></h3><p>底薪 16,000 + 海外驻岗补贴 6,000<br>绩效另计 · 包食宿 · 满半年连续三周探亲假</p>${btn('查看当批岗位说明 '+icon('arrow'),'data-open="job"','primary')}</div><div class="job-card"><span>本地电商 · 售后客服</span><h3>国内招聘组</h3><p>面试安排与入职回访</p>${btn('本周工作页','data-open="domestic"','subtle')}</div>`:u.browser==='staff'?orgHTML():`<span class="eyebrow">游戏内模拟 · 不发送到现实机构</span><h2>提供你知道的情况</h2><p>可以先说明有限事实，再补充材料。亲历、他人转述与尚不清楚的部分分别保留，不需要先完成调查或填写罪名。</p>${btn('打开求助会话 '+icon('arrow'),'data-person="help"','primary')}`}</div></div>`;}
function orgHTML(){return `<span class="eyebrow">公司内网 / 人员与职责</span><h2>澄川人力资源服务</h2><div class="org-chart"><div class="org-chief">郑立<small>负责人 · 客户合作 / 重大投诉</small></div><div class="org-branches"><div>国内招聘组<small>何小雨 · 招聘与回访</small><span>林见 · 基础咨询 / 预约 / 接待</span></div><div>海外项目<small>孟宁 · 介绍 / 录用衔接</small><span>合作方负责后续雇佣安排</span></div><div>行政与财务<small>考勤 / 发薪 / 结算</small><span>不开放其他人员私人档案</span></div></div></div>`;}
function oaPanel(){return `<div class="oa-panel"><div class="section-toolbar"><h2>工作安排</h2><span>今天 / 明天</span></div><div class="schedule"><article><time>今天 10:00</time><div><strong>国内售后岗面试</strong><p>何小雨已通知改到明天</p></div><span class="status">已改约</span></article><article><time>明天 14:30</time><div><strong>海外中文客服初面</strong><p>经办：${s.withdrawn?'孟宁':'林见'} · ${s.paused?'原通知已由负责人安排取消':s.facts.includes('notified')?'你联系的候选人已收到风险说明，部分撤回，部分等解释':'已发面试通知仍有效'}</p></div><span class="status ${s.paused?'':'amber'}">${s.paused?'整批暂停':'安排仍在'}</span></article></div>${orgHTML()}<div class="profile-strip"><strong>林见 / 招聘助理</strong><p>入职第七周；原电商售后两年，失业三个月后入职。试用税前 5,000 元，转正 5,500 元。</p>${btn('查看我之前的岗位咨询','data-open="inquiry"','text-button')}</div></div>`;}
function notesPanel(){return `<div class="notes-panel"><div class="section-toolbar"><h2>私人便签</h2><span>仅存本机 · 不自动发送</span></div><textarea id="private-note" aria-label="私人便签" placeholder="哪里没有说清楚？把你自己的问题留在这里。">${esc(u.note)}</textarea><p class="muted">切换软件会保留。你可以把原件放到桌边，回到来源核对。</p><div class="pinned-links">${u.pins.map(d=>btn(DOCS[d].title,`data-open="${d}"`,'attachment')).join('')}</div></div>`;}
function officePanel(){let content='';if(u.editor==='word')content=`<div class="office-ribbon">${btn('下载文本','data-do="downloadWord"')}${btn('B','data-do="bold" aria-pressed="'+u.bold+'"',u.bold?'selected':'')}<span>本机文档 · 自动保存</span></div><textarea id="word-editor" aria-label="自由文档" class="word-page ${u.bold?'bold':''}" placeholder="写点什么。这里不检查标准答案，也不会替你发送。">${esc(u.word)}</textarea>`;
 if(u.editor==='sheet')content=`<div class="office-ribbon">${btn('增加一行','data-do="addRow"')}${btn('下载 CSV','data-do="downloadSheet"')}<span>自由记录 · 金额合计只计算数字</span></div><table class="sheet"><tbody>${u.rows.map((r,i)=>`<tr><th>${i+1}</th>${r.map((v,j)=>`<td><input data-cell="${i},${j}" aria-label="${String.fromCharCode(65+j)}${i+1}" value="${esc(v)}"></td>`).join('')}</tr>`).join('')}</tbody></table><p class="sheet-total">B 列数字合计：<output>${u.rows.slice(1).reduce((n,r)=>n+(Number(r[1])||0),0).toLocaleString()}</output></p>`;
 if(u.editor==='slides'){const slide=u.slides[u.slide];content=`<div class="office-ribbon">${btn('上一页','data-do="prevSlide" '+(u.slide===0?'disabled':''))}<span>${u.slide+1} / ${u.slides.length}</span>${btn('下一页','data-do="nextSlide" '+(u.slide===u.slides.length-1?'disabled':''))}${btn('新增幻灯片','data-do="addSlide"')}${btn('切换底色','data-do="slideColor"')}</div><div class="slide ${slide.color}"><input id="slide-title" aria-label="幻灯片标题" value="${esc(slide.title)}"><textarea id="slide-body" aria-label="幻灯片正文" placeholder="这一页想说什么？">${esc(slide.body)}</textarea></div>`;}
 return `<div class="office-panel"><nav class="office-tabs">${[['word','文档'],['sheet','表格'],['slides','演示']].map(([id,label])=>btn(label,`data-editor="${id}" aria-selected="${u.editor===id}"`,u.editor===id?'active':'')).join('')}</nav>${content}</div>`;}
function breakPanel(){return `<div class="break-panel"><span class="eyebrow">休息一下</span><h2>先喝口水。</h2><p>电话不会因为你离开屏幕几分钟，就变成另一件事。</p><div class="coffee-cup ${u.coffee%2?'filled':''}">${icon('coffee')}</div>${btn(u.coffee%2?'喝完了，再接一杯':'接一杯水','data-do="coffee"','primary')}<p class="muted">今天接了 ${Math.ceil(u.coffee/2)} 杯。休息不推进剧情。</p></div>`;}
function settingsPanel(){return `<div class="settings-panel"><h2>设置与存档</h2><p>新版独立存档。旧游戏存档不会读取或覆盖。</p><div class="setting-row"><span>操作引导</span>${btn(u.guide?'已开启 · 点击关闭':'已关闭 · 点击开启','data-do="guide"','subtle')}</div><div class="setting-row"><span>大字体</span>${btn(u.large?'恢复标准':'放大文字','data-do="large"','subtle')}</div><div class="setting-row"><span>保留你的进度</span>${btn('导出存档','data-do="export"','primary')}</div><div class="setting-row"><label for="import-save">导入新版存档</label><input id="import-save" type="file" accept="application/json"></div><div class="setting-row"><span>重新体验</span>${btn('重新开始','data-do="reset"','subtle')}</div><p class="muted">运行方式：${transport.mode==='server'?'本地后端 · 命令重放':'浏览器 · 同一套剧情规则'}。不调用付费模型或真实通信服务。</p></div>`;}
function pinPanel(){return `<aside class="pinboard" aria-label="桌边材料"><header><div>${icon('pin')}<strong>桌边材料</strong><small>并排看原件</small></div>${btn('收起全部','data-do="clearPins"','text-button')}</header>${u.pins.map(d=>`<section><div class="pin-actions">${btn('回到文件',`data-open="${d}"`,'text-button')}${btn(icon('close'),`data-unpin="${d}" aria-label="移走${DOCS[d].title}"`,'icon-button')}</div>${docHTML(d,true)}</section>`).join('')}</aside>`;}
function modal(){
 if(sharing){const doc=sharing.doc, to=sharing.to||u.thread;const choices=documents(s).filter(d=>s.read.includes(d)&&DOCS[d].share.length);return `<div class="scrim"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="eyebrow">发送预览</span><h2 id="modal-title">转交材料</h2><label>材料<select id="share-doc"><option value="">选择已读材料</option>${choices.map(d=>`<option value="${d}" ${doc===d?'selected':''}>${DOCS[d].title}</option>`).join('')}</select></label><label>只发送给<select id="share-to">${s.contacts.filter(p=>doc?canShare(s,doc,p):p!=='xiaoyu'&&p!=='chen').map(p=>`<option value="${p}" ${to===p?'selected':''}>${PEOPLE[p].name}</option>`).join('')}</select></label><blockquote>${doc?esc(DOCS[doc].excerpt):'先选择材料。没有读过或尚未收到的内容不在列表中。'}</blockquote><p class="muted">发送许可内摘录，并保留原件来源。不会把其他私人材料一起附上。</p><footer>${btn('取消','data-do="cancelModal"','subtle')}${btn('确认发送 '+icon('send'),'data-do="sendShare" '+(!doc?'disabled':''),'primary')}</footer></section></div>`;}
 if(pending.length){const opts=actions(s,u.thread);return `<div class="scrim"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="eyebrow">草稿 · 尚未发送</span><h2 id="modal-title">发给 ${PEOPLE[u.thread].name}</h2><div class="draft-lines">${pending.map(id=>`<p>${esc(opts.find(a=>a.id===id)?.label||'操作已不可用')}</p>`).join('')}</div><details><summary>再问一件事</summary><div class="topics">${opts.filter(a=>!pending.includes(a.id)).map(topic).join('')}</div></details><footer>${btn('取消草稿','data-do="cancelModal"','subtle')}${btn('发送 '+icon('send'),'data-do="send" '+(busy?'disabled':''),'primary')}</footer></section></div>`;}
 if(dialog){const content=dialog==='reset'?['重新开始？','会清除本浏览器的新版进度与自由办公内容，旧游戏存档不受影响。建议先导出存档。','确认重新开始','resetConfirm']:dialog==='end'?['结束这次调查？','已经发送的材料与通知会保留其后果。未确认的事情不会因为下班就变成已解决。','结束并查看后续','endConfirm']:['工作台怎么用','通讯里选择要说的话，再确认发送；文件可放到桌边并排看；邮箱保留转交回执，内网显示实际安排。读材料、写便签和关闭窗口都不会自动表态。','知道了','cancelModal'];return `<div class="scrim"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">${content[0]}</h2><p>${content[1]}</p><footer>${btn('返回','data-do="cancelModal"','subtle')}${btn(content[2],`data-do="${content[3]}"`,'primary')}</footer></section></div>`;}return '';
}
function renderEnding(){const e=endingText(s);$('#app').innerHTML=`<main class="ending"><span class="eyebrow">${e.when}</span><h1>${e.title}</h1><p>${e.text}</p><small>${e.tail}</small><div class="ending-record"><span>实际转交 ${s.receipts.length} 份</span><span>${s.paused?'本批招聘已暂停':s.withdrawn?'只退出本人经办':'未确认整批暂停'}</span><span>${s.facts.includes('helpRequested')?'已经向外求助':'未由你发起外部求助'}</span></div><div>${btn('回到结束之前','data-do="undoEnding"','light-button')}${btn('导出此存档','data-do="export"','text-button')}</div></main>`;}
async function command(c){const r=await transport.send({id:crypto.randomUUID(),...c});s=r.state;return r.result;}
async function openDoc(d){if(!documents(s).includes(d))return;await command({kind:'read',doc:d});u.doc=d;u.app='files';}
function switchThread(p){u.app='chat';u.thread=p;u.viewed.push(...s.messages.filter(m=>m.thread===p).map(m=>m.id));}

function restoreUI(data,state){
 const out={...structuredClone(baseUI),started:true};if(!data||typeof data!=='object')return out;
 for(const [key,max] of [['note',15000],['word',40000]])if(typeof data[key]==='string')out[key]=data[key].slice(0,max);
 for(const key of ['guide','large','bold'])if(typeof data[key]==='boolean')out[key]=data[key];
 if(navItems.some(x=>x[0]===data.app)||data.app==='settings')out.app=data.app;
 if(state.contacts.includes(data.thread))out.thread=data.thread;
 if(documents(state).includes(data.doc))out.doc=data.doc;
 if(['word','sheet','slides'].includes(data.editor))out.editor=data.editor;
 if(Array.isArray(data.rows)&&data.rows.length&&data.rows.length<=50&&data.rows.every(r=>Array.isArray(r)&&r.length===2&&r.every(v=>typeof v==='string'&&v.length<=250)))out.rows=data.rows;
 if(Array.isArray(data.slides)&&data.slides.length&&data.slides.length<=20&&data.slides.every(x=>x&&typeof x.title==='string'&&x.title.length<=120&&typeof x.body==='string'&&x.body.length<=4000&&['cream','green'].includes(x.color)))out.slides=data.slides;
 out.slide=Math.min(Math.max(Number.isInteger(data.slide)?data.slide:0,0),out.slides.length-1);
 if(Array.isArray(data.pins))out.pins=data.pins.filter(d=>state.read.includes(d)&&documents(state).includes(d)).slice(0,2);
 return out;
}
function download(name,value,type='application/json'){const url=URL.createObjectURL(new Blob([value],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#app').addEventListener('click',async e=>{
 const b=e.target.closest('button,a[data-do]');if(!b||busy)return;e.preventDefault();
 const filePanel=$('.file-content'),chatLog=$('.messages');
 if(filePanel)(u.docScroll??={})[u.doc]=filePanel.scrollTop;
 if(chatLog)(u.chatScroll??={})[u.thread]={top:chatLog.scrollTop,atEnd:chatLog.scrollHeight-chatLog.scrollTop-chatLog.clientHeight<30};
 try{
  if(b.dataset.app){u.app=b.dataset.app;toast='';}
  if(b.dataset.person)switchThread(b.dataset.person);
  if(b.dataset.open){busy=true;await openDoc(b.dataset.open);}
  if(b.dataset.pin){if(!u.pins.includes(b.dataset.pin))u.pins=[...u.pins,b.dataset.pin].slice(-2);flash('已放到桌边。只有你能看到，没有转交。');}
  if(b.dataset.unpin)u.pins=u.pins.filter(d=>d!==b.dataset.unpin);
  if(b.dataset.action){lastAction=b.dataset.action;if(!pending.includes(b.dataset.action))pending.push(b.dataset.action);}
  if(b.dataset.share){sharing={doc:b.dataset.share,to:DOCS[b.dataset.share].share.find(p=>s.contacts.includes(p))};}
  if(b.dataset.shareTo)sharing={doc:'',to:b.dataset.shareTo};
  if(b.dataset.editor)u.editor=b.dataset.editor;
  if(b.dataset.page){u.browser=b.dataset.page;u.history=u.history.slice(0,u.historyIndex+1);u.history.push(u.browser);u.historyIndex=u.history.length-1;}
  const act=b.dataset.do;
  if(act==='start'){u.started=true;u.viewed.push(...s.messages.filter(m=>m.thread==='xiaoyu').map(m=>m.id));}
  if(act==='introNext')u.intro=Math.min(2,u.intro+1);
  if(act==='guide')u.guide=!u.guide;
  if(act==='large')u.large=!u.large;
  if(act==='help')dialog='help';
  if(act==='settings')u.app='settings';
  if(act==='home')u.app='chat';
  if(act==='clearPins')u.pins=[];
  if(act==='dismissToast')toast='';
  if(act==='cancelModal'){pending=[];sharing=null;dialog=null;returnFocus=true;}
  if(act==='send'){
   returnFocus=true;(u.chatScroll??={})[u.thread]={top:0,atEnd:true};busy=true;
   const queued=[...pending];pending=[];let skipped=false;
   for(let i=0;i<queued.length;i++){
    const action=queued[i];
    if(!actions(s,u.thread).some(a=>a.id===action)){skipped=true;continue;}
    try{flash(await command({kind:'act',action}));}catch(error){pending=queued.slice(i).filter(id=>actions(s,u.thread).some(a=>a.id===id));throw error;}
   }
   if(skipped)flash('已发送仍适用的内容；因前一项决定而失效的安排没有重复发出。');
   u.viewed.push(...s.messages.filter(m=>m.thread===u.thread).map(m=>m.id));
   if(s.contacts.includes('father')&&u.thread==='xiaoyu'&&!s.read.includes('notice'))flash('回拨入口已留在联系人里。面试通知在邮箱中。');
  }
  if(act==='sendShare'){busy=true;const doc=$('#share-doc').value,to=$('#share-to').value;flash(await command({kind:'share',doc,to}));sharing=null;switchThread(to);}
  if(act==='browserBack'&&u.historyIndex>0){u.historyIndex--;u.browser=u.history[u.historyIndex];}
  if(act==='coffee')u.coffee++;
  if(act==='bold')u.bold=!u.bold;
  if(act==='addRow'&&u.rows.length<50)u.rows.push(['','']);
  if(act==='addSlide'&&u.slides.length<20){u.slides.push({title:'新的一页',body:'',color:'cream'});u.slide=u.slides.length-1;}
  if(act==='prevSlide')u.slide=Math.max(0,u.slide-1);
  if(act==='nextSlide')u.slide=Math.min(u.slides.length-1,u.slide+1);
  if(act==='slideColor')u.slides[u.slide].color=u.slides[u.slide].color==='cream'?'green':'cream';
  if(act==='downloadWord')download('我的文档.txt',u.word,'text/plain;charset=utf-8');
  if(act==='downloadSheet')download('我的表格.csv','\ufeff'+u.rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n'),'text/csv;charset=utf-8');
  if(act==='export'){const raw=storageNotice?localStorage.getItem(SAVE_KEY):JSON.stringify({...transport.export(),ui:u},null,2);download('回来以后再联系-存档.json',raw||'{}');}
  if(act==='reset')dialog='reset';
  if(act==='resetConfirm'){transport.reset();u=structuredClone(baseUI);s=replay([]);dialog=null;storageNotice='';}
  if(act==='end')dialog='end';
  if(act==='endConfirm'){busy=true;await command({kind:'end'});dialog=null;}
  if(act==='undoEnding'){transport.undoEnding();s=replay(transport.events);}
 }catch(error){flash(error.message);}finally{busy=false;saveUI();render();}
});
$('#app').addEventListener('input',e=>{const el=e.target;if(el.id==='private-note')u.note=el.value.slice(0,15000);if(el.id==='word-editor')u.word=el.value.slice(0,40000);if(el.id==='slide-title')u.slides[u.slide].title=el.value.slice(0,120);if(el.id==='slide-body')u.slides[u.slide].body=el.value.slice(0,4000);if(el.dataset.cell){const [i,j]=el.dataset.cell.split(',').map(Number);u.rows[i][j]=el.value.slice(0,250);const out=$('.sheet-total output');if(out)out.textContent=u.rows.slice(1).reduce((n,r)=>n+(Number(r[1])||0),0).toLocaleString();}saveUI();});
$('#app').addEventListener('change',async e=>{if(e.target.id==='share-doc'){sharing.doc=e.target.value;saveUI();render();}if(e.target.id==='share-to'){sharing.to=e.target.value;saveUI();}if(e.target.id==='import-save'){try{const file=e.target.files[0];if(!file||file.size>300000)throw new Error('请选择 300KB 以内的新版 JSON 存档。');const d=JSON.parse(await file.text());transport.import(d);s=replay(transport.events);u=restoreUI(d.ui,s);pending=[];sharing=null;storageNotice='';flash('剧情与自由办公内容已恢复。');saveUI();}catch(err){flash(err.message);}render();}});
$('#app').addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='address-form'){const address=new FormData(e.target).get('address').replace(/^https?:\/\//,'').replace(/\/$/,'');const map={'chengchuan.example':'home','chengchuan.example/jobs':'jobs','intranet.chengchuan/org':'staff','help.example/report':'help'};if(map[address]){u.browser=map[address];u.history.push(u.browser);u.historyIndex=u.history.length-1;}else flash('这个地址没有模拟页面。可使用下方书签返回已有网站。');saveUI();render();}});
document.addEventListener('keydown',e=>{if(busy)return;if(e.key==='Escape'&&(pending.length||sharing||dialog)){pending=[];sharing=null;dialog=null;returnFocus=true;saveUI();render();}if(e.key==='Tab'&&$('.modal')){const focus=[...$('.modal').querySelectorAll('button:not(:disabled),select,input,summary')].filter(el=>el.getClientRects().length);if(e.shiftKey&&document.activeElement===focus[0]){e.preventDefault();focus.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===focus.at(-1)){e.preventDefault();focus[0]?.focus();}}if(e.key==='f'&&!['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.();}});
window.render_game_to_text=()=>JSON.stringify({mode:s.ending?'ending':u.started?'desktop':'prologue',app:u.app,thread:u.thread,doc:u.doc,contacts:s.contacts,visibleMessages:s.messages.filter(m=>m.thread===u.thread).slice(-5),actions:actions(s,u.thread).map(a=>({id:a.id,label:a.label})),receipts:s.receipts,call:s.call,paused:s.paused,withdrawn:s.withdrawn,application:s.application,ending:s.ending,guide:u.guide,draft:pending,coordinates:'DOM layout; origin top-left, x right, y down'});
window.advanceTime=async()=>{};
render();
