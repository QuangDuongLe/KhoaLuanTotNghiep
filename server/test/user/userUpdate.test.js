const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../Model/UserModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');
dotenv.config();
chai.use(chaiHttp);
const { expect } = chai;

describe('User Update', function () {
    let authToken;

    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });

        const password = 'hashedPassword';
        const hashedPassword = await argon2.hash(password);
        const user = new User({
            fullName: 'Nguyen Duy Nguyen',
            phone_number: '123456789',
            email: 'nguyennguyen@example.com',
            passWord: 'hashedPassword',
            role_id: 1,
            addRess: '123 Thu Duc',
            isBlocked: false,
        });
        await user.save();

        authToken = jwt.sign({ id: user._id, role_id: user.role_id }, process.env.ACCESS_TOKEN);
    });

    after(async function () {
        await mongoose.connection.close();
    });

    beforeEach(async function () {
        await User.deleteMany({});
    });

    it('Cập nhật thông tin người dùng thành công', async function () {
        const password = 'hashedPassword';
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            fullName: 'Nguyen Duy Nguyen',
            phone_number: '123456789',
            email: 'nguyennguyen12@example.com',
            passWord: hashedPassword,
            role_id: 2,
            addRess: '123 Thu Duc',
            isBlocked: false,
        });
        await newUser.save();
        const updatedData = {
            fullName: 'Updated User',
            phone_number: '987654321',
            addRess: '456 Main St',
        };

        const response = await chai
            .request(app)
            .post(`/api/user/update/${newUser._id}`)
            .set('token', `Bearer ${authToken}`)
            .send(updatedData);
          
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('msg').to.equal('Cập nhật thành công');
        const updatedUser = await User.findById(newUser._id);
        expect(updatedUser.fullName).to.equal(updatedData.fullName);
        expect(updatedUser.phone_number).to.equal(updatedData.phone_number);
        expect(updatedUser.addRess).to.equal(updatedData.addRess);
    });

    it('Trả về lỗi khi không tìm thấy người dùng', async function () {
        const nonExistentUserId = new ObjectId();
        const response = await chai
            .request(app)
            .post(`/api/user/update/${nonExistentUserId}`)
            .set('token', `Bearer ${authToken}`)
            .send({
                fullName: 'Updated User',
                phone_number: '987654321',
                addRess: '456 Main St',
            });
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('msg').to.equal('Không tồn tại người dùng');
    });
});
