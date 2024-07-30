const chai = require('chai');
const mongoose = require('mongoose');
const ProductVariant = require('../../Model/ProductVariantModel');
const Product = require('../../Model/ProductModel');
const dotenv = require('dotenv');

dotenv.config();
const { expect } = chai;

describe('ProductVariant Model', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await ProductVariant.deleteMany({});
    await Product.deleteMany({});
  });

  it('Lưu biến thể sản phẩm với dữ liệu hợp lệ', async function () {
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

    const savedProductVariant = await ProductVariant.findOne({ productName: newProduct._id });
    expect(savedProductVariant).to.exist;
    expect(savedProductVariant.memory).to.equal(variantData.memory);
    expect(savedProductVariant.imPrice).to.equal(variantData.imPrice);
  });

  it('Yêu cầu trường SKU khi lưu biến thể sản phẩm', async function () {
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
      memory: '16GB',
      attributes: [
        {
          color: 'White',
          quantity: 5,
          pictures: 'variant-picture2.jpg',
          status: 'In stock',
        },
      ],
      imPrice: 799.99,
      oldPrice: 899.99,
      newPrice: 699.99,
    };
  
    const newProductVariant = new ProductVariant(variantData);
  
    try {
      await newProductVariant.validate();
      await newProductVariant.save();
    } catch (e) {
        const errors = e.errors;
        expect(errors).to.have.property('attributes.0.sku');
        expect(errors['attributes.0.sku'].kind).to.equal('required');
    }
  });  
});
