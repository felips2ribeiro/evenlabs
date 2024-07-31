// pages/_app.tsx
import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';; // Importa o CSS global do Mantine

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
