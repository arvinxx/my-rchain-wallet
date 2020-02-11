import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';

import PageLoading from '@/components/PageLoading';
import { checkOverTime, getItem } from '@/utils/utils';

const SecurityLayout: FC = ({ children }) => {
  const [isReady, handleIsReady] = useState(false);

  useEffect(() => {
    handleIsReady(true);
  }, []);

  const loading = useSelector<ConnectState, boolean | undefined>(
    state => state.loading.models.user,
  );
  const lockTime = useSelector<ConnectState, number>(state => state.global.lockTime);
  const isOverTime = checkOverTime(lockTime);

  const autoLogin = getItem('autoLogin');

  const isLogin = getItem('currentUser');

  const queryString = stringify({
    redirect: window.location.href,
  });

  if ((!isLogin && loading) || !isReady) {
    return <PageLoading />;
  }
  // isn't login
  // or didn't check autoLogin and time over due time
  if (!isLogin || (!autoLogin && isOverTime)) {
    return <Redirect to={`/user/login?${queryString}`} />;
  }

  return children ? <>{children}</> : null;
};

export default SecurityLayout;
