const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/', authenticateToken, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', authenticateToken, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router; 