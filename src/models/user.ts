import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, query as queryUsers } from '@/services/user';
import { IAccount } from '@/services/account';

export interface CurrentUser extends IAccount {
  avatar?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser: CurrentUser;
  userList?: IAccount[];
}

export interface UserModelStore {
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    save: Reducer<UserModelState>;
  };
}

const UserModel: UserModelStore = {
  state: {
    currentUser: {
      mnemonic: '',
    },
    userList: [],
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
    *fetch(_, { put }) {
      const userList = queryUsers();
      yield put({
        type: 'save',
        payload: { userList },
      });
    },
    *fetchCurrent(_, { put }) {
      const currentUser = queryCurrent();
      yield put({
        type: 'save',
        payload: { currentUser },
      });
    },
  },
};

export default UserModel;
