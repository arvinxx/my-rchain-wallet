import { Reducer } from 'redux';
import { Subscription } from 'dva';

import { NoticeIconData } from '@/components/NoticeIcon';
import { DvaModel } from './connect.d';
import { getItem, setItem } from '@/utils/utils';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export type TNode = {
  name: string;
  http: string;
  grpc: string;
};
export interface INetwork {
  name: string;
  http?: string;
  grpc?: string;
  nodes?: TNode[];
}
export interface GlobalModelState {
  collapsed: boolean;
  locked: boolean;
  lockTime: number;
  analytics: boolean;
  exports: boolean;
  network: string;
  node: string;
  http: string;
  grpc: string;
  networkList: INetwork[];
}
export interface IConnection {
  http: string;
  grpc: string;
  network: string;
}

export interface GlobalModelStore extends DvaModel<GlobalModelState> {
  reducers: {
    save: Reducer;
    changeLayoutCollapsed: Reducer;
    handleNetwork: Reducer;
    initNetwork: Reducer;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelStore = {
  namespace: 'global',
  state: {
    collapsed: false,
    locked: false,
    lockTime: 30,
    exports: false,
    analytics: true,
    network: 'testnet',
    node: 'node0',
    http: 'https://testnet-0.grpc.rchain.isotypic.com',
    grpc: 'wss://testnet.myrchainwallet.com',
    networkList: [
      {
        name: 'testnet',
        nodes: [
          {
            name: 'node0',
            http: 'https://testnet-0.grpc.rchain.isotypic.com',
            grpc: 'wss://testnet.myrchainwallet.com',
          },
          {
            name: 'node1',
            http: 'https://testnet-1.grpc.rchain.isotypic.com',
            grpc: 'wss://testnet.myrchainwallet.com',
          },
          {
            name: 'node2',
            http: 'https://testnet-2.grpc.rchain.isotypic.com',
            grpc: 'wss://testnet.myrchainwallet.com',
          },
          {
            name: 'node3',
            http: 'https://testnet-3.grpc.rchain.isotypic.com',
            grpc: 'wss://testnet.myrchainwallet.com',
          },
          {
            name: 'node4',
            http: 'https://testnet-4.grpc.rchain.isotypic.com',
            grpc: 'wss://testnet.myrchainwallet.com',
          },
        ],
      },
      {
        name: 'localhost',
        http: 'http://localhost:54401',
        grpc: 'ws://localhost:50403',
      },
    ],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    initNetwork(state) {
      const connection: IConnection = getItem('connection');
      return {
        ...state,
        ...connection,
      };
    },
    handleNetwork(state, { payload }) {
      const { network, http, grpc } = payload;
      setItem('connection', { network, grpc, http });
      return {
        ...state,
        network,
        http,
        grpc,
      };
    },
  },
  effects: {
    *changeNetwork({ payload: network }, { put, select }) {
      const { networkList, node } = yield select(state => state.global);

      if (network === 'testnet') {
        const { nodes } = networkList[0];
        const index = nodes.findIndex((item: TNode) => item.name === node);
        const { http, grpc } = nodes[index];
        yield put({
          type: 'handleNetwork',
          payload: { http, grpc, network },
        });
      } else {
        const index = networkList.findIndex((item: TNode) => item.name === network);
        const { http, grpc } = networkList[index];
        yield put({
          type: 'handleNetwork',
          payload: { http, grpc, network },
        });
      }
      yield put({ type: 'wallet/checkBalance' });
    },
  },
  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
