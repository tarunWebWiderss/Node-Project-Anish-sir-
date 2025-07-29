const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken, hasRole } = require('../middleware/auth.middleware');

// Create Product (Admin/Seller)
router.post('/', authenticateToken, hasRole('admin', 'seller'), productController.createProduct);

// Get All Products (Public)
router.get('/', productController.getAllProducts);

// Get Product by ID (Public)
router.get('/:id', productController.getProductById);

// Update Product (Admin/Seller with ownership check)
router.put('/:id', authenticateToken, hasRole('admin', 'seller'), productController.updateProduct);

// Delete Product (Admin/Seller with ownership check)
router.delete('/:id', authenticateToken, hasRole('admin', 'seller'), productController.deleteProduct);

module.exports = router; 