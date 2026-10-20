import http from 'node:http';
import {readFile} from 'node:fs/promises';
const root=new URL('../dist/pages/',import.meta.url);
const prefix='/chengchuan-mystery-game/';
const server=http.createServer(async(req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;
  if(!path.startsWith(prefix)){res.writeHead(404);res.end('Not found');return;}
  const name=path.slice(prefix.length)||'index.html';
  if(name.includes('..')){res.writeHead(404);res.end();return;}
  try{
    const data=await readFile(new URL(name,root));
    res.writeHead(200,{'Content-Type':name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':name.endsWith('.ico')?'image/x-icon':'text/html','Cache-Control':'no-store'});
    res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(5175,'127.0.0.1',()=>console.log('Static preview: http://127.0.0.1:5175'+prefix));
process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
