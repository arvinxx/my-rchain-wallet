import React, { FC, useEffect, useState } from 'react';
import styles from './style.less';
import { useSelector, useDispatch } from 'dva';

import Account from './components/Account';
import AccountDetail from './components/AccountDetail';
import { ConnectState } from '@/models/connect';

export interface ITransaction {
  type: string;
  timestamp: number;
  title: string;
  number: number;
  status: string;
}

const Dashboard: FC = () => {
  const [visible, handleVisible] = useState(),
    dispatch = useDispatch(),
    { user } = useSelector<ConnectState, ConnectState>(state => state),
    getBalance = useSelector<ConnectState, boolean>(
      state => state.loading.effects['wallet/getBalance'],
    );

  useEffect(() => {
    dispatch({
      type: 'wallet/initContract',
    });
  }, []);

  const close = () => {
    handleVisible(false);
  };
  const open = () => {
    handleVisible(true);
  };

  const { currentUser } = user;

  const tokenList = [
    { name: 'RChain', img: 'http://pics.arvinx.com/2019-11-05-150211.jpg' },
    { name: 'ETH', img: 'http://pics.arvinx.com/2019-11-05-150237.jpg' },
  ];
  const transaction: ITransaction[] = [
    {
      timestamp: new Date().valueOf(),
      type: 'send',
      title: 'Contract Interaction',
      number: 125,
      status: '',
    },
    {
      type: 'receive',
      timestamp: new Date().valueOf(),
      title: 'Receive',
      number: 125,
      status: 'checked',
    },
    {
      type: 'receive',
      timestamp: new Date().valueOf(),
      title: 'Receive',
      number: 125,
      status: 'checked',
    },
    {
      type: 'receive',
      timestamp: new Date().valueOf(),
      title: 'Receive',
      number: 125,
      status: 'checked',
    },
    {
      type: 'receive',
      timestamp: new Date().valueOf(),
      title: 'Receive',
      number: 423,
      status: 'checked',
    },
    {
      type: 'send',
      timestamp: new Date().valueOf(),
      title: 'Contract Interaction',
      number: 125,
      status: 'checked',
    },
    {
      type: 'send',
      timestamp: new Date().valueOf(),
      title: 'Contract',
      number: 100,
      status: 'checked',
    },
    {
      type: 'send',
      timestamp: new Date().valueOf(),
      title: 'Contract',
      number: 79.3,
      status: 'checked',
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Account open={open} loading={getBalance} />
        <AccountDetail
          dispatch={dispatch}
          close={close}
          currentUser={currentUser}
          visible={visible}
        />
        {/*<Token tokenList={tokenList} selectedToken={'RChain'} />*/}
      </div>
      {/*<div className={styles.right}>*/}
      {/*  <Transaction transaction={transaction} token={'REV'} loading={checkBalance} />*/}
      {/*</div>*/}
    </div>
  );
};

export default Dashboard;
