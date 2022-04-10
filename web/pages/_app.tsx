import * as React from 'react';
import { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import * as near from '../near';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

function MyApp({ Component, pageProps }: AppProps) {
  const [nearData, setNearData] = useState<near.NearProps | null>(null);

  useEffect(() => {
    near.init().then(setNearData);
  }, []);

  const isSignedIn = nearData?.wallet.isSignedIn();

  const signIn = async () => {
    nearData?.wallet.requestSignIn(nearData?.contract.contractId);
  };

  const signOut = async () => {
    await nearData?.wallet.signOut();
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Auctions on Blockchain
          </Typography>
          {!isSignedIn && (
            <div>
              <Button color="secondary" variant="contained" onClick={signIn}>
                Sign In
              </Button>
            </div>
          )}
          {isSignedIn && nearData?.currentUser && (
            <>
              <div>
                {nearData?.currentUser?.accountId}
                <br />
                {near.formatNearAmount(nearData?.currentUser?.balance ?? '0', 4)} NEAR
              </div>
              <Button color="secondary" variant="contained" onClick={signOut}>
                Sign Out
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="md">
        <Component {...pageProps} near={nearData} />
      </Container>
    </>
  );
}

export default MyApp;
