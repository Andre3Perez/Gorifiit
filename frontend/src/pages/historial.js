import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import movementService from '@/services/movementService';
import productService from '@/services/productService';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Loading from '@/components/Loading';

export default function Historial() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tipo: '',
    producto: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchMovements();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [movementsRes, productsRes] = await Promise.all([
        movementService.getAll({ limit: 100 }),
        productService.getAll(),
      ]);
      setMovements(movementsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovements = async () => {
    try {
      const params = {};
      if (filters.tipo) params.tipo = filters.tipo;
      if (filters.producto) params.producto = filters.producto;

      const response = await movementService.getAll(params);
      setMovements(response.data);
    } catch (error) {
      console.error('Error al filtrar movimientos:', error);
      toast.error('Error al filtrar movimientos');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calcularValorMovimiento = (movement) => {
    if (!movement.producto?.precio) return 0;
    const valor = movement.cantidad * movement.producto.precio;
    return movement.tipo === 'entrada' ? valor : -valor;
  };

  const calcularValorStock = (movement) => {
    if (!movement.producto?.precio) return 0;
    return movement.stockNuevo * movement.producto.precio;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading message="Cargando historial..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        📋 Historial de Movimientos
      </h1>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Tipo de Movimiento"
            name="tipo"
            value={filters.tipo}
            onChange={handleFilterChange}
            options={[
              { value: 'entrada', label: '📥 Entradas' },
              { value: 'salida', label: '📤 Salidas' },
            ]}
            placeholder="Todos"
          />

          <Select
            label="Producto"
            name="producto"
            value={filters.producto}
            onChange={handleFilterChange}
            options={products.map((p) => ({
              value: p._id,
              label: p.nombre,
            }))}
            placeholder="Todos los productos"
          />

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ tipo: '', producto: '' })}
              className="neumorphic-button w-full px-4 py-3 text-gray-600 hover:text-gray-800"
            >
              🔄 Limpiar Filtros
            </button>
          </div>
        </div>
      </Card>

      {/* Lista de Movimientos */}
      {movements.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay movimientos registrados
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {movements.map((movement) => (
            <Card key={movement._id} className="hover:shadow-neumorphic-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Info Principal */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-2xl ${
                        movement.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {movement.tipo === 'entrada' ? '📥' : '📤'}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {movement.producto?.nombre || 'Producto eliminado'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {movement.producto?.categoria}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-600">Tipo</p>
                      <p
                        className={`font-semibold ${
                          movement.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {movement.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600">Cantidad</p>
                      <p className="font-bold text-primary-600">
                        {movement.cantidad} unidades
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600">Stock Anterior</p>
                      <p className="font-semibold text-gray-700">
                        {movement.stockAnterior}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600">Stock Nuevo</p>
                      <p className="font-semibold text-gray-700">
                        {movement.stockNuevo}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600">Valor Movimiento</p>
                      <p
                        className={`font-bold ${
                          movement.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(calcularValorMovimiento(movement))}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600">Valor en Stock</p>
                      <p className="font-bold text-blue-600">
                        {formatCurrency(calcularValorStock(movement))}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Motivo:</span> {movement.motivo}
                    </p>
                    {movement.observaciones && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Observaciones:</span>{' '}
                        {movement.observaciones}
                      </p>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">
                    {formatDate(movement.createdAt)}
                  </p>
                  {movement.usuario && (
                    <p className="text-xs text-gray-600">
                      👤 {movement.usuario.username}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Resumen */}
      <Card className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Resumen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Movimientos</p>
            <p className="text-2xl font-bold text-primary-600">
              {movements.length}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Entradas</p>
            <p className="text-2xl font-bold text-green-600">
              {movements.filter((m) => m.tipo === 'entrada').length}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Salidas</p>
            <p className="text-2xl font-bold text-red-600">
              {movements.filter((m) => m.tipo === 'salida').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
