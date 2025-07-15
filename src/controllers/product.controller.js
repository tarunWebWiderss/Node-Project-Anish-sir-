const productService = require('../services/product.service');

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      message: 'Product created successfully',
      product: {
        _id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.status(200).json(products.map(p => ({
      _id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      categoryId: p.categoryId
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({
      _id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);
    if (result[0] === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (deleted === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 