require('dotenv').config();
const express = require('express');
const router = express.Router();
const voucherController = require('../controller/VoucherController');
const { authMiddleware } = require('../middleware/authMiddleware');
router.post('/addVoucher',authMiddleware, voucherController.addVoucher);
router.get('/getVoucher', voucherController.getVouchers);
router.put('/updateVoucher/:id', authMiddleware,voucherController.updateVoucher);
router.get('/getDetails/:voucherId', authMiddleware,voucherController.getVoucherDetail);
router.delete('/deleteVoucher/:id',authMiddleware, voucherController.deleteVoucher);
router.get('/searchVoucher',authMiddleware, voucherController.searchVoucher);
router.post('/useVoucher', voucherController.useVoucher);
router.get('/availableVouchers', voucherController.getAvailableVouchers);

module.exports = router;