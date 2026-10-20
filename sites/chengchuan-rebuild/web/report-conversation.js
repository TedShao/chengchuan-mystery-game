/* Replies read delivered report/participation records. Discussion never changes assignments. */
(function(root){
'use strict';
root.reportConversation=function(who,raw,s){
 if(!['zhou','xiaoyu'].includes(who))return null;
 const w=s.workdays||{},p=w.reportPath,m=s.chatMemory[who]??={},t=raw.replace(/(?:不是问|不问|先别讲|别讲)[^，。？！!?；;]*(?=[，。？！!?；;]|$)/g,'').trim();
 if(/平台.*(?:消息|处理)|业务范围|后续分工|由你跟|只交接|新信|回访表|罗青.*邮件/.test(t))return null;
 const training=['browser','training.chengchuan.example','当前培训材料'];
 const arrangements=['browser','report.chengchuan.example','周衡的实际安排'];
 const answer=(topic,text,repeat,links)=>{m.reportTalk??={};const key=JSON.stringify([topic,who==='zhou'?p?.version:m.participation?.version,m.reportExcerptVersion,w.presenter,s.case.trainingSource,s.case.trainingRemoved,s.case.shared]);const seen=m.reportTalk[key];m.reportTalk[key]=true;m.last=['participation'];m.reportTopic=topic;return {id:'report-talk.'+topic+(seen?'.follow':''),text:seen?repeat:text,links};};
 // A question about a quoted case claim is not a question about the manager's trust in the player.
 const caseInquiry=/复盘|案例页|这句|恢复信任|用户信任|谢谢|感谢/.test(t)&&/谁|依据|哪|怎么|确认|编|真假/.test(t);
 if(caseInquiry)return null;
 const trainingReason=/罗青/.test(t)&&/为什么|为啥|关我|跟我.*关系|与我.*关系/.test(t);
 const presentationScope=/(?:这页|培训|明天).*(?:讲什么|讲哪|要我讲)|要我讲什么/.test(t);
 if(trainingReason||presentationScope){
  const shared=s.case.trainingSource!=='report'&&!s.case.trainingRemoved,host=who==='xiaoyu'?'我':'小雨';
  const notPresent=w.presenter==='declined'||(who==='zhou'?w.reportAssignment:m.participation?.assignment)==='observer';
  const motive=shared?'罗青的课程附件是你 4 月 7 日补发的。明天新人要用这页练习怎样接到用户消息、处理再交接。'+(notPresent?'原先打算由你讲的附件检查和回信，现在由'+host+'演示。':'资料支持环节想请你演示当时怎样查附件和回信。')+'后面的联系也由'+host+'说明。':'现在培训已经换了材料，按待用页的版本准备。';
  const intro=trainingReason?(who==='xiaoyu'?'个人稿你交给周衡，我没有收到那份正文。':'个人汇报先按你的来稿留档。'):'演示用的是培训待用页。';
  return answer(trainingReason?'training-reason':'presentation-scope',intro+motive+(notPresent?'你不主讲的安排保留，不用另写一份汇报。':'是否一起讲还等你答复，不是看了材料就算答应。'),notPresent?'这页由'+host+'演示，你不用准备讲解；想核对自己经手的记录仍然可以看。':'你要演示的是自己经手的操作，不必讲整页结论。还没确定参加的话，可以先看材料。',[training,['doc','weekly','自己的工作记录'],['chat',who==='xiaoyu'?'zhou':'xiaoyu',who==='xiaoyu'?'向周衡核对案例文字':'问小雨演示分工']]);
 }
 const followWhy=/^(?:那|所以)?(?:为什么|什么意思|啥意思)[？?。 ]*$/.test(t)&&m.last?.includes('participation');
 const followWhere=/^(?:那|所以)?(?:我)?(?:该|要)?(?:去哪|去哪里|找谁|到哪)(?:查|核对|问)[？?。 ]*$/.test(t)&&m.last?.includes('participation');
 if(followWhy||followWhere){const privateReader=who==='zhou';const role=privateReader?w.reportAssignment:m.participation?.assignment;if(!role&&!m.reportExcerpt)return null;
 const reason=m.reportTopic?.includes('chart')?'图表收件人是周衡，我没有经办他的验收。你可以先对照自己的交付记录，再问他。':m.reportTopic?.includes('clarification')?'聊天是在解释你的意思，发送记录保留的是当时那份文件。核对后重新发送，收件人才能把两版说明放在一起看。':privateReader?'讲解安排和核对事实是两件事。暂时不讲，也可以指出记录里与你经手情况不一致的地方，不需要先认领所有结果。':'培训会照着待用页介绍工作。你不主讲，页上关于你经手部分的表述也还在，所以我请你看一眼；不确定的地方可以直接告诉我。';
 return answer('follow-'+(followWhere?'where':'why'),followWhere?'先看培训实际待用页；若你问的是自己交付过什么，工作记录里有各次往来的入口。':reason,followWhere?'这两个入口仍在下面。你先看哪一件都可以，打开文件不会替你答复主管。':reason,[training,['doc','weekly','自己的工作记录']]);
 }
 const participation=/旁听|主讲|讲解|不讲|(?:能|可以|愿意|要不要).{0,3}讲|(?:参加|不参加).*(?:培训|影响)|还要.*看这份/.test(t);
 const correction=/没记清|记错|记不清|不是不愿意|不是.*不做|改口|写错|改对了|刚才.*(?:写|说)错/.test(t)&&!/(?:接手|跟进|后续分工)/.test(t)&&(!/复盘|案例页|谢谢|感谢|款项|到账/.test(t)||/个人稿|汇报/.test(t));
 const emotion=/生气|信任|质疑|不相信|态度|还能.*转正/.test(t);
 const next=/接下来.*做|后续安排/.test(t);
 const receipt=/收到.*(?:哪|第|新).*版|新版.*(?:收到|看)|(?:改对|改好|重交).*(?:吗|没|了)/.test(t);
 const graph=/图表/.test(t)&&/谁|做|整理|附件/.test(t);
 if(graph&&who==='xiaoyu'&&m.reportExcerpt){return answer('chart-ownership','你说的是图表，我知道了。我没有代做这份图表；你发来的只是核对片段，我看不到周衡收到的整稿。交付与验收请对照他的回信。','图表交付找周衡核对。我能确认的是我没有代做，不能替其他同事认领。',[['chat','zhou','问图表收件人周衡'],['doc','weekly','自己的交付记录']]);}
 if(!participation&&!correction&&!emotion&&!next&&!receipt)return null;
 if(who==='zhou'&&!p)return null;
 if(who==='xiaoyu'&&!m.participation&&!m.reportExcerpt){return answer('no-arrangement','你说周衡调整了安排？我还没有收到新的参与通知。培训原先是我主持，你可以只确认自己经手的部分；个人稿意见还是问他。','我目前没有新的参与通知。是否改了你的个人安排，请以周衡回信为准。',[['chat','zhou','问周衡'],training]);}
 const role=who==='zhou'?w.reportAssignment:m.participation?.assignment;
 let text='',repeat='',topic='';const ls=[training];
 if(receipt){return answer('receipt',who==='zhou'?'我最后收到的是第 '+p.version+' 版。'+p.line:'我没有收到你给周衡的新版私人稿。'+(m.participation?'他最近只通知我参与安排：'+(m.participation.assignment==='observer'?'先由我主持，你旁听。':'你可以考虑讲自己的部分。'):'个人审核请直接问周衡。'),who==='zhou'?'最后收到的仍是第 '+p.version+' 版，意见以那封回信为准。本机编辑没有更新我收到的文件。':'我收到的是参与安排，不是新的私人稿件。',[who==='zhou'?['mail','review-'+p.version,'这版实际回信']:['chat','zhou','问周衡'],training]);}
 if(correction){topic='clarification';if(who==='zhou'){const last=s.submissions.find(x=>x.version===p.version)?.assessment;const action=last?.fields[1]?.excerpt||'';
 text='记不清可以直说，不必把它写成确定的分工。我现在留档的是第 '+p.version+' 版'+(action?'，其中写的是“'+action+'”':'')+'。'+'如果这句不是你的意思，核对后再发一版说明；这段聊天不会替你改掉已发文件。';
 repeat='我理解你是在澄清记忆。第 '+p.version+' 版仍是最后收到的文件；你可以保留未知，或核对后发修订，不必马上认领整件事。';ls.unshift(arrangements);
 }else{text='你可以改口，我不会把一句记错当成定论。但私人稿件由周衡收，我只能核对你明确发给我的片段。'+(m.reportExcerpt?'目前那段仍是：“'+m.reportExcerpt+'”。':'我还没有收到具体片段。');repeat='我没有收到新的核对片段。若是修改个人稿，发给周衡；若要我核对，请把具体那段发来。';ls.unshift(['chat','zhou','联系周衡']);}}
 if(participation||next){topic+=(topic?'+':'')+'participation';const suspended=who==='zhou'&&p.route==='suspended';const reason=suspended?'暂停的是本次汇报和讲解，已有文件仍能看。若要补充说明，先从安排页申请核对。':role==='observer'?'目前由小雨主持，你先旁听。旁听不妨碍查看原记录，也不等于替材料中的结论签字。':w.presenter==='declined'?'新版已经重新留作候选，但之前不主讲的安排仍保留。你愿意一起讲时再确认。':'你可以考虑讲自己的部分，也可以只旁听，参加方式需要另行确认。';const colleague=role==='observer'?'周衡发给我的安排是由我主持，你先旁听。':w.presenter==='declined'?'周衡说你可以重新考虑讲自己的部分，不过之前由我主持的安排还在。':'周衡把你列为备选，我还等你确认是否讲解。';
 const motive=s.case.trainingRemoved?'培训已改用课程通知案例；原共享复盘仍在工作文件，不会因换稿消失。':s.case.trainingSource==='report'?'培训目前用的是你已授权的个人稿；实际版本在待用页。':(who==='zhou'?'小雨的培训页仍有你经手的工作。先看看会怎样介绍；如果记录和你的记忆不同，可以指出具体一处。':'培训页仍有你经手的工作。即使不讲，也值得看看我准备怎样介绍；有记不清的地方只说不确定，我再找经办人核对。');
 text+=(text?'\n\n':'')+(who==='zhou'?reason:colleague)+motive;
 repeat+=(repeat?'\n\n':'')+(who==='zhou'?'参与安排没有再变。':'我收到的参与安排没有再变。')+motive;
 }
 if(emotion){topic+=(topic?'+':'')+'trust';text+=(text?'\n\n':'')+(who==='zhou'?p.relationship==='warning'||p.relationship==='strained'?'我介意的是指出问题后仍收到同样的断言，不是你有疑问。把不确定的地方留下，或者给出核对依据，都可以继续。':p.relationship==='suspended'?'前几次提醒后仍重复提交，所以这次暂停。你可以申请核对，但一句道歉不会改掉已发送的版本。':p.relationship==='cautious'?'我看到了新版的调整，会按新说明继续。前面的来往留档，不会因为你改口就拒绝看新材料。':'我是在核对你写的经过，不是在要求你背一个答案。记不清就保留待确认，别替自己没有确认的结果担保。':'我只收到参与通知，不知道周衡怎样评价你的私人稿件。要问他为何质疑，最好直接问他。');repeat+=(repeat?'\n\n':'')+(who==='zhou'?'我等的是有依据的补充，不是再交一份措辞不同的同样结论。':'我不能替周衡解释他的评价，你可以直接找他。');ls.unshift(who==='zhou'?arrangements:['chat','zhou','问周衡']);}
 return answer(topic,text,repeat,ls);
};
})(globalThis);
