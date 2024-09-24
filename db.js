// db.js
import mysql from "mysql2";

const db = mysql.createConnection({
  host: 'srv915.hstgr.io',
  user: 'u222886794_admin',
  password: '_9VpyXfH2L6hiZH',
  database: 'u222886794_wayawayadb'
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID', db.threadId);
});



export default db;
