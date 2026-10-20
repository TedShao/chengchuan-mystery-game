import {readFile,readdir,mkdir,writeFile,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
const assets={};for(const name of await readdir(new URL('web/',root))){if(/\.(js|css|html)$/.test(name))assets['/'+name]=await read('web/'+name);}
const domain=(await read('src/domain/afternoon.mjs')).replaceAll('export ','')+'\n'+(await read('src/domain/xuchuan.mjs')).replace(/import .*\n/,'').replaceAll('export ','');
const handler=(await read('src/server/handler.mjs')).replace(/import .*\n/,'').replaceAll('export ','');
const output=domain+'\n'+handler+'\nconst assets='+JSON.stringify(assets)+';\n'+`export default {async fetch(request){const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return api(request);const p=url.pathname==='/'?'/index.html':url.pathname;const content=assets[p];if(content===undefined)return new Response('Not found',{status:404});return new Response(content,{headers:{'Content-Type':p.endsWith('.js')?'text/javascript; charset=utf-8':p.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});}};`;
await rm(new URL('dist/',root),{recursive:true,force:true});await mkdir(new URL('dist/server/',root),{recursive:true});await mkdir(new URL('dist/.openai/',root),{recursive:true});await writeFile(new URL('dist/server/index.js',root),output);await writeFile(new URL('dist/.openai/hosting.json',root),await read('.openai/hosting.json'));
console.log('Built public workspace and story API');
