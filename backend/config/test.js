const pool = require('./db');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });


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