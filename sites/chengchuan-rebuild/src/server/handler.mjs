import {transact,VERSION} from '../domain/engine.mjs';
export async function api(request){
 const u=new URL(request.url),headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 if(u.pathname==='/api/health')return Response.json({ok:true,version:VERSION,mode:'replayed-single-player'}, {headers});
 if(u.pathname!=='/api/story/command')return Response.json({error:'没有这个接口。'},{status:404,headers});
 if(request.method!=='POST')return Response.json({error:'只接受 POST。'},{status:405,headers});
 if(request.headers.get('origin')&&request.headers.get('origin')!==u.origin)return Response.json({error:'来源不匹配。'},{status:403,headers});
 try{
  const raw=await request.text();if(raw.length>250000)return Response.json({error:'存档超过上限。'},{status:413,headers});
  const data=JSON.parse(raw);
  if(data.version!==VERSION)throw new Error('存档版本不同，旧故事不能直接导入。');
  return Response.json(transact(data.events,data.command),{headers});
 }catch(e){return Response.json({error:e.message||'无法处理操作。'},{status:400,headers});}
}
