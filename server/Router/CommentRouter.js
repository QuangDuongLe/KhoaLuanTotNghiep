const express = require('express');
const commentController = require('../controller/CommnetController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addComment/:productName', commentController.addComment);
router.post('/addReply/:commentId/:productName', commentController.addReply);
router.post('/addReplytoReply/:commentId/:productName', commentController.addReplytoReply);
router.put('/check/:commentId',authMiddleware, commentController.check);
router.get('/getCommentsByProduct/:productName', commentController.getCommentsByProduct)
router.get('/getAll', commentController.getAll)
router.get('/getAllComment', commentController.getAllCommnent)
router.get('/searchComment', commentController.searchCommnent)
router.put('/delete/:commentId', authMiddleware , commentController.deleteComment)
router.delete('/deleteCheck/:commentId', authMiddleware , commentController.deleteCommentCheck)
module.exports = router;
