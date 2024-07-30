const chai = require('chai');
const mongoose = require('mongoose');
const Order = require('../../Model/OrderModel');
const User = require('../../Model/UserModel');
const Product = require('../../Model/ProductModel');
const ProductVariant = require('../../Model/ProductVariantModel');
const dotenv = require('dotenv');

dotenv.config();
const { expect } = chai;

describe('Order Model', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    await ProductVariant.deleteMany({});
  });

  it('Lưu đơn hàng với dữ liệu hợp lệ', async function () {
    const userData = {
      fullName: 'Nguyen Duy Nguyen',
      phone_number: '123456789',
      email: 'nguyennguyen@example.com',
      passWord: 'hashedPassword',
      role_id: 2,
      addRess: '123 Thu Duc',
      isBlocked: false,
    };
    const newUser = new User(userData);
    await newUser.save();

    const productData = {
      name: 'Smartphone',
      desc: 'A great smartphone',
      releaseTime: '2023-01-01',
      warrantyPeriod: 12,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      variant: [],
    };
    const newProduct = new Product(productData);
    await newProduct.save();

    const variantData = {
      productName: newProduct._id,
      memory: '8GB',
      attributes: [
        {
          sku: 'SKU123',
          color: 'Black',
          quantity: 10,
          pictures: 'variant-picture1.jpg',
          status: 'In stock',
        },
      ],
      imPrice: 999.99,
      oldPrice: 1099.99,
      newPrice: 899.99,
    };
    const newProductVariant = new ProductVariant(variantData);
    await newProductVariant.save();

    const orderData = {
      orderCode: 'ORDER123',
      user: newUser._id,
      items: [
        {
          product: newProduct._id,
          productVariant: newProductVariant._id,
          quantity: 2,
          color: 'Black',
          memory: '8GB',
          price: 899.99,
          pictures: 'variant-picture1.jpg',
          subtotal: 1799.98,
          rated: false,
          change: {
            isHave: false,
            dateChange: '',
          },
        },
      ],
      userName: 'Nguyen Duy Nguyen',
      userEmail: 'nguyennguyen@example.com',
      userPhone: '123456789',
      address: '123 Thu Duc',
      shippingMethod: 'Express',
      status: 'Pending',
      paymentMethod: 'Credit Card',
      subTotal: 1799.98,
      shippingFee: 10.0,
      totalPay: 1809.98,
      voucher: null,
      createDate: '01/01/2023 12:00:00',
      completeDate: '',
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const savedOrder = await Order.findOne({ orderCode: 'ORDER123' });
    expect(savedOrder).to.exist;
    expect(savedOrder.user.toString()).to.equal(orderData.user.toString());
    expect(savedOrder.items).to.have.lengthOf(1);
    expect(savedOrder.items[0].product.toString()).to.equal(orderData.items[0].product.toString());
    expect(savedOrder.userName).to.equal(orderData.userName);
    expect(savedOrder.userEmail).to.equal(orderData.userEmail);
    expect(savedOrder.userPhone).to.equal(orderData.userPhone);
    expect(savedOrder.address).to.equal(orderData.address);
    expect(savedOrder.shippingMethod).to.equal(orderData.shippingMethod);
    expect(savedOrder.status).to.equal(orderData.status);
    expect(savedOrder.paymentMethod).to.equal(orderData.paymentMethod);
    expect(savedOrder.subTotal).to.equal(orderData.subTotal);
    expect(savedOrder.shippingFee).to.equal(orderData.shippingFee);
    expect(savedOrder.totalPay).to.equal(orderData.totalPay);
    expect(savedOrder.voucher).to.equal(orderData.voucher);
    expect(savedOrder.createDate).to.equal(orderData.createDate);
    expect(savedOrder.completeDate).to.equal(orderData.completeDate);
  });

  it('Yêu cầu trường orderCode khi lưu đơn hàng', async function () {
    const userData = {
      fullName: 'Nguyen Duy Nguyen',
      phone_number: '123456789',
      email: 'nguyennguyen@example.com',
      passWord: 'hashedPassword',
      role_id: 2,
      addRess: '123 Thu Duc',
      isBlocked: false,
    };
    const newUser = new User(userData);
    await newUser.save();

    const orderData = {
      user: newUser._id,
      items: [],
      userName: 'Nguyen Duy Nguyen',
      userEmail: 'nguyennguyen@example.com',
      userPhone: '123456789',
      address: '123 Thu Duc',
      shippingMethod: 'Express',
      status: 'Pending',
      paymentMethod: 'Credit Card',
      subTotal: 0,
      shippingFee: 10.0,
      totalPay: 10.0,
      voucher: null,
      createDate: '01/01/2023 12:00:00',
      completeDate: '',
    };

    const newOrder = new Order(orderData);

    try {
      await newOrder.validate();
      await newOrder.save();
    } catch (e) {
      expect(e.errors['orderCode'].message).to.equal('Path `orderCode` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });
});
