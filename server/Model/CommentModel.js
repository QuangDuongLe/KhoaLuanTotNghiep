const mongoose = require('mongoose');
const moment = require("moment-timezone");
const commentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true, // Fixed typo 'require' to 'required'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  author: {
    type: String,
  },
  content: {
    type: String,
    required: true, 
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  check: {
    type: Boolean 
  },
  isReply: {
    type: Boolean
  },
  deleted: { 
    type: Boolean,
    default: false
  },
  createDate: {
    type: String,
    default: () =>
      moment()
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY HH:mm:ss"),
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
