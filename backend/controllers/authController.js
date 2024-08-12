import User from '../models/User.js';
import generateToken from '../utils/token.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

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
    let pas = process.env.ADMIN_PASSWORD
    if (password == pas) {
      // Generate token with admin role and send it as a cookie
      let tokk =  generateToken('adminid', 'admin')
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
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, role });

  if (user) {
    // Send Welcome Email
    const mailOptions = {
      from: 'jcclubotp@gmail.com',
      to: email,
      subject: 'Welcome to virtuomark!',
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
