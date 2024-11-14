const express = require("express");
const router = express.Router();
const productController = require('../controllers/ProductController');
const { authMiddleware } = require("../middleware/authMiddleware");


router.post('/create' ,productController.createProduct)
router.put('/update-product/:id',authMiddleware,productController.updateProduct)
router.get('/details-product/:id',productController.getDetailsProduct)
router.delete('/delete-product/:id',authMiddleware,productController.deleteProduct)
router.get('/getAll-product',productController.getAllProduct)
router.post('/delete-many',authMiddleware,productController.deleteManyProduct)
router.get('/get-all-type',productController.getAllTypeProduct)
router.get('/get-all-categoryProduct',productController.getAllCategoryProduct)
router.get('/category/:categoryId', productController.getProductsByCategory);

// Lấy tất cả category kèm sản phẩm mẫu
router.get('/categories-with-products', productController.getCategoryWithProducts);

module.exports = router