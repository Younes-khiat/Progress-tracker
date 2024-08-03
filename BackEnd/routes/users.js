const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const usersModel = require('../models/users')

//registring link
router.post('/register', usersController.createUser);

//verification with token
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }
    // Verify the token and update user status
    // ... implementation
    try {
        //find the user by the token he has
        const user = (await usersModel.findUserByVerificationToken(token));
        if (!user.rowCount < 0) {
          return res.status(400).json({ message: 'Invalid token' });
        }
    
        //verifying if the token still usable
        const now = new Date(Date.now());
        console.log(now)
        console.log(user.rows[0].tokenexpiry);
        console.log(new Date(Date.now() + 60000));
        if (user.rows[0].verificationTokenExpiry < now) {
            console.log(1);
            res.status(400).json({ message: 'Token expired' });
            res.redirect('/resend-verification');//if not usable resend verification email

        }
    
        //if token usable verify the user
        await usersModel.verifyUser(user.rows[0].user_id);
        res.send('Email verified successfully');
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying email' });
      }
    });
  
//resending verification email
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await usersModel.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a new verification token and update the user token infos
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpiry = new Date(Date.now() + 60000); // Expires in 1 minute
      await usersModel.updateVerificationToken(user.user_id, verificationToken, verificationTokenExpiry);
  
      // Send the verification email
      const link = `http://your-app-url/verify-email?token=${verificationToken}`;
      await sendEmail(user.email, 'Verify Your Email', `Click here to verify your email: ${link}`);
  
      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error resending verification email' });
    }
  });
  

module.exports = router;
