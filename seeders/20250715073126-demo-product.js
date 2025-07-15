'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'iPhone 15 Pro',
        description: "Apple's new flagship phone",
        price: 1299.99,
        stock: 50,
        sku: 'IPH15P-128GB',
        imageUrl: 'https://example.com/iphone15.jpg',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Samsung Galaxy S24',
        description: "Samsung's latest flagship phone",
        price: 1199.99,
        stock: 40,
        sku: 'SGS24-256GB',
        imageUrl: 'https://example.com/galaxys24.jpg',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
