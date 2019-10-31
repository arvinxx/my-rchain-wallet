import { AnyAction, Dispatch, Reducer } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { LoginModelStore } from './login';
import { EffectsCommandMap, Subscription } from 'dva';

export { GlobalModelState, SettingModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  login: LoginModelStore;
  routing: { location: Location };
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}

export { Reducer, EffectsCommandMap, Subscription };

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & {
    select: <T>(func: (state: ConnectState) => T) => T;
  },
) => void;

export type Action<P = any, C = (payload: P) => void> = {
  type: string;
  payload?: P;
  callback?: C;
  meta?: {
    mixpanel?: any;
  };
  [key: string]: any;
};
/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: Action<P, C>) => any;

export interface DispatchProps {
  dispatch: Dispatch;
}

export interface DvaModel<S> {
  namespace?: string;
  state: S;
  reducers: {
    save: Reducer<S>;
  };
  effects?: { [key: string]: Effect };
  subscriptions?: { [key: string]: Subscription };
}
