const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, bankName, bankAccountNo, password } = req.body;
  
  // Check if user already exists
  const userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  
  // Create user
  const user = await User.create({
    name,
    email,
    phoneNumber,
    bankName,
    bankAccountNo,
    password,
  });
  
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      bankName: user.bankName,
      bankAccountNo: user.bankAccountNo,
      balance: user.balance,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}));

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Check for user email
  const user = await User.findOne({ email });
  
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      bankName: user.bankName,
      bankAccountNo: user.bankAccountNo,
      balance: user.balance,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

module.exports = router;