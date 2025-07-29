const orderService = require('../services/order.service');
const productService = require('../services/product.service');
const couponService = require('../services/coupon.service');
const reviewService = require('../services/review.service');
const { sendResponse } = require('../utils/response');

class DashboardController {
    // Get Overall Dashboard Stats (Admin Only)
    async getDashboardStats(req, res) {
        try {
            // Get order statistics
            const orderStats = await orderService.getOrderStats();
            
            // Get product statistics
            const productStats = await productService.getProductStats();
            
            // Get coupon statistics
            const couponStats = await couponService.getCouponStats();
            
            // Get review statistics
            const reviewStats = await reviewService.getReviewStats();
            
            // Calculate revenue metrics
            const totalRevenue = orderStats.reduce((sum, stat) => {
                return sum + parseFloat(stat.totalRevenue || 0);
            }, 0);
            
            const pendingOrders = orderStats.find(stat => stat.status === 'pending')?.count || 0;
            const completedOrders = orderStats.find(stat => stat.status === 'delivered')?.count || 0;
            
            const dashboardData = {
                orders: {
                    total: orderStats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
                    pending: pendingOrders,
                    completed: completedOrders,
                    totalRevenue: parseFloat(totalRevenue.toFixed(2))
                },
                products: {
                    total: productStats.totalProducts,
                    lowStock: productStats.lowStockCount,
                    outOfStock: productStats.outOfStockCount
                },
                coupons: {
                    total: couponStats.totalCoupons,
                    active: couponStats.activeCoupons,
                    totalUsage: couponStats.totalUsage
                },
                reviews: {
                    total: reviewStats.totalReviews,
                    averageRating: reviewStats.averageRating
                }
            };
            
            return sendResponse(res, {
                status: 1,
                message: 'Dashboard statistics retrieved successfully',
                data: dashboardData,
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
    
    // Get Recent Orders (Admin/Seller)
    async getRecentOrders(req, res) {
        try {
            const { limit = 10 } = req.query;
            const orders = await orderService.getRecentOrders(parseInt(limit));
            
            return sendResponse(res, {
                status: 1,
                message: 'Recent orders retrieved successfully',
                data: { orders },
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
    
    // Get Low Stock Products (Admin/Seller)
    async getLowStockProducts(req, res) {
        try {
            const { threshold = 5 } = req.query;
            const products = await productService.getLowStockProducts(parseInt(threshold));
            
            return sendResponse(res, {
                status: 1,
                message: 'Low stock products retrieved successfully',
                data: { products },
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
    
    // Get Top Selling Products (Admin/Seller)
    async getTopSellingProducts(req, res) {
        try {
            const { limit = 10 } = req.query;
            const products = await productService.getTopSellingProducts(parseInt(limit));
            
            return sendResponse(res, {
                status: 1,
                message: 'Top selling products retrieved successfully',
                data: { products },
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
    
    // Get Revenue Analytics (Admin Only)
    async getRevenueAnalytics(req, res) {
        try {
            const { period = 'month' } = req.query;
            const analytics = await orderService.getRevenueAnalytics(period);
            
            return sendResponse(res, {
                status: 1,
                message: 'Revenue analytics retrieved successfully',
                data: analytics,
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
    
    // Get User Activity Stats (Admin Only)
    async getUserActivityStats(req, res) {
        try {
            const stats = await orderService.getUserActivityStats();
            
            return sendResponse(res, {
                status: 1,
                message: 'User activity statistics retrieved successfully',
                data: stats,
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
}

module.exports = new DashboardController(); 