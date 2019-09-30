import styles from './style.less';
import React from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';

export const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
export const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="register.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="register.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="register.strength.short" />
    </div>
  ),
};
