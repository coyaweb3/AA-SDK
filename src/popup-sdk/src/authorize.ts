import { AAccount, AAuthMessage, AAMessage } from './types';
import { execPop, AA_SESSION_KEY } from './bridge';
import { PopupSDKConfig } from './config';
import { setStorage } from './storage';

export const authorize = async (
  message: AAuthMessage,
  config: PopupSDKConfig
): Promise<string> => {
  const sessionAccount = setStorage(config.storageType).get(AA_SESSION_KEY);
  const account = sessionAccount && (JSON.parse(sessionAccount) as AAccount);
  if (
    !account ||
    !message.from ||
    account.address.toLowerCase() !== message.from.toLowerCase()
  ) {
    throw new Error('can not authorize without login authorize');
  }
  const msg = new AAMessage('UP_SIGN_MESSAGE', JSON.stringify(message));

  try {
    const resp: string = (await execPop(msg)) as string;
    return resp;
  } catch (err) {
    throw new Error(err as string);
  }
};
