import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { router } from 'umi';

import { accountLogin } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
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
    logout: Effect;
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
    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
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
