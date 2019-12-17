import { Reducer, Effect, UserModelState, DvaModel } from './connect';
import { CurrentUser } from '@/models/user';
import { checkRevBalance, getRevBalance, transferToken } from '@/utils/rnode';
import { getItem, setItem } from '@/utils/utils';

export interface WalletModelState {
  revBalance: number;
  fee: number;
  checkBalanceSig?: Uint8Array;
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

const WalletModel: DvaModel<WalletModelState> = {
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
      const { address, privateKey } = currentUser;
      const { deployId, sig } = yield call(
        checkRevBalance,
        address,
        // privateKey,
        privateKey.replace('0x', ''),
        network,
      );
      setItem('check_balance_deploy_id', deployId);
      console.log('setItem', deployId);
      yield put({
        type: 'save',
        payload: {
          checkBalanceSig: sig,
        },
      });
      console.log('setItem check_balance_sig', sig);
    },
    *getBalance(_, { put, call, select }) {
      const network: string = yield select(state => state.global.network);
      const sig: string = yield select(state => state.wallet.checkBalanceSig);
      const balance = yield call(getRevBalance, sig, network);
      console.log('balance', balance);
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
      const res = yield call(
        transferToken,
        fromAddr,
        toAddr,
        amount,
        privateKey.replace(/^0x/, ''),
        network,
      );
      yield put({
        type: 'checkBalance',
      });
    },
  },
};

export default WalletModel;
