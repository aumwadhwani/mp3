// Load required packages

const mongoose = require('mongoose');

// Define our user schema

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'User name is required'] },
  email: {
    type: String,
    required: [true, 'required email'],
    unique: true,
    index: true,
    trim: true,
  },
  pendingTasks: { type: [String], default: [] },
  dateCreated: { type: Date, default: Date.now, immutable: true },
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);