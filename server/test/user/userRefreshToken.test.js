const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../Model/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
chai.use(chaiHttp);
const { expect } = chai;
describe('Refresh Token', function () {
    let authToken;
    let refreshToken;

    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });

        const user = new User({
            fullName: 'Nguyen Duy Nguyen',
            phone_number: '123456789',
            email: 'nguyennguyen1231321@example.com',
            passWord: 'hashedPassword',
            role_id: 1,
            addRess: '123 Thu Duc',
            isBlocked: false,
        });
        await user.save();

        authToken = jwt.sign({ id: user._id, role_id: user.role_id }, process.env.ACCESS_TOKEN);
        refreshToken = jwt.sign({ id: user._id, role_id: user.role_id }, process.env.REFRESH_TOKEN);
    });

    after(async function () {
        await mongoose.connection.close();
    });

    beforeEach(async function () {
        await User.deleteMany({});
    });

    it('Làm mới token thành công', async function () {
        const response = await chai
            .request(app)
            .post('/api/user/refresh-token')
            .set('Cookie', `refresh_token=${refreshToken}`);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('access_Token').to.be.a('string');
    });

    it('Trả về lỗi khi không có token', async function () {
        const response = await chai
            .request(app)
            .post('/api/user/refresh-token');

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('msg').to.equal('Không tìm thấy ID');
    });

    it('Trả về lỗi khi làm mới token không thành công', async function () {
        const invalidRefreshToken = 'invalidToken';
        const response = await chai
            .request(app)
            .post('/api/user/refresh-token')
            .set('Cookie', `refresh_token=${invalidRefreshToken}`);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('msg').to.equal('Lỗi khi làm mới token');
    });
});
