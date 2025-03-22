const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { receiverId, amount, note } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    res.status(400);
    throw new Error('Invalid receiver ID');
  }
  
  if (amount <= 0) {
    res.status(400);
    throw new Error('Amount must be greater than 0');
  }
  
  const sender = await User.findById(req.user._id);
  const receiver = await User.findById(receiverId);
  
  if (!receiver) {
    res.status(404);
    throw new Error('Receiver not found');
  }
  
  if (sender._id.toString() === receiver._id.toString()) {
    res.status(400);
    throw new Error('Cannot transfer to yourself');
  }
  
  if (sender.balance < amount) {
    res.status(400);
    throw new Error('Insufficient balance');
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Create transaction
    const transaction = await Transaction.create([{
      sender: sender._id,
      receiver: receiver._id,
      amount,
      note: note || '',
      status: 'completed',
    }], { session });
    
    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;
    
    await sender.save({ session });
    await receiver.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json(transaction[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500);
    throw new Error('Transaction failed');
  }
}));

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    $or: [
      { sender: req.user._id },
      { receiver: req.user._id }
    ]
  })
    .populate('sender', 'name phoneNumber')
    .populate('receiver', 'name phoneNumber')
    .populate('amount')
    .populate('note')
    .sort({ createdAt: -1 });
  
  res.json(transactions);
}));

module.exports = router;