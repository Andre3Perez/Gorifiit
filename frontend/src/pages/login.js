import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import authService from '@/services/authService';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        toast.success('¡Bienvenido a GORIFIT! 🎉');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="neumorphic-card w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2">
            GORIFIT
          </h1>
          <p className="text-gray-600">Sistema de Gestión de Inventario</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-800 font-medium mb-2">
            💡 Información de demostración:
          </p>
          <p className="text-xs text-primary-700">
            Si no tienes cuenta, solicta acceso al administrador del servicio.
          </p>
        </div>
      </div>
    </div>
  );
}
