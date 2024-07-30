const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app'); 
const mongoose = require('mongoose');
const User = require('../../Model/UserModel');
const dotenv = require('dotenv');
const argon2 = require('argon2');
dotenv.config();
chai.use(chaiHttp);
const { expect } = chai;

describe('Forgot Password', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async function () {
        await mongoose.connection.close();
    });

    beforeEach(async function () {
        await User.deleteMany({});
    });

    it('Đặt lại mật khẩu thành công', async function () {
        const password = 'hashedPassword';
        const hashedPassword = await argon2.hash(password);
        const user = new User({
            fullName: 'Nguyen Duy Nguyen',
            phone_number: '123456789',
            email: 'nguyennguyen121212321@example.com',
            passWord: hashedPassword,
            role_id: 1,
            addRess: '123 Thu Duc',
            isBlocked: false,
        });
        await user.save();
    

        const response = await chai
            .request(app)
            .put('/api/user/forgotpassword')
            .send({
                email: 'nguyennguyen121212321@example.com',
            });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('success').to.be.true;
        expect(response.body).to.have.property('rs');
    });

    it('Trả về lỗi khi không tìm thấy email', async function () {
        const response = await chai
            .request(app)
            .put('/api/user/forgotpassword')
            .send({
                email: 'nonexistent@example.com',
            });

        expect(response).to.have.status(500);
        expect(response.body).to.have.property('success').to.be.false;
        expect(response.body).to.have.property('error');
    });
});
