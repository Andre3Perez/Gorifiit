const mongoose = require('mongoose');

/**
 * Modelo de Movimiento de Inventario
 * Registra todas las entradas y salidas de productos
 */
const movementSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'El tipo de movimiento es requerido'],
    enum: {
      values: ['entrada', 'salida'],
      message: 'El tipo debe ser "entrada" o "salida"'
    }
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'El producto es requerido']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es requerida'],
    min: [1, 'La cantidad debe ser mayor a 0']
  },
  motivo: {
    type: String,
    trim: true,
    required: [true, 'El motivo es requerido']
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stockAnterior: {
    type: Number,
    required: true
  },
  stockNuevo: {
    type: Number,
    required: true
  },
  observaciones: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Índices para mejorar consultas
movementSchema.index({ producto: 1, createdAt: -1 });
movementSchema.index({ tipo: 1 });

module.exports = mongoose.model('Movement', movementSchema);
