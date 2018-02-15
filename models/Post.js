const mongoose = require('mongoose');
// Use global promise for mongoose
mongoose.Promise = global.Promise;
const slug = require('slugs');

// Make Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: 'Please enter a Title for the blog post!',
  },
  slug: String,
  content: {
    type: String,
    trim: true,
    required: 'Enter a blog content',
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'Blog Post Should have a valid User!',
  },
});
// Define Our Indexes for quick queries and searches
postSchema.index({
  title: 'text',
  description: 'text',
});
/* Auto generate slugs and pre-save
before someone saves a post in the schema.
not needed for new post only stores
with changed title */
postSchema.pre('save', async function (next) {
  if (!this.isModified('title')) {
    next(); // Skip. stop this this function back to save
    return;
  }
  /* THis takes the title of the post,
  runs it through the schema
    and get the slug field
    and assign it to the output */
  this.slug = slug(this.title);
  // find post with the same slug.
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const postWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (postWithSlug.length) {
    this.slug = `${this.slug}-${postWithSlug.length + 1}`;
  }
  next();
});
// Model to get the tag list
postSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};
// Add a virtual field to find comments where post_id = comment article
postSchema.virtual('comments', {
  ref: 'Comment', // What model to link
  localField: '_id', // field on the post schema
  foreignField: 'article', // Field on the COmment schema
});

module.exports = mongoose.model('Post', postSchema);
