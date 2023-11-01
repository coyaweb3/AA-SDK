export type Environment = 'test' | 'prod';
export type ChainType = 'bsc' | 'eth' | 'ape' | 'base' | 'linea';

export type AAMessageType =
  | 'UP_READY'
  | 'UP_RESPONSE'
  | 'UP_CLOSE'
  | 'UP_SIGN_MESSAGE'
  | 'UP_TRANSACTION'
  | 'UP_LOGIN'
  | 'UP_LOGOUT'
  | 'UP_EVENT'
  | 'UP_ERROR';

export class AAccount {
  constructor(
    public address: string,
    public email?: string,
    public newborn?: boolean,
    public message?: string,
    public signature?: string
  ) {}
}

export enum AAEventType {
  REGISTER = 'register',
}
export class AAEvent {
  constructor(
    public readonly type: AAEventType,
    public readonly body: AAccount
  ) {}
}

export type AAEventListener = (event: AAEvent) => void;

export class AAuthMessage {
  constructor(
    public readonly from: string,
    public readonly msg: string,
    public readonly type?: 'V1' | 'V4',
    public readonly isEIP191Prefix?: boolean,
    public readonly onAuthChain?: boolean
  ) {}
}

export class AATransactionMessage {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly value: string,
    public readonly data: string
  ) {}
}

type RESPONSE_TYPE = 'APPROVE' | 'DECLINE';
export class AAResponse {
  constructor(
    public readonly type: RESPONSE_TYPE,
    public readonly data: AAccount | string
  ) {}
}

export class AAMessage {
  constructor(public type: AAMessageType, public payload?: string) {}
}

export type ConnectType = 'google' | 'facebook' | 'both';

export type UPConnectOptions = {
  email?: boolean;
  connectType?: ConnectType;
  authorize?: boolean;
  forceLogin?: boolean;
  eventListener?: AAEventListener;
};

export interface MessageTypeProperty {
  name: string;
  type: string;
}

export interface MessageTypes {
  EIP712Domain: MessageTypeProperty[];
  [additionalProperties: string]: MessageTypeProperty[];
}

export interface TypedMessage<T extends MessageTypes> {
  types: T;
  primaryType: keyof T;
  domain: {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: ArrayBuffer;
  };
  message: Record<string, unknown>;
}
