const pool = require('../db'); 
const bcrypt = require('bcrypt'); // For password hashing
const findUserByEmail = async (email) => {
  return (await pool.query('SELECT 1 FROM users WHERE email = $1 LIMIT 1',email))
}
const createUser = async (user) => {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(user.password, 10);

    //checking if the user already exists
    

    // Create the user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, passwordd) VALUES ($1, $2, $3) RETURNING *',
      [user.username, user.email, hashedPassword]
    );

    return newUser.rows[0];
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

module.exports = { createUser, findUserByEmail };
