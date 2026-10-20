exports.complete=async function(p){
 if(!await p.locator('.shift-orientation').count())return;
 for(let tries=0;tries<8&&await p.locator('.shift-orientation').count();tries++){
  const step=await p.locator('[data-opening-scene]').getAttribute('data-opening-scene');
  if(step==='1'){await p.click('[data-shift="orient-person"][data-person="zhou"]');await p.click('[data-shift="orient-job"]');}
  if(step==='2'){
   if(await p.locator('[data-shift="orient-practice-edit"]').count())await p.click('[data-shift="orient-practice-edit"]');
   if(await p.locator('[data-opening-time]').count()){await p.selectOption('[data-opening-time]','20:00');await p.click('[data-shift="orient-practice-check"]');}
  }
  if(step==='3')await p.click('[data-shift="orient-reply"][data-reply="uncertain"]');
  await p.click('[data-shift="orient-next"]');
 }
};
