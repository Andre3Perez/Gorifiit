import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import productService from '@/services/productService';
import movementService from '@/services/movementService';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import Loading from '@/components/Loading';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: null,
    movements: null,
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Obtener estadísticas en paralelo
      const [productsResponse, movementsResponse, lowStockResponse] = await Promise.all([
        productService.getStats(),
        movementService.getStats(),
        productService.getAll({ stockBajo: 'true' }),
      ]);

      setStats({
        products: productsResponse.data,
        movements: movementsResponse.data,
      });
      setLowStockProducts(lowStockResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading message="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        📊 Dashboard - GORIFIT
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Productos"
          value={stats.products?.totalProductos || 0}
          icon="📦"
          color="primary"
        />
        <StatCard
          title="Stock Bajo"
          value={stats.products?.productosBajoStock || 0}
          icon="⚠️"
          color="warning"
        />
        <StatCard
          title="Sin Stock"
          value={stats.products?.productosSinStock || 0}
          icon="❌"
          color="danger"
        />
        <StatCard
          title="Valor Inventario"
          value={`$${stats.products?.valorTotalInventario?.toLocaleString() || 0}`}
          icon="💰"
          color="success"
        />
      </div>

      {/* Movimientos Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Movimientos"
          value={stats.movements?.totalMovimientos || 0}
          icon="🔄"
          color="primary"
        />
        <StatCard
          title="Entradas"
          value={stats.movements?.cantidadEntrada || 0}
          icon="📥"
          color="success"
        />
        <StatCard
          title="Salidas"
          value={stats.movements?.cantidadSalida || 0}
          icon="📤"
          color="danger"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚠️</span>
            Productos con Stock Bajo
          </h2>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{product.nombre}</p>
                  <p className="text-sm text-gray-600">{product.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-600">
                    {product.stock} unidades
                  </p>
                  <p className="text-xs text-gray-600">
                    Mínimo: {product.stockMinimo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Categorías */}
      {stats.products?.porCategoria && (
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Productos por Categoría
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.products.porCategoria).map(([categoria, data]) => (
              <div key={categoria} className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-gray-600">{categoria}</p>
                <p className="text-2xl font-bold text-primary-600">{data.count}</p>
                <p className="text-xs text-gray-600">
                  Valor: ${data.valor.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
