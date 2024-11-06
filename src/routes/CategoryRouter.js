const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const CategoryController = require('../controllers/CategoryController');

router.post('/create' ,CategoryController.createCategory)
router.put('/update-category/:id',authMiddleware,CategoryController.updateCategory)
router.delete('/delete-category/:id',authMiddleware,CategoryController.deleteCategory)
router.get('/get-allCategory',CategoryController.getAllCategory )
router.get('/get-detailsCategory/:id',CategoryController.getDetailsCategory )
module.exports = router