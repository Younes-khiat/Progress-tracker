const express = require('express');
const router = express.Router();
const verifyToken = require('../controllers/verifyToken'); 

router.get('/', verifyToken, (req, res) => {
  
    res.json({ user: req.user });
  });