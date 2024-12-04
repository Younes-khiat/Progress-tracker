const pool = require('../db');

// Fetch all favorites for a user
const getFavoritesByUserId = async (userId) => {
  return await pool.query(`SELECT * FROM favorites WHERE id = $1 LIMIT 1`, [userId]);
};

// Fetch a preview of activities by type
const getActivityPreviewByType = async (userId, activityType, limit = 5) => {
  return await pool.query(`SELECT * from ${activityType} WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`, [userId, limit]);
};

const getYoutubePlaylists = async (userId) => {
    return await pool.query( `SELECT * from youtube_playlists WHERE user_id = $1`, [userId]);
}
module.exports = {
    getFavoritesByUserId, getActivityPreviewByType, getYoutubePlaylists
};
