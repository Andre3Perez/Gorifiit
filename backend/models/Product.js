const mongoose = require('mongoose');

/**
 * Modelo de Producto
 * Representa los productos en el inventario
 */
const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    unique: true
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true,
    enum: {
      values: ['Suplementos', 'Ropa', 'Accesorios', 'Equipamiento', 'Nutrición', 'Otro'],
      message: 'Categoría no válida'
    }
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
  stockMinimo: {
    type: Number,
    default: 5,
    min: 0
  },
  descripcion: {
    type: String,
    trim: true
  },
  imagen: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para mejorar búsquedas
productSchema.index({ nombre: 1, categoria: 1 });

// Virtual para determinar si el stock es bajo
productSchema.virtual('stockBajo').get(function() {
  return this.stock < this.stockMinimo;
});

// Incluir virtuals al convertir a JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
