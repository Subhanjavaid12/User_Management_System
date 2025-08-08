import mysql from "mysql2/promise";
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || "Subh@n123", 
    database: process.env.DB_NAME || 'user_management_system'
});

export default pool;