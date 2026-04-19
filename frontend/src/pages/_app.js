import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { Toaster } from 'sonner';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster 
        position="top-right"
        richColors
        expand={false}
      />
    </Layout>
  );
}
