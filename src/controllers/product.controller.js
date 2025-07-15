const productService = require('../services/product.service');
const { sendResponse } = require('../utils/response');

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    if (skuExists) {
      return sendResponse(res, {
        status: 0,
        message: 'SKU already exists',
        data: null,
        httpCode: 400
      });
    }
    return sendResponse(res, {
      status: 1,
      message: 'Product created successfully',
      data: { product: product },
      httpCode: 201
    });
  } catch (error) {
    return sendResponse(res, {
      status: 0,
      message: error.message || 'Failed to create product',
      data: null,
      httpCode: 500
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);
    return sendResponse(res, {
      status: 1,
      message: 'Products fetched successfully',
      data: { products },
      httpCode: 200
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return sendResponse(res, {
      status: 1,
      message: 'Product fetched successfully',
      data: { product },
      httpCode: 200
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      return sendResponse(res, {
        status: 0,
        message: 'Product not found',
        data: null,
        httpCode: 404
      });
    }
    return sendResponse(res, {
      status: 1,
      message: 'Product updated successfully',
      data: { product },
      httpCode: 200
    });
  } catch (error) {
    return sendResponse(res, {
      status: 0,
      message: error.message || 'Failed to update product',
      data: null,
      httpCode: 500
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) {
      return sendResponse(res, {
        status: 0,
        message: 'Product not found',
        data: null,
        httpCode: 404
      });
    }
    return sendResponse(res, {
      status: 1,
      message: 'Product deleted successfully',
      data: null,
      httpCode: 200
    });
  } catch (error) {
    return sendResponse(res, {
      status: 0,
      message: error.message || 'Failed to delete product',
      data: null,
      httpCode: 500
    });
  }
}; 