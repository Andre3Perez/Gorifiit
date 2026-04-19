import api from './api';

/**
 * Servicio de movimientos de inventario
 */
const movementService = {
  // Obtener todos los movimientos
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/movements?${params}`);
    return response.data;
  },

  // Obtener un movimiento por ID
  getById: async (id) => {
    const response = await api.get(`/movements/${id}`);
    return response.data;
  },

  // Registrar entrada de inventario
  registrarEntrada: async (movementData) => {
    const response = await api.post('/movements/entrada', movementData);
    return response.data;
  },

  // Registrar salida de inventario
  registrarSalida: async (movementData) => {
    const response = await api.post('/movements/salida', movementData);
    return response.data;
  },

  // Obtener historial de un producto
  getProductHistory: async (productId) => {
    const response = await api.get(`/movements/producto/${productId}`);
    return response.data;
  },

  // Obtener estadísticas de movimientos
  getStats: async () => {
    const response = await api.get('/movements/stats/overview');
    return response.data;
  },
};

export default movementService;
