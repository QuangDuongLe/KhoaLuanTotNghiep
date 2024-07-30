const mongoose = require('mongoose');

const userAccessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const UserAccess = mongoose.model('UserAccess', userAccessSchema);

module.exports = UserAccess;
