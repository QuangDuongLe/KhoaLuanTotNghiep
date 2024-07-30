const express = require('express');
const router = express.Router();
const newsController = require('../controller/NewsController');
const { authMiddleware } = require('../middleware/authMiddleware');



router.post('/addNews',authMiddleware, newsController.addNews);
router.get('/getAllNews',newsController.getAllNews);
router.get('/getNews/:id', newsController.getSingleNews); 
router.get('/searchNews',authMiddleware, newsController.searchNews); 
router.put('/editNews/:id', authMiddleware, newsController.editNews); 
router.delete('/deleteNews/:id', authMiddleware, newsController.deleteNews); 
module.exports = router;