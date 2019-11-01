import React, { Component } from 'react';
import { Card, Typography, Tag, Button, Avatar } from 'antd';
import styles from './style.less';
import { formatMessage } from 'umi-plugin-locale';
import Account from './components/Account';
import AccountDetail from './components/AccountDetail';
import { connect } from 'dva';
import { ConnectState, DispatchProps, UserModelState } from '@/models/connect';

const { Text } = Typography;

interface IAccountDetailProps extends DispatchProps {
  user: UserModelState;
}

@connect(({ user }: ConnectState) => ({ user }))
export default class Dashboard extends Component<IAccountDetailProps> {
  state = {
    visible: false,
  };
  close = () => {
    this.setState({
      visible: false,
    });
  };
  open = () => {
    this.setState({
      visible: true,
    });
  };
  render() {
    const { user, dispatch } = this.props;
    const { visible } = this.state;
    const { currentUser } = user;
    return (
      <div className={styles.container}>
        <Account open={this.open} />
        <AccountDetail
          dispatch={dispatch}
          close={this.close}
          currentUser={currentUser}
          visible={visible}
        />
      </div>
    );
  }
}
