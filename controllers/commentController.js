const mongoose = require('mongoose');

const Comment = mongoose.model('Comment');

/*
Function to add new Comment to a post
*/
exports.newComment = async (req, res) => {
  req.body.author = req.user._id;
  req.body.name = req.user.name;
  await (new Comment(req.body)).save();
  req.flash('success', 'Comment Posted');
  res.redirect('back');
};
