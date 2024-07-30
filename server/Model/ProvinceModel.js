const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema({
  province: [
    {
      idProvince: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      shippingFee: {
        type: Number,
        required: true
      },
      deleted: {
        type: Boolean,
        default: false
      }
    }
  ],
  district: [
    {
      idProvince: {
        type: String,
        required: true
      },
      idDistrict: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      deleted: {
        type: Boolean,
        default: false
      }
    }
  ],
  commune: [
    {
      idDistrict: {
        type: String,
        required: true
      },
      idCommune: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      deleted: {
        type: Boolean,
        default: false
      }
    }
  ]
});

const ProvinceModel = mongoose.model('Province', provinceSchema);

module.exports = ProvinceModel;
