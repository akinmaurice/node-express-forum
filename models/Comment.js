const mongoose = require('mongoose');
// Use global promise for mongoose
mongoose.Promise = global.Promise;

// make Schema
const commentSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: 'Comment should have a valid Article',
  },
  comment: {
    type: String,
    trim: true,
    required: 'Comment cannot be Empty!',
  },
  name: {
    type: String,
    trim: true,
    required: 'Name Cannot be Empty!',
  },
  email: {
    type: String,
    trim: true,
    required: 'Email Address is Required!',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
