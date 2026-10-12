import test from 'node:test';
import assert from 'node:assert/strict';
import {app} from '../app.js';
test('health endpoint returns JSON', async()=>{
 const server=app.listen(0);
 try{const res=await fetch(`http://127.0.0.1:${server.address().port}/api/health`);assert.equal(res.status,200);assert.deepEqual(await res.json(),{status:'ok'});}
 finally{await new Promise(resolve=>server.close(resolve));}
});
test('protected tasks endpoint rejects missing JWT', async()=>{
 const server=app.listen(0);
 try{const res=await fetch(`http://127.0.0.1:${server.address().port}/api/tasks`);assert.equal(res.status,401);}
 finally{await new Promise(resolve=>server.close(resolve));}
});
