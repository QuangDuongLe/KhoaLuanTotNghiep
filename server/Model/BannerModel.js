const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required : true
  },
  page: {
    type: String
  },
  location: {
    type: String
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    }
  }]
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
