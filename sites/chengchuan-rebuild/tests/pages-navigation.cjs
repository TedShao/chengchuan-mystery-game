const {chromium}=require('./browser-runtime.cjs');
const assert=require('node:assert/strict');
(async()=>{
 const base=process.env.GAME_BASE_URL||'http://127.0.0.1:5175/chengchuan-mystery-game/';
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||undefined});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status());});
  await page.goto(new URL('opening.html',base).href);
  await page.getByRole('link',{name:'返回原工作空间',exact:true}).click();
  assert.equal(page.url(),new URL('./',base).href);
  await page.locator('[data-prologue="trial"]').click();
  assert.equal(page.url(),new URL('opening.html',base).href);
  await page.click('[data-do="start"]');
  assert.match(await page.locator('.app-view').innerText(),/小雨|罗青/);
  await page.screenshot({path:'qa/pages-opening.png'});
  await page.getByRole('link',{name:'原工作空间 ↗',exact:true}).click();
  await page.waitForLoadState('load');
  assert.equal(page.url(),new URL('./',base).href);
  assert.equal(await page.evaluate(()=>typeof window.ChengchuanStory?.transact),'function');
  assert.deepEqual(errors,[]);
  console.log('PASS: Pages subdirectory navigation and offline story runtime.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
