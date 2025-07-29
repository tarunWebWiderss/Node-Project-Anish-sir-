const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken, hasRole } = require('../middleware/auth.middleware');

// Place Order (User Only)
router.post('/', authenticateToken, hasRole('user'), orderController.placeOrder);

// Get User Orders (User Only)
router.get('/user', authenticateToken, hasRole('user'), orderController.getUserOrders);

// Get All Orders (Admin/Seller)
router.get('/', authenticateToken, hasRole('admin', 'seller'), orderController.getAllOrders);

// Apply Coupon to Order (User Only)
router.post('/:orderId/apply-coupon', authenticateToken, hasRole('user'), orderController.applyCoupon);

// Get Order Details (User can see their own, Admin/Seller can see all)
router.get('/:orderId', authenticateToken, orderController.getOrderDetails);

// Update Order Status (Admin/Seller)
router.patch('/:orderId/status', authenticateToken, hasRole('admin', 'seller'), orderController.updateOrderStatus);

module.exports = router; 