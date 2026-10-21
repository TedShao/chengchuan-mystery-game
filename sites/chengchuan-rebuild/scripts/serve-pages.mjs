import {createServer} from './dev.mjs';
const server=createServer({pages:true});server.listen(5175,'127.0.0.1',()=>console.log('http://127.0.0.1:5175/chengchuan-mystery-game/'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
