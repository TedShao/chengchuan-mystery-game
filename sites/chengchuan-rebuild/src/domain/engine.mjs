import {VERSION, DOCS, PEOPLE, initialMessages} from './content.mjs';
export {VERSION, DOCS, PEOPLE};
const has=(s,f)=>s.facts.includes(f);
const grant=(s,f)=>{if(!has(s,f))s.facts.push(f);};
const unlock=(s,p)=>{if(!s.contacts.includes(p))s.contacts.push(p);};
const received=(s,p,d)=>s.received[p]?.includes(d);
function message(s,thread,text,from=thread){s.messages.push({id:`m${s.messages.length}`,thread,from,text,stamp:`${String(Math.floor((548+Math.floor(s.messages.length/2))/60)).padStart(2,'0')}:${String((548+Math.floor(s.messages.length/2))%60).padStart(2,'0')}`});}
const ACTIONS = [
 ['take','xiaoyu','现在转过来',s=>!has(s,'fatherContact')],
 ['callback','xiaoyu','先留回拨方式',s=>!has(s,'fatherContact')],
 ['decline','xiaoyu','请前台转给孟宁，我暂不接手',s=>!has(s,'fatherContact')],
 ['findZhao','xiaoyu','请你转达：我想问赵启明那段介绍',s=>(s.read.includes('intro')||has(s,'pastWorker'))&&['none','stopped'].includes(s.zhao)],
 ['withdrawRequest','xiaoyu','先撤回给赵启明的联系请求',s=>s.zhao==='invited'],
 ['father-work','father','面试介绍的是哪份工作？'],
 ['father-latest','father','你们最后一次联系说了什么？'],
 ['father-motive','father','他当初为什么想去？'],
 ['father-safe','father','告诉他：刚才接上了，应该没事',s=>s.call==='joined'||s.call==='reported'],
 ['father-correct','father','更正：接通了，但我还不能保证能自由离开',s=>has(s,'assured')],
 ['father-help','father','您有没有向外求助？'],
 ['meng-work','meng','陈平说不是面试讲的工作，实际怎么回事？'],
 ['meng-call','meng','约一次联系，我和他父亲一起参加',s=>s.call==='none'&&has(s,'fatherContact')],
 ['meng-familycall','meng','让他父亲参加联系，我不参加',s=>s.call==='none'&&has(s,'fatherContact')],
 ['meng-leave','meng','没满半年就不能回来吗？'],
 ['meng-resign','meng','我问的是结束工作，不是提前休假'],
 ['meng-pay','meng','底薪、海外补贴和绩效各是多少？'],
 ['meng-probation','meng','我问的是试用期，补贴还有吗？'],
 ['meng-holiday','meng','探亲假多长，回国期间补贴还发吗？'],
 ['meng-net','meng','这些税后能拿到多少？'],
 ['meng-past','meng','以前去过、已经回来的人呢？'],
 ['meng-accuse','meng','你是不是知道那边不对，还在招人？'],
 ['meng-records','meng','你收到赵的反馈后，为什么还用旧介绍？',s=>received(s,'meng','zhaoRecords')],
 ['meng-refuse','meng','这个项目我不再经办',s=>!s.withdrawn],
 ['meng-rejoin','meng','改口：我愿意继续联系，但不作安全保证',s=>s.withdrawn],
 ['chen-call','chen','参加已约好的通话',s=>s.call==='scheduled'],
 ['chen-report','father','我没参加，刚才联系怎么样？',s=>s.call==='family'],
 ['chen-work','chen','你现在做什么，想回来是休假还是不做了？',s=>s.call==='joined'],
 ['chen-private','chen','结束后，你方便时单独给父亲回拨',s=>s.call==='joined'],
 ['father-follow','father','后来收到他自己的回拨了吗？',s=>has(s,'callbackAsked')||s.call==='reported'],
 ['zhao-contact','zhao','说明来意：我经手的附件仍在用你的介绍',s=>s.zhao==='invited'],
 ['zhao-own','zhao','我自己也在考虑这个岗位，想听听你的经历',s=>s.zhao==='invited'],
 ['zhao-stop','zhao','只帮你停止引用，不追问经历',s=>s.zhao==='invited'||s.zhao==='talking'],
 ['zhao-how','zhao','你那次是怎么回来的？',s=>s.zhao==='talking'],
 ['zhao-before','zhao','回来后，你跟公司说过这些吗？',s=>s.zhao==='talking'],
 ['zhao-permit','zhao','可以转交哪部分？我先给你看范围',s=>has(s,'zhaoTold')],
 ['zhao-records','zhao','能看你给孟宁和郑立的原话及回复吗？',s=>has(s,'priorComplaint')],
 ['zhao-suspect','zhao','那段介绍是你写的，你是不是也参与了？',s=>s.zhao==='talking'],
 ['zhao-apology','zhao','改口：我不该把受控时说的话当成自愿推荐',s=>has(s,'zhaoHurt')],
 ['boss-suspend','boss','请暂停这批海外招聘，并通知已经约好的人',s=>!s.paused],
 ['boss-contact','boss','陈平的离开安排，谁在实际处理？'],
 ['boss-prior','boss','这两次反馈之后，为什么仍发同一份招募资料？',s=>received(s,'boss','zhaoRecords')&&received(s,'boss','notice')],
 ['notify','boss','我通知自己联系的候选人：暂不能继续作保证',s=>!has(s,'notified')],
 ['help-request','help','提交当前已知情况，保留不确定的部分'],
 ['apply','meng','继续我之前的咨询，申请海外客服',s=>s.application==='none'&&!s.paused&&!has(s,'warning')&&!has(s,'challenged')],
 ['offer','meng','查看雇佣安排，继续考虑这个岗位',s=>s.application==='applied'&&!has(s,'warning')&&!s.paused],
 ['resign','meng','我决定离开国内助理岗位',s=>s.application==='offer'&&!has(s,'warning')&&!s.paused],
 ['cancel','meng','取消我的海外申请',s=>['applied','offer','resigned'].includes(s.application)],
 ['depart','meng','数日后 · 出发前，我仍决定继续',s=>s.application==='resigned'&&!has(s,'warning')&&!s.paused&&!has(s,'challenged')],
 ['finish','help','结束这次调查，看看后来的联系',s=>has(s,'helpRequested')]
];
export function seed(){return {version:VERSION,read:[],facts:[],contacts:['xiaoyu','meng','boss','help'],messages:structuredClone(initialMessages),receipts:[],received:{},answered:[],zhao:'none',call:'none',withdrawn:false,paused:false,application:'none',ending:null};}
export function documents(s){return Object.keys(DOCS).filter(d=>!['family','zhaoAccount','zhaoRecords'].includes(d)||(d==='family'&&has(s,'familyShared'))||(d==='zhaoAccount'&&has(s,'shareAccount'))||(d==='zhaoRecords'&&has(s,'shareRecords')));}
export function actions(s,p){if(s.ending)return [];return ACTIONS.filter(([id,person,label,when])=>person===p&&s.contacts.includes(p)&&(!when||when(s))).map(([id,person,label])=>({id,person,label,answered:s.answered.includes(id)}));}
export function canShare(s,doc,to){return documents(s).includes(doc)&&DOCS[doc]?.share.includes(to)&&s.read.includes(doc)&&s.contacts.includes(to);}
function perform(s,a){
 const definition=ACTIONS.find(x=>x[0]===a);
 if(!definition||!actions(s,definition[1]).some(x=>x.id===a))throw new Error('当前没有这个操作。请返回对应会话查看实际状态。');
 if(s.answered.includes(a)&&!['meng-refuse','meng-rejoin','father-safe','father-correct','findZhao'].includes(a))return '此前已经问过，请查看会话中的原回复。';
 const p=definition[1];message(s,p,definition[2],'you');
 if(!s.answered.includes(a))s.answered.push(a);
 switch(a){
 case 'take':case 'callback':case 'decline':
  unlock(s,'father');grant(s,'fatherContact');
  message(s,'xiaoyu',a==='take'?'接进来了，是陈平的父亲。':a==='callback'?'好，回拨方式留在联系人里。通知是你发的，邮箱里还能找到。':'我让前台转给孟宁。回拨方式也留给你，之后要问还找得到。');
  message(s,'father',a==='decline'?'我是陈平的父亲。前台说你接待过他。我再找孟经理问问，之后如果方便，想跟你核对当时那份招聘说明。':'孟经理说换了岗位，他不适应。他自己说干的不是面试讲的那个活。你还留着当时那份招聘说明吗？');break;
 case 'father-work':message(s,p,'他跟我说的是回订单、退换货那些问题。我没参加面试，所以想看看当时发给他的那份。');break;
 case 'father-latest':grant(s,'familyShared');message(s,p,'前晚他说想回来。昨天说不方便，晚点再说，今天没回。我把那几句话给你；可以拿去问负责人，别发大群。');break;
 case 'father-motive':message(s,p,'说吃住不用花，工资能攒下来。还跟我说，半年回来住三星期。现在他不是想放假，是不想做那份活了。');break;
 case 'father-help':message(s,p,'我已经向外反映了。那边问我原来招的是什么工作，我手里只有他发来的几张截图。');break;
 case 'father-safe':grant(s,'assured');message(s,p,'那我先等他自己打来吧。我之前反映过的情况，还是会跟那边接着说。');break;
 case 'father-correct':s.facts=s.facts.filter(f=>f!=='assured');message(s,p,'好，我记住了。接上和能回来不是一回事，有新的情况你再告诉我。');break;
 case 'meng-work':message(s,p,received(s,p,'family')?'你转来的原话我看了。他说工作不对，不只是排班问题。我会问那边实际让他做什么。':'我听他父亲提过。当时谈的是客服，合作方说调整了岗位，他不适应。我再问具体变了什么。');break;
 case 'meng-call':s.call='scheduled';unlock(s,'chen');message(s,p,'约好了，陈平、他父亲、那边的联系人和我们参加。通话入口已发给你。');message(s,'chen','已约定联系。参加者：陈平、陈志远、境外联系人、孟宁、林见。');break;
 case 'meng-familycall':s.call='family';message(s,p,'那你不进通话。我跟他父亲联系。');message(s,'father','刚才见到他了。他还是说想回来，什么时候能走，没说定。');break;
 case 'meng-leave':message(s,p,'半年是带薪探亲假的条件。如果不做了，要另走离职交接。你是替他问休假，还是要结束工作？');break;
 case 'meng-resign':grant(s,'exitAsked');message(s,p,'明白，你问的是离职。我把这个意思转过去，不按探亲假问。');message(s,'father','孟经理刚来确认了，说问的是不做了，不是休假。可他什么时候能自己给我回电话，还是没定。');unlock(s,'father');break;
 case 'meng-pay':message(s,p,'转正底薪一万六，海外驻岗补贴六千，固定两万二。绩效另外零到六千，不是人人拿满。都是税前。');break;
 case 'meng-probation':message(s,p,'试用一个月，底薪一万四加六千补贴，固定两万。试用不另承诺绩效。');break;
 case 'meng-holiday':message(s,p,'满半年可排连续二十一天，包含周末，往返各另一天。批准的这段假底薪和六千补贴照发，不另外算没工作的绩效。');break;
 case 'meng-net':message(s,p,'我这里没有你的税后测算。要看正式雇佣资料，不能直接拿广告数字当到手。');break;
 case 'meng-past':grant(s,'pastWorker');message(s,p,'赵启明已经回来了，介绍里有他。他之前是小雨接待的，要问可以让她转达。');break;
 case 'meng-accuse':grant(s,'challenged');message(s,p,'你听到了什么？如果有具体情况，就把你愿意转给我的部分发来。我能先把联系约上。');break;
 case 'meng-records':grant(s,'challenged');message(s,p,'我收到过他的反映，当时找合作方核实了，对方有另一套说法。那份资料后来没有换下来，不是你一个接待助理能决定的。你把经手的通知留着，后续我来处理。');break;
 case 'meng-refuse':s.withdrawn=true;message(s,p,s.paused?'本批已经暂停，你也不再经办。':'好，你不再经办。已经约好的不会因为换经办人就取消，我来接。');break;
 case 'meng-rejoin':s.withdrawn=false;message(s,p,s.paused?'项目仍暂停。你可以协助联系，不再发招募介绍。':'你可以继续联系。之前的通知还有效，不用重发。');break;
 case 'chen-call':s.call='joined';message(s,p,'父亲：现在干的和面试说的是一样的吗？\n陈平：不一样。我想回来。\n境外联系人：具体安排还在协调。\n陈平：回去时间还没定。');break;
 case 'chen-report':s.call='reported';message(s,p,'我听到他说想回来。那边的人也在，说安排要协调。我没能跟他单独说上。');break;
 case 'chen-work':message(s,p,'不是店铺售后。别的……这会儿不方便讲。不是休几天，我不想做这里的工作了。');break;
 case 'chen-private':grant(s,'callbackAsked');message(s,p,'我现在没法定。等我能自己打的时候再打。');break;
 case 'father-follow':message(s,p,'还没有。我想听他自己说，不是再由别人约一通。');break;
 case 'findZhao':
  if(s.zhao==='stopped'){message(s,p,'之前你撤回过。这次我再问他是否愿意联系，不把旧同意当新的。');}
  else message(s,p,'我替你问。先别把他的联系方式发出去。');
  s.answered=s.answered.filter(id=>!['zhao-contact','zhao-own','withdrawRequest'].includes(id));s.zhao='invited';unlock(s,'zhao');message(s,'zhao','小雨说有人想问那段介绍。现在还在给人看吗？');break;
 case 'withdrawRequest':s.zhao='stopped';message(s,p,'好，我转达你先不联系。');break;
 case 'zhao-contact':case 'zhao-own':
  s.zhao='talking';grant(s,'warning');grant(s,'zhaoTold');
  message(s,p,'别把那段介绍当成我现在的推荐。我不建议你去。那不是给店铺做客服，是让我做诈骗，我当时也不能自己离开。');break;
 case 'zhao-stop':s.zhao='limited';grant(s,'introRemoved');message(s,p,'谢谢。先别替我讲别的，我现在不想谈。');break;
 case 'zhao-how':message(s,p,'不是休假。我家里一直求助、跟那边交涉，对方要了钱，后来才放我这一次。那些事我不想再来一遍，别拿我回来当能正常走的证明。');break;
 case 'zhao-before':grant(s,'priorComplaint');message(s,p,'回来就跟孟宁说了，要他们别再用我的介绍。后来也找过老板。我不知道他们之后又发给谁。');break;
 case 'zhao-permit':grant(s,'shareAccount');message(s,p,'可以转我的更正摘要给家属、负责人和求助渠道。家里的聊天不在里面。材料放到共享给你的文件里了。');break;
 case 'zhao-records':
  if(has(s,'zhaoHurt')){message(s,p,'那两段私人往来我暂时不想交给你。你知道的处境可以说明，但别说你已经看过原件。');break;}
  grant(s,'shareRecords');message(s,p,'我把给孟宁和郑立的原话、他们的答复截出来了，家里的内容遮掉。只给相关负责人和求助渠道。');break;
 case 'zhao-suspect':grant(s,'zhaoHurt');message(s,p,'那几句是我发的。你别拿这个说我在那边过得好。私人记录我先不发了。');break;
 case 'zhao-apology':message(s,p,'你能分清就好。更正可以按说好的范围转，其他记录我还是先留着。');break;
 case 'boss-suspend':
  s.paused=true;
  if(['applied','offer','resigned'].includes(s.application))s.application='stopped';
  message(s,p,'这批先停。已约的由孟宁逐一通知，旧介绍也停用。你自己如果报了这个岗位，安排一并停止。');grant(s,'batchNotified');break;
 case 'boss-contact':message(s,p,'孟宁还在联系合作方。我能停这边招募，没法替那边定回来的日子。家属的求助继续，不用等我们。');break;
 case 'boss-prior':grant(s,'challenged');message(s,p,'赵当时给我发过，不是没收到。我让孟宁核实过合作方。现在你交过来的通知说明后面还在用。我会停这批，但陈平回来的事得继续联系。');s.paused=true;grant(s,'batchNotified');if(['applied','offer','resigned'].includes(s.application))s.application='stopped';break;
 case 'notify':grant(s,'notified');message(s,p,'你联系的候选人已收到你的说明。其中一人撤回报名，另一人说先等实际岗位解释。没有替他们直接决定。');break;
 case 'help-request':grant(s,'helpRequested');message(s,p,'已记录你当前提交的情况。你可以继续补充经手的招聘材料、联系结果及来源；不确定的部分保留不确定。这里不能承诺调查或协助的完成时间。');break;
 case 'apply':s.application='applied';message(s,p,'按你之前的售后经历，给你登记个人申请。国内助理是另一份工作，先别把它当调岗。雇佣安排发来后再决定。');break;
 case 'offer':s.application='offer';message(s,p,'对方发来的是泰国客服雇佣安排，工资沿用职位页。具体雇主与地址还需要你自己核实，我不能用这份材料替你保证。你现在仍可不去。');break;
 case 'resign':s.application='resigned';grant(s,'domesticResigned');message(s,p,'你的国内离职决定已登记，交接后生效。海外是否出发仍是另一件事。');message(s,p,'数日后 · 国内交接已完成。出发前，你仍可取消海外申请；已经生效的离职不会自动撤销。');break;
 case 'cancel':s.application='cancelled';message(s,p,has(s,'domesticResigned')?'海外申请已取消，不再安排出发。国内离职已生效，是否重新入职需要另行处理。':'已取消个人申请，国内助理工作不受这次取消影响。');break;
 case 'depart':s.application='departed';s.ending='arrival';break;
 case 'finish':s.ending=received(s,'help','zhaoRecords')&&received(s,'help','notice')&&has(s,'warning')?'return':'limited';break;
 }
 return '已发送，回复已保存在原会话。';
}
function apply(s,c){
 if(s.ending)throw new Error('此段已经结束，可返回结局前存档继续。');
 if(c.kind==='read'){
  if(!documents(s).includes(c.doc))throw new Error('你尚未收到这份材料。');
  if(!s.read.includes(c.doc))s.read.push(c.doc);
  return '已打开。';
 }
 if(c.kind==='act')return perform(s,c.action);
 if(c.kind==='share'){
  if(!canShare(s,c.doc,c.to))throw new Error('这份材料不能按当前范围发送给该收件人。');
  if(received(s,c.to,c.doc))return '此前已送达同一份材料，未重复发送。';
  (s.received[c.to]??=[]).push(c.doc);
  const d=DOCS[c.doc];message(s,c.to,`转交：${d.title}\n${d.excerpt}`,'you');
  let reply='收到了，我会按你提供的这部分继续核实。';
  if(c.to==='father')reply=c.doc==='notice'?'是这份。上面说的是店铺客服，我会把实际情况接着向外反映。':'我收到这部分了。别的还没确认，我们先分清。';
  if(c.to==='meng'&&c.doc==='zhaoRecords'){grant(s,'challenged');reply='这几句我当时收到过。你问的如果是后来还在用介绍，把你经手的通知也发来。';}
  if(c.to==='boss'&&c.doc==='zhaoRecords')reply='我收到过赵的反映。你现在转来的这份我看到了，你经手的后续通知是什么时候发的？';
  if(c.to==='help')reply='补充材料已收取；已标注来源与转述范围，不代表调查已经完成。';
  message(s,c.to,reply);s.receipts.push({to:c.to,doc:c.doc,seq:s.receipts.length+1});return '已送达，收件范围已保留。';
 }
 if(c.kind==='end'){s.ending='limited';return '本段结束。';}
 throw new Error('未知操作。');
}
const LIMIT=1200;
function clean(c){
 if(!c||typeof c!=='object'||typeof c.id!=='string'||!/^[\w-]{1,100}$/.test(c.id))throw new Error('操作标识无效。');
 const out={id:c.id,kind:c.kind};
 if(c.kind==='read')out.doc=c.doc;
 else if(c.kind==='act')out.action=c.action;
 else if(c.kind==='share'){out.doc=c.doc;out.to=c.to;}
 else if(c.kind!=='end')throw new Error('操作类型无效。');
 if(Object.values(out).some(v=>typeof v!=='string'||v.length>100))throw new Error('操作参数无效。');
 return out;
}
export function replay(events=[]){
 if(!Array.isArray(events)||events.length>LIMIT)throw new Error('存档格式或长度不受支持。');
 const s=seed(),ids=new Set();
 for(const raw of events){const c=clean(raw);if(ids.has(c.id))continue;apply(s,c);ids.add(c.id);}
 return s;
}
export function transact(events,raw){
 const s=replay(events),c=clean(raw);
 if(events.some(e=>e.id===c.id))return {events,state:s,result:'该操作已经处理，未重复发送。'};
 if(events.length>=LIMIT)throw new Error('本段记录已满，请导出存档。');
 const result=apply(s,c);return {events:[...events,c],state:s,result};
}
export function endingText(s){
 if(s.ending==='arrival')return {title:'到岗通知',when:'数日以后',text:'你曾经把接通电话当成了足够的保证。离开国内工作后，你继续了那次申请。到达之后，约定的客服工作没有出现，离开的决定也不再由你自己作。屏幕上有人让你给家里报一声平安。',tail:'这次出发来自你的个人申请。拒绝工作、退出调查或取消申请，都不会触发这个结局。'};
 if(s.ending==='return')return {title:'这次，是他自己打来的',when:'一段时间以后',text:'你交出了自己发出的招募资料，也交出了获准转交的先前反馈。外部调查与协助持续了一段时间。陈志远后来发来消息：今天的电话，不是公司约的。陈平说，他已经能自由联系家里。',tail:'这通电话没有交代每一个人的最终责任。你提供的事实进入了后续调查。'};
 return {title:'你留下的那部分',when:'离开工作台以后',text:'你没有替未知的事情继续作保证。已经送出的内容留在收件人的会话里，没送出的仍在自己手中。陈平的处境尚未得到独立确认，家属仍在向外求助。',tail:'退出是一个成立的选择。你可以回到结束前，继续问还没有答案的问题。'};
}
