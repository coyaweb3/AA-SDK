import { setStorage } from './storage';

const AA_CURRENT_CHAIN_KEY = 'current_chain_id';

export const getChainId = () => {
  const current_chain_id = setStorage('localStorage').get(AA_CURRENT_CHAIN_KEY);
  return current_chain_id;
};

export const setChainId = (chainId: number) => {
  setStorage('localStorage').set(AA_CURRENT_CHAIN_KEY, chainId);
};
