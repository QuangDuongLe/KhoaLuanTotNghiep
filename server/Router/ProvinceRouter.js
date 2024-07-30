const express = require('express');
const router = express.Router();
const provinceController = require('../controller/ProvinceController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/getProvince',provinceController.getProvince);
router.get('/getAllProvince',authMiddleware,provinceController.getAllProvince);
router.post('/getShippingFeeByProvinceName',provinceController.getShippingFeeByProvinceName);
router.get('/searchProvince',provinceController.searchProvinces);
router.get('/getidProvince/:idProvince',provinceController.getProvinceById);
router.put('/updatedProvince/:idProvince', authMiddleware,provinceController.updateProvince);
router.post('/addProvince',authMiddleware, provinceController.addProvince);
router.put('/deleteProvince/:idProvince',authMiddleware, provinceController.deleteProvince);


router.get('/getDistrict/:idProvince',provinceController.getDistrictsByProvince);
router.post('/addDistrict/:idProvince',authMiddleware,provinceController.addDistrict)
router.put('/updateDistrict/:idDistrict',authMiddleware,provinceController.updateDistrict)
router.get('/getDistrictById/:idDistrict',provinceController.getDistrictById)
router.put('/deleteDistrict/:idDistrict',authMiddleware,provinceController.deleteDistrict)



router.get('/getCommnune/:idDistrict',provinceController.getCommunesByDistrict);
router.get('/getCommuneById/:idCommune',provinceController.getCommuneById);
router.post('/addCommue/:idDistrict',authMiddleware,provinceController.addCommune)
router.put('/updateCommue/:idCommune',authMiddleware,provinceController.updateCommune)
router.put('/deleteCommue/:idCommune',authMiddleware,provinceController.deleteCommune)
module.exports = router;