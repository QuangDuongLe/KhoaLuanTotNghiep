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

describe('Delete User', function () {
    let authToken;

    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
        const user = new User({
            fullName: 'Nguyen Duy Nguyen',
            phone_number: '123456789',
            email: 'nguyennguyen312321@example.com',
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

    it('Xóa người dùng thành công', async function () {
        const userToDelete = new User({
            fullName: 'User To Delete',
            phone_number: '987654321',
            email: 'deleteuser@example.com',
            passWord: 'hashedPassword',
            role_id: 2,
            addRess: '456 Main St',
            isBlocked: false,
        });
        await userToDelete.save();

        const response = await chai
            .request(app)
            .delete(`/api/user/delete/${userToDelete._id}`)
            .set('token', `Bearer ${authToken}`);
          
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data._id).to.equal(userToDelete._id.toString());

        
        const deletedUser = await User.findById(userToDelete._id);
        expect(deletedUser).to.be.null;
    });

    it('Trả về lỗi khi không tìm thấy người dùng', async function () {
        const nonExistentUserId = new mongoose.Types.ObjectId(); 
        const response = await chai
            .request(app)
            .delete(`/api/user/delete/${nonExistentUserId}`)
            .set('token', `Bearer ${authToken}`);
        
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('msg').to.equal('Không tồn tại người dùng');
    });
});
