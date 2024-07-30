const express = require('express');
const router = express.Router();
const productController = require('../controller/ProductController');
const productvariantController = require('../controller/ProductVariantController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/addProduct',authMiddleware, productController.addProduct);
router.post('/addProductvariant/:id',authMiddleware, productvariantController.addProductVariant);
router.get('/getIdByCategory/:categoryId', productController.getProductsByCategory);
router.put('/editProduct/:id',authMiddleware, productController.editProduct);
router.delete('/delete/:id',authMiddleware, productController.deleteProduct);
router.get('/searchProduct', productvariantController.searchProductVariantsByName);
router.get('/searchProductAdmin', productController.searchProductAdmin);
router.get('/getVariant/:id', productvariantController.getVariantsByProductId);
router.get('/getIdVariant/:id', productvariantController.IdVariant);
router.get('/getAttributes/:id/attributes', productvariantController.getAttributesByVariantId);
router.get('/getDetailsAttributes/:id', productvariantController.getAttributeDetailsById);
router.delete('/deleteVariant/:id',authMiddleware, productvariantController.deleteProductVariant);
router.put('/editProductVariant/:id',authMiddleware, productvariantController.updateProductVariant);
router.post('/addAttributes/:id',authMiddleware, productvariantController.addAttributes);
router.put('/editAttributes/:id',authMiddleware, productvariantController.editAttribute);
router.delete('/deleteAttributes/:id',authMiddleware, productvariantController.deleteAttributeById);
router.get('/getAll',productController.getAllProduct)
router.get('/getRating/:productName',productController.getProductRating)
router.get('/getProduct/:id', productController.IdProduct);
router.get('/getDetails/:name', productController.detailsProduct);
router.get('/all-with-sold', productController.getAllProductsWithTotalSold);
router.get('/productVariant',productvariantController.getProductVariants);
router.get('/getRandomProduct',productController.getRandomProduct)

module.exports = router;