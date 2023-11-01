# Getting Started with AA wallet sdk
Guide on how to use wallet sdk in projects

## Download SDK source code
Go to [sdk github page](https://github.com/ApeGame/AA-SDK),  clone code to local folder.
```
git clone https://github.com/ApeGame/AA-SDK.git
```
notice:

This folder is the SDK code : AA-SDK/src/popup-sdk .  
This  is the SDK sample code : AA-SDK/src/App.tsx .

## Run SDK example
In the AA-SDK/src/popup-sdk directory, you can run:
```
 yarn install
```
In the AA-SDK/src directory, you can run:
```
 yarn install
```
In the AA-SDK/src directory, you can run:
```
 yarn start
```
## How to use sdk
open AA-SDK/src/App.tsx
### 1.import sdk
```typescript
import { AAPopupSDK } from './popup-sdk/src/index';
import { ConnectType, AAEvent, AAEventType } from './popup-sdk/src/types/index';
import { getChainId, setChainId } from './popup-sdk/src/chainId';
```
### 2.create sdk object with config
```typescript
const domain = 'wallet-dev.coya.biz';
const protocol = 'https';
aaWallet = new AAPopupSDK({
    storageType: 'localStorage',
    walletUrl: {
      domain,
      protocol,
    },
});
```
### 3.initialize account
```typescript
const getAccount = aaWallet.getAccount();
```

### 4.login with sdk
```typescript
const connect = async (connectType?: ConnectType) => {
    const account = await aaWallet.login({
      email: false,
      eventListener: (event: AAEvent) => {
        console.log('event', event);
        const { type, body } = event;
        if (type === AAEventType.REGISTER) {
          console.log('a user register');
        }
      },
      connectType,
    });
    if (account) {
      messageApi.success('login successful');
      setTimeout(() => {
        window.location.reload();
      });
    }
  };
```
After successful login, the account information will be saved in the browser local storage. local storage key is "AA-WALLET".  
When an authentication error occurs, please call the connect method again to update this value.

### 5.select chain
For example, Use linea testnet to send transactions:
```typescript
import { getChainId, setChainId } from './popup-sdk/src/chainId';

setChainId(e.target.value);
```

### 6.send transaction
Notice : the gas fee used for sending transactions is the native token.
#### 1.send native token transfer 
```typescript
import { parseEther } from 'ethers';
const sendNative = async (connectType?: ConnectType) => {
    const fromAddress = '0xa8D3697406225891b449a0940D824E1Af9E435C9';
    const toAddress = '0xa8D3697406225891b449a0940D824E1Af9E435C9';
    const native = '0.000001'
    const tx = {
      from: fromAddress,
      to: toAddress,
      value: '0x' + parseEther(native).toString(16),
      data: '0x',
    };
    txHash.value = await aaWallet.sendTransaction(tx);
    if (txHash.value) {
      messageApi.info(txHash.value);
    }
  };

```

#### 2.send erc20 token transfer 
Notice : can call smart contracts
```typescript
import { Interface, parseUnits, parseEther } from 'ethers';
const sendToken = async () => {
    try {
      const erc20Interface = new Interface(['function transfer(address _to, uint256 _value)']);
      const erc20TokenData = erc20Interface.encodeFunctionData('transfer', [
        '0x2CF88b803C96ED43Ef9b35c9FEdE49dfc79EAb35',
        parseUnits(erc20Amount, 18),
      ]);
      const tx = {
        from: '',
        to: erc20ContractAddress,
        value: '0x0',
        data: erc20TokenData,
      };
      res = await aaWallet.sendTransaction(tx);
      if (res) {
        messageApi.info(txHashERC20.value);
      }
    } catch (err: any) {
      messageApi.error(err?.message);
    }
  };

```

