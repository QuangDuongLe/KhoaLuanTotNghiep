const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const mongoose = require('mongoose');
const Brand = require('../../Model/BrandModel');
const Category = require('../../Model/CategoryModel');
const Product = require('../../Model/ProductModel');
const User = require('../../Model/UserModel');
const jwt = require('jsonwebtoken');
const { expect } = chai;

const dotenv = require('dotenv');
dotenv.config();
chai.use(chaiHttp);

describe('Add Product', function () {
  let authToken;
  let brand;
  let category;

  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = new User({
        fullName: 'Nguyen Duy Nguyen',
        phone_number: '123456789',
        email: 'nguyennguyen312321@example.com',
        passWord: 'hashedPassword',
        role_id: 1,
        addRess: '123 Thu Duc',
        isBlocked: false,
    });
    await user.save();

    authToken = jwt.sign({ id: user._id, role_id: user.role_id }, process.env.ACCESS_TOKEN);
 
    brand = new Brand({ name: 'TestBrand' });
    await brand.save();


    category = new Category({ name: 'TestCategory' });
    await category.save();
  });

  after(async function () {
    await Brand.deleteOne({ name: 'TestBrand' });
    await Category.deleteOne({ name: 'TestCategory' });
    await User.deleteOne({ email: 'nguyennguyen312321@example.com' });
    await mongoose.connection.close();
  });
  beforeEach(async function () {
    await Product.deleteMany({});
  });
  it('Thêm product thành công', async function () {
    const productData = {
      name: 'TestProduct',
      desc: 'Test product description',
      releaseTime: new Date(),
      warrantyPeriod: 12,
      brandName: 'TestBrand',
      categoryName: 'TestCategory',
      properties: { color: 'red', size: 'medium' },
      thumnails: ['thumbnail1.jpg', 'thumbnail2.jpg'],
      include: 'Test',
    };
    const response = await chai
      .request(app)
      .post('/api/product/addProduct')
      .set('token', `Bearer ${authToken}`)
      .send(productData);
    expect(response).to.have.status(201);
    expect(response.body).to.have.property('success').to.equal(true);
    expect(response.body).to.have.property('data');
    expect(response.body.data).to.have.property('name').to.equal('TestProduct');
  });

  it('Thêm một sản phẩm với thương hiệu không tồn tại', async function () {
    const productData = {
      name: 'TestProduct2',
      desc: 'Test product description 2',
      releaseTime: new Date(),
      warrantyPeriod: 24,
      brandName: 'NonExistentBrand',
      categoryName: 'TestCategory',
      properties: { color: 'blue', size: 'large' },
      thumnails: ['thumbnail3.jpg', 'thumbnail4.jpg'],
      include: 'Test',
    };

    const response = await chai
      .request(app)
      .post('/api/product/addProduct')
      .set('token', `Bearer ${authToken}`)
      .send(productData);

    expect(response).to.have.status(404);
    expect(response.body).to.have.property('success').to.equal(false);
    expect(response.body).to.have.property('error').to.equal('Brand không tồn tại');
  });
  it('Thêm một sản phẩm với thương hiệu không tồn tại', async function () {
    const productData = {
      name: 'TestProduct2',
      desc: 'Test product description 2',
      releaseTime: new Date(),
      warrantyPeriod: 24,
      brandName: 'TestBrand',
      categoryName: 'NonExistentCategory',
      properties: { color: 'blue', size: 'large' },
      thumnails: ['thumbnail3.jpg', 'thumbnail4.jpg'],
      include: 'Test',
    };

    const response = await chai
      .request(app)
      .post('/api/product/addProduct')
      .set('token', `Bearer ${authToken}`)
      .send(productData);

    expect(response).to.have.status(404);
    expect(response.body).to.have.property('success').to.equal(false);
    expect(response.body).to.have.property('error').to.equal('Category không tồn tại');
  });
});
