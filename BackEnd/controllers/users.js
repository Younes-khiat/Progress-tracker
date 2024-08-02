const crypto = require('crypto');
const usersModel = require('../models/users');
const verifyingEmail = require('./sendEmailVerification');

const createUser = async (req, res) => {
  try {
    // Basic input validation (you'll want to enhance this)
    const { username, email, password } = req.body;
    if (!username || !email || !password ) {
      return res.status(400).json({ message: 'Missing required informations' });
    }
    
    //checking if user already exists
    const existingUser = await usersModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Password strength check
    if (!validator.isStrongPassword(user.password, {
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
    const verificationTokenExpiry = new Date(Date.now() + 3600000); // Expires in 1 hour


    // Creating the user
    const newUser = await usersModel.createUser({ username, email, password, verificationToken, verificationTokenExpiry });

    // Send verification email
   const link = `http://your-app-url/verify-email?token=${verificationToken}`;//remember to modify this ------------------------
    verifyingEmail.sendEmail(user.email, 'Verify Your Email', `Click here to verify your email: ${link}`);
    res.status(201).json({ message: 'User created. Please verify your email.' });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.query;

  // Verify the token and update user status
  // ... implementation
  try {
      const user = await usersModel.findUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
      }
  
      const now = new Date();
      if (user.verificationTokenExpiry < now) {
        return res.status(400).json({ message: 'Token expired' });
      }
  
      await usersModel.verifyUser(user.user_id);
      res.send('Email verified successfully');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error verifying email' });
    }
  };


module.exports = { createUser, verifyUser};
