'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Reviews', [
      {
        userId: 9,
        productId: 3,
        rating: 5,
        comment: 'Excellent phone! Great camera and battery life.',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 9,
        productId: 4,
        rating: 4,
        comment: 'Good phone, but could be better.',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
}; 