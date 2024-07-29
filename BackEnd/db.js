const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'esof.kempo',
  port: 5000,
});

module.exports = pool;
