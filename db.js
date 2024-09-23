// db.js
import mysql from "mysql2";

const db = mysql.createConnection({
  host: 'srv915.hstgr.io',
  user: 'u222886794_admin',
  password: '_9VpyXfH2L6hiZH',
  database: 'u222886794_wayawayadb'
});

export default db;
