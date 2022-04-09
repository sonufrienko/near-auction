import { context, u128 } from 'near-sdk-as';
import { Money, Timestamp, AccountId } from './utils';

@nearBindgen
export class Auction {
  owner: AccountId = context.sender;
  canceled: bool = false;
  ended: bool = false;
  highestBidder: AccountId;
  highestBid: Money = u128.Zero;
  lot: Lot;
  bids: Array<Bid> = [];

  constructor(owner: AccountId, lot: Lot) {
    this.owner = owner;
    this.lot = lot;
  }
}

@nearBindgen
export class Lot {
  name: string;
  imageUrl: string;

  constructor(name: string, imageUrl: string) {
    this.name = name;
    this.imageUrl = imageUrl;
  }
}

@nearBindgen
export class Bid {
  sender: AccountId = context.sender;
  bid: Money = context.attachedDeposit;
  date: Timestamp = context.blockTimestamp;
}
