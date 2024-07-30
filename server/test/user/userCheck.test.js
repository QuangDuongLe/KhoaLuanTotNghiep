const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../Model/UserModel');

const { expect } = chai;
const dotenv = require('dotenv');
dotenv.config();
chai.use(chaiHttp);

describe('Check tài khoản', function () {

  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async function () {
    await mongoose.connection.close();
  });
  beforeEach(async function () {
    await User.deleteMany({});
});
  it('Kiểm tra tài khoản không bị khoá', async function () {
    const user = new User({
        fullName: 'Nguyen Duy Nguyen',
        phone_number: '123456789',
        email: 'nguyennguyen123165765321@example.com',
        passWord: 'hashedPassword',
        role_id: 1,
        addRess: '123 Thu Duc',
        isBlocked: false,
      });
      await user.save();
    const email = 'nguyennguyen123165765321@example.com';
    const response = await chai
      .request(app)
      .get(`/api/user/checkAcc/${email}`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('isBlocked').to.equal(false);
  });

  it('Kiểm tra tài khoản đã khoá', async function () {
    const email = 'nguyennguyen123165765322@example.com';
    const blockedUser = new User({
      fullName: 'Blocked User',
      phone_number: '123456789',
      email: email,
      passWord: 'hashedPassword',
      role_id: 1,
      addRess: '123 Thu Duc',
      isBlocked: true,
    });
    await blockedUser.save();

    const response = await chai
      .request(app)
      .get(`/api/user/checkAcc/${email}`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('isBlocked').to.equal(true);
  });

  it('Kiểm tra tài khoản không tồn tại', async function () {
    const nonExistingEmail = 'nonexistent@example.com';
    const response = await chai
      .request(app)
      .get(`/api/user/checkAcc/${nonExistingEmail}`)
    expect(response).to.have.status(404);
    expect(response.body).to.have.property('message').to.equal('User not found');
  });
});
