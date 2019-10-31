import mixpanel, { Mixpanel } from 'mixpanel-browser';
import { Store } from 'redux';
import { Action, ConnectState } from '@/models/connect';

mixpanel.init('97dfca5378a4329fafbdd455e04f8fb3');

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
