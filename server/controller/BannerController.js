const Banner = require('../Model/BannerModel')
const Product = require('../Model/ProductModel')
const { format } = require('date-fns');
const { parse, isAfter, isBefore } = require('date-fns');
const vi = require('date-fns/locale/vi');
const addBanner = async (req, res) => {
  try {
    const { title, page, location, image, link, products } = req.body;
    let productIds = [];

    if (products && products.length > 0) {
      const productDocs = await Product.find({ name: { $in: products } });
      productIds = productDocs.map(product => product._id);
      const existingBanner = await Banner.findOne({ 'products.productId': { $in: productIds } });
      if (existingBanner) {
        return res.status(400).json({ success: false, error: "Mỗi sản phẩm chỉ có 1 banner." });
      }
    }
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const formatstartDate = format(new Date(startDate), 'dd/MM/yyyy');
    const formatendDate = format(new Date(endDate), 'dd/MM/yyyy');
    const startDateParts = formatstartDate.split('/');
    const startDate1 = parse(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });
    const endDateParts = formatendDate.split('/');
    const endDate1 = parse(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });
    if (!isAfter(endDate1, startDate1)) {
      return res.status(200).json({ success: false, message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu.' });
    }
    const bannerProducts = productIds.map(productId => ({ productId }));
    const banner = new Banner({
      title,
      page,
      location,
      image,
      link,
      startDate: formatstartDate,
      endDate: formatendDate,
      isActive: false,
      products: bannerProducts
    });

    const newBanner = await banner.save();
    res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const editBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, page, location, image, link, isActive, products,startDate,endDate } = req.body;
    let productIds = [];
    if (products && products.length > 0) {
      const productDocs = await Product.find({ name: { $in: products } });
      productIds = productDocs.map(product => product._id);
    }
    const updateFields = {};
    if (title) updateFields.title = title;
    if (page) updateFields.page = page;
    if (location) updateFields.location = location;
    if (image) updateFields.image = image;
    if (link) updateFields.link = link
    if (isActive) updateFields.isActive = isActive;
    if (startDate && endDate) {
      const formatStartDate = format(new Date(startDate), 'dd/MM/yyyy', { locale: vi });
      const formatEndDate = format(new Date(endDate), 'dd/MM/yyyy', { locale: vi });

      const startDateParts = formatStartDate.split('/');
      const endDateParts = formatEndDate.split('/');

      const startDateToUpdate = parse(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });
      const endDateToUpdate = parse(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });

      if (isAfter(startDateToUpdate, endDateToUpdate)) {
        return res.status(404).json({ success: false, error: 'Ngày bắt đầu phải trước ngày kết thúc' });
      }

      updateFields.startDate = formatStartDate;
      updateFields.endDate = formatEndDate;
    }
    else if (startDate && !endDate) {
      const voucher = await Banner.findById(id)
      const endDateCSDL = voucher.endDate
      const formatStartDate = format(new Date(startDate), 'dd/MM/yyyy', { locale: vi });
      const startDateParts = formatStartDate.split('/');
      const endDateParts = endDateCSDL.split('/');

      const startDateToUpdate = parse(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });
      const endDateToUpdate = parse(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });
      if (isAfter(startDateToUpdate, endDateToUpdate)) {
        return res.status(404).json({ success: false, error: 'Ngày bắt đầu phải trước ngày kết thúc' });
      }
      updateFields.startDate = formatStartDate;

    }
    else if (!startDate && endDate) {
      const voucher = await Banner.findById(id)
      const startDateCSDL = voucher.startDate
      const formatEndDate = format(new Date(endDate), 'dd/MM/yyyy', { locale: vi });
      const startDateParts = startDateCSDL.split('/');
      const endDateParts = formatEndDate.split('/');
      const startDateToUpdate = parse(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });
      const endDateToUpdate = parse(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });
      if (isAfter(startDateToUpdate, endDateToUpdate)) {
        return res.status(404).json({ success: false, error: 'Ngày kết thúc phải sau ngày bắt đầu' });
      }
      updateFields.endDate = formatEndDate;
    }
    const bannerProducts = productIds.map(productId => ({ productId }));
    const updatedBanner = await Banner.findByIdAndUpdate(id, {
      ...updateFields,
      products: bannerProducts
    }, { new: true });

    if (!updatedBanner) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy banner' });
    }

    res.status(200).json({ success: true, data: updatedBanner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBanner = await Banner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy banner' });
    }

    res.status(200).json({ success: true, data: deletedBanner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getAllBanners = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const banners = await Banner.find()
      .populate({
        path: 'products.productId',
        select: 'name thumnails'
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalBanners = await Banner.countDocuments();

    res.status(200).json({
      success: true,
      data: banners,
      pagination: {
        totalBanners,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBanners / limit),
        pageSize: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const searchBanner = async (req, res) => {
  const { title, page = 1, limit = 10 } = req.query;

  try {
   
    const query = title ? { title: new RegExp(title, 'i') } : {};

   
    const banners = await Banner.find(query)
      .populate({
        path: 'products.productId',
        select: 'name thumbnails'
      })
      .skip((page - 1) * limit) 
      .limit(parseInt(limit)); 

 
    const totalBanners = await Banner.countDocuments(query);

    res.status(200).json({
      success: true,
      data: banners,
      pagination: {
        totalBanners,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBanners / limit),
        pageSize: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getBannerByTitle = async (req, res) => {
  const { location, page } = req.params;
  const currentDate = new Date();

  try {
    const banners = await Banner.find({ location, page });

    if (!banners || banners.length === 0) {
      return res.status(404).json({ success: false, message: 'No banners found with the given location' });
    }

    const updatedBanners = await Promise.all(banners.map(async banner => {
      const startDateParts = banner.startDate.split('/');
      const endDateParts = banner.endDate.split('/');

      const startDate = parse(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });
      const endDate = parse(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });

      if (isBefore(currentDate, endDate) && isAfter(currentDate, startDate)) {
        banner.isActive = true;
      } else {
        banner.isActive = false;
      }

      await banner.save();
      return banner;
    }));
    const activeBanners = updatedBanners.filter(banner => banner.isActive);

    if (activeBanners.length === 0) {
      return res.status(404).json({ success: false, message: 'Không có banner nào đang hoạt động' });
    }

    res.status(200).json({ success: true, data: activeBanners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getBannerDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findById(id).populate({
      path: 'products.productId',
      select: 'name'
    });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getBannersByProductIds = async (req, res) => {
  const { productIds } = req.body;
  const currentDate = new Date();
  try {
    const banners = await Banner.find({ 'products.productId': { $in: productIds } });

    if (!banners || banners.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy banner nào cho các sản phẩm đã cho' });
    }
    const updatedBanners = await Promise.all(banners.map(async banner => {
      const startDateParts = banner.startDate.split('/');
      const endDateParts = banner.endDate.split('/');

      const startDate = parse(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });
      const endDate = parse(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`, 'yyyy-MM-dd', new Date(), { locale: vi });

      if (isBefore(currentDate, endDate) && isAfter(currentDate, startDate)) {
        banner.isActive = true;
      } else {
        banner.isActive = false;
      }

      await banner.save();
      return banner;
    }));
    const activeBanners = updatedBanners.filter(banner => banner.isActive);

    if (activeBanners.length === 0) {
      return res.status(404).json({ success: false, message: 'Không có banner nào đang hoạt động' });
    }

    res.status(200).json({ success: true, data: activeBanners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = { searchBanner, getBannersByProductIds, getBannerDetails, getBannerByTitle, addBanner, editBanner, deleteBanner, getAllBanners }