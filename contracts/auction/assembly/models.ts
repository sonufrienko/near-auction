import { u128 } from 'near-sdk-as';
import { Amount, Timestamp, AccountId } from '../../utils';

@nearBindgen
export class Auction {
  owner: AccountId;
  canceled: bool;
  ended: bool;
  highestBidder: AccountId;
  highestBid: Amount;
  lot: Lot;
  bids: Array<Bid>;

  constructor(owner: AccountId, lot: Lot) {
    this.owner = owner;
    this.canceled = false;
    this.ended = false;
    this.highestBidder = '';
    this.highestBid = u128.from('0000000000000000000000001');
    this.bids = [];
    this.lot = lot;
  }
}

export class Lot {
  name: string;
  imageUrl: string;

  constructor(name: string, imageUrl: string) {
    this.name = name;
    this.imageUrl = imageUrl;
  }
}

export class Bid {
  sender: AccountId;
  bid: Amount;
  date: Timestamp;
}
