const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    appliedCoupon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    }
}, {
    hooks: {
        beforeCreate: async (order) => {
            // Generate order ID if not provided
            if (!order.orderId) {
                order.orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
            }
        }
    }
});

module.exports = Order; 