const pool = require('./db');
require('dotenv').config();


console.log(process.env.DATABASE_URL)

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connected! Current time:', res.rows[0]);
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await pool.end();
    }
}

testConnection();