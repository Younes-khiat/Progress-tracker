const usersModel = require('../models/users');

const getUsers = async (req, res) => {
  try {
    const users = await usersModel.getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving users');
  }
};

// ... other controller functions

module.exports = { getUsers };

