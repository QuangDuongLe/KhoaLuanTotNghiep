const express = require('express');
const User = require('../Model/UserModel')
const { uploadFile } = require('../controller/UploadFile'); 
const Category = require('../Model/CategoryModel');
const Brand = require('../Model/BrandModel');
const router = express.Router();

router.post('/upload', uploadFile.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Không có ảnh được tải lên.' });
    }
    return res.status(200).json({ success: true, message: 'Tải lên ảnh thành công.', imageUrl: req.file.path });
  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({ success: false, error: 'Lỗi trong quá trình tải lên.' });
  }
});
router.post('/uploads', uploadFile.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'Không có ảnh được tải lên.' });
    }
    const imageUrls = req.files.map((file) => file.path);
    return res.status(200).json({ success: true, message: 'Tải lên ảnh thành công.', imageUrls });
  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({ success: false, error: 'Lỗi trong quá trình tải lên.' });
  }
});

router.post('/uploadUser/:userID', uploadFile.single('image'), async (req, res) => {
    try {
      const { userID } = req.params;
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Không có ảnh được tải lên.' });
      }
      const user = await User.findById(userID);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Người dùng không tồn tại.' });
      }
      user.avatar = req.file.path;
      await user.save();
      return res.status(200).json({ success: true, message: 'Tải lên ảnh thành công.', imageUrl: req.file.path });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ success: false, error: 'Lỗi trong quá trình tải lên.' });
    }
  });
  router.post('/uploadCategory/:categoryId', uploadFile.single('image'), async (req, res) => {
    try {
      const { categoryId } = req.params;
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Không có ảnh được tải lên.' });
      }
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, error: 'Người dùng không tồn tại.' });
      }
      category.picture = req.file.path;
      await category.save();
      return res.status(200).json({ success: true, message: 'Tải lên ảnh thành công.', imageUrl: req.file.path });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ success: false, error: 'Lỗi trong quá trình tải lên.' });
    }
  });
  router.post('/uploadBrand/:brandId', uploadFile.single('image'), async (req, res) => {
    try {
      const { brandId } = req.params;
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Không có ảnh được tải lên.' });
      }
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return res.status(404).json({ success: false, error: 'Người dùng không tồn tại.' });
      }
      brand.picture = req.file.path;
      await brand.save();
      return res.status(200).json({ success: true, message: 'Tải lên ảnh thành công.', imageUrl: req.file.path });
    } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ success: false, error: 'Lỗi trong quá trình tải lên.' });
    }
  });
module.exports = router;
