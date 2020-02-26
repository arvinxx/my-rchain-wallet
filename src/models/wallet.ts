import { Reducer, Effect, UserModelState, DvaModel } from './connect';
import { CurrentUser } from '@/models/user';
import { transferToken } from '@/utils/rnode';

import { checkBalance } from '@/services/rnode';

export type CheckingStatus = 'success' | 'default' | 'error' | 'warning';

export interface WalletModelState {
  revBalance: number;
  fee: number;
  deployStatus: CheckingStatus;
  waitingBlockNumber: number;
}

export interface WalletModelStore extends DvaModel<WalletModelState> {
  effects: {
    checkBalance: Effect;
    transfer: Effect;
  };
  reducers: {
    save: Reducer;
    addBlockNumber: Reducer;
  };
}

const WalletModel: WalletModelStore = {
  state: {
    revBalance: 0,
    fee: 0.9846,
    deployStatus: 'default',
    waitingBlockNumber: 0,
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    addBlockNumber(state) {
      const { waitingBlockNumber } = state;
      return {
        ...state,
        waitingBlockNumber: waitingBlockNumber + 1,
      };
    },
  },

  effects: {
    *checkBalance(_, { put, select }) {
      const { address } = yield select(state => state.user.currentUser);
      yield put({
        type: 'save',
        payload: { deployStatus: 'default' },
      });
      try {
        const { expr } = yield checkBalance(address);
        const balance = expr[0]!.ExprInt!.data;
        yield put({
          type: 'save',
          payload: {
            deployStatus: 'success',
            revBalance: balance / 1e8,
            waitingBlockNumber: 0,
          },
        });
      } catch (e) {
        yield put({
          type: 'save',
          payload: { deployStatus: 'error' },
        });
      }
    },

    *transfer({ payload }, { put, call, select }) {
      const { amount, toAddr } = payload;
      const currentUser: CurrentUser = yield select(state => state.user.currentUser);
      const { address: fromAddr } = currentUser;
      yield call(transferToken, fromAddr, toAddr, amount * 1e8);
      yield put({
        type: 'deployCheckBalance',
      });
    },
  },
};

export default WalletModel;
