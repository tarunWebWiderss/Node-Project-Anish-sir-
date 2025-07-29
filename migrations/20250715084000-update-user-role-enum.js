'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, update existing users to have valid roles
    await queryInterface.sequelize.query(`
      UPDATE Users
      SET role = 'user'
      WHERE role IS NULL OR role NOT IN ('admin', 'seller', 'user')
    `);

    // Then modify the column to have the enum constraint
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'seller', 'user'),
      defaultValue: 'user',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to STRING type
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'user'
    });
  }
};