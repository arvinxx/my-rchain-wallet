import { router } from 'umi';

import { accountLogin } from '@/services/login';
import { query } from '@/services/user';
import { Effect, Reducer } from '@/models/connect';

export interface LoginModelState {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelStore {
  namespace: string;
  state: LoginModelState;
  effects: {
    login: Effect;
  };
  reducers: {
    save: Reducer<LoginModelState>;
  };
}

const LoginModel: LoginModelStore = {
  namespace: 'login',
  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { select, put }) {
      const { username, password } = payload;
      const userList = query();
      const user = userList.find(user => user.username === username);

      // Login successfully
      if (user && user.pwd === password) {
        accountLogin(user.uid);
        yield put({
          type: 'save',
          payload: { status: 'ok' },
        });

        const { location } = yield select(state => state.router);

        const { query } = location;

        if (query && query.redirect) {
          window.location.href = query.redirect;
        } else {
          router.push('/');
        }
      } else {
        yield put({
          type: 'save',
          payload: { status: 'error' },
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default LoginModel;
