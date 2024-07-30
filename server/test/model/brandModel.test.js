const chai = require('chai');
const mongoose = require('mongoose');
const Brand = require('../../Model/BrandModel'); 
const Category = require('../../Model/CategoryModel'); 
const dotenv = require('dotenv');
dotenv.config();
const { expect } = chai;

describe('Brand Model', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await Brand.deleteMany({});
    await Category.deleteMany({});
  });

  it('Lưu thương hiệu với dữ liệu hợp lệ', async function () {
    const categoryData = {
      name: 'Electronics',
    };
    const newCategory = new Category(categoryData);
    await newCategory.save();

    const brandData = {
      name: 'Samsung',
      picture: 'samsung-logo.png',
      country: 'South Korea',
      categoryId: newCategory._id, 
      isHide: false,
    };

    const newBrand = new Brand(brandData);
    await newBrand.save();

    const savedBrand = await Brand.findOne({ name: brandData.name });
    expect(savedBrand).to.exist;
    expect(savedBrand.picture).to.equal(brandData.picture);
    expect(savedBrand.country).to.equal(brandData.country);
    expect(savedBrand.categoryId.toString()).to.equal(brandData.categoryId.toString());
    expect(savedBrand.isHide).to.equal(brandData.isHide);
  });

  it('Yêu cầu trường name', async function () {
    const newBrand = new Brand({
      picture: 'sony-logo.png',
      country: 'Japan',
      categoryId: new mongoose.Types.ObjectId(), 
      isHide: false,
    });

    try {
      await newBrand.validate();
      await newBrand.save();
    } catch (e) {
      expect(e.errors['name'].message).to.equal('Path `name` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });

  it('Yêu cầu trường categoryId', async function () {
    const newBrand = new Brand({
      name: 'Sony',
      picture: 'sony-logo.png',
      country: 'Japan',
      isHide: false,
    });

    try {
      await newBrand.validate();
      await newBrand.save();
    } catch (e) {
      expect(e.errors['categoryId'].message).to.equal('Path `categoryId` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });
});
