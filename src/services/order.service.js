const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Coupon = require('../models/coupon.model');
const { sendResponse } = require('../utils/response');

class OrderService {
    // Place Order with inventory validation
    async placeOrder(userId, orderData) {
        try {
            const { products, shippingAddress, couponCode } = orderData;
            
            // Validate products and check stock
            const orderItems = [];
            let totalAmount = 0;
            
            for (const item of products) {
                const product = await Product.findByPk(item.productId);
                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found`);
                }
                
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }
                
                const itemTotal = product.price * item.quantity;
                totalAmount += itemTotal;
                
                orderItems.push({
                    productId: product.id,
                    productName: product.name,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    totalPrice: itemTotal
                });
            }
            
            // Apply coupon if provided
            let discountAmount = 0;
            let appliedCoupon = null;
            
            if (couponCode) {
                const coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true } });
                if (coupon && this.isCouponValid(coupon, totalAmount)) {
                    discountAmount = this.calculateDiscount(coupon, totalAmount);
                    appliedCoupon = coupon.code;
                    totalAmount -= discountAmount;
                    
                    // Update coupon usage
                    await coupon.update({ usedCount: coupon.usedCount + 1 });
                }
            }
            
            // Create order
            const order = await Order.create({
                userId,
                shippingAddress,
                items: orderItems,
                totalAmount,
                appliedCoupon,
                discountAmount
            });
            
            // Update product stock
            for (const item of products) {
                const product = await Product.findByPk(item.productId);
                const newStock = product.stock - item.quantity;
                await product.update({ stock: newStock });
                
                // Check for low stock alert
                if (newStock <= 5) {
                    console.log(`Low stock alert for product ${product.name}: Only ${newStock} left`);
                    // Here you could send email notification to admin
                }
            }
            
            return {
                message: 'Order placed successfully',
                orderId: order.orderId,
                summary: {
                    totalItems: orderItems.reduce((sum, item) => sum + item.quantity, 0),
                    totalAmount: parseFloat(totalAmount.toFixed(2))
                }
            };
            
        } catch (error) {
            throw error;
        }
    }
    
    // Get user orders
    async getUserOrders(userId) {
        try {
            const orders = await Order.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']]
            });
            
            return orders.map(order => ({
                _id: order.orderId,
                status: order.status,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt
            }));
        } catch (error) {
            throw error;
        }
    }
    
    // Get all orders (admin/seller)
    async getAllOrders() {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            
            return orders.map(order => ({
                _id: order.orderId,
                user: order.user,
                products: order.items,
                status: order.status,
                totalAmount: order.totalAmount
            }));
        } catch (error) {
            throw error;
        }
    }
    
    // Apply coupon to order
    async applyCoupon(orderId, couponCode) {
        try {
            const order = await Order.findOne({ where: { orderId } });
            if (!order) {
                throw new Error('Order not found');
            }
            
            const coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true } });
            if (!coupon) {
                throw new Error('Invalid coupon code');
            }
            
            if (!this.isCouponValid(coupon, order.totalAmount)) {
                throw new Error('Coupon cannot be applied to this order');
            }
            
            const discountAmount = this.calculateDiscount(coupon, order.totalAmount);
            const newTotal = order.totalAmount - discountAmount;
            
            await order.update({
                appliedCoupon: couponCode,
                discountAmount,
                totalAmount: newTotal
            });
            
            return {
                discountApplied: true,
                newTotal: parseFloat(newTotal.toFixed(2)),
                discountAmount: parseFloat(discountAmount.toFixed(2))
            };
            
        } catch (error) {
            throw error;
        }
    }
    
    // Helper methods
    isCouponValid(coupon, orderAmount) {
        const now = new Date();
        return (
            coupon.isActive &&
            now >= coupon.validFrom &&
            now <= coupon.validUntil &&
            orderAmount >= coupon.minOrderAmount &&
            (coupon.usageLimit === -1 || coupon.usedCount < coupon.usageLimit)
        );
    }
    
    calculateDiscount(coupon, orderAmount) {
        let discount = 0;
        
        if (coupon.discountType === 'percentage') {
            discount = (orderAmount * coupon.discountValue) / 100;
        } else {
            discount = coupon.discountValue;
        }
        
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }
        
        return discount;
    }
}

module.exports = new OrderService(); 