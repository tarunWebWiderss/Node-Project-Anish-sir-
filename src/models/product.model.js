const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 0.01 }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: { min: 0 }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Product; 