import * as nearAPI from 'near-api-js';
import { getConfig } from '../config';

const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT!;
const NEAR_ENV = process.env.NEXT_PUBLIC_NEAR_ENV || 'testnet';
const NEAR_CONFIG = getConfig(NEAR_ENV);
let contract: nearAPI.Contract | null = null;

export const getWallet = async () => {
  // creates keyStore using private key in local storage
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  // connect to NEAR
  const near = await nearAPI.connect({ keyStore, ...NEAR_CONFIG });

  // create wallet connection
  const wallet = new nearAPI.WalletConnection(near, null);
  // wallet.requestSignIn();
  return wallet;
};

export const getUser = async (wallet: nearAPI.WalletConnection) => {
  console.log({
    account: wallet.account(),
    getAccountId: wallet.getAccountId(),
    isSignedIn: wallet.isSignedIn(),
  });

  const accountId = wallet.getAccountId();
  if (accountId) {
    const { amount } = await wallet.account().state();
    return { accountId, balance: amount };
  }

  return null;
};

export interface NearProps {
  contract: nearAPI.Contract;
  currentUser: {
    accountId: any;
    balance: string;
  } | null;
  config: nearAPI.ConnectConfig;
  wallet: nearAPI.WalletConnection;
}

export async function init(): Promise<NearProps> {
  const wallet = await getWallet();
  const currentUser = await getUser(wallet);

  const contractId = CONTRACT_NAME;
  console.log({ contractId });

  // Initializing our contract APIs by contract name and configuration
  contract = await new nearAPI.Contract(wallet.account(), contractId, {
    viewMethods: ['list_auctions', 'get_auction'],
    changeMethods: ['create_auction', 'cancel_auction', 'end_auction', 'place_bid'],
    // sender: wallet.account().accountId,
  });

  console.log('INIT:', { contract, currentUser, config: NEAR_CONFIG, wallet });
  return { contract, currentUser, config: NEAR_CONFIG, wallet };
}

export const listAuctions = async () => {
  // @ts-ignore
  return contract?.list_auctions();
};

export const getAuction = async (auctionId: number) => {
  // @ts-ignore
  return contract?.get_auction({ auctionId });
};

export const placeBid = async (auctionId: number, nearAmount: string) => {
  const gas = 30_000_000_000_000;
  const depositInYoctoNEAR = nearAPI.utils.format.parseNearAmount(nearAmount);
  // @ts-ignore
  return contract?.place_bid({ auctionId }, gas, depositInYoctoNEAR);
};

export const formatNearAmount = nearAPI.utils.format.formatNearAmount;
export const parseNearAmount = nearAPI.utils.format.parseNearAmount;
