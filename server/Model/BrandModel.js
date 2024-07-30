const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  picture: {
    type: String,
  },
  country: {
    type: String,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  isHide: {
    type: Boolean,
  },
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
