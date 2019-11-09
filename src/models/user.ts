import { Effect } from 'dva';

import { Reducer } from './connect';

import { queryCurrent, query as queryUsers, updateUserList } from '@/services/user';
import { IAccount } from '@/services/account';
import { accountLogin } from '@/services/login';
export interface CurrentUser extends IAccount {}
export interface UserModelState {
  currentUser: IAccount;
  userList?: IAccount[];
}

export interface UserModelStore {
  state: UserModelState;
  reducers: {
    save: Reducer<UserModelState>;
    changeName: Reducer<UserModelState>;
    fetchCurrent: Reducer<UserModelState>;
    fetchAll: Reducer<UserModelState>;
    register: Reducer<UserModelState>;
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
      balanceId: '',
      transferId: '',
      userid: '',
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
    fetchAll(state) {
      const userList = queryUsers();
      if (!userList) {
        return state;
      }
      return {
        ...state,
        userList,
      };
    },
    fetchCurrent(state) {
      const currentUser = queryCurrent();
      if (!currentUser) {
        return state;
      }
      return {
        ...state,
        currentUser,
      };
    },
    register(state, { payload }) {
      const { uid } = payload;
      accountLogin(uid);
      return state;
    },
  },
};

export default UserModel;
