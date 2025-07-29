'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update existing products to have a seller (assuming user ID 1 is a seller)
    await queryInterface.sequelize.query(`
      UPDATE Products 
      SET sellerId = 1 
      WHERE sellerId IS NULL
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove seller IDs from products
    await queryInterface.sequelize.query(`
      UPDATE Products 
      SET sellerId = NULL
    `);
  }
}; 