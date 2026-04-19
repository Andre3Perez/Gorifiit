// Este archivo es el punto de entrada para Vercel Serverless Functions
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('../config/database');
const { errorHandler, notFound } = require('../middleware/errorHandler');

// Importar rutas
const authRoutes = require('../routes/authRoutes');
const productRoutes = require('../routes/productRoutes');
const movementRoutes = require('../routes/movementRoutes');

// Inicializar Express
const app = express();

// Conectar a la base de datos (solo una vez)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  await connectDB();
  isConnected = true;
};

// Conectar en el primer request
connectToDatabase();

// =====================================
// MIDDLEWARE GLOBAL
// =====================================

// Seguridad con Helmet
app.use(helmet());

// CORS - Configuración para permitir el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Compresión de respuestas
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =====================================
// RUTAS
// =====================================

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running on Vercel',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/movements', movementRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GORIFIT Inventory Management API - Vercel Deployment',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      movements: '/api/movements',
      health: '/api/health'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'GORIFIT API',
    version: '1.0.0'
  });
});

// =====================================
// MANEJO DE ERRORES
// =====================================

// Ruta no encontrada
app.use(notFound);

// Error handler global
app.use(errorHandler);

// Exportar la app para Vercel
module.exports = app;
