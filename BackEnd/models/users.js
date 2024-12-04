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
    await pool.query('UPDATE users SET user_status = true, token_expiry = null WHERE id = $1', [userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//updating the token in the databse
const updateVerificationToken = async (userId, verificationToken, verificationtoken_expiry) => {
  try {
    await pool.query('UPDATE users SET token = $1, token_expiry = $2 WHERE id = $3', [verificationToken, verificationtoken_expiry, userId]);
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
      'INSERT INTO users (name, surname, user_name, profile_picture, email, password, token, token_expiry) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user.name, user.surname, user.username, user.targetPath, user.email, hashedPassword, user.verificationToken, user.verificationtoken_expiry]
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
    await pool.query('UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3', [token, expiry, userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//find user by reset_token to update his
const findUserByResetToken = async (token) => {
  try {
    return (await pool.query('SELECT * FROM users WHERE reset_token = $1', [token]));
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//update user password
const updateUserPassword = async (userId, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2', [hashedPassword, userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//update user profile
const updateUserProfile = async ( user) => {
  try {
    const newUser = await pool.query('UPDATE users SET name = $1, surname = $2, user_name = $3,profile_picture = $4, email = $5 WHERE user_id = $6 RETURNING *', 
              [user.sanitizedName, user.sanitizedSurname, user.sanitizedUsername, user.targetPathpath, user.sanitizedEmail, user.userId]);
    return newUser.rows[0];
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: 'An error occurred while creating the user' });
  }
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
