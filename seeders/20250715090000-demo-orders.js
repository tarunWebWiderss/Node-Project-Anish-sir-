'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Orders', [
      {
        orderId: 'ORD123456789',
        userId: 9,
        status: 'pending',
        totalAmount: 1299.99,
        shippingAddress: '123 Main St, City, State 12345',
        items: JSON.stringify([
          {
            productId: 3,
            productName: 'iPhone 15 Pro',
            quantity: 1,
            unitPrice: 1299.99,
            totalPrice: 1299.99
          }
        ]),
        appliedCoupon: null,
        discountAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderId: 'ORD987654321',
        userId: 9,
        status: 'delivered',
        totalAmount: 2399.98,
        shippingAddress: '456 Oak Ave, City, State 12345',
        items: JSON.stringify([
          {
            productId: 4,
            productName: 'Samsung Galaxy S24',
            quantity: 2,
            unitPrice: 1199.99,
            totalPrice: 2399.98
          }
        ]),
        appliedCoupon: 'DISCOUNT20',
        discountAmount: 479.99,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {});
  }
}; 