
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      bankName: user.bankName,
      bankAccountNo: user.bankAccountNo,
      balance: user.balance,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Get user by phone number
// @route   GET /api/users/search/:phoneNumber
// @access  Private
router.get('/search/:phoneNumber', protect, asyncHandler(async (req, res) => {
  const user = await User.findOne({ 
    phoneNumber: req.params.phoneNumber 
  }).select('name phoneNumber _id');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

module.exports = router;

