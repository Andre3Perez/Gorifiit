import { useEffect } from 'react';
import { useRouter } from 'next/router';
import authService from '@/services/authService';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al dashboard si está autenticado, sino al login
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return null;
}
