import * as React from 'react';
import Link from 'next/link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinkButton from '@mui/material/Link';

export default function Auction({ auction, index }: any) {
  const { bids, canceled, ended, highestBid, highestBidder, lot, owner } = auction;
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" alt="green iguana" height="140" image={lot.imageUrl} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {lot.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Highest bid: {highestBid}
          <br />
          By: {owner}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`/auctions/${index}`}>
          <Button>Details</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
