import { setStorage } from './storage';
import { PopupSDKConfig } from './config';
import { execPop, AA_SESSION_KEY } from './bridge';
import { AAccount, AATransactionMessage, AAMessage } from './types';

export const sendTransaction = async (
  tx: AATransactionMessage,
  config: PopupSDKConfig
): Promise<string> => {
  const sessionAccount = setStorage(config.storageType).get(AA_SESSION_KEY);
  const account = sessionAccount && (JSON.parse(sessionAccount) as AAccount);

  console.log('account', account);
  console.log('tx.from', tx.from);
  console.log(
    'account.address.toLowerCase()',
    (account as any).address.toLowerCase()
  );
  console.log('tx.from.toLowerCase()', tx.from.toLowerCase());

  if (
    !account ||
    !tx.from ||
    account.address.toLowerCase() !== tx.from.toLowerCase()
  ) {
    throw new Error('can not authorize without login sendTransaction');
  }
  const msg = new AAMessage(
    'UP_TRANSACTION',
    JSON.stringify(tx)
    // config.appSettings
  );

  try {
    const resp: string = (await execPop(msg)) as string;
    return resp;
  } catch (err) {
    throw new Error(err as string);
  }
};
