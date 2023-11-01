import { AAMessage } from './types';
import { pop } from './pop';

export const initPop = () => {
  pop(new AAMessage('UP_READY'));
};
