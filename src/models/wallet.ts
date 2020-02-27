import { Reducer, Effect, DvaModel } from './connect';
import { CurrentUser } from '@/models/user';
import { checkBalance, transferToken } from '@/services/wallet';
import { message } from 'antd';
import { setItem } from '@/utils/utils';

export type CheckingStatus = 'success' | 'default' | 'error' | 'warning';

export interface WalletModelState {
  revBalance: number;
  fee: number;
  deployId: string;
  checkStatus: CheckingStatus;
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
    fee: 0.0013,
    checkStatus: 'default',
    deployId: '',
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
        payload: { checkStatus: 'default' },
      });
      try {
        const { expr } = yield checkBalance(address);
        const balance = expr[0]!.ExprInt!.data;
        yield put({
          type: 'save',
          payload: {
            checkStatus: 'success',
            revBalance: balance / 1e8,
            waitingBlockNumber: 0,
          },
        });
      } catch (e) {
        yield put({
          type: 'save',
          payload: { checkStatus: 'error' },
        });
      }
    },

    *transfer({ payload }, { put, call, select, take }) {
      const { amount, toAddr } = payload;
      const currentUser: CurrentUser = yield select(state => state.user.currentUser);
      const { address: fromAddr, privateKey } = currentUser;
      try {
        const result = yield call(transferToken, fromAddr, toAddr, amount * 1e8, privateKey);
        console.log(result);
        const reg = /DeployId is:\s(?<deployId>.*)/;

        const exp = reg.exec(result);
        console.log(exp);
        if (exp && exp.groups) {
          const deployId = exp.groups.deployId.toString();
          setItem('deployId', deployId);
        } else {
          message.error('deploy Failed');
        }
      } catch (e) {
        const { response } = e;
        const { status } = response;
        message.error(status);
      }
    },
  },
};

export default WalletModel;
