const mysql = require('mysql');

// Create a connection to the database
const db = mysql.createConnection({
  host: 'srv915.hstgr.io',       // Your database host
  user: 'u222886794_admin',      // Your database username
  password: '_9VpyXfH2L6hiZH',   // Your database password
  database: 'u222886794_wayawayadb'  // Your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID', db.threadId);
});

export default db;  // Use export default if using ES modules
