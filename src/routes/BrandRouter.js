const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const BrandController = require('../controllers/BrandController');

router.post('/create' ,BrandController.createBrand)
router.put('/update-brand/:id',authMiddleware,BrandController.updateBrand)
router.delete('/delete-brand/:id',authMiddleware,BrandController.deleteBrand)
router.get('/get-allBrand',BrandController.getAllBrand )
router.get('/get-detailsBrand/:id',BrandController.getDetailsBrand )
module.exports = router