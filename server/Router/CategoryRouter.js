const express = require('express');
const router = express.Router();
const categoryController = require('../controller/CategoryController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/addCategory',authMiddleware, categoryController.addCategory);
router.put('/updateCategory/:id',authMiddleware, categoryController.updateCategory);
router.delete('/delete/:id',authMiddleware,categoryController.deleteCategory);
router.get('/getAll',categoryController.getAllCategories);
router.get('/getCategory/:id', authMiddleware, categoryController.getSingleCategory); 

module.exports = router;
