import {readFile,readdir,mkdir,writeFile,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const output=new URL('dist/pages/',root);
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for(const name of await readdir(new URL('web/',root))){
  if(!/\.(js|css|html)$/.test(name))continue;
  let text=await readFile(new URL('web/'+name,root),'utf8');
  if(name==='index.html')text=text.replace('<script src="service-desk.js', '<script src="story-runtime.js"></script><script src="service-desk.js');
  await writeFile(new URL(name,output),text);
}
// Same pure domain as the server, privately scoped to avoid global collisions.
// No separate narrative implementation, remote calls, or stored credentials.
let domain='';
for(const name of ['morning-dialogue','afternoon','xuchuan']){
  domain+=(await readFile(new URL(`src/domain/${name}.mjs`,root),'utf8'))
    .replace(/^import .*\n/gm,'').replace(/\bexport /g,'')+'\n';
}
await writeFile(new URL('story-runtime.js',output),
  `(()=>{'use strict';\n${domain}\nwindow.ChengchuanStory=Object.freeze({transact});})();\n`);
await writeFile(new URL('.nojekyll',output),'');
// Browsers often request this even when no icon is specified.
await writeFile(new URL('favicon.ico',output),Buffer.alloc(0));
console.log('Built GitHub Pages: opening and full workspace, no server required.');
