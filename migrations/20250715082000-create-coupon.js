'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      discountType: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false
      },
      discountValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      minOrderAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      maxDiscount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      usageLimit: {
        type: Sequelize.INTEGER,
        defaultValue: -1
      },
      usedCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      validFrom: {
        type: Sequelize.DATE,
        allowNull: false
      },
      validUntil: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Coupons');
  }
}; 