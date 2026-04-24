import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Navbar({ user, onLogout }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/inventario', label: 'Inventario', icon: '📦' },
    { href: '/movimientos', label: 'Movimientos', icon: '🔄' },
    { href: '/historial', label: 'Historial', icon: '📋' },
  ];

  // Cerrar menú mobile cuando cambia la ruta
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    router.events?.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neumorphic shadow-neumorphic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/images/LOGO_GORIFIT-PNG.png"
                alt="Gorifit Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              GORIFIT
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  router.pathname === link.href
                    ? 'shadow-neumorphic-inset text-primary-600 font-semibold'
                    : 'shadow-neumorphic-sm hover:shadow-neumorphic-inset text-gray-600'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="neumorphic-card px-2 sm:px-4 py-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                👤 <span className="inline">{user?.username || 'Usuario'}</span>
              </span>
            </div>
            <button
              onClick={onLogout}
              className="neumorphic-button px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700"
            >
              🚪 <span className="inline">Salir</span>
            </button>

            {/* Hamburger Menu Button - Solo Mobile */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden neumorphic-button p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-6 bg-gray-700 transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-gray-700 transform transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Desplegable */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  router.pathname === link.href
                    ? 'shadow-neumorphic-inset text-primary-600 font-semibold'
                    : 'shadow-neumorphic-sm text-gray-600 hover:shadow-neumorphic-inset'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
