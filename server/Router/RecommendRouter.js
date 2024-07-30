const express = require('express');
const router = express.Router();
const RecommendController = require('../controller/RecommendController');



router.post('/saveAccess', RecommendController.saveUserAccess);
router.post('/recommendProduct', RecommendController.generateProductRecommendations);
module.exports = router;
