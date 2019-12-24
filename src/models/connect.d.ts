import { AnyAction, Dispatch, Reducer } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { MenuDataItem } from '@ant-design/pro-layout';
// 导入相关 model 的 State

import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { WalletModelState } from './wallet';
import { LoginModelState } from '@/pages/user/login/model';

//******************//
// State 相关类型定义 //
//******************//

// 统一导出相关 model 的 State
export { GlobalModelState, SettingModelState, WalletModelState, UserModelState, LoginModelState };

// 导出合并后的 Store State 类型

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  wallet: WalletModelState;
  login: WalletModelState;
  routing: { location: Location };
}
//********************//
// Loading 相关类型定义 //
//********************//

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    wallet?: boolean;
    login?: boolean;
  };
}

//*********************//
// dispatch 相关类型定义 //
//*********************//

// 导出基础方法类型
export { Reducer, EffectsCommandMap, Subscription };

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
 * Dva dispatch 方法的类型定义
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: Action) => any;

// Dva 中 effects 方法的类型定义
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & {
    select: <T>(func: (state: ConnectState) => T) => T;
  },
) => void;

// 导出完整可以给到任何一个 Dva Model 的类型
export interface DvaModel<S> {
  namespace?: string;
  state: S;
  reducers: { [key: string]: Reducer<S> };
  effects?: { [key: string]: Effect };
  subscriptions?: { [key: string]: Subscription };
}

//************************//
// React Props 相关类型定义 //
//************************//

export interface Route extends MenuDataItem {
  routes?: Route[];
}

// React 组件props 的 DispatchProps
export interface DispatchProps {
  dispatch: Dispatch;
}
