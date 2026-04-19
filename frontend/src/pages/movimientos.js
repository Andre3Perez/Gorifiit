import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import productService from '@/services/productService';
import movementService from '@/services/movementService';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Loading from '@/components/Loading';

export default function Movimientos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoMovimiento, setTipoMovimiento] = useState('entrada');
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    motivo: '',
    observaciones: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Limpiar motivo cuando cambia el tipo de movimiento
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      motivo: '',
    }));
  }, [tipoMovimiento]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar y convertir cantidad a número si es el campo cantidad
    const newValue = name === 'cantidad' 
      ? value.replace(/[^0-9]/g, '') // Solo permitir números
      : value;
    
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.producto || !formData.cantidad || !formData.motivo) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    // Validar que la cantidad sea un número válido
    const cantidadNum = parseInt(formData.cantidad, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      toast.error('La cantidad debe ser un número mayor a 0');
      return;
    }

    // Preparar datos con cantidad como número
    const dataToSend = {
      producto: formData.producto,
      cantidad: cantidadNum,
      motivo: formData.motivo,
      observaciones: formData.observaciones,
    };

    try {
      if (tipoMovimiento === 'entrada') {
        await movementService.registrarEntrada(dataToSend);
        toast.success('✅ Entrada registrada exitosamente');
      } else {
        await movementService.registrarSalida(dataToSend);
        toast.success('✅ Salida registrada exitosamente');
      }

      // Resetear formulario completamente
      setFormData({
        producto: '',
        cantidad: '',
        motivo: '',
        observaciones: '',
      });

      // Pequeño delay para asegurar que la DB se actualizó
      setTimeout(() => {
        fetchProducts();
      }, 100);
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      toast.error(error.response?.data?.message || 'Error al registrar el movimiento');
    }
  };

  const selectedProduct = products.find((p) => p._id === formData.producto);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading message="Cargando..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        🔄 Registro de Movimientos
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Movimiento */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Nuevo Movimiento
          </h2>

          {/* Tipo de Movimiento */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setTipoMovimiento('entrada')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                tipoMovimiento === 'entrada'
                  ? 'shadow-neumorphic-inset text-green-600'
                  : 'shadow-neumorphic text-gray-600'
              }`}
            >
              📥 Entrada
            </button>
            <button
              type="button"
              onClick={() => setTipoMovimiento('salida')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                tipoMovimiento === 'salida'
                  ? 'shadow-neumorphic-inset text-red-600'
                  : 'shadow-neumorphic text-gray-600'
              }`}
            >
              📤 Salida
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Producto"
              name="producto"
              value={formData.producto}
              onChange={handleChange}
              options={products.map((p) => ({
                value: p._id,
                label: `${p.nombre} - Stock: ${p.stock}`,
              }))}
              required
            />

            {selectedProduct && (
              <div className="p-4 bg-primary-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Stock actual:</p>
                    <p className="text-xl font-bold text-primary-600">
                      {selectedProduct.stock}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Precio:</p>
                    <p className="text-xl font-bold text-green-600">
                      ${selectedProduct.precio.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Cantidad"
              name="cantidad"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ingrese la cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              required
            />

            <Input
              label="Motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder={
                tipoMovimiento === 'entrada'
                  ? 'Ej: Compra a proveedor, Devolución, etc.'
                  : 'Ej: Venta, Defecto, Muestra, etc.'
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows="3"
                className="neumorphic-input w-full"
                placeholder="Detalles adicionales (opcional)"
              />
            </div>

            <Button
              type="submit"
              variant={tipoMovimiento === 'entrada' ? 'success' : 'danger'}
              className="w-full"
            >
              {tipoMovimiento === 'entrada' ? '📥 Registrar Entrada' : '📤 Registrar Salida'}
            </Button>
          </form>
        </Card>

        {/* Vista rápida de productos */}
        <div>
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📦 Stock Actual
            </h2>
            <div className="max-h-[600px] overflow-y-auto space-y-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`p-4 rounded-lg transition-all ${
                    formData.producto === product._id
                      ? 'bg-primary-100 shadow-neumorphic-sm'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {product.nombre}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.categoria}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${
                          product.stock === 0
                            ? 'text-red-600'
                            : product.stockBajo
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {product.stock}
                      </p>
                      <p className="text-xs text-gray-500">unidades</p>
                    </div>
                  </div>
                  {product.stockBajo && (
                    <div className="mt-2 text-xs text-yellow-600">
                      ⚠️ Stock bajo (mín: {product.stockMinimo})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
