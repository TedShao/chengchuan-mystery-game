import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {api} from '../src/server/handler.mjs';
const project=fileURLToPath(new URL('../',import.meta.url));
export function createServer({pages=false}={}){
 return http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://127.0.0.1');
   if(!pages&&url.pathname.startsWith('/api/')){
    let body='';for await(const c of req){body+=c;if(body.length>250000){res.writeHead(413);res.end('Too large');return;}}
    const response=await api(new Request(new URL(req.url,`http://${req.headers.host}`),{method:req.method,headers:req.headers,...(req.method==='POST'?{body}:{})}));
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
   }
   let path=decodeURIComponent(url.pathname),base;
   if(pages){const prefix='/chengchuan-mystery-game/';if(!path.startsWith(prefix))throw new Error('Not found');path=path.slice(prefix.length);base=resolve(project,'dist/pages');}
   else if(path.startsWith('/domain/')){path=path.slice(8);base=resolve(project,'src/domain');}
   else {path=path.slice(1);base=resolve(project,'web');}
   const file=resolve(base,path||'index.html');if(!file.startsWith(base+sep))throw new Error('Not found');
   const data=await readFile(file);
   const ext=file.split('.').pop(),mime={html:'text/html',js:'text/javascript',mjs:'text/javascript',css:'text/css',svg:'image/svg+xml',json:'application/json'}[ext]||'application/octet-stream';
   res.writeHead(200,{'Content-Type':mime+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const server=createServer();server.listen(5174,'127.0.0.1',()=>console.log('New game: http://127.0.0.1:5174/'));
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
}
