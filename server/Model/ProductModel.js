const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  desc: {
    type: String,
    require: true,
  },
  releaseTime: {
    type: String,
    require: true,
  },
  warrantyPeriod: {
    type: Number,
    require: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand', 
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
  },
  variant: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant', 
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  ratings: [
    {
      rating: {
        type: Number,
      },
      comment: {
        type: String
      }, 
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      },
      createDate:{
        type: String
      },
      pictures: [
        {
          type: String
        }]
    },
  ],
  include: {
    type: String,
  },
  isHide: {
    type: Boolean,
  },
  isOutOfStock: {
    type: Boolean,
    default: false,
  },
  properties:   
  {
    type: Object,
  },
  thumnails:[
  {
    type: String
  }],
  promotion: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
