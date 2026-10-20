const fs=require('node:fs');
fs.mkdirSync('qa',{recursive:true});
module.exports=require(process.env.PLAYWRIGHT_MODULE||'playwright');
