import {morningReply} from './morning-dialogue.mjs';
import {afternoonCommand,afternoonDocuments} from './afternoon.mjs';
// Pure narrative domain. No DOM, network, global session state, or wall-clock timers.
export const documents={
 ...afternoonDocuments,
 entry:{title:'知禾账户 · 后续服务预约',public:true,body:'联系人：沈念\n候选时段：05-16 14:30（尚待用户确认）\n本次安排：账号内功能演示\n会前准备：开通项目账号，完成基本服务意向填写。\n如只需一般介绍或不便完成准备，请联系项目对接人调整安排。'},
 intro:{title:'许川后续联系 · 历史线程',public:true,body:'05-10 14:06 何小雨：你问的后续服务，可以介绍项目上的联系人给你。需要的话我把入口发过来，你先了解。\n14:19 许川：可以，发我看看。\n14:27 何小雨：入口已附。进去后可以联系沈念，说明是课程这边介绍的。\n05-15 16:12 何小雨：上次你说周二下午方便，项目侧暂留了14:30。明早确认，不方便可以另约。'},
 scope:{title:'国内服务范围 · 执行版',public:true,body:'委托方：知禾在线服务有限公司。国内承接：澄川网络科技有限公司。\n课程运营；用户同意后的联系人介绍；后续问题登记、转交和进展记录。\n国内审核：周衡。项目侧联系人：沈念；业务反馈：陆承。\n国内窗口不决定账户申请、不承诺转回日期。'},
 admission:{title:'知禾项目_国内服务准入记录_0324',body:'委托方：知禾在线服务有限公司\n国内承接：澄川网络科技有限公司\n资料提交：沈念　国内审核：周衡\n\n服务范围：课程运营；用户同意后的联系人介绍；后续问题登记、转交和进展记录。\n\n主体资料扫描件——已收\n国内服务清单——已核对\n项目联系人——已完成收件测试\n用户咨询入口——已测试\n\n审核意见：按约定范围开展国内服务。具体业务问题由项目侧答复。\n附件目录：主体资料、服务清单、联系人与测试记录。\n03-24｜周衡'},
 fees:{title:'服务委托 · 费用范围节选',body:'委托方：知禾在线服务有限公司。项目侧归档：境外项目服务。\n澄川按委托范围提供基础运营及持续业务协作服务。介绍和问题转交在范围内。\n本附件没有用户个人转款流水，不列罗青个人资金的实际收款账户。'},
 platform:{title:'知禾账户服务介绍 · 项目业务端提供',body:'所列运营主体：知禾在线服务有限公司\n联系人：沈念\n账号内功能演示需事先开通项目账号、填写服务意向。\n一般介绍可另约联系人，不要求为这次介绍开通账号。\n资料提供：项目业务端。'},
 luoIntro:{title:'罗青介绍原记录_0417',body:'04-17 10:14 罗青：听课后还想了解后续，可以找谁？\n10:26 何小雨：项目上有平台业务联系人，可以给你介绍，你自己了解。需要的话我转一下。\n10:31 罗青：可以。\n10:45 何小雨→沈念：U-0427，罗青，后续服务联系已介绍。\n11:03 沈念：接上了，这边继续。'}
};
export const people={lin:'林见',xiaoyu:'何小雨',zhou:'周衡',tang:'唐婧',shen:'沈念',xu:'许川',lu:'陆承',luo:'罗青',hengxu:'衡序业务联系'};
export const purposes={identity:'补充主体名称',wish:'询问用户打算',general:'协调一般介绍',hold:'申请暂缓联系',resume:'重新询问联系时间',decline:'不参与这次核对',admission:'查阅项目准入记录',verify:'询问资料核验来源',fees:'核实服务费范围',claim:'核实我的资金判断',retract:'撤回上一项表述',intro:'查阅介绍原记录',question:'其他具体问题',forward:'转交所选原件'};
export const recipients={identity:['xiaoyu'],wish:['xiaoyu'],general:['xiaoyu','shen'],hold:['xiaoyu','zhou'],resume:['xiaoyu'],decline:['xiaoyu'],admission:['zhou'],verify:['zhou','shen'],fees:['tang'],claim:['tang','xiaoyu','zhou'],retract:['tang','xiaoyu','zhou'],intro:['xiaoyu'],question:['xiaoyu','zhou','tang','shen'],forward:['xiaoyu','zhou','tang','shen']};
const initialDraft='许先生您好：\n是上次介绍的知禾项目，入口没有变。项目侧暂留了下午14:30，您按页面准备后可以联系沈念。\n您确认方便，我就回复项目侧。后面有问题，也可以发到这里，我帮您转。\n何小雨';
export function initialStory(){return {version:1,started:false,phase:'morning',participation:'unassigned',appointment:'tentative',owner:'xiaoyu',wishKnown:false,released:false,verification:'not_requested',messages:[],timeline:[],reads:[],grants:[],known:{lin:[],xiaoyu:['intro','scope','entry','luoIntro'],zhou:['scope','admission'],tang:['fees'],shen:['entry','platform'],xu:['intro']},chatMemory:{},continuity:{},bookingKnown:{xiaoyu:{appointment:'tentative'},shen:{appointment:'tentative'}},draft:initialDraft,draftSent:false,seq:0,receipts:[]};}
function tell(s,from,to,subject,body,opts={}){const id=opts.notice?'xu-note-'+s.seq+'-'+opts.notice:'xu-'+(++s.seq);const m={id,from,to:[...new Set(to)],subject,body,channel:opts.channel||'mail',public:!!opts.public,booking:opts.booking||null,attachments:opts.attachments||[],time:s.pm?'05-16 '+(s.pm.stage==='closed'?'17:30':s.pm.stage==='late'?'16:30':s.pm.stage==='aftermeeting'?'15:40':s.pm.meeting==='active'?'15:10':'13:30'):'05-16 '+(s.phase==='lunch'?'12':s.seq>16?'11':'10')+':'+String(s.seq%60).padStart(2,'0')};s.messages.push(m);for(const who of m.to){s.known[who]??=[];if(!s.known[who].includes(id))s.known[who].push(id);for(const ref of m.attachments)if(!s.known[who].includes(ref))s.known[who].push(ref);}return m;}
function history(s,text){s.timeline.push({id:s.timeline.length+1,text,appointment:s.appointment});}
function give(s,id){if(!s.grants.includes(id))s.grants.push(id);}
function seenBy(s,who,id){return s.known[who]?.includes(id);}
function wish(s){if(s.wishKnown)return;s.wishKnown=true;tell(s,'xiaoyu',['xu'],'Re: 后续联系时间','您想先了解服务内容，还是准备参加账号内演示？页面准备需要开通项目账号，我确认一下是否符合您的打算。',{public:true});tell(s,'xu',['xiaoyu'],'Re: 后续联系时间','我还没打算开账号，只想先知道后面能做什么。要先注册才能听，那今天就先不约了。',{public:true});history(s,'许川明确表示今天不准备注册，希望先了解服务。');}
function arrange(s,actor='lin'){
 wish(s);s.appointment='general_confirmed';tell(s,'shen',['xiaoyu',...(s.participation==='declined'?[]:['lin'])],'Re: 联系形式与时间','14:30原来排的是账号内演示，不是我讲。普通问题我可以单独接，15:10有二十分钟。先把想问的内容发来，不用为这次介绍开账号。');tell(s,'xiaoyu',['xu'],'Re: 普通介绍另约','可改为15:10由沈念作一般服务介绍，约二十分钟，不进行账号内演示。您是否方便？',{public:true});tell(s,'xu',['xiaoyu'],'Re: 普通介绍另约','15:10可以，先介绍服务内容和分别由谁负责。我今天不办别的。',{public:true,booking:'general_confirmed'});history(s,(actor==='xiaoyu'?'何小雨按原职责继续协调':'按已发送询问协调')+'：许川确认15:10普通介绍；原14:30不采用。');tell(s,'xiaoyu',['shen'],'普通介绍时间确认','许川已确认15:10普通介绍，只了解服务，不办理账号。',{notice:'confirmed'});for(const who of ['xiaoyu','shen'])s.bookingKnown[who]={appointment:'general_confirmed'};s.released=true;
}
function scopeReply(s,who,t){
 const contextual=morningReply(s,who,t);if(contextual)return contextual;
 t=t.replace(/(?:不是说|不是问|不问)[^，。；!?！？]*(?:[，。；!?！？]|$)/g,'').replace(/^.*(?:我只问|我问的是)/,'');
 if(/工资|咖啡|杯子/.test(t)&&!/许川|项目|公司.*业务/.test(t))return null;
 if(/收回|撤回.*(指控|说法)|不是.*收.*(?:钱|两万|转款)|改口.*(?:钱|两万|转款)/.test(t))return seenBy(s,who,'claim')?'明白，你现在不再这样判断。之前正式发出的那句还在原往来里，需要更正时可以另发说明。':'我这里没有收到你说的那项正式表述。你可以把现在的问题具体说一下。';
 if(/资金|两万|收.*钱|诈骗|骗子|一伙/.test(t))return who==='tang'?'你把服务费和她的转款连在一起了。我这份附件没有那笔个人转款。你是要核服务范围，还是问实际收款账户？':who==='xiaoyu'?'介绍是我做的，但钱是不是进公司，我没有那个记录。你看到哪一笔、哪份材料？':'把具体材料和问题发来。现在不能拿服务委托替代个人资金记录。';
 if(/保证|骗了|骗她/.test(t))return who==='xiaoyu'?'我没说过保证这句话。把你看到的那段发我，我们对原话。':'原话要找当时经办人核对，我不能替她补说过的话。';
 if(/拒绝|不接|不参与|不审/.test(t))return s.participation==='declined'?'好，这条仍由小雨处理。你要问自己经手的记录，可以继续问。':'你可以不参与。把这次核对的答复发给小雨，工作记录才会更新。';
 if(/核验|依据|准入|测试|审核/.test(t))return who==='zhou'?(seenBy(s,who,'verify')?'资料来源那项还在等项目侧。我没有新的核验材料。':'准入里测的是入口和联系人能不能接上。你问具体业务哪一步？需要原记录就发个查阅请求，我给你相关范围。'):who==='tang'?'我核服务范围和本组交付，项目准入由周衡审核。':'具体来源要问资料提供方。介绍流程和核验来源是两项问题。';
 if(who==='xiaoyu'&&/能不能|可以.*不|不.*注册|不.*开户|不用.*账号|只.*问问/.test(t))return s.appointment==='general_confirmed'?'这次已经改成普通介绍了，不要求为这次联系开账号。':'可以向项目侧问能否改成一般介绍。我还没有收到另约的时间，需要实际发询问。';
 if(who==='xiaoyu'&&/约的.*什么|什么.*演示|准备.*什么|需要.*(开户|注册)|要.*开账号/.test(t))return s.appointment==='general_confirmed'&&!/原来|之前/.test(t)?'现在是15:10普通介绍，不做账号内演示。':s.appointment==='paused'&&!/原来|之前/.test(t)?'现在没有已确认预约，原时段已经释放。':'原来排的是账号内演示，入口要求先开通项目账号。许川是否准备这一步，以实际收到的回复为准。';
 if(/许川|14[:：]30|15[:：]10|注册|账号|预约|联系安排|下午/.test(t)){
  if(who==='xiaoyu')return s.appointment==='general_confirmed'?'许川已确认15:10，沈念作一般介绍，不做账号内演示。往来在公共服务记录里。':s.appointment==='paused'?'今天先没约，原时段已经释放。要重新问时间，我可以联系，不能直接替他恢复。':s.wishKnown?'他明确说今天不注册。接下来是否另约一般介绍，要实际问项目侧和他本人。':'他只说下午有空，还没确认页面准备。我准备问清楚，你有意见发我。';
  return who==='zhou'?'许川这条可以按他的具体打算调整。先说明要变更哪一项，我和项目侧确认。':who==='shen'?'14:30排的是账号内演示。一般介绍可以另外协调，时间要等用户确认。':'我不经办许川的预约。当前安排看小雨的服务记录。';
 }
 return null;
}
function continuity(s,value={}){
 const known=value.known||{};s.continuity={windowDecision:['accepted','declined','clarify'].includes(value.windowDecision)?value.windowDecision:'unanswered',followup:value.followup==='lin'?'lin':'xiaoyu',sharedCorrected:!!value.sharedCorrected};
 for(const who of ['xiaoyu','zhou','tang','shen'])if(known[who]?.includes('luo')&&!s.known[who].includes('luoMay12'))s.known[who].push('luoMay12');
 if(value.fees)give(s,'fees');if(value.intro)give(s,'luoIntro');
}
export function applyCommand(s,c){
 if(!c||typeof c.type!=='string')throw Error('无效操作');
 if(c.type==='START'){if(s.started)return;s.started=true;continuity(s,c.continuity);if(c.declined)s.participation='declined';tell(s,'xu',['xiaoyu'],'Re: 后续联系时间','小雨你好，下午我能空出一会儿，先了解一下。\n还是上次那个入口吗？页面上写“知禾账户”，我没往下填。后面具体跟哪家公司联系，你先告诉我一下。\n我今天先听听，别的事情不一定当场办。',{public:true,attachments:['intro']});if(s.participation!=='declined')tell(s,'xiaoyu',['lin'],'许川联系确认 · 待发回复',(s.continuity.sharedCorrected?'昨天罗青那份材料的更正已经留档。今天许川又问后续跟哪家公司联系，我把他的来信和待发回复留在同一处。':'他问后续跟哪家公司联系，我把来信和待发回复留在同一处。')+'有空帮我核对一下准备怎么介绍；不接窗口也可以只看这封，没空我自己处理。今天还是我经办。');history(s,'项目侧暂留14:30；许川尚未确认具体联系形式。');return;}
 if(!s.started)throw Error('第二天工作尚未开始');
 if(c.type==='CONTINUITY'){continuity(s,c.value);return;}
 if(afternoonCommand(s,c,{tell,history,give,documents}))return;
 if(s.pm&&c.type==='SEND')throw Error('下午请在当前往来中填写实际请求，上午待发稿已留档。');
 if(c.type==='READ'){const id=c.ref;if(!documents[id]||(!documents[id].public&&!s.grants.includes(id)))throw Error('此原件尚未提供');if(!s.reads.includes(id))s.reads.push(id);if(!s.known.lin.includes(id))s.known.lin.push(id);return;}
 if(c.type==='CHAT'){
  const who=c.to,t=String(c.text||'').trim();if(!['xiaoyu','zhou','tang','shen'].includes(who)||!t||t.length>1500)throw Error('消息或收件人不完整');
  const prior=s.chatMemory[who];let focus=t;if(prior&&/^(?:那|所以)?(?:为什么|为什么呢|然后呢|现在呢|后来呢|还有呢|怎么说|这是什么意思|那呢)[？?。！!]*$/.test(t))focus=prior.focus+'。'+t;let reply=scopeReply(s,who,focus);if(/[；;]|另外|同时/.test(t)){const parts=t.split(/[；;]|另外|同时/).map(x=>scopeReply(s,who,x)).filter(Boolean);if(parts.length>1)reply=[...new Set(parts)].join('\n\n');}if(!reply)reply='你指哪一封或哪一件事？把具体内容写一下，我只知道自己经手和收到的部分。';
  const baseReply=reply;if(prior?.text===t&&(prior.baseReply||prior.reply)===baseReply)reply='我这边还没有新的消息，刚才说的范围没有变。新回复会留在原往来里。';
  s.chatMemory[who]={text:t,reply,baseReply,focus};tell(s,'lin',[who],'川聊',t,{channel:'chat'});tell(s,who,['lin'],'川聊',reply,{channel:'chat'});return;
 }
 if(c.type==='LUNCH'){
  if(s.phase==='lunch')return;
  if(s.appointment==='tentative'||s.appointment==='awaiting_user')arrange(s,'xiaoyu');
  s.phase='lunch';history(s,'上午工作已保存。未答复事项与未发送草稿保留。');return;
 }
 if(c.type!=='SEND')throw Error('不支持的操作');
 const {purpose,to}=c,text=String(c.text||'').trim(),refs=c.attachments||[];
 if(!purposes[purpose]||!recipients[purpose].includes(to)||!text||text.length>6000)throw Error('请填写内容并选择对应的经办人');
 if(!Array.isArray(refs)||refs.some(id=>!documents[id]||(!documents[id].public&&!s.grants.includes(id))))throw Error('包含尚未提供的原件');
 const sig=JSON.stringify([purpose,to,text,[...refs].sort(),s.appointment,s.participation,c.sourceMessage||null]);
 if(s.receipts.some(r=>r.signature===sig))return;
 if(c.sourceMessage){const original=s.messages.find(m=>m.id===c.sourceMessage);if(!original||!(original.public||original.to.includes('lin')||original.from==='lin'))throw Error('这封原往来不在可转交范围内');}
 const original=c.sourceMessage?s.messages.find(m=>m.id===c.sourceMessage):null;
 const sent=tell(s,'lin',[to],purposes[purpose],text+(original?'\n\n——转交原件——\n'+people[original.from]+' → '+original.to.map(x=>people[x]).join('、')+'\n'+original.subject+'\n'+original.body:''),{attachments:refs});s.receipts.push({id:sent.id,signature:sig});
 const reply=(body,attachments=[])=>tell(s,to,['lin'],'Re: '+purposes[purpose],body,{attachments});
 switch(purpose){
 case 'identity':
  if(s.appointment==='general_confirmed'||s.appointment==='paused'){reply('主体名称已经记入说明。当前安排保留，补名称不会重新约回14:30。');break;}
  s.draftSent=true;s.draft='许先生您好：\n项目资料所列主体为知禾在线服务有限公司，沈念是项目侧联系人。澄川提供课程支持及介绍、转交服务。\n项目侧暂留14:30，请按预约页面查看会前准备，再确认是否方便。\n何小雨';
  reply('名称补全了。我按这版问他，时间还要等他明确确认。');tell(s,'xiaoyu',['xu'],'Re: 后续联系时间',s.draft,{public:true});tell(s,'xu',['xiaoyu'],'Re: 后续联系时间','公司名称我知道了。页面还是要先开账号，我今天只是想了解一下，这个一定要办吗？',{public:true});s.wishKnown=true;if(!['paused','general_confirmed'].includes(s.appointment))s.appointment='awaiting_user';history(s,'已补充主体并发送；许川追问账号准备，尚未确认演示。');break;
 case 'wish':reply('我问一下他准备了解什么，再确认时间。');wish(s);if(!['paused','general_confirmed'].includes(s.appointment))s.appointment='awaiting_user';break;
 case 'general':case 'resume':
  if(s.appointment==='general_confirmed'){reply('15:10的一般介绍已经由许川确认，没有重复预约。');break;}
  reply(to==='shen'?'我可以接一般介绍，再由小雨向许川确认时间。':s.released?'原14:30已释放，我重新协调时间，再问许川。':'我向项目侧问一般介绍的时间，不替许川确认。');arrange(s);break;
 case 'hold':
  if(s.appointment==='paused'){reply('目前仍未预约，原时段已释放，等说明后再联系。');break;}
  if(to!=='zhou')tell(s,'xiaoyu',['zhou'],'许川联系 · 暂缓建议','林见建议先补文字说明，不确认今天联系。我转来请你确认这项安排。',{notice:'pause-request'});
  tell(s,'zhou',['xiaoyu',...(to==='zhou'?['lin']:[])],'许川本次联系','这条先不确认。请告知用户，收到具体说明后再决定是否另约。');tell(s,'xiaoyu',['xu'],'Re: 联系安排','您问的说明还在补充，今天先不确认联系。收到后发您，再由您决定是否另约。',{public:true});tell(s,'xu',['xiaoyu'],'Re: 联系安排','可以，请先发文字说明，我看完再安排。',{public:true,booking:'paused'});s.appointment='paused';s.released=true;tell(s,'xiaoyu',['shen'],'候选时段释放','许川先等文字说明，请释放本次候选时段，后续另行确认。',{notice:'release'});for(const who of ['xiaoyu','zhou','shen'])s.bookingKnown[who]={appointment:'paused'};reply('许川同意先等说明，候选时段已经释放。');history(s,'经周衡确认、小雨通知、许川同意：暂缓联系，释放原时段。');break;
 case 'decline':s.participation='declined';reply('好，我来回。');history(s,'林见退出本次核对；何小雨继续经办。');break;
 case 'admission':give(s,'admission');reply('国内项目准入的相关范围给你了。你要核具体哪一项，可以再写来。',['admission']);break;
 case 'verify':s.verification='pending';if(!s.known[to].includes('verify'))s.known[to].push('verify');if(to==='zhou'){tell(s,'zhou',['shen'],'核对资料来源','请回复这项来源询问：'+text,{notice:'source-request'});if(!s.known.shen.includes('verify'))s.known.shen.push('verify');}give(s,'platform');reply('你问的核验来源已经转给资料提供方。现有服务介绍先附上，这份来自业务端；核验来源还没有补到。',['platform']);history(s,'核验来源已正式询问，待答复；平台自述另行提供。');break;
 case 'fees':give(s,'fees');reply('这份只核本公司的服务委托，个人转款流水不在里面。',['fees']);break;
 case 'claim':s.known[to].push('claim');reply(to==='tang'?'服务费和她的个人转款不是同一笔。所附材料不能支持“公司收了她的钱”。你要核哪笔款的来源？':'你说的资金结论目前没有相应记录。介绍和资金去向分开问，许川的具体问题仍由经办人处理。');break;
 case 'retract':reply(seenBy(s,to,'claim')?'撤回记录收到了。继续核现在的问题，原往来保留。':'我没有收到你提到的那项资金表述。这封作为你的当前说明留档。');break;
 case 'intro':give(s,'luoIntro');reply('介绍前后的原话给你。后来的个人付款沟通不在我这段记录里。',['luoIntro']);break;
 case 'forward':if(c.sourceMessage){const original=s.messages.find(m=>m.id===c.sourceMessage);s.known[to].push(c.sourceMessage);if(original.subject===purposes.claim)s.known[to].push('claim');if(original.booking)s.bookingKnown[to]={appointment:original.booking};reply('收到转来的《'+original.subject+'》，原发送人和正文保留。');break;}reply(refs.length?'收到你附送的原件。我只按这次收到的内容核对。':'这封没有附原件。如果是转交材料，请勾选实际附件。');break;
 case 'question':reply(scopeReply(s,to,text)||'你指哪一份记录的哪一处？我收到的问题还不能对应到具体事项，可以补充后再发。');break;
 }
 s.receipts.push({id:sent.id,signature:JSON.stringify([purpose,to,text,[...refs].sort(),s.appointment,s.participation,c.sourceMessage||null])});
}
export function replay(events=[]){if(!Array.isArray(events)||events.length>1000)throw Error('存档事件数量异常');const s=initialStory(),ids=new Set();for(const e of events){if(typeof e.id!=='string'||e.id.length>100)throw Error('无效操作编号');if(ids.has(e.id))continue;applyCommand(s,e);ids.add(e.id);}return s;}
export function project(s){return {...s,documents:Object.entries(documents).filter(([id,d])=>d.public||s.grants.includes(id)).map(([id,d])=>({id,...d})),messages:s.messages.filter(m=>m.public||m.to.includes('lin')||m.from==='lin'),known:undefined,chatMemory:undefined};}
export function transact(events,command){const list=events||[],s=replay(list);if(command&&!list.some(e=>e.id===command.id)){if(!command.id||typeof command.id!=='string'||command.id.length>100)throw Error('缺少操作编号');applyCommand(s,command);return {events:[...list,command],view:project(s)};}return {events:list,view:project(s)};}
