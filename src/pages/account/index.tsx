import React, { Component, Fragment } from 'react';
import { Card, Tabs, Modal, Button, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import { PhraseBox } from '@/components';

import Private from './components/Private';
import Export from './components/Export';
import styles from './style.less';
import { GlobalModelState } from '@/models/global';
import { ConnectState, DispatchProps, UserModelState } from '@/models/connect';

const { TabPane } = Tabs;
interface IAccountInnerProps extends DispatchProps {
  global: GlobalModelState;
  user: UserModelState;
}

interface IAccountProps extends IAccountInnerProps {}
@connect(({ global, user }: ConnectState) => ({ global, user }))
export default class Account extends Component<IAccountProps> {
  static defaultProps: IAccountInnerProps;

  render() {
    const { global, dispatch, user } = this.props;
    const { analytics, exports } = global;
    const { currentUser } = user;
    return (
      <div className={styles.container}>
        <Card bordered={false}>
          <Tabs tabPosition={'left'} defaultActiveKey={'private'} tabBarStyle={{ border: 'none' }}>
            <TabPane key={'general'} tab={<FormattedMessage id={'account.tabs.general'} />}>
              general
            </TabPane>
            <TabPane key={'network'} tab={<FormattedMessage id={'account.tabs.network'} />}>
              network
            </TabPane>
            <TabPane key={'private'} tab={<FormattedMessage id={'account.tabs.private'} />}>
              <Private
                disabled={currentUser ? !currentUser.mnemonic : true}
                analytics={analytics}
                dispatch={dispatch}
              />
              {exports ? <Export visible={exports} /> : null}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
