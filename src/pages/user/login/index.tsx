import React, { Component } from 'react';
import { Button, Select, Divider, Typography, Avatar } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import Link from 'umi/link';
import { router } from 'umi';
import { connect } from 'dva';
import { LoginModelState } from './model';
import { InputBlock } from '@/components';
import styles from './style.less';
import { ReactComponent as NewAccount } from '@/assets/img/new_account.svg';

import { UserModelState } from '@/models/user';
import { showHiddenAddress } from '@/utils/blockchain';
import { ConnectState, DispatchProps } from '@/models/connect';

const { Text, Title } = Typography;
const { Option } = Select;

interface LoginProps extends DispatchProps {
  login: LoginModelState;
  user: UserModelState;
  submitting: boolean;
  location: Location;
}

interface LoginState {
  autoLogin: boolean;
  password: string;
  user?: string;
}

@connect(({ login, loading, user }: ConnectState) => ({
  login,
  user,
  submitting: loading.effects['login/login'],
}))
export default class Login extends Component<LoginProps, LoginState> {
  state: LoginState = {
    autoLogin: true,
    password: '',
  };

  componentDidMount(): void {
    this.props.dispatch({ type: 'user/fetch' });
  }

  signup = () => {
    router.push('/user/signup');
  };
  login = () => {
    const {
      user: { userList },
    } = this.props;
    const { password, user } = this.state;
    let username = user;
    if (!user) {
      username = userList[0].username;
    }
    this.props.dispatch({
      type: 'login/login',
      payload: { username, password },
    });
  };
  chooseUser = (user: string) => {
    this.setState({ user });
  };

  render() {
    const { password } = this.state;
    const {
      login,
      user: { userList },
    } = this.props;

    const { status } = login;
    let isNew = userList ? userList.length === 0 : true;

    return (
      <div className={styles.container}>
        {isNew ? (
          <>
            <NewAccount className={styles.img} />
            <div>
              <Text type={'secondary'}>
                {formatMessage({ id: 'user-login.login.none-account' })}
              </Text>
            </div>
            <Button className={styles.newBtn} type={'primary'} onClick={this.signup}>
              {formatMessage({ id: 'user-login.login.create-account' })}
            </Button>
          </>
        ) : (
          <>
            <Title level={2} style={{ marginBottom: 0 }}>
              {formatMessage({ id: `user-login.login.title` })}
            </Title>
            <Text type={'secondary'} className={styles.description}>
              <FormattedMessage
                id={'user-login.login.title.description'}
                values={{
                  create: (
                    <Link to={'/user/signup'}>
                      {formatMessage({ id: 'user-login.login.title.description.create' })}
                    </Link>
                  ),
                }}
              />
            </Text>
            <Divider dashed className={styles.divider} />
            <Select
              defaultValue={userList[0].username}
              size={'large'}
              onChange={this.chooseUser}
              className={styles.account}
            >
              {userList.map(user => {
                const { address, username, avatar } = user;

                return (
                  <Option value={username} key={address}>
                    <div className={styles.option}>
                      <Avatar src={avatar} className={styles.avatar} />

                      <div className={styles.text}>
                        <div>{username}</div>
                        <Text type={'secondary'} style={{ fontSize: 12 }}>
                          {showHiddenAddress(address, 8)}
                        </Text>
                      </div>
                    </div>
                  </Option>
                );
              })}
            </Select>
            <InputBlock
              label={'user-login.login.input.password'}
              onChange={e => this.setState({ password: e.target.value })}
              type={'password'}
              onPressEnter={this.login}
              error={status === 'error'}
              errorMsg={'user-login.login.input.password.errorMsg'}
              value={password}
            />
            <Button
              type={'primary'}
              size={'large'}
              className={styles.button}
              block
              onClick={this.login}
            >
              {formatMessage({ id: 'user-login.login.login' })}
            </Button>
          </>
        )}
        <div style={{ marginTop: 16 }}>
          <Text type={'secondary'}>
            <FormattedMessage
              id={'user-login.login.restore'}
              values={{
                restore: (
                  <Link to={'/user/restore'}>
                    {formatMessage({ id: 'user-login.login.restore.restore' })}
                  </Link>
                ),
              }}
            />
          </Text>
        </div>
      </div>
    );
  }
}
