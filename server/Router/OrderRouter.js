const express = require('express');
const router = express.Router();
const orderController = require('../controller/OrderController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');


router.post('/addOrder/:userId', orderController.addOrder);
router.put('/updateOrder/:orderId',authMiddleware, orderController.updateOrderStatus);
router.put('/completeOrder/:orderId', authMiddleware , orderController.completeOrder);
router.put('/deliveredOrder/:orderId', authMiddleware , orderController.deliveredOrder);
router.put('/completeOrderUser/:orderCode', orderController.completeOrderUser);
router.get('/getAllOrdersPending',authMiddleware, orderController.getAllOrdersPending);
router.get('/getAllOrdersReady',authMiddleware, orderController.getAllOrdersReady);
router.get('/getAllOrdersDelivery',authMiddleware, orderController.getAllOrdersDelivery);
router.get('/getAllOrdersComplete',authMiddleware, orderController.getAllOrdersComplete);
router.get('/getAllOrdersReadyCancel',authMiddleware, orderController.getAllOrdersReadyCancel);
router.get('/getAllOrdersCancel',authMiddleware, orderController.getAllOrdersCancel);
router.get('/getAllOrdersDashBoard',authMiddleware, orderController.getAllOrdersDashboard);
router.get('/getAllOrdersDelivered',authMiddleware, orderController.getAllOrdersDelivered);
router.get('/searchOrderPending',authMiddleware, orderController.searchOrderPending);
router.get('/searchOrderReady',authMiddleware, orderController.searchOrderReady);
router.get('/searchOrderCancel',authMiddleware, orderController.searchOrderCancel);
router.get('/searchOrderDelivery',authMiddleware, orderController.searchOrderDelivery);
router.get('/searchOrderDelivered',authMiddleware, orderController.searchOrderDelivered);
router.get('/searchOrderReadyCancel',authMiddleware, orderController.searchOrderReadyCancel);
router.get('/searchOrderComplete',authMiddleware, orderController.searchOrderComplete);
router.put('/cancelOrderWithReason/:orderId',authMiddleware, orderController.cancelOrderWithReason);
router.get('/user/:userId', orderController.getOrdersByUserId);
router.get('/oderDetails/:orderCode', orderController.getOrdersDetails);
router.delete('/delete/:orderId',authMiddleware,orderController.deleteOrder)
router.put('/cancel/:orderCode',orderController.cancelOrderbyUser)
router.put('/cancel1/:orderCode',orderController.cancelOrderbyUser1)
router.put('/rating',orderController.addProductRating)
router.put('/changeProduct/:id/:orderId', authMiddleware,orderController.changeProduct)
router.put('/checkBH',orderController.checkBH)
router.get('/getSoldProductsByDate', authMiddleware,orderController.getSoldProductsByDate);
router.get('/soldProductsByCategory', authMiddleware,orderController.getSoldProductsByCategory);
router.get('/getTotalPayByDate', authMiddleware,orderController.getTotalPayByDate);
router.get('/get7DaysTotalPay', orderController.get7DaysTotalPay);
router.get('/get28DaysTotalPay', orderController.get28DaysTotalPay);
router.get('/get90DaysTotalPay', orderController.get90DaysTotalPay);
router.get('/get365DaysTotalPay', orderController.get365DaysTotalPay);
router.get('/getAllDaysTotalPay', orderController.getAllDaysTotalPay);
router.post('/calculateTotalPayByDateRange', orderController.calculateTotalPayByDateRange);
router.post('/request-item-change/:id',orderController.requestItemChange);
router.put('/update-change-status', authMiddleware,orderController.updateChangeStatus);
router.get('/orders-with-status',authMiddleware,orderController.getOrdersWithChangeStatus);
router.get('/orders-with-statuss', authMiddleware,orderController.getOrdersWithoutProcessingStatus);
router.get('/searchOrdersWithChangeStatus', authMiddleware, orderController.searchOrdersWithChangeStatus);
router.get('/searchOrdersWithoutStatus',authMiddleware, orderController.searchOrdersWithoutStatus);
module.exports = router;
