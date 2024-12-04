const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
  user: "younes",             // PostgreSQL username
  host: "localhost",          // Host where PostgreSQL is running
  database: "progress_tracker",  // Your database name
  password: "esof.kempo",  // Your PostgreSQL password
  port: 5432,
});
module.exports = pool;