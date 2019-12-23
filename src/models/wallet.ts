import { Reducer, Effect, UserModelState, DvaModel } from './connect';
import { CurrentUser } from '@/models/user';
import { checkRevBalance, getRevBalance, transferToken } from '@/utils/rnode';
import { getItem, setItem, stringToUint8Array, Uint8ArrayToString } from '@/utils/utils';

export type TDeployStatus = 'waiting' | 'success' | 'failed' | 'none';

export interface WalletModelState {
  revBalance: number;
  fee: number;
  deployStatus: TDeployStatus;
}

export interface WalletModelStore extends DvaModel<WalletModelState> {
  effects: {
    checkBalance: Effect;
    getBalance: Effect;
    deployCheckBalance: Effect;
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
    deployStatus: 'none',
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
    *checkBalance(_, { put, select }) {
      const { network } = yield select(state => state.global);

      const prevDeployId = getItem('check_balance_deploy_id');
      const prevNetwork = getItem('network');

      console.log('prevDeployId', prevDeployId);
      console.log('prevNetwork', prevNetwork);
      console.log('network', network);

      // 当没有切换网络,且本地已存在合约 ID 时
      if (network === prevNetwork && prevDeployId) {
        const string = getItem('check_balance_sig');
        const checkBalanceSig = stringToUint8Array(string);
        yield put({
          type: 'save',
          payload: { checkBalanceSig },
        });
        yield put({
          type: 'getBalance',
          payload: '检查余额',
        });
        return;
      }
      // 如果没有合约或者切换网络,部署合约
      yield put({
        type: 'deployCheckBalance',
      });
    },
    *deployCheckBalance(_, { put, call, select }) {
      const currentUser: CurrentUser = yield select(state => state.user.currentUser);
      const { http } = yield select(state => state.global);

      const { address, privateKey } = currentUser;
      yield put({
        type: 'save',
        payload: { deployStatus: 'none' },
      });

      const { sig, deployId } = yield call(
        checkRevBalance,
        address,
        // need replace 0x !!!!
        privateKey.replace('0x', ''),
        http,
      );
      setItem('check_balance_deploy_id', deployId);
      setItem('check_balance_sig', Uint8ArrayToString(sig));
      yield put({
        type: 'save',
        payload: { deployStatus: 'waiting' },
      });
    },
    *getBalance({ payload }, { put, call, select }) {
      console.log(payload);
      const http: string = yield select(state => state.global.http);

      const string = getItem('check_balance_sig');
      const sig = stringToUint8Array(string);

      const balance = yield call(getRevBalance, sig, http);
      console.log('balance', balance);
      yield put({
        type: 'save',
        payload: {
          deployStatus: 'success',
          revBalance: balance,
        },
      });
    },

    *transfer({ payload }, { put, call, select }) {
      const { amount, toAddr } = payload;
      const currentUser: CurrentUser = yield select(state => state.user.currentUser);
      const network: string = yield select(state => state.global.network);
      const { address: fromAddr, privateKey } = currentUser;
      yield call(transferToken, fromAddr, toAddr, amount, privateKey.replace(/^0x/, ''), network);
      yield put({
        type: 'checkBalance',
      });
    },
  },
};

export default WalletModel;
