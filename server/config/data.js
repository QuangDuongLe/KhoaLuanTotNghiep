require('dotenv').config();
const mongoose = require('mongoose');
const db = process.env.mongodb_uri;

const connect2DB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(db, {
            useNewUrlParser: true,
            serverSelectionTimeoutMS: 30000, // Thời gian chờ chọn máy chủ lên 30 giây
            socketTimeoutMS: 45000 // Thời gian chờ socket lên 45 giây
        });
        console.log(`Connected to MongoDB: ${db}`);
        console.log("MongoDB is connected...");
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connect2DB;
