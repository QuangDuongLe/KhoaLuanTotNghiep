const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique:true
  },
  picture: {
    type: String,
  },
  isHide: {
    type: Boolean,
  },
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
