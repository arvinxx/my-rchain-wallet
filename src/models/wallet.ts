import { Reducer, Effect, UserModelState } from './connect';
import { CurrentUser } from '@/models/user';
import { checkRevBalance } from '@/utils/rnode';

export interface WalletModelState {
  revBalance: number;
}

export interface WalletModelStore {
  state: WalletModelState;
  effects: {
    checkBalance: Effect;
  };
  reducers: {
    save: Reducer<WalletModelState>;
  };
}

const WalletModel: WalletModelStore = {
  state: {
    revBalance: 0,
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    *checkBalance(_, { put, call, select }) {
      const currentUser: CurrentUser = yield select(state => state.user.currentUser);
      const network: string = yield select(state => state.global.network);
      const { address, privateKey } = currentUser;
      const res = yield call(checkRevBalance, address, privateKey, network);
      console.log(res);
    },
  },
};

export default WalletModel;
