const express = require('express');
const router = express.Router();
const brandController = require('../controller/BrandController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/addBrand',authMiddleware, brandController.addBrand);
router.get('/getBrand/:categoryId', brandController.getAllBrand);
router.get('/getBrand', brandController.getAll);
router.put('/updateBrand/:id',authMiddleware, brandController.updateBrand);
router.delete('/delete/:id',authMiddleware, brandController.deleteBrand);
router.get('/getSingleBrand/:id', authMiddleware,brandController.getSingleBrand);

module.exports = router;
