const categoryService = require('../services/category.service');

exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      message: 'Category created successfully',
      category: {
        _id: category.id,
        name: category.name,
        description: category.description
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories.map(cat => ({
      _id: cat.id,
      name: cat.name,
      description: cat.description
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const result = await categoryService.updateCategory(req.params.id, req.body);
    if (result[0] === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (deleted === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 