const pool = require('../db'); 
const bcrypt = require('bcrypt'); // For password hashing

const createUser = async (user) => {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(user.password, 10);

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

module.exports = { createUser };
