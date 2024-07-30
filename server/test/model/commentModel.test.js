const chai = require('chai');
const mongoose = require('mongoose');
const Comment = require('../../Model/CommentModel');
const Product = require('../../Model/ProductModel');
const User = require('../../Model/UserModel');
const dotenv = require('dotenv');

dotenv.config();
const { expect } = chai;

describe('Comment Model', function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await Comment.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  it('Lưu bình luận với dữ liệu hợp lệ', async function () {
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

    const productData = {
      name: 'Smartphone',
      desc: 'A great smartphone',
      releaseTime: '2023-01-01',
      warrantyPeriod: 12,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      variant: [],
    };
    const newProduct = new Product(productData);
    await newProduct.save();

    const commentData = {
      product: newProduct._id,
      user: newUser._id,
      author: 'Anonymous',
      content: 'Great product!',
      replies: [],
      check: true,
      isReply: false,
    };
    const newComment = new Comment(commentData);
    await newComment.save();

    const savedComment = await Comment.findOne({ product: newProduct._id });
    expect(savedComment).to.exist;
    expect(savedComment.user.toString()).to.equal(commentData.user.toString());
    expect(savedComment.author).to.equal(commentData.author);
    expect(savedComment.content).to.equal(commentData.content);
    expect(savedComment.replies).to.have.lengthOf(0);
    expect(savedComment.check).to.equal(commentData.check);
    expect(savedComment.isReply).to.equal(commentData.isReply);
  });

  it('Yêu cầu trường product khi lưu bình luận', async function () {
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

    const commentData = {
      user: newUser._id,
      author: 'Anonymous',
      content: 'Great product!',
      replies: [],
      check: true,
      isReply: false,
    };
    const newComment = new Comment(commentData);

    try {
      await newComment.validate();
      await newComment.save();
    } catch (e) {
      expect(e.errors['product'].message).to.equal('Path `product` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });

  it('Yêu cầu trường content khi lưu bình luận', async function () {
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

    const productData = {
      name: 'Smartphone',
      desc: 'A great smartphone',
      releaseTime: '2023-01-01',
      warrantyPeriod: 12,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      variant: [],
    };
    const newProduct = new Product(productData);
    await newProduct.save();

    const commentData = {
      product: newProduct._id,
      user: newUser._id,
      author: 'Anonymous',
      replies: [],
      check: true,
      isReply: false,
    };
    const newComment = new Comment(commentData);

    try {
      await newComment.validate();
      await newComment.save();
    } catch (e) {
      expect(e.errors['content'].message).to.equal('Path `content` is required.');
      expect(e.name).to.equal('ValidationError');
    }
  });
});
