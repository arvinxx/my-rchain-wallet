import * as Sentry from '@sentry/browser';

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({ dsn: 'https://d74588d11e9e4127af0ee8879b8da23a@sentry.io/1815974' });
}

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
