const {createClient} = require('redis')


const redis = async()=>{
    try{
        const client = createClient('redis://default:${process.env.redis_password}@localhost:6379')
        client.on('connect', () => {
            console.log('✅ Redis Client Connected Successfully');
        });

        client.on('error', (err) => {
            console.error('❌ Redis Client Error:', err);
        });

        client.on('reconnecting', () => {
            console.log('🔄 Redis Client Reconnecting...');
        });

        // Connect to Redis
        await client.connect();
       
       
        return client

    }catch(error){
        console.error("Fail to connected the redis")
        throw error

    }
}
    
module.exports={redis}