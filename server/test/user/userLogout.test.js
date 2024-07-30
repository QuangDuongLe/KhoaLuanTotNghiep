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

describe('User Logout', function () {
    

    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });
    

    after(async function () {
        await mongoose.connection.close();
    });

    beforeEach(async function () {
        await User.deleteMany({});
    });
    it('Đăng xuất người dùng thành công', async function () {
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
    
       
            await chai
                .request(app)
                .post('/api/user/Login')
                .send({
                    email: 'nguyennguyen1231321@example.com',
                passWord: 'hashedPassword',
                });
       const response = await chai
        .request(app)
        .post('/api/user/Logout')

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('msg').to.equal('Tạm biệt!');
        
        const cookies = response.headers['set-cookie'];
        expect(cookies).to.exist;

        const refreshCookie = cookies.find(cookie => cookie.startsWith('refresh_token'));
        expect(refreshCookie).to.exist;
    });
});
