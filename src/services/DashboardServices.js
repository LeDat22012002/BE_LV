const Order = require("../models/OderProduct");
const Product = require("../models/ProductModel");

const getOrderStats = async () => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$totalPrice" }
                }
            }
        ]);
        return {
            status: 'OK',
            data: stats
        };
    } catch (error) {
        throw error;
    }
};

const getMonthlyRevenue = async () => {
    try {
        const currentYear = new Date().getFullYear();
        const revenue = await Order.aggregate([
            {
                $match: {
                    status: "COMPLETED",
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        return {
            status: 'OK',
            data: revenue
        };
    } catch (error) {
        throw error;
    }
};

const getTopProducts = async (limit = 5) => {
    try {
        const products = await Product.aggregate([
            {
                $sort: { selled: -1 }
            },
            {
                $limit: limit
            },
            {
                $project: {
                    name: 1,
                    selled: 1,
                    price: 1,
                    image: 1
                }
            }
        ]);
        return {
            status: 'OK',
            data: products
        };
    } catch (error) {
        throw error;
    }
};

const getRecentOrders = async (days = 7) => {
    try {
        const lastDays = new Date();
        lastDays.setDate(lastDays.getDate() - days);
        
        const orders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastDays }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        return {
            status: 'OK',
            data: orders
        };
    } catch (error) {
        throw error;
    }
};

const getDashboardSummary = async () => {
    try {
        const [orderStats, monthlyRevenue, topProducts, recentOrders] = await Promise.all([
            getOrderStats(),
            getMonthlyRevenue(),
            getTopProducts(),
            getRecentOrders()
        ]);

        return {
            status: 'OK',
            data: {
                orderStats: orderStats.data,
                monthlyRevenue: monthlyRevenue.data,
                topProducts: topProducts.data,
                recentOrders: recentOrders.data
            }
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getOrderStats,
    getMonthlyRevenue,
    getTopProducts,
    getRecentOrders,
    getDashboardSummary
};
