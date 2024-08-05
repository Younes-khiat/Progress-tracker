const express = require('express');
const router = express.Router();
const verifyToken = require('../controllers/verifyToken'); 

router.get('/', verifyToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.log(error);
  }
    
  });

module.exports = router;