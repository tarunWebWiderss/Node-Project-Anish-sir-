const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken, hasRole } = require('../middleware/auth.middleware');

// Get Overall Dashboard Stats (Admin Only)
router.get('/stats', authenticateToken, hasRole('admin'), dashboardController.getDashboardStats);

// Get Recent Orders (Admin/Seller)
router.get('/recent-orders', authenticateToken, hasRole('admin', 'seller'), dashboardController.getRecentOrders);

// Get Low Stock Products (Admin/Seller)
router.get('/low-stock-products', authenticateToken, hasRole('admin', 'seller'), dashboardController.getLowStockProducts);

// Get Top Selling Products (Admin/Seller)
router.get('/top-selling-products', authenticateToken, hasRole('admin', 'seller'), dashboardController.getTopSellingProducts);

// Get Revenue Analytics (Admin Only)
router.get('/revenue-analytics', authenticateToken, hasRole('admin'), dashboardController.getRevenueAnalytics);

// Get User Activity Stats (Admin Only)
router.get('/user-activity', authenticateToken, hasRole('admin'), dashboardController.getUserActivityStats);

module.exports = router; 