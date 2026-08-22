// User.js — Mongoose schema for a user account
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // no two users can have the same email
  },
  passwordHash: {
    type: String,
    required: true, // we store the hashed password, never plain text
  },
  avatar: {
    type: String,
    default: '', // can hold a URL to an avatar image later
  },
}, {
  timestamps: true, // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);