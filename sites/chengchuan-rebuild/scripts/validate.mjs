import assert from 'node:assert/strict';import {readFile,readdir} from 'node:fs/promises';
const root=new URL('../dist/pages/',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8');
assert(html.includes('./app.js'));assert(!html.includes('reply-opening'));
for(const path of ['app.js','style.css','transport.js','icons.js','domain/engine.mjs','domain/content.mjs','opening.html','mark.svg'])await readFile(new URL(path,root));
assert(!(await readdir(root)).includes('case-data.js'));
const js=await readFile(new URL('app.js',root),'utf8');assert(!js.includes('罗青'));assert(!js.includes('许川'));
console.log('PASS: single new entry, relative assets and shared domain; old story absent from build.');
