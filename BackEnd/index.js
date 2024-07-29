const express = require('express'); //importing express from npm
const pool = require('./db'); // Importing the database connection
const app = express();
const port = 3001;
    

// const usersRouter = require('./routes/users');
// app.use('/users', usersRouter);


app.get('/test', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      const now = result.rows[0].now;
      client.release();
      res.json({ now });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error connecting to database');
    }
  });
  
//Server listening on port 5000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
