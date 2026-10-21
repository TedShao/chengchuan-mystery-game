import {cp,mkdir,rm,writeFile,readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),out=new URL('dist/pages/',root);
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
await cp(new URL('web/',root),out,{recursive:true});
const index=new URL('index.html',out);await writeFile(index,(await readFile(index,'utf8')).replace('name="story-runtime" content="server"','name="story-runtime" content="browser"'));
await cp(new URL('src/domain/',root),new URL('domain/',out),{recursive:true});
await writeFile(new URL('.nojekyll',out),'');
console.log('Built Pages with the same narrative engine; no remote API required.');
