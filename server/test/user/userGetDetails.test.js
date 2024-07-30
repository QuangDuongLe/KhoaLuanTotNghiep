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
describe('Get Detail User', function () {
    let authToken;

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
        const savedUser = await user.save();


      
        authToken = jwt.sign({ id: savedUser._id, role_id: savedUser.role_id }, process.env.ACCESS_TOKEN);
    });

    after(async function () {
        await mongoose.connection.close();
    });

    beforeEach(async function () {
        await User.deleteMany({});
    });

    it('Lấy thông tin chi tiết người dùng thành công', async function () {
        const user = new User({
            fullName: 'Nguyen Duy Nguyen',
            phone_number: '123456789',
            email: 'nguyennguyen312dưqdwq321@example.com',
            passWord: 'hashedPassword',
            role_id: 2,
            addRess: '123 Thu Duc',
            isBlocked: false,
        });
        const savedUser = await user.save();
        const response = await chai
            .request(app)
            .get(`/api/user/get-Detail/${savedUser._id}`)
            .set('token', `Bearer ${authToken}`);
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('data').to.be.an('object');
        expect(response.body.data).to.have.property('_id').to.equal(savedUser._id.toString());
    });
    

    it('Trả về lỗi khi không tìm thấy người dùng', async function () {
        const nonExistingUserId = '5f5e05d07f5e020017b3babc'; 
        const response = await chai
            .request(app)
            .get(`/api/user/get-Detail/${nonExistingUserId}`)
            .set('token', `Bearer ${authToken}`);

        expect(response).to.have.status(500);
        expect(response.body).to.have.property('err').to.equal('Không tồn tại User');
    });
    it('Trả về lỗi khi ID không hợp lệ', async function () {
        const invalidUserId = 'invalidId';
        const response = await chai
            .request(app)
            .get(`/api/user/get-Detail/${invalidUserId}`)
            .set('token', `Bearer ${authToken}`);

        expect(response).to.have.status(500);
        expect(response.body).to.have.property('msg').to.equal('Lỗi Server');
    });
});
