/* A bounded recollection, separate from present-day messages and task decisions. */
window.createOpeningScene=function({state:o,esc,route,button,schedule}){
 const team={
  xiaoyu:{name:'何小雨',role:'同组 · 用户服务',initial:'雨',line:'我接学员的消息。有人说附件打不开，我就来找你；要是事情不在咱们组，我负责登记转过去。别看我桌上贴得乱，找谁还是记得住的。'},
  zhou:{name:'周衡',role:'你的主管 · 运营支持组',initial:'衡',line:'先跟小雨熟悉一下课程页，今天别急着赶进度。有拿不准的地方就问。之后要对外用的复盘文字，先给我看一遍。'},
  tang:{name:'唐婧',role:'协作同事 · 工作与费用核对',initial:'婧',line:'做完的交接邮件别删，月底我核工作记录要用。留得全，我就不用一个个追着问了。工时和费用范围不清楚，也可以来找我。'}
 };
 const act=(id,text,attrs='')=>button('orient-'+id,text,attrs);
 const say=(who,text)=>`<div class="opening-dialogue" aria-live="polite"><span class="opening-avatar">${esc(who.slice(0,1))}</span><div><strong>${esc(who)}</strong><p>${esc(text)}</p></div></div>`;
 const nav=(label,disabled=false)=>`<div class="orientation-nav">${o.step?act('prev','回看上一幕'):''}${act('next',label,disabled?'disabled':'')}${act('skip','跳过回顾，保留进度')}</div>`;
 function render(){let content='';
  if(o.step===0)content=`<span class="opening-date">3 月 30 日 · 入职第一天的记忆</span><h2>这份工作，你等了三个月。</h2><p>你叫<strong>林见</strong>。上一份工作结束后，你待业了三个月。澄川网络科技给出的运营支持岗位，月薪 12,800 元，试用期两个月。你想先把这份工作做稳。</p><p>公司为“知禾学堂”运营线上课程，面向小店经营者，内容包括收支记录等。你的工位在运营支持组，负责课程页面、通知和资料支持。</p>${say('何小雨','林见？这边。电脑和邮箱已经开好了，我坐你旁边。外套放椅背就行，我带你认一下人。')}${nav('跟小雨认识同事 →')}`;
  if(o.step===1){
   const person=team[o.person||'xiaoyu'];
   const questions={job:{title:'那我每天具体做什么？',answer:'先接页面、附件和通知这些事。我把用户的问题发给你，你处理完回我，我再核一遍。第一次我跟你一起看。'},company:{title:'澄川和知禾是什么关系？',answer:'澄川是你的雇主，知禾是项目方的课程品牌。他们找我们做运营支持。老师负责讲课，我们把课程页、资料和用户消息接起来，所以你邮箱里会看到两个名字。'}};
   const question=questions[o.question];
   content=`<span class="opening-date">运营支持组 · 你的日常协作关系</span><h2>小雨把空椅子拉到你旁边。</h2><p>“周衡是咱们主管，刚从会议室出来。那边抱着一摞单子的是唐婧，月底她经常来找我们。”</p><div class="opening-team">${Object.entries(team).map(([id,p])=>act('person',`<b>${p.name}</b><small>${p.role}</small>`,`data-person="${id}" aria-pressed="${(o.person||'xiaoyu')===id}"`)).join('')}</div><div class="opening-questions" aria-label="向小雨提问">${Object.entries(questions).map(([id,q])=>act(id,q.title,`aria-pressed="${o.question===id}" aria-controls="opening-answer"`)).join('')}</div><section class="opening-response" id="opening-answer" aria-live="polite" aria-atomic="true"><p class="opening-question-title">${question?'你问：'+question.title:'认识'+person.name}</p>${say(question?'何小雨':person.name,question?question.answer:person.line)}</section>${nav('回看我做过的一件事 →')}`;
  }
  if(o.step===2){const phase=o.practice||'request';content=`<span class="opening-date">4 月 19 日 · 历史工作回顾</span><h2>后来，你接过这样一封邮件。</h2><p class="opening-note">4 月 19 日的工作已归档。可以试着重走一次，也可以直接看当时的处理和回信。</p><ol class="opening-track"><li class="${phase==='request'?'current':''}">① 收到要求</li><li class="${phase==='edit'?'current':''}">② 修改通知</li><li class="${phase==='receipt'?'current':''}">③ 查看回话</li></ol>`;
   if(phase==='request')content+=`<article class="opening-paper"><small>公司邮箱 / 04-19 / 何小雨 → 林见</small><h3>明晚公开课改到 20:00</h3><p>老师的时间调整了。明晚公开课从 <s>19:30</s> 改为 <b>20:00</b>。请同步课程页，并给报名用户补一条通知。改好后把页面和通知给我核一下。</p></article>${act('practice-edit','在回放里打开课程通知 →')}${act('practice-observe','直接看当时怎么处理的')}`;
   if(phase==='edit')content+=`<article class="opening-paper"><small>知禾学堂 / 课程通知编辑回放</small><h3>小店收支记录公开课</h3><p>何小雨刚才要求：明晚改为 20:00。</p><label for="opening-time">页面与补发通知的开课时间</label><select id="opening-time" data-opening-time><option value="19:30" ${o.time!=='20:00'?'selected':''}>19:30（原时间）</option><option value="20:00" ${o.time==='20:00'?'selected':''}>20:00</option></select><p>通知预览：明晚公开课将于 <strong data-opening-preview>${esc(o.time||'19:30')}</strong> 开始，请按新时间进入课程页。</p></article>${act('practice-check','在回放中核对修改')}${act('practice-observe','不重做了，直接看归档')}${o.practiceIssue?say('何小雨','这版还是19:30。老师改的是明晚那节，应该是20:00；后面几节先别动。你再对一下？'):''}`;
   if(phase==='receipt')content+=`${o.observed?'<p class="opening-note">以下是 4 月 19 日的实际归档：当时改为 20:00，已发补充通知。这不是刚才试填内容的发送结果。</p>':''}${say('何小雨','看到了，课程页和补发通知都没问题。后面的课不用改，谢谢。')}<p>你把这条往来留在邮箱里。那天之后，你又补过附件、整理过图表，慢慢习惯了这间办公室。</p><details class="opening-archive"><summary>展开 4 月 19 日的完整归档（只读）</summary>${(schedule.history||[]).map(([date,who,text])=>`<article><small>${esc(date)} · ${esc(who)}</small><p>${esc(text)}</p></article>`).join('')}<article><small>${esc(schedule.time)} · ${esc(schedule.from)} → 林见</small><p>${esc(schedule.body)}</p></article></details>`;
   content+=nav('回到 5 月 15 日的工位 →',phase!=='receipt');
  }
  if(o.step===3)content=`<span class="opening-date">5 月 15 日 · 入职第 47 天 · 09:05</span><h2>今天，周衡发来一项新安排。</h2><p>回忆停在这里。今天早上，你刚坐下，周衡的邮件就到了。离试用期结束还有两周，他想先看看你的工作准备。</p>${say('周衡 · 原任务邮件','今天选一件你亲手做过的工作，整理一页 Word 或 PPT，16:00 前发我。说清当时发生了什么、你做了什么、收到什么回应。我看完回你。')}${say('何小雨','明天还有新人培训，我会用共享复盘。你先整理自己的经历；培训展示是另外一份材料，之后我们再对。')}<p class="opening-note">周衡经过工位，你可以顺口问一句，也可以直接开始。</p><div class="opening-questions">${act('reply','为什么只选一件？','data-reply="why"')}${act('reply','有些结果我记不清了。','data-reply="uncertain"')}${act('reply','我要替整个项目写结论吗？','data-reply="scope"')}</div>${o.reply?say('周衡',{why:'先从一件说起，我想看看你怎么处理问题，不是让你把七周流水账都抄一遍。',uncertain:'那就翻一下原邮件。实在没确认过的先写没确认，下午我们再聊，不用现在硬凑。',scope:'不用写整个项目。讲你做的那部分就行；是别人接着做的，就把分工说清楚。'}[o.reply]):''}${route('mail','assignment','查看周衡完整任务邮件')}${nav('打开今天的工作记录 →')}`;
  if(o.step===4)content=`<span class="opening-date">5 月 15 日 · 当前工作</span><h2>桌上多了一份待写的个人稿。</h2>${say('何小雨','我把这几周的工作记录放在一起了。上个月那封改课通知也在里面，你想写别的就往前翻。发给周衡以后等他回信；培训那份，我一会儿再找你。')}<div class="opening-goal"><strong>${o.replaying?'当时的任务要求':'转正准备 · 今天尚未提交'}</strong><p>收件人：周衡<br>内容：一件亲手做过的事，写清经过、自己的动作和收到的回应。</p></div><p>${o.replaying?'这段背景到这里结束。返回后保留你现在的文件、汇报版本和同事往来。':'刚才的历史回放已经结束。接下来选择、修改仍是本机草稿；只有预览后确认发送，周衡才会收到今天的汇报。'}</p>${nav(o.replaying?'返回当前工作 →':'选一件我做过的工作 →')}`;
  return `<section class="shift-orientation opening-scene" data-opening-scene="${o.step}"><div class="opening-mode ${o.step<3?'past':'present'}"><strong>${o.replaying?'背景回看 / 原进度保留':o.step<3?'回忆 / 历史回放':'今天 / 5 月 15 日'}</strong><span>${o.replaying?'此处不重发、不改写已有汇报':o.step<3?'此处不发送邮件，不改变当前工作':'汇报尚未提交 · 等你确认发送'}</span></div>${content}</section>`;
 }
 function actOn(action,b){if(!action.startsWith('orient-'))return false;const a=action.slice(7);
  if(a==='next'){if(o.step===2&&o.practice!=='receipt')return true;if(o.step<4)o.step++;else o.done=true;}
  if(a==='prev')o.step=Math.max(0,o.step-1);
  if(a==='skip')o.done=true;
  if(a==='replay'){o.step=0;o.done=false;o.replaying=true;}
  if(a==='person'){o.person=b.dataset.person;delete o.question;}
  if(a==='job'||a==='company'){o.question=a;o.person='xiaoyu';}
  if(a==='practice-edit'){o.practice='edit';o.time??='19:30';}
  if(a==='practice-observe'){o.practice='receipt';o.observed=true;}
  if(a==='practice-check'){o.observed=false;o.practiceIssue=o.time!=='20:00';if(!o.practiceIssue)o.practice='receipt';}
  if(a==='reply')o.reply=b.dataset.reply;
  if(o.done)o.replaying=false;
  return true;
 }
 return {render,act:actOn};
};
