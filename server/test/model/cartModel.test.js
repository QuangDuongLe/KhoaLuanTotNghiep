const chai = require('chai');
const mongoose = require('mongoose');
const Cart = require('../../Model/CartModel');
const Product = require('../../Model/ProductModel');
const ProductVariant = require('../../Model/ProductVariantModel');
const User = require('../../Model/UserModel');
const dotenv = require('dotenv');
dotenv.config();
const { expect } = chai;

describe('Cart Model', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await Cart.deleteMany({});
    await Product.deleteMany({});
    await ProductVariant.deleteMany({});
    await User.deleteMany({});
  });

  it('Lưu giỏ hàng với dữ liệu hợp lệ', async function () {
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

    const cartData = {
      user: newUser._id,
      items: [
        {
          product: newProduct._id,
          productVariant: newProductVariant._id,
          quantity: 2,
          color: 'Black',
          memory: '8GB',
          price: 899.99,
          pictures: 'cart-item-picture.jpg',
          subtotal: 1799.98,
        },
      ],
    };
    const newCart = new Cart(cartData);
    await newCart.save();

    const savedCart = await Cart.findOne({ user: newUser._id });
    expect(savedCart).to.exist;
    expect(savedCart.items).to.have.lengthOf(1);
    const savedCartItem = savedCart.items[0];
    expect(savedCartItem.product.toString()).to.equal(cartData.items[0].product.toString());
    expect(savedCartItem.productVariant.toString()).to.equal(cartData.items[0].productVariant.toString());
    expect(savedCartItem.quantity).to.equal(cartData.items[0].quantity);
    expect(savedCartItem.color).to.equal(cartData.items[0].color);
    expect(savedCartItem.memory).to.equal(cartData.items[0].memory);
    expect(savedCartItem.price).to.equal(cartData.items[0].price);
    expect(savedCartItem.pictures).to.equal(cartData.items[0].pictures);
    expect(savedCartItem.subtotal).to.equal(cartData.items[0].subtotal);
  });

  it('Yêu cầu trường user khi lưu giỏ hàng', async function () {
    const cartData = {
      items: [
        {
          product: new mongoose.Types.ObjectId(),
          productVariant: new mongoose.Types.ObjectId(),
          quantity: 2,
          color: 'Black',
          memory: '8GB',
          price: 899.99,
          pictures: 'cart-item-picture.jpg',
          subtotal: 1799.98,
        },
      ],
    };

    const newCart = new Cart(cartData);

    try {
      await newCart.validate();
      await newCart.save();
    } catch (e) {
      expect(e.errors['user'].message).to.equal('Path `user` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });

  it('Yêu cầu ít nhất một mục hàng trong giỏ hàng', async function () {
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

    const cartData = {
      user: newUser._id,
    };

    const newCart = new Cart(cartData);

    try {
      await newCart.validate();
      await newCart.save();
    } catch (e) {
      expect(e.errors['items'].message).to.equal('Path `items` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });
});
