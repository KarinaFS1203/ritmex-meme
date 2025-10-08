export type TokenPrice = {
  price: string;
  maxPrice: string;
  increase: string;
  amount: string;
  marketCap: string;
  trading: string;
  dayIncrease: string;
  dayTrading: string;
  raisedAmount: string;
  progress: string;
  liquidity: string;
  tradingUsd: string;
  createDate: string;
  modifyDate: string;
  bamount: string;
  tamount: string;
}

export type TokenData = {
  id: number;
  address: string;
  image: string;
  name: string;
  shortName: string;
  symbol: string;
  descr: string;
  twitterUrl?: string;
  webUrl?: string;
  telegramUrl?: string;
  totalAmount: string;
  saleAmount: string;
  b0: string;
  t0: string;
  launchTime: number;
  minBuy: string;
  maxBuy: string;
  userId: number;
  userAddress: string;
  userName: string;
  userAvatar: string;
  status: string;
  showStatus: string;
  tokenPrice: TokenPrice;
  oscarStatus: string;
  progressTag: boolean;
  ctoTag: boolean;
  version: string;
  clickFunCheck: boolean;
  reserveAmount: string;
  raisedAmount: string;
  networkCode: string;
  label: string;
  createDate: string;
  modifyDate: string;
  isRush: boolean;
  dexType: string;
  lastId: number;
  isNew?: boolean; // Local flag for new token detection
}

export type ApiResponse = {
  code: number;
  msg: string;
  data: TokenData[];
}

export type Config = {
  defaultSort: string;
  defaultFilter: string;
  refreshInterval: number;
  pageSize: number;
}

export type NewTokenEvent = {
  token: TokenData;
  timestamp: number;
}