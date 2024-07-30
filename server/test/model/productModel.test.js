const chai = require('chai');
const mongoose = require('mongoose');
const Product = require('../../Model/ProductModel');
const Brand = require('../../Model/BrandModel');
const Category = require('../../Model/CategoryModel');
const ProductVariant = require('../../Model/ProductVariantModel');
const User = require('../../Model/UserModel');
const dotenv = require('dotenv');

dotenv.config();
const { expect } = chai;

describe('Product Model', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Category.deleteMany({});
    await ProductVariant.deleteMany({});
    await User.deleteMany({});
  });

  it('Lưu sản phẩm với dữ liệu hợp lệ', async function () {
    const brandData = {
      name: 'Samsung',
      picture: 'samsung-logo.png',
      country: 'South Korea',
      isHide: false,
    };
    const newBrand = new Brand(brandData);
    await newBrand.save();

  
    const categoryData = {
      name: 'Electronics',
    };
    const newCategory = new Category(categoryData);
    await newCategory.save();

    const variantData = {
      name: 'Color',
      options: ['Red', 'Blue', 'Green'],
    };
    const newVariant = new ProductVariant(variantData);
    await newVariant.save();


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
      brand: newBrand._id,
      category: newCategory._id,
      variant: [newVariant._id],
      ratings: [
        {
          rating: 4,
          comment: 'Great product!',
          user: newUser._id,
          createDate: '2023-01-02',
          pictures: ['rating-picture1.jpg', 'rating-picture2.jpg'],
        },
      ],
      include: 'Charger, Headphones',
      isHide: false,
      isOutOfStock: false,
      properties: { weight: '150g', dimensions: '150x70x7mm' },
      thumnails: ['thumbnail1.jpg', 'thumbnail2.jpg'],
      promotion: 'Free shipping for a limited time!',
    };

    const newProduct = new Product(productData);
    await newProduct.save();

  
    const savedProduct = await Product.findOne({ name: productData.name });
    expect(savedProduct).to.exist;
    expect(savedProduct.desc).to.equal(productData.desc);
    expect(savedProduct.releaseTime).to.equal(productData.releaseTime);
    expect(savedProduct.warrantyPeriod).to.equal(productData.warrantyPeriod);
    expect(savedProduct.brand.toString()).to.equal(productData.brand.toString());
    expect(savedProduct.category.toString()).to.equal(productData.category.toString());
    expect(savedProduct.variant.map(v => v.toString())).to.deep.equal(productData.variant.map(v => v.toString()));
    expect(savedProduct.ratings[0].rating).to.equal(productData.ratings[0].rating);
    expect(savedProduct.include).to.equal(productData.include);
    expect(savedProduct.isHide).to.equal(productData.isHide);
    expect(savedProduct.isOutOfStock).to.equal(productData.isOutOfStock);
    expect(savedProduct.properties).to.deep.equal(productData.properties);
    expect(savedProduct.thumnails).to.deep.equal(productData.thumnails);
    expect(savedProduct.promotion).to.equal(productData.promotion);
  });

  it('Yêu cầu trường name', async function () {
    const newProduct = new Product({
      desc: 'A great product',
      releaseTime: '2023-01-01',
      warrantyPeriod: 12,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      variant:  [new mongoose.Types.ObjectId()],
    });

    try {
      await newProduct.validate();
      await newProduct.save();
    } catch (e) {
      expect(e.errors['name'].message).to.equal('Path `name` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });





  it('Yêu cầu trường brand', async function () {
    const newProduct = new Product({
      name: 'Smartphone',
      desc: 'A great product',
      releaseTime: '2023-01-01',
      warrantyPeriod: 12,
      category: new mongoose.Types.ObjectId(),
      variant: [new mongoose.Types.ObjectId()],
    });

    try {
      await newProduct.validate();
      await newProduct.save();
    } catch (e) {
      expect(e.errors['brand'].message).to.equal('Path `brand` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });

  it('Yêu cầu trường category', async function () {
    const newProduct = new Product({
      name: 'Smartphone',
      desc: 'A great product',
      releaseTime: '2023-01-01',
      warrantyPeriod: 12,
      brand: new mongoose.Types.ObjectId(),
      variant: [new mongoose.Types.ObjectId()],
    });

    try {
      await newProduct.validate();
      await newProduct.save();
    } catch (e) {
      expect(e.errors['category'].message).to.equal('Path `category` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });

  it('Yêu cầu ít nhất một biến thể (variant)', async function () {
    const newProduct = new Product({
      name: 'Smartphone',
      desc: 'A great product',
      releaseTime: '2023-01-01',
      warrantyPeriod: 12,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
    });

    try {
      await newProduct.validate();
      await newProduct.save();
    } catch (e) {
      expect(e.errors['variant'].message).to.equal('Path `variant` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });
});
