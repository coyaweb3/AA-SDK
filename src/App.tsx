import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import { AAPopupSDK } from './popup-sdk/src/index';
import { ConnectType, AAEvent, AAEventType } from './popup-sdk/src/types/index';
import { Button, Input, message } from 'antd';
import { Interface, parseUnits, parseEther } from 'ethers';
import { getChainId, setChainId } from './popup-sdk/src/chainId';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';

function App() {
  let aaWallet: AAPopupSDK;
  const [native, setNative] = useState('');
  const [erc20Amount, setErc20Amount] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const fromAddress = '0xa8D3697406225891b449a0940D824E1Af9E435C9';
  const toAddress = '0xa8D3697406225891b449a0940D824E1Af9E435C9';
  const domain = 'wallet-dev.coya.biz'; //wallet address
  const protocol = 'https';
  aaWallet = new AAPopupSDK({
    storageType: 'localStorage',
    walletUrl: {
      domain,
      protocol,
    },
  });
  const getAccount = aaWallet.getAccount();
  const [currentChainId, setCurrentChainId] = useState(0);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setCurrentChainId(e.target.value);
    setChainId(e.target.value);
  };

  // console.log('getAccount-----',getAccount);

  useEffect(() => {
    if (getChainId() !== '') {
      console.log('123', getChainId());
      setCurrentChainId(parseInt(getChainId()));
    }
  }, []);

  // const checkTxStatus = async (txHash: string) => {
  //   let tryTimes = 0;
  //   console.log(aaWallet.getProvider())
  //   while (tryTimes++ < 3) {
  //     const receipt = await aaWallet
  //       .getProvider()
  //       .getTransactionReceipt(txHash);
  //     if (receipt) return receipt.status;
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //   }
  //   return false;
  // };

  const connect = async (connectType?: ConnectType) => {
    console.log('--------account-------', 123);
    const account = await aaWallet.login({
      email: false,
      // forceLogin: forceLogin.value,
      eventListener: (event: AAEvent) => {
        console.log('event', event);
        const { type, body } = event;
        if (type === AAEventType.REGISTER) {
          console.log('account', body);
          console.log('a user register');
        }
      },
      connectType,
    });
    console.log('--------account-------', account);
    if (account) {
      messageApi.success('login successful');
      setTimeout(() => {
        window.location.reload();
      });
    }
  };

  const signNative = async (connectType?: ConnectType) => {
    console.log('--------account-------', native);
    const tx = {
      from: fromAddress,
      to: toAddress,
      value: '0x' + parseEther(native).toString(16),
      data: '0x',
    };
    txHashERC20.value = await aaWallet.sendTransaction(tx);
    console.log('----------txHashERC20-----', txHashERC20);
    if (txHashERC20.value) {
      messageApi.info(txHashERC20.value);
    }
  };

  const txHashERC20 = {
    value: '',
  };
  const sendToken = async () => {
    try {
      const erc20Interface = new Interface(['function transfer(address _to, uint256 _value)']);
      const erc20TokenData = erc20Interface.encodeFunctionData('transfer', [
        '0xe2a65655dc1a3cde813d7909d96e80E9e5729Cf3',
        parseUnits(erc20Amount, 18),
      ]);
      const tx = {
        from: '0xa8D3697406225891b449a0940D824E1Af9E435C9',
        to: '0x13D91374CcB046ca0B66688AdCe4B2B62837A86a',
        value: '0x0',
        data: erc20TokenData,
      };
      txHashERC20.value = await aaWallet.sendTransaction(tx);

      console.log('txHashERC20.value', txHashERC20.value);

      if (txHashERC20.value) {
        messageApi.info(txHashERC20.value);
      }
    } catch (err: any) {
      messageApi.error(err?.message);
      console.log('sendToken', err?.message);
    }
  };

  return (
    <div className="App">
      {contextHolder}

      <div style={{ marginTop: 100 }}>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Radio.Group onChange={onChange} value={currentChainId}>
          <Radio value={12077}>Coq Testnet</Radio>
          <Radio value={84531}>Base Testnet</Radio>
          <Radio value={59140}>Linea Testnet</Radio>
        </Radio.Group>
        <div style={{ marginTop: 20 }}>
          {(!getAccount || (getAccount && !getAccount.address)) && (
            <Button
              onClick={() => {
                connect('google');
              }}>
              connect
            </Button>
          )}
          {getAccount && getAccount.address && (
            <div>
              <Input
                style={{ width: 160 }}
                maxLength={15}
                placeholder="amount"
                value={erc20Amount}
                onChange={(e) => {
                  if (e.target.value) {
                    setErc20Amount(e.target.value.trim());
                  } else {
                    setErc20Amount('');
                  }
                }}
              />
              <br />
              <Button
                style={{ marginTop: 10 }}
                onClick={() => {
                  sendToken();
                }}>
                send erc20
              </Button>
            </div>
          )}
        </div>

        <div style={{ marginTop: 40 }}>
          {getAccount && getAccount.address && (
            <div>
              <Input
                style={{ width: 160 }}
                maxLength={15}
                placeholder="amount"
                value={native}
                onChange={(e) => {
                  if (e.target.value) {
                    setNative(e.target.value.trim());
                  } else {
                    setNative('');
                  }
                }}
              />
              <br />
              <Button
                style={{ marginTop: 10 }}
                onClick={() => {
                  signNative();
                }}>
                send native
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
