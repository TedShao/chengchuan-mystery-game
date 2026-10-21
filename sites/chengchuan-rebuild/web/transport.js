import {VERSION,replay,transact} from './domain/engine.mjs';
export const SAVE_KEY='chengchuan-return-call-v1';
export const UI_KEY='chengchuan-return-call-ui-v1';
export async function createTransport(){
 let events=[],mode='browser',storageError='';
 try{const data=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(data){if(data.version!==VERSION)throw new Error('存档版本不一致');replay(data.events);events=data.events;}}
 catch{storageError='现有新版存档无法读取，原内容未删除。可先导出原始存档，再重新开始。';}
 mode=document.querySelector('meta[name="story-runtime"]')?.content==='server'?'server':'browser';

 return {
  get events(){return events;},mode,storageError,
  async send(command){
   if(storageError)throw new Error(storageError);
   const stored=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
   if(JSON.stringify(stored?.events||[])!==JSON.stringify(events))throw new Error('另一窗口更新了进度，请刷新后再发送，避免覆盖。');
   let result;
   if(mode==='server'){
    const response=await fetch(new URL('./api/story/command',location.href),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:VERSION,events,command}),signal:AbortSignal.timeout(5000)});
    result=await response.json();if(!response.ok)throw new Error(result.error||'未发送成功。');
   }else result=transact(events,command);
   const next={version:VERSION,events:result.events};
   if(JSON.stringify(JSON.parse(localStorage.getItem(SAVE_KEY)||'null')?.events||[])!==JSON.stringify(events))throw new Error('另一窗口刚更新了进度，本次未覆盖。请刷新后再发送。');
   try{localStorage.setItem(SAVE_KEY,JSON.stringify(next));}catch{throw new Error('浏览器未能保存，本次未提交。请先导出进度。');}
   events=result.events;return result;
  },
  import(data){if(data.version!==VERSION)throw new Error('这不是《回来以后再联系》的存档。');replay(data.events);localStorage.setItem(SAVE_KEY,JSON.stringify(data));events=data.events;storageError='';},
  reset(){localStorage.removeItem(SAVE_KEY);events=[];storageError='';},
  undoEnding(){const copy=events.slice();if(replay(copy).ending)copy.pop();localStorage.setItem(SAVE_KEY,JSON.stringify({version:VERSION,events:copy}));events=copy;},
  export(){return {version:VERSION,events};}
 };
}
