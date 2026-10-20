// Request-scoped narrative evaluation; no shared player state or real-world messages.
import {transact} from '../domain/xuchuan.mjs';
export async function api(request){
 const url=new URL(request.url);
 if(url.pathname==='/api/health')return Response.json({ok:true,version:17,storage:'browser-event-log'});
 if(url.pathname!=='/api/story/command')return Response.json({error:'接口不存在'},{status:404});
 if(request.method!=='POST')return Response.json({error:'请使用发送操作'},{status:405});
 const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return Response.json({error:'来源不匹配'},{status:403});
 try{const raw=await request.text();if(raw.length>700000)return Response.json({error:'存档过大，请导出后重新开始'},{status:413});const data=JSON.parse(raw);return Response.json(transact(data.events,data.command),{headers:{'Cache-Control':'no-store'}});}catch(e){return Response.json({error:e.message||'未能完成操作'},{status:400,headers:{'Cache-Control':'no-store'}});}
}
