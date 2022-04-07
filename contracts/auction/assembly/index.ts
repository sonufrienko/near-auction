import {
  Context, // visibility into account, contract and blockchain details
  storage, // key-value store for the contract (used by PersistentMap, PersistentVector and PersistentDeque)
  PersistentMap, // data structure that wraps storage to appear like a Map
  PersistentVector, // data structure that wraps storage to appear like a Vector
  PersistentSet, // data structure that wraps storage to appear like a Set
  u128,
} from 'near-sdk-as';
import { Auction, Lot } from './models';

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

  getAuction(id: u32): Auction {
    return this.auctions[id];
  }

  listAuctions(): Array<Auction> {
    let result = new Array<Auction>();
    for (let i = 0; i < this.auctions.length; i++) {
      const entry = this.auctions[i];
      result.push(entry);
    }
    return result;
  }

  finishAuction(): void {}

  cancelAuction(): void {}

  /**
   * Bid
   */

  placeBid(): void {}

  withdraw(): void {}
}
