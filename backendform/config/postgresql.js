const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    Port: 5432,
    user:'postgres',
    password:'12345687',
    database:'postgres',
})
module.exports = pool;