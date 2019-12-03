import { Reducer, Effect, UserModelState } from './connect';
import { CurrentUser } from '@/models/user';
import { checkRevBalance, transferToken } from '@/utils/rnode';

export interface WalletModelState {
  revBalance: number;
  fee: number;
}

export interface WalletModelStore {
  state: WalletModelState;
  effects: {
    checkBalance: Effect;
    transfer: Effect;
  };
  reducers: {
    save: Reducer<WalletModelState>;
  };
}

const WalletModel: WalletModelStore = {
  state: {
    revBalance: 0,
    fee: 0.9846,
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
      const { address, privateKey, balanceId } = currentUser;
      const { balance } = yield call(checkRevBalance, address, privateKey, network);
      yield put({
        type: 'save',
        payload: {
          revBalance: balance,
        },
      });
    },

    *transfer({ payload }, { put, call, select }) {
      const { amount, toAddr } = payload;
      const currentUser: CurrentUser = yield select(state => state.user.currentUser);
      const network: string = yield select(state => state.global.network);
      const { address: fromAddr, privateKey } = currentUser;
      const res = yield call(transferToken, fromAddr, toAddr, amount, privateKey, network);
      yield put({
        type: 'checkBalance',
      });
    },
  },
};

export default WalletModel;
