const chai = require('chai');
const mongoose = require('mongoose');
const Category = require('../../Model/CategoryModel'); 
const { expect } = chai;
const dotenv = require('dotenv');
dotenv.config();
describe('Category Model', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await Category.deleteMany({});
  });

  it('Lưu category với dữ liệu hợp lệ', async function () {
    const categoryData = {
      name: 'Electronics',
      picture: 'electronics.jpg',
      isHide: false,
    };

    const newCategory = new Category(categoryData);
    await newCategory.save();

    const savedCategory = await Category.findOne({ name: categoryData.name });
    expect(savedCategory).to.exist;
    expect(savedCategory.picture).to.equal(categoryData.picture);
    expect(savedCategory.isHide).to.equal(categoryData.isHide);
  });

  it('Yêu cầu trường name', async function () {
    const newCategory = new Category({
      picture: 'electronics.jpg',
      isHide: false,
    });

    try {
      await newCategory.validate();
      await newCategory.save();
    } catch (e) {
      expect(e.errors['name'].message).to.equal('Path `name` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });

  it('Yêu cầu trường name duy nhất', async function () {
    const existingCategoryData = {
      name: 'Clothing',
      picture: 'clothing.jpg',
      isHide: false,
    };

    const existingCategory = new Category(existingCategoryData);
    await existingCategory.save();

    const newCategory = new Category({
      name: 'Clothing',
      picture: 'new_clothing.jpg',
      isHide: true,
    });

    let error = null;
    try {
      await newCategory.validate();
      await newCategory.save();
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.code).to.equal(11000);
  });
});
