const chai = require('chai');
const mongoose = require('mongoose');
const User = require('../../Model/UserModel');
const { expect } = chai;
const dotenv = require('dotenv');

dotenv.config();
describe('User Model', function () {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
});

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await User.deleteMany({});
  });

  it('Lưu người dùng với dữ liệu hợp lệ', async function () {
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

    const savedUser = await User.findOne({ email: userData.email });
    expect(savedUser).to.exist;
    expect(savedUser.fullName).to.equal(userData.fullName);
    expect(savedUser.passWord).to.equal(userData.passWord);
    expect(savedUser.phone_number).to.equal(userData.phone_number);
    expect(savedUser.role_id).to.equal(userData.role_id);
  });

  it('Yêu cầu trường email', async function () {
    const newUser = new User({
      fullName: 'Nguyen Duy Nguyen',
      phone_number: '123456789',
      passWord: 'hashedPassword',
      role_id: 2,
      addRess: '123 Thu Duc',
      isBlocked: false,
    });

    try {
      await newUser.validate();
      await newUser.save();
    } catch (e) {
      expect(e.errors['email'].message).to.equal('Path `email` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });

  it('Yêu cầu trường email duy nhất', async function () {
    const existingUserData = {
      fullName: 'Existing User',
      phone_number: '987654321',
      email: 'nguyennguyen12321321@example.com',
      passWord: 'hashedPassword',
      role_id: 2,
      addRess: '456 Thu duc',
      isBlocked: false,
    };

    const existingUser = new User(existingUserData);
    await existingUser.save();

    const newUser = new User({
      fullName: 'Nguyen Duy Nguyen',
      phone_number: '123456789',
      email: 'nguyennguyen12321321@example.com',
      passWord: 'hashedPassword',
      role_id: 2,
      addRess: '123 Thu Duc',
      isBlocked: false,
    });

    let error = null;
    try {
      await newUser.validate();
      await newUser.save();
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.code).to.equal(11000);
  });
});
