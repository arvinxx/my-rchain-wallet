import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';

import PageLoading from '@/components/PageLoading';
import { getItem } from '@/utils/utils';

const SecurityLayout: FC = ({ children }) => {
  const [isReady, handleIsReady] = useState(false);

  useEffect(() => {
    handleIsReady(true);
  }, []);

  const loading = useSelector<ConnectState, boolean | undefined>(
    state => state.loading.models.user,
  );
  const checkLocked = () => {
    const lastLogin = localStorage.getItem('lastLogin') as string;
    const dueTime = 30 * 60 * 1000; // lock after 30 mins
    const duration = new Date().valueOf() - Number(lastLogin);

    return duration > dueTime;
  };

  const isLogin = getItem('currentUser');
  const autoLogin = getItem('autoLogin');

  const queryString = stringify({
    redirect: window.location.href,
  });

  if ((!isLogin && loading) || !isReady) {
    return <PageLoading />;
  }
  // isn't login
  // or didn't check autoLogin and time over due time
  if (!isLogin || (!autoLogin && checkLocked())) {
    return <Redirect to={`/user/login?${queryString}`} />;
  }

  return children;
};

export default SecurityLayout;
