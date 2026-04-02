const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'event_booking_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database.');
        connection.release();
    } catch (err) {
        console.error('Error connecting to MySQL:', err.message);
    }
})();

module.exports = pool;
