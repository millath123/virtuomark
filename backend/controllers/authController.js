import User from '../models/User.js';
import generateToken from '../utils/token.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use 'SMTP' with specific host, port, etc.
  auth: {
    user: process.env.EMAIL_USERNAME, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

// Controller for logging in a user or admin
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if the login attempt is for an admin account
  if (email === process.env.ADMIN_EMAIL) {
    const isAdminPasswordCorrect = await bcrypt.compare(password, await bcrypt.hash(process.env.ADMIN_PASSWORD, 10));
    if (isAdminPasswordCorrect) {
      // Generate token with admin role and send it as a cookie
      res.cookie('token', generateToken('admin', 'admin'), { httpOnly: true, secure: true, sameSite: 'Strict' });
      return res.json({
        name: 'Admin',
        email: email,
        role: 'admin',
      });
    } else {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
  }

  // If not admin, check for a regular user
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Generate token with user role and send it as a cookie
    res.cookie('token', generateToken(user._id, 'user'), { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Controller for registering a new user
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, role });

  if (user) {
    // Send Welcome Email
    const mailOptions = {
      from: 'YourApp <no-reply@yourapp.com>',
      to: email,
      subject: 'Welcome to Your App!',
      text: `Hello ${name}, thank you for registering with us!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Nodemailer Error:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
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
