const couponService = require('../services/coupon.service');
const { sendResponse } = require('../utils/response');

class CouponController {
    // Create Coupon (Admin Only)
    async createCoupon(req, res) {
        try {
            const couponData = req.body;
            const coupon = await couponService.createCoupon(couponData);
            
            return sendResponse(res, {
                status: 1,
                message: 'Coupon created successfully',
                data: { coupon },
                httpCode: 201
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
    
    // Get All Coupons (Admin Only)
    async getAllCoupons(req, res) {
        try {
            const coupons = await couponService.getAllCoupons();
            
            return sendResponse(res, {
                status: 1,
                message: 'Coupons retrieved successfully',
                data: { coupons },
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
    
    // Get Active Coupons (Public)
    async getActiveCoupons(req, res) {
        try {
            const coupons = await couponService.getActiveCoupons();
            
            return sendResponse(res, {
                status: 1,
                message: 'Active coupons retrieved successfully',
                data: { coupons },
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
    
    // Get Coupon by ID (Admin Only)
    async getCouponById(req, res) {
        try {
            const { id } = req.params;
            const coupon = await couponService.getCouponById(id);
            
            return sendResponse(res, {
                status: 1,
                message: 'Coupon retrieved successfully',
                data: { coupon },
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
    
    // Get Coupon by Code (Public)
    async getCouponByCode(req, res) {
        try {
            const { code } = req.params;
            const coupon = await couponService.getCouponByCode(code);
            
            return sendResponse(res, {
                status: 1,
                message: 'Coupon retrieved successfully',
                data: { coupon },
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
    
    // Update Coupon (Admin Only)
    async updateCoupon(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const coupon = await couponService.updateCoupon(id, updateData);
            
            return sendResponse(res, {
                status: 1,
                message: 'Coupon updated successfully',
                data: { coupon },
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
    
    // Delete Coupon (Admin Only)
    async deleteCoupon(req, res) {
        try {
            const { id } = req.params;
            const result = await couponService.deleteCoupon(id);
            
            return sendResponse(res, {
                status: 1,
                message: result.message,
                data: null,
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
    
    // Validate Coupon (Public)
    async validateCoupon(req, res) {
        try {
            const { code } = req.params;
            const { orderAmount } = req.body;
            const coupon = await couponService.validateCoupon(code, orderAmount);
            
            return sendResponse(res, {
                status: 1,
                message: 'Coupon is valid',
                data: { coupon },
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
    
    // Get Coupon Statistics (Admin Only)
    async getCouponStats(req, res) {
        try {
            const stats = await couponService.getCouponStats();
            
            return sendResponse(res, {
                status: 1,
                message: 'Coupon statistics retrieved successfully',
                data: { stats },
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
    
    // Deactivate Expired Coupons (Admin Only)
    async deactivateExpiredCoupons(req, res) {
        try {
            const result = await couponService.deactivateExpiredCoupons();
            
            return sendResponse(res, {
                status: 1,
                message: result.message,
                data: null,
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

module.exports = new CouponController(); 