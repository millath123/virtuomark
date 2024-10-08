import User from '../models/User.js';
import generateToken from '../utils/token.js';
import bcrypt from 'bcryptjs';

export const getDashboard = (req, res) => {
  res.json({
    user: req.user,
    roll:req.roll,
    message: 'Welcome to the dashboard!',
  });
};

export const getUsers = async (req, res) => {
  const users = await User.find(); 
  res.json({
    users
  });
};

// Controller for logging in a user or admin
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if the login attempt is for an admin account
  if (email === process.env.ADMIN_EMAIL) {
    const isAdminPasswordCorrect = await bcrypt.compare(password, await bcrypt.hash(process.env.ADMIN_PASSWORD, 10));
    if (isAdminPasswordCorrect) {
      // Generate token with admin role and send it as a cookie
      let tokk =  generateToken('admin', 'admin')
      res.cookie('token',tokk);
      return res.json({
        name: 'Admin',
        email: email,
        role: 'admin',
        token: tokk
      });
    } else {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
  }

  // If not admin, check for a regular user
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Generate token with user role and send it as a cookie
    let tok = generateToken(user._id, 'user')
    res.cookie('token', tok);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
      token: tok
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Controller for registering a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    // Send a token with 'user' role after successful registration
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, 'user'), // Role set to 'user'
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Controller for logging out a user
export const logoutUser = (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};