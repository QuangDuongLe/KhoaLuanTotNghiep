const express = require('express');
const router = express.Router();
const bannerController = require('../controller/BannerController');
const { authMiddleware } = require('../middleware/authMiddleware');



router.post('/addBanner',authMiddleware, bannerController.addBanner);
router.get('/getBanner',authMiddleware,bannerController.getAllBanners);
router.get('/getBannerByLocation/:page/:location',bannerController.getBannerByTitle);
router.get('/getBannerId/:id',bannerController.getBannerDetails);
router.get('/searchBanner',authMiddleware,bannerController.searchBanner);
router.put('/editBanner/:id',authMiddleware,bannerController.editBanner);
router.delete('/deleteBanner/:id',authMiddleware,bannerController.deleteBanner);
router.post('/getBannersByProductIds', bannerController.getBannersByProductIds);
module.exports = router;