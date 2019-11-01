import { Effect } from 'dva';
import { Reducer } from 'redux';
import { slice } from 'lodash';

import { queryCurrent, query as queryUsers, updateUserInfo, updateUserList } from '@/services/user';
import { IAccount } from '@/services/account';

export interface CurrentUser extends IAccount {
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
      address: '',
      username: '',
      avatar: '',
      ethAddr: '',
      privateKey: '',
      pwd: '',
    },
    userList: [],
  },
  reducers: {
    save(state, { payload }) {
      const { currentUser } = state;
      if (currentUser && currentUser.username) {
        const { username } = currentUser;
        const userList = queryUsers();
        const index = userList.findIndex(user => user.username === username);
        const { currentUser: NextUser } = payload;
        if (NextUser && NextUser.username !== username) {
          const user = { ...userList[index], username: NextUser.username };
          userList.splice(index, 1, user);
          updateUserList(userList);
        }
      }
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
