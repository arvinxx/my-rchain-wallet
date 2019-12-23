import { Reducer } from 'redux';
import { Subscription } from 'dva';

import { NoticeIconData } from '@/components/NoticeIcon';
import { DvaModel } from './connect.d';
import { getItem, setItem } from '@/utils/utils';
import { rnodeWS } from '@/services/websocket';

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

export interface GlobalModelStore extends DvaModel<GlobalModelState> {
  reducers: {
    save: Reducer;
    changeLayoutCollapsed: Reducer;
    handleNetwork: Reducer;
    initNetwork: Reducer;
  };
  subscriptions: { setup: Subscription; RNodeWebSocket: Subscription };
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
    grpc: 'node0.testnet.rchain-dev.tk:40403',
    networkList: [
      {
        name: 'testnet',
        nodes: [
          {
            name: 'node0',
            http: 'https://testnet-0.grpc.rchain.isotypic.com',
            grpc: 'node0.testnet.rchain-dev.tk:40403',
          },
          {
            name: 'node1',
            http: 'https://testnet-1.grpc.rchain.isotypic.com',
            grpc: 'node1.testnet.rchain-dev.tk:40403',
          },
          {
            name: 'node2',
            http: 'https://testnet-2.grpc.rchain.isotypic.com',
            grpc: 'node2.testnet.rchain-dev.tk:40403',
          },
          {
            name: 'node3',
            http: 'https://testnet-3.grpc.rchain.isotypic.com',
            grpc: 'node3.testnet.rchain-dev.tk:40403',
          },
          {
            name: 'node4',
            http: 'https://testnet-4.grpc.rchain.isotypic.com',
            grpc: 'node4.testnet.rchain-dev.tk:40403',
          },
        ],
      },
      {
        name: 'localhost',
        http: 'http://localhost:54401',
        grpc: 'localhost:50403',
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
      const network = getItem('network') || 'testnet';
      const grpc = getItem('grpc') || 'node0.testnet.rchain-dev.tk:40403';
      const http = getItem('http') || 'https://testnet-0.grpc.rchain.isotypic.com';
      return {
        ...state,
        network,
        grpc,
        http,
      };
    },
    handleNetwork(state, { payload }) {
      const { network, http, grpc } = payload;
      setItem('network', network);
      setItem('grpc', grpc);
      setItem('http', http);
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
      // yield put({ type: 'switchWebSocket' });
      // yield put({ type: 'wallet/checkBalance' });
    },
    *switchWebSocket(_, { select, put }) {
      const { grpc } = yield select(state => state.global);
      setItem('grpc', grpc);
      const rnode = rnodeWS('ws://' + grpc + '/ws/events');
      rnode.onmessage = async ({ data }) => {
        const { event, payload } = JSON.parse(data);
        console.log('RNODE_EVENT', event, payload);
        const deployId = getItem('check_balance_deploy_id');
        if (payload && payload['deploy-ids'] && payload['deploy-ids'].indexOf(deployId) > -1) {
          await put({ type: 'wallet/getBalance' });
        }
      };
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

    RNodeWebSocket({ dispatch }) {
      const grpc = getItem('grpc') || 'node0.testnet.rchain-dev.tk:40403';

      const rnode = rnodeWS('ws://' + grpc + '/ws/events');

      console.log('监听 RNode', rnode);
      rnode.onmessage = ({ data }: any) => {
        const { event, payload } = JSON.parse(data);
        console.log('RNODE_EVENT', event, payload);
        const deployId = getItem('check_balance_deploy_id');

        if (payload && payload['deploy-ids'] && payload['deploy-ids'].indexOf(deployId) > -1) {
          dispatch({ type: 'wallet/checkBalance' });
        }
      };
    },
  },
};

export default GlobalModel;
