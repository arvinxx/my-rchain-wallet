import React, { Component } from 'react';
import { Button, Select, Divider, Typography, Avatar } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Identicon from 'identicon.js';

import Link from 'umi/link';
import { router } from 'umi';
import { connect } from 'dva';
import { StateType } from './model';
import { InputBlock } from '@/components';
import styles from './style.less';
import { ReactComponent as NewAccount } from '@/assets/img/new_account.svg';

import { Dispatch } from 'redux';
import { UserModelState } from '@/models/user';
import { getDecryptedItem, getItem, setItem } from '@/utils/utils';
import { IAccount } from '@/services/account';

const { Text, Title } = Typography;
const { Option } = Select;

interface LoginProps {
  dispatch: Dispatch<any>;
  userLogin: StateType;
  submitting: boolean;
  location: Location;
}

interface LoginState {
  type: string;
  autoLogin: boolean;
  password: string;
  user?: string;
  error: boolean;
}

export interface FormDataType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

@connect(
  ({
    userLogin,
    loading,
    user,
  }: {
    userLogin: StateType;
    user: UserModelState;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userLogin,
    user,
    submitting: loading.effects['userLogin/login'],
  }),
)
export default class Login extends Component<LoginProps, LoginState> {
  state: LoginState = {
    type: 'account',
    autoLogin: true,
    password: '',
    error: false,
  };

  componentDidMount(): void {
    const userList = getDecryptedItem('userList');
    if (userList) {
      this.setState({
        user: userList[0].username,
      });
    }
  }

  signup = () => {
    router.push('/user/signup');
  };
  login = () => {
    const { password, user: username } = this.state;
    const userList: IAccount[] = getDecryptedItem('userList');
    const user = userList.find(user => user.username === username);
    if (user && user.pwd === password) {
      setItem('currentUser', username);

      const { query } = this.props.location;
      if (query && query.redirect) {
        window.location.href = query.redirect;
      } else {
        router.push('/');
      }
    } else {
      this.setState({
        error: true,
      });
    }
  };
  chooseUser = (user: string) => {
    this.setState({ user });
  };

  render() {
    const { password, user, error } = this.state;
    const userList: IAccount[] = getDecryptedItem('userList');

    let isNew = userList ? userList.length === 0 : true;

    // TODO: 根据 userList 解密

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
              value={user}
              size={'large'}
              onChange={this.chooseUser}
              className={styles.account}
            >
              {userList.map(user => {
                const { address, username } = user;
                const data = new Identicon(address).toString();
                const avatar = `data:image/png;base64,${data}`;

                return (
                  <Option value={username} key={address}>
                    <div className={styles.option}>
                      <Avatar src={avatar} className={styles.avatar} />

                      <div className={styles.text}>
                        <div>{username}</div>
                        <Text type={'secondary'} style={{ fontSize: 12 }}>
                          {address}
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
              error={error}
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
        )}{' '}
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
