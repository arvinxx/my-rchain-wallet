import React, { useEffect } from 'react';
import classNames from 'classnames';
import NProgress from 'nprogress';
import './nprogress.less';

import styles from './style.less';

const PageLoading: React.FC = () => {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
    });

    NProgress.start();
    NProgress.inc();

    return () => {
      NProgress.done();
    };
  }, []);
  return (
    <div className={styles.body}>
      <div className={styles.ctnr}>
        <div className={styles.ldr}>
          <div className={styles.ldrBlk} />
          <div
            className={classNames({
              [styles.ldrBlk]: true,
              [styles.anDelay]: true,
            })}
          />
          <div
            className={classNames({
              [styles.ldrBlk]: true,
              [styles.anDelay]: true,
            })}
          />
          <div className={styles.ldrBlk} />
        </div>
      </div>
    </div>
  );
};
export default PageLoading;
