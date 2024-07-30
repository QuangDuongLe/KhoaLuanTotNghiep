const chai = require('chai');
const mongoose = require('mongoose');
const Voucher = require('../../Model/VourcherModel');
const dotenv = require('dotenv');

dotenv.config();
const { expect } = chai;

describe('Voucher Model', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await Voucher.deleteMany({});
  });

  it('Lưu voucher với dữ liệu hợp lệ', async function () {
    const voucherData = {
      name: 'Discount 20%',
      code: 'DISCOUNT20',
      startDate: '01/01/2023',
      endDate: '31/12/2023',
      quantity: 100,
      discount: 20,
    };

    const newVoucher = new Voucher(voucherData);
    await newVoucher.save();

    const savedVoucher = await Voucher.findOne({ code: 'DISCOUNT20' });
    expect(savedVoucher).to.exist;
    expect(savedVoucher.name).to.equal(voucherData.name);
    expect(savedVoucher.startDate).to.equal(voucherData.startDate);
    expect(savedVoucher.endDate).to.equal(voucherData.endDate);
    expect(savedVoucher.quantity).to.equal(voucherData.quantity);
    expect(savedVoucher.discount).to.equal(voucherData.discount);
  });

  it('Yêu cầu trường name khi lưu voucher', async function () {
    const voucherData = {
      code: 'DISCOUNT20',
      startDate: '01/01/2023',
      endDate: '31/12/2023',
      quantity: 100,
      discount: 20,
    };

    const newVoucher = new Voucher(voucherData);

    try {
      await newVoucher.validate();
      await newVoucher.save();
    } catch (e) {
      expect(e.errors['name'].message).to.equal('Path `name` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });

  it('Yêu cầu trường code khi lưu voucher', async function () {
    const voucherData = {
      name: 'Discount 20%',
      startDate: '01/01/2023',
      endDate: '31/12/2023',
      quantity: 100,
      discount: 20,
    };

    const newVoucher = new Voucher(voucherData);

    try {
      await newVoucher.validate();
      await newVoucher.save();
    } catch (e) {
      expect(e.errors['code'].message).to.equal('Path `code` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });
});
