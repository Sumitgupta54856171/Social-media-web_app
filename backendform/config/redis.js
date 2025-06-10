const redis = require('redis');
const client = new redis.createClient({
    Socket:{
        host:'localhost',
        port:6379
    }
})
client.connect()
.then(()=>{
    console.log('connected to redis')
})
.catch((error)=>{
    console.log(error)
})
module.exports = client;