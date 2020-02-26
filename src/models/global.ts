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
  observer: string;
  validator: string;
};
export interface INetwork {
  name: string;
  observer?: string;
  validator?: string;
  readOnly: boolean;
}
export interface GlobalModelState {
  collapsed: boolean;
  locked: boolean;
  lockTime: number;
  analytics: boolean;
  exports: boolean;
  network: string;
  node: string;
  observer: string;
  validator: string;
  networkList: INetwork[];
}
export interface IConnection {
  observer: string;
  validator: string;
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
    analytics: false,
    network: 'mainnet',
    node: 'node0',
    observer: 'https://observer.myrchainwallet.com',
    validator: 'https://validator.myrchainwallet.com',
    networkList: [
      {
        name: 'mainnet',
        observer: 'https://observer.myrchainwallet.com',
        validator: 'https://validator.myrchainwallet.com',
        readOnly: true,
      },
      {
        name: 'testnet',
        observer: 'https://observer.testnet.myrhcainwallet.com',
        validator: 'https://validator.testnet.myrhcainwallet.com',
        readOnly: true,
      },
      {
        name: 'localhost',
        observer: 'http://localhost:40403',
        validator: 'http://localhost:40401',
        readOnly: false,
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
      const { network, observer, validator } = payload;
      setItem('connection', { network, observer, validator });
      return {
        ...state,
        network,
        observer,
        validator,
      };
    },
  },
  effects: {
    *changeNetwork({ payload: network }, { put, select }) {
      const { networkList } = yield select(state => state.global);

      const index = networkList.findIndex((item: TNode) => item.name === network);
      const { observer, validator } = networkList[index];
      yield put({
        type: 'handleNetwork',
        payload: { observer, validator, network },
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
