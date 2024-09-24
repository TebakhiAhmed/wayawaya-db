// db.js
import mysql from "mysql2/promise"; // Use promise for better async support

const pool = mysql.createPool({
  host: 'srv915.hstgr.io',
  user: 'u222886794_admin',
  password: '_9VpyXfH2L6hiZH',
  database: 'u222886794_wayawayadb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  keepAliveInitialDelay: 10000, // 10 seconds initial delay
  enableKeepAlive: true // Enable keep-alive
});

// Optional: Test connection to ensure the pool is working
pool.getConnection()
  .then(connection => {
    console.log('Connected to the database as ID', connection.threadId);
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.stack);
  });

export default pool;
