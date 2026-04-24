const Movement = require('../models/Movement');
const Product = require('../models/Product');
const mongoose = require('mongoose');

/**
 * @desc    Obtener todos los movimientos
 * @route   GET /api/movements
 * @access  Private
 */
const getMovements = async (req, res, next) => {
  try {
    const { tipo, producto, limit = 100 } = req.query;
    
    // Construir query
    let query = {};
    
    if (tipo) {
      query.tipo = tipo;
    }
    
    if (producto) {
      query.producto = producto;
    }

    const movements = await Movement.find(query)
      .populate('producto', 'nombre categoria precio')
      .populate('usuario', 'username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: movements.length,
      data: movements
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un movimiento por ID
 * @route   GET /api/movements/:id
 * @access  Private
 */
const getMovement = async (req, res, next) => {
  try {
    const movement = await Movement.findById(req.params.id)
      .populate('producto')
      .populate('usuario', 'username email');

    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: movement
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Registrar entrada de inventario
 * @route   POST /api/movements/entrada
 * @access  Private
 */
const registrarEntrada = async (req, res, next) => {
  // Usar sesión para transacción atómica
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { producto: productoId, cantidad, motivo, observaciones } = req.body;

    // Convertir cantidad a número (soporta string o number)
    const cantidadNum = Number(cantidad);

    // Validar campos
    if (!productoId || !motivo) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione producto y motivo'
      });
    }

    if (!cantidad || isNaN(cantidadNum) || cantidadNum <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'La cantidad debe ser un número válido mayor a 0'
      });
    }

    // Buscar producto
    const producto = await Product.findById(productoId).session(session);

    if (!producto) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Guardar stock anterior y calcular nuevo stock
    const stockAnterior = Number(producto.stock);
    const stockNuevo = stockAnterior + cantidadNum;

    // Actualizar stock del producto
    producto.stock = stockNuevo;
    await producto.save({ session });

    // Crear registro de movimiento
    const movement = await Movement.create([{
      tipo: 'entrada',
      producto: productoId,
      cantidad: cantidadNum,
      motivo,
      observaciones,
      usuario: req.user._id,
      stockAnterior,
      stockNuevo
    }], { session });

    // Commit de la transacción
    await session.commitTransaction();

    // Populate para la respuesta
    await movement[0].populate('producto', 'nombre categoria');

    res.status(201).json({
      success: true,
      message: 'Entrada registrada exitosamente',
      data: movement[0]
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Registrar salida de inventario
 * @route   POST /api/movements/salida
 * @access  Private
 */
const registrarSalida = async (req, res, next) => {
  // Usar sesión para transacción atómica
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { producto: productoId, cantidad, motivo, observaciones } = req.body;

    // Convertir cantidad a número (soporta string o number)
    const cantidadNum = Number(cantidad);

    // Validar campos
    if (!productoId || !motivo) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione producto y motivo'
      });
    }

    if (!cantidad || isNaN(cantidadNum) || cantidadNum <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'La cantidad debe ser un número válido mayor a 0'
      });
    }

    // Buscar producto
    const producto = await Product.findById(productoId).session(session);

    if (!producto) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Validar stock suficiente
    const stockAnterior = Number(producto.stock);
    
    if (stockAnterior < cantidadNum) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Stock insuficiente. Stock actual: ${stockAnterior}, cantidad solicitada: ${cantidadNum}`
      });
    }

    // Calcular nuevo stock
    const stockNuevo = stockAnterior - cantidadNum;

    // Actualizar stock del producto
    producto.stock = stockNuevo;
    await producto.save({ session });

    // Crear registro de movimiento
    const movement = await Movement.create([{
      tipo: 'salida',
      producto: productoId,
      cantidad: cantidadNum,
      motivo,
      observaciones,
      usuario: req.user._id,
      stockAnterior,
      stockNuevo
    }], { session });

    // Commit de la transacción
    await session.commitTransaction();

    // Populate para la respuesta
    await movement[0].populate('producto', 'nombre categoria');

    res.status(201).json({
      success: true,
      message: 'Salida registrada exitosamente',
      data: movement[0]
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Obtener historial de un producto específico
 * @route   GET /api/movements/producto/:id
 * @access  Private
 */
const getProductMovements = async (req, res, next) => {
  try {
    const movements = await Movement.find({ producto: req.params.id })
      .populate('usuario', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movements.length,
      data: movements
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener estadísticas de movimientos
 * @route   GET /api/movements/stats/overview
 * @access  Private
 */
const getMovementStats = async (req, res, next) => {
  try {
    const movements = await Movement.find()
      .populate('producto', 'precio');

    const stats = {
      totalMovimientos: movements.length,
      totalEntradas: movements.filter(m => m.tipo === 'entrada').length,
      totalSalidas: movements.filter(m => m.tipo === 'salida').length,
      cantidadEntrada: movements
        .filter(m => m.tipo === 'entrada')
        .reduce((sum, m) => sum + m.cantidad, 0),
      cantidadSalida: movements
        .filter(m => m.tipo === 'salida')
        .reduce((sum, m) => sum + m.cantidad, 0)
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovements,
  getMovement,
  registrarEntrada,
  registrarSalida,
  getProductMovements,
  getMovementStats
};
