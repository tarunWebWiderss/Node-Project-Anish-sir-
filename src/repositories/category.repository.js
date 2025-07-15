const Category = require('../models/category.model');

const categoryRepository = {
  create: async (data) => Category.create(data),
  findAll: async () => Category.findAll(),
  update: async (id, data) => Category.update(data, { where: { id } }),
  delete: async (id) => Category.destroy({ where: { id } }),
  findOne: async (query) => Category.findOne(query),
};

module.exports = categoryRepository; 