const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const mongoose = require('mongoose');
const { expect } = chai;

chai.use(chaiHttp);

describe('Get Products By Category', function () {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });
  after(async function () {
    await mongoose.connection.close();
  });

  it('Lấy ra sản phẩm ở trang mặc định', async function () {
    const response = await chai
      .request(app)
      .get(`/api/product/getIdByCategory/6527a590306805034dfd6055`);
    
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('success').to.equal(true);
    expect(response.body).to.have.property('data').to.be.an('array');
    expect(response.body.data).to.have.lengthOf.at.most(10);
    expect(response.body).to.have.property('pageInfo');
    expect(response.body.pageInfo).to.have.property('currentPage').to.equal(1);
    expect(response.body.pageInfo).to.have.property('totalPages');
    expect(response.body.pageInfo).to.have.property('totalProducts');
  });

  it('Lấy sản phẩm ở trang bất kỳ', async function () {
    const pageToRequest = 2; 
    const response = await chai
      .request(app)
      .get(`/api/product/getIdByCategory/6527a590306805034dfd6055?page=${pageToRequest}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('success').to.equal(true);
    expect(response.body).to.have.property('data').to.be.an('array');
    expect(response.body).to.have.property('pageInfo');
    expect(response.body.pageInfo).to.have.property('currentPage').to.equal(pageToRequest);
    expect(response.body.pageInfo).to.have.property('totalPages');
    expect(response.body.pageInfo).to.have.property('totalProducts');
  });
  it('Lấy sản phẩm với id category không tồn tại', async function () {
    const response = await chai
      .request(app)
      .get(`/api/product/getIdByCategory/6527a590306805034dfd1209`);
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('success').to.equal(true);
    expect(response.body).to.have.property('data').to.be.an('array').that.is.empty;
    expect(response.body).to.have.property('pageInfo');
    expect(response.body.pageInfo).to.have.property('currentPage').to.equal(1);
    expect(response.body.pageInfo).to.have.property('totalPages').to.equal(0);
    expect(response.body.pageInfo).to.have.property('totalProducts').to.equal(0);
  });

  it('Lấy category với định dạng sai', async function () {
    const response = await chai
      .request(app)
      .get(`/api/product/getIdByCategory/invalidCategoryId`);
    expect(response).to.have.status(500);
    expect(response.body).to.have.property('success').to.equal(false);
    expect(response.body).to.have.property('error').to.equal('Lỗi Server');
  });
});
