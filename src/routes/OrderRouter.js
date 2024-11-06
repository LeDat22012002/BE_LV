const express = require("express");
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const {authMiddleware } = require("../middleware/authMiddleware");



router.post('/create',OrderController.createOrder)
// GetAll Order
router.get('/get-order-details/:id',OrderController.getOrderDetails)

router.get('/get-detailsOrder/:id',OrderController.getDetails_Order)

router.get('/get-all-order',authMiddleware,OrderController.getAllOrder)



module.exports = router