import {
  ChainType,
  Environment,
} from './types';

// const UP_DOMAIN = 'wallet-dev.coya.biz';
const UP_DOMAIN = 'localhost:3000';

export type UP_API_CONFIG = {
  upDomain: string;
  upConnectUrl: string;
  upLogoutUrl: string;
  upSignMessageUrl: string;
  upTransactionUrl: string;
  upLoadingUrl: string;
};

export interface WalletURL {
  domain?: string;
  protocol?: 'https' | 'http';
}

var config: UP_API_CONFIG = {
  upDomain: UP_DOMAIN,
  upConnectUrl: `https://${UP_DOMAIN}/connect`,
  upLogoutUrl: `https://${UP_DOMAIN}/logout`,
  upSignMessageUrl: `https://${UP_DOMAIN}/sign-message`,
  upTransactionUrl: `https://${UP_DOMAIN}/sendOperation`,
  upLoadingUrl: `https://${UP_DOMAIN}/connect/loading`,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (option: WalletURL) => {
  let { domain, protocol } = option;

  domain = domain || UP_DOMAIN;
  protocol = protocol || 'https';

  config = {
    upDomain: domain,
    upConnectUrl: `${protocol}://${domain}/connect`,
    upLogoutUrl: `${protocol}://${domain}/logout`,
    upSignMessageUrl: `${protocol}://${domain}/sign-message`,
    upTransactionUrl: `${protocol}://${domain}/sendOperation`,
    upLoadingUrl: `${protocol}://${domain}/connect/loading`,
  };
  return config;
};

export const getConfig = () => config;

export type StorageType = 'sessionStorage' | 'localStorage';

export interface PopupSDKConfig {
  env: Environment;
  chainType: ChainType;
  nodeRPC: string;
  storageType: StorageType;
}

const TEST_WALLET_URL: WalletURL = {
  protocol: 'https',
  domain: 'wallet-dev.coya.biz',
};
const MAIN_WALLET_URL: WalletURL = {
  protocol: 'https',
  domain: 'wallet.unipass.id',
};

const NODE_RPC_LIST = {
  mainnet: {
    eth: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    bsc: 'https://bsc-dataseed4.binance.org',
    linea:'https://linea.blockpi.network/v1/rpc/public',
    base:'https://developer-access-mainnet.base.org',
    ape:'https://bas.metaapesgame.com/bas_mainnet_full_rpc',
  },
  testnet: {
    eth: 'https://goerli.infura.io/v3',
    bsc:'https://data-seed-prebsc-1-s1.binance.org:854',
    linea:'https://rpc.goerli.linea.build',
    base:'https://base-goerli.public.blastapi.io',
    ape:'https://shanghai-inner-rpc.ankr.com/all/coq_testnet/rpc',
  },
};

export const getDefaultConfigOption = (
  env: Environment,
  chainType: ChainType
): PopupSDKOption => {
  return {
    env,
    nodeRPC:
      env === 'prod'
        ? NODE_RPC_LIST.mainnet[chainType]
        : NODE_RPC_LIST.testnet[chainType],
    chainType,
    walletUrl: env === 'prod' ? MAIN_WALLET_URL : TEST_WALLET_URL,
  };
};

export const getAuthProviderUrl = (env: Environment): string => {
  return env === 'prod'
    ? NODE_RPC_LIST.mainnet.ape
    : NODE_RPC_LIST.testnet.ape;
};

// config options
export type PopupSDKOption = {
  readonly nodeRPC?: string; // Rangers Node RPC list
  readonly chainType?: ChainType; // Chain ID
  readonly env?: Environment;

  readonly storageType?: StorageType;

  readonly walletUrl?: WalletURL; // UniPass up-core sdk configuration options
  
  readonly [key: string]: any; // other options
};
