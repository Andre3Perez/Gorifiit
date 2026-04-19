import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import productService from '@/services/productService';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Loading from '@/components/Loading';

const CATEGORIAS = [
  { value: 'Suplementos', label: 'Suplementos' },
  { value: 'Ropa', label: 'Ropa' },
  { value: 'Accesorios', label: 'Accesorios' },
  { value: 'Equipamiento', label: 'Equipamiento' },
  { value: 'Nutrición', label: 'Nutrición' },
  { value: 'Otro', label: 'Otro' },
];

export default function Inventario() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: '0',
    stockMinimo: '5',
    descripcion: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        categoria: product.categoria,
        precio: product.precio,
        stock: product.stock,
        stockMinimo: product.stockMinimo,
        descripcion: product.descripcion || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        categoria: '',
        precio: '',
        stock: '0',
        stockMinimo: '5',
        descripcion: '',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await productService.update(editingProduct._id, formData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productService.create(formData);
        toast.success('Producto creado exitosamente');
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      toast.error(error.response?.data?.message || 'Error al guardar el producto');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;

    try {
      await productService.delete(id);
      toast.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading message="Cargando inventario..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📦 Inventario</h1>
        <Button onClick={() => handleOpenModal()}>
          ➕ Nuevo Producto
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No hay productos registrados
            </p>
            <Button onClick={() => handleOpenModal()}>
              Crear primer producto
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="hover:shadow-neumorphic-lg transition-all">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {product.nombre}
                </h3>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {product.categoria}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-semibold text-green-600">
                    ${product.precio.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span
                    className={`font-bold ${
                      product.stock === 0
                        ? 'text-red-600'
                        : product.stockBajo
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {product.stock} unidades
                  </span>
                </div>
              </div>

              {product.stockBajo && (
                <div className="mb-4 p-2 bg-yellow-50 rounded-lg flex items-center">
                  <span className="text-yellow-600 text-sm">
                    ⚠️ Stock bajo
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => handleOpenModal(product)}
                  className="flex-1 text-sm"
                >
                  ✏️ Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 text-sm"
                >
                  🗑️ Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Crear/Editar */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Producto"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <Select
            label="Categoría"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            options={CATEGORIAS}
            required
          />

          <Input
            label="Precio"
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stock Actual"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              disabled={!!editingProduct}
            />

            <Input
              label="Stock Mínimo"
              name="stockMinimo"
              type="number"
              min="0"
              value={formData.stockMinimo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              className="neumorphic-input w-full"
              placeholder="Descripción del producto (opcional)"
            />
          </div>

          {editingProduct && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ El stock se modifica a través de movimientos de entrada/salida
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="success" className="flex-1">
              {editingProduct ? 'Actualizar' : 'Crear'} Producto
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
