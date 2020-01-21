const {Pool} = require('pg')

const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'state_game',
    password: 'postgres',
    port: 5432,
    max: 10
})

module.exports = pool;
