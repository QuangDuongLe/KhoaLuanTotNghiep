const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app'); 
const mongoose = require('mongoose');
const User = require('../../Model/UserModel');


chai.use(chaiHttp);
const { expect } = chai;

describe('User Register', function () {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
});
after(async function () {
  await mongoose.connection.close();
});
  beforeEach(async function () {
    await User.deleteMany({});
  });

  it('Đăng ký một người dùng mới', async function () {
    const response = await chai
      .request(app)
      .post('/api/user/Register')
      .send({
        fullName: 'Nguyen Duy Nguyen',
        phone_number: '123456789',
        email: 'nguyennguyen2@example.com',
        passWord: 'hashedPassword',
        role_id: 2,
        addRess: '123 Thu Duc',
        isBlocked: false,
      });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('success').to.be.true;
    expect(response.body).to.have.property('msg').to.equal('Đăng ký thành công');
  });

  it('Trả về lỗi cho email đã tồn tại', async function () {
    await chai
      .request(app)
      .post('/api/user/Register')
      .send({
        fullName: 'Nguyen Duy Nguyen',
      phone_number: '123456789',
      email: 'nguyennguyen23@example.com',
      passWord: 'hashedPassword',
      role_id: 2,
      addRess: '123 Thu Duc',
      isBlocked: false,
      });

    const response = await chai
      .request(app)
      .post('/api/user/Register')
      .send({
        fullName: 'Nguyen Duy Nguyen',
        phone_number: '123456789',
        email: 'nguyennguyen23@example.com',
        passWord: 'hashedPassword',
        role_id: 2,
        addRess: '123 Thu Duc',
        isBlocked: false,
      });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('success').to.be.false;
    expect(response.body).to.have.property('msg').to.equal('Email đã được sử dụng');
  });
});
