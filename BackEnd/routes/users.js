const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

//registring link
router.post('/register', usersController.createUser);

//verification link
router.get('/verify-email', usersController.verifyUser);
  

module.exports = router;
