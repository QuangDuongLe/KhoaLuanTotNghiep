const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../Model/UserModel');
const jwt = require('jsonwebtoken');
const { expect } = chai;
const dotenv = require('dotenv');
dotenv.config();
chai.use(chaiHttp);

describe('Search User', function () {
    let authToken;
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
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

    authToken = jwt.sign({ id: user._id, role_id: user.role_id }, process.env.ACCESS_TOKEN);
    const usersToCreate = [
        {
            fullName: 'User 1',
            phone_number: '123456789',
            email: 'user1@example.com',
            passWord: 'hashedPassword',
            role_id: 2,
            addRess: '123 Thu Duc',
            isBlocked: false,
        },
        {
            fullName: 'User 2',
            phone_number: '987654321',
            email: 'user2@example.com',
            passWord: 'hashedPassword',
            role_id: 2,
            addRess: '456 Main St',
            isBlocked: true,
        },
    ];
    await User.insertMany(usersToCreate);
});
  after(async function () {
    await mongoose.connection.close();
  });

  it('Tìm kiếm người dùng thành công', async function () {
    const keyword = 'nguyen'; 
    const response = await chai
      .request(app)
      .get(`/api/user/searchUser?keyword=${keyword}`)
      .set('token', `Bearer ${authToken}`); 
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('success').to.equal(true);
    expect(response.body).to.have.property('data').to.be.an('array');
    expect(response.body.data).to.have.lengthOf.above(0);
  });

  it('Tìm kiếm không có kết quả', async function () {
    const keyword = 'nonexistent'; 


    const response = await chai
      .request(app)
      .get(`/api/user/searchUser?keyword=${keyword}`)
      .set('token', `Bearer ${authToken}`); 

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('success').to.equal(true);
    expect(response.body).to.have.property('data').to.be.an('array');
    expect(response.body.data).to.have.lengthOf(0); 
  });

  it('Trả về tất cả sản phẩm nếu như keyword không được điền', async function () {
    const response = await chai
      .request(app)
      .get(`/api/user/searchUser`)
      .set('token', `Bearer ${authToken}`);
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('success').to.equal(true);
    expect(response.body).to.have.property('data').to.be.an('array');
  });
});
