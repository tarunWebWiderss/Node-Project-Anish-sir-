const categoryRepository = require('../repositories/category.repository');

const categoryService = {
  createCategory: async (data) => {
    return await categoryRepository.create(data);
  },
  getAllCategories: async () => {
    return await categoryRepository.findAll();
  },
  updateCategory: async (id, data) => {
    return await categoryRepository.update(id, data);
  },
  deleteCategory: async (id) => {
    return await categoryRepository.delete(id);
  },
};

module.exports = categoryService; 