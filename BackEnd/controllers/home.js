const homeModel = require('../models/home');

const activityTypes = ['youtube_playlists']; 

// Home Page
const getHomeData = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    console.log("1");
    // Fetch all favorites for the user
    const favorites = await homeModel.getFavoritesByUserId(user_id);
    // Fetch previews for each activity type
    const previews = {};
    for (const type of activityTypes) {
      previews[type] = await homeModel.getActivityPreviewByType(user_id, type);
    }

    // Send response
    res.status(200).json({
      favorites,
      previews,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const displayYoutubePlaylists = async (req, res) => {
  try {
    const {user_id} = req.query;
    if (!user_id) {
      return res.status(400).json({ error: `missing id or activity type` });
    }

    const youtubePlaylists = await homeModel.getYoutubePlaylists(user_id);
    
    res.status(200).json({
      "message":"ok",
      youtubePlaylists

    });

  } catch (error) {
    console.error('Error fetching youtube playlists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getHomeData, displayYoutubePlaylists
};
