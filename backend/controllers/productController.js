const Product = require('../models/Product');
const Movement = require('../models/Movement');

/**
 * @desc    Obtener todos los productos
 * @route   GET /api/products
 * @access  Private
 */
const getProducts = async (req, res, next) => {
  try {
    const { categoria, stockBajo } = req.query;
    
    // Construir query
    let query = { isActive: true };
    
    if (categoria) {
      query.categoria = categoria;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    // Filtrar por stock bajo si se solicita
    let filteredProducts = products;
    if (stockBajo === 'true') {
      filteredProducts = products.filter(p => p.stock < p.stockMinimo);
    }

    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un producto por ID
 * @route   GET /api/products/:id
 * @access  Private
 */
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Crear nuevo producto
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = async (req, res, next) => {
  try {
    const { nombre, categoria, precio, stock, stockMinimo, descripcion, imagen } = req.body;

    const product = await Product.create({
      nombre,
      categoria,
      precio,
      stock: stock || 0,
      stockMinimo: stockMinimo || 5,
      descripcion,
      imagen
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar producto
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res, next) => {
  try {
    const { nombre, categoria, precio, stockMinimo, descripcion, imagen } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Actualizar campos (el stock se maneja por movimientos)
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (categoria) updateData.categoria = categoria;
    if (precio !== undefined) updateData.precio = precio;
    if (stockMinimo !== undefined) updateData.stockMinimo = stockMinimo;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (imagen !== undefined) updateData.imagen = imagen;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar producto (soft delete)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener estadísticas de productos
 * @route   GET /api/products/stats/overview
 * @access  Private
 */
const getProductStats = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true });
    
    const stats = {
      totalProductos: products.length,
      productosBajoStock: products.filter(p => p.stock < p.stockMinimo).length,
      valorTotalInventario: products.reduce((sum, p) => sum + (p.precio * p.stock), 0),
      productosSinStock: products.filter(p => p.stock === 0).length,
      porCategoria: {}
    };

    // Agrupar por categoría
    products.forEach(p => {
      if (!stats.porCategoria[p.categoria]) {
        stats.porCategoria[p.categoria] = { count: 0, valor: 0 };
      }
      stats.porCategoria[p.categoria].count++;
      stats.porCategoria[p.categoria].valor += p.precio * p.stock;
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
};
