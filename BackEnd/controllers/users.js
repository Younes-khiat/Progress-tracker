const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator= require('validator');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/users');
const sendEmail = require('./sendEmailVerification');
require('dotenv').config();

const createUser = async (req, res) => {
  try {
    // Basic input validation
    const {name, surname, username, profilePicture, email, password } = req.body;
    if (!name || !surname || !username || !email || !password ) {
      return res.status(400).json({ message: 'Missing required informations' });
    }
    
    //checking if user already exists
    const existingUser = await usersModel.findUserByEmail(email);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Password strength check
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol');
    }

    //generating a token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = (Date.now() + 60000); // Expires in 1 minute
    console.log((verificationTokenExpiry));

    // Creating the user
    const newUser = await usersModel.createUser({name, surname, username, profilePicture, email, password, verificationToken, verificationTokenExpiry });

    // Send verification email
    const link = `http://localhost:3001/users/verify-email?token=${verificationToken}`;//remember to modify this ------------------------
    sendEmail(email, 'Verify Your Email', `Click here to verify your email: ${link}`);
    res.status(201).json({ message: 'User created. Please verify your email.' });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    //check if the user has provided email and password
    if (!email || !password) {
      return res.status(400).json({message: 'missing credentials'});
    } 


    // Find the user by email 
    const user = await usersModel.findUserByEmail(email); 

    if (user.rowCount == 0) {
      return res.status(401).json({ message: 'Invalid email' });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user.rows[0].user_id }, secret, { algorithm: 'HS256', expiresIn: '1h' });//modify this
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

//reseting password
const resetPassword = async (req,res) => {
  const { resetToken, newPassword } = req.body;
  console.log(req.body);
  try {
    const user = await usersModel.findUserByResetToken(resetToken);
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    console.log(1);
    //verifying if the token still usable
    const now = Date.now() + 60000;
    if (user.rows[0].resettokenexpiry < now) {
        res.status(400).json({ message: 'resetToken expired try over later' });
    }
    console.log(2);
    // Password strength check
    if (!validator.isStrongPassword(newPassword, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol');
    }
    console.log(3);
    console.log(user.rows[0].user_id);
    //hashing the password and save it in the data base
    
    await usersModel.updateUserPassword(user.rows[0].user_id, newPassword); // Invalidate reset token

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
}

//get user profle
const getUserProfile = async (req, res) => {
  try {
    const {email} = req.query; 
    const user = await usersModel.findUserByEmail(email);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update users profile
const updateUserProfile = async (req, res) => {
  try {
    const {userId} = req.query;
    const { name, surname, username, profile_picture, email} = req.body;
    console.log(1);
    // Input validation and sanitization
    //lets keep the picture for later
    if (email && !validator.isEmail(email)) {
      res.stetus(500).json({message: "invalid email format"});
    }
    console.log(2);
    // Sanitization
    const sanitizedName = name && validator.escape(name);
    console.log(3);
    const sanitizedSurname = surname && validator.escape(surname);
    console.log(4);
    const sanitizedUsername = username && validator.escape(username);
    console.log(5);
    const sanitizedEmail = email && validator.normalizeEmail(email);
    console.log(6);
    const user = await usersModel.updateUserProfile(sanitizedName, sanitizedSurname, sanitizedUsername, sanitizedEmail, userId);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createUser, loginUser, resetPassword,getUserProfile, updateUserProfile};
