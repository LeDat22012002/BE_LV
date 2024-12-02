const express = require("express");
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const {authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', OrderController.createOrder)
// GetAll Order
router.get('/get-order-details/:id', OrderController.getOrderDetails)
router.get('/get-detailsOrder/:id', OrderController.getDetails_Order)
router.get('/get-all-order', authMiddleware, OrderController.getAllOrder)
// Thêm route cập nhật trạng thái
router.put('/update-status/:id', authMiddleware, OrderController.updateOrderStatus)
// Thêm route hủy đơn hàng cho user
router.put('/cancel-order/:id', authMiddleware, OrderController.cancelOrder)

module.exports = router