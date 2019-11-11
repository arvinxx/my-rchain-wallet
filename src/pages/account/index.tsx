import React, { FC } from 'react';
import { Card, Tabs } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import { useMediaQuery } from 'react-responsive';

import { Private, Export, General, Network } from './components';

import styles from './style.less';
import { GlobalModelState } from '@/models/global';
import { ConnectState, DispatchProps, UserModelState } from '@/models/connect';

const { TabPane } = Tabs;

interface IAccountProps extends DispatchProps {
  global: GlobalModelState;
  user: UserModelState;
}

const Account: FC<IAccountProps> = props => {
  const { global, dispatch, user } = props;
  const { analytics, exports, lockTime, network, netList } = global;
  const { currentUser } = user;
  const { mnemonic, pwd } = currentUser;
  const isMobile = useMediaQuery({
    query: '(max-width: 480px)',
  });
  return (
    <div className={styles.container}>
      <Card bordered={false}>
        <Tabs
          tabPosition={isMobile ? 'top' : 'left'}
          defaultActiveKey={'general'}
          tabBarStyle={{ border: 'none' }}
        >
          <TabPane key={'general'} tab={<FormattedMessage id={'account.tabs.general'} />}>
            <General lockTime={lockTime} dispatch={dispatch} />
          </TabPane>
          <TabPane key={'network'} tab={<FormattedMessage id={'account.tabs.network'} />}>
            <Network network={network} dispatch={dispatch} netList={netList} />
          </TabPane>
          <TabPane key={'private'} tab={<FormattedMessage id={'account.tabs.private'} />}>
            <Private
              disabled={currentUser ? !mnemonic : true}
              analytics={analytics}
              dispatch={dispatch}
            />
            {exports ? (
              <Export dispatch={dispatch} pwd={pwd} visible={exports} mnemonic={mnemonic || ''} />
            ) : null}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default connect(({ global, user }: ConnectState) => ({ global, user }))(Account);
