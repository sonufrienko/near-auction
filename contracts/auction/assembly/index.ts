import {
  Context, // visibility into account, contract and blockchain details
  storage, // key-value store for the contract (used by PersistentMap, PersistentVector and PersistentDeque)
  PersistentMap, // data structure that wraps storage to appear like a Map
  PersistentVector, // data structure that wraps storage to appear like a Vector
  PersistentSet, // data structure that wraps storage to appear like a Set
  u128,
  context,
} from 'near-sdk-as';
import { Auction, Bid, Lot } from './models';

@nearBindgen
export class Auctions {
  private auctions: PersistentVector<Auction> = new PersistentVector<Auction>('a');

  /**
   * Auction
   */

  startAuction(lotName: string, lotImageUrl: string): u32 {
    let lot = new Lot(lotName, lotImageUrl);
    let auction = new Auction(Context.sender, lot);

    let index = this.auctions.push(auction);
    return index;
  }

  getAuction(auctionId: u32): Auction | null {
    if (this.auctions.containsIndex(auctionId)) {
      return this.auctions[auctionId];
    }

    return null;
  }

  listAuctions(): Array<Auction> {
    let result = new Array<Auction>();
    for (let i = 0; i < this.auctions.length; i++) {
      const entry = this.auctions[i];
      result.push(entry);
    }
    return result;
  }

  endAuction(auctionId: u32): void {
    assert(this.auctions.containsIndex(auctionId), 'Auction not exists');

    let auction = this.auctions[auctionId];
    assert(context.sender == auction.owner, 'Only auction owner allowed');

    auction.ended = true;
    this.auctions.replace(auctionId, auction);
  }

  cancelAuction(auctionId: u32): void {
    assert(this.auctions.containsIndex(auctionId), 'Auction not exists');

    let auction = this.auctions[auctionId];
    assert(context.sender == auction.owner, 'Only auction owner allowed');

    auction.canceled = true;
    this.auctions.replace(auctionId, auction);
  }

  /**
   * Bid
   */

  placeBid(auctionId: u32): void {
    assert(this.auctions.containsIndex(auctionId), 'Auction not exists');

    let auction = this.auctions[auctionId];
    assert(!auction.canceled, 'Auction is canceled');
    assert(!auction.ended, 'Auction is ended');

    const bid = new Bid();
    assert(u128.gt(bid.bid, auction.highestBid), 'Bid should be greater then highestBid');

    auction.bids.push(bid);
    auction.highestBid = bid.bid;
    auction.highestBidder = bid.sender;
    this.auctions.replace(auctionId, auction);
  }

  withdraw(): void {}
}
