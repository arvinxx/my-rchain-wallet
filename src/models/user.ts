import { Reducer, Effect, DvaModel } from './connect';

import { queryCurrent, query as queryUsers, updateUserList } from '@/services/user';
import { IAccount } from '@/services/account';
import { accountLogin } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import { router } from 'umi';
export interface CurrentUser extends IAccount {}
export interface UserModelState {
  currentUser: IAccount;
  userList?: IAccount[];
}

export interface UserModelStore extends DvaModel<UserModelState> {
  reducers: {
    save: Reducer;
    changeName: Reducer;
    updateCurrent: Reducer;
    fetchCurrent: Reducer;
    fetchAll: Reducer;
    register: Reducer;
  };
  effects: {
    logout: Effect;
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
    updateCurrent(state, { payload }) {
      const { currentUser } = state;
      const { username } = currentUser;
      const userList = queryUsers();
      const index = userList.findIndex(user => user.username === username);
      const user = { ...userList[index], ...payload };
      userList.splice(index, 1, user);
      updateUserList(userList);
      return {
        ...state,
        currentUser: user,
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
  effects: {
    *logout() {
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield router.push('/user/login');
      }
    },
  },
};

export default UserModel;
