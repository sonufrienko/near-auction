# Auction powered by NEAR Protocol

![](images/near-logo.png)

https://www.loom.com/share/5df1cb4021794eea8ed1ebab21eca84b

This project allows the creation of transparent auctions on the blockchain where any bids can be verified. Users can sell goods to the highest bidder.

## How to use

### Seller can

- create as many auctions as needed
- finish or cancel the auction

By finishing the auction, a seller will receive the highest bid, all the rest bids will be withdrawn to bidders.

### Bidder can

- place a bid

## NEAR CLI

- `near login`: store full access key locally
- `near state`: show general details of an account
- `near send`: sends tokens from one account to another
- `near deploy`: deploy a contract to the blockchain
- `near dev-deploy`: create a dev account & deploy a contract (TestNet)
- `near call`: make a contract call (change or view methods)
- `near view`: make a contract call (only view methods)

## Deploy Smart Contract

First, you need to login

```
near login
```

Deploy to dev account (testnet only)

```sh
npm run build:release
near dev-deploy ./build/release/auction.wasm
export CONTRACT=<dev-###-###>
```

Deploy to any account

```sh
npm run build:release
near deploy --accountId sergiio.testnet --wasmFile ./build/release/auction.wasm
export CONTRACT=sergiio.testnet
```

## Access Smart Contract

List all auction

```sh
near view $CONTRACT list_auctions
```

Create new auction

```sh
near call $CONTRACT create_auction '{"lotName": "Villa #001", "lotImageUrl": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"}' --accountId sergiio.testnet
```

Get auction details by index

```sh
near view $CONTRACT get_auction '{"auctionId": 1}'
```

Finish auction

```sh
near call $CONTRACT end_auction '{"auctionId": 1}' --accountId sergiio.testnet --gas=300000000000000
```

Cancel auction

```sh
near call $CONTRACT cancel_auction '{"auctionId": 1}' --accountId sergiio.testnet
```

Place a bid

```sh
near call $CONTRACT place_bid '{"auctionId": 1}' --accountId u2.sergiio.testnet --deposit 0.011
```

Get contract balance

```sh
near state $CONTRACT
```

## Subaccounts

Create sub-account

```sh
near create-account u1.sergiio.testnet --masterAccount sergiio.testnet --initialBalance 30
```

Make a transfer from user1 to user2

```sh
near call user2 ctx --deposit 10 --accountId user1
```

List local accounts on Mac

```sh
ls /Users/<OS user name>/.near-credentials/testnet
```

## Run Web app

Create `.env.local` file in `./web` folder

```sh
NEXT_PUBLIC_CONTRACT=<account where contract deployed>
NEXT_PUBLIC_NEAR_ENV=testnet
```

Run app

```sh
npm run dev
```
