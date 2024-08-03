const crypto = require('crypto');
const validator= require('validator');
const usersModel = require('../models/users');
const verifyingEmail = require('./sendEmailVerification');

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
    const verificationTokenExpiry = new Date(Date.now() + 60000); // Expires in 1 minute
    console.log(verificationTokenExpiry);

    // Creating the user
    const newUser = await usersModel.createUser({name, surname, username, profilePicture, email, password, verificationToken, verificationTokenExpiry });

    // Send verification email
    const link = `http://localhost:3001/users/register/verify-email?token=${verificationToken}`;//remember to modify this ------------------------
    verifyingEmail(email, 'Verify Your Email', `Click here to verify your email: ${link}`);
    res.status(201).json({ message: 'User created. Please verify your email.' });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

module.exports = { createUser};
