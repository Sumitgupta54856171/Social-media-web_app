const redis = require('../config/redis')
async function setsession(sessionid,sessiondata){
   const session = JSON.stringify(sessiondata);
  await redis.set(sessionid,session);
  console.log('redis')
  console.log(session);}
async function getsession(sessionid){
   console.log(sessionid);
   const session = await redis.get(sessionid);
   console.log(session);
   if(session){
       return JSON.parse(session);
   }
   return session;
}
module.exports = {setsession,getsession};