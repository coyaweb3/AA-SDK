import { ConnectType, AAMessage, AAMessageType } from './types';
import { getConfig } from './config';
import { renderPop } from './render-pop';
import { getLocalAccount } from './connect';
import { getChainId } from './chainId';

export interface Callbacks {
  send: (message: AAMessage) => void;
  close: () => void;
}

export interface MessageHandler {
  onReady: (e: MessageEvent, callbacks: Callbacks) => {};
  onResponse: (e: MessageEvent, callbacks: Callbacks) => {};
  onMessage: (e: MessageEvent, callbacks: Callbacks) => {};
  onClose: () => {};
}

const noop = () => {};

function serviceEndPoint(
  type: AAMessageType,
  connectType?: ConnectType,
  forceLogin?: boolean
) {
  if (type === 'UP_LOGIN') {
    if (connectType === 'google') {
      return (
        getConfig().upConnectUrl +
        `?connectType=google&forceLogin=${forceLogin ? '1' : '0'}`
      );
    }
    if (connectType === 'facebook') {
      return (
        getConfig().upConnectUrl +
        `?connectType=facebook&forceLogin=${forceLogin ? '1' : '0'}`
      );
    }
    return getConfig().upConnectUrl + `?forceLogin=${forceLogin ? '1' : '0'}`;
  } else if (type === 'UP_LOGOUT') {
    return getConfig().upLogoutUrl;
  } else if (type === 'UP_SIGN_MESSAGE') {
    return getConfig().upSignMessageUrl;
  } else if (type === 'UP_TRANSACTION') {
    return (
      getConfig().upTransactionUrl +
      `?chainId=${getChainId()}&token=${
        getLocalAccount('localStorage')?.signature
      }`
    );
  } else if (type === 'UP_READY') {
    return getConfig().upLoadingUrl;
  }
  throw new Error(`un support type ${type}`);
}

export async function pop(
  message: AAMessage,
  connectType?: ConnectType,
  forceLogin?: boolean,
  opts?: MessageHandler
) {
  if (message == null) return { send: noop, close: noop };

  const onClose = opts?.onClose || noop;
  const onMessage = opts?.onMessage || noop;
  const onReady = opts?.onReady || noop;
  const onResponse = opts?.onResponse || noop;

  window.addEventListener('message', internal);
  const { popup, unmount } = (await renderPop(
    serviceEndPoint(message.type, connectType, forceLogin),
    onResponse
  )) as any;

  return { send, close };

  function internal(e: MessageEvent) {
    console.log('------e-----', e);
    try {
      if (typeof e.data !== 'object') return;
      let data = e.data as AAMessage;
      if (!data || !data.type) return;

      if (data.type === 'UP_CLOSE') close();
      if (data.type === 'UP_READY') onReady(e, { send, close });
      if (data.type === 'UP_RESPONSE') onResponse(e, { send, close });

      if (data.type === 'UP_EVENT') onMessage(e, { send, close });
    } catch (error) {
      console.error('Popup Callback Error', error);
      close();
    }
  }

  function close() {
    try {
      window.removeEventListener('message', internal);
      unmount();
      onClose();
    } catch (error) {
      console.error('Popup Close Error', error);
    }
  }

  function send(msg: AAMessage) {
    try {
      popup?.postMessage(JSON.parse(JSON.stringify(msg || {})), '*');
    } catch (error) {
      console.error('Popup Send Error', msg, error);
    }
  }
}
