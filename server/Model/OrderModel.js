const mongoose = require('mongoose');
const moment = require("moment-timezone");
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
  rated:{
    type: Boolean,
    default: false
  },
  change: {
    status: {
      type: String,
    },
    changeDates: {
      type: String, 
    },
    changeDateComplete: {
      type: String, 
    },
    changeCount: {
      type: Number,
      default: 0,
    },
    reasons: {
      type: String,
    }
  },
  sku: {
    type: String
  }
});
const orderSchema = new mongoose.Schema({
  orderCode: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
  },
  userPhone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  shippingMethod: {
    type: String,
    default: false,
  },
  status: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
  },
  shippingFee: {
    type: Number,
    required: true,
  },
  totalPay: {
    type: Number,
    required: true,
  },
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher'
  },
  createDate: {
    type: String,
    default: () =>
      moment()
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY HH:mm:ss"),
  },
  completeDate: {
    type: String,
  },
  isPay :{
    type: String,
  },
  reasonCancelled: {
    type: String
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
