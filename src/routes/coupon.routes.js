const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { authenticateToken, hasRole } = require('../middleware/auth.middleware');

// Create Coupon (Admin Only)
router.post('/', authenticateToken, hasRole('admin'), couponController.createCoupon);

// Get All Coupons (Admin Only)
router.get('/all', authenticateToken, hasRole('admin'), couponController.getAllCoupons);

// Get Active Coupons (Public)
router.get('/active', couponController.getActiveCoupons);

// Get Coupon by ID (Admin Only)
router.get('/:id', authenticateToken, hasRole('admin'), couponController.getCouponById);

// Get Coupon by Code (Public)
router.get('/code/:code', couponController.getCouponByCode);

// Update Coupon (Admin Only)
router.put('/:id', authenticateToken, hasRole('admin'), couponController.updateCoupon);

// Delete Coupon (Admin Only)
router.delete('/:id', authenticateToken, hasRole('admin'), couponController.deleteCoupon);

// Validate Coupon (Public)
router.post('/validate/:code', couponController.validateCoupon);

// Get Coupon Statistics (Admin Only)
router.get('/stats/overview', authenticateToken, hasRole('admin'), couponController.getCouponStats);

// Deactivate Expired Coupons (Admin Only)
router.post('/deactivate-expired', authenticateToken, hasRole('admin'), couponController.deactivateExpiredCoupons);

module.exports = router; 