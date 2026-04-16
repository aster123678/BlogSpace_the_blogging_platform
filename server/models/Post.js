const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 150
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  tags: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Auto-generate excerpt and read time before saving
postSchema.pre('save', function (next) {
  if (this.content && !this.excerpt) {
    this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  }
  if (this.content) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(' ').length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
