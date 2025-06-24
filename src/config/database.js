const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Node_auth', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,  // XAMPP's default MySQL port
    logging: false
});

module.exports = sequelize; 