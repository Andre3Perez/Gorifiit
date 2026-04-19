import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import authService from '@/services/authService';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación en rutas protegidas
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(router.pathname);

    if (!isPublicRoute && !authService.isAuthenticated()) {
      router.push('/login');
    } else if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
    }
  }, [router.pathname]);

  const handleLogout = () => {
    authService.logout();
  };

  // No mostrar navbar en login/register
  const showNavbar = !['/login', '/register'].includes(router.pathname);

  return (
    <div className="min-h-screen bg-neumorphic">
      {showNavbar && <Navbar user={user} onLogout={handleLogout} />}
      <main className={showNavbar ? 'pt-20' : ''}>
        {children}
      </main>
    </div>
  );
}
