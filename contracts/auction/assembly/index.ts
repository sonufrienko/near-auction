import {
  Context, // visibility into account, contract and blockchain details
  storage, // key-value store for the contract (used by PersistentMap, PersistentVector and PersistentDeque)
  PersistentMap, // data structure that wraps storage to appear like a Map
  PersistentVector, // data structure that wraps storage to appear like a Vector
  PersistentSet, // data structure that wraps storage to appear like a Set
  u128,
  ContractPromise,
  ContractPromiseBatch,
  logging,
} from 'near-sdk-as';
import { Auction, Bid, Lot } from './models';
import { XCC_GAS, assert_self, assert_single_promise_success } from '../utils';

/**
 * TO DO
 * 1. Bids should be uniq per sender, 1 sender = 1 bid
 * 2. When auction is ended, all losed bids should be returned to senders
 * 3. Save transfer confirmation and next another transfer
 * 4. Refactor Auction class
 * 5. Refactor Bid class
 */

@nearBindgen
export class Auctions {
  private auctions: PersistentVector<Auction> = new PersistentVector<Auction>('a');

  /**
   * Auction
   */

  create_auction(lotName: string, lotImageUrl: string): u32 {
    let lot = new Lot(lotName, lotImageUrl);
    let auction = new Auction(Context.sender, lot);

    let index = this.auctions.push(auction);
    return index;
  }

  get_auction(auctionId: u32): Auction | null {
    if (this.auctions.containsIndex(auctionId)) {
      return this.auctions[auctionId];
    }

    return null;
  }

  list_auctions(): Array<Auction> {
    let result = new Array<Auction>();
    for (let i = 0; i < this.auctions.length; i++) {
      const entry = this.auctions[i];
      result.push(entry);
    }
    return result;
  }

  end_auction(auctionId: u32): void {
    this.assert_auction_id(auctionId);

    let auction = this.auctions[auctionId];
    this.assert_auction_owner(auction);
    this.assert_auction_is_open(auction);

    auction.ended = true;
    this.auctions.replace(auctionId, auction);

    // Transfer money from winner to auction owner
    this.transfer(auction);
  }

  cancel_auction(auctionId: u32): void {
    this.assert_auction_id(auctionId);

    let auction = this.auctions[auctionId];
    this.assert_auction_owner(auction);
    this.assert_auction_is_open(auction);

    auction.canceled = true;
    this.auctions.replace(auctionId, auction);
  }

  /**
   * Bid
   */

  place_bid(auctionId: u32): void {
    this.assert_auction_id(auctionId);

    let auction = this.auctions[auctionId];
    this.assert_auction_is_open(auction);

    const bid = new Bid();
    this.assert_bid_is_highest(auction, bid);

    auction.bids.push(bid);
    auction.highestBid = bid.bid;
    auction.highestBidder = bid.sender;
    this.auctions.replace(auctionId, auction);
  }

  withdraw(): void {}

  @mutateState()
  on_transfer_complete(): void {
    assert_self();
    assert_single_promise_success();

    logging.log('transfer complete');
    // auction.record_transfer()
  }

  /**
   * PRIVATE
   */

  private transfer(auction: Auction): void {
    this.assert_auction_owner(auction);

    const to_self = Context.contractName;
    const to_auction_owner = ContractPromiseBatch.create(auction.owner);

    // transfer earnings to owner then confirm transfer complete
    const promise = to_auction_owner.transfer(auction.highestBid);
    promise.then(to_self).function_call('on_transfer_complete', '{}', u128.Zero, XCC_GAS);
  }

  private assert_auction_owner(auction: Auction): void {
    assert(Context.sender == auction.owner, 'Only the owner of this auction may call this method');
  }

  private assert_auction_id(id: u32): void {
    assert(this.auctions.containsIndex(id), 'Auction not exists');
  }

  private assert_auction_is_open(auction: Auction): void {
    assert(!auction.canceled, 'Auction is canceled');
    assert(!auction.ended, 'Auction is ended');
  }

  private assert_bid_is_highest(auction: Auction, bid: Bid): void {
    assert(bid.bid > u128.Zero, 'No deposit received');
    assert(u128.gt(bid.bid, auction.highestBid), 'Bid should be greater then highestBid');
  }
}
