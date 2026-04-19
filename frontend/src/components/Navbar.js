import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar({ user, onLogout }) {
  const router = useRouter();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/inventario', label: 'Inventario', icon: '📦' },
    { href: '/movimientos', label: 'Movimientos', icon: '🔄' },
    { href: '/historial', label: 'Historial', icon: '📋' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neumorphic shadow-neumorphic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
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
          <div className="flex items-center space-x-4">
            <div className="neumorphic-card px-4 py-2">
              <span className="text-sm font-medium text-gray-700">
                👤 {user?.username || 'Usuario'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="neumorphic-button px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              🚪 Salir
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                router.pathname === link.href
                  ? 'shadow-neumorphic-inset text-primary-600 font-semibold'
                  : 'shadow-neumorphic-sm text-gray-600'
              }`}
            >
              <span className="mr-2">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
