const express = require('express');
const router = express.Router();
const {
  getMovements,
  getMovement,
  registrarEntrada,
  registrarSalida,
  getProductMovements,
  getMovementStats
} = require('../controllers/movementController');
const { protect } = require('../middleware/auth');

/**
 * Rutas de movimientos de inventario
 * Todas requieren autenticación
 */

// @route   GET /api/movements/stats/overview
router.get('/stats/overview', protect, getMovementStats);

// @route   POST /api/movements/entrada
router.post('/entrada', protect, registrarEntrada);

// @route   POST /api/movements/salida
router.post('/salida', protect, registrarSalida);

// @route   GET /api/movements/producto/:id
router.get('/producto/:id', protect, getProductMovements);

// @route   GET /api/movements
router.get('/', protect, getMovements);

// @route   GET /api/movements/:id
router.get('/:id', protect, getMovement);

module.exports = router;
