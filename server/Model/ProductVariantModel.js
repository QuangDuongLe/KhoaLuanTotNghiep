const mongoose = require('mongoose');
const productVariantSchema = new mongoose.Schema({
  productName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  memory:{
    type: String,
  },
  attributes: [{
    sku: {
      type: String,
      required: true,
      unique: true, 
      default: '',
    },
    color: 
    {
      type: String
    },
    quantity: {
      type: Number,
      require: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    pictures: {
      type: String,
    },
    status: {
      type: String,
    },
  }],
  imPrice: {
    type: Number,
  },
  oldPrice: 
  { 
    type: Number,
  },
  newPrice: {
    type: Number,
  },
});
const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);

module.exports = ProductVariant;
