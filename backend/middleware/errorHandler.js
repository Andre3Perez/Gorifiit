/**
 * Middleware de manejo de errores global
 * Captura todos los errores y devuelve respuestas consistentes
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error para debugging
  console.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = {
      statusCode: 400,
      message: message.join(', ')
    };
  }

  // Error de duplicado de Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = {
      statusCode: 400,
      message: `El ${field} ya existe en el sistema`
    };
  }

  // Error de ID inválido de Mongoose
  if (err.name === 'CastError') {
    error = {
      statusCode: 404,
      message: 'Recurso no encontrado'
    };
  }

  // Error de JWT expirado
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Token no válido'
    };
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token expirado'
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Middleware para rutas no encontradas
 */
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
