const News = require('../Model/NewsModel')
const User = require('../Model/UserModel');
const { format } = require('date-fns');

const addNews = async (req, res) => {
    try {
        const { title, image, content, author } = req.body;
        const user = await User.findOne({ fullName: author });
        if (!user) {
            return res.status(400).json({ success: false, error: 'Người dùng không tồn tại' });
        }
        const publishedDate = req.body.publishedDate;
        const formattedpublishedDate = format(new Date(publishedDate), 'dd/MM/yyyy');
        const news = new News({
            title,
            image,
            content,
            author: user._id,
            publishedDate: formattedpublishedDate,
            isActive: false,
        });

        const newNews = await news.save();
        res.status(201).json({ success: true, data: newNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
const editNews = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updateData = {};
        if (data.title) {
            updateData.title = data.title;
        }
        if (data.content) {
            updateData.content = data.content;
        }
        if (data.publishedDate) {
            const publishedDateInput = data.publishedDate;
            const formattedPublishedDate = format(new Date(publishedDateInput), 'dd/MM/yyyy');
            updateData.publishedDate = formattedPublishedDate;
        }
        if (data.author) {
            const author = await User.findOne({ fullName: data.author });
            if (!author) {
                return res.status(404).json({ success: false, error: 'Người dùng không tồn tại' });
            }
            updateData.author = author._id;
        }
        if (data.image) {
            updateData.image = data.image;
        }
        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }
        const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true }).populate('author').lean();
        res.status(200).json({ success: true, data: updatedNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedNews = await News.findByIdAndDelete(id);

        if (!deletedNews) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy tin tức!' });
        }

        res.status(200).json({ success: true, data: deletedNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
const getAllNews = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const totalCount = await News.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = Math.max(parseInt(page), 1);
        const pageSize = Math.max(parseInt(limit), 1);

        const newss = await News.find()
            .select('-content')
            .populate('author')
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({
            success: true,
            data: newss,
            totalCount,
            currentPage,
            totalPages,
            pageSize,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
const searchNews = async (req, res) => {
    const { title, page = 1, limit = 10 } = req.query;

    try {

        const query = title ? { title: new RegExp(title, 'i') } : {};


        const newsItems = await News.find(query)
            .select('-content')
            .populate('author')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));


        const totalNews = await News.countDocuments(query);

        res.status(200).json({
            success: true,
            data: newsItems,
            pagination: {
                totalNews,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalNews / limit),
                pageSize: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



const getSingleNews = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await News.findById(id).populate('author').lean();;

        if (!news) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy tin tức!' });
        }

        res.status(200).json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { searchNews, addNews, editNews, deleteNews, getAllNews, getSingleNews }