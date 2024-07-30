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

describe('Get All Users', function () {
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
        await user.save();

        authToken = jwt.sign({ id: user._id, role_id: user.role_id }, process.env.ACCESS_TOKEN);
    });

    after(async function () {
        await mongoose.connection.close();
    });

    beforeEach(async function () {
        await User.deleteMany({});
    });

    it('Lấy danh sách tất cả người dùng thành công', async function () {
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
        const insertedUsers = await User.insertMany(usersToCreate);
    
        const response = await chai
            .request(app)
            .get('/api/user/getAll')
            .set('token', `Bearer ${authToken}`);    
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('data').to.be.an('array');
        expect(response.body.data.length).to.equal(usersToCreate.length);
    
        for (let i = 0; i < usersToCreate.length; i++) {
            const expectedUser = usersToCreate[i];
            const returnedUser = response.body.data.find(user => user._id.toString() === insertedUsers[i]._id.toString());
    
            expect(returnedUser).to.exist;
            expect(returnedUser.fullName).to.equal(expectedUser.fullName);
            expect(returnedUser.phone_number).to.equal(expectedUser.phone_number);
            expect(returnedUser.email).to.equal(expectedUser.email);
            expect(returnedUser.role_id).to.equal(expectedUser.role_id);
            expect(returnedUser.addRess).to.equal(expectedUser.addRess);
            expect(returnedUser.isBlocked).to.equal(expectedUser.isBlocked);
        }
    });
    
    
    

    it('Trả về mảng rỗng nếu không có người dùng', async function () {
        const response = await chai
            .request(app)
            .get('/api/user/getAll')
            .set('token', `Bearer ${authToken}`);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('data').to.be.an('array').that.is.empty;
    });
});
