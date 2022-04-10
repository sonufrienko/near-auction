import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getAuction } from '../../near';
import AuctionDetails from '../../components/AuctionDetails';

const AuctionPage: NextPage = ({ near }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const auctionId = Number(id);
  const [auction, setAuction] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  console.log('PAGE', near);

  useEffect(() => {
    if (near) {
      setLoading(true);
      getAuction(auctionId).then((response: any) => {
        setLoading(false);
        console.log(response);
        setAuction(response);
      });
    }
  }, [near]);

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb" style={{ marginTop: 20 }}>
        <Link href={`/`}>All auctions</Link>
        <Typography color="text.primary">Details</Typography>
      </Breadcrumbs>
      {auction && <AuctionDetails auction={auction} index={auctionId} />}
    </div>
  );
};

export default AuctionPage;
