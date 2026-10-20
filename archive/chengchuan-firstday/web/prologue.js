/* The opening lives outside the game save: replaying it never changes work. */
window.createPrologue=function({onEnter}){
  const SEEN='chengchuan-prologue-v1';
  const pages=[
    {chapter:'三个月前',title:'你需要一份工作。',body:['你叫林见。离开上一家公司后，已经待业了三个月。','投出去的简历越来越多，回复却越来越少。房租不会等。']},
    {chapter:'3 月 30 日',title:'这一次，对方说：欢迎加入。',body:['澄川网络科技有限公司。运营支持，月薪 12,800 元，试用期两个月。','公司为知禾学堂维护课程资料、发送通知、回应用户的问题。办公楼、合同、入职培训，一样不少。','你补发过打不开的课件，也收到过一句认真的谢谢。']},
    {chapter:'5 月 15 日 · 星期一',title:'入职第七周。',body:['工资准时到账。你熟悉了同事和桌面上那些办公软件。','今天，主管周衡要你从亲手做过的工作中选一个案例，提前整理转正汇报。','你放下包，坐到工位前。'],note:'从今天的任务邮件开始。可以自由办公与休息，没有隐藏倒计时。进度保存在当前浏览器。人物、公司和收发行为均为虚构模拟。'}
  ];
  const root=document.createElement('section');root.id='prologue';root.hidden=true;
  root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','故事序幕');document.body.append(root);
  let open=false,index=0,paused=false,busy=false,autoTimer,transitionTimer,entranceTimer,returnFocus;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function clearTimers(){clearTimeout(autoTimer);clearTimeout(transitionTimer);clearTimeout(entranceTimer);}
  function seen(){try{return localStorage.getItem(SEEN)==='complete';}catch{return false;}}
  function controls(){
    root.querySelector('[data-prologue="prev"]').disabled=index===0||busy;
    root.querySelector('[data-prologue="next"]').disabled=index===pages.length-1||busy;
    const pause=root.querySelector('[data-prologue="pause"]');pause.hidden=index===pages.length-1;pause.textContent=paused?'继续自动播放':'暂停自动播放';pause.setAttribute('aria-pressed',String(paused));
    root.querySelector('[data-prologue="skip"]').hidden=index===pages.length-1;
    root.querySelector('.prologue-count').textContent=`${String(index+1).padStart(2,'0')} / 03`;
    root.querySelector('.prologue-progress').style.setProperty('--page',index+1);
  }
  function schedule(){clearTimeout(autoTimer);if(open&&!paused&&!busy&&!document.hidden&&index<pages.length-1)autoTimer=setTimeout(()=>go(index+1),10500);}
  function content(){const p=pages[index];root.querySelector('.prologue-page').innerHTML=`<p class="prologue-chapter">${p.chapter}</p><h1 id="prologue-title">${p.title}</h1><div class="prologue-story">${p.body.map(t=>`<p>${t.replaceAll('\n','<br>')}</p>`).join('')}</div>${p.note?`<p class="prologue-note">${p.note.replaceAll('\n','<br>')}</p><button class="prologue-enter" data-action="start">${root.dataset.resume==='true'?'返回工作空间':'进入工作空间'} <span aria-hidden="true">→</span></button>`:''}`;controls();}
  function go(next){
    if(!open||next===index||next<0||next>=pages.length)return;
    clearTimers();busy=true;controls();const page=root.querySelector('.prologue-page');page.classList.add('fading');
    const commit=()=>{if(!open)return;index=next;content();page.classList.remove('fading');busy=false;controls();schedule();if(index===pages.length-1)root.querySelector('[data-action="start"]').focus({preventScroll:true});};
    if(reduced.matches)commit();else transitionTimer=setTimeout(commit,1100);
  }
  function show(resume=false){
    clearTimers();returnFocus=document.activeElement;open=true;index=0;paused=reduced.matches;busy=false;
    root.dataset.resume=String(resume);root.hidden=false;document.body.classList.add('prologue-open');document.querySelector('#desktop').inert=true;
    root.innerHTML='<header class="prologue-header"><span>澄川协作 <i> / </i> 序幕</span><button data-prologue="skip">跳过序幕 →</button></header><div class="prologue-center"><article class="prologue-page fading" aria-live="polite" aria-atomic="true"></article></div><footer class="prologue-footer"><div class="prologue-progress" aria-hidden="true"></div><div class="prologue-navigation"><button data-prologue="prev" aria-label="上一页">← 上一页</button><span class="prologue-count"></span><button data-prologue="next" aria-label="下一页">下一页 →</button><button data-prologue="pause"></button></div></footer>';
    if(resume){root.querySelector('[data-prologue="skip"]').textContent='跳过序幕，继续存档 →';root.querySelector('.prologue-header span').textContent='澄川协作 / 序幕 · 已保留你的进度';}
    content();root.querySelector('[data-prologue="next"]').focus({preventScroll:true});
    const reveal=()=>{root.querySelector('.prologue-page').classList.remove('fading');schedule();};
    if(reduced.matches)reveal();else entranceTimer=setTimeout(reveal,60);
  }
  function finish(){if(!open||index!==pages.length-1||busy)return;clearTimers();open=false;root.hidden=true;root.innerHTML='';document.body.classList.remove('prologue-open');document.querySelector('#desktop').inert=false;try{localStorage.setItem(SEEN,'complete');}catch{}onEnter();if(returnFocus?.isConnected&&returnFocus!==document.body)returnFocus.focus({preventScroll:true});}
  root.addEventListener('click',e=>{const action=e.target.closest('[data-prologue]')?.dataset.prologue;if(action==='skip')go(pages.length-1);else if(action==='pause'){paused=!paused;controls();schedule();}else if(!busy&&action==='prev')go(index-1);else if(!busy&&action==='next')go(index+1);});
  document.addEventListener('visibilitychange',schedule);
  document.addEventListener('keydown',e=>{
    if(!open)return;
    e.stopImmediatePropagation();
    if(e.key==='Escape'){e.preventDefault();paused=true;controls();schedule();}
    if(!busy&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();go(index+(e.key==='ArrowRight'?1:-1));}
    if(e.key==='Tab'){const buttons=[...root.querySelectorAll('button')].filter(b=>!b.disabled&&!b.hidden&&b.getClientRects().length);const current=buttons.indexOf(document.activeElement);e.preventDefault();buttons[(current+(e.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();}
  },true);
  return {show,finish,seen,snapshot:()=>({open,page:index+1,total:pages.length,paused,transitioning:busy})};
};
