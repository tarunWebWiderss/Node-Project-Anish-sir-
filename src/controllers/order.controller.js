const orderService = require('../services/order.service');
const { sendResponse } = require('../utils/response');

class OrderController {
    // Place Order (User Only)
    async placeOrder(req, res) {
        try {
            const userId = req.user.id;
            const orderData = req.body;
            
            const result = await orderService.placeOrder(userId, orderData);
            
            return sendResponse(res, {
                status: 1,
                message: result.message,
                data: {
                    orderId: result.orderId,
                    summary: result.summary
                },
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
    
    // Get User Orders
    async getUserOrders(req, res) {
        try {
            const userId = req.user.id;
            const orders = await orderService.getUserOrders(userId);
            
            return sendResponse(res, {
                status: 1,
                message: 'User orders retrieved successfully',
                data: orders,
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
    
    // Get All Orders (Admin/Seller)
    async getAllOrders(req, res) {
        try {
            const orders = await orderService.getAllOrders();
            
            return sendResponse(res, {
                status: 1,
                message: 'All orders retrieved successfully',
                data: orders,
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
    
    // Apply Coupon to Order
    async applyCoupon(req, res) {
        try {
            const { orderId } = req.params;
            const { couponCode } = req.body;
            
            const result = await orderService.applyCoupon(orderId, couponCode);
            
            return sendResponse(res, {
                status: 1,
                message: 'Coupon applied successfully',
                data: result,
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
    
    // Get Order Details
    async getOrderDetails(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;
            
            const order = await orderService.getOrderDetails(orderId, userId, userRole);
            
            return sendResponse(res, {
                status: 1,
                message: 'Order details retrieved successfully',
                data: order,
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
    
    // Update Order Status (Admin/Seller)
    async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;
            
            const result = await orderService.updateOrderStatus(orderId, status);
            
            return sendResponse(res, {
                status: 1,
                message: 'Order status updated successfully',
                data: result,
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

module.exports = new OrderController(); 