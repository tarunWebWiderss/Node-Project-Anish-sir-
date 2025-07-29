const productRepository = require('../repositories/product.repository');
const categoryRepository = require('../repositories/category.repository');

function isValidUrl(url) {
  try { new URL(url); return true; } catch { return false; }
}

const productService = {
  createProduct: async (data, sellerId = null) => {
    if (!data.name || typeof data.name !== 'string') throw new Error('Name is required and must be a string');
    if (typeof data.price !== 'number' || data.price <= 0) throw new Error('Price is required and must be > 0');
    if (data.stock !== undefined && (typeof data.stock !== 'number' || data.stock < 0)) throw new Error('Stock must be >= 0');
    if (data.imageUrl && !isValidUrl(data.imageUrl)) throw new Error('imageUrl must be a valid URL');
    if (!data.categoryId) throw new Error('categoryId is required');
    // Check category exists
    const cat = await categoryRepository.findOne({ where: { id: data.categoryId } });
    if (!cat) throw new Error('categoryId does not exist');
    // Check SKU uniqueness
    if (data.sku) {
      const existing = await productRepository.findOne({ where: { sku: data.sku } });
      if (existing) throw new Error('SKU already exists');
    }
    // Add seller ID if provided
    if (sellerId) {
      data.sellerId = sellerId;
    }
    return await productRepository.create(data);
  },
  getAllProducts: async (filters) => {
    const query = { where: {} };
    if (filters.category) query.where.categoryId = filters.category;
    if (filters.search) query.where.name = { $like: `%${filters.search}%` };
    // Pagination
    if (filters.limit) query.limit = parseInt(filters.limit);
    if (filters.page && filters.limit) query.offset = (parseInt(filters.page) - 1) * parseInt(filters.limit);
    return await productRepository.findAll(query);
  },
  getProductById: async (id) => {
    return await productRepository.findById(id);
  },
  updateProduct: async (id, data, userId = null, userRole = null) => {
    if (data.price !== undefined && (typeof data.price !== 'number' || data.price <= 0)) throw new Error('Price must be > 0');
    if (data.stock !== undefined && (typeof data.stock !== 'number' || data.stock < 0)) throw new Error('Stock must be >= 0');
    if (data.imageUrl && !isValidUrl(data.imageUrl)) throw new Error('imageUrl must be a valid URL');
    if (data.categoryId) {
      const cat = await categoryRepository.findOne({ where: { id: data.categoryId } });
      if (!cat) throw new Error('categoryId does not exist');
    }
    
    // Check ownership for sellers
    if (userRole === 'seller' && userId) {
      const product = await productRepository.findById(id);
      if (!product) throw new Error('Product not found');
      if (product.sellerId !== userId) {
        throw new Error('You can only update your own products');
      }
    }
    
    return await productRepository.update(id, data);
  },
  deleteProduct: async (id, userId = null, userRole = null) => {
    // Check ownership for sellers
    if (userRole === 'seller' && userId) {
      const product = await productRepository.findById(id);
      if (!product) throw new Error('Product not found');
      if (product.sellerId !== userId) {
        throw new Error('You can only delete your own products');
      }
    }
    
    return await productRepository.delete(id);
  }
};

module.exports = productService; 