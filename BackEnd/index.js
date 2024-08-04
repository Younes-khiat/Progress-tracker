//و منذ متى يخشى المنايا مريدها
const express = require('express'); //importing express from npm
const userRouter = require('./routes/users') //importing creating user router
const protectedRouter = require('./routes/protected');//importing protected code that need authentification
const app = express();
const port = 3001;


app.use(express.json());
app.use('/users', userRouter);
app.use('/protected',protectedRouter);

// app.get('/test', async (req, res) => {
//     try {
//       const client = await pool.connect();
//       const result = await client.query('SELECT NOW()');
//       const now = result.rows[0].now;
//       client.release();
//       res.json({ now });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error connecting to database');
//     }
//   });
  
//Server listening on port 5000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
