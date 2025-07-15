const categoryService = require('../services/category.service');
const { sendResponse } = require('../utils/response');

exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    if (categoryExists) {
      return sendResponse(res, {
        status: 0,
        message: 'Category already exists',
        data: null,
        httpCode: 400
      });
    }
    return sendResponse(res, {
      status: 1,
      message: 'Category created successfully',
      data: { category: category },
      httpCode: 201
    });
  } catch (error) {
    return sendResponse(res, {
      status: 0,
      message: error.message || 'Failed to create category',
      data: null,
      httpCode: 500
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return sendResponse(res, {
      status: 1,
      message: 'Categories fetched successfully',
      data: { categories },
      httpCode: 200
    });
  } catch (error) {
    return sendResponse(res, {
      status: 0,
      message: error.message || 'Failed to fetch categories',
      data: null,
      httpCode: 500
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return sendResponse(res, {
        status: 0,
        message: 'Category not found',
        data: null,
        httpCode: 404
      });
    }
    return sendResponse(res, {
      status: 1,
      message: 'Category fetched successfully',
      data: { category },
      httpCode: 200
    });
  } catch (error) {
    return sendResponse(res, {
      status: 0,
      message: error.message || 'Failed to fetch category',
      data: null,
      httpCode: 500
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    if (!category) {
      return sendResponse(res, {
        status: 0,
        message: 'Category not found',
        data: null,
        httpCode: 404
      });
    }
    return sendResponse(res, {
      status: 1,
      message: 'Category updated successfully',
      data: { category },
      httpCode: 200
    });
  } catch (error) {
    return sendResponse(res, {
      status: 0,
      message: error.message || 'Failed to update category',
      data: null,
      httpCode: 500
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (!deleted) {
      return sendResponse(res, {
        status: 0,
        message: 'Category not found',
        data: null,
        httpCode: 404
      });
    }
    return sendResponse(res, {
      status: 1,
      message: 'Category deleted successfully',
      data: null,
      httpCode: 200
    });
  } catch (error) {
    return sendResponse(res, {
      status: 0,
      message: error.message || 'Failed to delete category',
      data: null,
      httpCode: 500
    });
  }
}; 