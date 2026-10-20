import {readFile,readdir} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {transact} from '../src/domain/xuchuan.mjs';
const root=new URL('../',import.meta.url),dir=new URL('dist/pages/',root);
const context=vm.createContext({window:{}});
vm.runInContext(await readFile(new URL('story-runtime.js',dir),'utf8'),context);
const local=context.window.ChengchuanStory.transact;
const plain=value=>JSON.parse(JSON.stringify(value));
let events=[];
for(const [i,command] of [
  {type:'START'},
  {type:'LUNCH'},
  {type:'AFTERNOON'},
  {type:'PM_JOIN'},
  {type:'PM_SAY',text:'谁核过衡序合作？'},
  {type:'PM_CLOSE'}
].entries()){
  const c={id:'pages-'+i,...command};
  const expected=transact(events,c),actual=local(events,c);
  assert.deepEqual(plain(actual),plain(expected),'Browser and server domain must agree');
  events=expected.events;
  assert.deepEqual(plain(local(events,c)),plain(expected),'Duplicate commands must be idempotent');
}
const fixture=JSON.parse(await readFile(new URL('tests/fixtures/daytwo-observer-morning-save.json',root),'utf8'));
assert.deepEqual(plain(local(fixture.xuEvents)),plain(transact(fixture.xuEvents)));
for(const file of await readdir(dir)){
  if(!file.endsWith('.html'))continue;
  const html=await readFile(new URL(file,dir),'utf8');
  assert(!/(?:href|src)=["']\/(?!\/)/.test(html),'Use paths relative to the Pages repository');
  for(const match of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)){
    if(/^(https?:|data:|mailto:)/.test(match[1]))continue;
    if(match[1].endsWith('/'))continue;
    await readFile(new URL(match[1],dir));
  }
}
console.log('Pages assets, nested paths, saved events and domain parity through clock-out verified.');
