const Brand = require('../Model/BrandModel');
const Category = require('../Model/CategoryModel');

const addBrand = async (req, res) => {
  try {
    const { name, picture, country, categoryName } = req.body;

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ success: false, error: 'Danh mục không tồn tại' });
    }

    const existingBrand = await Brand.findOne({ name, categoryId: category._id });
    if (existingBrand) {
      return res.status(200).json({ success: false, error: 'Brand đã tồn tại trong danh mục này' });
    }
    const brand = new Brand({
      name,
      picture,
      country,
      categoryId: category._id,
      isHide: false,
    });

    const newBrand = await brand.save();
    res.status(201).json({ success: true, data: newBrand });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getAllBrand = async (req, res) => {
  try {
      const categoryId = req.params.categoryId; 

      const data = await Brand.find({ categoryId: categoryId });
      return res.status(200).json({
          data: data
      });
  } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ msg: 'Lỗi Server' });
  }
};
const getAll = async (req, res) => {
  try {
      const data = await Brand.find().populate('categoryId');
      return res.status(200).json({
          data: data
      });
  } catch (error) {
      console.error('Lỗi:', error);
      return res.status(500).json({ msg: 'Lỗi Server' });
  }
};
const updateBrand = async (req, res) => {
  try {
    const brandId = req.params.id; 
    const updatedData = req.body; 
    const updatedBrand = await Brand.findByIdAndUpdate(brandId, updatedData);

    if (!updatedBrand) {
      return res.status(404).json({ success: false, error: 'Thương hiệu không tồn tại' });
    }

    res.status(200).json({ success: true, data: updatedBrand });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const deleteBrand = async (req, res) => {
  try {
    const brandId = req.params.id; 
    const deletedBrand = await Brand.findByIdAndDelete(brandId);

    if (!deletedBrand) {
      return res.status(404).json({ success: false, error: 'Thương hiệu không tồn tại' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getSingleBrand = async (req, res) => {
  try {
      const { id } = req.params;

      const brand = await Brand.findById(id).populate('categoryId');

      if (!brand) {
          return res.status(404).json({ success: false, error: 'Không tìm thấy thương hiệu!' });
      }

      res.status(200).json({ success: true, data: brand });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { addBrand,getAllBrand,updateBrand,deleteBrand ,getAll, getSingleBrand};
