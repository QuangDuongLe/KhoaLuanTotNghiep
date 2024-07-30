const express = require('express');
const router = express.Router();
const cartController = require('../controller/CartController');


router.post('/addCart', cartController.addToCart);
router.post('/saveToCart', cartController.saveToCart);
router.delete('/deleteCart/:cartItemId/:userId', cartController.deleteCartItem);
router.put('/update/:cartItemId/:userId', cartController.updateCartItemQuantity);
router.put('/updateChecked/:cartItemId/:userId', cartController.updateCartItemChecked);
router.put('/updateCheckedAll/:userId', cartController.updateAllCartItemsChecked);
router.get('/getToCart/:userId', cartController.getCartItemsByUserId);
router.get('/getCartChecked/:userId', cartController.getCheckedCartItemsByUserId);
router.put('/updateCart/:userId', cartController.updateCartItemAfterPayment);
module.exports = router;
