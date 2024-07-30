const mongoose = require('mongoose');

const cartItemSchema  = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productVariant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  color: {
    type: String,
  },
  memory: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  pictures: {
    type: String,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  sku:{
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    default: false,
  }
});
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema], 
});
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
