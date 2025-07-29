'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Coupons', [
      {
        code: 'DISCOUNT20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 100.00,
        maxDiscount: 200.00,
        usageLimit: 100,
        usedCount: 5,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'SAVE50',
        discountType: 'fixed',
        discountValue: 50.00,
        minOrderAmount: 200.00,
        maxDiscount: 50.00,
        usageLimit: 50,
        usedCount: 2,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 50.00,
        maxDiscount: 100.00,
        usageLimit: -1, // Unlimited
        usedCount: 0,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Coupons', null, {});
  }
}; 