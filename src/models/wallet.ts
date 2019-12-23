import { Reducer, Effect, UserModelState, DvaModel } from './connect';
import { CurrentUser } from '@/models/user';
import { deployCheckBalance, getRevBalance, transferToken } from '@/utils/rnode';
import { getItem, setItem, stringToUint8Array, Uint8ArrayToString } from '@/utils/utils';
import { IConnection } from '@/models/global';
import { getMsgFromRNode } from '@/services/websocket';
import { message } from 'antd';

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
      const contact = getItem('checkBalanceContact');

      // 如果没有合约或者切换网络,部署合约
      if (!contact || contact.network !== network) {
        yield put({
          type: 'deployCheckBalance',
        });
        return;
      }
      const { sig } = contact;
      const checkBalanceSig = stringToUint8Array(sig);
      yield put({
        type: 'save',
        payload: { checkBalanceSig },
      });
      yield put({
        type: 'getBalance',
      });
    },
    *deployCheckBalance(_, { put, call, select }) {
      const currentUser: CurrentUser = yield select(state => state.user.currentUser);
      const { http, network, grpc } = yield select(state => state.global);

      const { address, privateKey } = currentUser;
      yield put({
        type: 'save',
        payload: { deployStatus: 'none' },
      });
      try {
        const { sig, deployId } = yield call(
          deployCheckBalance,
          address,
          // need replace 0x !!!!
          privateKey.replace('0x', ''),
          http,
        );
        setItem('checkBalanceContact', {
          deployId,
          sig: Uint8ArrayToString(sig),
          network,
          status: 'success',
        });
        yield put({
          type: 'save',
          payload: { deployStatus: 'waiting' },
        });
        /**
         * 开始构建 WebSocket
         */
        const { event, payload } = yield call(getMsgFromRNode, `ws://${grpc}/ws/events`);
        console.log(event, payload);
        if (
          deployId &&
          payload &&
          payload['deploy-ids'] &&
          payload['deploy-ids'].indexOf(deployId) > -1
        ) {
          console.log('部署');
          yield put({ type: 'getBalance' });
        }
      } catch (e) {
        console.error(e);
        if (
          e.toString() ===
          'Error: Service error: Error while creating block: Must wait for more blocks from other validators'
        ) {
          message.error('network is error');
        } else {
          yield put({
            type: 'save',
            payload: { deployStatus: 'failed' },
          });
        }
      }
    },
    *getBalance(_, { put, call, select }) {
      const http: string = yield select(state => state.global.http);

      const { sig: string } = getItem('checkBalanceContact');
      const sig = stringToUint8Array(string);

      const balance = yield call(getRevBalance, sig, http);

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
      const http: string = yield select(state => state.global.http);
      const { address: fromAddr, privateKey } = currentUser;
      yield call(transferToken, fromAddr, toAddr, amount, privateKey.replace(/^0x/, ''), http);
      yield put({
        type: 'deployCheckBalance',
      });
    },
  },
};

export default WalletModel;
