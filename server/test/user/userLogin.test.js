const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../Model/UserModel');
const argon2 = require('argon2');
const dotenv = require('dotenv');
dotenv.config()
chai.use(chaiHttp);
const { expect } = chai;

describe('User Login', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });
    after(async function () {
        await mongoose.connection.close();
      });
  beforeEach(async function () {
    await User.deleteMany({});
  });

  it('Đăng nhập với thông tin người dùng hợp lệ', async function () {
    const password = 'hashedPassword';
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      fullName: 'Nguyen Duy Nguyen',
      phone_number: '123456789',
      email: 'nguyennguyen@example.com',
      passWord: hashedPassword,
      role_id: 2,
      addRess: '123 Thu Duc',
      isBlocked: false,
    });
    await newUser.save();

  
    const response = await chai
      .request(app)
      .post('/api/user/Login')
      .send({
        email: 'nguyennguyen@example.com',
        passWord: 'hashedPassword',
      });

 
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('access_Token');
    expect(response.body).to.have.property('refresh_Token');
  });

  it('Trả về lỗi cho thông tin người dùng không hợp lệ', async function () {
    const password = 'hashedPassword'; 
  const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      fullName: 'Nguyen Duy Nguyen',
      phone_number: '123456789',
      email: 'nguyennguyen@example.com',
      passWord: hashedPassword,
      role_id: 2,
      addRess: '123 Thu Duc',
      isBlocked: false,
    });
    await newUser.save();
    const response = await chai
      .request(app)
      .post('/api/user/Login')
      .send({
        email: 'nguyennguyen@example.com',
        passWord: 'wrongPassword',
      });
    expect(response).to.have.status(401);
    expect(response.body).to.have.property('err').to.equal('Username/Password not match!');
  });
});
