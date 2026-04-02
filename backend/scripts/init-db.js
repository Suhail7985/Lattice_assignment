const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const initDb = async () => {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    };

    try {
        console.log('Connecting to MySQL...');
        const connection = await mysql.createConnection(config);
        
        console.log('Reading schema file...');
        const sql = fs.readFileSync(path.join(__dirname, '../src/models/dbInit.sql'), 'utf8');
        
        console.log('Initializing database...');
        // Split by semicolon to execute multiple statements
        const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
        
        for (let statement of statements) {
            await connection.query(statement);
        }

        console.log('Database initialized successfully.');
        await connection.end();
    } catch (error) {
        console.error('Initialization failed:');
        if (error.code === 'ECONNREFUSED') {
            console.error('Error: Connection Refused. Ensure MySQL is running on port 3306.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Error: Access Denied. Check your DB_USER and DB_PASSWORD in .env.');
        } else {
            console.error('Full Error Detail:', JSON.stringify(error, null, 2));
            console.error('Message:', error.message);
        }
        process.exit(1);
    }
};

initDb();
