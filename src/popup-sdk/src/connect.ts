import {
  AAccount,
  UPConnectOptions,
  AAMessage,
} from './types';
import { execPop, AA_SESSION_KEY } from './bridge';
import { PopupSDKConfig, StorageType } from './config';
import { setStorage } from './storage';

export const connect = async (
  config: PopupSDKConfig,
  options?: UPConnectOptions
): Promise<AAccount> => {
  const sessionAccount = setStorage(config.storageType).get(AA_SESSION_KEY);
  const account: AAccount =
    (sessionAccount && (JSON.parse(sessionAccount) as AAccount)) ||
    (await getAccount(config, options));

  return account;
};

export const getLocalAccount = (
  storageType: StorageType
): AAccount | undefined => {
  const sessionAccount = setStorage(storageType).get(AA_SESSION_KEY);

  if (sessionAccount) {
    return JSON.parse(sessionAccount) as AAccount;
  } else {
    return undefined;
  }
};

export const disconnect = async (deep: boolean) => {
  if (deep) {
    const message = new AAMessage('UP_LOGOUT');
    await execPop(message);
  }
  setStorage('localStorage').remove(AA_SESSION_KEY);
  setStorage('sessionStorage').remove(AA_SESSION_KEY);
};

const getAccount = async (
  config: PopupSDKConfig,
  options?: UPConnectOptions
): Promise<AAccount> => {
  try {
    console.log(options)
    const payload = options ? JSON.stringify(options) : '';
    const message = new AAMessage('UP_LOGIN', payload);

    const account: AAccount = (await execPop(
      message,
      options?.connectType,
      options?.forceLogin,
      options?.eventListener
    )) as AAccount;
    console.log('-----account----',account)
    if (account && account.address) {
      setStorage(config.storageType).set(
        AA_SESSION_KEY,
        JSON.stringify(account)
      );
    }

    return account;
  } catch (e) {
    console.log(e)
    throw new Error('Account Not Available');
  }
};
