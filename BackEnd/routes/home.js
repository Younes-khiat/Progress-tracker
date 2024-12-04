const express = require('express');
const homeController = require('../controllers/home');
const verifyToken = require('../controllers/verifyToken'); 


const router = express.Router();

// /home endpoint
router.get('/', homeController.getHomeData);
router.get('/youtubePlaylists', homeController.displayYoutubePlaylists)

module.exports = router;
