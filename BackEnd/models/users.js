const pool = require('../db'); 
const bcrypt = require('bcrypt'); // For password hashing

//finding user by the email he provided for checking if user already exists
const findUserByEmail = async (email) => {
  return (await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1',[email]))
}

//finding user by token to verifythe email of the user
const findUserByVerificationToken = async (token) => {
  return (await pool.query('SELECT * FROM users WHERE  token= $1 LIMIT 1',[token]))

}

//verifying the email of the user
const verifyUser = async (userId) => {
  try {
    await pool.query('UPDATE users SET user_status = true, tokenexpiry = null WHERE user_id = $1', [userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//updating the token in the databse
const updateVerificationToken = async (userId, verificationToken, verificationTokenExpiry) => {
  try {
    await pool.query('UPDATE users SET token = $1, tokenexpiry = $2 WHERE user_id = $3', [verificationToken, verificationTokenExpiry, userId]);
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
      'INSERT INTO users (name, surname, user_name, profile_picture, email, password, token, tokenexpiry) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user.name, user.surname, user.username, user.profilePicture, user.email, hashedPassword, user.verificationToken, user.verificationTokenExpiry]
    );

    return newUser.rows[0];
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: 'An error occurred while creating the user' });
  }
};

//update the token of reset password
const updatePasswordResetToken = async (userId, token, expiry) => {
  try {
    await pool.query('UPDATE users SET resettoken = $1, resettokenexpiry = $2 WHERE user_id = $3', [token, expiry, userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//find user by resetToken to update his
const findUserByResetToken = async (token) => {
  try {
    return (await pool.query('SELECT * FROM users WHERE resettoken = $1', [token]));
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//update user password
const updateUserPassword = async (userId, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1, resettoken = NULL, resettokenexpiry = NULL WHERE user_id = $2', [hashedPassword, userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//update user profile
const updateUserProfile = async ( name, surname, username, email, profilePicture) => {
  return (await pool.query('UPDATE users SET name = $1, surname = $2, username = $3, profile_picture = $4, email = $5 WHERE id = $6 RETURNING *', 
            [name, surname, username, profile_picture, email, userId]));
}

module.exports = { createUser,
                   findUserByEmail,
                   findUserByVerificationToken, 
                   verifyUser, 
                   updateVerificationToken, 
                   updatePasswordResetToken,
                   updateUserPassword,
                   findUserByResetToken,
                   updateUserProfile
                  };
