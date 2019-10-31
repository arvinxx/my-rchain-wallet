import React, { Component, Fragment } from 'react';
import { Card, Tabs, Modal, Button, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { connect } from 'dva';
import { PhraseBox } from '@/components';

import Private from './components/Private';
import Export from './components/Export';
import styles from './style.less';
import { GlobalModelState } from '@/models/global';
import { ConnectState, DispatchProps } from '@/models/connect';

const { TabPane } = Tabs;
interface IAccountInnerProps extends DispatchProps {
  global: GlobalModelState;
}

interface IAccountProps extends IAccountInnerProps {}
@connect(({ global }: ConnectState) => ({ global }))
export default class Account extends Component<IAccountProps> {
  static defaultProps: IAccountInnerProps;

  render() {
    const { global, dispatch } = this.props;
    const { analytics, exports } = global;
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
              <Private analytics={analytics} dispatch={dispatch} />
              <Export visible={exports} />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
