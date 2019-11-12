import mixpanel, { Mixpanel } from 'mixpanel-browser';
import * as Sentry from '@sentry/browser';

import { Store } from 'redux';
import { Action, ConnectState } from '@/models/connect';
import { getUID } from '@/utils/utils';

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({ dsn: 'https://d74588d11e9e4127af0ee8879b8da23a@sentry.io/1815974' });
}

let device = localStorage.getItem('deviceId');
if (!device) {
  device = getUID();
  localStorage.setItem('deviceId', device);
}
mixpanel.init(
  process.env.NODE_ENV === 'development'
    ? '97dfca5378a4329fafbdd455e04f8fb3'
    : '22d6bf31b037baadb74830f3e3e5b59d',
);
mixpanel.identify(device);

const MixpanelMiddleware = (mixpanel: Mixpanel) => {
  if (!mixpanel || !mixpanel.track) {
    throw new TypeError('You must provide a mixpanel client instance.');
  }

  return ({ getState }: Store) => next => (action: Action) => {
    if (!action.meta || !action.meta.mixpanel || !action.meta.mixpanel.event) {
      return next(action);
    }
    try {
      // send analytics data when user open analytics
      const {
        global: { analytics },
      } = getState() as ConnectState;
      const { event, props } = action.meta.mixpanel;
      if (analytics) {
        mixpanel.track(event, props);
      }
    } catch (error) {}
    return next(action);
  };
};

const mixpanelMiddleware = {
  onAction: MixpanelMiddleware(mixpanel),
};

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
  },
  plugins: [mixpanelMiddleware],
};
