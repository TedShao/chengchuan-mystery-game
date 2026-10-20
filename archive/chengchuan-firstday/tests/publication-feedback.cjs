const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.BROWSER_PATH||undefined,headless:true}),errors=[],passed=[];
for(const scenario of [
{copy:'本季度完成118个交付项目。试点服务范围待核实。',metrics:true,business:false,scope:'pending'},
{copy:'本季度完成23个交付项目。目前不能确认生产服务已上线。',metrics:false,business:false},
{copy:'本季度完成23个交付项目。禾序试点生产服务已经上线。',metrics:false,business:true,scope:'production'},
{copy:'本季度完成23个交付项目。海外客户上线。其他事项待核实是否上线。',metrics:false,business:true,scope:'production'}]){
const c=await b.newContext({reducedMotion:'reduce'}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.GAME_URL||'http://127.0.0.1:5173');await p.click('[data-prologue="skip"]');await p.click('[data-action="start"]');await p.getByRole('button',{name:'自由探索',exact:true}).click();await p.locator('.window.active [data-open="ppt"]').click();await p.click('[data-action="slide"][data-index="1"]');await p.fill('[data-input="report-count"]','23');await p.click('[data-action="submit-open"]');await p.click('[data-action="submit-report"]');await p.click('[data-flow="open-work"]');await p.getByRole('button',{name:/进入内容发布台/}).click();await p.fill('#cms-copy',scenario.copy);await p.getByRole('button',{name:'发布到首页',exact:true}).click();const state=JSON.parse(await p.evaluate(()=>render_game_to_text()));assert.equal(state.workflow.route,scenario.metrics||scenario.business?'correction':'review');
if(scenario.scope){await p.getByRole('button',{name:/查看当前工作单/}).click();const reason=await p.locator('.web-card').first().innerText();assert.equal(reason.includes('数量与统计单位'),scenario.metrics);assert.equal(reason.includes('生产订单'),scenario.business);assert.equal(await p.inputValue('#correction-scope'),scenario.scope);}
passed.push(scenario.copy);await c.close();}
assert.deepEqual(errors,[]);console.log(JSON.stringify({passed,errors},null,2));await b.close();})().catch(e=>{console.error(e);process.exit(1)});
