const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true, 
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  maxPrice: {
    type: Number,
    required: true
  },
  applicablePaymentMethod: { 
    type: String,
    required: false 
  },
  applicableProductTypes: [{ 
    type: String,
    required: false
  }]
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
