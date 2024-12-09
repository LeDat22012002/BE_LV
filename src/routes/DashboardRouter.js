const express = require("express");
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');


// API tổng hợp
router.get('/summary',  DashboardController.getDashboardStats);

// API riêng lẻ
router.get('/orders/stats', DashboardController.getOrderStats);
router.get('/revenue/monthly', DashboardController.getMonthlyRevenue);
router.get('/products/top', DashboardController.getTopProducts);
router.get('/orders/recent',  DashboardController.getRecentOrders);

module.exports = router;
