'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Smartphones',
        description: 'Mobile phones and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptops',
        description: 'Portable computers and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Accessories',
        description: 'Various electronic accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
}; 