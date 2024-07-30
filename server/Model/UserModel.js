const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
});

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passWord: {
        type: String,
        required: true
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    role_id: {
        type: Number,
        required: true
    },
    addRess: [AddressSchema],
    isBlocked: {
        type: Boolean,
        required: true
    },
    avatar: {
        type: String
    },
    birthDay:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { validateBeforeSave: true });
const User = mongoose.model('User', UserSchema);

module.exports = User;

