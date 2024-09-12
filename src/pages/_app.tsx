import { AppProps } from 'next/app';
import { ThemeProvider } from '../lib/contexts/ThemeContext';
import { AuthProvider } from '../lib/contexts/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;