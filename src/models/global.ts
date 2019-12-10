import { Reducer } from 'redux';
import { Subscription, Effect } from 'dva';

import { NoticeIconData } from '@/components/NoticeIcon';
import { ConnectState, DvaModel } from './connect.d';
import { setItem } from '@/utils/utils';
import { startRNodeWs } from '@/services/websocket';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}
export interface INetList {
  testNetList: string[];
}
export interface GlobalModelState {
  collapsed: boolean;
  locked: boolean;
  lockTime: number;
  analytics: boolean;
  exports: boolean;
  network: string;
  netList: INetList;
  notices: NoticeItem[];
}

export interface GlobalModelStore {
  namespace: 'global';
  state: GlobalModelState;

  reducers: {
    save: Reducer<GlobalModelState>;
    changeNetworkchangeNetwork: Reducer<GlobalModelState>;
    changeLayoutCollapsed: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: DvaModel<GlobalModelState> = {
  namespace: 'global',

  state: {
    collapsed: false,
    locked: false,
    lockTime: 30,
    exports: false,
    analytics: true,
    network: 'https://testnet-1.grpc.rchain.isotypic.com',
    notices: [],
    netList: {
      testNetList: [
        'node0',
        'node1',
        'node2',
        'node3',
        'node4',
        'node5',
        'node6',
        'node7',
        'node8',
        'node9',
      ],
    },
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
  },
  effects: {
    *changeNetwork({ payload: network }, { put }) {
      setItem('network', network);
      // startRNodeWs(`ws://node0.testnet.rchain-dev.tk:40403/ws/events`);

      yield put({
        type: 'save',
        payload: { network },
      });
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
