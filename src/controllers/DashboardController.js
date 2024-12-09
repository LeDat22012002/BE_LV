const DashboardService = require('../services/DashboardServices');

const getDashboardStats = async (req, res) => {
    try {
        const result = await DashboardService.getDashboardSummary();
        res.status(200).json({
            status: 'OK',
            message: 'Lấy thông tin thống kê thành công',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
            error: error.message
        });
    }
};

const getOrderStats = async (req, res) => {
    try {
        const result = await DashboardService.getOrderStats();
        res.status(200).json({
            status: 'OK',
            message: 'Lấy thống kê đơn hàng thành công',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
            error: error.message
        });
    }
};

const getMonthlyRevenue = async (req, res) => {
    try {
        const result = await DashboardService.getMonthlyRevenue();
        res.status(200).json({
            status: 'OK',
            message: 'Lấy doanh thu theo tháng thành công',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
            error: error.message
        });
    }
};

const getTopProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const result = await DashboardService.getTopProducts(limit);
        res.status(200).json({
            status: 'OK',
            message: 'Lấy top sản phẩm thành công',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
            error: error.message
        });
    }
};

const getRecentOrders = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const result = await DashboardService.getRecentOrders(days);
        res.status(200).json({
            status: 'OK',
            message: 'Lấy đơn hàng gần đây thành công',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getOrderStats,
    getMonthlyRevenue,
    getTopProducts,
    getRecentOrders
};
