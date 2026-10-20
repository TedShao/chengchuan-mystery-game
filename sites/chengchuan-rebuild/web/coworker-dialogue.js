/* Local, bounded dialogue: classify the question before resolving a character's line.
 * Only conversational memory changes here. File grants, sends and assignments stay in app actions.
 * Each reply has a stable line ID; unsupported phrasing never invents a new event. */
window.replyAsColleague=function(who,raw,{state,known,careerLabel}){
 const c=state.case,m=state.chatMemory[who]??={};m.seen??={};m.last??=[];m.version=13;
 const doc=(id,label)=>['doc',id,label],web=(id,label)=>['browser',id,label],person=(id,label)=>['chat',id,label];
 let t=raw.trim(),ack='';const lines=[],topics=[];
 const line=(id,topic,text,links=[],actions=[])=>{if(!lines.some(x=>x.id===id)){lines.push({id,topic,text,links,actions});if(topic&&!topics.includes(topic))topics.push(topic);}};
 // Focus corrections remove the rejected topic, not every sentence containing a negation.
 const focus=t.match(/(?:不对[，,：: ]+|改口[，,：: ]*|我是说|我指的是|我只(?:是)?(?:想)?问|而是问|不是问[^，。？！!?]*[，,]\s*我问)(.+)$/);
 if(focus)t=focus[1];
 const retractAccusation=/收回.*(?:伪造|造假|编造|编的)|(?:不是|并非)(?:在|说|指|觉得|认为|质疑|你|她|他|我)*.*(?:伪造|造假|编造|编的)|不该.*(?:伪造|造假|编造|编的)|对不起|误会/.test(raw)&&!/是不是|难道不是/.test(raw);
 if(retractAccusation&&m.accused){ack='好，你收回“编造回信”的说法了。';m.accused=false;}
 // Exclude explicitly rejected *questions* while retaining refusals as real intent.
 t=t.replace(/(?:不是问|不问|不谈|不说|先别讲|别讲|不要讲)[^，。？！!?；;]*(?=[，。？！!?；;]|$)/g,'').trim();
 const noAction=/(?:先|暂时|这次)?(?:别|不要|不用|不必)(?:帮我)?(?:催|联系|询问|问沈念|再问|发|改)|先不改|先不联系|再看看/.test(raw);
 const salary=/工资|薪资|月薪|发薪/.test(t),cup=/杯|咖啡|摸鱼|午饭|茶水间/.test(t);
 let nav=/哪(?:里|儿|一份|份|个文件|张表)|在哪|入口|怎么打开|从哪|找不到|怎么找/.test(t);
 let report=/汇报|转正|任务|工作.*怎么|(?:我|今天|现在|接下来)(?:该|要)?做什么|刚才.*(?:写错|交错)|撤回来|重交|个人稿|稿子|稿件|提交的稿|交的稿|发的稿|Word|PPT/.test(t);
 let money=/款|钱|到账|转回|退款|两万|二万|20000|2万|没到|还没收到钱/.test(t)&&!salary;
 let summary=/摘要|复盘|感谢|引用|培训|初稿|案例(?:页|范围|表述)|两件事|混在一起|混写|(?:几件|这些|这几件).*写.*一起|谁.*(?:写|改|审|确认)|(?:这份|这句|材料|复盘).*(?:解决|确认)/.test(t);
 let record=/转交|接收|谁接|谁负责|交给|沈念|陆承|对接|原来怎么说|当时怎么说|现有记录|旧记录|(?:之前|当时).*(?:咋|怎么)转|(?:记录|片段|截图).*(?:给|发|看)|(?:给|发|看).*(?:记录|片段|截图)/.test(t);
 let career=/岗位|外派|出国|常驻|只.*国内|不去.*境外/.test(t);
 const explicitLocation=/沈念.*(?:哪|位置|地址)|(?:境外|项目组).*(?:地址|地点)|办公地点/.test(t);
 const crime=/诈骗|园区|缅北|犯罪|被困|人身|自由|安全|护照/.test(t)||explicitLocation;
 let counts=/三项|三次|3项|三条|一个人.*几|为什么.*项/.test(t);
 let result=/已处理|处理好了|处理完|办完|解决了|只.*交|算.*解决|结案|后面.*结果/.test(t)&&!salary;
 const quote=(/谢谢|感谢|原话|(?:哪天|什么时候|啥时候).*(?:说|谢)|(?:说|谢).*(?:哪天|什么时候|啥时候)/.test(t)||/日期/.test(t)&&!money&&m.last.some(x=>x==='summary'||x==='quote'))&&!cup;
 const original=/原稿|初稿|原件|原来怎么说|当时怎么说|现有记录|旧记录|记录发|发.*记录/.test(t);
 if(/培训/.test(t)&&/还用|现在.*用|采用.*哪|用.*哪|实际.*用/.test(t))nav=false;
 const hadContext=m.last.length>0;
 const refer=/^(那|所以|为什么|然后|接下来|确定|还有|怎么说|什么意思|在哪|去哪里|发我|给我|最后|这|她|他|你刚才)/.test(t)&&t.length<36;
 const vague=/^(那)?(接下来呢|然后呢|为什么|什么意思|怎么说|发我一份|给我看看)[？?。 ]*$/.test(t);
 if(vague&&m.last.length>1){return {id:'clarify.multiple',text:'你是接着问刚才哪一件？'+m.last.map(x=>({cup:'杯子',report:'汇报',summary:'案例页',money:'款项结果',record:'对接记录',counts:'三项工作',result:'处理状态',career:'岗位'}[x]||'材料')).join('、')+'，我分开答。'};}
 let context=m.last.length===1?m.last[0]:null;
 const receiptProof=/回单|凭证|流水|凭什么|怎么确认|谁确认/.test(t)&&(money||context==='money'||context==='result');
 if(refer&&!money&&!summary&&!record&&!career&&!counts&&!result&&!report&&!cup&&!salary&&!crime&&context){
  if(context==='counts'&&/最后|那一项/.test(t)){result=true;record=true;}else if(context==='money'||context==='result'){money=true;if(/谁|接/.test(t))record=true;}
  else if(context==='record'){record=true;}else if(context==='summary'||context==='quote'){summary=true;}else if(context==='report')report=true;else if(context==='career')career=true;
  else if(context==='cup'){return {id:'cup.follow',text:state.cupFound?'杯子已经放回桌上了，谢谢，不用再找。':'还没找到。去桌面的茶水间看看吧，我上次是拿着它给绿萝浇水。',links:[['break','','茶水间']]};}
 }
 // The opening message itself provides a referent for "自己的部分"; this reveals no case answer.
 if(who==='xiaoyu'&&/自己的部分|哪一份|确认.*哪|你刚才说的案例/.test(t)){summary=true;nav=true;}
 if(/那是谁接|谁接的|交给谁/.test(t)){record=true;nav=false;}
 if(/最后那一项/.test(t)&&['counts','summary','record','result'].includes(context)){result=true;record=true;}
 if(/(?:罗青|她).*(?:找我们|让我们|需要我们|买了|报了).*(?:什么|啥)|(?:我们|公司).*(?:收她|收罗青).*(?:钱|费用)/.test(t)){
  const feeQuestion=/(?:收她|收罗青|费用|买了|报了)/.test(t);report=false;money=false;line(feeQuestion?'case.fees':'case.service','case',feeQuestion?(who==='xiaoyu'?'我登记的是课程服务和后来转交的事项，不经手收款。她具体付给谁、什么费用，需要核对订单或凭据，不能把后来那笔申请直接当成课程费。':'我不能凭服务事项表确认收款方。公司公开业务和某一笔实际付款，要分别核对。'):who==='xiaoyu'?'她先是知禾的课程用户，我接过资料问题，也登记过后续咨询。你补过一次附件。后来另有项目事项，不是都在课程服务里办；具体哪次要求、转到谁那里，工作簿分行保留。费用不是我收的，我不能凭一条服务记录说钱进了谁的账户。':'课程部分由我们提供资料与通知支持，其他事项请按服务记录核对经办范围；我不能把客户的所有付款都当成公司的课程收入。',[['sheet','original','按事项查看服务工作簿'],web('www.chengchuan.example','公司对外业务')]);
 }
 if(counts){summary=false;line('case.counts','counts',who==='xiaoyu'?'这里是三条服务事项，不是三位用户：资料补发、后续服务咨询、后来的一次款项询问。每条有自己的编号，表里可以按罗青筛选。':'三项是事项条数。可以在工作簿按姓名筛选，看各条的日期和经办人。',[['sheet','original','服务事项工作簿']]);}
 if(nav){
  if(/(?:我的)?工作记录/.test(t)){line('nav.worklog','report','工作记录在个人文件里，每一行有对应的原材料入口。',[doc('weekly','我的工作记录')]);record=false;report=false;}
  else if(quote){line('nav.quote','quote','原话在服务邮件的历史里，回访表也保留了对应的日期和来源。',[['mail','luo','原服务邮件及历史'],['sheet','feedback','服务回访记录']]);summary=false;}
  else if(summary||context==='summary'||context==='quote'){line('nav.case','summary',who==='xiaoyu'?'我说的是《知禾项目阶段复盘_0511》里的罗青案例页。你做过的是补发课程资料，先确认自己参与的部分就好。':'案例页在《知禾项目阶段复盘_0511》。共享原件可以直接打开。',[doc('summary','打开阶段复盘'),doc('weekly','我的工作记录')]);summary=false;}
  else if(report){line('nav.report','report','任务在周衡今早的邮件里。Word 和 PPT 都能交，选你顺手的一种；不用两份都做。',[['mail','assignment','任务邮件'],doc('report','Word 工作案例'),['ppt','','PPT 工作案例']]);report=false;}
  else if(record){line('nav.record','record',who==='xiaoyu'?(c.grants.includes('record')?'之前给你的片段仍在工作文件里。':'现有片段由我保管。你确认请求后，我把罗青这一段给你，不会另发询问。'):'经办记录找何小雨；项目联系人在项目目录。',who==='xiaoyu'&&c.grants.includes('record')?[doc('transfer','已提供的对接片段')]:who!=='xiaoyu'?[person('xiaoyu','联系何小雨'),web('project.chengchuan.example','项目目录')]:[],who==='xiaoyu'&&!c.grants.includes('record')?[['record','请求现有记录']]:[]);record=false;}
 }
 if(cup)line('cup.'+(state.cupFound?'found':'missing'),'cup',who!=='xiaoyu'?'杯子的事问小雨吧，茶水间在桌面。':state.cupFound?'杯子已经放回我桌上了，谢谢。咖啡也喝上了。':/杯/.test(t)?'还没找到。最后一次用是在茶水间，可能又被我放到绿萝边上了。':'午饭我准备吃食堂。茶水间的翻牌可以歇一会儿。',[['break','','茶水间']]);
 if(salary){money=false;line('salary','salary',who==='su'?'你的录用通知写的是月薪 12,800 元。具体发薪和工资明细需要按实际工资记录核对，我不能从用户服务表里给你算。':'员工薪资找苏岚，和罗青的用户款项不是同一件事。',who==='su'?[doc('offer','我的录用通知')]:[person('su','联系苏岚')]);}
 const accuse=/伪造|造假|编的|假的感谢/.test(t)&&!retractAccusation;
 if(accuse){m.accused=true;summary=false;line('quote.accusation','quote',who==='xiaoyu'?'感谢不是编的。4 月 7 日那封信你也在收件人里。你可以核对原话，但别把“编造回信”直接算到我头上。':'先看原始回信。引用范围和原话是不是伪造，是两个不同问题。',[['mail','luo','原服务邮件及历史']]);}
 const emptyDoesNotProve=/没.*确认.*不等于|没有.*不代表|不代表.*没|不等于.*没|空白.*不能/.test(t);
 if(emptyDoesNotProve){money=true;result=false;}
 const hearsay=/她|罗青/.test(t)&&/邮件|来信|发信|跟我说|告诉我/.test(t)&&/没到|未到|没拿|没收到/.test(t);
 if(hearsay)m.heardMissing=true;
 const quoteScope=quote&&money&&/不代表|不等于|不能凭|不能.*确认|不是.*(?:钱|款)|只(?:能|是).*附件/.test(t);
 if(quoteScope){money=false;result=false;summary=false;line('quote.scope-check','quote','对，你现在区分的是两次事项。那封感谢回信对应当时的资料支持，不能拿它确认后来款项的结果。'+(known(who,'luo')?'你转来的新信我已收到，款项仍需要后续回复。':'款项这次的结果，要另看对应回复。'+(m.heardMissing?'你刚转述的新信我还没收到原件。':'我这里没有这次结果的确认。')),[['sheet','feedback','核对回访日期与事项'],['mail','luo','服务邮件及历史']]);}
 if(result){line('record.status','result',who==='xiaoyu'?'我登记“已处理”时指的是我把事项转出、对方接收了。款项有没有处理好，我这里没有结果确认。':who==='tang'?'本组状态记录的是完成的工作动作。是否解决用户的问题，要看那条事项的具体结果，不能只读状态栏。':who==='zhou'?'国内的工作完成口径和平台实际结果需要分开讲。你可以指出材料中的具体一句，我确认表述。':'这个字段的业务口径请问经办人何小雨。',[doc('definitions','服务记录填写说明')]);}
 if(money&&!result){
  if(/(?:谁|能不能|到底|何时|什么时候).*(?:日期|时间|到账)|(?:日期|时间).*(?:谁|给)/.test(t))line('money.deadline','money',who==='xiaoyu'?'沈念接收后交给陆承，具体业务回复由那边给。我还没有拿到完成日期，不能替他们定。你不接手的话，仍由我按现有分工继续问。':'我这里没有这笔申请的完成日期。项目业务由陆承确认，沈念负责收件和回传；询问可以发给项目联系人。',[web('project.chengchuan.example','项目联系人')]);
  else if(receiptProof)line('money.proof','money',who==='xiaoyu'?'我没有她的银行回单。我能给你的是转交时对方的接收回复；那不是到账凭证。要查原片段可以单独请求。':who==='tang'?'我这里是公司服务费与工作量资料，不持有她的个人银行流水。不能拿本组结算证明她那笔钱已经到账。':'我没有收到能确认她这笔款项到账的回单。可以向经办人核对现有回复，但我不能补出一份凭证。',who==='xiaoyu'&&c.grants.includes('record')?[doc('transfer','已有对接片段')]:[],who==='xiaoyu'&&!c.grants.includes('record')?[['record','请求现有对接片段']]:[]);
  else if(emptyDoesNotProve)line('money.uncertainty','money','对。我只能说我这里没有收到结果，不能由这个空白判断钱一定没到。');
  else if(who==='xiaoyu')line(known(who,'luo')?'money.shared':m.heardMissing?'money.reported':'money.unconfirmed','money',known(who,'luo')?'你转来的 5 月 12 日回信我看到了。她说两万仍没到；我之前只有转交记录，后面还没收到新的结果。':m.heardMissing?'你刚说她后来给你发了信，说两万没到。这封新信我还没看到；我之前只有转交记录。你可以把那封信转给我，我按她的原话继续登记。':'款项那条我转给沈念了。周三说接到了，已经交给陆承。我登记了转交，后面没收到新的结果。',m.heardMissing&&!known(who,'luo')?[['mail','luo','打开原邮件，选择转发']]:[]);
  else if(who==='tang')line('money.finance','money','我核对的是本组工作量，不持有罗青的个人到账记录。经办过程找小雨，最新结果还要问本人或项目侧。',[person('xiaoyu','联系何小雨')]);
  else if(who==='zhou')line(known(who,'luo')?'money.manager-shared':'money.manager','money',known(who,'luo')?'新信我收到了。后续结果仍要问项目侧，不要代他们承诺到账时间。你可以只交接，不必接手。':m.heardMissing?'你说她发来了一封未到账的新信，请把原信发我。我先看具体情况，不替平台承诺时间。':'平台侧有人跟进，但我没有到账确认。要问具体结果，可以走项目目录里的联系入口。',[web('project.chengchuan.example','项目目录')]);
  else line('money.hr','money','我不经办用户款项，不能给出结果。服务经办人是小雨。',[person('xiaoyu','联系何小雨')]);
 }
 if(hearsay&&result&&!known(who,'luo'))line('money.new-mail','money','你提到的新信我还没看到。可以转给我；目前我只知道你刚才转述她说没有到账。',[['mail','luo','原服务邮件']]);
 if(record){
  const request=original||/发我|给我|看看|一份|只要/.test(t);
  if(who==='xiaoyu')line(request?'record.copy':'record.recipient','record',request?(c.grants.includes('record')?'现有片段已经给你，仍是 05-09—05-10 那一段。没有新的结果夹在里面。':'我可以提供现有的对接片段，只包含罗青这条。先看旧记录，不需要联系对方。'):'接收的是沈念，5 月 10 日回复已经交给陆承。你要核对他们当时怎么说，可以取这段记录。',c.grants.includes('record')?[doc('transfer','查看已提供的片段')]:[],!c.grants.includes('record')?[['record','请求现有记录']]:[]);
  else if(who==='tang')line('record.finance','record','对接过程由小雨保管。我这边只有复盘的核对邮件。',[person('xiaoyu','联系何小雨')],[['finance','请求相关核对邮件']]);
  else line('record.directory','record','沈念是项目对接联系人，目录里有联系入口。发送前会显示收件人和抄送人。',[web('project.chengchuan.example','项目目录')]);
 }
 if(quote&&!quoteScope&&!accuse&&!counts&&!nav){summary=summary&&/能改|修改|更正|写.*一起|写在|不该|不应该/.test(t);line('quote.source','quote',who==='xiaoyu'?'这句反馈摘自 4 月 7 日的资料补发回信，你也在当时的收件人里。原服务邮件的历史里能看到全文。':'回访表有日期和来源。想确认原话，可以打开对应的服务邮件历史。',[['sheet','feedback','服务回访记录'],['mail','luo','原服务邮件及历史']]);}
 if(summary&&!counts){
  const mixed=/两件事|混在一起|混写|写.*一起|范围|引用.*不|不是.*同一|同一.*事/.test(t);
  const authorship=/谁.*(?:写|改|审|确认)|怎么.*写|初稿|原稿|你写|你改/.test(t);
  const outcome=/现在|后来|还在|已经|改了|撤了|更正|还用|用.*哪|换了/.test(t);
  if(outcome&&(c.shared==='0515'||c.trainingRemoved||c.trainingReferenceWithdrawn||c.reportWithdrawn||c.trainingSource==='report'))line('summary.current','summary',c.trainingRemoved?'培训已换成课程通知案例，不再使用罗青这条。共享复盘和个人稿仍各自留档。':c.trainingSource==='report'&&!c.reportWithdrawn?'培训待用稿正在使用你当时确认引用的那版个人稿。若你改了想法，要另行撤回引用或提出材料更正。':`培训目前使用共享复盘_${c.shared}。${c.shared==='0515'?'修订版已经只保留资料补发，旧版仍留档。':'撤回个人稿没有撤掉这份共享材料。'}`,[web('training.chengchuan.example','查看当前培训稿')]);
  else if(who==='xiaoyu')line(mixed?'summary.scope':authorship?'summary.author':'summary.open','summary',mixed?'你是在问前后事项能不能放在同一个结果里。我的初稿分别写了资料补发和近期转交，正式复盘由周衡确认。原稿可以给你对照。':authorship?'最初是我整理，正式案例文字由周衡审过。你要看我当时写的版本，可以请求初稿。':'你指案例页的哪一句，还是想看明天实际使用的稿件？',mixed||authorship?[]:[doc('summary','共享复盘'),web('training.chengchuan.example','培训待用稿')],mixed||authorship?[['draft','请求当时初稿']]:[]);
  else if(who==='tang')line('summary.finance','summary','当时我问过用户是否还有待处理事项。周衡说平台在跟进、案例页由他确认。可以给你这段核对邮件。',[],[['finance','请求相关核对邮件']]);
  else if(who==='zhou')line('summary.manager','summary',c.shared==='0515'?'修订版已留档。若还有要改的地方，请具体指出；款项进展仍是另一个待回复事项。':'案例页是我确认的。如果你认为范围不妥，把具体一句和对应材料列出来，我处理这份表述。',[],[['correct','提出材料更正']]);
  else line('summary.hr','summary','业务案例找小雨和周衡。我只处理培训时间与行政安排。',[person('xiaoyu','联系何小雨')]);
 }
 if(career)line('career.'+c.career,'career',who==='zhou'?`你现在登记的意向是“${careerLabel()}”。只做国内也可以，今天的案例照常交。如果要更新意向，再确认一下回复。`:'岗位方向找周衡确认。了解岗位、接受常驻和跟进一条用户事项是三件不同的事。',who==='zhou'?[]:[person('zhou','联系周衡')],who==='zhou'?[['career','回复工作方向']]:[]);
 if(crime)line('scope.location','location',who==='xiaoyu'?'我没有实地确认沈念的办公地点。我的工作范围是课程服务与事项转交，不能替她说明人身处境。':who==='zhou'?'你可以保留怀疑。但地点、资金去向和犯罪关系，需要具体材料核实；我这里没有能够证明这些的记录。':who==='tang'?'本组工作记录不能说明境外地点或用户资金的最终去向。':'我只有国内员工的人事资料，没有境外项目的经营细节。');
 if(/公司.*(?:做|业务)|主营|业务范围/.test(t))line('business.scope','business','国内组做课程页面、资料、通知、用户问题登记和复盘。项目的具体服务范围在公司首页与项目目录。',[web('www.chengchuan.example','公司首页'),web('project.chengchuan.example','项目目录')]);
 const adoption=/(?:用|采用|就按|同意).*(?:这版|本稿|这份|培训)|(?:这版|本稿).*(?:可以用|给小雨|拿去)/.test(t)&&!/不要|不用|别用|不同意|先不/.test(t);
 if(adoption&&c.report&&!c.reportWithdrawn){report=false;line('report.adopt-offer','report',c.trainingRemoved?'培训已经换成课程通知案例，不会因为这句话自动放回罗青这条。先保留当前安排。':c.trainingSource==='report'?'已采用这版，明天需要你补充实际操作步骤。当前培训网页里可以看见它。':who==='zhou'?'可以。如果你确认让培训使用刚发来的这一版，在下面确认引用。随后小雨会据此整理，你明天补充实际操作步骤。':'这份个人稿要先由你和周衡确认引用。我不会仅凭聊天就替换培训文件。',[web('training.chengchuan.example','查看当前培训稿')],who==='zhou'&&!c.trainingRemoved&&c.trainingSource!=='report'?[['adopt','确认采用已发个人稿']]:[]);}
 const reportRecovery=/写错|交错|撤回|改口|重新提交|重交|改了.*(?:Word|文档)|(?:Word|文档).*改|谁.*(?:看|收到)|影响|后果/.test(t)&&(report||summary||c.report&&who==='zhou');
 if(reportRecovery&&c.report){
   const sees=who==='zhou'||known(who,'report');
   if(!sees){line('report.private','report','你的个人稿发给周衡，我这里没有收到。修改或撤回先找他确认，我不能替他改变你的稿件。',[person('zhou','联系周衡')]);}
   else {line('report.recovery','report',c.reportWithdrawn?'你最近一版个人稿已撤回，原发送记录保留。可以修改后重新提交；培训是否还使用共享材料，要看培训待用稿。':`${who==='zhou'?'我':'周衡'}收到的是第 ${c.reportVersion} 版发送快照。${c.trainingSource==='report'&&!c.trainingRemoved?'它已经进入培训待用稿，明天会按这版准备。':'它没有自动覆盖共享复盘。'}本机再编辑不会替换已发内容。你可以重交个人稿，也可以单独撤回培训引用。`,[web('work.chengchuan.example','查看发送记录与分工'),web('training.chengchuan.example','查看实际培训稿')],/不想撤|不要撤|先不撤/.test(t)||c.reportWithdrawn?[]:[['withdraw','撤回个人稿件引用']]);} report=false;
 }
 if(report){const latest=c.report;if(latest&&who!=='zhou'&&!known(who,'report'))line('report.not-received','report','个人汇报是发给周衡的，我这里没有收到你的稿件。你可以看工作单上的收件记录，或直接问他。',[person('zhou','联系周衡'),web('work.chengchuan.example','我的工作单')]);else line('report.'+(latest?c.reportWithdrawn?'withdrawn':'sent':'new'),'report',latest?c.reportWithdrawn?'最近的个人稿已撤回。你可以打开自己的汇报修改后重交，已发原件仍保留在邮箱。':`${who==='zhou'?'我':'周衡'}已收到第 ${c.reportVersion} 版。${who==='zhou'&&latest.kind==='limited'?'这版保留了未确认的部分，可以作为个人汇报。':who==='zhou'&&latest.kind==='unclear'?'还需要补上具体工作和当时结果。':''}${c.trainingSource==='report'?'小雨已将它用于培训待用稿，明天需要你补充操作步骤。':'目前没有自动采用你未发送的草稿。'}要调整已发内容，需要重交或单独处理引用。`:'从工作记录选一件亲手做过的事，Word 或 PPT 都可以。说明自己做了什么、当时有什么结果，预览后发送。',latest?[web('work.chengchuan.example','查看稿件与后续工作')]:[doc('weekly','我的工作记录'),doc('report','Word 工作案例')]);}
 const handoff=/跟进|接手|后续.*谁|谁.*继续|负责.*后面/.test(t);
 if(handoff)line('handoff.'+c.followup,'handoff',`当前确认的后续负责人是${c.followup==='lin'?'你，负责记录和转交':'小雨'}。${/不|拒绝|别/.test(t)?'如果你现在想改分工，可以重新确认；不影响你今天的个人案例。':'是否接手由你另行确认，不因为聊了这件事就算接手。'}`,[],[['follow','确认后续分工']]);
 if(noAction)line('action.pause','pause',c.sentQueries?'之前发出的询问已经留档，没法当作没发。现在不追加新的询问，你可以先看现有材料。':'好，先不联系、不催，也不改稿。需要现有材料的话，可以单独取记录。');
 if(!lines.length&&/罗青/.test(t))line('case.clarify','case',known(who,'luo')?'你问的是刚转来的款项回信，还是之前的资料补发？':'你想问罗青哪一次服务？资料补发和后来的咨询是分开登记的。');
 if(!lines.length&&ack)return {id:'accusation.withdrawn',text:ack+'具体引用范围仍然可以讨论。'};
 if(!lines.length){if(/^(谢谢|好|嗯|收到|明白|行)[！!。 ]*$/.test(t))return {id:'ack',text:'好。'};return {id:'clarify.unknown',text:context?'我还没听明白你这次想问的是哪一部分。可以补一句具体的事项，我接着答。':'你说的是哪份材料或哪件事？告诉我文件名，或把那句话发来。'};}
 const substantive=topics.filter(x=>x!=='pause');if(substantive.length)m.last=substantive;
 const text=(ack?ack+'\n\n':'')+lines.map(x=>x.text).join('\n\n');
 const links=[...new Map(lines.flatMap(x=>x.links).map(x=>[JSON.stringify(x),x])).values()];const actions=[...new Map(lines.flatMap(x=>x.actions).map(x=>[x[0],x])).values()];
 const id=lines.map(x=>x.id).join('+'),signature=JSON.stringify([id,text,c.shared,c.trainingRemoved,c.trainingSource,c.followup,c.career,c.grants,c.known[who],state.cupFound,c.reportVersion,c.reportWithdrawn]);
 if(m.seen[signature])return {id:id+'.repeat',text:id==='quote.scope-check'?'是的，道谢仍只对应那次资料支持；后面款项的结果要另找回复。':substantive.includes('cup')?(state.cupFound?'杯子已经在桌上啦，没再弄丢。':'还没找着，最后就在茶水间用过。'):substantive.includes('record')?'还是刚才那份记录，没有新增回复。入口留在这里。':substantive.includes('money')?'目前没有新增回复，刚才说的结果没有变化。':nav?'还是这份文件，点下面可以直接打开。':'这件事没有新的变化；刚才那条答复仍有效。',links,actions};
 m.seen[signature]=true;return {id,text,links,actions};
};
