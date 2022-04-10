import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFormik } from 'formik';
import Paper from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LinkButton from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import * as near from '../near';

function PlaceBid({ auctionId, highestBid, disabled }: { auctionId: number; highestBid: string; disabled: boolean }) {
  const getMinBidAmount = (amountInYocto: string) => {
    let parsed = Number(near.formatNearAmount(amountInYocto, 6));
    parsed += 0.0001;
    return parsed.toFixed(4);
  };

  const onSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      await near.placeBid(auctionId, values.bid);
    } catch (err: any) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      bid: getMinBidAmount(highestBid),
    },
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        backgroundColor: '#eee',
        padding: 20,
        borderRadius: 6,
      }}
    >
      <Typography variant="h5" gutterBottom component="div">
        New Bid
      </Typography>
      <div style={{ marginBottom: 30 }}>
        <TextField
          fullWidth
          variant="standard"
          id="bid"
          label="Bid amount in NEAR"
          value={formik.values.bid}
          onChange={formik.handleChange}
        />
      </div>
      <Button variant="contained" type="submit" disabled={disabled || formik.isSubmitting}>
        Place bid
      </Button>
    </form>
  );
}

export default function AuctionDetails({ auction, index }: any) {
  const { bids, canceled, ended, highestBid, highestBidder, lot, owner } = auction;
  console.log(auction);

  return (
    <Paper style={{ marginTop: 20, marginBottom: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <img src={lot.imageUrl} alt={lot.name} style={{ maxWidth: '100%' }} />
        </Grid>
        <Grid item xs={5} style={{ paddingLeft: 40, paddingBottom: 40 }}>
          <Typography variant="h5" gutterBottom component="div">
            {lot.name}
          </Typography>
          Highest Bid: <b>{near.formatNearAmount(highestBid, 6)} NEAR</b>
          <br />
          Highest Bidder: <b>{highestBidder}</b>
          <br />
          By: <b>{owner}</b>
          <br />
          <br />
          <PlaceBid auctionId={index} highestBid={highestBid} disabled={canceled || ended} />
        </Grid>
        <Grid item xs={7} style={{ paddingRight: 30, paddingBottom: 40 }}>
          <Typography variant="h5" gutterBottom component="div">
            Bids
          </Typography>
          <ol>
            {bids.map((bid: any) => (
              <li key={bid.date}>
                {near.formatNearAmount(bid.bid, 6)} NEAR by {bid.sender} on{' '}
                {new Date(bid.date / 1000 / 1000).toLocaleString()}
              </li>
            ))}
          </ol>
        </Grid>
      </Grid>
    </Paper>
  );
}
