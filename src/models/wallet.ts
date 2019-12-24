import { Reducer, Effect, UserModelState, DvaModel } from './connect';
import { CurrentUser } from '@/models/user';
import { deployCheckBalance, getRevBalance, transferToken } from '@/utils/rnode';
import { getItem, setItem, stringToUint8Array, Uint8ArrayToString } from '@/utils/utils';
import { IConnection } from '@/models/global';
import { getMsgFromRNode, IPayload } from '@/services/websocket';
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
      const {
        currentUser: { uid },
      } = yield select(state => state.user);
      const contact = getItem('checkBalanceContact');

      if (
        // 如果没有合约
        !contact ||
        // 或者切换网络
        contact.network !== network ||
        // 或不是同一个用户
        contact.uid !== uid ||
        // 或不是成功状态
        contact.status !== 'success'
      ) {
        // 部署合约
        console.log('deploy check balance contact...');
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

      const { address, privateKey, uid } = currentUser;
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
          uid,
          status: 'waiting',
        });
        yield put({
          type: 'save',
          payload: { deployStatus: 'waiting' },
        });
        /**
         * 开始构建 WebSocket
         */
        getMsgFromRNode(`ws://${grpc}/ws/events`, http);
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
          revBalance: balance / 1e9,
        },
      });
    },

    *transfer({ payload }, { put, call, select }) {
      const { amount, toAddr } = payload;
      const currentUser: CurrentUser = yield select(state => state.user.currentUser);
      const http: string = yield select(state => state.global.http);
      const { address: fromAddr, privateKey } = currentUser;
      yield call(
        transferToken,
        fromAddr,
        toAddr,
        amount * 1e9,
        privateKey.replace(/^0x/, ''),
        http,
      );
      yield put({
        type: 'deployCheckBalance',
      });
    },
  },
};

export default WalletModel;
