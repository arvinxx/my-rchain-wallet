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
      const { address, privateKey, balanceId } = currentUser;
      const { balance, deployId } = yield call(
        checkRevBalance,
        address,
        privateKey,
        network,
        balanceId,
      );
      yield put({
        type: 'save',
        payload: {
          revBalance: balance,
        },
      });
      if (balanceId !== deployId) {
        yield put({
          type: 'user/updateCurrent',
          payload: {
            balanceId: deployId,
          },
        });
      }
    },
  },
};

export default WalletModel;
