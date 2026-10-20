// Afternoon events are evaluated against delivered messages, never the player's reading history.
export const afternoonDocuments={
 current:{title:'知禾后续服务说明_0515',body:'版本：2023-05-15｜项目业务端提供\n所列运营主体：知禾在线服务有限公司\n项目联系：沈念；业务问题确认：陆承\n\n服务内容：账户内投资相关信息与操作服务。具体业务条件另行提供，普通介绍不办理申请。\n课程通知、学习资料由澄川课程服务处理；后续联系可由课程服务介绍，也可直接咨询项目联系人。\n资金安排：用户资金由衡序托管服务有限公司独立托管，项目业务团队不直接保管。\n问题反馈：课程问题由国内答复；账户及资金事项提交项目业务端。\n\n本页不是个人申请或交易凭证。'},
 cases:{title:'服务经办记录_0516',body:'工作记录，非用户结果。\nC-0509-12｜罗青 U-0427｜05-09款项进度询问｜何小雨→沈念；05-10接收，转陆承。\nC-0510-06｜许川 U-0608｜05-10后续服务介绍｜何小雨→沈念；已接收。\n\n本人历史工作：04-07 林见补发罗青课程资料；用户确认可以打开。课程往来仍在原邮件线程。\n当前联系另见实时预约记录，不以历史日期覆盖。'},
 luoOld:{title:'罗青留存：后续服务说明_0420',body:'来源：罗青留存的4月20日项目介绍页。\n提供人：沈念。运营主体：知禾在线服务有限公司。\n资金安排：用户资金由衡序托管服务有限公司独立托管，项目业务团队不直接保管。\n\n罗青说明：这是当时介绍给我的版本，不是五月的新页。允许转给处理此事的项目同事；我的个人邮件请不要直接转给其他学员。'},
 luoReply:{title:'罗青提供：衡序查询与回复原邮件',body:'来源：罗青转交，林见尚未独立向机构核实。\n05-11 罗青→衡序公开业务联系邮箱：我收到知禾在线服务有限公司的说明，写用户资金由贵司独立托管，请问是否有该合作？附4月20日说明页。\n05-16 衡序业务联系邮箱→罗青：经查，我司未与知禾在线服务有限公司开展上述用户资金托管合作，未授权该公司使用我司名称作此宣传。\n\n罗青：我先前以为课程这边介绍的是同一套服务。现在我只想弄清谁把这句话给我的、钱怎么回来。原邮件可转项目处理同事，先不要转其他学员。'},
 contact:{title:'衡序 · 公开业务联系',body:'衡序托管服务有限公司\n业务合作核实：business@hengxu.example\n请写明待核的完整公司名称、所见宣称及来源。业务回复由人工处理，收到询问不等于已核实。\n\n这是游戏内虚构机构与模拟邮箱，不会向现实机构发送消息。'},
 replacement:{title:'知禾一般服务说明_0516',body:'周衡与陆承确认供国内窗口使用。\n账户内投资相关信息与操作服务；具体业务条件向项目侧咨询。\n课程支持由国内处理，业务问题转沈念／陆承。\n原0515页暂停使用；本页删除资金托管表述。\n既有用户提出的问题，按原往来回复，不以此页代替答复。'}
};

export function afternoonCommand(s,c,h){
 const {tell,history,give,documents}=h;
 const pm=s.pm,refs=c.attachments||[],to=Array.isArray(c.to)?[...new Set(c.to)]:[c.to].filter(Boolean);
 const mail=(from,targets,subject,body,attachments=[],pub=false)=>tell(s,from,targets,subject,body,{attachments,public:pub,channel:c.type==='CHAT'&&!pub&&((from==='lin'&&targets.length===1)||(from===c.to&&targets.length===1&&targets[0]==='lin'))?'chat':'mail'});
 const knows=(who,ref)=>s.known[who]?.includes(ref);
 const mark=(who,ref)=>{s.known[who]??=[];if(!knows(who,ref))s.known[who].push(ref);};
 const grant=(id)=>give(s,id);
 function log(text){history(s,text);}
 function userReply(body){mail('xu',['xiaoyu'],'Re: 后续服务',body,[],true);}
 function publicNote(body,attachments=[]){mail('xiaoyu',['xu'],'后续服务记录',body,attachments,true);}
 function restriction(kind,silent=false){if(pm.contact==='stopped')return;pm.contact=kind;if(pm.meeting==='scheduled'){pm.meeting=kind==='stopped'?'cancelled':'paused';s.appointment=kind==='stopped'?'cancelled':'paused';log('许川收信后调整联系范围，尚未开始的普通介绍不再进行。');}if(silent)return;if(kind==='stopped')userReply('那我不接下一步了。不要再把我交给业务人员；已有问题、更正说明在这封里说清楚。');else if(kind==='questions_only')userReply('这项能确认了再给我说，介绍材料先别继续发。');}
 function xyPosition(){if(pm.continued&&knows('xiaoyu','luoReply')&&!pm.xyRefused){pm.xyRefused=true;pm.newOwner='zhou';mail('xiaoyu',['zhou','lin'],'Re: 后续介绍安排','机构回复我看到了。旧问题没解释清，新介绍我不署名。罗青和许川已经问的事我继续跟。');mail('zhou',['xiaoyu','lin'],'后续分工','新的一般介绍由我确认。你保留现有用户问题的登记与回信，不再给新介绍署名。');log('小雨收到机构回复后拒绝新介绍；周衡接手，新旧事项分开经办。');}}
 function continueBusiness(){if(pm.continued)return;pm.continued=true;grant('replacement');mail('zhou',['lu','lin'],'说明页使用范围','原0515页先停用。后续一般服务仍按范围介绍，请你确认给国内窗口的新页，并同步境外项目组。');mail('lu',['zhou','lin'],'Re: 说明页使用范围','境外项目组这边改页，沈念统一使用新版。原用户问题继续按各自线程回复。',['replacement']);mail('zhou',['xiaoyu','lin'],'后续介绍安排','现行页停止使用，新版只介绍服务范围。有意了解的用户仍可介绍给沈念；已经要求停止的不要再推。旧问题继续追回信。',['replacement']);log('周衡与陆承确认停用原页、继续一般介绍；许川的个人联系限制不变。');xyPosition();}
 function luAnswer(){const older=knows('lu','luoOld'),denial=knows('lu','luoReply')||knows('lu','reportedDenial');if(!denial)return '这项业务依据我来收口。你问的合作确认还没补到，先按收到的版本把具体问题列清。';
  if(older){mark('lu','answeredOld');return '你发来的四月页与五月页确实都有这一句，不能只按五月新增处理。两版都先停用；这句话怎么进入旧页、给过哪些人，我另查。之前发出的解释保留在往来里。';}
  mark('lu','claimedMay');return '这是五月十五日这版新增的表述，我让人撤掉。先不要再用这页；旧用户的具体问题另跟。';}
 function discuss(who,text,attachments,meeting=false){
  const t=text.trim().replace(/(?:不是问|不是说|不问)[^，。；;!?！？]*(?:[，。；;!?！？]|$)/g,'').replace(/^.*(?:我只问|我问的是)/,''),prior=pm.memory[who];
  const targets=meeting?['lin','xiaoyu','xu','shen']:[who];
  const topicText=/^(那|所以|这件|这条|现在呢|然后呢|谁确认的|有依据吗)/.test(t)&&prior?prior.focus+'；'+t:t;
  const answers=[];
  if(who==='xu'&&!meeting&&!attachments.includes('luoReply')&&!/更正|撤回|否认|没有合作/.test(t)){mail('xu',['lin'],'Re: 你的问题','我也没有合作确认，正在等经办人的说明。请不要把我的愿意听介绍当作已经确认业务。');return;}
  const custody=/托管|衡序|合作.*(确认|证明|合同)|谁.*(核|管钱|确认)|钱.*(别人|哪里|在哪)|真的吗|靠谱|可信吗/.test(topicText);
  const denial=attachments.includes('luoReply')||/衡序.*(否认|没有合作|未.*合作)|机构.*(否认|回复.*没有)|罗青.*回复.*(没有|否认)/.test(t);
  const older=attachments.includes('luoOld')||/四月|4月|0420|旧页/.test(t);
  if(older)mark(who,'luoOld');if(denial)mark(who,'reportedDenial');
  if(/罗青|旧用户|两万/.test(topicText)&&!denial)answers.push(who==='xiaoyu'?(knows(who,'luoReply')?'罗青新转来的查询回复我收到了。她的原款项问题还没有结果，我继续追；收到机构否认后，新介绍我不能当作没看见。':knows(who,'luoMay12')?'她12日那封本人回信你已转给我：申请取回的款项仍未到账。项目侧没有新的业务答复，我继续追。':'她5月9日说申请取回两万元还没收到。我转沈念，她说交陆承。有没有答到她，我没有新回执。'):who==='shen'?'她那条我转陆承了，还没拿到业务答复。许川这次是介绍，接业务问题的仍是同一组人。':'个人款项结果要查原反馈，我手里没有银行到账记录。');
  if(/境外|在哪|哪里.*(工作|办公)|国内|业务|课程|服务费|谁.*(决定|负责|确认.*版本)|还.*介绍/.test(topicText)&&!custody){
   answers.push(who==='tang'?'国内不是只发一次联系人。介绍、登记、转交和持续协作都在付费交付范围；归档为境外项目服务。这不是用户个人转款记录。':who==='shen'||who==='lu'?'账户内投资相关服务由境外项目组做。业务页陆承确认，国内发给学员的版本再和周衡对。课程仍由国内处理。':who==='xiaoyu'?'课程资料我答；后续介绍也是我接，用户再回来问，我还得转问题、追回信。业务结果不是我能定的。':pm.continued?'原页已停用，一般介绍继续。用户明确不想再接的，按他的要求停止。':'公司按委托做课程运营、介绍与持续协作。具体账户业务由项目侧答。');if(who==='tang'){grant('fees');}}
  if(custody&&!denial)answers.push(who==='shen'?'这句来自项目说明。我没有能提供的合作确认，也没有亲自向衡序核过。合作文件要陆承给。':who==='xiaoyu'?'我收到的准入记录只写入口和联系人测试。我没有联系衡序确认过合作。':who==='zhou'?'国内准入核的是服务范围、入口和联系人。你问的合作文件仍要项目业务方提供。':who==='lu'?luAnswer():'服务费附件没有托管合作确认。那是业务资料的问题。');
  if(denial){if(meeting){for(const person of targets)mark(person,'reportedDenial');restriction('stopped');}else if(who==='xu'){restriction('stopped');return;}
   answers.push(who==='lu'?luAnswer():who==='zhou'?'这份回复与现行页的说法不一致，原页先停用。我找陆承确认新页和后续安排。':who==='xiaoyu'?'我收到你说的机构答复了。原先那句不能再照发。已经问来的问题我继续跟，许川的对客说明要按他实际收到的内容更正。':who==='xu'?'这与刚才的说明不一样。后续业务联系请停止，解释回原线程。':'这份回复我需要转陆承核对；先别按原句介绍。');if(who==='zhou')continueBusiness();}
  if(who==='lu'&&older&&!denial&&(knows(who,'reportedDenial')||knows(who,'luoReply')))answers.push(luAnswer());
  if(/诈骗|骗子|一伙|故意骗|收了.*钱/.test(topicText)&&!denial)answers.push(who==='xiaoyu'?'介绍是我做的。但你说我保证过哪句、钱去了哪儿，请对到原记录。我不能补一个我不知道的结果。':'你提出的是资金与责任判断。请把具体来源发来，服务委托不能替代个人转款记录。');
  if(/(?:请|麻烦).*(?:转问|转给|问一下).*(?:陆承)/.test(t)&&who==='shen'){mail('shen',['lu'],'转询：'+t.slice(0,25),t,attachments);mail('shen',['lin'],'已转陆承','已把这次问题原文转陆承，收到回复后沿这封续。');mail('lu',['shen','lin'],'Re: 业务问题',luAnswer());}
  if(custody&&meeting&&!denial){restriction('questions_only');if(!pm.custodyAsked){pm.custodyAsked=true;mail('xiaoyu',['lu'],'许川会议问题','许川要求先回复衡序托管合作依据，再谈后续。请提供合作确认。');}}
  if(who==='luo'&&/两万|钱.*回|收到钱|谁.*发|还.*转|四月|五月|报警/.test(t)){if(/两万|钱.*回|收到钱/.test(t))answers.push('我要取回的是两万，前后交的是五万八。钱还没有回来，最后去了哪我没查出来；机构只答了有没有合作。');if(/谁.*发|还.*转/.test(t))answers.push('服务页是沈念给我的。相关原页和合作查询按已说的项目处理范围用；给其他学员前再问我。');if(/四月|五月/.test(t))answers.push(knows('luo','current')?'你发来的五月页还是同一句。机构回复写的是截至今天没有这项合作。':'机构回复说截至今天。我没拿到你提的五月页，发相关原文我才能看。');if(/报警/.test(t))answers.push('我的材料我会继续向警方说明，不再只等公司同意。');}
  if(!answers.length)answers.push(who==='xu'?'你说的哪一项？我今天只了解服务，不办理申请。若是更正前一封，请写清更正哪句话。':who==='luo'?'你想问课程补资料那次，还是后来的服务介绍？我可以把自己实际收到的原件给经办同事，不代表我知道公司的内部安排。':prior?'你是在追问刚才那件事，还是改了问题？把具体对象再说一下，我不替你猜安排。':'你指哪一项、哪封原话？请说具体一点，我按自己经手的答。');
  let reply=[...new Set(answers)].join('\n\n');const baseReply=reply;
  if(prior?.baseReply===baseReply&&prior.text!==t){reply=custody?'你追问的是谁做过确认：目前仍没有补到合作文件。上一封说的是我实际掌握的范围。':denial?'沿用你已经发来的原件处理，暂无新的业务答复。之前的说法和修订都保留在往来里。':'这项没有新增进展，之前给你的范围仍然有效。你若在问另一件事，请把对象说清楚。';}
  if(prior?.text===t&&prior.reply===reply)return; // No repeated fixed speech or side effects.
  pm.memory[who]={text:t,reply,baseReply,focus:topicText};
  if(meeting)pm.transcript.push({who,text:reply});else mail(who,['lin'],'Re: '+t.slice(0,28),reply,who==='tang'&&/费用|服务费/.test(t)?['fees']:[]);
 }
 function meetingEnd(){if(pm.meeting==='finished')return;pm.meeting='finished';pm.attending=false;pm.stage='aftermeeting';s.appointment='completed';if(pm.contact==='information')userReply('我先看看说明。今天不办，也先别约下一场。有新内容，小雨在这封里发我。');publicNote('普通介绍已完成，未开户、未进行账号演示。沈念介绍了账户内投资相关服务。\n许川当前要求：'+({information:'可在原线程补服务资料，不预约下一场。',questions_only:'只回复已提出的问题，不再续发介绍。',stopped:'停止后续业务联系；仅回解释或更正。'}[pm.contact])+(pm.guaranteeXu?'\n林见曾表示国内已确认合作，许川仍在等依据。':'')+(pm.correctedXu?'\n林见已更正此前合作核验表述，许川已收到。':''));log('普通介绍完成；用户要求与实际发言保留。');}
 if(c.type==='AFTERNOON'){
  if(pm)return true;if(s.phase!=='lunch')throw Error('先保存上午工作，才能开始下午。');
  s.phase='afternoon';s.pm={stage:'desk',meeting:s.appointment==='paused'?'paused':'scheduled',attending:false,contact:s.appointment==='paused'?'written_only':'information',continued:false,newOwner:'xiaoyu',xyRefused:false,guaranteeXu:false,correctedXu:false,externalQuery:'none',permission:false,transcript:[],memory:{},sent:[]};
  for(const id of ['current','cases','contact'])grant(id);
  for(const who of ['xiaoyu','zhou','tang','shen'])if(c.legacy?.known?.[who]?.includes('luo'))mark(who,'luoMay12');
  if(c.legacy?.fees)grant('fees');if(c.legacy?.intro)grant('luoIntro');
  mail('shen',['xiaoyu',...(s.participation==='declined'?[]:['lin'])],'普通介绍用页','现行说明附上。普通介绍只讲范围；资料问题记具体页，需要业务确认的再转陆承。',['current']);
  mail('xiaoyu',['xu'],'后续服务说明','这是沈念提供的现行说明。我转给您，里面的业务安排由项目方说明。',['current'],true);
  if(s.appointment==='paused')userReply('原来后面不是继续上课。我先看看，今天不另约，下午那段时间安排别的事了。');
  if(s.participation!=='declined')mail('xiaoyu',['lin'],s.appointment==='paused'?'许川文字说明':'15:10 普通介绍',s.appointment==='paused'?'仍按上午说的发文字，今天先不约。罗青那条我也还在跟，同一个项目端接的。':'许川已确认15:10，我经办，沈念介绍。有空可以旁听，我先问他同不同意。'+(knows('xiaoyu','luoMay12')?'罗青12日的本人回信我已经收到，项目还没有新的业务结果。':'罗青款项询问还只有项目接收记录。')+'许川如果问出了问题找谁，我也想问清楚。',['cases']);
  if(c.legacy?.luoRequested){grant('luoOld');grant('luoReply');mail('luo',['lin'],'Re: 你之前问的服务进展','沿上次往来补两份原件：我11日自行问了衡序，今天回了。原件可给项目处理同事，给其他学员前请再问我。',['luoOld','luoReply']);}
  if(s.verification==='pending')mail('shen',['lin'],'Re: 上午资料来源询问','准入时的主体和入口资料、现行页都是业务端整理给国内的。你要问哪一项，我找对应的人答。');log('13:30 午休结束，保留上午安排与参与范围。');return true;
 }
 if(!pm)return false;
 if(c.type==='LUNCH')return true;
 if(c.type==='PM_JOIN'){
  if(pm.stage==='closed')throw Error('今日已下班，会议不能补开。');if(pm.meeting!=='scheduled')throw Error('当前没有可加入的预约；原联系记录仍可查看。');
  mail('xiaoyu',['xu'],'关于旁听','课程同事林见想旁听普通服务介绍，可以吗？',[],true);userReply('可以，今天只说服务，不讲个人账户。');pm.attending=true;pm.meeting='active';pm.stage='meeting';
  pm.transcript=[{who:'xiaoyu',text:'今天先说服务，不办账号。'},{who:'xu',text:'我是上课认识你们的，后面也是你们做吗？有事还能找小雨吗？'},{who:'shen',text:'课程资料仍找小雨。后面是账户里的投资相关服务，业务问题我这边接，小雨也能转。今天不需要你决定。'},{who:'xu',text:'材料留给我，我再考虑。'}];log('经许川同意，林见旁听；原经办仍是小雨。');return true;
 }
 if(c.type==='PM_LEAVE'){if(pm.meeting==='active')meetingEnd();return true;}
 if(c.type==='PM_LATE'||c.type==='PM_CLOSE'){
  if(pm.stage==='closed'||c.type==='PM_LATE'&&pm.stage==='late')return true;if(['scheduled','active'].includes(pm.meeting))meetingEnd();pm.stage=c.type==='PM_CLOSE'?'closed':'late';s.phase=c.type==='PM_CLOSE'?'closed':'afternoon';log(c.type==='PM_CLOSE'?'17:30 今日工作已保存；未回复、未发送与来源待核分别保留。':'16:30 联系记录已归档。未答问题保留，不自动生成核验结果。');return true;
 }
 if(!['PM_SEND','PM_SAY','CHAT'].includes(c.type))return false;
 if(pm.stage==='closed')throw Error('今日已保存下班。可以继续查阅和自由办公，工作发送留待下一天。');
 const text=String(c.text||'').trim();if(!text||text.length>6000)throw Error('请先写下要说的具体内容。');
 const meeting=c.type==='PM_SAY';if(meeting&&(!pm.attending||pm.meeting!=='active'))throw Error('尚未加入会谈。');
 const dest=meeting?['xiaoyu','shen','xu'] : to;
 if(!dest.length||dest.some(x=>!['xiaoyu','zhou','tang','shen','lu','luo','xu','hengxu'].includes(x)))throw Error('请选择实际收件人。');
 if(!Array.isArray(refs)||refs.some(x=>!documents[x]||(!documents[x].public&&!s.grants.includes(x))))throw Error('附件尚未提供。');
 if((refs.includes('luoReply')||refs.includes('luoOld'))&&(dest.includes('xu')||dest.includes('hengxu'))&&!pm.permission)throw Error('罗青只允许项目同事处理原件。请先询问对外转交许可，或不附私人原件、只说明事实。');
 const action=meeting?'question':c.action||'question';
 const actionRecipients={hold:['xiaoyu','zhou'],resume:['xiaoyu'],decline:['xiaoyu','zhou'],permission:['luo']};if(actionRecipients[action]&&dest.some(w=>!actionRecipients[action].includes(w)))throw Error('此事项请发给对应经办人：'+({hold:'何小雨或周衡',resume:'何小雨',decline:'何小雨或周衡',permission:'罗青'}[action])+'。');
 const requestText=text.replace(/^不是拒绝联系[^，。；]*[，。；]\s*(?:是)?/,'');
 const sig=JSON.stringify([action,dest.slice().sort(),text,refs.slice().sort(),c.sourceMessage||'',pm.meeting,pm.contact,pm.continued,pm.guaranteeXu,pm.correctedXu,s.participation]);
 if(pm.sent.includes(sig))return true;
 if(c.sourceMessage){const original=s.messages.find(m=>m.id===c.sourceMessage);if(!original||!(original.public||original.to.includes('lin')||original.from==='lin'))throw Error('原邮件不在可转交范围内。');if(original.from==='luo'&&dest.some(x=>['xu','hengxu'].includes(x))&&!pm.permission)throw Error('请先取得罗青对外转交原邮件的许可。');}
 const original=c.sourceMessage?s.messages.find(m=>m.id===c.sourceMessage):null;
 const deliveredRefs=[...new Set([...refs,...(original?.attachments||[])])];
 if(deliveredRefs.some(x=>['luoOld','luoReply'].includes(x))&&dest.some(x=>['xu','hengxu'].includes(x))&&!pm.permission)throw Error('原邮件含罗青的私人原件，需先取得对外转交许可。');
 const body=text+(original?'\n\n——转交原件——\n'+original.subject+'\n'+original.body:'');
 if(meeting)pm.transcript.push({who:'lin',text});else{const sent=mail('lin',dest,({question:'工作询问',forward:'转交与补充',hold:'暂缓本次联系',resume:'重新询问时间',decline:'调整参与范围',correct:'更正此前说明',permission:'原件转交许可'}[action]||'工作往来'),body,refs);s.receipts.push({id:sent.id,signature:sig});}
 for(const who of dest){for(const ref of refs)mark(who,ref);if(original){for(const ref of original.attachments)mark(who,ref);if(original.from==='luo')mark(who,'reportedDenial');}}
 const guarantee=/(?:已|已经|都|公司)审核过|可以放心|确认过合作|保证.*没问题/.test(text)&&!/[?？吗]|不|未|没有|没核|撤回|收回|更正|是否/.test(text);
 const correction=action==='correct'||/撤回|收回|更正|我.*说错|刚才.*没依据/.test(text);
 for(const who of dest){
  const reply=b=>mail(who,['lin'],'Re: 工作往来',b);
  if(action==='permission'&&who==='luo'){pm.permission=true;reply('可以转这次合作查询的邮件和四月页给许川、公开机构。仅限核这项说法，不附我的账户或其他私人信息。');continue;}
  if(who==='hengxu'){if(pm.externalQuery==='none'){pm.externalQuery='pending';reply('业务询问已收，完整主体与宣称会转人工核实。预计下一工作日回复。此回执不代表合作确认。');}continue;}
  if(who==='luo'&&!s.grants.includes('luoReply')&&/原件|查询|托管|衡序|回复|经历|进展|后来|服务|发生|资料|说明/.test(text)){
   grant('luoOld');grant('luoReply');reply('你4月帮我补过课件，我还留着邮件。后来小雨给了沈念的联系，我收到账户服务介绍，以为课程这边已经了解过。5月9日申请取回的两万元没到，我找小雨帮问。11日我自己写信问衡序，今天回了。你看两份原件；可给项目处理同事，先别给其他学员。');mail('luo',['lin'],'Re: 原往来补充','四月介绍页与我独立查询的原邮件附上。来源请照实写，不要写成你自己已向机构核实。',['luoOld','luoReply']);continue;
  }
  if((action==='hold'||/^(?:请|麻烦).*(?:暂缓|先不要联系|先别约)/.test(text))&&['xiaoyu','zhou'].includes(who)){
   if(['finished','active'].includes(pm.meeting)){restriction('questions_only');reply('已经发生的会谈保留。后续只回问题，不再续发介绍。');}else{pm.meeting='paused';s.appointment='paused';pm.contact=pm.contact==='stopped'?'stopped':'written_only';publicNote('本次联系先不安排，原时段已释放，说明沿这封回复。');userReply('好，今天不再约。我安排其他事了。');reply('已告知许川，今天没有预约。');}continue;
  }
  if((action==='resume'||/^请.*(重新|再).*(问|约)/.test(text))&&who==='xiaoyu'){
   if(pm.contact==='stopped'){reply('许川已经要求停止业务联系，我不会重发邀请。可回复原问题或更正。');continue;}
   if(pm.meeting==='paused'){mail('xiaoyu',['xu'],'重新询问联系时间',text,[],true);userReply('今天已经安排别的事，先不约；原问题有答复发这封就好。');pm.contact='questions_only';reply('重新询问已送达；许川今天不约。原时段没有恢复。');}else reply('当前安排已经有记录，不再重复预约。');continue;
  }
  if((action==='decline'||/^(?:我不参与|我不接|请不要安排我)/.test(requestText))&&['xiaoyu','zhou'].includes(who)){s.participation='declined';if(pm.attending)meetingEnd();reply('收到。你不参与新介绍；现有用户事项我另行分工。你经手的旧记录仍可查，拒绝不等于替用户取消联系。');log('林见拒绝参与新介绍，现有预约与用户意愿分别保留。');if(/罗青|旧记录|旧页/.test(text))discuss(who,text,refs,false);continue;}
  if(['xiaoyu','zhou'].includes(who)&&/我可以.*核.*(?:原|旧)|只核.*(?:原页|旧记录)/.test(text)){s.participation='records_only';reply('好，你只核旧记录，不接新介绍。许川仍由小雨回；不会把你加进会议或推荐稿。');continue;}
  if(guarantee){mark(who,'guarantee');if(who==='xu'){pm.guaranteeXu=true;pm.correctedXu=false;userReply('你看过那份合作确认？那一起给我，我就不用另外找你们问了。今天我仍不办理。');}else reply(who==='xiaoyu'?'你说核过，是拿到了新资料吗？我这里只有项目说明。请把依据给我。':'你指哪份确认？国内准入不包含衡序合作确认。');continue;}
  if(correction){if(who==='xu'){pm.correctedXu=true;pm.guaranteeXu=false;userReply('更正收到了，那前面那句我不作为依据。合作的具体答复请回这封，业务介绍先停。');restriction('questions_only',true);}else{if(who==='xiaoyu'&&/请.*(转告|转给|发给).*许川/.test(text)){mail('xiaoyu',['xu'],'更正说明',text,[],true);pm.correctedXu=true;pm.guaranteeXu=false;userReply('更正收到，后续先回合作问题，不继续介绍。');restriction('questions_only',true);reply('已把你的更正转给许川。他收到了，现在只等合作问题的答复，不再沿用先前的保证。');}else reply(knows(who,'guarantee')?'我收到更正了。原话仍留档；许川还没收到这封。':'你的当前说法我收到了；我不替没收到这封的人确认已更正。');}continue;}
  if(who==='zhou'&&/停止所有|全部暂停|不要再介绍|停止介绍/.test(text)){reply(pm.continued?'原页已停用，一般介绍仍继续，由我确认。你不愿署名可以明确调整自己的参与范围。':'我收到你的暂停建议。请把具体争议与来源给我，我先核涉及的页面。');}
  if(who==='xiaoyu'&&/^请.*(转给|转告|发给).*许川/.test(text)){
   mail('xiaoyu',['xu'],'转交林见的说明',text,refs,true);if(refs.includes('luoReply')||/衡序.*(没有|否认)|机构.*否认/.test(text))restriction('stopped');else if(/托管|衡序|合作.*确认/.test(text))restriction('questions_only');reply('原文已沿用户线程转达，许川的回复在同一往来保留。');
  }
  if(!meeting)discuss(who,body,deliveredRefs,false);
 }
 if(meeting&&!guarantee&&!correction)discuss('shen',body,deliveredRefs,true);
 if(meeting&&guarantee){pm.transcript.push({who:'xu',text:'你看过那份合作确认？那一起给我，我就不用另外找你们问了。今天仍不办理。'});}
 if(meeting&&guarantee)mail('xiaoyu',['lin'],'会谈里的合作确认','许川听到了你的确认。你看过哪份新依据？我这里只有说明页。');
 xyPosition();pm.sent.push(sig);pm.sent.push(JSON.stringify([action,dest.slice().sort(),text,refs.slice().sort(),c.sourceMessage||'',pm.meeting,pm.contact,pm.continued,pm.guaranteeXu,pm.correctedXu,s.participation]));return true;
}
