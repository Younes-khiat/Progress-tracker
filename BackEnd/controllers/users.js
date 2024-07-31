const usersModel = require('../models/users');

const createUser = async (req, res) => {
  try {
    // Basic input validation (you'll want to enhance this)
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required informations' });
    }
    
    //checking if user already exists
    const existingUser = await usersModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Creating the user
    const newUser = await usersModel.createUser({ username, email, password });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

module.exports = { createUser };
