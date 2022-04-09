import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Paper from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinkButton from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import * as near from '../near';

export default function AuctionDetails({ auction, index }: any) {
  const { bids, canceled, ended, highestBid, highestBidder, lot, owner } = auction;
  console.log(auction);

  const placeBid = async () => {
    await near.placeBid(index);
  };

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
          Bids: {bids.length}
          <br />
          Highest Bid: {near.formatNearAmount(highestBid, 6)} NEAR
          <br />
          Highest Bidder: {highestBidder}
          <br />
          By: {owner}
          <p>
            <Button variant="contained" onClick={placeBid}>
              Place bid
            </Button>
          </p>
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
