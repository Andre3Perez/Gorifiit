const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Rutas de productos
 * Todas requieren autenticación
 */

// @route   GET /api/products/stats/overview
router.get('/stats/overview', protect, getProductStats);

// @route   GET /api/products
// @route   POST /api/products
router.route('/')
  .get(protect, getProducts)
  .post(protect, createProduct);

// @route   GET /api/products/:id
// @route   PUT /api/products/:id
// @route   DELETE /api/products/:id
router.route('/:id')
  .get(protect, getProduct)
  .put(protect, updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
