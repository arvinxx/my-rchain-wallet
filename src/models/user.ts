import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, query as queryUsers, updateUserList } from '@/services/user';
import { IAccount } from '@/services/account';
import { accountLogin } from '@/services/login';

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
    register: Effect;
  };
  reducers: {
    save: Reducer<UserModelState>;
    changeName: Reducer<UserModelState>;
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
      uid: '',
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
    changeName(state, { payload: newName }) {
      const { currentUser } = state;
      const { username } = currentUser;
      const userList = queryUsers();
      const index = userList.findIndex(user => user.username === username);

      const user = { ...userList[index], username: newName };
      userList.splice(index, 1, user);
      updateUserList(userList);
      return {
        ...state,
        currentUser: { ...currentUser, username: newName },
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
    *register({ payload }, { put }) {
      const { uid } = payload;
      accountLogin(uid);
    },
  },
};

export default UserModel;
