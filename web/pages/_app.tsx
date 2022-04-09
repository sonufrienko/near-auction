import '../styles/globals.css';
import { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import * as near from '../near';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function MyApp({ Component, pageProps }: AppProps) {
  const [nearData, setNearData] = useState<any>(null);

  useEffect(() => {
    near.init().then(setNearData);
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Component {...pageProps} near={nearData} />
      </Container>
    </>
  );
}

export default MyApp;
