const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    discountType: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false
    },
    discountValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    minOrderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    maxDiscount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    usageLimit: {
        type: DataTypes.INTEGER,
        defaultValue: -1 // -1 means unlimited
    },
    usedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    validFrom: {
        type: DataTypes.DATE,
        allowNull: false
    },
    validUntil: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Coupon; 