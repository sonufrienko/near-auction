# DApp with NEAR Protocol

![](images/near-logo.png)

NEAR Certified Developer Project

## Goal

## Install

## How to use

## NEAR CLI

- `near login`: store full access key locally
- `near state`: show general details of an account
- `near send`: sends tokens from one account to another
- `near deploy`: deploy a contract to the blockchain
- `near dev-deploy`: create a dev account & deploy a contract (TestNet)
- `near call`: make a contract call (change or view methods)
- `near view`: make a contract call (only view methods)
- `near repl`: launch an interactive connection to the blockchain

## Deploy Smart Contract

npm run build:release
near dev-deploy ./build/release/auction.wasm
export CONTRACT=dev-1649362691109-47700064404108

## Access Smart Contract

near view $CONTRACT list_auctions
near call $CONTRACT create_auction '{"lotName": "Villa #001", "lotImageUrl": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"}' --accountId sergiio.testnet
near view $CONTRACT get_auction '{"auctionId": 1}'
near call $CONTRACT cancel_auction '{"auctionId": 0}' --accountId sergiio.testnet
near call $CONTRACT end_auction '{"auctionId": 1}' --accountId sergiio.testnet --gas=300000000000000
near call $CONTRACT place_bid '{"auctionId": 1}' --accountId u2.sergiio.testnet --deposit 0.011

## Account Details

near state sergiio.testnet // 129.9931568596443901
near state u1.sergiio.testnet // 30
near state u2.sergiio.testnet // 30
near state $CONTRACT // 200.3854488117852231

## Subaccounts

near create-account u1.sergiio.testnet --masterAccount sergiio.testnet --initialBalance 30
near create-account u2.sergiio.testnet --masterAccount sergiio.testnet --initialBalance 30
ls /Users/sergey/.near-credentials/testnet

near call $CONTRACT ctx --deposit 10 --accountId $CONTRACT
