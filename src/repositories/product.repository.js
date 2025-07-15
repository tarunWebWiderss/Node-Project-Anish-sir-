const Product = require('../models/product.model');

const productRepository = {
  create: async (data) => Product.create(data),
  findAll: async (query) => Product.findAll(query),
  findById: async (id) => Product.findByPk(id),
  update: async (id, data) => Product.update(data, { where: { id } }),
  delete: async (id) => Product.destroy({ where: { id } }),
  findOne: async (query) => Product.findOne(query),
};

module.exports = productRepository; 