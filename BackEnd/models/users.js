const pool = require('../db'); 
const bcrypt = require('bcrypt'); // For password hashing

//finding user by the email he provided for checking if user already exists
const findUserByEmail = async (email) => {
  return (await pool.query('SELECT 1 FROM users WHERE email = $1 LIMIT 1',[email]))
}

//finding user by token to verifythe email of the user
const findUserByVerificationToken = async (token) => {
  return (await pool.query('SELECT 1 FROM users WHERE  token= $1 LIMIT 1',[token]))

}

//verifying the email of the user
const verifyUser = async (userId) => {
  try {
    await pool.query('UPDATE users SET verified = true, verificationTokenExpiry = null WHERE user_id = $1', [userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//updating the token in the databse
const updateVerificationToken = async (userId, verificationToken, verificationTokenExpiry) => {
  try {
    await pool.query('UPDATE users SET verificationToken = $1, verificationTokenExpiry = $2 WHERE user_id = $3', [verificationToken, verificationTokenExpiry, userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};



//sending user informations to the database for creation
const createUser = async (user) => {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create the user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, passwordd) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.name, user.surname, user.username, user.profilePicture, user.email, hashedPassword, user.verificationToken, user.verificationTokenExpiry]
    );

    return newUser.rows[0];
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the user' });
  }
};

module.exports = { createUser, findUserByEmail, findUserByVerificationToken, verifyUser, updateVerificationToken};
